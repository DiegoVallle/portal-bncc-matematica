// Geradores de ilustrações SVG para questões de Geometria.
// Funções puras que retornam uma string `<svg>...</svg>` completa, com coordenadas
// calculadas (não "chutadas"), para manter a precisão geométrica das figuras.

const AZUL = "#2563eb";
const AZUL_CLARO = "#93c5fd";
const CINZA = "#334155";
const CINZA_CLARO = "#cbd5e1";
const VERMELHO = "#dc2626";
const VERDE = "#059669";
const AMBAR = "#d97706";
const ROXO = "#7c3aed";

function wrap(inner: string, viewBox = "0 0 280 200", w = 280, h = 200): string {
  return `<svg viewBox="${viewBox}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">${inner}</svg>`;
}

function texto(x: number, y: number, conteudo: string, opts: { cor?: string; tamanho?: number; ancora?: string; peso?: string } = {}) {
  const { cor = CINZA, tamanho = 13, ancora = "middle", peso = "600" } = opts;
  return `<text x="${x}" y="${y}" fill="${cor}" font-size="${tamanho}" text-anchor="${ancora}" font-weight="${peso}">${conteudo}</text>`;
}

function verticesPoligonoRegular(n: number, cx: number, cy: number, raio: number, rotacaoGraus = -90) {
  const pontos: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angulo = ((rotacaoGraus + (360 / n) * i) * Math.PI) / 180;
    pontos.push([cx + raio * Math.cos(angulo), cy + raio * Math.sin(angulo)]);
  }
  return pontos;
}

function pontosToStr(pontos: [number, number][]) {
  return pontos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// ---------- Polígonos ----------

export function poligonoRegular(n: number, label?: string): string {
  const cx = 130,
    cy = 95,
    raio = 68;
  const pontos = verticesPoligonoRegular(n, cx, cy, raio);
  const inner = `
    <polygon points="${pontosToStr(pontos)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5" stroke-linejoin="round"/>
    ${pontos.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${AZUL}"/>`).join("")}
    ${label ? texto(cx, 180, label, { tamanho: 14 }) : ""}
  `;
  return wrap(inner);
}

export function poligonoAnguloInterno(n: number, valorGrau?: string): string {
  const cx = 130,
    cy = 95,
    raio = 68;
  const pontos = verticesPoligonoRegular(n, cx, cy, raio);
  // marca o ângulo no primeiro vértice
  const [vx, vy] = pontos[0];
  const [ax, ay] = pontos[n - 1];
  const [bx, by] = pontos[1];
  const arcoRaio = 20;
  const anguloA = Math.atan2(ay - vy, ax - vx);
  const anguloB = Math.atan2(by - vy, bx - vx);
  const arcoInner = `
    <path d="M ${vx + arcoRaio * Math.cos(anguloA)} ${vy + arcoRaio * Math.sin(anguloA)}
             A ${arcoRaio} ${arcoRaio} 0 0 1 ${vx + arcoRaio * Math.cos(anguloB)} ${vy + arcoRaio * Math.sin(anguloB)}"
          fill="none" stroke="${VERMELHO}" stroke-width="2.5"/>
  `;
  const inner = `
    <polygon points="${pontosToStr(pontos)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5" stroke-linejoin="round"/>
    ${arcoInner}
    ${valorGrau ? texto(vx + 34 * Math.cos((anguloA + anguloB) / 2), vy + 34 * Math.sin((anguloA + anguloB) / 2), valorGrau, { cor: VERMELHO, tamanho: 13 }) : ""}
  `;
  return wrap(inner);
}

export function quadrilateroTipo(tipo: "quadrado" | "retangulo" | "trapezio" | "paralelogramo", comDiagonal = false): string {
  let pontos: [number, number][];
  if (tipo === "quadrado") {
    pontos = [
      [80, 40],
      [200, 40],
      [200, 160],
      [80, 160],
    ];
  } else if (tipo === "retangulo") {
    pontos = [
      [50, 60],
      [230, 60],
      [230, 150],
      [50, 150],
    ];
  } else if (tipo === "trapezio") {
    pontos = [
      [90, 40],
      [190, 40],
      [230, 160],
      [50, 160],
    ];
  } else {
    pontos = [
      [90, 40],
      [230, 40],
      [190, 160],
      [50, 160],
    ];
  }
  const diagonal = comDiagonal ? `<line x1="${pontos[0][0]}" y1="${pontos[0][1]}" x2="${pontos[2][0]}" y2="${pontos[2][1]}" stroke="${VERMELHO}" stroke-width="2" stroke-dasharray="5 3"/>` : "";
  const inner = `
    <polygon points="${pontosToStr(pontos)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5" stroke-linejoin="round"/>
    ${diagonal}
  `;
  return wrap(inner);
}

// ---------- Triângulos ----------

export function trianguloRetangulo(catA: number, catB: number, labels?: { a?: string; b?: string; c?: string }): string {
  const escala = 100 / Math.max(catA, catB);
  const x0 = 50,
    y0 = 165;
  const x1 = x0 + catA * escala;
  const y1 = y0;
  const x2 = x0;
  const y2 = y0 - catB * escala;
  const inner = `
    <polygon points="${x0},${y0} ${x1},${y1} ${x2},${y2}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="${x0}" y="${y0 - 12}" width="12" height="12" fill="none" stroke="${CINZA}" stroke-width="1.5"/>
    ${texto((x0 + x1) / 2, y0 + 18, labels?.a ?? `${catA} cm`, { tamanho: 13 })}
    ${texto(x0 - 22, (y0 + y2) / 2, labels?.b ?? `${catB} cm`, { tamanho: 13 })}
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${VERMELHO}" stroke-width="2.5" stroke-dasharray="6 3"/>
    ${texto((x1 + x2) / 2 + 22, (y1 + y2) / 2 - 6, labels?.c ?? "?", { cor: VERMELHO, tamanho: 14 })}
  `;
  return wrap(inner);
}

export function trianguloClassificacao(tipo: "equilatero" | "isosceles" | "escaleno"): string {
  let pontos: [number, number][];
  if (tipo === "equilatero") {
    pontos = verticesPoligonoRegular(3, 140, 95, 70, -90);
  } else if (tipo === "isosceles") {
    pontos = [
      [140, 30],
      [200, 160],
      [80, 160],
    ];
  } else {
    pontos = [
      [90, 40],
      [230, 90],
      [110, 165],
    ];
  }
  const marcas =
    tipo === "equilatero"
      ? pontos
          .map(([x, y], i) => {
            const [nx, ny] = pontos[(i + 1) % 3];
            const mx = (x + nx) / 2,
              my = (y + ny) / 2;
            return `<circle cx="${mx}" cy="${my}" r="3" fill="${VERMELHO}"/>`;
          })
          .join("")
      : tipo === "isosceles"
        ? (() => {
            const m1 = [(pontos[0][0] + pontos[1][0]) / 2, (pontos[0][1] + pontos[1][1]) / 2];
            const m2 = [(pontos[0][0] + pontos[2][0]) / 2, (pontos[0][1] + pontos[2][1]) / 2];
            return `<circle cx="${m1[0]}" cy="${m1[1]}" r="3" fill="${VERMELHO}"/><circle cx="${m2[0]}" cy="${m2[1]}" r="3" fill="${VERMELHO}"/>`;
          })()
        : "";
  const inner = `
    <polygon points="${pontosToStr(pontos)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5" stroke-linejoin="round"/>
    ${marcas}
  `;
  return wrap(inner);
}

export function trianguloSemelhanca(): string {
  const p1 = verticesPoligonoRegular(3, 90, 130, 45, -90);
  const p2 = verticesPoligonoRegular(3, 205, 100, 75, -90);
  const arco = (cx: number, cy: number, p: [number, number], next: [number, number], prev: [number, number], r: number, cor: string) => {
    const a1 = Math.atan2(next[1] - cy, next[0] - cx);
    const a2 = Math.atan2(prev[1] - cy, prev[0] - cx);
    return `<path d="M ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}" fill="none" stroke="${cor}" stroke-width="2"/>`;
  };
  const inner = `
    <polygon points="${pontosToStr(p1)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
    <polygon points="${pontosToStr(p2)}" fill="${VERDE}" fill-opacity="0.15" stroke="${VERDE}" stroke-width="2.5"/>
    ${arco(p1[0][0], p1[0][1], p1[0], p1[1], p1[2], 14, VERMELHO)}
    ${arco(p2[0][0], p2[0][1], p2[0], p2[1], p2[2], 22, VERMELHO)}
  `;
  return wrap(inner);
}

export function trianguloRigidez(): string {
  const inner = `
    ${texto(65, 25, "Triângulo (rígido)", { tamanho: 12 })}
    <polygon points="20,110 110,110 65,35" fill="none" stroke="${AZUL}" stroke-width="3" stroke-linejoin="round"/>
    ${texto(205, 25, "Quadrilátero (não rígido)", { tamanho: 12 })}
    <polygon points="160,110 260,110 245,35 175,45" fill="none" stroke="${AMBAR}" stroke-width="3" stroke-linejoin="round" stroke-dasharray="1 0"/>
    <path d="M 175,45 L 260,110" stroke="${AMBAR}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6"/>
  `;
  return wrap(inner, "0 0 280 140", 280, 140);
}

export function trianguloExistencia(a: number, b: number, c: number): string {
  const escala = 130 / c;
  const inner = `
    <line x1="30" y1="140" x2="${30 + c * escala}" y2="140" stroke="${CINZA}" stroke-width="2.5"/>
    ${texto(30 + (c * escala) / 2, 158, `${c} cm`, { tamanho: 12 })}
    <path d="M 30,140 l ${a * escala},20" stroke="${AZUL}" stroke-width="2.5" stroke-dasharray="5 3" fill="none"/>
    ${texto(30 + (a * escala) / 2 - 10, 145, `${a} cm`, { cor: AZUL, tamanho: 11 })}
    <path d="M ${30 + c * escala},140 l -${b * escala},15" stroke="${ROXO}" stroke-width="2.5" stroke-dasharray="5 3" fill="none"/>
    ${texto(30 + c * escala - (b * escala) / 2 + 8, 145, `${b} cm`, { cor: ROXO, tamanho: 11 })}
    ${texto(140, 35, "Os dois lados menores não alcançam", { tamanho: 12, cor: VERMELHO })}
    ${texto(140, 52, "um ao outro — o triângulo não fecha", { tamanho: 12, cor: VERMELHO })}
  `;
  return wrap(inner);
}

// ---------- Ângulos e retas ----------

export function anguloDiagrama(graus: number): string {
  const cx = 50,
    cy = 160;
  const comprimento = 170;
  const rad = (graus * Math.PI) / 180;
  const x2 = cx + comprimento * Math.cos(0);
  const y2 = cy;
  const x3 = cx + comprimento * Math.cos(-rad);
  const y3 = cy - comprimento * Math.sin(rad);
  const arcoRaio = 34;
  const inner = `
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${CINZA}" stroke-width="2.5"/>
    <line x1="${cx}" y1="${cy}" x2="${x3}" y2="${y3}" stroke="${CINZA}" stroke-width="2.5"/>
    <path d="M ${cx + arcoRaio} ${cy} A ${arcoRaio} ${arcoRaio} 0 0 1 ${cx + arcoRaio * Math.cos(rad)} ${cy - arcoRaio * Math.sin(rad)}" fill="none" stroke="${VERMELHO}" stroke-width="2.5"/>
    ${texto(cx + 55, cy - 20, `${graus}°`, { cor: VERMELHO, tamanho: 15 })}
    <circle cx="${cx}" cy="${cy}" r="3" fill="${CINZA}"/>
  `;
  return wrap(inner);
}

export function retasParalelasTransversal(destaque?: "correspondentes" | "alternos-internos" | "colaterais-internos"): string {
  const y1 = 60,
    y2 = 150;
  const x1 = 30,
    x2 = 250;
  // transversal cruzando as duas retas
  const tx1 = 70,
    ty1 = 15,
    tx2 = 210,
    ty2 = 195;
  const inter1 = { x: 70 + ((210 - 70) * (60 - 15)) / (195 - 15), y: 60 };
  const inter2 = { x: 70 + ((210 - 70) * (150 - 15)) / (195 - 15), y: 150 };

  function marcador(cx: number, cy: number, idx: number, cor: string) {
    const offsets: [number, number][] = [
      [-22, -14],
      [16, -14],
      [-22, 16],
      [16, 16],
    ];
    const [ox, oy] = offsets[idx];
    return `<circle cx="${cx + ox}" cy="${cy + oy}" r="10" fill="${cor}" fill-opacity="0.85"/>${texto(cx + ox, cy + oy + 4, `${idx + 1}`, { cor: "#fff", tamanho: 11 })}`;
  }

  let marcados = "";
  if (destaque === "correspondentes") {
    marcados = marcador(inter1.x, inter1.y, 1, VERMELHO) + marcador(inter2.x, inter2.y, 1, VERMELHO);
  } else if (destaque === "alternos-internos") {
    marcados = marcador(inter1.x, inter1.y, 3, VERMELHO) + marcador(inter2.x, inter2.y, 1, VERMELHO);
  } else if (destaque === "colaterais-internos") {
    marcados = marcador(inter1.x, inter1.y, 3, VERMELHO) + marcador(inter2.x, inter2.y, 0, VERMELHO);
  }

  const inner = `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y1}" stroke="${AZUL}" stroke-width="2.5"/>
    <line x1="${x1}" y1="${y2}" x2="${x2}" y2="${y2}" stroke="${AZUL}" stroke-width="2.5"/>
    <path d="M ${x1 - 8} ${y1 - 6} l 14 0" stroke="${AZUL}" stroke-width="2"/>
    <path d="M ${x1 - 8} ${y2 - 6} l 14 0" stroke="${AZUL}" stroke-width="2"/>
    <line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="${CINZA}" stroke-width="2.5"/>
    ${marcados}
  `;
  return wrap(inner);
}

// ---------- Plano cartesiano ----------

export function planoCartesiano(pontos: { x: number; y: number; label: string }[], todosQuadrantes = false): string {
  const origemX = todosQuadrantes ? 140 : 40;
  const origemY = todosQuadrantes ? 100 : 170;
  const escala = 20;
  const min = todosQuadrantes ? -5 : 0;
  const max = todosQuadrantes ? 5 : 10;
  let grid = "";
  for (let i = min; i <= max; i++) {
    const gx = origemX + i * escala;
    const gy = origemY - i * escala;
    grid += `<line x1="${gx}" y1="${origemY - (max - min) * escala + (todosQuadrantes ? (max - min) * escala : 0)}" x2="${gx}" y2="${origemY}" stroke="${CINZA_CLARO}" stroke-width="1"/>`;
  }
  const eixoX = `<line x1="${origemX + min * escala}" y1="${origemY}" x2="${origemX + max * escala}" y2="${origemY}" stroke="${CINZA}" stroke-width="2"/><polygon points="${origemX + max * escala},${origemY} ${origemX + max * escala - 8},${origemY - 4} ${origemX + max * escala - 8},${origemY + 4}" fill="${CINZA}"/>`;
  const eixoY = `<line x1="${origemX}" y1="${origemY - max * escala}" x2="${origemX}" y2="${origemY - min * escala}" stroke="${CINZA}" stroke-width="2"/><polygon points="${origemX},${origemY - max * escala} ${origemX - 4},${origemY - max * escala + 8} ${origemX + 4},${origemY - max * escala + 8}" fill="${CINZA}"/>`;

  const marcas = pontos
    .map((p) => {
      const px = origemX + p.x * escala;
      const py = origemY - p.y * escala;
      return `<circle cx="${px}" cy="${py}" r="5" fill="${VERMELHO}"/>${texto(px + 14, py - 8, `${p.label} (${p.x},${p.y})`, { cor: VERMELHO, tamanho: 12, ancora: "start" })}`;
    })
    .join("");

  const linhaEntrePontos =
    pontos.length === 2
      ? `<line x1="${origemX + pontos[0].x * escala}" y1="${origemY - pontos[0].y * escala}" x2="${origemX + pontos[1].x * escala}" y2="${origemY - pontos[1].y * escala}" stroke="${AZUL}" stroke-width="2" stroke-dasharray="5 3"/>`
      : "";

  const inner = `
    ${eixoX}${eixoY}
    ${texto(origemX + max * escala + 10, origemY + 4, "x", { tamanho: 12 })}
    ${texto(origemX - 6, origemY - max * escala - 6, "y", { tamanho: 12 })}
    ${linhaEntrePontos}
    ${marcas}
  `;
  return wrap(inner);
}

// ---------- Círculo ----------

export function circuloRaioDiametro(mostrar: "raio" | "diametro" | "ambos" | "arco" | "nenhum", arcoGraus?: number): string {
  const cx = 130,
    cy = 100,
    r = 65;
  let extras = "";
  if (mostrar === "raio" || mostrar === "ambos") {
    extras += `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${VERMELHO}" stroke-width="2.5"/>${texto(cx + r / 2, cy - 8, "raio", { cor: VERMELHO, tamanho: 12 })}`;
  }
  if (mostrar === "diametro" || mostrar === "ambos") {
    extras += `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${AMBAR}" stroke-width="2.5"/>${texto(cx, cy + 20, "diâmetro", { cor: AMBAR, tamanho: 12 })}`;
  }
  if (mostrar === "arco" && arcoGraus) {
    const rad = (arcoGraus * Math.PI) / 180;
    const x2 = cx + r * Math.cos(-rad);
    const y2 = cy + r * Math.sin(-rad);
    extras = `
      <line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="${CINZA}" stroke-width="2"/>
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${CINZA}" stroke-width="2"/>
      <path d="M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${x2} ${y2}" fill="none" stroke="${VERMELHO}" stroke-width="4"/>
      ${texto(cx + 30, cy - 30, `${arcoGraus}°`, { cor: VERMELHO, tamanho: 14 })}
    `;
  }
  const inner = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2.5"/>
    <circle cx="${cx}" cy="${cy}" r="2.5" fill="${CINZA}"/>
    ${extras}
  `;
  return wrap(inner);
}

export function circunferenciaAnguloInscrito(): string {
  const cx = 130,
    cy = 100,
    r = 65;
  const a1 = -100,
    a2 = 20;
  const p1 = [cx + r * Math.cos((a1 * Math.PI) / 180), cy + r * Math.sin((a1 * Math.PI) / 180)];
  const p2 = [cx + r * Math.cos((a2 * Math.PI) / 180), cy + r * Math.sin((a2 * Math.PI) / 180)];
  const p3 = [cx + r * Math.cos((200 * Math.PI) / 180), cy + r * Math.sin((200 * Math.PI) / 180)];
  const inner = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CINZA_CLARO}" stroke-width="2"/>
    <path d="M ${p1[0]} ${p1[1]} A ${r} ${r} 0 0 1 ${p2[0]} ${p2[1]}" fill="none" stroke="${VERMELHO}" stroke-width="4"/>
    <line x1="${cx}" y1="${cy}" x2="${p1[0]}" y2="${p1[1]}" stroke="${AZUL}" stroke-width="2"/>
    <line x1="${cx}" y1="${cy}" x2="${p2[0]}" y2="${p2[1]}" stroke="${AZUL}" stroke-width="2"/>
    ${texto(cx, cy - 12, "central", { cor: AZUL, tamanho: 11 })}
    <line x1="${p3[0]}" y1="${p3[1]}" x2="${p1[0]}" y2="${p1[1]}" stroke="${VERDE}" stroke-width="2"/>
    <line x1="${p3[0]}" y1="${p3[1]}" x2="${p2[0]}" y2="${p2[1]}" stroke="${VERDE}" stroke-width="2"/>
    ${texto(p3[0], p3[1] + 16, "inscrito", { cor: VERDE, tamanho: 11 })}
  `;
  return wrap(inner);
}

// ---------- Figuras espaciais ----------

export function figuraEspacial(tipo: "esfera" | "cubo" | "bloco-retangular" | "cone" | "cilindro" | "piramide" | "prisma-triangular"): string {
  let inner = "";
  if (tipo === "esfera") {
    inner = `
      <circle cx="130" cy="100" r="65" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
      <ellipse cx="130" cy="100" rx="65" ry="20" fill="none" stroke="${AZUL}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>
    `;
  } else if (tipo === "cubo") {
    const s = 90,
      d = 34,
      x0 = 60,
      y0 = 110;
    inner = `
      <polygon points="${x0},${y0} ${x0 + s},${y0} ${x0 + s},${y0 - s} ${x0},${y0 - s}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
      <polygon points="${x0},${y0 - s} ${x0 + d},${y0 - s - d} ${x0 + s + d},${y0 - s - d} ${x0 + s},${y0 - s}" fill="${AZUL_CLARO}" fill-opacity="0.55" stroke="${AZUL}" stroke-width="2.5"/>
      <polygon points="${x0 + s},${y0} ${x0 + s + d},${y0 - d} ${x0 + s + d},${y0 - s - d} ${x0 + s},${y0 - s}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2.5"/>
    `;
  } else if (tipo === "bloco-retangular") {
    const w = 110,
      h = 65,
      d = 34,
      x0 = 45,
      y0 = 130;
    inner = `
      <polygon points="${x0},${y0} ${x0 + w},${y0} ${x0 + w},${y0 - h} ${x0},${y0 - h}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
      <polygon points="${x0},${y0 - h} ${x0 + d},${y0 - h - d} ${x0 + w + d},${y0 - h - d} ${x0 + w},${y0 - h}" fill="${AZUL_CLARO}" fill-opacity="0.55" stroke="${AZUL}" stroke-width="2.5"/>
      <polygon points="${x0 + w},${y0} ${x0 + w + d},${y0 - d} ${x0 + w + d},${y0 - h - d} ${x0 + w},${y0 - h}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2.5"/>
    `;
  } else if (tipo === "cone") {
    inner = `
      <ellipse cx="130" cy="150" rx="60" ry="18" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
      <path d="M 70 150 L 130 35 L 190 150" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2.5"/>
    `;
  } else if (tipo === "cilindro") {
    inner = `
      <ellipse cx="130" cy="45" rx="60" ry="18" fill="${AZUL_CLARO}" fill-opacity="0.55" stroke="${AZUL}" stroke-width="2.5"/>
      <line x1="70" y1="45" x2="70" y2="150" stroke="${AZUL}" stroke-width="2.5"/>
      <line x1="190" y1="45" x2="190" y2="150" stroke="${AZUL}" stroke-width="2.5"/>
      <path d="M 70 150 A 60 18 0 0 0 190 150" fill="none" stroke="${AZUL}" stroke-width="2.5"/>
      <ellipse cx="130" cy="150" rx="60" ry="18" fill="${AZUL_CLARO}" fill-opacity="0.15" stroke="none"/>
    `;
  } else if (tipo === "piramide") {
    inner = `
      <polygon points="60,150 200,150 165,120 95,120" fill="${AZUL_CLARO}" fill-opacity="0.25" stroke="${AZUL}" stroke-width="2.5"/>
      <path d="M 130 30 L 60 150 M 130 30 L 200 150 M 130 30 L 95 120 M 130 30 L 165 120" stroke="${AZUL}" stroke-width="2.5" fill="none"/>
    `;
  } else {
    inner = `
      <polygon points="60,150 140,150 100,80" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2.5"/>
      <polygon points="120,120 200,120 160,50" fill="${AZUL_CLARO}" fill-opacity="0.45" stroke="${AZUL}" stroke-width="2.5"/>
      <line x1="60" y1="150" x2="120" y2="120" stroke="${AZUL}" stroke-width="2.5"/>
      <line x1="140" y1="150" x2="200" y2="120" stroke="${AZUL}" stroke-width="2.5"/>
      <line x1="100" y1="80" x2="160" y2="50" stroke="${AZUL}" stroke-width="2.5"/>
    `;
  }
  return wrap(inner);
}

export function planificacao(tipo: "cubo" | "piramide-quadrada" | "cilindro" | "cone" | "prisma-triangular"): string {
  let inner = "";
  if (tipo === "cubo") {
    const s = 38;
    const cols = [1, 0, 1, 2, 3];
    inner = cols
      .map((col, row) => {
        if (col < 0) return "";
        const x = 40 + col * s;
        const y = 10 + row * s;
        return `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>`;
      })
      .join("");
  } else if (tipo === "piramide-quadrada") {
    const cx = 140,
      cy = 110,
      s = 60;
    inner = `
      <rect x="${cx - s / 2}" y="${cy - s / 2}" width="${s}" height="${s}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
      <polygon points="${cx - s / 2},${cy - s / 2} ${cx + s / 2},${cy - s / 2} ${cx},${cy - s / 2 - 45}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
      <polygon points="${cx + s / 2},${cy - s / 2} ${cx + s / 2},${cy + s / 2} ${cx + s / 2 + 45},${cy}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
      <polygon points="${cx - s / 2},${cy + s / 2} ${cx + s / 2},${cy + s / 2} ${cx},${cy + s / 2 + 45}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
      <polygon points="${cx - s / 2},${cy - s / 2} ${cx - s / 2},${cy + s / 2} ${cx - s / 2 - 45},${cy}" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
    `;
  } else if (tipo === "cilindro") {
    inner = `
      <circle cx="55" cy="55" r="30" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
      <rect x="100" y="25" width="130" height="60" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
      <circle cx="55" cy="140" r="30" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
    `;
  } else if (tipo === "cone") {
    inner = `
      <circle cx="60" cy="150" r="30" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
      <path d="M 160 150 L 210 30 A 130 130 0 0 0 110 30 Z" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
    `;
  } else {
    inner = `
      <polygon points="20,100 60,30 100,100" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
      <rect x="100" y="40" width="55" height="60" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
      <rect x="155" y="40" width="55" height="60" fill="${AZUL_CLARO}" fill-opacity="0.2" stroke="${AZUL}" stroke-width="2"/>
      <polygon points="210,100 250,30 210,-40" fill="none" stroke="none"/>
      <polygon points="210,40 265,55 210,100" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
    `;
  }
  return wrap(inner, "0 0 280 180", 280, 180);
}

// ---------- Congruência, semelhança, simetria, transformações ----------

export function figurasCongruentes(): string {
  const p1 = [
    [40, 150],
    [110, 150],
    [110, 80],
    [40, 80],
  ] as [number, number][];
  const p2 = [
    [170, 150],
    [240, 150],
    [240, 80],
    [170, 80],
  ] as [number, number][];
  const inner = `
    <polygon points="${pontosToStr(p1)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
    <polygon points="${pontosToStr(p2)}" fill="${VERDE}" fill-opacity="0.2" stroke="${VERDE}" stroke-width="2.5"/>
    ${texto(75, 40, "mesmo tamanho e forma", { tamanho: 12 })}
  `;
  return wrap(inner);
}

export function figurasSemelhantes(): string {
  const p1 = verticesPoligonoRegular(3, 65, 130, 35, -90);
  const p2 = verticesPoligonoRegular(3, 190, 105, 70, -90);
  const inner = `
    <polygon points="${pontosToStr(p1)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
    <polygon points="${pontosToStr(p2)}" fill="${VERDE}" fill-opacity="0.2" stroke="${VERDE}" stroke-width="2.5"/>
  `;
  return wrap(inner);
}

export function simetriaLetra(letra: string, temSimetria: boolean): string {
  const inner = `
    <line x1="140" y1="15" x2="140" y2="185" stroke="${VERMELHO}" stroke-width="2" stroke-dasharray="6 4"/>
    ${texto(140, 195, "eixo de simetria", { cor: VERMELHO, tamanho: 11 })}
    <text x="140" y="140" fill="${CINZA}" font-size="130" text-anchor="middle" font-weight="700" font-family="Georgia, serif">${letra}</text>
    ${!temSimetria ? texto(140, 15, "(assimétrica)", { cor: AMBAR, tamanho: 11 }) : ""}
  `;
  return wrap(inner);
}

export function transformacaoGeometrica(tipo: "translacao" | "rotacao" | "reflexao"): string {
  let original: [number, number][] = [
    [40, 150],
    [90, 150],
    [90, 100],
    [40, 100],
  ];
  let transformada: [number, number][];
  let seta = "";
  if (tipo === "translacao") {
    transformada = original.map(([x, y]) => [x + 130, y] as [number, number]);
    seta = `<line x1="100" y1="125" x2="160" y2="125" stroke="${CINZA}" stroke-width="2" marker-end="url(#arrow)"/>`;
  } else if (tipo === "reflexao") {
    transformada = original.map(([x, y]) => [280 - x, y] as [number, number]);
    seta = `<line x1="140" y1="60" x2="140" y2="180" stroke="${VERMELHO}" stroke-width="2" stroke-dasharray="5 3"/>`;
  } else {
    transformada = [
      [190, 100],
      [190, 150],
      [140, 150],
      [140, 100],
    ];
    seta = `<path d="M 95 90 A 40 40 0 0 1 150 95" fill="none" stroke="${CINZA}" stroke-width="2" marker-end="url(#arrow)"/>`;
  }
  const inner = `
    <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${CINZA}"/></marker></defs>
    <polygon points="${pontosToStr(original)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
    <polygon points="${pontosToStr(transformada)}" fill="${VERDE}" fill-opacity="0.2" stroke="${VERDE}" stroke-width="2.5" stroke-dasharray="4 3"/>
    ${seta}
  `;
  return wrap(inner);
}

// ---------- Construções (bissetriz, mediatriz, compasso, hexágono) ----------

export function bissetriz(graus: number): string {
  const cx = 50,
    cy = 160,
    comp = 170;
  const x2 = cx + comp;
  const rad = (graus * Math.PI) / 180;
  const x3 = cx + comp * Math.cos(-rad);
  const y3 = cy - comp * Math.sin(rad);
  const metadeRad = rad / 2;
  const xm = cx + comp * Math.cos(-metadeRad);
  const ym = cy - comp * Math.sin(metadeRad);
  const inner = `
    <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${cy}" stroke="${CINZA}" stroke-width="2.5"/>
    <line x1="${cx}" y1="${cy}" x2="${x3}" y2="${y3}" stroke="${CINZA}" stroke-width="2.5"/>
    <line x1="${cx}" y1="${cy}" x2="${xm}" y2="${ym}" stroke="${VERMELHO}" stroke-width="2.5" stroke-dasharray="6 3"/>
    <path d="M ${cx + 30} ${cy} A 30 30 0 0 1 ${cx + 30 * Math.cos(-metadeRad)} ${cy - 30 * Math.sin(metadeRad)}" fill="none" stroke="${AZUL}" stroke-width="2"/>
    <path d="M ${cx + 30 * Math.cos(-metadeRad)} ${cy - 30 * Math.sin(metadeRad)} A 30 30 0 0 1 ${cx + 30 * Math.cos(-rad)} ${cy - 30 * Math.sin(rad)}" fill="none" stroke="${AZUL}" stroke-width="2"/>
    ${texto(cx + 40, cy - 12, `${graus / 2}°`, { cor: AZUL, tamanho: 12 })}
    ${texto(cx + 40, cy - 42, `${graus / 2}°`, { cor: AZUL, tamanho: 12 })}
  `;
  return wrap(inner);
}

export function mediatriz(): string {
  const ax = 50,
    ay = 100,
    bx = 230,
    by = 100;
  const mx = (ax + bx) / 2;
  const inner = `
    <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${CINZA}" stroke-width="2.5"/>
    <circle cx="${ax}" cy="${ay}" r="4" fill="${CINZA}"/><circle cx="${bx}" cy="${by}" r="4" fill="${CINZA}"/>
    ${texto(ax, ay - 12, "A", { tamanho: 13 })}${texto(bx, by - 12, "B", { tamanho: 13 })}
    <line x1="${mx}" y1="20" x2="${mx}" y2="180" stroke="${VERMELHO}" stroke-width="2.5" stroke-dasharray="6 3"/>
    <circle cx="${mx}" cy="40" r="4" fill="${VERMELHO}"/>
    <line x1="${mx}" y1="40" x2="${ax}" y2="${ay}" stroke="${AZUL}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <line x1="${mx}" y1="40" x2="${bx}" y2="${by}" stroke="${AZUL}" stroke-width="1.5" stroke-dasharray="3 3"/>
    ${texto(mx, 200, "mediatriz de AB", { cor: VERMELHO, tamanho: 12 })}
  `;
  return wrap(inner, "0 0 280 210", 280, 210);
}

export function hexagonoRaioLado(): string {
  const cx = 130,
    cy = 100,
    r = 65;
  const pontos = verticesPoligonoRegular(6, cx, cy, r, -90);
  const inner = `
    <polygon points="${pontosToStr(pontos)}" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2.5"/>
    <line x1="${cx}" y1="${cy}" x2="${pontos[0][0]}" y2="${pontos[0][1]}" stroke="${VERMELHO}" stroke-width="2.5"/>
    <line x1="${pontos[0][0]}" y1="${pontos[0][1]}" x2="${pontos[1][0]}" y2="${pontos[1][1]}" stroke="${VERDE}" stroke-width="3"/>
    ${texto(cx + 15, cy - 25, "raio", { cor: VERMELHO, tamanho: 12 })}
    ${texto((pontos[0][0] + pontos[1][0]) / 2 + 18, (pontos[0][1] + pontos[1][1]) / 2, "lado", { cor: VERDE, tamanho: 12 })}
  `;
  return wrap(inner);
}

// ---------- Relógio, mapas, planta baixa, malha, vistas ----------

export function mapaDirecoes(passos: { dx: number; dy: number }[]): string {
  const escala = 30;
  let x = 40,
    y = 170;
  let path = `M ${x} ${y}`;
  for (const p of passos) {
    x += p.dx * escala;
    y -= p.dy * escala;
    path += ` L ${x} ${y}`;
  }
  let grid = "";
  for (let i = 0; i <= 7; i++) {
    grid += `<line x1="${20 + i * escala}" y1="20" x2="${20 + i * escala}" y2="190" stroke="${CINZA_CLARO}" stroke-width="1"/>`;
    grid += `<line x1="20" y1="${20 + i * escala * 0.85}" x2="230" y2="${20 + i * escala * 0.85}" stroke="${CINZA_CLARO}" stroke-width="1"/>`;
  }
  const inner = `
    ${grid}
    ${texto(255, 20, "N", { tamanho: 13, cor: CINZA })}
    <path d="M 255 40 l 0 -14 m -5 5 l 5 -5 l 5 5" stroke="${CINZA}" stroke-width="1.5" fill="none"/>
    <path d="${path}" fill="none" stroke="${VERMELHO}" stroke-width="3" marker-end="url(#arrow2)"/>
    <defs><marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${VERMELHO}"/></marker></defs>
    <circle cx="40" cy="170" r="5" fill="${VERDE}"/>
    ${texto(40, 190, "início", { cor: VERDE, tamanho: 11 })}
  `;
  return wrap(inner);
}

export function plantaBaixa(): string {
  const inner = `
    <rect x="30" y="30" width="220" height="140" fill="none" stroke="${CINZA}" stroke-width="3"/>
    <line x1="140" y1="30" x2="140" y2="100" stroke="${CINZA}" stroke-width="2"/>
    <line x1="140" y1="100" x2="250" y2="100" stroke="${CINZA}" stroke-width="2"/>
    ${texto(85, 70, "quarto", { tamanho: 12 })}
    ${texto(195, 65, "sala", { tamanho: 12 })}
    ${texto(85, 140, "cozinha", { tamanho: 12 })}
    ${texto(195, 140, "banheiro", { tamanho: 12 })}
    <line x1="30" y1="130" x2="30" y2="160" stroke="#fff" stroke-width="4"/>
    <path d="M 30 130 A 30 30 0 0 1 60 160" fill="none" stroke="${AMBAR}" stroke-width="1.5"/>
  `;
  return wrap(inner);
}

export function malhaComFigura(tipo: "retangulo" | "composta", larguraQuad: number, alturaQuad: number): string {
  const s = 20,
    ox = 40,
    oy = 20;
  let grid = "";
  for (let i = 0; i <= 10; i++) {
    grid += `<line x1="${ox + i * s}" y1="${oy}" x2="${ox + i * s}" y2="${oy + 8 * s}" stroke="${CINZA_CLARO}" stroke-width="1"/>`;
  }
  for (let j = 0; j <= 8; j++) {
    grid += `<line x1="${ox}" y1="${oy + j * s}" x2="${ox + 10 * s}" y2="${oy + j * s}" stroke="${CINZA_CLARO}" stroke-width="1"/>`;
  }
  const fig =
    tipo === "retangulo"
      ? `<rect x="${ox + s}" y="${oy + s}" width="${larguraQuad * s}" height="${alturaQuad * s}" fill="${AZUL}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>`
      : `<polygon points="${ox + s},${oy + s} ${ox + (1 + larguraQuad) * s},${oy + s} ${ox + (1 + larguraQuad) * s},${oy + (1 + alturaQuad) * s} ${ox + (1 + larguraQuad / 2) * s},${oy + (1 + alturaQuad) * s} ${ox + (1 + larguraQuad / 2) * s},${oy + (1 + alturaQuad / 2) * s} ${ox + s},${oy + (1 + alturaQuad / 2) * s}" fill="${AZUL}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>`;
  return wrap(`${grid}${fig}`, "0 0 280 190", 280, 190);
}

export function vistasOrtogonais(): string {
  const inner = `
    ${texto(45, 20, "frontal", { tamanho: 11 })}
    <rect x="20" y="30" width="50" height="50" fill="${AZUL_CLARO}" fill-opacity="0.35" stroke="${AZUL}" stroke-width="2"/>
    ${texto(140, 20, "superior", { tamanho: 11 })}
    <rect x="115" y="30" width="50" height="50" fill="${VERDE}" fill-opacity="0.2" stroke="${VERDE}" stroke-width="2"/>
    ${texto(235, 20, "lateral", { tamanho: 11 })}
    <rect x="210" y="30" width="50" height="50" fill="${AMBAR}" fill-opacity="0.2" stroke="${AMBAR}" stroke-width="2"/>
    <line x1="20" y1="100" x2="260" y2="100" stroke="${CINZA_CLARO}" stroke-width="1"/>
    ${texto(140, 120, "objeto em 3D:", { tamanho: 11 })}
  `;
  const cubo = figuraEspacial("cubo").replace(/<svg[^>]*>|<\/svg>/g, "");
  return wrap(`${inner}<g transform="translate(0,25) scale(0.55)">${cubo}</g>`, "0 0 280 220", 280, 220);
}
