# Quickstart

## 1. Pré-requisitos
- Claude Code instalado (terminal, VS Code ou app desktop).
- Node.js 18+ no PATH (o hook de roteamento usa `node`). Verifique com `node --version`.

## 2. Instalar o plugin
No Claude Code:

```
/plugin marketplace add crissuboy-arch/trafego-agente-pago
/plugin install trafego-agente-pago@trafego-agente-pago
```

Reinicie a sessão. Em `/plugin` o plugin deve aparecer como habilitado.

Alternativa (cópia local, útil para editar as skills):

```
/plugin marketplace add "C:\Users\<voce>\...\trafego-agente-pago"
/plugin install trafego-agente-pago@trafego-agente-pago
```

## 3. Usar
Escreva normalmente em qualquer pasta:

```
tráfego pago
```
```
crie uma campanha Meta Ads para minha loja de roupas femininas, ticket médio R$180, R$100/dia
```
```
analise: R$850 gastos, 42.000 impressões, 610 cliques, 9 compras, receita R$1.620. Meta de ROAS 3.
```

O modelo recebe automaticamente o fluxo e as skills certas. Se quiser forçar um fluxo, use um comando:
`/trafego-agente-pago:criar-campanha`, `/trafego-agente-pago:analisar-campanha`, `/trafego-agente-pago:criar-anuncio`, `/trafego-agente-pago:campanha-meta`, `/trafego-agente-pago:campanha-google`, `/trafego-agente-pago:testar-criativos`.

## 4. Dicas
- Dê o máximo de contexto na primeira mensagem (produto, preço, objetivo, plataforma, orçamento, onde converte) — o agente pula as perguntas.
- Peça para salvar o briefing (`briefing-<produto>.md`) e reutilize nas próximas conversas. Esses arquivos são ignorados pelo Git.
- O plugin **não publica nada**. Você configura na plataforma; ou, numa integração futura, só com confirmação.

## 5. Verificar a instalação (opcional, na pasta do repositório)
```
npm run check
npm run route -- "quero anunciar no Google"
```

## Problemas comuns
| Sintoma | Solução |
|---|---|
| Nenhum bloco `[Trafego Agente Pago]` aparece | Confirme `node --version`; reinicie a sessão; veja se o plugin está habilitado em `/plugin` |
| Skill não carrega | Chame direto: "use a skill trafego-agente-pago:meta-ads" |
| Roteou errado | `npm run route -- "sua frase"` e ajuste triggers em `router/skill-registry.json` |
