// Nucleo MCP (JSON-RPC 2.0) sem dependencias: initialize, ping, tools/list, tools/call.
// Independente de transporte: server.mjs usa este handler tanto em HTTP quanto em stdio.

import { readFileSync } from 'node:fs';
import { createTools, serverInstructions } from './tools.mjs';

const SUPPORTED_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });

export function createMcpHandler({ style = process.env.TRAFEGO_TOOL_STYLE === 'dot' ? 'dot' : 'underscore' } = {}) {
  const tools = createTools({ style });
  const byName = new Map(tools.map((t) => [t.name, t]));
  const listed = tools.map(({ handler, ...def }) => def);

  async function handleOne(msg) {
    if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
      return msg && 'id' in msg && !('result' in msg || 'error' in msg) ? fail(msg.id, -32600, 'Invalid Request') : null;
    }
    const isNotification = !('id' in msg);
    const { id, method, params = {} } = msg;

    switch (method) {
      case 'initialize': {
        const requested = params.protocolVersion;
        return ok(id, {
          protocolVersion: SUPPORTED_VERSIONS.includes(requested) ? requested : SUPPORTED_VERSIONS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: 'trafego-agente-pago', title: 'Trafego Agente Pago', version: pkg.version },
          instructions: serverInstructions(style),
        });
      }
      case 'ping':
        return ok(id, {});
      case 'tools/list':
        return ok(id, { tools: listed });
      case 'tools/call': {
        const tool = byName.get(params.name);
        if (!tool) return fail(id, -32602, `Ferramenta desconhecida: ${params.name}`);
        try {
          return ok(id, await tool.handler(params.arguments ?? {}));
        } catch (e) {
          return ok(id, { isError: true, content: [{ type: 'text', text: `Erro na ferramenta ${params.name}: ${e.message}` }] });
        }
      }
      case 'resources/list':
        return ok(id, { resources: [] });
      case 'resources/templates/list':
        return ok(id, { resourceTemplates: [] });
      case 'prompts/list':
        return ok(id, { prompts: [] });
      default:
        return isNotification ? null : fail(id, -32601, `Metodo nao suportado: ${method}`);
    }
  }

  // Aceita mensagem unica ou lote; retorna null quando nao ha nada a responder (so notificacoes).
  async function handle(payload) {
    if (Array.isArray(payload)) {
      const out = (await Promise.all(payload.map(handleOne))).filter(Boolean);
      return out.length ? out : null;
    }
    return handleOne(payload);
  }

  return { handle, tools: listed };
}
