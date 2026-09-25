# AGENTS.md — Trafego Agente Pago (instruções portáveis)

Estas instruções valem para qualquer agente (Claude, ChatGPT, Codex, Cursor, etc.). O modelo hospedeiro é a inteligência; este repositório fornece **conhecimento especializado (skills)** e um **router determinístico** que indica quais skills usar.

## Quando ativar
Qualquer pedido sobre tráfego pago: campanhas, anúncios, Meta/Facebook/Instagram Ads, Google Ads, criativos, copy, público, segmentação, palavras-chave, remarketing, pixel/tracking, métricas (CTR, CPC, CPM, CPA, ROAS) ou otimização.

## Como rotear (sem outro LLM)
1. Obtenha a rota:
   - com shell: `node router/router.mjs "<mensagem do usuário>"` (JSON) ou `--context` (texto curto);
   - sem shell: leia `router/skill-registry.json` (triggers por skill) e `router/intents.json` (fluxos).
2. Leia **primeiro** `skills/trafego-pago/SKILL.md` (orquestrador) quando houver fluxo ou pedido genérico.
3. Leia cada `skills/<id>/SKILL.md` **só ao chegar na etapa** correspondente.
4. Arquivos `skills/<id>/references/*.md` só quando precisar de profundidade extra.
5. Nunca carregue todas as skills de uma vez.

## Saída do router (contrato)
```json
{
  "matched": true,
  "platform": "meta | google | multi | null",
  "flow": { "id": "criar-campanha | meta-ads | google-ads | analisar-campanha | criar-anuncio | testar-criativos | entrada", "via": "..." },
  "primary": "id da skill principal",
  "skills": [{ "id": "...", "file": "skills/<id>/SKILL.md", "role": "step | optional | direct | platform", "goal": "..." }],
  "loadNow": ["arquivos para ler agora"],
  "ask": ["perguntas mínimas, só se faltarem"]
}
```

## Comportamento
- Aja quando houver contexto suficiente; pergunte no máximo 3 coisas, e só o que bloqueia.
- Declare suposições em uma linha.
- Entregue artefatos prontos (tabelas, textos com contagem de caracteres, estruturas nomeadas, checklists).
- Responda em português do Brasil, salvo pedido contrário.

## Segurança (obrigatório)
- Não publicar, ativar, pausar ou apagar campanhas; não criar/alterar orçamento ou lances; não executar nada que gaste dinheiro — **sem confirmação explícita do usuário para aquela ação**.
- Não solicitar, exibir, gravar ou versionar credenciais. Use `.env` (ignorado) a partir de `.env.example`.
- O núcleo apenas planeja e escreve; execução em contas reais é sempre do usuário ou de integração futura com confirmação.

## Manutenção
- Nova skill: veja "Como adicionar uma nova skill" no `README.md`.
- Antes de commitar: `npm run check` (validação + testes).
