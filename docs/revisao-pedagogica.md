# Revisão pedagógica — 7º ano

## Entrega

37 habilidades com aulas de introdução reescritas: 48 aulas, cada uma com objetivo explícito, teoria, exemplo e pergunta de compreensão com feedback. Perguntas guiadas não geram nota, tentativas no banco nem bloqueio. A prática e a avaliação mantêm suas regras anteriores.

11 habilidades divididas em duas aulas:

| Habilidade | Primeira aula | Segunda aula |
|---|---|---|
| EF07MA01 | Múltiplos e divisores | MDC ou MMC |
| EF07MA02 | Porcentagem como parte | Aumentos e descontos |
| EF07MA04 | Adição e subtração de inteiros | Multiplicação e divisão |
| EF07MA08 | Significados da fração | Comparação |
| EF07MA11 | Multiplicação de frações | Divisão |
| EF07MA17 | Proporcionalidade direta | Inversa |
| EF07MA18 | Significado da equação | Resolução em duas etapas |
| EF07MA24 | Existência de triângulos | Ângulos internos |
| EF07MA30 | Volume por camadas | Capacidade |
| EF07MA31 | Retângulos e triângulos | Outros quadriláteros |
| EF07MA35 | Cálculo e significado da média | Interpretação e amplitude |

A divisão é editorial, dentro da mesma habilidade. Cada aula tem endereço com `?aula=1` ou `?aula=2`. O histórico e o domínio continuam por habilidade; ainda não há atribuição nem registro de conclusão separado por subaula. O banco de exercícios continua compartilhado entre as duas aulas. O botão principal encaminha da primeira à segunda aula e, depois, à prática; a navegação continua livre.

## Achados e correções

- As 37 teorias estão preenchidas no banco consultado. Não foi confirmada ausência de dados; a apresentação anterior fragmentava textos automaticamente, não renderizava fórmulas e mostrava notas de produção de ilustrações.
- Teoria e exemplo agora aparecem juntos, em seções identificadas. Material adicional fica em consulta expansível.
- KaTeX renderiza fórmulas com saída MathML. Normalização restrita a fórmulas corrige escapes legados e diferencia R$ de delimitador matemático. HTML bruto não é habilitado.
- Zero incluído entre múltiplos naturais; domínio de divisores explicitado.
- Regras de sinais da soma separadas das regras de multiplicação; retirada da analogia “amigos e inimigos”.
- Dois métodos com resultado igual não são prova absoluta de acerto: é preciso justificar as transformações.
- Proporcionalidade exige razão ou produto constante e condições explícitas; variar no mesmo sentido ou em sentidos opostos não basta.
- Transformação negativa de coordenadas explicada por rotação e escala de comprimentos; caso k=0 explicitado.
- Simetria central distinguida de reflexão em um eixo.
- Triângulo impossível não recebe ângulos de uma segunda pergunta como se fosse a mesma figura.
- Construções geométricas requerem conferência de lados e ângulos, não só fechamento.
- π≈3,14 gera aproximação, não exatidão.
- Média inclui zero na contagem e passa a ser interpretada com amplitude e valores extremos.
- Categoria mais citada não é necessariamente maioria absoluta.

As consultas das habilidades com conceitos corrigidos também usam o material revisado, evitando contradição com a aula. Os registros originais do banco não foram sobrescritos.

## Limites da auditoria do banco de exercícios

A auditoria estrutural encontrou 1.480 itens: 1.369 com tipo TEXTO, 54 NUMERICA e 57 MULTIPLA_ESCOLHA. Alguns TEXTO têm atividade interativa e, portanto, o tipo isolado não indica indisponibilidade. Há 45 itens sem respostaEsperada. Nenhum item marcado requerImagem está sem SVG, mas essa marcação não prova suficiência visual.

Não foi realizada uma validação matemática individual dos 1.480 gabaritos nem conversão de todos os itens abertos. As 48 novas perguntas são formativas e não substituem a avaliação final. O saneamento dos 45 gabaritos ausentes e a distribuição do banco por subaula são trabalhos ainda pendentes, não cobertura concluída desta revisão.

## Verificação

- Script `scripts/verificar-aulas.tsx`: cobertura contínua EF07MA01–37, estrutura e opções válidas, renderização de cada aula, fórmulas do material real, dinheiro sem interpretação como fórmula e remoção de notas de produção.
- Navegador local: erro e nova tentativa correta na pergunta guiada; navegação entre as duas aulas de triângulos; seleção e feedback reiniciados ao mudar de aula.
- Sem testes em contas reais e sem alteração de progresso ou notas.

## Referência curricular

[BNCC — documento oficial do MEC](https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf). As explicações, exemplos e perguntas desta revisão são autorais. A organização em subaulas é uma decisão editorial para reduzir a carga por encontro, não uma divisão prescrita pela BNCC.
