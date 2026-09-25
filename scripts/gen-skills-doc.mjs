#!/usr/bin/env node
// Gera docs/SKILLS.md a partir do registro, dos fluxos e das ferramentas MCP (fonte unica).

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, registry, intents, listReferences } from '../router/router.mjs';
import { toolName, toolSuffix } from '../mcp/tools.mjs';

let md = '# Skills\n\nGerado por `npm run docs` a partir de `router/skill-registry.json`, `router/intents.json` e `mcp/tools.mjs`. ';
md += 'Triggers aparecem normalizados (sem acento); o usuário pode escrever com acento.\n\n';
md += 'As mesmas skills atendem os dois hosts: no Claude Code como `trafego-agente-pago:<id>`, no ChatGPT/MCP pela ferramenta indicada.\n\n';
md += '## Fluxos\n\n| Fluxo | Etapas (skills) | Entrega |\n|---|---|---|\n';
for (const f of intents.flows) {
  const steps = f.steps.map((s) => (s.skill === '@platform' ? 'meta-ads/google-ads' : s.skill) + (s.optional ? ' (condicional)' : ''));
  md += `| ${f.name} (\`${f.id}\`) | ${steps.join(' → ')} | ${f.deliverable} |\n`;
}
md += '\n## Skills\n';
for (const s of registry.skills) {
  const refs = listReferences(s.id);
  const tool = s.id === registry.orchestrator ? `${toolName('route')} / ${toolName('plan_campaign')}` : toolName(toolSuffix(s.id));
  md += `\n### \`${s.id}\` — ${s.name}\n\n${s.description}\n\n`;
  md += `- **Ferramenta MCP (ChatGPT):** \`${tool}\`\n`;
  md += `- **Plataforma:** ${s.platform.join(', ')}\n- **Intenções:** ${s.intents.join(', ')}\n- **Triggers fortes:** ${s.triggers.join(', ')}\n`;
  if (s.weakTriggers?.length) md += `- **Triggers fracos:** ${s.weakTriggers.join(', ')}\n`;
  md += `- **Entradas esperadas:** ${s.inputs.join('; ')}\n- **Arquivo:** [\`${s.file}\`](../${s.file})\n- **Relacionadas:** ${s.related.join(', ')}\n`;
  if (refs.length) md += `- **Referências:** ${refs.map((r) => `\`${r}\``).join(', ')}\n`;
}
writeFileSync(join(ROOT, 'docs', 'SKILLS.md'), md);
console.log('docs/SKILLS.md atualizado');
