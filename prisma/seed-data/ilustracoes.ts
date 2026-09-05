// Mapa de ilustrações SVG por enunciado exato de questão (aplicado no seed).
// Cobre as questões de Geometria que envolvem figuras concretas (formas, ângulos,
// plano cartesiano, sólidos, planificações, construções, etc.).
import {
  poligonoRegular,
  poligonoAnguloInterno,
  quadrilateroTipo,
  trianguloRetangulo,
  trianguloClassificacao,
  trianguloSemelhanca,
  trianguloRigidez,
  trianguloExistencia,
  anguloDiagrama,
  retasParalelasTransversal,
  planoCartesiano,
  circuloRaioDiametro,
  circunferenciaAnguloInscrito,
  figuraEspacial,
  planificacao,
  figurasCongruentes,
  figurasSemelhantes,
  simetriaLetra,
  transformacaoGeometrica,
  bissetriz,
  mediatriz,
  hexagonoRaioLado,
  mapaDirecoes,
  plantaBaixa,
  vistasOrtogonais,
} from "@/lib/svg-geometria";

export const ILUSTRACOES_SVG: Record<string, string> = {
  // ---- 1º ano ----
  "Uma bola de futebol tem o mesmo formato de qual figura espacial?": figuraEspacial("esfera"),
  "Uma caixa de sapato lembra qual figura geométrica espacial?": figuraEspacial("bloco-retangular"),
  "Qual figura não tem pontas (vértices)?": circuloRaioDiametro("nenhum"),
  "Qual destas figuras tem 3 lados?": poligonoRegular(3, "triângulo"),

  // ---- 2º ano ----
  "Qual destes objetos tem o formato de uma esfera?": figuraEspacial("esfera"),
  "Quantos lados tem um retângulo?": quadrilateroTipo("retangulo"),
  "Qual objeto tem o formato de um cone?": figuraEspacial("cone"),
  "Uma pizza inteira tem o formato de um:": circuloRaioDiametro("nenhum"),
  "Ao desenhar a planta da sala de aula, o que devemos indicar?": plantaBaixa(),
  "Um roteiro (croqui) serve para:": mapaDirecoes([{ dx: 2, dy: 1 }, { dx: 1, dy: 2 }]),

  // ---- 3º ano ----
  "Uma lata de leite em pó tem o formato de um:": figuraEspacial("cilindro"),
  "Qual figura tem 4 lados e 4 vértices?": quadrilateroTipo("quadrado"),
  "Para descrever como chegar da sala até o pátio, é útil usar:": mapaDirecoes([
    { dx: 1, dy: 2 },
    { dx: 2, dy: 0 },
  ]),
  "Um mapa simples de um bairro ajuda a:": mapaDirecoes([{ dx: 2, dy: 2 }]),
  "Um dado de jogar lembra qual figura espacial?": figuraEspacial("cubo"),
  "A planificação de um cubo é formada por quantos quadrados?": planificacao("cubo"),
  "Uma pirâmide, ao ser planificada, mostra faces em formato de:": planificacao("piramide-quadrada"),
  "Uma figura com 5 lados é chamada de:": poligonoRegular(5, "pentágono"),
  "Duas figuras são congruentes quando, ao serem sobrepostas, elas:": figurasCongruentes(),
  "Se dois triângulos têm exatamente o mesmo tamanho e formato, eles são:": figurasCongruentes(),

  // ---- 4º ano ----
  "Em um mapa, você anda 3 quadras para o norte e depois 2 para o leste. Em qual direção geral você está em relação ao ponto de partida?":
    mapaDirecoes([{ dx: 0, dy: 3 }, { dx: 2, dy: 0 }]),
  "O canto de uma folha de papel forma um ângulo de:": anguloDiagrama(90),
  "Qual destas letras tem simetria de reflexão (espelhada) na vertical?": simetriaLetra("A", true),
  "Em um mapa com malha quadriculada, andar 2 quadrados para a direita e 3 para cima leva você para:":
    mapaDirecoes([{ dx: 2, dy: 0 }, { dx: 0, dy: 3 }]),
  "A planificação de uma pirâmide de base quadrada tem quantas faces triangulares?": figuraEspacial("piramide"),
  "Um prisma de base triangular, ao ser planificado, mostra:": planificacao("prisma-triangular"),
  "Qual destes ângulos é reto?": anguloDiagrama(90),
  "Qual destas letras tem simetria de reflexão em relação a uma linha vertical central?": simetriaLetra("T", true),

  // ---- 5º ano ----
  "No plano cartesiano, o ponto (3, 2) é localizado andando quantas casas no eixo x e no eixo y a partir da origem?":
    planoCartesiano([{ x: 3, y: 2, label: "P" }]),
  "Um pentágono regular tem quantos lados?": poligonoRegular(5, "pentágono regular"),
  "Ao ampliar uma figura mantendo sua forma, o que acontece com os ângulos internos?": figurasSemelhantes(),
  "Em um mapa com escala, a legenda serve para:": mapaDirecoes([{ dx: 3, dy: 1 }]),
  "Para localizar um ponto em um mapa, geralmente usamos:": planoCartesiano([{ x: 4, y: 2, label: "X" }]),
  "No plano cartesiano, qual ponto está localizado em (0, 5)?": planoCartesiano([{ x: 0, y: 5, label: "P" }]),
  "A planificação de um cilindro é formada por:": planificacao("cilindro"),
  "Ao planificar um cone, obtemos:": planificacao("cone"),
  "Um hexágono regular tem quantos lados?": poligonoRegular(6, "hexágono regular"),
  "Ao reduzir uma figura mantendo sua forma, o que acontece com os ângulos internos?": figurasSemelhantes(),

  // ---- 6º ano ----
  "No plano cartesiano, qual par ordenado representa um ponto 4 unidades à direita e 3 acima da origem?":
    planoCartesiano([{ x: 4, y: 3, label: "P" }]),
  "Um hexágono tem quantos lados?": poligonoRegular(6, "hexágono"),
  "Um triângulo com todos os lados de medidas diferentes é chamado de:": trianguloClassificacao("escaleno"),
  "Um ângulo de 90° é chamado de:": anguloDiagrama(90),
  "Um ângulo maior que 90° e menor que 180° é chamado de:": anguloDiagrama(130),
  "Qual par ordenado representa um ponto 5 unidades à direita e 2 acima da origem?": planoCartesiano([
    { x: 5, y: 2, label: "P" },
  ]),
  "Um prisma de base quadrada tem quantas faces?": figuraEspacial("bloco-retangular"),
  "Uma pirâmide de base triangular tem quantos vértices?": figuraEspacial("piramide"),
  "Um octógono tem quantos lados?": poligonoRegular(8, "octógono"),
  "Um triângulo com dois lados de medidas iguais é chamado de:": trianguloClassificacao("isosceles"),
  "Um quadrilátero com todos os lados iguais e todos os ângulos retos é um:": quadrilateroTipo("quadrado"),
  "Um trapézio é um quadrilátero que tem:": quadrilateroTipo("trapezio"),
  "Ao ampliar uma figura em malha quadriculada multiplicando as medidas por 3, a nova figura fica:":
    figurasSemelhantes(),
  "Duas figuras semelhantes têm a mesma forma, mas podem ter tamanhos:": figurasSemelhantes(),
  "Duas retas que nunca se cruzam são chamadas de:": retasParalelasTransversal(),
  "Duas retas que se cruzam formando um ângulo de 90° são chamadas de:": anguloDiagrama(90),
  "A abertura formada por dois lados de um polígono que se encontram em um vértice é chamada de:":
    anguloDiagrama(70),
  "Quanto maior a abertura entre dois lados que se encontram em um vértice, maior é:": anguloDiagrama(120),
  "As pontas de uma tesoura aberta formam um exemplo do dia a dia de:": anguloDiagrama(45),
  "Um transferidor é usado para medir:": anguloDiagrama(60),
  "Uma planta baixa de uma casa mostra:": plantaBaixa(),
  "Uma vista aérea de uma escola mostra:": plantaBaixa(),

  // ---- 7º ano ----
  "O simétrico do ponto (3, 2) em relação ao eixo x é:": planoCartesiano(
    [
      { x: 3, y: 2, label: "P" },
      { x: 3, y: -2, label: "P'" },
    ],
    true
  ),
  "Quando duas retas paralelas são cortadas por uma transversal, os ângulos correspondentes são:":
    retasParalelasTransversal("correspondentes"),
  "Qual é a soma dos ângulos internos de qualquer triângulo?": trianguloClassificacao("escaleno"),
  "Qual é a medida de cada ângulo interno de um quadrado?": poligonoAnguloInterno(4, "90°"),
  "Se as coordenadas dos vértices de um triângulo são multiplicadas por 2, a nova figura fica:":
    figurasSemelhantes(),
  "Multiplicar as coordenadas de um polígono por −1 tem o efeito de:": planoCartesiano(
    [
      { x: 3, y: 2, label: "P" },
      { x: -3, y: -2, label: "P'" },
    ],
    true
  ),
  "Qual é o simétrico do ponto (−2, 5) em relação ao eixo y?": planoCartesiano(
    [
      { x: -2, y: 5, label: "P" },
      { x: 2, y: 5, label: "P'" },
    ],
    true
  ),
  "Ao reduzir um polígono pela metade em uma malha quadriculada, seus ângulos internos:": figurasSemelhantes(),
  "Se ampliamos um polígono na malha quadriculada mantendo a forma, o que NÃO muda?": figurasSemelhantes(),
  "Para construir uma circunferência com compasso, é necessário fixar:": circuloRaioDiametro("raio"),
  "Todos os pontos de uma circunferência têm em comum:": circuloRaioDiametro("raio"),
  "Duas retas paralelas cortadas por uma transversal formam ângulos alternos internos que são:":
    retasParalelasTransversal("alternos-internos"),
  "É possível formar um triângulo com lados de 2 cm, 3 cm e 10 cm?": trianguloExistencia(2, 3, 10),
  "A rigidez geométrica dos triângulos é aproveitada em construções como:": trianguloRigidez(),
  "Diferente de um quadrilátero, um triângulo com lados fixos:": trianguloRigidez(),
  "Para construir um triângulo conhecendo as medidas dos 3 lados, o primeiro passo costuma ser:":
    trianguloClassificacao("escaleno"),
  "Ao construir um triângulo com lados 5 cm, 5 cm e 5 cm, que tipo de triângulo obtemos?":
    trianguloClassificacao("equilatero"),
  "Qual é a medida de cada ângulo interno de um hexágono regular?": poligonoAnguloInterno(6, "120°"),
  "Para construir um pentágono regular conhecendo a medida do lado, um passo importante é calcular:":
    poligonoRegular(5, "pentágono regular"),

  // ---- 8º ano ----
  "Uma figura é deslizada para a direita, sem girar nem mudar de tamanho. Essa transformação geométrica é chamada de:":
    transformacaoGeometrica("translacao"),
  "A bissetriz de um ângulo é a reta que:": bissetriz(80),
  "Para provar que um paralelogramo tem lados opostos iguais, podemos usar:": quadrilateroTipo(
    "paralelogramo",
    true
  ),
  "Ao dividir um retângulo por uma diagonal, formamos dois triângulos que são:": quadrilateroTipo(
    "retangulo",
    true
  ),
  "Para construir um ângulo de 60° com régua e compasso, parte-se da construção de:": trianguloClassificacao(
    "equilatero"
  ),
  "Para construir um hexágono regular com compasso, a medida do raio da circunferência circunscrita é igual:":
    hexagonoRaioLado(),
  "Um algoritmo para desenhar um hexágono regular envolve dividir a circunferência em quantas partes iguais?":
    poligonoRegular(6, "hexágono regular"),
  "A bissetriz de um ângulo de 80° divide-o em dois ângulos de:": bissetriz(80),
  "Para encontrar o ponto que está à mesma distância de dois pontos A e B, usamos a construção da:": mediatriz(),
  "Girar uma figura 90° em torno de um ponto fixo é um exemplo de:": transformacaoGeometrica("rotacao"),

  // ---- 9º ano ----
  "Duas retas paralelas cortadas por uma transversal formam ângulos colaterais internos que são:":
    retasParalelasTransversal("colaterais-internos"),
  "Dois triângulos são semelhantes quando têm:": trianguloSemelhanca(),
  "Em um triângulo retângulo com catetos 3 cm e 4 cm, quanto mede a hipotenusa?": trianguloRetangulo(3, 4, {
    a: "3 cm",
    b: "4 cm",
    c: "?",
  }),
  "Uma escada de 5 m está apoiada em uma parede, com o pé a 3 m da parede. A que altura da parede ela chega?":
    trianguloRetangulo(3, 4, { a: "3 m", b: "?", c: "5 m" }),
  "Qual é o ponto médio do segmento entre A(2, 4) e B(6, 8)?": planoCartesiano(
    [
      { x: 2, y: 4, label: "A" },
      { x: 6, y: 8, label: "B" },
    ],
    true
  ),
  "Duas retas paralelas cortadas por uma transversal formam 8 ângulos. Quantos pares de ângulos correspondentes existem?":
    retasParalelasTransversal("correspondentes"),
  "Um ângulo inscrito em uma circunferência mede metade do:": circunferenciaAnguloInscrito(),
  "Se um arco mede 80°, o ângulo central correspondente mede:": circuloRaioDiametro("arco", 80),
  "Dois triângulos com os três ângulos correspondentes iguais são necessariamente:": trianguloSemelhanca(),
  "Em um triângulo retângulo, o quadrado da hipotenusa é igual a:": trianguloRetangulo(3, 4, {
    a: "cateto",
    b: "cateto",
    c: "hipotenusa",
  }),
  "Uma escada de 13 m está apoiada em uma parede, com o pé a 5 m da parede. A que altura ela chega?":
    trianguloRetangulo(5, 8, { a: "5 m", b: "?", c: "13 m" }),
  "Para construir um heptágono regular (7 lados), o ângulo central entre dois vértices consecutivos mede aproximadamente:":
    poligonoRegular(7, "heptágono"),
  "Qual é a distância entre os pontos A(0, 0) e B(3, 4)?": planoCartesiano([
    { x: 0, y: 0, label: "A" },
    { x: 3, y: 4, label: "B" },
  ]),
  "As vistas ortogonais de um objeto mostram:": vistasOrtogonais(),
  "Um desenho em perspectiva de um cubo ajuda a visualizar:": figuraEspacial("cubo"),
};
