import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS } from "@/lib/trilha";
import AulaStepper from "./AulaStepper";
import TeoriaCards from "./TeoriaCards";
import { iniciarHabilidade } from "../actions";

export default async function ConteudoHabilidadePage({
  params,
}: {
  params: Promise<{ habilidadeCodigo: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { habilidadeCodigo } = await params;

  const habilidade = await prisma.habilidade.findUnique({
    where: { codigo: habilidadeCodigo },
    include: { conteudo: true },
  });
  if (!habilidade || !habilidade.conteudo) notFound();

  const conteudo = habilidade.conteudo;

  const [totalExerciciosMc, totalAvaliacao, progresso] = await Promise.all([
    prisma.questaoConteudo.count({
      where: { conteudoId: conteudo.id, tipoResposta: "MULTIPLA_ESCOLHA", nivel: { not: "AVALIACAO" } },
    }),
    prisma.questaoConteudo.count({
      where: { conteudoId: conteudo.id, nivel: "AVALIACAO" },
    }),
    prisma.progressoHabilidade.findUnique({
      where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId: conteudo.id } },
    }),
  ]);

  const comecar = iniciarHabilidade.bind(null, habilidade.codigo);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-sm">
        <Link href="/aluno/trilha" className="text-slate-600 hover:underline">
          ← Voltar para a trilha
        </Link>
      </p>

      <div className="mt-2 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {habilidade.codigo} — {habilidade.descricao}
        </h1>
        {progresso && (
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {STATUS_LABELS[progresso.status]}
          </span>
        )}
      </div>

      <div className="mt-6">
        <AulaStepper habilidadeCodigo={habilidade.codigo} temExercicios={totalExerciciosMc > 0} totalAvaliacao={totalAvaliacao} />
      </div>

      <div className="mt-6 space-y-6">
        <TeoriaCards teoriaBase={conteudo.teoriaBase} exemploResolvido={conteudo.exemploResolvido} />

        {totalExerciciosMc > 0 && (
          <form action={comecar}>
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 sm:w-auto"
            >
              {progresso ? "Continuar aula →" : "Começar aula →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
