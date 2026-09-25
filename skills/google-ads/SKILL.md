---
name: google-ads
description: Estrutura e configuração de campanhas Google Ads — Pesquisa, Performance Max, Shopping, Display, YouTube e Demand Gen; estratégia de lances, anúncios responsivos (RSA), extensões/recursos e conversões. Use quando o pedido citar Google Ads, anunciar no Google, rede de pesquisa, PMax, Shopping, YouTube Ads ou lances.
---

# Google Ads

## Entradas mínimas
Produto/serviço, região, objetivo (venda, lead, ligação), orçamento diário, landing page, conversão configurada (sim/não). Palavras-chave vêm da skill `keywords`.

## 1. Escolha do tipo de campanha
| Situação | Tipo |
|---|---|
| Existe busca pelo que você vende (demanda ativa) | **Pesquisa** — comece por aqui quase sempre |
| E-commerce com feed no Merchant Center | **Shopping** ou **PMax** com feed |
| Já tem conversões estáveis (≥30/mês) e quer volume | **Performance Max** |
| Negócio local (ligação/visita) | Pesquisa com geo raio + recursos de local/ligação |
| Criar demanda / vídeo | **YouTube / Demand Gen** |
| Remarketing visual | Display / Demand Gen com listas |

## 2. Estrutura da Pesquisa
- Campanha por objetivo/região; grupos de anúncios por **tema de intenção** (5–20 keywords muito próximas).
- Separe **marca** (termos com seu nome) de **genéricas**.
- Correspondência: frase e exata para começar com orçamento curto; ampla somente com Smart Bidding e conversões funcionando.
- Negativas desde o dia 1 (lista da skill `keywords`).
- Rede de Display **desligada** na campanha de Pesquisa. Parceiros de pesquisa: desligar no início.

## 3. Lances
| Fase | Estratégia |
|---|---|
| Sem histórico | Maximizar cliques com CPC máx. ou Maximizar conversões (se a tag estiver ok) |
| ≥15–30 conversões/30 dias | Maximizar conversões → CPA desejado |
| E-commerce com valor | Maximizar valor da conversão → ROAS desejado |
Mudanças de meta em passos de ~10–20%, e espere 1–2 semanas.

## 4. Anúncio responsivo (RSA)
- Até 15 títulos (máx. 30 caracteres) e 4 descrições (máx. 90).
- Pelo menos: 3 títulos com a keyword, 3 com benefício, 2 com prova/diferencial, 2 com oferta/CTA, 1 com marca.
- Fixe (pin) só o necessário (ex.: marca/regulatório).
- Recursos: sitelinks (4+), frases de destaque, snippets estruturados, imagem, logotipo, ligação/local quando fizer sentido.
Use a skill `ad-copy` para escrever e contar caracteres.

## 5. PMax / Shopping (resumo)
- Feed limpo: títulos com atributos (marca + tipo + modelo + cor/tamanho), GTIN, preço e estoque certos.
- Grupos de recursos por categoria/margem; sinais de público (listas de clientes, remarketing, termos).
- Exclua termos de marca se quiser medir a PMax sem canibalizar a marca.

## 6. Conversões
Tag do Google ou importação do GA4; conversões otimizadas (enhanced conversions); definir **uma** conversão principal por objetivo. Detalhes em `tracking`.

## Entregável padrão
1. Tabela: Campanha | Tipo | Orçamento | Lance | Grupo | Keywords (correspondência) | Negativas | Landing page
2. RSA por grupo (títulos e descrições com contagem de caracteres) + recursos
3. Rotina de otimização (relatório de termos de pesquisa 2×/semana no início)
4. Checklist de pré-publicação

## Segurança
Não publique, ative, altere lances/orçamento ou remova nada em conta real sem confirmação explícita.

## Referências
- `references/google-ads-search.md`, `references/google-ads-pmax.md`, `references/google-shopping.md`
