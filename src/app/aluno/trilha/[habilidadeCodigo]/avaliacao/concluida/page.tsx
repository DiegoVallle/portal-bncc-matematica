import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterProximaHabilidade, STATUS_LABELS } from "@/lib/trilha";

export default async function AvaliacaoConcluidaPage({
  params,
  searchParams,
}: {
  params: Promise<{ habilidadeCodigo: string }>;
  searchParams: Promise<{ acertos?: string; total?: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { habilidadeCodigo } = await params;
  const { acertos: acertosStr, total: totalStr } = await searchParams;
  const acertos = Number(acertosStr ?? 0);
  const total = Number(totalStr ?? 5);

  const habilidade = await prisma.habilidade.findUnique({
    where: { codigo: habilidadeCodigo },
    include: { conteudo: true },
  });
  if (!habilidade || !habilidade.conteudo) notFound();
  const conteudoId = habilidade.conteudo.id;

  const [progresso, exerciciosAcertados] = await Promise.all([
    prisma.progressoHabilidade.findUnique({
      where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId } },
    }),
    // Só conta acertos de prática (exclui avaliação final, que tem sua própria
    // linha "Avaliação final: X de Y" logo abaixo — mesmo quando ela também é
    // corrigida automaticamente, pra não contar o mesmo acerto duas vezes).
    prisma.tentativaQuestaoConteudo.count({
      where: {
        alunoId: sessao.id,
        correta: true,
        questaoConteudo: { conteudoId, nivel: { not: "AVALIACAO" } },
      },
    }),
  ]);

  const proximoCodigo = obterProximaHabilidade(habilidadeCodigo);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 text-center">
      <p className="text-5xl">🏆</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Habilidade concluída!</h1>
      <p className="mt-1 text-slate-600">
        {habilidade.codigo} — {habilidade.descricao}
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Seu desempenho</h2>
        <dl className="mt-3 space-y-2 text-sm text-slate-700">
          <div className="flex justify-between">
            <dt>Exercícios acertados</dt>
            <dd>{exerciciosAcertados}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Avaliação final</dt>
            <dd>
              {acertos} de {total}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Status</dt>
            <dd className="font-medium text-slate-900">{progresso ? STATUS_LABELS[progresso.status] : "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={`/aluno/trilha/${habilidadeCodigo}`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Ver a habilidade
        </Link>
        {proximoCodigo && (
          <Link
            href={`/aluno/trilha/${proximoCodigo}`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Continuar para próxima →
          </Link>
        )}
      </div>
    </main>
  );
}
