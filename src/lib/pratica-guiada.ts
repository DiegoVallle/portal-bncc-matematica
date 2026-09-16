export type ItemPraticaGuiada = {
  id: string; enunciado: string; respostaEsperada: string | null;
  resolucao: string | null; nivel: string; ordem: number;
};

// Questões abertas são estudo acompanhado; não atribuem acerto automático.
export const FILTRO_PRATICA_GUIADA = {
  nivel: { not: "AVALIACAO" as const },
  tipoResposta: "TEXTO" as const,
};

export function itensPraticaGuiada<T extends ItemPraticaGuiada>(itens: T[]): T[] {
  const niveis = ["FACIL", "MEDIO", "APOSTILA", "DESAFIO"];
  return itens.filter(q => niveis.includes(q.nivel) && !!q.enunciado.trim())
    .sort((a,b) => niveis.indexOf(a.nivel)-niveis.indexOf(b.nivel) || a.ordem-b.ordem || a.id.localeCompare(b.id));
}
