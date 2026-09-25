---
name: audience
description: Públicos e segmentação para Meta Ads e Google Ads — persona, público aberto/Advantage+, interesses, públicos personalizados, lookalike/semelhantes, listas de clientes, sinais de público, exclusões e geolocalização. Use quando pedirem público, público-alvo, persona, segmentação, interesses, lookalike ou exclusões.
---

# Públicos e Segmentação

## Entradas mínimas
Produto, cliente atual (quem compra), região de atendimento, dados próprios disponíveis (lista de clientes, pixel com eventos, seguidores).

## 1. Persona operacional (curta)
Quem é · situação/momento · dor principal · desejo · objeção principal · onde está (plataforma/formato). Só o que muda anúncio ou segmentação.

## 2. Meta Ads — camadas
| Temperatura | Público | Quando usar |
|---|---|---|
| Frio amplo | Aberto / Advantage+ audience (só geo, idade mínima) | Padrão hoje; o criativo faz a segmentação |
| Frio direcionado | 1–3 interesses amplos relacionados | Nicho muito específico ou conta sem histórico |
| Frio semelhante | Lookalike 1–3% de compradores/leads qualificados | Com base ≥ ~1.000 pessoas de qualidade |
| Quente | Engajamento IG/FB, vídeo 50%+, visitantes 30–180d | Remarketing (skill `remarketing`) |
| Clientes | Lista/compradores | Exclusão ou upsell |

Exclusões padrão: compradores recentes (em aquisição), leads já convertidos, funcionários.

## 3. Google Ads
- Segmentação principal = **palavra-chave** (skill `keywords`).
- Públicos em Pesquisa: começar em **observação** (não restringe) para aprender.
- PMax/Demand Gen: sinais de público = listas de clientes + remarketing + termos de pesquisa personalizados.
- Geo: "presença" (pessoas no local) em vez de "presença ou interesse" para negócios locais.

## 4. Regras
- Público pequeno demais + orçamento pequeno = entrega cara e aprendizado lento.
- Não sobreponha públicos semelhantes em conjuntos que competem entre si.
- Teste públicos só depois de ter criativo que funciona; criativo pesa mais que segmentação.

## Entregável padrão
Tabela: Nome do público | Plataforma | Definição | Tamanho estimado | Uso (aquisição/rmkt/exclusão) | Prioridade de teste.

## Referências
- `references/lookalike-audiences.md`, `references/customer-segmentation.md`
