// Rollout de ilustrações + atividades interativas (Fase 4) pras 34
// habilidades restantes (fora do piloto EF07MA01/08/18). Mesmo princípio do
// piloto: conteúdo curado por mim, nunca gravado direto sem passar por
// prisma/import-visuais-atividades-rollout.ts (com --dry-run antes).
import { retaNumerica, balanca, fluxograma, pizza, barras, duasCaixas, AZUL, VERDE, CINZA, CINZA_MEDIO } from "./svg-templates";

const VERMELHO = "#dc2626";
const LARANJA = "#f59e0b";
const CINZA_CLARO = "#94a3b8";

export const ilustracoes: Record<string, string> = {
  EF07MA03: retaNumerica("−8°C está mais longe do zero que 3 — mas é o menor", -15, 15, [
    { valor: -8, label: "−8°C", cor: VERMELHO },
    { valor: 3, label: "3", cor: VERDE },
  ]),

  EF07MA04: `<svg viewBox="0 0 400 240" width="400" height="240" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="22" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Regra dos sinais</text>
  <rect x="20" y="40" width="170" height="80" rx="10" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <text x="105" y="75" fill="${VERDE}" font-size="16" text-anchor="middle" font-weight="700">(+) × (+) = (+)</text>
  <text x="105" y="98" text-anchor="middle" font-size="20">🙂</text>
  <rect x="210" y="40" width="170" height="80" rx="10" fill="#fef2f2" stroke="${VERMELHO}" stroke-width="2"/>
  <text x="295" y="75" fill="${VERMELHO}" font-size="16" text-anchor="middle" font-weight="700">(+) × (−) = (−)</text>
  <text x="295" y="98" text-anchor="middle" font-size="20">🙁</text>
  <rect x="20" y="130" width="170" height="80" rx="10" fill="#fef2f2" stroke="${VERMELHO}" stroke-width="2"/>
  <text x="105" y="165" fill="${VERMELHO}" font-size="16" text-anchor="middle" font-weight="700">(−) × (+) = (−)</text>
  <text x="105" y="188" text-anchor="middle" font-size="20">🙁</text>
  <rect x="210" y="130" width="170" height="80" rx="10" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <text x="295" y="165" fill="${VERDE}" font-size="16" text-anchor="middle" font-weight="700">(−) × (−) = (+)</text>
  <text x="295" y="188" text-anchor="middle" font-size="20">🙂</text>
</svg>`,

  EF07MA10: retaNumerica("Racionais na reta: quanto mais à esquerda, menor", -3, 3, [
    { valor: -2.5, label: "−5/2", cor: VERMELHO },
    { valor: 0.5, label: "1/2", cor: VERDE },
  ]),

  EF07MA11: `<svg viewBox="0 0 340 220" width="340" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="170" y="22" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">2/3 × 1/4 — a área sobreposta</text>
  ${Array.from({ length: 3 }).map((_, col) => Array.from({ length: 4 }).map((_, row) => {
    const x = 40 + col * 60, y = 40 + row * 35;
    const colPintada = col < 2, linhaPintada = row === 0;
    const fill = colPintada && linhaPintada ? "#93c5fd" : colPintada ? "#dbeafe" : linhaPintada ? "#fef9c3" : "#fff";
    return `<rect x="${x}" y="${y}" width="58" height="33" fill="${fill}" stroke="#cbd5e1"/>`;
  }).join("")).join("")}
  <text x="170" y="200" fill="${CINZA_MEDIO}" font-size="12" text-anchor="middle">2 colunas de 3 (2/3) × 1 linha de 4 (1/4) = 2 quadrinhos de 12 → 2/12 = 1/6</text>
</svg>`,

  EF07MA12: fluxograma("Resolvendo em etapas: sobraram 5/8 depois de tirar 2/5", [
    "Ler o problema com calma",
    "Traduzir pra uma conta: subtração",
    "Igualar os denominadores",
    "Fazer a conta e simplificar o resultado",
  ]),

  EF07MA09: balanca("Razão como balança", "8 azuis", "12 rosa", "8:12 simplifica pra 2:3"),

  EF07MA17: `<svg viewBox="0 0 420 200" width="420" height="200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="210" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Direta (sobe junto) × Inversa (uma sobe, outra desce)</text>
  <rect x="10" y="35" width="190" height="150" rx="10" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <text x="105" y="55" fill="${VERDE}" font-size="13" text-anchor="middle" font-weight="700">Proporcional direta</text>
  <line x1="30" y1="165" x2="180" y2="55" stroke="${VERDE}" stroke-width="3"/>
  <line x1="30" y1="165" x2="180" y2="165" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="30" y1="165" x2="30" y2="55" stroke="#cbd5e1" stroke-width="1.5"/>
  <rect x="220" y="35" width="190" height="150" rx="10" fill="#eff6ff" stroke="${AZUL}" stroke-width="2"/>
  <text x="315" y="55" fill="${AZUL}" font-size="13" text-anchor="middle" font-weight="700">Proporcional inversa</text>
  <path d="M 240 60 Q 260 165 390 168" fill="none" stroke="${AZUL}" stroke-width="3"/>
  <line x1="240" y1="165" x2="390" y2="165" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="240" y1="165" x2="240" y2="55" stroke="#cbd5e1" stroke-width="1.5"/>
</svg>`,

  EF07MA02: fluxograma("Desconto de 20% em R$ 100,00", [
    "Preço original: R$ 100,00",
    "Desconto de 20% → multiplicar por 0,80",
    "100 × 0,80 = 80",
    "Preço final: R$ 80,00",
  ]),

  EF07MA05: duasCaixas(
    "Dois caminhos, mesmo resultado — 25 + 19",
    { titulo: "Caminho 1: tradicional", itens: ["Soma coluna por coluna", "com o \"vai um\""], cor: AZUL, corFundo: "#eff6ff", nota: "resultado: 44" },
    { titulo: "Caminho 2: decomposição", itens: ["20 + 5 e 10 + 9", "soma por partes"], cor: VERDE, corFundo: "#f0fdf4", nota: "resultado: 44" }
  ),

  EF07MA06: duasCaixas(
    "Mesma estrutura, contextos diferentes",
    { titulo: "8 balas, ganhei mais 5", itens: ["8 + 5"], cor: AZUL, corFundo: "#eff6ff", nota: "adição" },
    { titulo: "8 reais, ganhei mais 5", itens: ["8 + 5"], cor: VERDE, corFundo: "#f0fdf4", nota: "mesma conta!" }
  ),

  EF07MA07: fluxograma("As formas de um fluxograma", [
    "Início (oval)",
    "Fazer o cálculo (retângulo)",
    "A condição é verdadeira? (losango)",
    "Fim (oval)",
  ]),

  EF07MA13: `<svg viewBox="0 0 400 200" width="400" height="200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Variável × Incógnita</text>
  <rect x="10" y="35" width="180" height="150" rx="10" fill="#eff6ff" stroke="${AZUL}" stroke-width="2"/>
  <text x="100" y="58" fill="${AZUL}" font-size="14" text-anchor="middle" font-weight="700">l = variável</text>
  <rect x="30" y="75" width="20" height="20" fill="none" stroke="${AZUL}" stroke-width="2"/>
  <rect x="60" y="70" width="30" height="30" fill="none" stroke="${AZUL}" stroke-width="2"/>
  <rect x="100" y="65" width="40" height="40" fill="none" stroke="${AZUL}" stroke-width="2"/>
  <text x="100" y="150" fill="${AZUL}" font-size="11" text-anchor="middle">P = 4l — l pode ser qualquer valor</text>
  <rect x="210" y="35" width="180" height="150" rx="10" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <text x="300" y="58" fill="${VERDE}" font-size="14" text-anchor="middle" font-weight="700">x = incógnita</text>
  <rect x="280" y="75" width="30" height="30" fill="none" stroke="${VERDE}" stroke-width="2"/>
  <circle cx="315" cy="75" r="10" fill="none" stroke="${VERDE}" stroke-width="2"/>
  <line x1="322" y1="82" x2="330" y2="90" stroke="${VERDE}" stroke-width="2"/>
  <text x="300" y="150" fill="${VERDE}" font-size="11" text-anchor="middle">x + 5 = 12 — só um valor resolve</text>
</svg>`,

  EF07MA14: duasCaixas(
    "Recursiva × não recursiva",
    { titulo: "Recursiva", itens: ["anterior + 4", "precisa saber o termo de antes"], cor: AZUL, corFundo: "#eff6ff", nota: "passo a passo" },
    { titulo: "Não recursiva", itens: ["a(n) = 3n + 1", "calcula direto, sem os anteriores"], cor: VERDE, corFundo: "#f0fdf4", nota: "fórmula direta" }
  ),

  EF07MA15: `<svg viewBox="0 0 340 200" width="340" height="200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="170" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Sequência 2, 4, 6, 8... → a(n) = 2n</text>
  <rect x="60" y="40" width="220" height="130" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="1.5"/>
  <line x1="60" y1="70" x2="280" y2="70" stroke="#cbd5e1"/>
  <text x="100" y="60" fill="${CINZA_MEDIO}" font-size="12" text-anchor="middle" font-weight="700">n</text>
  <text x="220" y="60" fill="${CINZA_MEDIO}" font-size="12" text-anchor="middle" font-weight="700">valor</text>
  ${[1, 2, 3, 4].map((n, i) => `<text x="100" y="${95 + i * 24}" fill="${CINZA}" font-size="13" text-anchor="middle">${n}</text><text x="220" y="${95 + i * 24}" fill="${AZUL}" font-size="13" text-anchor="middle" font-weight="700">${n * 2}</text>`).join("")}
  <text x="170" y="190" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">diferença constante +2 entre cada valor</text>
</svg>`,

  EF07MA16: balanca("3(n+2) e 3n+6 — sempre equilibrada, pra qualquer n", "3(n+2)", "3n+6", "equivalentes: pesam igual sempre"),

  EF07MA19: `<svg viewBox="0 0 320 240" width="320" height="240" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="160" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Ampliando com k=2 (multiplica as coordenadas)</text>
  <line x1="40" y1="200" x2="300" y2="200" stroke="#94a3b8"/>
  <line x1="40" y1="200" x2="40" y2="40" stroke="#94a3b8"/>
  <polygon points="60,180 100,180 60,160" fill="#93c5fd" stroke="${AZUL}" stroke-width="2"/>
  <text x="60" y="195" fill="${AZUL}" font-size="10">A</text>
  <polygon points="80,180 160,180 80,140" fill="none" stroke="${VERDE}" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="160" y="195" fill="${VERDE}" font-size="11" font-weight="700">×2</text>
  <text x="160" y="225" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">triângulo pequeno → mesmo formato, o dobro do tamanho</text>
</svg>`,

  EF07MA20: `<svg viewBox="0 0 320 320" width="320" height="320" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="160" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Simetrias do ponto P</text>
  <line x1="20" y1="160" x2="300" y2="160" stroke="#94a3b8"/>
  <line x1="160" y1="20" x2="160" y2="300" stroke="#94a3b8"/>
  <circle cx="220" cy="110" r="6" fill="${AZUL}"/><text x="230" y="105" fill="${AZUL}" font-size="12" font-weight="700">P</text>
  <circle cx="220" cy="210" r="6" fill="${VERDE}"/><text x="230" y="225" fill="${VERDE}" font-size="11">eixo x</text>
  <circle cx="100" cy="110" r="6" fill="${LARANJA}"/><text x="60" y="105" fill="${LARANJA}" font-size="11">eixo y</text>
  <circle cx="100" cy="210" r="6" fill="${VERMELHO}"/><text x="55" y="225" fill="${VERMELHO}" font-size="11">origem</text>
  <line x1="220" y1="110" x2="220" y2="210" stroke="${VERDE}" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="220" y1="110" x2="100" y2="110" stroke="${LARANJA}" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="220" y1="110" x2="100" y2="210" stroke="${VERMELHO}" stroke-width="1.5" stroke-dasharray="3 2"/>
</svg>`,

  EF07MA21: `<svg viewBox="0 0 400 200" width="400" height="200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Ampliando na malha — razão k = 2</text>
  ${Array.from({ length: 5 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => `<rect x="${20 + c * 16}" y="${40 + r * 16}" width="16" height="16" fill="none" stroke="#e2e8f0"/>`).join("")).join("")}
  <rect x="20" y="72" width="64" height="48" fill="#93c5fd" fill-opacity="0.5" stroke="${AZUL}" stroke-width="2"/>
  ${Array.from({ length: 5 }).map((_, r) => Array.from({ length: 10 }).map((_, c) => `<rect x="${180 + c * 16}" y="${40 + r * 16}" width="16" height="16" fill="none" stroke="#e2e8f0"/>`).join("")).join("")}
  <rect x="180" y="56" width="128" height="80" fill="#86efac" fill-opacity="0.5" stroke="${VERDE}" stroke-width="2"/>
  <text x="52" y="140" fill="${AZUL}" font-size="12" text-anchor="middle">4 × 3</text>
  <text x="244" y="150" fill="${VERDE}" font-size="12" text-anchor="middle">8 × 6</text>
</svg>`,

  EF07MA22: `<svg viewBox="0 0 300 220" width="300" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="150" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Compasso desenhando a circunferência</text>
  <circle cx="150" cy="120" r="70" fill="none" stroke="${AZUL}" stroke-width="2" stroke-dasharray="4 3"/>
  <circle cx="150" cy="120" r="3" fill="${CINZA}"/>
  <text x="150" y="112" fill="${CINZA}" font-size="11" text-anchor="middle">O</text>
  <line x1="150" y1="120" x2="220" y2="120" stroke="${VERDE}" stroke-width="2"/>
  <text x="185" y="112" fill="${VERDE}" font-size="12" text-anchor="middle" font-weight="700">raio = 4 cm</text>
  <line x1="150" y1="120" x2="120" y2="40" stroke="#94a3b8" stroke-width="3"/>
  <line x1="150" y1="120" x2="105" y2="55" stroke="#94a3b8" stroke-width="3"/>
</svg>`,

  EF07MA23: `<svg viewBox="0 0 360 220" width="360" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="180" y="18" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Retas paralelas cortadas por uma transversal</text>
  <line x1="30" y1="70" x2="330" y2="70" stroke="${AZUL}" stroke-width="2"/>
  <line x1="30" y1="150" x2="330" y2="150" stroke="${AZUL}" stroke-width="2"/>
  <line x1="120" y1="30" x2="240" y2="190" stroke="${VERDE}" stroke-width="2"/>
  <text x="30" y="62" fill="${AZUL}" font-size="11">r</text>
  <text x="30" y="142" fill="${AZUL}" font-size="11">s</text>
  <text x="245" y="195" fill="${VERDE}" font-size="11">t</text>
  <text x="140" y="55" fill="${CINZA}" font-size="12" font-weight="700">1</text>
  <text x="175" y="90" fill="${CINZA}" font-size="12" font-weight="700">2</text>
  <text x="170" y="135" fill="${CINZA}" font-size="12" font-weight="700">5</text>
  <text x="205" y="170" fill="${CINZA}" font-size="12" font-weight="700">6</text>
  <text x="180" y="210" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">ângulo 1 = ângulo 5 (correspondentes) · ângulo 1 + ângulo 2 = 180°</text>
</svg>`,

  EF07MA24: duasCaixas(
    "Existe triângulo?",
    { titulo: "2 cm, 3 cm, 10 cm", itens: ["2 + 3 = 5", "5 < 10"], cor: VERMELHO, corFundo: "#fef2f2", nota: "✗ não forma" },
    { titulo: "5 cm, 6 cm, 8 cm", itens: ["5 + 6 = 11", "11 > 8"], cor: VERDE, corFundo: "#f0fdf4", nota: "✓ forma" }
  ),

  EF07MA25: duasCaixas(
    "Rigidez geométrica",
    { titulo: "Triângulo articulado", itens: ["empurra...", "...e volta igual"], cor: VERDE, corFundo: "#f0fdf4", nota: "✓ rígido" },
    { titulo: "Quadrado articulado", itens: ["empurra...", "...vira torto"], cor: VERMELHO, corFundo: "#fef2f2", nota: "✗ não é rígido" }
  ),

  EF07MA26: fluxograma("Construindo um triângulo com régua e compasso", [
    "Desenhar o segmento BC",
    "Traçar um arco a partir de B (medida de AB)",
    "Traçar um arco a partir de C (medida de AC)",
    "Marcar A onde os arcos se cruzam",
  ]),

  EF07MA27: `<svg viewBox="0 0 320 220" width="320" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="160" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Ângulo interno + externo = 180°</text>
  <polygon points="160,50 230,90 205,160 115,160 90,90" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <path d="M 195 150 A 20 20 0 0 1 215 165" fill="none" stroke="${AZUL}" stroke-width="2"/>
  <text x="225" y="150" fill="${AZUL}" font-size="12" font-weight="700">120°</text>
  <line x1="205" y1="160" x2="235" y2="175" stroke="${CINZA_CLARO}" stroke-width="1.5" stroke-dasharray="3 2"/>
  <path d="M 215 165 A 15 15 0 0 1 230 172" fill="none" stroke="${LARANJA}" stroke-width="2"/>
  <text x="245" y="180" fill="${LARANJA}" font-size="12" font-weight="700">60°</text>
  <text x="160" y="200" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">interno (120°) + externo (60°) = 180°</text>
</svg>`,

  EF07MA28: fluxograma("Construindo um polígono regular dado o lado", [
    "Calcular o ângulo externo: 360° ÷ nº de lados",
    "Traçar o primeiro lado",
    "Marcar o ângulo externo e traçar o próximo lado",
    "Repetir até fechar a figura",
  ]),

  EF07MA29: `<svg viewBox="0 0 480 140" width="480" height="140" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="240" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">A escada métrica — cada degrau é ×10</text>
  ${["km", "hm", "dam", "m", "dm", "cm", "mm"].map((u, i) => `<rect x="${20 + i * 65}" y="50" width="55" height="34" rx="6" fill="${i === 3 ? "#f0fdf4" : "#eff6ff"}" stroke="${i === 3 ? VERDE : AZUL}" stroke-width="2"/><text x="${47 + i * 65}" y="71" fill="${i === 3 ? VERDE : AZUL}" font-size="13" text-anchor="middle" font-weight="700">${u}</text>`).join("")}
  ${Array.from({ length: 6 }).map((_, i) => `<text x="${90 + i * 65}" y="45" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">×10</text>`).join("")}
  <text x="240" y="115" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">tempo é diferente: usa relações de 60 (h→min→s), não essa escada</text>
</svg>`,

  EF07MA30: `<svg viewBox="0 0 320 220" width="320" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="160" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Volume = camadas empilhadas</text>
  <g stroke="${AZUL}" stroke-width="1.5" fill="#dbeafe" fill-opacity="0.6">
    ${Array.from({ length: 3 }).map((_, camada) => Array.from({ length: 3 }).map((_, col) => Array.from({ length: 2 }).map((_, lin) => {
      const ox = 60 + col * 22 - lin * 10, oy = 150 - camada * 22 - lin * 10;
      return `<rect x="${ox}" y="${oy}" width="20" height="20"/>`;
    }).join("")).join("")).join("")}
  </g>
  <text x="160" y="195" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">1 camada = comprimento × largura · altura = quantas camadas</text>
</svg>`,

  EF07MA31: `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="160" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">2 triângulos iguais = 1 paralelogramo</text>
  <polygon points="60,150 140,150 100,60" fill="#93c5fd" stroke="${AZUL}" stroke-width="2"/>
  <polygon points="140,150 220,150 180,60" fill="#cbd5e1" stroke="${CINZA_MEDIO}" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="100" y="180" fill="${AZUL}" font-size="12" text-anchor="middle">triângulo</text>
  <text x="180" y="180" fill="${CINZA_MEDIO}" font-size="12" text-anchor="middle">cópia virada</text>
</svg>`,

  EF07MA32: `<svg viewBox="0 0 300 220" width="300" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="150" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Planta em L — dividida em 2 retângulos</text>
  <polygon points="40,40 180,40 180,110 240,110 240,180 40,180" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <line x1="40" y1="110" x2="180" y2="110" stroke="${AZUL}" stroke-width="2" stroke-dasharray="5 3"/>
  <text x="100" y="80" fill="${AZUL}" font-size="12" text-anchor="middle" font-weight="700">retângulo 1</text>
  <text x="150" y="150" fill="${VERDE}" font-size="12" text-anchor="middle" font-weight="700">retângulo 2</text>
</svg>`,

  EF07MA33: `<svg viewBox="0 0 400 160" width="400" height="160" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">Comprimento ÷ diâmetro ≈ 3,14 (π), sempre</text>
  <circle cx="80" cy="90" r="45" fill="none" stroke="${AZUL}" stroke-width="2"/>
  <line x1="35" y1="90" x2="125" y2="90" stroke="${VERDE}" stroke-width="2"/>
  <text x="80" y="145" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">diâmetro</text>
  <line x1="180" y1="90" x2="380" y2="90" stroke="${AZUL}" stroke-width="3" stroke-dasharray="6 3"/>
  <text x="280" y="75" fill="${AZUL}" font-size="11" text-anchor="middle">circunferência "desenrolada" ≈ 3,14 diâmetros</text>
</svg>`,

  EF07MA34: barras("30 lançamentos de um dado — nem sempre dá igual", [
    { label: "1", valor: 4, cor: AZUL },
    { label: "2", valor: 6, cor: AZUL },
    { label: "3", valor: 3, cor: AZUL },
    { label: "4", valor: 7, cor: AZUL },
    { label: "5", valor: 5, cor: AZUL },
    { label: "6", valor: 5, cor: AZUL },
  ]),

  EF07MA35: barras("Notas de Ana — a média é o equilíbrio", [
    { label: "P1", valor: 7, cor: AZUL },
    { label: "P2", valor: 8, cor: AZUL },
    { label: "P3", valor: 6, cor: AZUL },
    { label: "P4", valor: 9, cor: AZUL },
  ], 7.5),

  EF07MA36: fluxograma("Etapas de uma pesquisa", [
    "Pergunta de pesquisa",
    "Coleta de dados",
    "Tabela de frequência",
    "Gráfico",
    "Relatório com conclusões",
  ]),

  EF07MA37: pizza("Meio de transporte (200 alunos)", [
    { label: "Ônibus", pct: 45, cor: AZUL },
    { label: "A pé", pct: 25, cor: VERDE },
    { label: "Carro", pct: 20, cor: LARANJA },
    { label: "Bicicleta", pct: 10, cor: CINZA_CLARO },
  ]),
};

type Atividade =
  | { tipo: "ORDENACAO"; itens: string[] }
  | { tipo: "LIGAR_PARES"; pares: { esquerda: string; direita: string }[] }
  | { tipo: "CLASSIFICACAO"; categorias: string[]; itens: { texto: string; categoria: string }[] };

export const atividades: { habilidadeCodigo: string; questaoId: string; novoEnunciado: string; atividadeInterativa: Atividade }[] = [
  {
    habilidadeCodigo: "EF07MA03",
    questaoId: "cmtu6kk8c002bgmuvij926c2r",
    novoEnunciado: "Classifique cada número: ele é positivo ou negativo?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Positivo", "Negativo"],
      itens: [
        { texto: "−8", categoria: "Negativo" },
        { texto: "5", categoria: "Positivo" },
        { texto: "−1", categoria: "Negativo" },
        { texto: "12", categoria: "Positivo" },
        { texto: "−20", categoria: "Negativo" },
        { texto: "3", categoria: "Positivo" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA04",
    questaoId: "cmtu6klkp003ggmuvtw2eadnc",
    novoEnunciado: "Classifique cada conta: o resultado é positivo ou negativo?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Resultado positivo", "Resultado negativo"],
      itens: [
        { texto: "(−3) × (−4)", categoria: "Resultado positivo" },
        { texto: "5 × (−2)", categoria: "Resultado negativo" },
        { texto: "(−6) × 3", categoria: "Resultado negativo" },
        { texto: "(−8) × (−1)", categoria: "Resultado positivo" },
        { texto: "10 ÷ (−5)", categoria: "Resultado negativo" },
        { texto: "(−12) ÷ (−4)", categoria: "Resultado positivo" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA10",
    questaoId: "cmtu6ksub00aagmuv9pr1b33t",
    novoEnunciado: "Coloque esses números racionais em ordem crescente.",
    atividadeInterativa: { tipo: "ORDENACAO", itens: ["−3", "−1", "0", "1/2", "2"] },
  },
  {
    habilidadeCodigo: "EF07MA11",
    questaoId: "cmtu6ktyy00bfgmuv8lkolinl",
    novoEnunciado: "Ligue cada operação com frações ao seu resultado.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "1/2 × 1/3", direita: "1/6" },
        { esquerda: "2/3 ÷ 1/3", direita: "2" },
        { esquerda: "3/4 × 2/3", direita: "1/2" },
        { esquerda: "3/8 × 2/3", direita: "1/4" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA12",
    questaoId: "cmtu6kvju00ckgmuv9qpbzzch",
    novoEnunciado: "Coloque em ordem os passos para resolver o problema da barra de chocolate (3/4 − 1/4).",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Ana tinha 3/4 de uma barra", "Comeu 1/4 da barra", "Calcular 3/4 − 1/4 = 2/4", "Simplificar: 2/4 = 1/2 — sobrou meia barra"],
    },
  },
  {
    habilidadeCodigo: "EF07MA09",
    questaoId: "cmtu6krq00095gmuv6kr106kp",
    novoEnunciado: "Ligue cada razão à sua forma simplificada.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "4:8", direita: "1:2" },
        { esquerda: "6:9", direita: "2:3" },
        { esquerda: "5:20", direita: "1:4" },
        { esquerda: "9:12", direita: "3:4" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA17",
    questaoId: "cmtu6l1ht00i9gmuv6d34u9ba",
    novoEnunciado: "Classifique cada situação: proporcionalidade direta ou inversa?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Direta", "Inversa"],
      itens: [
        { texto: "Mais horas trabalhadas, mais dinheiro ganho", categoria: "Direta" },
        { texto: "Mais pessoas ajudando, menos tempo pra terminar", categoria: "Inversa" },
        { texto: "Mais litros de gasolina, maior o preço pago", categoria: "Direta" },
        { texto: "Mais velocidade, menos tempo de viagem", categoria: "Inversa" },
        { texto: "Mais quilos comprados, maior o preço total", categoria: "Direta" },
        { texto: "Mais torneiras abertas, menos tempo pra encher a caixa", categoria: "Inversa" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA02",
    questaoId: "cmtu6kisw0016gmuvga2pz58a",
    novoEnunciado: "Coloque em ordem os passos para calcular um desconto de 20% em R$ 100,00.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Preço original: R$ 100,00", "Desconto de 20%: multiplicar por 0,80", "100 × 0,80 = 80", "Preço final: R$ 80,00"],
    },
  },
  {
    habilidadeCodigo: "EF07MA05",
    questaoId: "cmtu6kmv7004lgmuv53cfdv1a",
    novoEnunciado: "Ligue cada forma de calcular ao exemplo dela.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Algoritmo tradicional", direita: "Somar coluna por coluna" },
        { esquerda: "Decomposição", direita: "25 = 20+5, 19 = 10+9, soma por partes" },
        { esquerda: "Cálculo mental", direita: "Arredondar 19 pra 20, somar e tirar 1" },
        { esquerda: "Calculadora", direita: "Digitar 25 + 19 e ler o resultado" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA06",
    questaoId: "cmtu6ko1w005qgmuv4flxwisd",
    novoEnunciado: "Ligue cada problema ao outro problema com a mesma estrutura matemática.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Tenho 8 balas e ganho mais 5", direita: "Tenho 8 reais e ganho mais 5" },
        { esquerda: "Tinha 20 figurinhas, dei 6", direita: "Tinha 20 reais, gastei 6" },
        { esquerda: "5 pacotes com 4 balas cada", direita: "5 caixas com 4 canetas cada" },
        { esquerda: "12 balas para 4 amigos", direita: "12 reais para 4 sacolas" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA07",
    questaoId: "cmtu6kpam006vgmuveb8ryp2j",
    novoEnunciado: "Coloque em ordem as formas de um fluxograma simples.",
    atividadeInterativa: { tipo: "ORDENACAO", itens: ["Início (oval)", "Fazer o cálculo (retângulo)", "A condição é verdadeira? (losango)", "Fim (oval)"] },
  },
  {
    habilidadeCodigo: "EF07MA13",
    questaoId: "cmtu6kwqo00dpgmuv0rxcyvfw",
    novoEnunciado: "Classifique cada uso da letra: é variável ou incógnita?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Variável", "Incógnita"],
      itens: [
        { texto: "P = 4l (l muda conforme o quadrado)", categoria: "Variável" },
        { texto: "x + 5 = 12 (só um x resolve)", categoria: "Incógnita" },
        { texto: "A = b×h (b e h podem ser qualquer valor)", categoria: "Variável" },
        { texto: "2x = 18 (só um valor é verdade)", categoria: "Incógnita" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA14",
    questaoId: "cmtu6ky0g00eugmuvh8q0bpc1",
    novoEnunciado: "Classifique cada regra de sequência: recursiva ou não recursiva?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Recursiva", "Não recursiva"],
      itens: [
        { texto: "Cada termo é o anterior mais 4", categoria: "Recursiva" },
        { texto: "a(n) = 3n + 1", categoria: "Não recursiva" },
        { texto: "Cada termo é o dobro do anterior", categoria: "Recursiva" },
        { texto: "a(n) = n²", categoria: "Não recursiva" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA15",
    questaoId: "cmtu6kz6600fzgmuvtuzjhtd0",
    novoEnunciado: "Coloque em ordem os passos para achar a fórmula da sequência 2, 4, 6, 8...",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Sequência: 2, 4, 6, 8...", "Diferença constante entre termos: +2", "Termo geral começa com 2n", "Conferir: a(1) = 2×1 = 2 ✓ → a(n) = 2n"],
    },
  },
  {
    habilidadeCodigo: "EF07MA16",
    questaoId: "cmtu6l0bj00h4gmuv7bfzet98",
    novoEnunciado: "Classifique cada par de expressões: são equivalentes ou não?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Equivalentes", "Não equivalentes"],
      itens: [
        { texto: "2(n+3) e 2n+6", categoria: "Equivalentes" },
        { texto: "n+5 e 5n", categoria: "Não equivalentes" },
        { texto: "3(n−1) e 3n−3", categoria: "Equivalentes" },
        { texto: "2n+4 e 2(n+4)", categoria: "Não equivalentes" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA19",
    questaoId: "cmtu6l3tu00kjgmuvu0fnjf8o",
    novoEnunciado: "Coloque em ordem os passos para ampliar o triângulo A(2,1) B(5,1) C(2,4) com k=2.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Ponto original A(2,1)", "Multiplicar cada coordenada por k=2", "Novo ponto: A'(4,2)", "Repetir para B e C e desenhar o novo triângulo"],
    },
  },
  {
    habilidadeCodigo: "EF07MA20",
    questaoId: "cmtu6l51000logmuvc4pl3441",
    novoEnunciado: "Ligue cada tipo de simetria ao que ela muda nas coordenadas.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Simetria em relação ao eixo x", direita: "Troca o sinal do y" },
        { esquerda: "Simetria em relação ao eixo y", direita: "Troca o sinal do x" },
        { esquerda: "Simetria em relação à origem", direita: "Troca o sinal dos dois" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA21",
    questaoId: "cmtu6l68900mtgmuv4cerpz8h",
    novoEnunciado: "Coloque em ordem os passos para ampliar um retângulo de 4×3 com razão 2.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Medir a figura original: 4 de largura × 3 de altura", "Escolher a razão k = 2", "Multiplicar cada medida por 2", "Nova figura: 8 de largura × 6 de altura"],
    },
  },
  {
    habilidadeCodigo: "EF07MA22",
    questaoId: "cmtu6l7p700nygmuv62d5qra4",
    novoEnunciado: "Ligue cada termo da circunferência à sua definição.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Raio", direita: "Distância do centro até a borda" },
        { esquerda: "Diâmetro", direita: "Distância entre dois pontos opostos, passando pelo centro" },
        { esquerda: "Circunferência", direita: "O contorno (linha) do círculo" },
        { esquerda: "Compasso", direita: "Instrumento usado para desenhar o círculo" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA23",
    questaoId: "cmtu6l8wi00p3gmuvc89uw1i4",
    novoEnunciado: "Classifique cada par de ângulos: são correspondentes (iguais) ou somam 180°?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Correspondentes (iguais)", "Somam 180° (adjacentes)"],
      itens: [
        { texto: "Ângulo 1 e ângulo 5", categoria: "Correspondentes (iguais)" },
        { texto: "Ângulo 2 e ângulo 6", categoria: "Correspondentes (iguais)" },
        { texto: "Ângulo 1 e ângulo 2", categoria: "Somam 180° (adjacentes)" },
        { texto: "Ângulo 5 e ângulo 6", categoria: "Somam 180° (adjacentes)" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA24",
    questaoId: "cmtu6la5200q8gmuv6z29slvl",
    novoEnunciado: "Classifique cada trio de medidas: forma triângulo ou não?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Forma triângulo", "Não forma triângulo"],
      itens: [
        { texto: "2 cm, 3 cm, 10 cm", categoria: "Não forma triângulo" },
        { texto: "5 cm, 6 cm, 8 cm", categoria: "Forma triângulo" },
        { texto: "1 cm, 2 cm, 3 cm", categoria: "Não forma triângulo" },
        { texto: "4 cm, 5 cm, 6 cm", categoria: "Forma triângulo" },
        { texto: "3 cm, 3 cm, 3 cm", categoria: "Forma triângulo" },
        { texto: "1 cm, 1 cm, 5 cm", categoria: "Não forma triângulo" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA25",
    questaoId: "cmtu6lbb300rdgmuvves3t594",
    novoEnunciado: "Ligue cada forma articulada à sua propriedade.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Triângulo articulado", direita: "Não muda de formato quando empurrado" },
        { esquerda: "Quadrado articulado", direita: "Vira paralelogramo torto quando empurrado" },
        { esquerda: "Portão sem reforço diagonal", direita: "Pode entortar com o tempo" },
        { esquerda: "Portão com reforço diagonal", direita: "Fica firme, não entorta" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA26",
    questaoId: "cmtu6lcjk00sigmuvohu604vp",
    novoEnunciado: "Coloque em ordem os passos para construir um triângulo com régua e compasso.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Desenhar o segmento BC", "Traçar um arco a partir de B (medida de AB)", "Traçar um arco a partir de C (medida de AC)", "Marcar A onde os arcos se cruzam e fechar o triângulo"],
    },
  },
  {
    habilidadeCodigo: "EF07MA27",
    questaoId: "cmtu6ldnq00tngmuvq8q2fhrj",
    novoEnunciado: "Coloque em ordem os passos para achar o ângulo interno de um polígono regular sem fórmula.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Andar pelo contorno, virando em cada vértice", "Somar todas as voltas: sempre dá 360°", "Dividir 360° pelo número de lados = ângulo externo", "Ângulo interno = 180° − ângulo externo"],
    },
  },
  {
    habilidadeCodigo: "EF07MA28",
    questaoId: "cmtu6letq00usgmuvp9k1gpyj",
    novoEnunciado: "Coloque em ordem os passos para construir um polígono regular dado o lado.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Calcular o ângulo externo: 360° ÷ número de lados", "Traçar o primeiro lado", "Marcar o ângulo externo e traçar o próximo lado", "Repetir até fechar a figura"],
    },
  },
  {
    habilidadeCodigo: "EF07MA29",
    questaoId: "cmtu6lfzo00vxgmuvspptpoih",
    novoEnunciado: "Classifique cada conversão: usa a escada métrica (×10) ou a relação de tempo (×60 ou ÷60)?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Escada métrica (×10)", "Relação de tempo (÷60 ou ×60)"],
      itens: [
        { texto: "km para m", categoria: "Escada métrica (×10)" },
        { texto: "horas para minutos", categoria: "Relação de tempo (÷60 ou ×60)" },
        { texto: "cm para mm", categoria: "Escada métrica (×10)" },
        { texto: "minutos para segundos", categoria: "Relação de tempo (÷60 ou ×60)" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA30",
    questaoId: "cmtu6lh5m00x2gmuviy9dnlho",
    novoEnunciado: "Coloque em ordem os passos para calcular o volume de um bloco retangular.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Medir comprimento, largura e altura do bloco", "Calcular uma camada: comprimento × largura", "Multiplicar pela altura (quantas camadas)", "Resultado é o volume em unidades cúbicas"],
    },
  },
  {
    habilidadeCodigo: "EF07MA31",
    questaoId: "cmtu6lia000y7gmuvwt0m3ygg",
    novoEnunciado: "Ligue cada figura à fórmula da sua área.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Triângulo", direita: "base × altura ÷ 2" },
        { esquerda: "Retângulo", direita: "base × altura" },
        { esquerda: "Losango", direita: "(diagonal maior × diagonal menor) ÷ 2" },
        { esquerda: "Quadrado", direita: "lado × lado" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA32",
    questaoId: "cmtu6ljxl00zcgmuv401poarm",
    novoEnunciado: "Coloque em ordem os passos para calcular a área de uma planta em formato de L.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Desenhar uma linha dividindo a planta em L em dois retângulos", "Calcular a área do retângulo 1", "Calcular a área do retângulo 2", "Somar as duas áreas para achar a área total"],
    },
  },
  {
    habilidadeCodigo: "EF07MA33",
    questaoId: "cmtu6ll3u010hgmuvkh6g7i5w",
    novoEnunciado: "Coloque em ordem os passos para descobrir π experimentalmente.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Medir o comprimento da circunferência com uma fita", "Medir o diâmetro do mesmo círculo", "Dividir comprimento ÷ diâmetro", "O resultado é sempre aproximadamente 3,14 (π)"],
    },
  },
  {
    habilidadeCodigo: "EF07MA34",
    questaoId: "cmtu6lm91011mgmuvon1jox8k",
    novoEnunciado: "Classifique cada evento ao lançar um dado comum: certo, possível ou impossível?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Certo", "Possível", "Impossível"],
      itens: [
        { texto: "Sair um número de 1 a 6", categoria: "Certo" },
        { texto: "Sair o número 4", categoria: "Possível" },
        { texto: "Sair o número 7", categoria: "Impossível" },
        { texto: "Sair um número par", categoria: "Possível" },
        { texto: "Sair um número maior que 10", categoria: "Impossível" },
      ],
    },
  },
  {
    habilidadeCodigo: "EF07MA35",
    questaoId: "cmtu6lne2012rgmuvix3l4sib",
    novoEnunciado: "Coloque em ordem os passos para calcular a média das notas de Ana (7, 8, 6, 9).",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Notas de Ana: 7, 8, 6 e 9", "Somar todas as notas: 7+8+6+9 = 30", "Contar quantas notas são: 4", "Dividir a soma pela quantidade: 30 ÷ 4 = 7,5"],
    },
  },
  {
    habilidadeCodigo: "EF07MA36",
    questaoId: "cmtu6lokw013wgmuvezs2k32c",
    novoEnunciado: "Coloque em ordem as etapas de uma pesquisa estatística.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: ["Pergunta de pesquisa", "Coleta de dados", "Tabela de frequência", "Gráfico", "Relatório com conclusões"],
    },
  },
  {
    habilidadeCodigo: "EF07MA37",
    questaoId: "cmtu6lpu40151gmuv6ikfnori",
    novoEnunciado: "Ligue cada meio de transporte à sua porcentagem no gráfico de setores.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Ônibus", direita: "45%" },
        { esquerda: "A pé", direita: "25%" },
        { esquerda: "Carro", direita: "20%" },
        { esquerda: "Bicicleta", direita: "10%" },
      ],
    },
  },
];
