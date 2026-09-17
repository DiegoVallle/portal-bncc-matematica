# Ilustrações de alfabetização — 17/09/2026

## Entrega

Três cenas originais geradas para o ValeEdu: capivara de mochila azul e passarinho, em estilo de livro infantil com textura de guache. Arquivos locais em `public/alfabetizacao/{sons,letras,leitura}.png` (1536 × 1024). Os originais foram preservados. Não usar as imagens como gabarito: são ambientação, sem letras ou pistas da opção correta.

`src/components/CenaAlfabetizacao.tsx` escolhe a cena por família de níveis: consciência fonológica → sons; correspondência e sílabas simples → blocos; palavras e textos → leitura. São três cenas reutilizadas, não dez aulas novas nem uma ilustração didática específica por exercício.

Integração em `/aluno/alfabetizacao` (cartões) e `/aluno/alfabetizacao/[nivel]/atividades/[atividadeId]` (cabeçalho compacto). A lista ainda exibe somente os níveis existentes no banco. Imagens com Next Image, dimensões reservadas, `sizes` responsivo, sem recorte e alt vazio por serem decorativas. Não há texto embutido nas imagens.

Player: opções maiores, foco visível, nome acessível dos botões, vogais exibidas como letras reais (evita emoji genérico no lugar de E/U), removida duplicação visual das opções de clique e retirado contador total de atividades. Sem alterar correção, áudio, reconhecimento de voz, dados ou progresso da alfabetização. Os desenhos dos objetos nas respostas continuam sendo os emojis do piloto; esta entrega não os substitui por ilustrações individuais.

## Validação e publicação

Imagens inspecionadas visualmente. ESLint dos componentes alterados e compilação completa/TypeScript passaram. Não houve teste autenticado do reconhecimento de voz nesta etapa. Não houve migração, seed nem deploy nesta entrega.

## Trabalho de matemática em andamento no mesmo checkout

As mudanças em `src/lib/trilha.ts`, ações/páginas da trilha e painel de pontuação pertencem à tarefa anterior de correção, não às ilustrações. Implementadas localmente: rejeição de alternativa vazia; validação de gabarito MC; score por questão distinta; proteção transacional contra novos registros de prática já acertada ou com limite esgotado; resultado final derivado do banco; recomendação de revisão sem domínio; acerto verificado como pré-condição mínima de avaliação também nas ações. O script `scripts/verificar-correcao-trilha.ts` testa índices/gabaritos/pontuação. A compilação conjunta passou.

Ainda pendentes: completar avaliações MC e gabaritos ausentes; distribuir prática por subaula; ampliar prática corrigida antes de exigir múltiplos acertos; verificar concorrência com teste de integração em banco isolado; formalizar ciclos de reavaliação. Não declarar o fluxo de matemática integralmente concluído ou publicado.

## Ampliação — uma cena por nível

A pedido de Diego, a seleção por três famílias foi substituída por um mapa explícito dos dez níveis (`CENAS_POR_NIVEL`, tipado com `NivelFonico`). Mantidas as três imagens aprovadas e acrescentadas sete cenas com os mesmos personagens:

| Nível | Cena |
|---|---|
| Rimas e aliteração | Capivara e passarinho ouvindo sons (`sons.png`) |
| Sílabas orais | Palmas e passos rítmicos (`silabas-orais.png`) |
| Consciência fonêmica | Escuta atenta de um som (`fonemas.png`) |
| Vogais | Descoberta com blocos (`letras.png`) |
| Consoantes | Exploração de peças com lupa (`consoantes.png`) |
| Sílabas simples | União de peças (`silabas.png`) |
| Palavras simples | Leitura compartilhada (`leitura.png`) |
| Encontros e dígrafos | Fitas que se encontram (`encontros.png`) |
| Palavras complexas | Trem com várias partes (`palavras-complexas.png`) |
| Frases e textos | Histórias compartilhadas (`textos.png`) |

A cena também aparece na conclusão de cada nível. `scripts/verificar-ilustracoes-alfabetizacao.tsx` confere cobertura dos dez níveis, imagens distintas, arquivos PNG válidos com dimensões adequadas e renderização dos dois formatos. São ilustrações de ambientação: não substituem figuras específicas de cada exercício. Disponibilizar imagens para os dez níveis não importa nem cria atividades nos sete níveis que ainda não fazem parte do piloto.

## Estilo unificado nas telas de alfabetização

`layout.tsx` e `aventura.css` aplicam um tema restrito à árvore `/aluno/alfabetizacao`: fundo creme com verde/dourado suaves, cartões com contornos e sombra discreta, botões verdes arredondados com alvo mínimo de 48px, foco de teclado visível e respeito a movimento reduzido. Entrada, atividades, feedback, conclusão e estado sem atividades usam a mesma linguagem. Novos `loading.tsx` e `error.tsx` mantêm o estilo ao carregar ou recuperar uma falha. As telas gerais de login, professor e matemática não foram tematizadas como alfabetização.

Feedback tem região acessível de status; microfone tem nome acessível; erro oferece nova tentativa e retorno. ESLint das telas de alfabetização e build/TypeScript completos passaram. Sem teste de microfone em conta real ou publicação nesta etapa.
