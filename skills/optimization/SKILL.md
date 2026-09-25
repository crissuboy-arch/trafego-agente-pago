---
name: optimization
description: Otimização de campanhas pagas — diagnóstico de gargalo, hipóteses, ações recomendadas, testes A/B, fadiga de criativo, regras de corte e escala, auditoria de conta. Use quando pedirem otimizar, melhorar resultados, auditoria, teste A/B, ou disserem que o anúncio não vende, não converte, está caro ou piorou.
---

# Otimização e Testes

## Fluxo obrigatório
**Métricas → Diagnóstico → Gargalo → Hipótese → Ação recomendada → Teste**
Use `analytics` para as métricas. Se não houver números, peça só: período, gasto, impressões, cliques, conversões, receita e meta de CPA/ROAS. Se o usuário não tiver os números, faça o diagnóstico qualitativo pelo checklist abaixo.

## Checklist "não está vendendo" (ordem de verificação)
1. **Tracking**: conversões estão sendo registradas? (vendas no checkout vs. na plataforma)
2. **Dados suficientes**: gasto ≥ 2–3× CPA alvo? passou do aprendizado?
3. **Entrega**: está gastando? CPM absurdo? público pequeno demais?
4. **Criativo**: CTR/hook rate abaixo da conta → ângulo/hook
5. **Página**: cliques sem conversão → velocidade, message match, CTA
6. **Oferta**: engajamento alto, página ok, nada vende → preço, prova, garantia
7. **Estrutura**: fragmentação, sobreposição, edições frequentes, evento de otimização errado

## Regras de decisão (ponto de partida; ajustar à conta)
- Corte: anúncio com gasto ≥ 2–3× CPA alvo e 0 conversões; ou CTR < 50% da média da conta após ~1.000–2.000 impressões.
- Mantenha: CPA ≤ alvo. Escale: CPA ≤ 80% do alvo por 3+ dias → +20–30% orçamento a cada 2–3 dias.
- Fadiga: frequência alta + CTR caindo + CPA subindo por 3+ dias → novos criativos (novos ângulos, não só nova cor).
- Não mudar várias variáveis ao mesmo tempo; documentar cada mudança com data.

## Testes A/B
- Uma variável por teste; hipótese escrita: "Se [mudança], então [métrica] melhora porque [razão]".
- Meta: ferramenta de Teste A/B ou conjuntos ABO iguais com orçamento igual. Google: Experimentos.
- Duração mínima: 7 dias (ciclo semanal) e volume mínimo (ideal ≥ 50 conversões por variação para decisões finas; com menos, use métricas intermediárias como CTR/CPC/custo por add-to-cart e trate como indicativo).
- Declare o vencedor pela métrica combinada antes (ex.: CPA), não pela que parecer melhor depois.

## Entregável padrão
| Gargalo | Evidência (números) | Hipótese | Ação recomendada | Teste | Métrica/critério | Prazo |
Ações que mexem em conta real (pausar, orçamento, lances) são **recomendações**: só executar com confirmação explícita do usuário.

## Referências
- `references/cpa-optimization.md`, `references/ad-fatigue-diagnosis.md`, `references/campaign-audit.md`, `references/ab-testing-framework.md`, `references/ab-test-analysis.md`
