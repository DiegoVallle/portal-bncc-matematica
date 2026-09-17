// Controle de acesso do aluno ao diagnóstico e à trilha (Fase 7).
// O aluno nunca escolhe o que fazer — o painel dele sempre mostra uma única
// atividade, determinada por este estado. Ver plano em
// /Users/diegovale/.claude/plans/mighty-wobbling-quasar.md (Fase 7).

export type AtividadeAluno =
  | "TESTE_RESUMIDO" // experimental, ainda não fez o teste resumido
  | "AGUARDANDO_MATRICULA" // experimental, já fez — espera o professor matricular
  | "TESTE_COMPLETO" // matriculado, professor liberou o diagnóstico completo
  | "TRILHA" // matriculado, ponto de partida já definido
  | "AGUARDANDO_ATRIBUICAO" // matriculado, sem diagnóstico liberado nem ponto de partida
  | "TRILHA_ALFABETIZACAO"; // trilha de Alfabetização — nunca passa pelo diagnóstico

export function obterAtividadeAluno(aluno: {
  status: "EXPERIMENTAL" | "MATRICULADO";
  diagnosticoLiberado: boolean;
  trilhaPontoPartida: string | null;
  trilhaTipo: "MATEMATICA" | "ALFABETIZACAO";
}, temTentativaFinalizada: boolean): AtividadeAluno {
  // Alfabetização é um percurso próprio, sem diagnóstico/matrícula — nunca
  // deve cair em "aguardando matrícula/atribuição" (que são estados do
  // fluxo de diagnóstico da Matemática).
  if (aluno.trilhaTipo === "ALFABETIZACAO") return "TRILHA_ALFABETIZACAO";

  if (aluno.status === "EXPERIMENTAL") {
    return temTentativaFinalizada ? "AGUARDANDO_MATRICULA" : "TESTE_RESUMIDO";
  }

  if (aluno.diagnosticoLiberado) return "TESTE_COMPLETO";
  if (aluno.trilhaPontoPartida) return "TRILHA";
  return "AGUARDANDO_ATRIBUICAO";
}
