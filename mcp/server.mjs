#!/usr/bin/env node
// Servidor MCP do Trafego Agente Pago.
//   HTTP (Streamable HTTP, usado pelo ChatGPT):  node mcp/server.mjs            -> http://127.0.0.1:8787/mcp
//   stdio (Codex, Claude Desktop, outros):       node mcp/server.mjs --stdio
// Variaveis: PORT, HOST, TRAFEGO_MCP_PATH (padrao /mcp), TRAFEGO_TOOL_STYLE (underscore|dot).
// Somente leitura: as ferramentas devolvem instrucoes das skills; nada e publicado ou gasto.

import { createServer } from 'node:http';
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createMcpHandler } from './protocol.mjs';

const MAX_BODY = 1024 * 1024;

export function startHttpServer({ port = Number(process.env.PORT ?? 8787), host = process.env.HOST ?? '127.0.0.1', path = process.env.TRAFEGO_MCP_PATH ?? '/mcp', style } = {}) {
  const mcp = createMcpHandler({ style });
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version',
  };
  const send = (res, status, body, headers = {}) => {
    res.writeHead(status, { ...cors, ...(body !== undefined && { 'Content-Type': 'application/json' }), ...headers });
    res.end(body === undefined ? undefined : JSON.stringify(body));
  };

  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'OPTIONS') return send(res, 204);
    if (url.pathname === '/health') return send(res, 200, { ok: true, name: 'trafego-agente-pago', tools: mcp.tools.length });
    if (url.pathname !== path) return send(res, 404, { error: `Use ${path}` });
    // Sem stream servidor->cliente: este servidor so responde a POST (permitido pela especificacao).
    if (req.method !== 'POST') return send(res, 405, { error: 'Method Not Allowed' }, { Allow: 'POST, OPTIONS' });

    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) req.destroy();
      else chunks.push(c);
    });
    req.on('end', async () => {
      let payload;
      try {
        payload = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return send(res, 400, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
      }
      const reply = await mcp.handle(payload);
      return reply ? send(res, 200, reply) : send(res, 202);
    });
  });

  return new Promise((resolveStart) => {
    server.listen(port, host, () => resolveStart(server));
  });
}

export function startStdioServer({ style, input = process.stdin, output = process.stdout } = {}) {
  const mcp = createMcpHandler({ style });
  const rl = createInterface({ input, crlfDelay: Infinity });
  rl.on('line', async (line) => {
    if (!line.trim()) return;
    let reply;
    try {
      reply = await mcp.handle(JSON.parse(line));
    } catch {
      reply = { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } };
    }
    if (reply) output.write(`${JSON.stringify(reply)}\n`);
  });
  return rl;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.includes('--stdio')) {
    startStdioServer();
  } else {
    const server = await startHttpServer();
    const { address, port } = server.address();
    const path = process.env.TRAFEGO_MCP_PATH ?? '/mcp';
    console.error(`Trafego Agente Pago MCP em http://${address}:${port}${path} (health: /health). Ctrl+C para parar.`);
  }
}
