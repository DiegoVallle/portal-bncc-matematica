import Link from "next/link";

// Abas de topo da tela de conteúdo (Aula / Exercícios / Avaliação final).
// "Aula" é a tela atual (teoria + exemplo). "Exercícios" vira link assim que
// houver pelo menos 1 questão pronta pra essa habilidade (múltipla escolha,
// numérica ou atividade interativa). "Avaliação final" só vira link depois
// que o aluno já praticou pelo menos uma vez de verdade — nunca dá pra pular
// direto da aula pra avaliação sem passar pelos exercícios (a prática guiada,
// que não grava tentativa, não conta pra isso). Ver page.tsx (jaPraticou) e o
// mesmo guard no servidor em avaliacao/page.tsx.
export default function AulaStepper({
  habilidadeCodigo,
  temExercicios,
  totalAvaliacao,
  jaPraticou,
}: {
  habilidadeCodigo: string;
  temExercicios: boolean;
  totalAvaliacao: number;
  jaPraticou: boolean;
}) {
  const avaliacaoDisponivel = totalAvaliacao > 0 && jaPraticou;

  return (
    <div className="flex gap-1 border-b border-slate-200" aria-label={`Etapas de ${habilidadeCodigo}`}>
      <span className="border-b-2 border-valeedu-green px-4 py-2 text-sm font-medium text-valeedu-green-dark">Aula</span>
      {temExercicios ? (
        <Link
          href={`/aluno/trilha/${habilidadeCodigo}/exercicios`}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Exercícios
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-slate-400" title="Em breve">
          Exercícios
        </span>
      )}
      {avaliacaoDisponivel ? (
        <Link
          href={`/aluno/trilha/${habilidadeCodigo}/avaliacao`}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Avaliação final
        </Link>
      ) : (
        <span
          className="px-4 py-2 text-sm font-medium text-slate-400"
          title={totalAvaliacao === 0 ? "Em breve" : "Pratique os exercícios primeiro"}
        >
          Avaliação final
        </span>
      )}
    </div>
  );
}
