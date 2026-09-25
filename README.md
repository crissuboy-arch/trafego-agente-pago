# Trafego Agente Pago

Agente de **tráfego pago** para o **Claude Code** (plugin) e o **ChatGPT** (servidor MCP) — uma única base de skills para os dois. Você fala naturalmente — "tráfego pago", "crie uma campanha Meta Ads", "meu anúncio não está vendendo" — e o sistema escolhe sozinho as skills certas: estratégia, público, oferta, copy, criativos, keywords, tracking, métricas e otimização.

```
                 trafego-agente-pago
                         │
          ┌──────────────┴──────────────┐
     Claude Code                     ChatGPT
   plugin + hook                 servidor MCP (mcp/)
          └──────────────┬──────────────┘
                 router (router/)
                         │
              trafego-pago (orquestrador)
                         │
                   18 skills (skills/)
                         │
                references/ sob demanda
```

- **Sem IA própria, sem API de LLM.** O modelo hospedeiro é a inteligência; o plugin traz conhecimento especializado e um router determinístico.
- **Sem dependências.** Node >= 18 para o router, o hook, o servidor MCP e os testes. Sem `npm install`.
- **Seguro por padrão.** Planeja e escreve; nada é publicado, gasto ou alterado em conta real sem sua confirmação.

## Instalação (Claude Code)

Dentro do Claude Code:

```
/plugin marketplace add crissuboy-arch/trafego-agente-pago
/plugin install trafego-agente-pago@trafego-agente-pago
```

Reinicie a sessão (ou use `/reload-plugins`, se disponível). Para usar uma cópia local em vez do GitHub:

```
/plugin marketplace add "C:\caminho\para\trafego-agente-pago"
/plugin install trafego-agente-pago@trafego-agente-pago
```

Guia passo a passo: [docs/QUICKSTART.md](docs/QUICKSTART.md).

## Instalação (ChatGPT)

```bash
npm run mcp                                     # servidor MCP em http://127.0.0.1:8787/mcp
cloudflared tunnel --url http://localhost:8787  # URL HTTPS pública gratuita
```

No ChatGPT: **Configurações → Apps e Conectores → Avançado → Modo desenvolvedor**. Depois **Criar** conector com a URL `https://<túnel>/mcp` e autenticação "Sem autenticação". Guia completo, hospedagem fixa e clientes stdio (Codex, Claude Desktop): [docs/CHATGPT.md](docs/CHATGPT.md).

## Como usar

Basta escrever. Exemplos:

| Você escreve | O que acontece |
|---|---|
| `tráfego pago` | Orquestrador faz no máximo 3 perguntas e segue |
| `crie uma campanha Meta Ads para meu curso de R$297, orçamento R$80/dia` | Fluxo Meta Ads: objetivo → público → oferta → criativos → copy → estrutura → tracking → otimização |
| `quero anunciar no Google minha clínica em Curitiba` | Fluxo Google Ads: keywords → negativas → grupos → anúncios → página → conversão |
| `analise: gastei R$1.200, 80 mil impressões, 900 cliques, 12 vendas de R$197` | Métricas → gargalo → hipótese → ação → teste |
| `crie 5 anúncios para Facebook` | Oferta → ângulo → hook → copy → CTA → conceito visual → variações |
| `me dê palavras-chave para Google Ads` | Skill de keywords (+ Google Ads) |
| `meu anúncio não está vendendo` | Diagnóstico guiado por gargalo |
| `quero testar novos criativos` | Matriz de teste de criativos + critério de vencedor |
| `melhore minha landing page` | Landing page + CRO (ajustes priorizados e testes) |
| `crie remarketing` | Remarketing + públicos + copy por segmento |

Comandos opcionais (atalhos para os fluxos): `/trafego-agente-pago:trafego`, `:criar-campanha`, `:analisar-campanha`, `:criar-anuncio`, `:campanha-meta`, `:campanha-google`, `:testar-criativos`.

## Skills disponíveis

| Skill | Para quê |
|---|---|
| `trafego-pago` | **Entrada/orquestrador**: entende o pedido, escolhe o fluxo, delega |
| `meta-ads` | Estrutura e configuração no Facebook/Instagram |
| `google-ads` | Pesquisa, PMax, Shopping, YouTube, lances, RSA |
| `campaign-strategy` | Objetivo, orçamento, CPA/ROAS alvo, fases, escala |
| `market-research` | Demanda, consciência, dores e linguagem do cliente |
| `competitor-research` | Biblioteca de anúncios, ofertas e lacunas |
| `audience` | Persona, públicos, lookalike, exclusões |
| `offer` | Promessa, preço, bônus, garantia, objeções |
| `ad-copy` | Textos, headlines, CTAs, variações, limites de caracteres |
| `creative-strategy` | Ângulos, hooks, roteiros, UGC, matriz de teste |
| `landing-page` | Estrutura e message match |
| `funnel` | Funis por ticket, iscas, upsell |
| `cro` | Taxa de conversão, checkout, formulários |
| `keywords` | Palavras-chave, correspondência, negativas, grupos |
| `tracking` | Pixel, CAPI, GA4, GTM, UTMs, validação |
| `analytics` | CTR, CPC, CPM, CPA, ROAS, benchmarks, relatórios |
| `optimization` | Gargalo, hipótese, testes A/B, fadiga, corte e escala |
| `remarketing` | Públicos quentes, sequências, catálogo |

Detalhes: [docs/SKILLS.md](docs/SKILLS.md).

## Como funciona o roteamento

1. **Hook** (`hooks/hooks.json` → `router/hook.mjs`) roda a cada mensagem no Claude Code. Se não for assunto de tráfego, fica em silêncio.
2. **Router** (`router/router.mjs`) normaliza o texto (minúsculas, sem acento), pontua os triggers de cada skill em `router/skill-registry.json` e identifica, em ordem de prioridade:
   1. **intenção explícita** (fluxo em `router/intents.json`: criar campanha, analisar, criar anúncio, testar criativos, melhorar página, remarketing);
   2. **plataforma** (Meta, Google ou ambas — "criar campanha" + Meta vira o fluxo Meta Ads);
   3. **tarefa** (skill específica com sinal forte, ex.: keywords, tracking, audience);
   4. **combinação** de skills (etapas do fluxo + skills citadas diretamente + skill da plataforma).
3. O hook injeta um bloco curto `[Trafego Agente Pago]` com o fluxo e as skills em ordem. O modelo carrega **cada skill só quando chega na etapa dela** (progressive disclosure) — economiza tokens.

No ChatGPT o mesmo router é chamado pela ferramenta `traffic_route`, que devolve o mesmo fluxo e o texto só das skills necessárias no momento; as demais vêm pelas ferramentas `traffic_<skill>` conforme o fluxo avança.

Depurar: `npm run route -- "quero anunciar no Google"` (JSON) ou `node router/router.mjs "..." --context`.

## Como adicionar uma nova skill

1. Crie `skills/<id>/SKILL.md` com frontmatter `name: <id>` e `description:` dizendo o que faz e **quando usar** (com palavras que o usuário diria).
2. (Opcional) Coloque material longo em `skills/<id>/references/` e cite com `` `references/arquivo.md` ``.
3. Registre em `router/skill-registry.json`: `id`, `name`, `description`, `intents`, `triggers` (fortes), `weakTriggers`, `platform`, `inputs`, `file`, `related`. Triggers em minúsculas e sem acento.
4. Se fizer parte de um fluxo, adicione a etapa em `router/intents.json`.
5. Adicione um caso em `tests/router.test.mjs`, rode `npm run docs` e `npm run check`. A ferramenta MCP `traffic_<id>` é criada automaticamente a partir do registro.

## Segurança

- Nenhuma skill publica campanha, gasta dinheiro, altera orçamento/lances ou apaga campanhas **sem confirmação explícita**.
- Credenciais nunca no Git: `.env` é ignorado; use `.env.example` como modelo (apenas para integrações futuras).
- `npm run validate` procura padrões de tokens (Meta, Google, chaves privadas) antes do commit.
- `briefing-*.md`, `dados/` e `exports/` ficam fora do Git para proteger dados de clientes.

## Arquitetura

```
.claude-plugin/   plugin.json + marketplace.json (instalação no Claude Code)
skills/<id>/      SKILL.md (instrução enxuta) + references/ (aprofundamento sob demanda)
router/           skill-registry.json, intents.json, router.mjs (lib + CLI), hook.mjs
hooks/            hooks.json (UserPromptSubmit → roteamento automático no Claude Code)
mcp/              server.mjs (HTTP + stdio), protocol.mjs (JSON-RPC/MCP), tools.mjs (ferramentas → router/skills)
commands/         atalhos para os fluxos
scripts/          validate.mjs
tests/            node:test (roteamento, hook, MCP HTTP/stdio)
AGENTS.md         instruções portáveis para qualquer agente
```

Mais em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## ChatGPT / MCP

Implementado em `mcp/`, sem dependências, reaproveitando o router e as skills. São 18 ferramentas `traffic_*`: `route`, `plan_campaign` e uma por skill especializada (`optimization` → `traffic_optimize`). Há também `search`/`fetch`. Todas são somente leitura. Veja [docs/CHATGPT.md](docs/CHATGPT.md).

## Créditos e licença

MIT — veja [LICENSE](LICENSE). Referências em `skills/*/references/` vêm de [kursku/skills](https://github.com/kursku/skills) (MIT, Cafe Code AI) — veja [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
