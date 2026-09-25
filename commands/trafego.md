---
description: "Entrada do Trafego Agente Pago: entende o pedido e roteia para as skills certas"
argument-hint: "[o que você precisa]"
---

Use a skill `trafego-agente-pago:trafego-pago` como orquestradora e execute o fluxo **Entrada**.

Pedido do usuário: $ARGUMENTS

Se o pedido estiver vazio ou genérico, faça as perguntas mínimas do orquestrador. Se houver contexto, rode o roteamento (router/router.mjs ou tabela do orquestrador) e siga o fluxo indicado.

Regras: carregue cada skill especializada só ao chegar na etapa dela; pergunte apenas o que for bloqueante (máx. 3 perguntas numa mensagem); declare suposições; não publique, não gaste e não altere orçamento em conta real sem confirmação explícita.
