# Auditoria de completude das aulas — 17/09/2026

Consulta somente de leitura ao banco de conteúdo atual. Sem acesso a registros de alunos, alterações no banco ou publicação.

## Resultado

- 37 habilidades, 48 aulas editoriais: teoria, exemplo e pergunta formativa presentes e renderizados pelos testes.
- 40 itens por habilidade: 35 de prática e 5 de avaliação.
- Todas as habilidades têm SVG e uma atividade interativa: 16 de ordenação, 11 de classificação e 10 de ligação de pares.
- Os enunciados, alternativas MC (uma correta) e estruturas interativas passaram pelas verificações estruturais. Isso não certifica a correção matemática de cada gabarito.
- 1.164 exercícios abertos disponíveis com consulta à resposta, sem nota ou persistência.
- Somente EF07MA08 satisfaz o critério atual da rota de avaliação: todas as questões MULTIPLA_ESCOLHA. EF07MA01 tem 2 de 5; EF07MA18 tem 0 de 5. As outras 34 também têm 0 de 5.
- 45 avaliações sem resposta esperada: EF07MA02–06 e EF07MA34–37, cinco em cada habilidade.
- Em 34 habilidades, a única prática com correção automática disponível é a atividade interativa. Os demais exercícios dessas habilidades são de consulta à resposta.

## Inventário por habilidade

Todos os códigos abaixo têm teoria, exemplo, SVG, 35 exercícios e 5 avaliações. “Prática corrigida” inclui interativas e itens numéricos/MC conforme o filtro da aplicação; não conta a prática de consulta.

| Habilidade | Prática corrigida | Interativas | Avaliação MC / 5 | Avaliações sem resposta |
|---|---:|---:|---:|---:|
| EF07MA01 | 29 | 1 | 2 | 0 |
| EF07MA02 | 1 | 1 | 0 | 5 |
| EF07MA03 | 1 | 1 | 0 | 5 |
| EF07MA04 | 1 | 1 | 0 | 5 |
| EF07MA05 | 1 | 1 | 0 | 5 |
| EF07MA06 | 1 | 1 | 0 | 5 |
| EF07MA07 | 1 | 1 | 0 | 0 |
| EF07MA08 | 33 | 1 | 5 | 0 |
| EF07MA09 | 1 | 1 | 0 | 0 |
| EF07MA10 | 1 | 1 | 0 | 0 |
| EF07MA11 | 1 | 1 | 0 | 0 |
| EF07MA12 | 1 | 1 | 0 | 0 |
| EF07MA13 | 1 | 1 | 0 | 0 |
| EF07MA14 | 1 | 1 | 0 | 0 |
| EF07MA15 | 1 | 1 | 0 | 0 |
| EF07MA16 | 1 | 1 | 0 | 0 |
| EF07MA17 | 1 | 1 | 0 | 0 |
| EF07MA18 | 35 | 1 | 0 | 0 |
| EF07MA19 | 1 | 1 | 0 | 0 |
| EF07MA20 | 1 | 1 | 0 | 0 |
| EF07MA21 | 1 | 1 | 0 | 0 |
| EF07MA22 | 1 | 1 | 0 | 0 |
| EF07MA23 | 1 | 1 | 0 | 0 |
| EF07MA24 | 1 | 1 | 0 | 0 |
| EF07MA25 | 1 | 1 | 0 | 0 |
| EF07MA26 | 1 | 1 | 0 | 0 |
| EF07MA27 | 1 | 1 | 0 | 0 |
| EF07MA28 | 1 | 1 | 0 | 0 |
| EF07MA29 | 1 | 1 | 0 | 0 |
| EF07MA30 | 1 | 1 | 0 | 0 |
| EF07MA31 | 1 | 1 | 0 | 0 |
| EF07MA32 | 1 | 1 | 0 | 0 |
| EF07MA33 | 1 | 1 | 0 | 0 |
| EF07MA34 | 1 | 1 | 0 | 5 |
| EF07MA35 | 1 | 1 | 0 | 5 |
| EF07MA36 | 1 | 1 | 0 | 5 |
| EF07MA37 | 1 | 1 | 0 | 5 |

## Fluxo e pendências

A rota de avaliação exige uma tentativa de prática registrada; exercícios de consulta não registram tentativa. A atividade interativa pode cumprir esse requisito. As avaliações não inteiramente MC caem em formulário aberto de autoavaliação, portanto a solicitação anterior de correção automática ao final ainda não está atendida para 36 habilidades.

As onze habilidades divididas em duas aulas continuam compartilhando exercícios, atividade interativa e avaliação. Não há atividade independente para cada subaula.

Prioridades: completar/revisar os gabaritos ausentes; preparar avaliações MC nas 36 habilidades restantes; distribuir exercícios e interativas por objetivo/subaula; ampliar prática corrigida nas 34 habilidades de cobertura mínima. Qualquer geração de alternativas deve passar pela revisão do conteúdo antes da importação.

## Como conferir novamente

Executar `npx tsx scripts/auditar-aulas.ts`, depois `npx tsx scripts/verificar-aulas.tsx /tmp/valeedu-aulas-auditoria.json` e `npx tsx scripts/verificar-pratica-guiada.tsx /tmp/valeedu-aulas-auditoria.json`. O snapshot contém somente conteúdo didático. A tabela é um retrato da consulta de 17/09 e não se atualiza automaticamente.

Esta foi uma auditoria de cobertura, dados e renderização, com leitura das regras de seleção e avaliação. Não houve teste autenticado de ponta a ponta de todas as 48 aulas, nem revisão matemática individual dos 1.480 itens.
