// Controle de acesso do aluno ao diagnóstico e à trilha (Fase 7).
// O aluno nunca escolhe o que fazer — o painel dele sempre mostra uma única
// atividade, determinada por este estado. Ver plano em
// /Users/diegovale/.claude/plans/mighty-wobbling-quasar.md (Fase 7).

export type AtividadeAluno =
  | "TESTE_RESUMIDO" // experimental, ainda não fez o teste resumido
  | "AGUARDANDO_MATRICULA" // experimental, já fez — espera o professor matricular
  | "TESTE_COMPLETO" // matriculado, professor liberou o diagnóstico completo
  | "TRILHA" // matriculado, ponto de partida já definido
  | "AGUARDANDO_ATRIBUICAO"; // matriculado, sem diagnóstico liberado nem ponto de partida

export function obterAtividadeAluno(aluno: {
  status: "EXPERIMENTAL" | "MATRICULADO";
  diagnosticoLiberado: boolean;
  trilhaPontoPartida: string | null;
}, temTentativaFinalizada: boolean): AtividadeAluno {
  if (aluno.status === "EXPERIMENTAL") {
    return temTentativaFinalizada ? "AGUARDANDO_MATRICULA" : "TESTE_RESUMIDO";
  }

  if (aluno.diagnosticoLiberado) return "TESTE_COMPLETO";
  if (aluno.trilhaPontoPartida) return "TRILHA";
  return "AGUARDANDO_ATRIBUICAO";
}
