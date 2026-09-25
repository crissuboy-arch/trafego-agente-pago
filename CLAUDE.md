# CLAUDE.md

Este repositório é um **plugin do Claude Code** (`.claude-plugin/plugin.json`) de tráfego pago. As regras de comportamento e roteamento são as mesmas de @AGENTS.md.

## No Claude Code
- O hook `hooks/hooks.json` (UserPromptSubmit) roda `router/hook.mjs` a cada mensagem e, só em pedidos de tráfego pago, injeta um bloco `[Trafego Agente Pago]` com o fluxo e as skills em ordem. Siga-o.
- Skills ficam disponíveis como `trafego-agente-pago:<id>`; a entrada é `trafego-agente-pago:trafego-pago`.
- Comandos: `/trafego-agente-pago:trafego`, `:criar-campanha`, `:analisar-campanha`, `:criar-anuncio`, `:campanha-meta`, `:campanha-google`, `:testar-criativos`.

## Desenvolvimento
- Sem dependências externas; Node >= 18.
- `npm run check` = `scripts/validate.mjs` (manifestos, registro ↔ arquivos, frontmatter, referências, segredos) + `node --test`.
- `npm run route -- "mensagem"` para depurar o roteamento.
- `mcp/` é a camada do ChatGPT/MCP; consome o mesmo router e as mesmas skills. Não crie `.mcp.json` na raiz (o plugin passaria a iniciar o servidor). `npm run mcp` / `npm run mcp:stdio`.
- Depois de mudar registro ou fluxos: `npm run docs` (regenera `docs/SKILLS.md`).
- Ao mudar triggers ou fluxos, adicione um caso em `tests/router.test.mjs`.
- Triggers do registro: minúsculos e sem acento (o router normaliza a entrada).
- `skills/*/references/` são arquivos de terceiros (MIT) — não editar; atualizar `THIRD_PARTY_NOTICES.md` ao adicionar.
