import Link from "next/link";

// Abas de topo da tela de conteúdo (Aula / Exercícios / Avaliação final).
// "Aula" é a tela atual (teoria + exemplo). "Exercícios" vira link assim que
// houver pelo menos 1 questão de múltipla escolha pronta pra essa habilidade
// (rollout é gradual — ver plano, Fase 5). "Avaliação final" vira link assim
// que houver as 5 questões de avaliação cadastradas.
export default function AulaStepper({
  habilidadeCodigo,
  temExercicios,
  totalAvaliacao,
}: {
  habilidadeCodigo: string;
  temExercicios: boolean;
  totalAvaliacao: number;
}) {
  return (
    <div className="flex gap-1 border-b border-slate-200" aria-label={`Etapas de ${habilidadeCodigo}`}>
      <span className="border-b-2 border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700">Aula</span>
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
      {totalAvaliacao > 0 ? (
        <Link
          href={`/aluno/trilha/${habilidadeCodigo}/avaliacao`}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Avaliação final
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-slate-400" title="Em breve">
          Avaliação final
        </span>
      )}
    </div>
  );
}
