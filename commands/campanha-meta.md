---
description: "Monta campanha Meta Ads (Facebook/Instagram) pronta para configurar"
argument-hint: "[produto, objetivo, orçamento]"
---

Use a skill `trafego-agente-pago:trafego-pago` como orquestradora e execute o fluxo **META ADS**.

Pedido do usuário: $ARGUMENTS

Etapas: campaign-strategy (objetivo/evento) → audience → offer → creative-strategy → ad-copy → meta-ads (estrutura) → tracking (pixel + CAPI + UTMs) → optimization (regras de leitura, corte e escala).

Regras: carregue cada skill especializada só ao chegar na etapa dela; pergunte apenas o que for bloqueante (máx. 3 perguntas numa mensagem); declare suposições; não publique, não gaste e não altere orçamento em conta real sem confirmação explícita.
