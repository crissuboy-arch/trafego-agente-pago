// Ferramentas MCP do Trafego Agente Pago.
// Nao contem conhecimento proprio: cada ferramenta encaminha para router -> skill -> references,
// lendo os MESMOS arquivos usados pelo plugin do Claude Code.

import { registry, route, toContext, getSkill, getReference, listReferences } from '../router/router.mjs';

const REPO_URL = 'https://github.com/crissuboy-arch/trafego-agente-pago/blob/main';
const TOOL_OVERRIDES = { optimization: 'optimize' };
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const SKILL_IDS = registry.skills.map((s) => s.id).filter((id) => id !== registry.orchestrator);

export const toolSuffix = (id) => TOOL_OVERRIDES[id] ?? id.replace(/-/g, '_');

// "underscore" (padrao, aceito por ChatGPT/OpenAI: ^[a-zA-Z0-9_-]+$) ou "dot" (traffic.route).
export function toolName(suffix, style = 'underscore') {
  return `traffic${style === 'dot' ? '.' : '_'}${suffix}`;
}

const stripFrontmatter = (text) => text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '');

function skillBody(id) {
  const s = getSkill(id);
  return s?.content ? stripFrontmatter(s.content).trim() : '';
}

function compactRoute(r, style) {
  return {
    matched: r.matched,
    flow: r.flow ? { id: r.flow.id, name: r.flow.name, deliverable: r.flow.deliverable } : null,
    platform: r.platform ?? null,
    primary: r.primary ?? null,
    skills: (r.skills ?? []).map((s) => ({
      id: s.id,
      tool: s.id === registry.orchestrator ? null : toolName(toolSuffix(s.id), style),
      role: s.role,
      goal: s.goal ?? null,
    })),
    ask: r.ask ?? [],
  };
}

function text(...parts) {
  return parts.filter(Boolean).join('\n\n---\n\n');
}

// Monta a resposta de roteamento: contexto curto + somente as skills de r.loadNow.
function routeResponse(r, style, includeContent = true) {
  const hint = `Como carregar: chame a ferramenta ${toolName('<skill>', style)} de cada etapa SOMENTE ao chegar nela (ids com "-" viram "_"; optimization = ${toolName('optimize', style)}). Nao chame todas as ferramentas.`;
  const loaded = includeContent
    ? r.loadNow.map((file) => {
        const id = file.split('/')[1];
        return `# Skill carregada: ${id}\n\n${skillBody(id)}`;
      })
    : [];
  return {
    content: [{ type: 'text', text: text(toContext(r, { loadHint: hint }), ...loaded) }],
    structuredContent: compactRoute(r, style),
  };
}

// Chamada explicita da ferramenta sem termos de trafego: cai na entrada do orquestrador.
function routeOrEntry(message) {
  const r = route(message);
  return r.matched ? r : { ...route('trafego pago'), query: message };
}

const requestProp = {
  type: 'string',
  description: 'Pedido do usuario em linguagem natural, com o contexto que ele ja deu (produto, objetivo, plataforma, orcamento, metricas).',
};

export function createTools({ style = 'underscore' } = {}) {
  const tools = [];
  const add = (suffix, def) => tools.push({ name: toolName(suffix, style), annotations: READ_ONLY, ...def });

  add('route', {
    title: 'Rotear pedido de trafego pago',
    description:
      'USE PRIMEIRO para qualquer pedido de trafego pago: campanhas, anuncios, Meta/Facebook/Instagram Ads, Google Ads, criativos, copy, publico, palavras-chave, remarketing, pixel/tracking, metricas (CTR, CPC, CPA, ROAS) ou otimizacao. Devolve o fluxo, as skills em ordem e o conteudo apenas das skills necessarias agora.',
    inputSchema: {
      type: 'object',
      properties: {
        message: requestProp,
        include_content: { type: 'boolean', description: 'Incluir o texto das skills a carregar agora (padrao true).' },
      },
      required: ['message'],
    },
    handler: ({ message, include_content = true }) => routeResponse(routeOrEntry(message), style, include_content),
  });

  add('plan_campaign', {
    title: 'Planejar campanha completa',
    description:
      'Fluxo CRIAR CAMPANHA completo (pesquisa, oferta, publico, estrategia, copy, criativos, estrutura, tracking, checklist). Com plataforma meta ou google usa o fluxo especifico da plataforma.',
    inputSchema: {
      type: 'object',
      properties: {
        request: requestProp,
        platform: { type: 'string', enum: ['meta', 'google', 'ambas'], description: 'Plataforma, se o usuario ja disse.' },
      },
      required: ['request'],
    },
    handler: ({ request = '', platform }) => {
      const hint = { meta: ' meta ads', google: ' google ads', ambas: ' meta ads e google ads' }[platform] ?? '';
      return routeResponse(route(`${request}${hint}`, { flow: 'criar-campanha' }), style);
    },
  });

  for (const id of SKILL_IDS) {
    const s = registry.skills.find((x) => x.id === id);
    const refs = listReferences(id).map((f) => f.replace(/\.md$/, ''));
    add(toolSuffix(id), {
      title: s.name,
      description: `${s.description} Quando usar: ${s.triggers.slice(0, 8).join(', ')}. Retorna as instrucoes da skill "${id}"${refs.length ? ` e, sob demanda, as referencias: ${refs.join(', ')}` : ''}.`,
      inputSchema: {
        type: 'object',
        properties: {
          request: requestProp,
          ...(refs.length && {
            references: {
              type: 'array',
              items: { type: 'string', enum: refs },
              description: 'Referencias de aprofundamento a incluir. Use so se precisar de detalhe extra.',
            },
          }),
        },
      },
      handler: ({ request, references = [] } = {}) => {
        const parts = [`# Skill: ${id} (${s.name})\n\n${skillBody(id)}`];
        for (const ref of references) {
          const r = getReference(id, ref);
          parts.push(r ? `# Referencia: ${r.file}\n\n${r.content}` : `Referencia "${ref}" nao encontrada. Disponiveis: ${refs.join(', ')}`);
        }
        let next = [];
        if (request) {
          const r = route(request);
          next = r.matched ? compactRoute(r, style).skills.filter((x) => x.id !== id && x.tool) : [];
          if (next.length) parts.push(`Outras skills relevantes para este pedido (chame so se necessario): ${next.map((x) => x.tool).join(', ')}`);
        }
        return {
          content: [{ type: 'text', text: text(...parts) }],
          structuredContent: {
            skill: id,
            references_available: refs,
            related: s.related.map((r) => toolName(toolSuffix(r), style)),
            next,
          },
        };
      },
    });
  }

  // search/fetch: formato esperado pelo ChatGPT (deep research / conectores de conhecimento).
  const addPlain = (name, def) => tools.push({ name, annotations: READ_ONLY, ...def });
  addPlain('search', {
    title: 'Buscar no conhecimento de trafego pago',
    description: 'Busca skills e referencias de trafego pago relevantes para uma consulta. Retorna ids para usar em fetch.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
    handler: ({ query = '' }) => {
      const results = searchDocs(query);
      return { content: [{ type: 'text', text: JSON.stringify({ results }) }], structuredContent: { results } };
    },
  });

  addPlain('fetch', {
    title: 'Ler skill ou referencia',
    description: 'Le o conteudo completo de um id retornado por search (ex.: "skill:meta-ads" ou "ref:meta-ads/lead-ads-meta").',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    handler: ({ id = '' }) => {
      const doc = fetchDoc(id);
      if (!doc) return { isError: true, content: [{ type: 'text', text: `Documento nao encontrado: ${id}` }] };
      return { content: [{ type: 'text', text: JSON.stringify(doc) }], structuredContent: doc };
    },
  });

  return tools;
}

function searchDocs(query) {
  const r = route(query);
  const ids = r.matched ? r.skills.map((s) => s.id) : [];
  const words = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9 -]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const results = [];
  const push = (id, title, url) => results.length < 10 && !results.some((x) => x.id === id) && results.push({ id, title, url });
  for (const id of ids) push(`skill:${id}`, registry.skills.find((s) => s.id === id).name, `${REPO_URL}/skills/${id}/SKILL.md`);
  for (const s of registry.skills) {
    const hay = `${s.id} ${s.name} ${s.description} ${s.triggers.join(' ')}`.toLowerCase();
    if (words.some((w) => hay.includes(w))) push(`skill:${s.id}`, s.name, `${REPO_URL}/${s.file}`);
    for (const f of listReferences(s.id)) {
      const base = f.replace(/\.md$/, '');
      if (words.some((w) => base.includes(w))) push(`ref:${s.id}/${base}`, `${s.name} - ${base}`, `${REPO_URL}/skills/${s.id}/references/${f}`);
    }
  }
  return results;
}

function fetchDoc(id) {
  const [kind, rest = ''] = String(id).split(':');
  if (kind === 'skill') {
    const s = getSkill(rest);
    return s?.content ? { id, title: s.name, text: s.content, url: `${REPO_URL}/${s.file}`, metadata: { type: 'skill' } } : null;
  }
  if (kind === 'ref') {
    const [skill, file] = rest.split('/');
    const r = getReference(skill, file);
    return r ? { id, title: `${skill} - ${file}`, text: r.content, url: `${REPO_URL}/skills/${skill}/${r.file}`, metadata: { type: 'reference', license: 'MIT (kursku/skills)' } } : null;
  }
  return null;
}

export const serverInstructions = (style = 'underscore') => [
  'Trafego Agente Pago: conhecimento de trafego pago (Meta Ads, Google Ads). Voce (o modelo) e a inteligencia; estas ferramentas so entregam as instrucoes certas.',
  `Para qualquer pedido de trafego pago, chame primeiro ${toolName('route', style)} com a mensagem do usuario e siga o fluxo retornado.`,
  'Carregue as demais skills uma a uma, apenas ao chegar na etapa delas. Nunca chame todas as ferramentas.',
  'Pergunte no maximo 3 coisas e so o que bloqueia; declare suposicoes. Responda em portugues do Brasil.',
  'Seguranca: nunca publicar, gastar, alterar orcamento/lances ou apagar campanhas sem confirmacao explicita do usuario. Nunca pedir ou exibir credenciais.',
].join('\n');
