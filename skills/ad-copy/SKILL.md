---
name: ad-copy
description: Copy de anúncio para Meta Ads e Google Ads — texto principal, headlines/títulos, descrições, CTAs e variações para teste, respeitando limites de caracteres e políticas. Use quando pedirem copy, texto do anúncio, headline, título, CTA, legenda ou "crie N anúncios".
---

# Copy de Anúncio

## Entradas mínimas
Oferta (skill `offer`), público/nível de consciência, ângulo (skill `creative-strategy`), plataforma/formato, tom de voz. Faltando tom: direto, claro, conversacional.

## Limites práticos
| Plataforma | Campo | Limite |
|---|---|---|
| Meta | Texto principal | ~125 caracteres visíveis antes do "ver mais" (pode ser mais longo) |
| Meta | Título | ~40 caracteres |
| Meta | Descrição | ~30 caracteres (nem sempre aparece) |
| Google RSA | Títulos | até 15 × 30 caracteres |
| Google RSA | Descrições | até 4 × 90 caracteres |
| Google | Caminho da URL | 2 × 15 caracteres |
Sempre informe a contagem de caracteres nos campos do Google.

## Estruturas de texto (Meta)
- **PAS**: Problema → Agitação → Solução + CTA
- **AIDA**: Atenção → Interesse → Desejo → Ação
- **Antes → Depois → Ponte**
- **Prova primeiro**: resultado/depoimento → como → CTA
- **Lista**: "3 motivos para…", curta e escaneável
- Primeira linha = hook. Deve funcionar sozinha.

## Headlines (fórmulas)
Resultado + prazo · Como [resultado] sem [objeção] · Pergunta com dor · Número + benefício · Novidade/mecanismo · "Para [público] que [situação]".

## CTAs
Específicos e alinhados ao evento: "Garanta sua vaga", "Peça pelo WhatsApp", "Veja os modelos", "Simule grátis". O botão da plataforma deve bater com o texto.

## Regras de política (Meta/Google)
- Não afirmar atributos pessoais ("Você está acima do peso?", "Você tem dívidas?").
- Sem promessas de renda/saúde irreais, antes/depois enganoso, CAPS excessivo, pontuação repetida (Google).
- Não imitar interface/botões falsos.

## Variações para teste
Quando pedirem N anúncios, varie **ângulo** primeiro (dor, desejo, prova, objeção, novidade), depois hook, depois CTA. Nomeie cada um: `ANG-<angulo>_V<n>`.

## Entregável padrão (por anúncio)
Ângulo · Hook · Texto principal · Título · Descrição · CTA · Sugestão de criativo (1 linha).
Para Google: tabela de títulos e descrições com contagem de caracteres.

## Referências
- `references/ad-copy-variants.md`, `references/headline-formulas.md`, `references/cta-optimizer.md`
