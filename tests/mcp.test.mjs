import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createMcpHandler } from '../mcp/protocol.mjs';
import { startHttpServer } from '../mcp/server.mjs';
import { registry } from '../router/router.mjs';

const REQUIRED = [
  'route', 'plan_campaign', 'meta_ads', 'google_ads', 'market_research', 'competitor_research', 'audience', 'offer',
  'ad_copy', 'creative_strategy', 'landing_page', 'funnel', 'cro', 'keywords', 'tracking', 'analytics', 'optimize', 'remarketing',
];

const mcp = createMcpHandler();
let nextId = 1;
const rpc = async (method, params) => (await mcp.handle({ jsonrpc: '2.0', id: nextId++, method, params })).result;
const call = (name, args) => rpc('tools/call', { name, arguments: args });

test('initialize negocia versao e envia instrucoes de roteamento', async () => {
  const r = await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 't', version: '1' } });
  assert.equal(r.protocolVersion, '2025-03-26');
  assert.ok(r.capabilities.tools);
  assert.match(r.instructions, /traffic_route/);
  assert.match(r.instructions, /confirmacao explicita/);
  assert.equal((await rpc('initialize', { protocolVersion: '1999-01-01' })).protocolVersion, '2025-06-18');
});

test('tools/list expoe todas as ferramentas exigidas, somente leitura e com nomes validos para o ChatGPT', async () => {
  const { tools } = await rpc('tools/list');
  const names = tools.map((t) => t.name);
  for (const s of REQUIRED) assert.ok(names.includes(`traffic_${s}`), `falta traffic_${s}`);
  assert.ok(names.includes('search') && names.includes('fetch'));
  for (const t of tools) {
    assert.match(t.name, /^[a-zA-Z0-9_-]{1,64}$/);
    assert.equal(t.annotations.readOnlyHint, true);
    assert.equal(t.inputSchema.type, 'object');
    assert.ok(t.description.length > 20 && !('handler' in t));
  }
});

test('uma ferramenta por skill especializada, sem conteudo proprio (le as mesmas SKILL.md)', async () => {
  const specialized = registry.skills.filter((s) => s.id !== registry.orchestrator);
  for (const s of specialized) {
    const tool = `traffic_${s.id === 'optimization' ? 'optimize' : s.id.replace(/-/g, '_')}`;
    const r = await call(tool, {});
    assert.equal(r.structuredContent.skill, s.id);
    assert.doesNotMatch(r.content[0].text, /^---\r?\nname:/, 'frontmatter removido para economizar tokens');
  }
});

test('traffic_route reproduz o roteamento do Claude e carrega so o necessario', async () => {
  const cases = [
    ['tráfego pago', 'trafego-pago', ['trafego-pago']],
    ['crie uma campanha Meta Ads', 'trafego-pago', ['campaign-strategy', 'meta-ads', 'audience', 'offer', 'ad-copy', 'creative-strategy']],
    ['quero anunciar no Google', 'trafego-pago', ['google-ads', 'keywords', 'campaign-strategy']],
    ['me dê palavras-chave para Google Ads', 'keywords', ['keywords', 'google-ads']],
    ['analise minha campanha', 'trafego-pago', ['analytics', 'optimization']],
    ['me faça 5 anúncios', 'trafego-pago', ['ad-copy', 'creative-strategy']],
    ['melhore minha landing page', 'landing-page', ['landing-page', 'cro']],
    ['crie remarketing', 'remarketing', ['remarketing', 'audience', 'ad-copy']],
  ];
  for (const [message, primary, must] of cases) {
    const r = await call('traffic_route', { message });
    const ids = r.structuredContent.skills.map((s) => s.id);
    assert.equal(r.structuredContent.primary, primary, message);
    assert.ok(must.every((m) => ids.includes(m)), `${message}: ${ids}`);
    const loaded = [...r.content[0].text.matchAll(/# Skill carregada: ([\w-]+)/g)].map((m) => m[1]);
    assert.ok(loaded.length >= 1 && loaded.length <= 2, `${message}: carregou ${loaded}`);
    assert.ok(r.content[0].text.length < 15000, `${message}: resposta grande demais`);
  }
});

test('traffic_route sem termos de trafego cai na entrada do orquestrador', async () => {
  const r = await call('traffic_route', { message: 'oi' });
  assert.equal(r.structuredContent.primary, 'trafego-pago');
  assert.ok(r.structuredContent.ask.length > 0);
});

test('traffic_plan_campaign usa o fluxo da plataforma', async () => {
  assert.equal((await call('traffic_plan_campaign', { request: 'loja de roupas', platform: 'meta' })).structuredContent.flow.id, 'meta-ads');
  assert.equal((await call('traffic_plan_campaign', { request: 'clinica', platform: 'google' })).structuredContent.flow.id, 'google-ads');
  assert.equal((await call('traffic_plan_campaign', { request: 'curso online' })).structuredContent.flow.id, 'criar-campanha');
});

test('skill tool entrega referencias sob demanda e sugere proximas skills', async () => {
  const base = await call('traffic_meta_ads', { request: 'campanha no instagram para vender curso' });
  assert.doesNotMatch(base.content[0].text, /# Referencia:/);
  assert.ok(base.structuredContent.references_available.includes('lead-ads-meta'));
  assert.ok(base.structuredContent.next.some((n) => n.tool === 'traffic_audience'));
  const withRef = await call('traffic_meta_ads', { references: ['lead-ads-meta', '../../package'] });
  assert.match(withRef.content[0].text, /# Referencia: references\/lead-ads-meta\.md/);
  assert.match(withRef.content[0].text, /nao encontrada/);
});

test('search e fetch (formato ChatGPT)', async () => {
  const s = await call('search', { query: 'lookalike de compradores' });
  const { results } = JSON.parse(s.content[0].text);
  assert.ok(results.some((r) => r.id === 'skill:audience'));
  const f = await call('fetch', { id: 'skill:audience' });
  assert.match(JSON.parse(f.content[0].text).text, /name: audience/);
  const ref = await call('fetch', { id: 'ref:meta-ads/lead-ads-meta' });
  assert.equal(JSON.parse(ref.content[0].text).metadata.type, 'reference');
  assert.equal((await call('fetch', { id: 'ref:meta-ads/../../package' })).isError, true);
});

test('erros de protocolo', async () => {
  assert.equal((await mcp.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'nao_existe' } })).error.code, -32602);
  assert.equal((await mcp.handle({ jsonrpc: '2.0', id: 2, method: 'metodo/x' })).error.code, -32601);
  assert.equal(await mcp.handle({ jsonrpc: '2.0', method: 'notifications/initialized' }), null);
  const batch = await mcp.handle([{ jsonrpc: '2.0', id: 3, method: 'ping' }, { jsonrpc: '2.0', method: 'notifications/initialized' }]);
  assert.equal(batch.length, 1);
});

test('estilo de nome com ponto (traffic.route) disponivel por configuracao', async () => {
  const dot = createMcpHandler({ style: 'dot' });
  const { result } = await dot.handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  assert.ok(result.tools.some((t) => t.name === 'traffic.route'));
  assert.ok(result.tools.some((t) => t.name === 'traffic.optimize'));
});

test('transporte HTTP (Streamable HTTP, usado pelo ChatGPT)', async () => {
  const server = await startHttpServer({ port: 0, host: '127.0.0.1' });
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body) =>
    fetch(`${base}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
      body: JSON.stringify(body),
    });
  try {
    const init = await post({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {} } });
    assert.equal(init.status, 200);
    assert.equal((await init.json()).result.serverInfo.name, 'trafego-agente-pago');
    assert.equal((await post({ jsonrpc: '2.0', method: 'notifications/initialized' })).status, 202);
    const call = await post({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'traffic_route', arguments: { message: 'quero anunciar no Google' } } });
    assert.equal((await call.json()).result.structuredContent.flow.id, 'google-ads');
    assert.equal((await fetch(`${base}/mcp`)).status, 405);
    assert.equal((await fetch(`${base}/health`)).status, 200);
    const bad = await fetch(`${base}/mcp`, { method: 'POST', body: '{nao json' });
    assert.equal(bad.status, 400);
  } finally {
    server.close();
  }
});

test('transporte stdio', async () => {
  const child = spawn(process.execPath, [fileURLToPath(new URL('../mcp/server.mjs', import.meta.url)), '--stdio']);
  const lines = [];
  const done = new Promise((resolve) => {
    let buf = '';
    child.stdout.on('data', (c) => {
      buf += c;
      const parts = buf.split('\n');
      buf = parts.pop();
      lines.push(...parts.filter(Boolean).map((l) => JSON.parse(l)));
      if (lines.length >= 2) resolve();
    });
  });
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } })}\n`);
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' })}\n`);
  await done;
  child.kill();
  assert.equal(lines[0].id, 1);
  assert.ok(lines[1].result.tools.length >= 20);
});
