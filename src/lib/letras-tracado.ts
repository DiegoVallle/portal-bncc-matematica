// Waypoints das letras traçáveis (Módulo 2 em diante) — coordenadas num
// canvas de referência TAMANHO_CANVAS×TAMANHO_CANVAS. Aproximação de
// "conectar os pontos" (como fichas de caligrafia infantil), não trajetória
// caligráfica realista — a letra é reconhecível, não é ensino de caligrafia
// cursiva. Formas simples/retas de propósito: o motor de traçado (canvas,
// tolerância radial) é o mesmo pra qualquer letra futura, só adicionar aqui.

export type Ponto = { x: number; y: number };

export const TAMANHO_CANVAS = 300;

export const WAYPOINTS_POR_LETRA: Record<string, Ponto[]> = {
  A: [
    { x: 60, y: 260 },
    { x: 150, y: 40 },
    { x: 240, y: 260 },
    { x: 195, y: 150 },
    { x: 105, y: 150 },
  ],
  E: [
    { x: 220, y: 60 },
    { x: 90, y: 60 },
    { x: 90, y: 150 },
    { x: 180, y: 150 },
    { x: 90, y: 150 },
    { x: 90, y: 240 },
    { x: 220, y: 240 },
  ],
  I: [
    { x: 150, y: 60 },
    { x: 150, y: 240 },
  ],
  O: [
    { x: 150, y: 50 },
    { x: 220, y: 90 },
    { x: 250, y: 150 },
    { x: 220, y: 210 },
    { x: 150, y: 250 },
    { x: 80, y: 210 },
    { x: 50, y: 150 },
    { x: 80, y: 90 },
    { x: 150, y: 50 },
  ],
  U: [
    { x: 90, y: 60 },
    { x: 90, y: 180 },
    { x: 120, y: 230 },
    { x: 150, y: 245 },
    { x: 180, y: 230 },
    { x: 210, y: 180 },
    { x: 210, y: 60 },
  ],
  "~": [
    { x: 60, y: 150 },
    { x: 100, y: 110 },
    { x: 140, y: 150 },
    { x: 180, y: 190 },
    { x: 220, y: 150 },
  ],
};

export function obterWaypointsLetra(letra: string): Ponto[] | null {
  return WAYPOINTS_POR_LETRA[letra.toUpperCase()] ?? WAYPOINTS_POR_LETRA[letra] ?? null;
}
