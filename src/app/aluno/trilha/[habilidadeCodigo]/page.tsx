import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { materialConsulta } from "@/lib/material-consulta";
import { AULAS_REVISADAS } from "@/content/aulas-revisadas";
import { STATUS_LABELS } from "@/lib/trilha";
import AulaStepper from "./AulaStepper";
import TeoriaCards from "./TeoriaCards";
import { iniciarHabilidade } from "../actions";

export default async function ConteudoHabilidadePage({
  params, searchParams,
}: {
  params: Promise<{ habilidadeCodigo: string }>;
  searchParams: Promise<{ aula?: string }>;
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
  const consulta = materialConsulta(habilidadeCodigo, conteudo.teoriaBase, conteudo.exemploResolvido);
  const aulas = AULAS_REVISADAS[habilidadeCodigo] ?? [];
  const aulaParam = Number((await searchParams).aula ?? "1");
  const aulaInicial = Number.isInteger(aulaParam) && aulaParam >= 1 && aulaParam <= aulas.length ? aulaParam - 1 : 0;

  const [totalExerciciosMc, totalAvaliacao, progresso, totalGuiada, tentativasDePratica] = await Promise.all([
    prisma.questaoConteudo.count({
      where: {
        conteudoId: conteudo.id,
        nivel: { not: "AVALIACAO" },
        OR: [
          { tipoResposta: "MULTIPLA_ESCOLHA" },
          { tipoResposta: "NUMERICA" },
          { atividadeInterativa: { not: Prisma.DbNull } },
        ],
      },
    }),
    prisma.questaoConteudo.count({
      where: { conteudoId: conteudo.id, nivel: "AVALIACAO" },
    }),
    prisma.progressoHabilidade.findUnique({
      where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId: conteudo.id } },
    }),
    prisma.questaoConteudo.count({where:{conteudoId:conteudo.id,nivel:{not:"AVALIACAO"},tipoResposta:"TEXTO",atividadeInterativa:{equals:Prisma.AnyNull}}}),
    // "Passou pelos exercícios" = tem pelo menos 1 tentativa real registrada
    // (nunca a prática guiada, que não grava nada) — é isso que libera a
    // avaliação final, pra nunca dar pra pular direto da aula pra ela.
    prisma.tentativaQuestaoConteudo.count({
      where: { alunoId: sessao.id, questaoConteudo: { conteudoId: conteudo.id, nivel: { not: "AVALIACAO" } } },
    }),
  ]);
  const jaPraticou = tentativasDePratica > 0;

  const comecar = iniciarHabilidade.bind(null, habilidade.codigo);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-sm">
        <Link href="/aluno/trilha" className="text-slate-600 hover:underline">
          ← Voltar para a trilha
        </Link>
      </p>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          {aulas.length ? "Hora de aprender" : habilidade.descricao}
        </h1>
        {progresso && (
          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {STATUS_LABELS[progresso.status]}
          </span>
        )}
      </div>

      <details className="mt-3 max-w-3xl text-sm text-slate-500"><summary className="cursor-pointer">{habilidade.codigo} · Sobre esta habilidade</summary><p className="mt-2 leading-relaxed">{habilidade.descricao}</p></details>
      <div className="mt-6">
        <AulaStepper habilidadeCodigo={habilidade.codigo} temExercicios={totalExerciciosMc > 0} totalAvaliacao={totalAvaliacao} jaPraticou={jaPraticou} />
      </div>

      <div className="mt-6 space-y-6">
        <TeoriaCards key={`${habilidadeCodigo}-${aulaInicial}`} aulas={aulas} aulaInicial={aulaInicial} habilidadeCodigo={habilidadeCodigo} teoriaBase={consulta.teoria} exemploResolvido={consulta.exemplo} ilustracaoHabilidade={conteudo.ilustracaoSvg}>

        {totalExerciciosMc > 0 && (
          <form action={comecar}>
            <button
              type="submit"
              className="w-full rounded-lg bg-valeedu-green px-4 py-3 text-sm font-semibold text-white hover:bg-valeedu-green-dark sm:w-auto"
            >
              {progresso ? "Continuar a prática →" : "Praticar o que aprendi →"}
            </button>
          </form>
        )}
        {totalGuiada > 0 && <Link href={`/aluno/trilha/${habilidadeCodigo}/pratica-guiada`} className="inline-block rounded-lg border border-valeedu-blue px-5 py-3 font-medium text-valeedu-blue">Praticar com consulta à resposta →</Link>}
        </TeoriaCards>
      </div>
    </main>
  );
}
