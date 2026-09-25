#!/usr/bin/env node
// Router leve e deterministico do Trafego Agente Pago.
// Nao usa LLM: apenas normaliza o texto, pontua triggers do registro e escolhe um fluxo.
// O host (Claude, ChatGPT, etc.) continua sendo a inteligencia; o router so aponta
// quais skills carregar e em que ordem (progressive disclosure).

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROUTER_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(ROUTER_DIR, '..');

const STRONG = 3;
const WEAK = 1;

const registry = JSON.parse(readFileSync(join(ROUTER_DIR, 'skill-registry.json'), 'utf8'));
const intents = JSON.parse(readFileSync(join(ROUTER_DIR, 'intents.json'), 'utf8'));
const byId = new Map(registry.skills.map((s) => [s.id, s]));
const PLATFORM_SKILLS = new Set(Object.values(intents.flows.find((f) => f.platformFlows)?.platformFlows ?? {}));

export function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const triggerCache = new Map();
function triggerRe(trigger) {
  if (!triggerCache.has(trigger)) {
    triggerCache.set(trigger, new RegExp(`(?<![a-z0-9])${escapeRe(trigger)}(?:s|es)?(?![a-z0-9])`));
  }
  return triggerCache.get(trigger);
}
const anyMatch = (patterns, text) => patterns.some((p) => new RegExp(p).test(text));

function scoreSkills(text) {
  const scores = [];
  for (const skill of registry.skills) {
    const strong = skill.triggers.filter((t) => triggerRe(t).test(text));
    const weak = (skill.weakTriggers ?? []).filter((t) => triggerRe(t).test(text));
    const score = strong.length * STRONG + weak.length * WEAK;
    if (score > 0) scores.push({ id: skill.id, score, strong: strong.length > 0, matched: [...strong, ...weak] });
  }
  return scores.sort((a, b) => b.score - a.score);
}

function detectPlatform(text) {
  const found = Object.entries(intents.platforms)
    .filter(([, patterns]) => anyMatch(patterns, text))
    .map(([name]) => name);
  if (found.length > 1) return 'multi';
  return found[0] ?? null;
}

function platformSkills(platform) {
  const map = intents.flows.find((f) => f.platformFlows)?.platformFlows ?? {};
  if (platform === 'multi') return Object.values(map);
  return map[platform] ? [map[platform]] : [];
}

function pickFlow(text, platform, scores) {
  const hits = intents.flows
    .filter((f) => f.triggers.length && anyMatch(f.triggers, text))
    .sort((a, b) => b.priority - a.priority);
  let flow = hits[0] ?? null;
  const also = hits.slice(1).map((f) => f.id);
  let via = null;

  // Sem fluxo explicito, mas com plataforma e sem skill especifica forte: trata como "montar campanha na plataforma".
  const specificStrong = scores.some((s) => s.strong && s.id !== registry.orchestrator && !PLATFORM_SKILLS.has(s.id));
  if (!flow && platform && platform !== 'multi' && !specificStrong) {
    flow = intents.flows.find((f) => f.id === 'criar-campanha');
    via = 'plataforma';
  }
  // "Criar campanha" com uma unica plataforma vira o fluxo especifico da plataforma.
  if (flow?.platformFlows && platform && flow.platformFlows[platform]) {
    via = flow.id;
    flow = intents.flows.find((f) => f.id === flow.platformFlows[platform]);
  }
  return { flow, via, also };
}

function skillEntry(id, extra) {
  const s = byId.get(id);
  return { id, name: s.name, file: s.file, ...extra };
}

export function route(message) {
  const normalized = normalize(message);
  const empty = { matched: false, query: message, normalized, skills: [] };
  if (!normalized) return empty;

  const scores = scoreSkills(normalized);
  // Porteira de dominio: sem ancora de trafego pago, nao roteia (evita disparar em conversas de codigo).
  if (!anyMatch(intents.anchors, normalized)) return empty;

  const platform = detectPlatform(normalized);
  const { flow, via, also } = pickFlow(normalized, platform, scores);
  const scoreOf = new Map(scores.map((s) => [s.id, s]));
  const skills = [];
  const seen = new Set();
  const push = (id, extra) => {
    if (seen.has(id) || !byId.has(id)) return;
    seen.add(id);
    const sc = scoreOf.get(id);
    skills.push(skillEntry(id, { score: sc?.score ?? 0, matched: sc?.matched ?? [], ...extra }));
  };

  if (flow) {
    for (const step of flow.steps) {
      if (step.skill === '@platform') {
        for (const p of platformSkills(platform)) push(p, { role: 'step', goal: step.goal });
      } else {
        push(step.skill, { role: step.optional ? 'optional' : 'step', goal: step.goal });
      }
    }
  }
  for (const s of scores) {
    if (s.id === registry.orchestrator) continue;
    if (flow ? s.strong : true) push(s.id, { role: 'direct' });
  }
  for (const p of platformSkills(platform)) push(p, { role: 'platform' });

  const direct = scores.filter((s) => s.id !== registry.orchestrator);
  const isEntry = !flow && (direct.length === 0 || !direct.some((s) => s.strong || s.score >= 2));

  let primary;
  if (isEntry) {
    primary = registry.orchestrator;
  } else if (flow) {
    primary = registry.orchestrator;
  } else {
    // Skill especifica com sinal forte vence a skill de plataforma ("keywords para Google Ads" -> keywords).
    const specific = (s) => (s.strong && !PLATFORM_SKILLS.has(s.id) ? 1 : 0);
    const ranked = [...direct].sort((a, b) => specific(b) - specific(a) || b.score - a.score);
    primary = ranked[0].id;
    skills.sort((a, b) => (a.id === primary ? -1 : b.id === primary ? 1 : 0));
  }

  const ask = [];
  if (isEntry) ask.push(...intents.entry.questions);
  else if (flow && ['criar-campanha'].includes(flow.id) && !platform) ask.push('Qual plataforma: Meta Ads, Google Ads ou ambas?');

  const required = skills.filter((s) => s.role !== 'optional');
  const loadNow = isEntry
    ? [byId.get(registry.orchestrator).file]
    : flow
      ? [byId.get(registry.orchestrator).file, required[0]?.file].filter(Boolean)
      : required.filter((s) => s.id === primary || (s.role === 'direct' && s.score >= STRONG)).slice(0, 3).map((s) => s.file);

  return {
    matched: true,
    query: message,
    normalized,
    platform,
    flow: isEntry
      ? { id: intents.entry.flow, name: 'Entrada', deliverable: 'Entender o pedido com o minimo de perguntas' }
      : flow
        ? { id: flow.id, name: flow.name, deliverable: flow.deliverable, via }
        : null,
    alsoMatchedFlows: also,
    primary,
    skills: isEntry ? [skillEntry(registry.orchestrator, { role: 'primary', score: scoreOf.get(registry.orchestrator)?.score ?? 0 })] : skills,
    loadNow: [...new Set(loadNow)],
    ask,
  };
}

export function toContext(result, { root = ROOT, pluginName = 'trafego-agente-pago' } = {}) {
  if (!result.matched) return '';
  const lines = ['[Trafego Agente Pago] Pedido de trafego pago detectado pelo router.'];
  if (result.flow) {
    const via = result.flow.via ? ` (a partir de: ${result.flow.via})` : '';
    lines.push(`Fluxo: ${result.flow.name}${via} -> entrega: ${result.flow.deliverable}`);
  }
  if (result.platform) lines.push(`Plataforma: ${result.platform}`);
  lines.push(`Skill principal: ${result.primary}`);
  if (result.skills.length > 1 || result.flow?.id !== 'entrada') {
    lines.push('Etapas/skills em ordem (carregue cada SKILL.md somente ao chegar nela):');
    result.skills.forEach((s, i) => {
      const tag = s.role === 'optional' ? ' [condicional]' : '';
      lines.push(`${i + 1}. ${s.id}${tag}${s.goal ? ` - ${s.goal}` : ''}`);
    });
  }
  if (result.ask.length) lines.push(`Pergunte apenas se faltar: ${result.ask.join(' | ')}`);
  lines.push(
    `Como carregar: Skill "${pluginName}:<id>" ou leia ${join(root, 'skills', '<id>', 'SKILL.md')}. Nao carregue skills fora da lista.`,
  );
  lines.push('Seguranca: nunca publicar, gastar, alterar orcamento ou apagar campanha sem confirmacao explicita.');
  return lines.join('\n');
}

export function listSkills() {
  return registry.skills.map(({ id, name, description, platform, file }) => ({ id, name, description, platform, file }));
}

export function getSkill(id) {
  const s = byId.get(id);
  if (!s) return null;
  const path = join(ROOT, s.file);
  return { ...s, content: existsSync(path) ? readFileSync(path, 'utf8') : null };
}

export { registry, intents };

// CLI: node router/router.mjs "mensagem" [--context] | --list
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.includes('--list')) {
    console.log(JSON.stringify(listSkills(), null, 2));
  } else {
    const text = args.filter((a) => !a.startsWith('--')).join(' ');
    const result = route(text);
    console.log(args.includes('--context') ? toContext(result) || '(nenhum roteamento)' : JSON.stringify(result, null, 2));
  }
}
