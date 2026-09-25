# Arquitetura

## Visão geral

```
Mensagem do usuário
   │
   ▼
Host AI
   ├─ Claude Code: hook UserPromptSubmit → router/hook.mjs → contexto injetado
   └─ ChatGPT / clientes MCP: mcp/server.mjs → ferramenta traffic_route / traffic_<skill>
   ▼
router/router.mjs ── lê ── router/skill-registry.json  (skills, triggers, inputs)
   │                  └── router/intents.json         (âncoras, plataformas, fluxos)
   ▼
Rota: { flow, platform, primary, skills[ordem], loadNow, ask }
   │
   ▼
skills/trafego-pago/SKILL.md (orquestrador) → skills/<id>/SKILL.md por etapa → references/ se preciso
   │
   ▼
Resultado (plano, estrutura, textos, diagnóstico, checklist) — nada executado em conta real sem confirmação
```

## Componentes

| Componente | Papel | Formato |
|---|---|---|
| `skills/<id>/SKILL.md` | Conhecimento especializado enxuto (~60–120 linhas) | Markdown + frontmatter (`name`, `description`) |
| `skills/<id>/references/` | Aprofundamento, carregado só quando necessário | Markdown (terceiros, MIT) |
| `router/skill-registry.json` | Fonte única das skills: id, triggers, plataforma, inputs, arquivo, relacionadas | JSON |
| `router/intents.json` | Âncoras de domínio, detecção de plataforma, fluxos compostos | JSON (regex) |
| `router/router.mjs` | Pontuação determinística + montagem da rota; lib e CLI | JS ESM, sem deps |
| `router/hook.mjs` | Adaptador do Claude Code: injeta contexto só quando há match | JS ESM |
| `mcp/protocol.mjs` | Núcleo MCP (JSON-RPC 2.0): initialize, ping, tools/list, tools/call, lotes | JS ESM, sem deps |
| `mcp/tools.mjs` | Ferramentas MCP geradas do registro; cada uma lê as mesmas SKILL.md/references | JS ESM |
| `mcp/server.mjs` | Transportes: Streamable HTTP (ChatGPT) e stdio (Codex, Claude Desktop…) | JS ESM, `node:http` |
| `commands/*.md` | Atalhos explícitos para os fluxos | Markdown |
| `AGENTS.md` | Contrato portátil para qualquer agente | Markdown |

## Algoritmo do router

1. **Normalização**: minúsculas, remove acentos, compacta espaços.
2. **Porteira de domínio**: exige uma âncora (`anunci*`, `campanh*`, `ads`, `ctr/cpc/cpa/roas`, `criativ*`, `pixel`, `palavras-chave`…) ou um trigger forte. Sem isso → `matched: false` (hook fica em silêncio). Evita disparar em conversas de programação.
3. **Pontuação**: trigger forte = 3, fraco = 1, casamento por palavra inteira com plural opcional.
4. **Plataforma**: `meta`, `google` ou `multi` por padrões em `intents.json`.
5. **Fluxo** (prioridade): intenção explícita por regex (melhorar página 65 > analisar 60 > remarketing 52 > criar campanha 50 > testar criativos 45 > criar anúncio 40). Fluxos curtos (melhorar página, remarketing) declaram a própria skill principal; os longos são coordenados pelo orquestrador. Ferramentas MCP podem forçar um fluxo (`route(msg, { flow })`). "Criar campanha" + uma plataforma → fluxo da plataforma. Só plataforma, sem tarefa específica → fluxo da plataforma.
6. **Composição**: etapas do fluxo (com `@platform` resolvido) + skills com sinal forte citadas diretamente + skill da plataforma.
7. **Entrada**: sem fluxo e sem skill específica → orquestrador com perguntas mínimas.
8. **Progressive disclosure**: `loadNow` traz no máximo orquestrador + primeira etapa (ou até 3 skills diretas). O resto é carregado etapa a etapa.

## Decisões

- **Sem LLM no router**: o host já entende linguagem natural; o router só reduz o espaço de busca e padroniza fluxos. Determinístico = testável.
- **Hook em vez de carregar tudo**: o contexto injetado tem ~10–15 linhas; as skills só entram quando usadas.
- **SKILL.md próprias + referências de terceiros**: as instruções principais foram escritas para este produto (curtas, acionáveis, com regras de segurança); as referências do kursku/skills servem de profundidade.
- **MCP sem SDK**: o protocolo necessário (JSON-RPC, 4 métodos, resposta JSON no Streamable HTTP) é pequeno. Implementá-lo em cerca de 150 linhas evita dependências e mantém `npm install` desnecessário.
- **MCP fora do plugin**: não existe `.mcp.json` na raiz, porque o Claude Code iniciaria o servidor junto com o plugin. O `validate.mjs` garante isso.

## ChatGPT / MCP

| Ferramenta | Implementação |
|---|---|
| `traffic_route(message)` | `route(message)` + `toContext()` + texto das skills de `loadNow` |
| `traffic_plan_campaign(request, platform?)` | `route(request, { flow: 'criar-campanha' })` |
| `traffic_<skill>(request?, references?)` | `getSkill(id)` sem frontmatter + `getReference()` sob demanda + próximas skills via `route(request)` |
| `search(query)` / `fetch(id)` | router + busca no registro/references; ids `skill:<id>` e `ref:<id>/<arquivo>` |

Guia de conexão: [CHATGPT.md](CHATGPT.md).

Ferramentas de **escrita** em contas reais (Meta Marketing API / Google Ads API), se um dia existirem, devem:
- ler credenciais só de variáveis de ambiente (`.env.example`);
- operar em modo *dry-run* por padrão, retornando o que seria feito;
- exigir confirmação explícita (parâmetro `confirm: true` vindo de uma ação do usuário) para publicar, gastar, mudar orçamento ou apagar.

Para o ChatGPT sem MCP, `AGENTS.md` + `skills/` podem ser usados como instruções/arquivos de conhecimento de um GPT personalizado.
