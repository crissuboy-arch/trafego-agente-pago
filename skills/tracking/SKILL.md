---
name: tracking
description: Tracking e mensuração para tráfego pago — Pixel da Meta e API de Conversões (CAPI) com deduplicação, tag do Google e conversões otimizadas, GA4, Google Tag Manager, UTMs, eventos padrão e validação. Use quando pedirem pixel, tracking, rastreamento, API de conversões, GTM, GA4, UTMs, eventos, ou quando conversões não aparecem.
---

# Tracking e Mensuração

Sem conversão medida, o algoritmo otimiza no escuro. Resolva isso **antes** de gastar.

## Eventos padrão
| Negócio | Meta (Pixel/CAPI) | Google Ads / GA4 |
|---|---|---|
| E-commerce | ViewContent, AddToCart, InitiateCheckout, Purchase (value, currency) | view_item, add_to_cart, begin_checkout, purchase |
| Leads | Lead, CompleteRegistration | generate_lead / form_submit |
| WhatsApp | Contact (clique no botão) — para vendas, ideal registrar a venda offline/CRM | clique no WhatsApp como conversão secundária |
| Agendamento | Schedule | book_appointment (personalizado) |

Defina **uma conversão principal** por objetivo; o resto como secundária.

## Meta
1. Pixel/dataset no site (plataforma nativa, GTM ou código).
2. API de Conversões (integração nativa da plataforma — Shopify, Hotmart, Kiwify etc. — ou via GTM server-side/parceiro).
3. Deduplicação: mesmo `event_name` + `event_id` no navegador e no servidor.
4. Verificar domínio no Business Manager; conferir a qualidade de correspondência de eventos.
5. Testar em Gerenciador de Eventos → Testar eventos.

## Google
1. Tag do Google (gtag ou GTM) em todas as páginas.
2. Conversão no Google Ads (tag própria ou importada do GA4) com valor.
3. Conversões otimizadas (enhanced conversions) com e-mail/telefone hash.
4. Consent Mode quando houver banner de cookies (obrigatório para tráfego do EEE).
5. Vincular Google Ads ↔ GA4 e testar com o Tag Assistant.

## UTMs (padrão)
`utm_source={plataforma}&utm_medium=cpc&utm_campaign={nome_campanha}&utm_content={nome_anuncio}&utm_term={keyword_ou_publico}`
Meta aceita parâmetros dinâmicos: `{{campaign.name}}`, `{{adset.name}}`, `{{ad.name}}`. Google: `{keyword}`, `{campaignid}`, ValueTrack.

## Diagnóstico "conversão não aparece"
Evento dispara? (Pixel Helper/Tag Assistant) → no domínio certo? → com parâmetros (value/currency)? → deduplicado? → janela de atribuição/fuso? → conversão marcada como principal? → bloqueio de cookies/consentimento?

## Segurança
Tokens de acesso (CAPI, APIs) só em variáveis de ambiente ou no gerenciador da plataforma. Nunca em código versionado ou no chat.

## Entregável padrão
Plano de medição: tabela Evento | Onde dispara | Parâmetros | Plataforma(s) | Principal/secundária | Como testar + padrão de UTMs + checklist de validação.

## Referências
- `references/pixel-tracking-setup.md`, `references/conversion-tracking.md`, `references/gtm-implementation.md`, `references/ga4-setup.md`
