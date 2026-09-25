---
description: "Monta campanha Google Ads: keywords, negativas, grupos, anúncios, página e conversão"
argument-hint: "[produto/serviço, região, orçamento]"
---

Use a skill `trafego-agente-pago:trafego-pago` como orquestradora e execute o fluxo **GOOGLE ADS**.

Pedido do usuário: $ARGUMENTS

Etapas: keywords (intenção, keywords, negativas, grupos) → google-ads (tipo, lances, estrutura) → ad-copy (RSA com contagem de caracteres) → landing-page → tracking (conversão) → optimization.

Regras: carregue cada skill especializada só ao chegar na etapa dela; pergunte apenas o que for bloqueante (máx. 3 perguntas numa mensagem); declare suposições; não publique, não gaste e não altere orçamento em conta real sem confirmação explícita.
