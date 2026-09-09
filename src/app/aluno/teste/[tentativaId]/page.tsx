import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { submeterTentativa } from "../../actions";
import BotaoEnviarFormulario from "@/components/BotaoEnviarFormulario";
import IlustracaoQuestao from "@/components/IlustracaoQuestao";
import BotaoOuvirQuestao from "@/components/BotaoOuvirQuestao";

export default async function TesteDiagnosticoPage({
  params,
}: {
  params: Promise<{ tentativaId: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { tentativaId } = await params;

  const tentativa = await prisma.tentativa.findUnique({ where: { id: tentativaId } });
  if (!tentativa || tentativa.alunoId !== sessao.id) notFound();
  if (tentativa.finalizadoEm) redirect(`/aluno/resultado/${tentativaId}`);

  const questoes = await prisma.questao.findMany({
    where: { anoEscolar: tentativa.anoEscolar, bimestre: tentativa.bimestre },
    include: { alternativas: { orderBy: { ordem: "asc" } } },
    orderBy: { ordem: "asc" },
  });

  const enviar = submeterTentativa.bind(null, tentativaId);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-900">
        Diagnóstico · {tentativa.anoEscolar}º ano · {tentativa.bimestre}º bimestre
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Responda todas as questões e clique em enviar ao final. {questoes.length} questões.
      </p>

      <form action={enviar} className="mt-8 space-y-6">
        {questoes.map((questao, index) => (
          <fieldset
            key={questao.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <legend className="px-1 text-sm font-semibold text-slate-500">
              Questão {index + 1} de {questoes.length}
            </legend>
            <p className="mt-1 text-lg font-medium text-slate-900 sm:text-xl">{questao.enunciado}</p>
            <BotaoOuvirQuestao
              enunciado={questao.enunciado}
              alternativas={questao.alternativas.map((a) => a.texto)}
            />
            {questao.ilustracaoSvg && <IlustracaoQuestao svg={questao.ilustracaoSvg} />}
            <div className="mt-4 space-y-2">
              {questao.alternativas.map((alt) => (
                <label
                  key={alt.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 text-base hover:bg-slate-50 has-[:checked]:border-valeedu-green has-[:checked]:bg-emerald-50"
                >
                  <input
                    type="radio"
                    name={`questao_${questao.id}`}
                    value={alt.id}
                    required
                    className="mt-1"
                  />
                  <span>{alt.texto}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <BotaoEnviarFormulario />
      </form>
    </main>
  );
}
