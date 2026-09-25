---
name: meta-ads
description: Estrutura e configuração de campanhas Meta Ads (Facebook e Instagram) — objetivo, evento de otimização, campanha/conjunto/anúncio, Advantage+, orçamento (CBO/ABO), posicionamentos, lead ads e anúncios para WhatsApp. Use quando o pedido citar Meta Ads, Facebook Ads, Instagram Ads, Gerenciador de Anúncios, impulsionar, conjunto de anúncios ou campanha de mensagens.
---

# Meta Ads

## Entradas mínimas
Objetivo de negócio, onde converte (site, formulário, WhatsApp), orçamento diário, pixel/API ativos (sim/não), criativos disponíveis. Se faltar, assuma e declare.

## 1. Objetivo e evento
| Meta de negócio | Objetivo da campanha | Otimizar para |
|---|---|---|
| Vendas no site | Vendas | Compra (Purchase). Sem volume? Iniciar finalização de compra/AddToCart temporariamente |
| Leads no site | Cadastros (Leads) | Lead (evento do site) |
| Leads sem site | Cadastros → formulário instantâneo | Leads (preferir "maior intenção" p/ qualidade) |
| Conversa no WhatsApp | Engajamento ou Vendas/Cadastros → mensagens | Conversas / compras via mensagem |
| Público quente p/ remarketing | Engajamento/Reconhecimento | ThruPlay / visualização de vídeo |

Regra: otimize para o evento mais próximo da receita que tenha volume (≈50 eventos por conjunto/semana saem da fase de aprendizado). Abaixo disso, suba um degrau no funil ou concentre orçamento.

## 2. Estrutura recomendada

**Orçamento pequeno (até ~R$100/dia)** — 1 campanha, 1–2 conjuntos, 3–6 anúncios. Público aberto (Advantage+ audience) ou 1 interesse amplo. Não fragmente.

**Orçamento médio/alto** — 
- `[TESTE]` campanha ABO: conjuntos com orçamento fixo para testar ângulos/criativos.
- `[ESCALA]` campanha CBO (orçamento da campanha Advantage) ou Advantage+ de vendas com os vencedores.
- `[RMKT]` remarketing separado só se houver volume (visitas/engajamento suficientes); senão deixe o algoritmo cobrir.

Convenção de nomes: `PLAT_OBJ_PRODUTO_PUBLICO_AAAAMMDD` → ex.: `META_VENDAS_CURSO_ABERTO_20260925`; anúncios `ANG-dor_HOOK-03_VID_v1`.

## 3. Configuração (checklist)
- Campanha: objetivo; orçamento campanha (CBO) ou conjunto (ABO); limite de gasto da campanha opcional.
- Conjunto: local de conversão; evento; público (idade/geo/aberto); exclusões (compradores 180d); posicionamentos Advantage+ (padrão); janela de atribuição padrão (7 dias clique, 1 dia visualização).
- Anúncio: identidade (página/Instagram), formato (vídeo 9:16 + 1:1/4:5), texto principal (primeiras ~125 caracteres visíveis), título (~40), descrição, CTA, URL com UTMs, pixel/dataset selecionado.

## 4. Formatos e specs rápidos
- Vídeo/imagem vertical 9:16 (Reels/Stories) e 4:5 (Feed). Zona segura: deixe 14% livres no topo e ~35% embaixo em 9:16.
- Carrossel: 2–10 cards, 1:1 ou 4:5.
- Formulário instantâneo: poucas perguntas; perguntas qualificadoras aumentam qualidade e custo.

## 5. Regras de leitura
- Não mexa nas primeiras 48–72h (aprendizado), exceto erro grave.
- Edições significativas (orçamento > ~20–30%, público, evento, criativo novo no conjunto) reiniciam aprendizado.
- Corte anúncio: gastou 2–3× o CPA alvo sem conversão, ou CTR (link) muito abaixo dos pares da conta.
- Escala: +20–30% a cada 2–3 dias nos vencedores, ou duplicar em nova campanha/conjunto.

## Entregável padrão
1. Tabela Campanha > Conjuntos > Anúncios (nome, objetivo/evento, orçamento, público, criativo, copy, URL+UTM)
2. Regras de leitura/corte/escala com números
3. Checklist de pré-publicação (ver orquestrador)

## Segurança
Gere a estrutura; não publique, ative, altere orçamento ou exclua nada em conta real sem confirmação explícita.

## Referências (abra só se precisar de profundidade)
- `references/meta-ads-campaign.md` — workflows detalhados de campanha de vendas
- `references/lead-ads-meta.md` — formulários instantâneos
- `references/micro-budget-ads.md` — orçamentos muito pequenos
- `references/whatsapp-ads-click.md` — anúncios para WhatsApp
