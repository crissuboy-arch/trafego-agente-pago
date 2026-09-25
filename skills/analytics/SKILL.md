---
name: analytics
description: Métricas e análise de campanhas pagas — cálculo e leitura de CTR, CPC, CPM, CPA, CPL, ROAS, ROI, frequência, hook rate, taxa de conversão; funil de métricas, benchmarks, comparação com metas e relatórios. Use quando o usuário trouxer números, pedir análise de métricas, relatório, dashboard ou citar CTR, CPC, CPM, CPA, ROAS.
---

# Métricas e Análise

## Fórmulas
- CTR = cliques ÷ impressões · CPC = gasto ÷ cliques · CPM = gasto ÷ impressões × 1000
- Taxa de conversão (página) = conversões ÷ cliques (ou sessões)
- CPA/CPL = gasto ÷ conversões · ROAS = receita ÷ gasto · ROI = (lucro − gasto) ÷ gasto
- Hook rate (vídeo) = visualizações de 3 s ÷ impressões · Hold rate = ThruPlays ÷ visualizações de 3 s
- Relação útil: **CPA = CPC ÷ taxa de conversão** = CPM ÷ (1000 × CTR × taxa de conversão)

Calcule tudo que faltar a partir do que o usuário der. Mostre as contas.

## Leitura em cadeia (onde está o gargalo)
| Sintoma | Provável causa | Próximo passo |
|---|---|---|
| CPM alto | Público pequeno/competido, sazonalidade, baixa qualidade/relevância | Público mais amplo, criativo melhor |
| CTR baixo | Hook/ângulo/criativo fraco | `creative-strategy` |
| CTR ok, CPC alto | CPM alto | ver CPM |
| Cliques ok, conversão baixa | Página, oferta, message match, tracking | `landing-page`, `cro`, `offer`, `tracking` |
| Conversão ok, ROAS baixo | Ticket baixo, margem, descontos | `offer`, `funnel` (upsell) |
| Frequência > ~3 (frio) e CTR caindo | Fadiga | Novos criativos |

## Referências gerais (ordem de grandeza; a conta do próprio usuário é o melhor benchmark)
Meta — CTR (link) 0,8–2%; CPM Brasil R$15–50. Google Pesquisa — CTR 3–8%; taxa de conversão 3–10% (leads).
Nunca julgue com pouco dado: < ~1.000 impressões ou < 2–3× CPA alvo gasto por anúncio é inconclusivo.

## Entregável padrão
1. Tabela de métricas (dadas + calculadas) vs. meta
2. Gargalo principal (1) e secundários
3. Hipóteses → passar para `optimization` com ações e testes
4. Para relatório: resumo executivo (3 linhas), métricas, o que funcionou, o que muda, próximos passos

## Referências
- `references/campaign-analytics.md`, `references/roi-analysis.md`, `references/attribution-model.md`, `references/report-ads-template.md`
