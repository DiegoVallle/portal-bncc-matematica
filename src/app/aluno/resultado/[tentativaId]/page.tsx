import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { desempenhoPorUnidade } from "@/lib/relatorios";
import { gerarRelatorio, gerarPontosAtencao } from "@/lib/relatorio-texto";
import GraficoUnidades from "@/components/GraficoUnidades";
import IlustracaoQuestao from "@/components/IlustracaoQuestao";

export default async function ResultadoTentativaPage({
  params,
}: {
  params: Promise<{ tentativaId: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { tentativaId } = await params;

  const [tentativa, aluno] = await Promise.all([
    prisma.tentativa.findUnique({ where: { id: tentativaId } }),
    prisma.aluno.findUnique({ where: { id: sessao.id } }),
  ]);
  if (!tentativa || tentativa.alunoId !== sessao.id) notFound();
  if (!aluno) notFound();
  if (!tentativa.finalizadoEm) redirect(`/aluno/teste/${tentativaId}`);

  const respostas = await prisma.resposta.findMany({
    where: { tentativaId },
    include: {
      questao: { include: { habilidade: true, alternativas: { orderBy: { ordem: "asc" } } } },
      alternativa: true,
    },
  });

  const desempenho = desempenhoPorUnidade(respostas);
  const desempenhoAvaliado = desempenho.filter((d) => d.total > 0);
  const percentual =
    tentativa.totalQuestoes > 0
      ? Math.round((tentativa.totalAcertos / tentativa.totalQuestoes) * 100)
      : 0;
  const relatorio = gerarRelatorio(aluno.nome, percentual, desempenho);
  const pontosAtencao = gerarPontosAtencao(respostas);

  const respostasPorQuestao = new Map(respostas.map((r) => [r.questaoId, r]));

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <p>
        <Link href="/aluno/painel" className="text-sm text-slate-600 hover:underline">
          ← Meu painel
        </Link>
      </p>

      <h1 className="mt-2 text-2xl font-bold text-slate-900">
        Resultado · {tentativa.anoEscolar}º ano · {tentativa.bimestre}º bimestre
      </h1>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">Você acertou</p>
        <p className="text-4xl font-bold text-emerald-600">
          {tentativa.totalAcertos}/{tentativa.totalQuestoes}
        </p>
        <p className="text-sm text-slate-600">{percentual}% de aproveitamento</p>
      </section>

      <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">📋 Relatório de desempenho</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-800">{relatorio.headline}</p>

        {relatorio.porUnidade.length > 0 && (
          <ul className="mt-4 space-y-2">
            {relatorio.porUnidade.map((item) => (
              <li
                key={item.unidade}
                className={`rounded-lg border p-3 text-sm leading-relaxed ${
                  item.nivel === "baixo"
                    ? "border-red-200 bg-red-50 text-red-900"
                    : item.nivel === "medio"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                }`}
              >
                {item.texto}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 rounded-lg bg-white p-3 text-sm font-medium text-slate-800 shadow-sm">
          {relatorio.recomendacaoFinal}
        </p>
      </section>

      {pontosAtencao.length > 0 && (
        <section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">🎯 Pontos de atenção específicos</h2>
          <p className="mt-1 text-sm text-slate-600">
            Habilidades da BNCC onde {aluno.nome.split(" ")[0]} errou pelo menos uma questão —
            quanto mais vermelho, maior a prioridade de revisão.
          </p>
          <ul className="mt-4 space-y-2">
            {pontosAtencao.map((p) => (
              <li
                key={p.codigo}
                className={`rounded-lg border p-3 text-sm leading-relaxed ${
                  p.gravidade === "critico"
                    ? "border-red-300 bg-red-50 text-red-900"
                    : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
              >
                <p className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs font-semibold">
                    {p.codigo}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-75">
                    {p.unidadeLabel}
                  </span>
                  <span className="ml-auto text-xs font-bold">
                    {p.acertos}/{p.total} corretas
                  </span>
                </p>
                <p className="mt-1">{p.descricao}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Desempenho por unidade temática</h2>
        <p className="text-xs text-slate-500">Mostrando apenas as unidades avaliadas neste teste.</p>
        <div className="mt-4">
          <GraficoUnidades dados={desempenhoAvaliado} />
        </div>
      </section>

      <p className="mt-6 text-center print:hidden">
        <Link
          href={`/aluno/resultado/${tentativaId}/imprimir`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          🖨️ Gerar relatório para impressão (pais)
        </Link>
      </p>

      <section className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Revisão das questões</h2>
        {tentativa &&
          Array.from(respostasPorQuestao.values())
            .sort((a, b) => a.questao.ordem - b.questao.ordem)
            .map((resposta, index) => (
              <div
                key={resposta.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  resposta.correta
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-500">
                  Questão {index + 1} · {resposta.correta ? "✅ Correta" : "❌ Incorreta"}
                </p>
                <p className="mt-1 text-lg font-medium text-slate-900">{resposta.questao.enunciado}</p>
                {resposta.questao.ilustracaoSvg && (
                  <IlustracaoQuestao svg={resposta.questao.ilustracaoSvg} />
                )}
                <ul className="mt-3 space-y-1 text-base">
                  {resposta.questao.alternativas.map((alt) => (
                    <li
                      key={alt.id}
                      className={
                        alt.correta
                          ? "font-semibold text-emerald-700"
                          : alt.id === resposta.alternativaId
                            ? "font-semibold text-red-700"
                            : "text-slate-600"
                      }
                    >
                      {alt.correta ? "✓ " : alt.id === resposta.alternativaId ? "✗ " : "• "}
                      {alt.texto}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-semibold">Explicação: </span>
                  {resposta.questao.explicacao}
                </p>
              </div>
            ))}
      </section>
    </main>
  );
}
