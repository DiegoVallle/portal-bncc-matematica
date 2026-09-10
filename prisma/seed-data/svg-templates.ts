// Templates SVG reutilizáveis pro rollout de ilustrações (Fase 4). Mesma
// paleta/convenção já usada no piloto (EF07MA01/08/18) e no diagnóstico:
// hex simples, viewBox + width/height explícitos, font-family system-ui.
const AZUL = "#1a4d80";
const AZUL_CLARO = "#93c5fd";
const VERDE = "#357a39";
const VERDE_CLARO = "#86efac";
const CINZA = "#334155";
const CINZA_MEDIO = "#64748b";
const CINZA_CLARO = "#94a3b8";

export function retaNumerica(
  titulo: string,
  min: number,
  max: number,
  pontos: { valor: number; label: string; cor: string }[]
): string {
  const largura = 520;
  const margem = 40;
  const escala = (largura - 2 * margem) / (max - min);
  const x = (v: number) => margem + (v - min) * escala;
  const passo = max - min > 20 ? 5 : 1;
  let marcas = "";
  for (let v = min; v <= max; v++) {
    marcas += `<line x1="${x(v)}" y1="74" x2="${x(v)}" y2="86" stroke="${CINZA_CLARO}" stroke-width="1.5"/>`;
    if (v % passo === 0) marcas += `<text x="${x(v)}" y="104" fill="${CINZA_MEDIO}" font-size="11" text-anchor="middle">${v}</text>`;
  }
  const destaques = pontos
    .map(
      (p) => `
    <circle cx="${x(p.valor)}" cy="80" r="7" fill="${p.cor}"/>
    <text x="${x(p.valor)}" y="58" fill="${p.cor}" font-size="13" text-anchor="middle" font-weight="700">${p.label}</text>`
    )
    .join("");
  return `<svg viewBox="0 0 ${largura} 130" width="${largura}" height="130" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="${largura / 2}" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">${titulo}</text>
  <line x1="${margem}" y1="80" x2="${largura - margem}" y2="80" stroke="${CINZA}" stroke-width="2"/>
  ${marcas}
  ${destaques}
</svg>`;
}

export function balanca(titulo: string, esquerda: string, direita: string, legenda: string): string {
  return `<svg viewBox="0 0 400 240" width="400" height="240" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="24" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">${titulo}</text>
  <polygon points="200,50 185,90 215,90" fill="#cbd5e1"/>
  <rect x="196" y="90" width="8" height="70" fill="#cbd5e1"/>
  <line x1="60" y1="70" x2="340" y2="70" stroke="${AZUL}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="200" cy="70" r="6" fill="${"#0f3159"}"/>
  <line x1="60" y1="70" x2="60" y2="105" stroke="${AZUL}" stroke-width="2"/>
  <line x1="340" y1="70" x2="340" y2="105" stroke="${AZUL}" stroke-width="2"/>
  <path d="M 5 105 Q 60 140 115 105 Z" fill="#dbeafe" stroke="${AZUL}" stroke-width="2"/>
  <path d="M 285 105 Q 340 140 395 105 Z" fill="#f0fdf4" stroke="${VERDE}" stroke-width="2"/>
  <text x="60" y="124" fill="${AZUL}" font-size="14" font-weight="700" text-anchor="middle">${esquerda}</text>
  <text x="340" y="124" fill="${VERDE}" font-size="14" font-weight="700" text-anchor="middle">${direita}</text>
  <text x="200" y="200" fill="${CINZA_MEDIO}" font-size="12" text-anchor="middle">${legenda}</text>
</svg>`;
}

export function fluxograma(titulo: string, passos: string[]): string {
  const alturaPasso = 46;
  const altura = 40 + passos.length * (alturaPasso + 14);
  let blocos = "";
  passos.forEach((passo, i) => {
    const y = 40 + i * (alturaPasso + 14);
    blocos += `
    <rect x="40" y="${y}" width="440" height="${alturaPasso}" rx="10" fill="${i === 0 ? "#eff6ff" : i === passos.length - 1 ? "#f0fdf4" : "#fff"}" stroke="${i === 0 ? AZUL : i === passos.length - 1 ? VERDE : CINZA_CLARO}" stroke-width="2"/>
    <text x="60" y="${y + alturaPasso / 2 + 5}" fill="${CINZA}" font-size="13" font-weight="600">${i + 1}. ${passo}</text>`;
    if (i < passos.length - 1) {
      const yArrow = y + alturaPasso;
      blocos += `<line x1="260" y1="${yArrow}" x2="260" y2="${yArrow + 14}" stroke="${CINZA_CLARO}" stroke-width="2"/>
      <polygon points="260,${yArrow + 14} 254,${yArrow + 6} 266,${yArrow + 6}" fill="${CINZA_CLARO}"/>`;
    }
  });
  return `<svg viewBox="0 0 520 ${altura}" width="520" height="${altura}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="260" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">${titulo}</text>
  ${blocos}
</svg>`;
}

export function pizza(titulo: string, fatias: { label: string; pct: number; cor: string }[]): string {
  const cx = 150, cy = 130, r = 90;
  let anguloAtual = -90;
  let caminhos = "";
  let legendaY = 30;
  let legenda = "";
  for (const f of fatias) {
    const anguloFinal = anguloAtual + (f.pct / 100) * 360;
    const grandeArco = f.pct > 50 ? 1 : 0;
    const x1 = cx + r * Math.cos((anguloAtual * Math.PI) / 180);
    const y1 = cy + r * Math.sin((anguloAtual * Math.PI) / 180);
    const x2 = cx + r * Math.cos((anguloFinal * Math.PI) / 180);
    const y2 = cy + r * Math.sin((anguloFinal * Math.PI) / 180);
    caminhos += `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${grandeArco} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${f.cor}" stroke="#fff" stroke-width="2"/>`;
    anguloAtual = anguloFinal;
    legenda += `<rect x="300" y="${legendaY}" width="14" height="14" fill="${f.cor}"/><text x="320" y="${legendaY + 12}" fill="${CINZA}" font-size="13">${f.label} — ${f.pct}%</text>`;
    legendaY += 26;
  }
  return `<svg viewBox="0 0 460 260" width="460" height="260" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="230" y="24" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">${titulo}</text>
  ${caminhos}
  ${legenda}
</svg>`;
}

export function barras(titulo: string, itens: { label: string; valor: number; cor: string }[], linhaMedia?: number): string {
  const largura = 460, altura = 220, base = 180, maxValor = Math.max(...itens.map((i) => i.valor), linhaMedia ?? 0) * 1.15;
  const larguraBarra = 50, espaco = (largura - 80) / itens.length;
  let barrasSvg = "";
  itens.forEach((item, i) => {
    const h = (item.valor / maxValor) * 130;
    const x = 60 + i * espaco;
    barrasSvg += `
    <rect x="${x}" y="${base - h}" width="${larguraBarra}" height="${h}" fill="${item.cor}" rx="4"/>
    <text x="${x + larguraBarra / 2}" y="${base - h - 8}" fill="${CINZA}" font-size="12" text-anchor="middle" font-weight="700">${item.valor}</text>
    <text x="${x + larguraBarra / 2}" y="${base + 18}" fill="${CINZA_MEDIO}" font-size="12" text-anchor="middle">${item.label}</text>`;
  });
  const linha =
    linhaMedia !== undefined
      ? `<line x1="50" y1="${base - (linhaMedia / maxValor) * 130}" x2="${largura - 30}" y2="${base - (linhaMedia / maxValor) * 130}" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4"/>
    <text x="${largura - 30}" y="${base - (linhaMedia / maxValor) * 130 - 6}" fill="#dc2626" font-size="12" text-anchor="end" font-weight="700">média ${linhaMedia}</text>`
      : "";
  return `<svg viewBox="0 0 ${largura} ${altura}" width="${largura}" height="${altura}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="${largura / 2}" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">${titulo}</text>
  <line x1="50" y1="${base}" x2="${largura - 30}" y2="${base}" stroke="${CINZA_CLARO}" stroke-width="1.5"/>
  ${barrasSvg}
  ${linha}
</svg>`;
}

export function duasCaixas(
  titulo: string,
  caixaA: { titulo: string; itens: string[]; cor: string; corFundo: string; nota: string },
  caixaB: { titulo: string; itens: string[]; cor: string; corFundo: string; nota: string }
): string {
  const caixa = (x: number, c: typeof caixaA) => `
    <rect x="${x}" y="40" width="260" height="150" rx="16" fill="${c.corFundo}" stroke="${c.cor}" stroke-width="2"/>
    <text x="${x + 130}" y="66" fill="${c.cor}" font-size="15" font-weight="700" text-anchor="middle">${c.titulo}</text>
    ${c.itens
      .map(
        (item, i) =>
          `<text x="${x + 130}" y="${96 + i * 22}" fill="${CINZA}" font-size="13" text-anchor="middle">${item}</text>`
      )
      .join("")}
    <text x="${x + 130}" y="176" fill="${c.cor}" font-size="12" text-anchor="middle" font-weight="600">${c.nota}</text>`;
  return `<svg viewBox="0 0 560 200" width="560" height="200" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="280" y="20" fill="${CINZA}" font-size="14" text-anchor="middle" font-weight="600">${titulo}</text>
  ${caixa(10, caixaA)}
  ${caixa(290, caixaB)}
</svg>`;
}

export { AZUL, AZUL_CLARO, VERDE, VERDE_CLARO, CINZA, CINZA_MEDIO, CINZA_CLARO };
