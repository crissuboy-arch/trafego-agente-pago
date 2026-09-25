import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const hook = fileURLToPath(new URL('../router/hook.mjs', import.meta.url));
const run = (input) => spawnSync(process.execPath, [hook], { input, encoding: 'utf8' });

test('hook injeta contexto para pedido de trafego', () => {
  const r = run(JSON.stringify({ prompt: 'quero anunciar no Google', hook_event_name: 'UserPromptSubmit' }));
  assert.equal(r.status, 0);
  const out = JSON.parse(r.stdout);
  assert.equal(out.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
  assert.match(out.hookSpecificOutput.additionalContext, /keywords/);
});

test('hook fica em silencio fora do dominio', () => {
  const r = run(JSON.stringify({ prompt: 'refatore esta funcao' }));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});

test('hook nunca quebra com entrada invalida', () => {
  const r = run('isto nao e json');
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});
