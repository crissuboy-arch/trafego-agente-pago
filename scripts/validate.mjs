#!/usr/bin/env node
// Valida a estrutura do plugin: manifestos, registro <-> arquivos, frontmatter das skills
// e comandos, referencias citadas e ausencia de segredos obvios. Sai com codigo 1 se houver erro.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, registry, intents } from '../router/router.mjs';

const errors = [];
const err = (msg) => errors.push(msg);
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function frontmatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return err(`${file}: sem frontmatter`), {};
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, value] = kv;
    if (/^".*"$/.test(value)) value = value.slice(1, -1);
    else if (/: |\s#|^[[{*&!|>'%@`]/.test(value)) err(`${file}: valor de "${key}" precisa de aspas (YAML invalido)`);
    data[key] = value;
  }
  return data;
}

// Manifestos
for (const f of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'hooks/hooks.json', 'package.json']) {
  try {
    JSON.parse(read(f));
  } catch (e) {
    err(`${f}: JSON invalido (${e.message})`);
  }
}
const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
if (!/^[a-z0-9-]+$/.test(plugin.name)) err('plugin.json: name deve ser kebab-case');

// Registro <-> skills
const ids = new Set();
const skillDirs = readdirSync(join(ROOT, 'skills')).filter((d) => statSync(join(ROOT, 'skills', d)).isDirectory());
for (const s of registry.skills) {
  if (ids.has(s.id)) err(`registro: id duplicado ${s.id}`);
  ids.add(s.id);
  for (const k of ['id', 'name', 'description', 'intents', 'triggers', 'platform', 'inputs', 'file', 'related']) {
    if (s[k] === undefined) err(`registro: ${s.id} sem campo ${k}`);
  }
  if (!existsSync(join(ROOT, s.file))) {
    err(`registro: ${s.id} aponta para arquivo inexistente ${s.file}`);
    continue;
  }
  const text = read(s.file);
  const fm = frontmatter(text, s.file);
  if (fm.name !== s.id) err(`${s.file}: name "${fm.name}" diferente do id "${s.id}"`);
  if (!fm.description || fm.description.length > 1024) err(`${s.file}: description ausente ou > 1024 caracteres`);
  for (const t of [...s.triggers, ...(s.weakTriggers ?? [])]) {
    if (t !== t.toLowerCase() || /[̀-ͯ]/.test(t.normalize('NFD'))) err(`registro: trigger "${t}" deve estar minusculo e sem acento`);
  }
  for (const r of s.related) if (!registry.skills.some((x) => x.id === r)) err(`registro: ${s.id} related desconhecido ${r}`);
  for (const ref of text.matchAll(/`(references\/[^`]+\.md)`/g)) {
    if (!existsSync(join(ROOT, 'skills', s.id, ref[1]))) err(`${s.file}: referencia inexistente ${ref[1]}`);
  }
}
for (const d of skillDirs) if (!ids.has(d)) err(`skills/${d} existe mas nao esta no registro`);
if (!ids.has(registry.orchestrator)) err('registro: orquestrador inexistente');

// Fluxos
for (const f of intents.flows) {
  for (const step of f.steps) if (step.skill !== '@platform' && !ids.has(step.skill)) err(`fluxo ${f.id}: skill desconhecida ${step.skill}`);
  for (const t of f.triggers) {
    try {
      new RegExp(t);
    } catch {
      err(`fluxo ${f.id}: regex invalida ${t}`);
    }
  }
}

// Comandos
for (const c of readdirSync(join(ROOT, 'commands'))) {
  const fm = frontmatter(read(`commands/${c}`), `commands/${c}`);
  if (!fm.description) err(`commands/${c}: sem description`);
  if (ids.has(c.replace(/\.md$/, ''))) err(`commands/${c}: nome colide com skill`);
}

// MCP (ChatGPT e outros): uma ferramenta por skill especializada, nomes validos, sem mudar o plugin do Claude
const { createTools } = await import('../mcp/tools.mjs');
const toolNames = new Set(createTools().map((t) => t.name));
for (const s of registry.skills) {
  if (s.id === registry.orchestrator) continue;
  const name = `traffic_${s.id === 'optimization' ? 'optimize' : s.id.replace(/-/g, '_')}`;
  if (!toolNames.has(name)) err(`mcp: skill ${s.id} sem ferramenta ${name}`);
}
for (const n of toolNames) if (!/^[a-zA-Z0-9_-]{1,64}$/.test(n)) err(`mcp: nome de ferramenta invalido para ChatGPT: ${n}`);
if (existsSync(join(ROOT, '.mcp.json')) || plugin.mcpServers) {
  err('.mcp.json/mcpServers no plugin faria o Claude Code iniciar o servidor MCP; mantenha o MCP separado do plugin');
}

// Segredos obvios em arquivos versionaveis
const secretRe = /(EAA[A-Za-z0-9]{30,}|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20,}|ya29\.[0-9A-Za-z_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    // .env local e ignorado pelo .gitignore; aqui so importam arquivos versionaveis.
    if (['.git', 'node_modules', '.env'].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (secretRe.test(readFileSync(p, 'utf8'))) err(`possivel segredo em ${relative(ROOT, p)}`);
  }
}
walk(ROOT);

if (errors.length) {
  console.error(`Validacao falhou (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `OK: ${registry.skills.length} skills, ${intents.flows.length} fluxos, ${readdirSync(join(ROOT, 'commands')).length} comandos, ${toolNames.size} ferramentas MCP validados.`,
);
