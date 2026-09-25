# Usar no ChatGPT (MCP)

O ChatGPT se conecta a ferramentas externas por **MCP** (Model Context Protocol). Este repositório tem um servidor MCP próprio em `mcp/` que usa **as mesmas skills, o mesmo router e as mesmas referências** do plugin do Claude Code. Não há outra IA: o ChatGPT é a inteligência; o servidor só entrega as instruções certas.

```
ChatGPT ──HTTPS──► túnel ou hospedagem ──► node mcp/server.mjs ──► router ──► skills/<id>/SKILL.md ──► references/
```

## Requisitos

- Node.js 18+.
- Plano do ChatGPT com **modo desenvolvedor** para conectores/apps MCP (hoje disponível no Plus, Pro, Business e Enterprise/Edu; a disponibilidade pode mudar).
- Uma URL **HTTPS pública**. O ChatGPT roda na nuvem e não acessa o `localhost` do seu PC. Use um túnel gratuito ou hospede o servidor (veja abaixo).

## 1. Iniciar o servidor

```bash
git clone https://github.com/crissuboy-arch/trafego-agente-pago.git
cd trafego-agente-pago
npm run mcp
# Trafego Agente Pago MCP em http://127.0.0.1:8787/mcp (health: /health)
```

Não há `npm install`: o projeto não tem dependências.

## 2. Expor por HTTPS (escolha um)

**Túnel rápido do Cloudflare (gratuito, sem conta):** instale o `cloudflared` (`winget install Cloudflare.cloudflared` no Windows, `brew install cloudflared` no macOS) e rode, em outro terminal:

```bash
cloudflared tunnel --url http://localhost:8787
```

Ele mostra uma URL como `https://algo-aleatorio.trycloudflare.com`. A URL do MCP será `https://algo-aleatorio.trycloudflare.com/mcp`. Ela muda a cada execução, então para um endereço fixo use um túnel nomeado ou hospedagem.

**ngrok:** `ngrok http 8787` → `https://<id>.ngrok-free.app/mcp`.

**Hospedagem sempre ligada:** qualquer serviço que rode Node, como Render, Railway ou Fly.io.
- Comando de início: `node mcp/server.mjs`
- Variáveis: `HOST=0.0.0.0` (a porta vem de `PORT`, que o serviço já define)
- Nenhum build ou banco de dados é necessário.
- Planos gratuitos podem "dormir", e a primeira chamada fica lenta.

## 3. Conectar no ChatGPT

Os nomes dos menus mudam com frequência, mas o caminho atual é este:

1. **Configurações → Apps e Conectores → Configurações avançadas** → ative o **Modo desenvolvedor**.
2. Em **Apps e Conectores**, clique em **Criar** (ou "Adicionar conector/app").
3. Preencha:
   - Nome: `Trafego Agente Pago`
   - URL do servidor MCP: `https://<sua-url>/mcp`
   - Autenticação: **Sem autenticação**
4. Salve. O ChatGPT lista as ferramentas `traffic_*`.
5. Em uma conversa, ative o conector no menu **+ / Mais** (ou em "Modo desenvolvedor") e escreva normalmente: `tráfego pago`, `crie uma campanha Meta Ads para meu curso`...

Para deixar a escolha automática mais confiável, você pode colocar nas **instruções personalizadas** do ChatGPT (ou de um projeto):

> Para qualquer assunto de tráfego pago, use o conector Trafego Agente Pago: chame primeiro `traffic_route` com minha mensagem e siga o fluxo indicado.

## Ferramentas expostas

| Ferramenta | O que faz | Encaminha para |
|---|---|---|
| `traffic_route` | **Porta de entrada.** Roteia a mensagem e devolve o fluxo, as skills em ordem e o texto **só** das skills necessárias agora | router → `trafego-pago` + 1ª etapa |
| `traffic_plan_campaign` | Fluxo "Criar campanha" (vira Meta/Google se `platform` for informado) | router (fluxo forçado) |
| `traffic_meta_ads`, `traffic_google_ads`, `traffic_campaign_strategy`, `traffic_market_research`, `traffic_competitor_research`, `traffic_audience`, `traffic_offer`, `traffic_ad_copy`, `traffic_creative_strategy`, `traffic_landing_page`, `traffic_funnel`, `traffic_cro`, `traffic_keywords`, `traffic_tracking`, `traffic_analytics`, `traffic_optimize`, `traffic_remarketing` | Devolve a `SKILL.md` da skill (sem o cabeçalho, para economizar tokens). `references: [...]` inclui aprofundamento sob demanda; `request` sugere as próximas skills | `skills/<id>/SKILL.md` (+ `references/`) |
| `search` / `fetch` | Busca e leitura de skills e referências no formato que o ChatGPT usa em pesquisa/conhecimento | router + arquivos |

Todas são **somente leitura** (`readOnlyHint: true`). Nenhuma publica, gasta ou altera nada.

### Nomes com ponto (`traffic.route`)

Os nomes lógicos são `traffic.route`, `traffic.plan_campaign`... O padrão publicado usa `_`, porque o ChatGPT/OpenAI só aceita nomes de ferramenta no formato `^[a-zA-Z0-9_-]+$`. Para clientes que aceitam ponto: `TRAFEGO_TOOL_STYLE=dot npm run mcp`.

## Economia de tokens

- `traffic_route` devolve o contexto do router (cerca de 10 linhas) mais uma ou duas skills, e não as 18.
- As demais skills são pedidas uma a uma, conforme o fluxo avança.
- As referências só vêm quando solicitadas em `references`.

## Outros clientes MCP (stdio)

Para Codex, Claude Desktop, Cursor etc., use o transporte stdio:

```json
{
  "mcpServers": {
    "trafego-agente-pago": {
      "command": "node",
      "args": ["C:/caminho/para/trafego-agente-pago/mcp/server.mjs", "--stdio"]
    }
  }
}
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.trafego-agente-pago]
command = "node"
args = ["C:/caminho/para/trafego-agente-pago/mcp/server.mjs", "--stdio"]
```

> No **Claude Code** não é preciso MCP: use o plugin (README). O repositório de propósito **não** tem `.mcp.json`, para que o plugin continue funcionando exatamente como antes.

## Segurança

- O servidor não guarda nem pede credenciais e só lê arquivos de `skills/`. A leitura de referências bloqueia caminhos fora da pasta.
- Uma URL pública expõe apenas o conteúdo das skills, que já é público no GitHub. Se quiser um endereço menos óbvio, defina `TRAFEGO_MCP_PATH=/mcp-<algo-aleatorio>`.
- Regras de confirmação continuam valendo: nenhuma ação em conta real sem confirmação explícita do usuário.

## Teste local

```bash
npm run check                      # validação + 35 testes (inclui HTTP e stdio)
curl http://127.0.0.1:8787/health  # com o servidor rodando
```

## Problemas comuns

| Sintoma | Solução |
|---|---|
| ChatGPT não conecta | A URL precisa ser HTTPS pública e terminar em `/mcp`; teste `https://<url>/health` no navegador |
| "Modo desenvolvedor" não aparece | Recurso depende do plano e da região. Verifique em Configurações → Apps e Conectores → Avançado |
| URL do túnel parou de funcionar | O túnel rápido muda a cada execução. Rode de novo e atualize o conector, ou hospede o servidor |
| ChatGPT não usa as ferramentas | Ative o conector na conversa e/ou adicione a instrução personalizada acima |
