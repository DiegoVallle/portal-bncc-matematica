export const UNIDADE_LABELS: Record<string, string> = {
  NUMEROS: "Números",
  ALGEBRA: "Álgebra",
  GEOMETRIA: "Geometria",
  GRANDEZAS_MEDIDAS: "Grandezas e Medidas",
  PROBABILIDADE_ESTATISTICA: "Probabilidade e Estatística",
};

export const UNIDADE_CORES: Record<string, string> = {
  NUMEROS: "#2563eb",
  ALGEBRA: "#7c3aed",
  GEOMETRIA: "#059669",
  GRANDEZAS_MEDIDAS: "#d97706",
  PROBABILIDADE_ESTATISTICA: "#db2777",
};

export const UNIDADES_ORDEM = [
  "NUMEROS",
  "ALGEBRA",
  "GEOMETRIA",
  "GRANDEZAS_MEDIDAS",
  "PROBABILIDADE_ESTATISTICA",
];

export const ANOS_ESCOLARES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const BIMESTRES = [1, 2, 3, 4];

export function nomeAno(ano: number) {
  return `${ano}º ano`;
}
