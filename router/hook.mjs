#!/usr/bin/env node
// Hook UserPromptSubmit do Claude Code: roda o router em cada mensagem e, somente quando
// o pedido e de trafego pago, injeta um contexto curto dizendo quais skills carregar.
// Nunca bloqueia a mensagem: qualquer erro termina em silencio com exit 0.

import { route, toContext } from './router.mjs';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  try {
    const { prompt = '' } = JSON.parse(input || '{}');
    const context = toContext(route(prompt));
    if (context) {
      process.stdout.write(
        JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context } }),
      );
    }
  } catch {
    // silencioso de proposito
  }
  process.exit(0);
});
