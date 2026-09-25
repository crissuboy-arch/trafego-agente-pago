import { test } from 'node:test';
import assert from 'node:assert/strict';
import { route, toContext, normalize, getSkill, listSkills } from '../router/router.mjs';

const ids = (r) => r.skills.map((s) => s.id);
const required = (r) => r.skills.filter((s) => s.role !== 'optional').map((s) => s.id);
const includesAll = (list, expected) => expected.every((e) => list.includes(e));

const cases = [
  {
    q: 'tráfego pago',
    flow: 'entrada',
    primary: 'trafego-pago',
    must: ['trafego-pago'],
    check: (r) => assert.ok(r.ask.length > 0, 'entrada deve sugerir perguntas minimas'),
  },
  {
    q: 'crie uma campanha Meta Ads para meu produto',
    flow: 'meta-ads',
    platform: 'meta',
    must: ['campaign-strategy', 'audience', 'offer', 'ad-copy', 'creative-strategy', 'meta-ads', 'tracking'],
    mustNot: ['google-ads', 'keywords'],
  },
  {
    q: 'quero anunciar no Google',
    flow: 'google-ads',
    platform: 'google',
    must: ['keywords', 'google-ads', 'ad-copy', 'landing-page', 'tracking'],
    mustNot: ['meta-ads'],
  },
  {
    q: 'analise meu CTR CPC CPA e ROAS',
    flow: 'analisar-campanha',
    must: ['analytics', 'optimization'],
    first: 'analytics',
  },
  {
    q: 'crie 5 anúncios para Facebook',
    flow: 'criar-anuncio',
    platform: 'meta',
    must: ['offer', 'creative-strategy', 'ad-copy', 'meta-ads'],
    mustNot: ['google-ads'],
  },
  {
    q: 'me dê palavras-chave para Google Ads',
    flow: null,
    platform: 'google',
    primary: 'keywords',
    must: ['keywords', 'google-ads'],
    mustNot: ['meta-ads', 'creative-strategy'],
  },
  {
    q: 'meu anúncio não está vendendo',
    flow: 'analisar-campanha',
    must: ['analytics', 'optimization'],
    check: (r) => {
      const optional = r.skills.filter((s) => s.role === 'optional').map((s) => s.id);
      assert.ok(includesAll(optional, ['creative-strategy', 'landing-page', 'offer', 'tracking']), 'gargalos condicionais');
    },
  },
  {
    q: 'quero testar novos criativos',
    flow: 'testar-criativos',
    must: ['creative-strategy', 'optimization'],
    first: 'creative-strategy',
  },
];

for (const c of cases) {
  test(`roteia: "${c.q}"`, () => {
    const r = route(c.q);
    assert.equal(r.matched, true);
    assert.equal(r.flow?.id ?? null, c.flow);
    if (c.platform !== undefined) assert.equal(r.platform, c.platform);
    if (c.primary) assert.equal(r.primary, c.primary);
    assert.ok(includesAll(ids(r), c.must), `esperado ${c.must} em ${ids(r)}`);
    for (const n of c.mustNot ?? []) assert.ok(!ids(r).includes(n), `${n} nao deveria estar em ${ids(r)}`);
    if (c.first) assert.equal(required(r)[0], c.first);
    assert.ok(r.loadNow.length >= 1 && r.loadNow.length <= 3, 'progressive disclosure: carrega poucas skills de inicio');
    c.check?.(r);
  });
}

test('variacoes de escrita e outros pedidos de trafego', () => {
  assert.equal(route('TRAFEGO PAGO').flow.id, 'entrada');
  assert.equal(route('quero montar uma campanha no instagram').flow.id, 'meta-ads');
  assert.equal(route('criar campanha').flow.id, 'criar-campanha');
  assert.ok(route('criar campanha').ask.some((q) => /plataforma/i.test(q)), 'sem plataforma pergunta qual');
  assert.equal(route('crie uma campanha no facebook e no google').platform, 'multi');
  assert.ok(includesAll(ids(route('crie uma campanha no facebook e no google')), ['meta-ads', 'google-ads']));
  assert.equal(route('meu pixel não está registrando compras').primary, 'tracking');
  assert.equal(route('monte um público lookalike de compradores').primary, 'audience');
  assert.equal(route('quero fazer remarketing para quem abandonou o carrinho').primary, 'remarketing');
  assert.equal(route('meu CPA está caro no Google Ads').flow.id, 'analisar-campanha');
  assert.equal(route('escreva headlines para minha landing page').primary, 'ad-copy');
});

// Exemplos de roteamento exigidos para paridade Claude Code / ChatGPT.
const parity = [
  ['crie uma campanha Meta Ads', ['campaign-strategy', 'meta-ads', 'audience', 'offer', 'ad-copy', 'creative-strategy']],
  ['quero anunciar no Google', ['google-ads', 'keywords', 'campaign-strategy']],
  ['analise minha campanha', ['analytics', 'optimization']],
  ['me faça 5 anúncios', ['ad-copy', 'creative-strategy']],
  ['melhore minha landing page', ['landing-page', 'cro'], 'landing-page'],
  ['crie remarketing', ['remarketing', 'audience', 'ad-copy'], 'remarketing'],
];
for (const [q, must, primary] of parity) {
  test(`paridade: "${q}"`, () => {
    const r = route(q);
    assert.ok(includesAll(required(r), must), `esperado ${must} em ${required(r)}`);
    if (primary) {
      assert.equal(r.primary, primary);
      assert.deepEqual(r.loadNow, [`skills/${primary}/SKILL.md`]);
    }
  });
}

test('fluxo forcado (usado pelo MCP plan_campaign) ignora a porteira de dominio', () => {
  const r = route('minha loja de roupas', { flow: 'criar-campanha' });
  assert.equal(r.flow.id, 'criar-campanha');
  assert.equal(route('minha loja de roupas no instagram', { flow: 'criar-campanha' }).flow.id, 'meta-ads');
});

test('nao dispara fora do dominio', () => {
  for (const q of ['corrija o bug no parser', 'analise este código', 'qual a previsão do tempo?', '', 'faça um resumo do livro']) {
    assert.equal(route(q).matched, false, q);
    assert.equal(toContext(route(q)), '');
  }
});

test('contexto do hook e curto e contem regras de seguranca', () => {
  const ctx = toContext(route('crie uma campanha Meta Ads para meu produto'));
  assert.match(ctx, /Trafego Agente Pago/);
  assert.match(ctx, /confirmacao explicita/);
  assert.ok(ctx.split('\n').length < 25);
});

test('normalize remove acentos e caixa', () => {
  assert.equal(normalize('  TRÁFEGO   Pago '), 'trafego pago');
});

test('getSkill e listSkills (base para futura exposicao via MCP)', () => {
  assert.equal(listSkills().length, 18);
  const s = getSkill('meta-ads');
  assert.match(s.content, /^---\r?\nname: meta-ads/);
  assert.equal(getSkill('inexistente'), null);
});
