---
name: cro
description: CRO (otimização da taxa de conversão) para tráfego pago — diagnóstico de página, formulário e checkout, priorização de testes (ICE), mapas de calor e gravações. Use quando pedirem taxa de conversão, CRO, checkout, abandono de carrinho, formulário, mapa de calor ou "a página não converte".
---

# CRO — Otimização de Conversão

## Onde está o vazamento?
Monte o funil de página com dados do GA4/plataforma:
`Cliques no anúncio → Sessões na página → Engajou (rolou/ficou > 10 s) → Clicou no CTA → Iniciou checkout/formulário → Converteu`
- Cliques ≫ sessões: página lenta, redirecionamento quebrado, clique acidental (placement).
- Sessões ok, pouco engajamento: message match ruim ou acima da dobra fraco.
- Engaja mas não clica no CTA: oferta/prova/CTA.
- Inicia checkout mas não compra: frete, preço surpresa, formas de pagamento, campos demais, confiança.

## Referências de taxa de conversão (ordem de grandeza, variam muito)
Captura de lead com tráfego frio: 15–40% · Página de vendas infoproduto: 0,5–3% · E-commerce: 0,8–3% · Checkout iniciado → compra: 30–60%.

## Checklist de checkout
Pix + cartão com parcelamento · frete e prazo visíveis antes do checkout · checkout de 1 página · poucos campos · selos e política de troca · recuperação de carrinho (e-mail/WhatsApp) · order bump.

## Priorização (ICE)
Nota 1–10 para Impacto, Confiança, Facilidade → média → teste maior primeiro. Um teste por vez por página; tráfego suficiente para significância (skill `optimization`).

## Ferramentas
Microsoft Clarity (gratuito) ou Hotjar para mapas de calor e gravações; PageSpeed Insights para velocidade.

## Entregável padrão
Diagnóstico por etapa do funil de página → lista de hipóteses com ICE → 3 testes priorizados com métrica e duração.

## Referências
- `references/checkout-optimization.md`, `references/heatmap-analysis.md`
