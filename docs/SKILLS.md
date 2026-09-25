# Skills

Gerado a partir de `router/skill-registry.json` e `router/intents.json`. Triggers aparecem normalizados (sem acento); o usuário pode escrever com acento.

## Fluxos

| Fluxo | Etapas (skills) | Entrega |
|---|---|---|
| Criar campanha (`criar-campanha`) | market-research (condicional) → offer → audience → campaign-strategy → ad-copy → creative-strategy → meta-ads/google-ads → tracking | Plano de campanha completo + checklist de pre-publicacao |
| Meta Ads (`meta-ads`) | campaign-strategy → audience → offer → creative-strategy → ad-copy → meta-ads → tracking → optimization | Estrutura Meta Ads pronta para configurar + checklist |
| Google Ads (`google-ads`) | keywords → google-ads → ad-copy → landing-page → tracking → optimization | Estrutura Google Ads (campanhas, grupos, keywords, negativas, anuncios) + checklist |
| Analisar campanha (`analisar-campanha`) | analytics → optimization → creative-strategy (condicional) → landing-page (condicional) → offer (condicional) → tracking (condicional) | Diagnostico com gargalo, hipotese, acao e plano de teste |
| Criar anuncio (`criar-anuncio`) | offer → creative-strategy → ad-copy | Anuncios prontos (hook, copy, CTA, conceito visual) com variacoes |
| Testar criativos (`testar-criativos`) | creative-strategy → optimization → ad-copy (condicional) | Plano de teste de criativos com variacoes e regra de decisao |

## Skills

### `trafego-pago` — Trafego Pago (orquestrador)

Porta de entrada. Entende o pedido, escolhe o fluxo e delega para as skills especializadas.

- **Plataforma:** meta, google, multi
- **Intenções:** entrada, orquestrar, duvida-geral
- **Triggers fortes:** trafego pago, gestor de trafego, gestao de trafego, anuncios pagos, anuncio pago, midia paga, paid media, ppc, trafego
- **Entradas esperadas:** produto/servico; objetivo; plataforma; orcamento; publico; pagina de destino
- **Arquivo:** [`skills/trafego-pago/SKILL.md`](../skills/trafego-pago/SKILL.md)
- **Relacionadas:** campaign-strategy, meta-ads, google-ads, analytics

### `meta-ads` — Meta Ads (Facebook/Instagram)

Estrutura, configuracao e boas praticas de campanhas no Gerenciador de Anuncios da Meta.

- **Plataforma:** meta
- **Intenções:** criar-campanha, estrutura, configurar
- **Triggers fortes:** meta ads, facebook ads, instagram ads, gerenciador de anuncios, advantage+, advantage plus, conjunto de anuncios, cbo, abo, lead ads, anuncio de cadastro, click to whatsapp, anuncio para whatsapp, campanha de mensagens, boost, impulsionar
- **Triggers fracos:** facebook, instagram, meta, reels, stories, whatsapp, fb, insta
- **Entradas esperadas:** objetivo; evento de conversao; orcamento diario; publico; criativos; pixel ativo
- **Arquivo:** [`skills/meta-ads/SKILL.md`](../skills/meta-ads/SKILL.md)
- **Relacionadas:** audience, creative-strategy, ad-copy, tracking, optimization
- **Referências:** `lead-ads-meta.md`, `meta-ads-campaign.md`, `micro-budget-ads.md`, `whatsapp-ads-click.md`

### `google-ads` — Google Ads

Campanhas de Pesquisa, Performance Max, Shopping, Display e YouTube.

- **Plataforma:** google
- **Intenções:** criar-campanha, estrutura, configurar
- **Triggers fortes:** google ads, adwords, search ads, rede de pesquisa, campanha de pesquisa, performance max, pmax, google shopping, rede de display, youtube ads, anuncio no google, anunciar no google, anuncios no google, anuncio responsivo, rsa, demand gen
- **Triggers fracos:** google, youtube, display, shopping, merchant center, lance, estrategia de lance, cpc maximo
- **Entradas esperadas:** objetivo; tipo de campanha; orcamento diario; palavras-chave ou feed; landing page; conversao configurada
- **Arquivo:** [`skills/google-ads/SKILL.md`](../skills/google-ads/SKILL.md)
- **Relacionadas:** keywords, ad-copy, landing-page, tracking, optimization
- **Referências:** `google-ads-pmax.md`, `google-ads-search.md`, `google-shopping.md`

### `campaign-strategy` — Estrategia de Campanha

Objetivo, estrutura, orcamento, distribuicao de verba, fases de teste e escala.

- **Plataforma:** meta, google, multi
- **Intenções:** criar-campanha, planejar, orcamento, escalar
- **Triggers fortes:** estrategia de campanha, estrutura de campanha, estruturar campanha, plano de midia, planejamento de campanha, objetivo da campanha, objetivo de campanha, orcamento, verba, budget, escalar, escala, escalonar, distribuicao de verba, quanto investir, investimento em anuncios
- **Triggers fracos:** estrategia, planejamento, plano, campanha, campanhas, investir, lancamento
- **Entradas esperadas:** objetivo de negocio; margem/ticket; orcamento; prazo; historico
- **Arquivo:** [`skills/campaign-strategy/SKILL.md`](../skills/campaign-strategy/SKILL.md)
- **Relacionadas:** offer, audience, meta-ads, google-ads, analytics
- **Referências:** `budget-allocation.md`, `ecommerce-ads-strategy.md`, `scaling-strategy.md`

### `market-research` — Pesquisa de Mercado

Demanda, nicho, consciencia do publico, dores/desejos e validacao antes de investir.

- **Plataforma:** multi
- **Intenções:** pesquisar, validar
- **Triggers fortes:** pesquisa de mercado, estudo de mercado, analise de mercado, tamanho de mercado, validar produto, validar nicho, demanda, nicho, tendencia, tendencias, nivel de consciencia
- **Triggers fracos:** mercado, pesquisa, pesquisar, dores, desejos
- **Entradas esperadas:** produto; nicho; regiao; faixa de preco
- **Arquivo:** [`skills/market-research/SKILL.md`](../skills/market-research/SKILL.md)
- **Relacionadas:** competitor-research, audience, offer
- **Referências:** `market-research-analysis.md`

### `competitor-research` — Pesquisa de Concorrentes

Biblioteca de anuncios, angulos e ofertas da concorrencia, lacunas e diferenciacao.

- **Plataforma:** meta, google, multi
- **Intenções:** pesquisar, benchmark
- **Triggers fortes:** concorrente, concorrentes, concorrencia, biblioteca de anuncios, ad library, anuncios dos concorrentes, espionar, benchmark, google ads transparency, centro de transparencia
- **Triggers fracos:** referencia, referencias, comparar
- **Entradas esperadas:** nomes/sites dos concorrentes; produto; plataforma
- **Arquivo:** [`skills/competitor-research/SKILL.md`](../skills/competitor-research/SKILL.md)
- **Relacionadas:** market-research, offer, creative-strategy
- **Referências:** `competitive-analysis.md`, `competitor-ad-research.md`

### `audience` — Publicos e Segmentacao

Persona, interesses, publicos personalizados, lookalike, exclusoes e segmentacao por plataforma.

- **Plataforma:** meta, google, multi
- **Intenções:** segmentar, criar-campanha
- **Triggers fortes:** publico, publicos, publico-alvo, publico alvo, segmentacao, segmentar, persona, avatar, icp, cliente ideal, interesses, lookalike, semelhante, publico semelhante, publico personalizado, custom audience, publico aberto, advantage+ audience
- **Triggers fracos:** idade, genero, localizacao, regiao, cidade
- **Entradas esperadas:** produto; cliente atual; localizacao; dados proprios (lista, pixel)
- **Arquivo:** [`skills/audience/SKILL.md`](../skills/audience/SKILL.md)
- **Relacionadas:** market-research, remarketing, meta-ads, google-ads
- **Referências:** `customer-segmentation.md`, `lookalike-audiences.md`

### `offer` — Oferta

Proposta de valor, preco, bonus, garantia, urgencia e quebra de objecoes.

- **Plataforma:** multi
- **Intenções:** criar-campanha, criar-anuncio, diagnostico
- **Triggers fortes:** oferta, proposta de valor, garantia, bonus, ancoragem, escassez, urgencia, objecao, objecoes, promocao, desconto, preco, precificacao, big idea, mecanismo unico
- **Triggers fracos:** vender, vendas, produto, servico, infoproduto, curso, ticket, valor
- **Entradas esperadas:** produto; preco; publico; diferenciais; provas
- **Arquivo:** [`skills/offer/SKILL.md`](../skills/offer/SKILL.md)
- **Relacionadas:** ad-copy, landing-page, funnel
- **Referências:** `guarantee-frameworks.md`, `objection-handler.md`, `scarcity-urgency.md`, `value-ladder.md`

### `ad-copy` — Copy de Anuncio

Textos, headlines, descricoes e CTAs por plataforma, com variacoes para teste.

- **Plataforma:** meta, google, multi
- **Intenções:** criar-anuncio, escrever
- **Triggers fortes:** copy, copies, copywriting, texto do anuncio, texto de anuncio, textos de anuncio, headline, headlines, titulo do anuncio, titulos, descricao do anuncio, cta, chamada para acao, legenda, texto principal
- **Triggers fracos:** anuncio, anuncios, texto, textos, escrever, escreva, titulo
- **Entradas esperadas:** oferta; publico; angulo; plataforma/formato; tom de voz
- **Arquivo:** [`skills/ad-copy/SKILL.md`](../skills/ad-copy/SKILL.md)
- **Relacionadas:** creative-strategy, offer, landing-page
- **Referências:** `ad-copy-variants.md`, `cta-optimizer.md`, `headline-formulas.md`

### `creative-strategy` — Estrategia de Criativos

Angulos, hooks, conceitos visuais, roteiros de video/UGC e matriz de teste de criativos.

- **Plataforma:** meta, google, multi
- **Intenções:** criar-anuncio, testar-criativos
- **Triggers fortes:** criativo, criativos, hook, hooks, gancho, ganchos, angulo, angulos, ugc, roteiro, roteiro de video, conceito visual, carrossel, thumbnail, arte do anuncio, briefing de criativo, video de anuncio, anuncio em video
- **Triggers fracos:** imagem, imagens, video, videos, reels, stories, arte, banner, design, visual
- **Entradas esperadas:** oferta; publico; formatos disponiveis; recursos de producao
- **Arquivo:** [`skills/creative-strategy/SKILL.md`](../skills/creative-strategy/SKILL.md)
- **Relacionadas:** ad-copy, optimization, competitor-research
- **Referências:** `ad-creative-brief.md`, `hooks-swipe-file.md`, `ugc-brief.md`, `video-ads-structure.md`

### `landing-page` — Landing Page

Estrutura e copy de pagina de destino alinhada ao anuncio (message match).

- **Plataforma:** multi
- **Intenções:** criar-campanha, diagnostico
- **Triggers fortes:** landing page, landing pages, pagina de vendas, pagina de captura, pagina de destino, pagina do produto, lp, squeeze page, message match
- **Triggers fracos:** pagina, site
- **Entradas esperadas:** oferta; anuncio de origem; objetivo da pagina; URL atual (se existir)
- **Arquivo:** [`skills/landing-page/SKILL.md`](../skills/landing-page/SKILL.md)
- **Relacionadas:** cro, offer, ad-copy, tracking
- **Referências:** `landing-page-ads-match.md`, `sales-page-copy.md`

### `funnel` — Funil

Arquitetura do funil (topo/meio/fundo), iscas, tripwire, upsell e jornada.

- **Plataforma:** multi
- **Intenções:** planejar, criar-campanha
- **Triggers fortes:** funil, funis, funil de vendas, topo de funil, meio de funil, fundo de funil, jornada do cliente, isca digital, lead magnet, tripwire, upsell, order bump, esteira de produtos, perpetuo, webinar
- **Triggers fracos:** jornada, leads, lead, captura
- **Entradas esperadas:** produto(s); ticket; objetivo; canal de fechamento
- **Arquivo:** [`skills/funnel/SKILL.md`](../skills/funnel/SKILL.md)
- **Relacionadas:** offer, landing-page, remarketing, cro
- **Referências:** `customer-journey-map.md`, `lead-magnet-funnel.md`, `tripwire-funnel.md`

### `cro` — CRO (Otimizacao de Conversao)

Diagnostico e testes para aumentar a taxa de conversao de pagina, formulario e checkout.

- **Plataforma:** multi
- **Intenções:** diagnostico, otimizar
- **Triggers fortes:** cro, taxa de conversao, conversao da pagina, pagina nao converte, checkout, abandono de carrinho, carrinho abandonado, formulario, mapa de calor, heatmap, taxa de rejeicao, bounce
- **Triggers fracos:** conversao, conversoes, converter, converte
- **Entradas esperadas:** URL/estrutura da pagina; metricas de pagina; dispositivo; origem do trafego
- **Arquivo:** [`skills/cro/SKILL.md`](../skills/cro/SKILL.md)
- **Relacionadas:** landing-page, optimization, tracking
- **Referências:** `checkout-optimization.md`, `heatmap-analysis.md`

### `keywords` — Palavras-chave

Pesquisa, intencao, tipos de correspondencia, negativas e agrupamento para Google Ads.

- **Plataforma:** google
- **Intenções:** google-ads, pesquisar
- **Triggers fortes:** palavra-chave, palavras-chave, palavra chave, palavras chave, keyword, keywords, negativas, palavras negativas, palavra negativa, termos de pesquisa, termo de pesquisa, correspondencia, planejador de palavras, grupos de anuncios, grupo de anuncios
- **Triggers fracos:** termos, busca, pesquisa no google
- **Entradas esperadas:** produto/servico; regiao; intencao (compra/informacao); orcamento
- **Arquivo:** [`skills/keywords/SKILL.md`](../skills/keywords/SKILL.md)
- **Relacionadas:** google-ads, ad-copy, landing-page
- **Referências:** `keyword-research.md`

### `tracking` — Tracking e Mensuracao

Pixel, API de Conversoes, GA4, GTM, tag de conversao do Google, UTMs e validacao de eventos.

- **Plataforma:** meta, google, multi
- **Intenções:** configurar, diagnostico
- **Triggers fortes:** pixel, api de conversoes, capi, tracking, rastreamento, rastrear, gtm, tag manager, google tag, ga4, google analytics, utm, utms, eventos, evento de conversao, tag de conversao, conversoes offline, gerenciador de eventos, enhanced conversions, conversoes otimizadas
- **Triggers fracos:** evento, tag, medir, mensurar, atribuicao
- **Entradas esperadas:** plataforma do site/checkout; eventos desejados; acesso ao gerenciador
- **Arquivo:** [`skills/tracking/SKILL.md`](../skills/tracking/SKILL.md)
- **Relacionadas:** analytics, meta-ads, google-ads
- **Referências:** `conversion-tracking.md`, `ga4-setup.md`, `gtm-implementation.md`, `pixel-tracking-setup.md`

### `analytics` — Metricas e Analise

Leitura de CTR, CPC, CPM, CPA, ROAS, frequencia; benchmarks, funil de metricas e relatorios.

- **Plataforma:** meta, google, multi
- **Intenções:** analisar-campanha, relatorio
- **Triggers fortes:** ctr, cpc, cpm, cpa, cpl, roas, roi, cac, ltv, metricas, metrica, kpi, kpis, relatorio, dashboard, frequencia, custo por resultado, custo por lead, custo por compra, ticket medio, hook rate, hold rate
- **Triggers fracos:** resultado, resultados, desempenho, performance, numeros, dados, analise, analisar, analisa
- **Entradas esperadas:** periodo; gasto; impressoes; cliques; conversoes; receita; meta de CPA/ROAS
- **Arquivo:** [`skills/analytics/SKILL.md`](../skills/analytics/SKILL.md)
- **Relacionadas:** optimization, tracking, campaign-strategy
- **Referências:** `attribution-model.md`, `campaign-analytics.md`, `report-ads-template.md`, `roi-analysis.md`

### `optimization` — Otimizacao e Testes

Diagnostico de gargalo, hipoteses, testes A/B, fadiga de criativo, regras de corte e escala.

- **Plataforma:** meta, google, multi
- **Intenções:** analisar-campanha, otimizar, testar-criativos
- **Triggers fortes:** otimizar, otimizacao, otimize, melhorar resultados, melhorar campanha, diagnostico, gargalo, teste a/b, teste ab, testes a/b, ab test, split test, fadiga, saturacao, auditoria, auditar, nao esta vendendo, nao vende, nao converte, sem vendas, nao tem vendas, cpa alto, cpa caro, custo alto, ta caro, esta caro, piorou, caiu
- **Triggers fracos:** testar, teste, testes, melhorar, ajustar, corrigir, problema
- **Entradas esperadas:** metricas atuais; meta; historico de mudancas; tempo de veiculacao
- **Arquivo:** [`skills/optimization/SKILL.md`](../skills/optimization/SKILL.md)
- **Relacionadas:** analytics, creative-strategy, cro, offer
- **Referências:** `ab-test-analysis.md`, `ab-testing-framework.md`, `ad-fatigue-diagnosis.md`, `campaign-audit.md`, `cpa-optimization.md`

### `remarketing` — Remarketing

Publicos quentes, janelas, sequencias, anuncios dinamicos/catalogo e exclusoes.

- **Plataforma:** meta, google, multi
- **Intenções:** criar-campanha, recuperar
- **Triggers fortes:** remarketing, retargeting, remarketing dinamico, anuncios dinamicos, catalogo, dpa, advantage+ catalogo, visitantes do site, publico quente, reengajamento, recuperar carrinho, quem visitou
- **Triggers fracos:** visitantes, engajados, abandonou
- **Entradas esperadas:** volume de trafego; eventos do pixel; catalogo (se e-commerce); janela de compra
- **Arquivo:** [`skills/remarketing/SKILL.md`](../skills/remarketing/SKILL.md)
- **Relacionadas:** audience, tracking, funnel, meta-ads, google-ads
- **Referências:** `dynamic-ads.md`, `retargeting-strategy.md`
