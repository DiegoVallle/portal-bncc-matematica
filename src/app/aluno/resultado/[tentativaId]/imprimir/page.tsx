import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { desempenhoPorUnidade } from "@/lib/relatorios";
import { gerarRelatorio, gerarMensagemResponsaveis, gerarPontosAtencao } from "@/lib/relatorio-texto";
import IlustracaoQuestao from "@/components/IlustracaoQuestao";
import BotaoImprimir from "@/components/BotaoImprimir";

export default async function ImprimirRelatorioPage({
  params,
}: {
  params: Promise<{ tentativaId: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao) redirect("/");

  const { tentativaId } = await params;

  let tentativa;
  let aluno;
  let voltarHref: string;

  if (sessao.role === "aluno") {
    [tentativa, aluno] = await Promise.all([
      prisma.tentativa.findUnique({ where: { id: tentativaId } }),
      prisma.aluno.findUnique({ where: { id: sessao.id }, include: { professor: true } }),
    ]);
    if (!tentativa || tentativa.alunoId !== sessao.id) notFound();
    if (!aluno) notFound();
    voltarHref = `/aluno/resultado/${tentativaId}`;
  } else if (sessao.role === "professor") {
    tentativa = await prisma.tentativa.findUnique({
      where: { id: tentativaId },
      include: { aluno: { include: { professor: true } } },
    });
    if (!tentativa || tentativa.aluno.professorId !== sessao.id) notFound();
    aluno = tentativa.aluno;
    voltarHref = `/professor/alunos/${aluno.id}`;
  } else {
    redirect("/");
  }

  if (!tentativa.finalizadoEm) notFound();

  const respostas = await prisma.resposta.findMany({
    where: { tentativaId },
    include: {
      questao: { include: { habilidade: true, alternativas: { orderBy: { ordem: "asc" } } } },
      alternativa: true,
    },
    orderBy: { questao: { ordem: "asc" } },
  });

  const desempenho = desempenhoPorUnidade(respostas);
  const desempenhoAvaliado = desempenho.filter((d) => d.total > 0);
  const percentual =
    tentativa.totalQuestoes > 0
      ? Math.round((tentativa.totalAcertos / tentativa.totalQuestoes) * 100)
      : 0;
  const relatorio = gerarRelatorio(aluno.nome, percentual, desempenho);
  const mensagemResponsaveis = gerarMensagemResponsaveis(
    aluno.nome,
    tentativa.anoEscolar,
    tentativa.bimestre,
    percentual,
    relatorio
  );
  const pontosAtencao = gerarPontosAtencao(respostas);

  const dataGeracao = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const dataTeste = tentativa.finalizadoEm.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 bg-white px-6 py-10 text-slate-900 print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={voltarHref} className="text-sm text-slate-600 hover:underline">
          ← Voltar
        </Link>
        <BotaoImprimir />
      </div>

      {/* Cabeçalho */}
      <header className="border-b-2 border-slate-800 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          ValeEdu · BNCC Matemática
        </p>
        <h1 className="mt-1 text-2xl font-bold">Relatório de Diagnóstico</h1>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold">Aluno(a):</span> {aluno.nome}
          </p>
          <p>
            <span className="font-semibold">Data do teste:</span> {dataTeste}
          </p>
          <p>
            <span className="font-semibold">Ano escolar:</span> {tentativa.anoEscolar}º ano
          </p>
          <p>
            <span className="font-semibold">Bimestre avaliado:</span> {tentativa.bimestre}º bimestre
          </p>
          {aluno.professor && (
            <p className="col-span-2">
              <span className="font-semibold">Professor(a) responsável:</span> {aluno.professor.nome}
            </p>
          )}
        </div>
      </header>

      {/* Placar */}
      <section className="mt-6 flex items-center justify-between rounded-xl border border-slate-300 p-5">
        <div>
          <p className="text-sm text-slate-600">Resultado geral</p>
          <p className="text-3xl font-bold">
            {tentativa.totalAcertos}/{tentativa.totalQuestoes} questões corretas
          </p>
        </div>
        <p className="text-4xl font-bold text-slate-800">{percentual}%</p>
      </section>

      {/* Tabela por unidade temática */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">Desempenho por área da Matemática</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-slate-800 text-left">
              <th className="py-1.5 pr-2">Área avaliada</th>
              <th className="py-1.5 pr-2 text-right">Acertos</th>
              <th className="py-1.5 text-right">Aproveitamento</th>
            </tr>
          </thead>
          <tbody>
            {desempenhoAvaliado.map((d) => (
              <tr key={d.unidade} className="border-b border-slate-200">
                <td className="py-1.5 pr-2">{d.label}</td>
                <td className="py-1.5 pr-2 text-right">
                  {d.acertos}/{d.total}
                </td>
                <td className="py-1.5 text-right font-semibold">{d.percentual}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Mensagem aos responsáveis */}
      <section className="mt-6 rounded-xl border border-slate-300 bg-slate-50 p-5 print:bg-white">
        <h2 className="text-lg font-bold">Mensagem aos pais/responsáveis</h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-800">
          {mensagemResponsaveis.map((paragrafo, i) => (
            <p key={i}>{paragrafo}</p>
          ))}
        </div>
      </section>

      {/* Pontos de atenção específicos, por habilidade da BNCC */}
      {pontosAtencao.length > 0 && (
        <section className="mt-6 break-inside-avoid">
          <h2 className="text-lg font-bold">Pontos de atenção específicos</h2>
          <p className="mt-1 text-sm text-slate-600">
            Habilidades da Base Nacional Comum Curricular (BNCC) em que {aluno.nome.split(" ")[0]}{" "}
            errou pelo menos uma questão neste diagnóstico. Estas são as lacunas mais
            específicas e concretas para orientar o reforço escolar.
          </p>
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-slate-800 text-left">
                <th className="w-24 py-1.5 pr-2">Código BNCC</th>
                <th className="py-1.5 pr-2">Habilidade</th>
                <th className="w-20 py-1.5 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {pontosAtencao.map((p) => (
                <tr key={p.codigo} className="border-b border-slate-200 align-top">
                  <td className="py-1.5 pr-2 font-mono text-xs">{p.codigo}</td>
                  <td className="py-1.5 pr-2">
                    <span className="font-medium">{p.unidadeLabel}:</span> {p.descricao}
                  </td>
                  <td
                    className={`py-1.5 text-right font-semibold whitespace-nowrap ${
                      p.gravidade === "critico" ? "text-red-700" : "text-amber-700"
                    }`}
                  >
                    {p.acertos}/{p.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Detalhamento das questões */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">Detalhamento das questões</h2>
        <div className="mt-2 space-y-4">
          {respostas.map((resposta, index) => (
            <div
              key={resposta.id}
              className="break-inside-avoid rounded-lg border border-slate-300 p-4"
            >
              <p className="text-xs font-semibold text-slate-500">
                Questão {index + 1} · {resposta.questao.habilidade.codigo} ·{" "}
                {resposta.correta ? "Correta ✓" : "Incorreta ✗"}
              </p>
              <p className="mt-1 font-medium">{resposta.questao.enunciado}</p>
              {resposta.questao.ilustracaoSvg && (
                <IlustracaoQuestao svg={resposta.questao.ilustracaoSvg} />
              )}
              <ul className="mt-2 space-y-0.5 text-sm">
                {resposta.questao.alternativas.map((alt) => (
                  <li
                    key={alt.id}
                    className={
                      alt.correta
                        ? "font-semibold"
                        : alt.id === resposta.alternativaId
                          ? "font-semibold italic"
                          : "text-slate-600"
                    }
                  >
                    {alt.correta ? "✓ " : alt.id === resposta.alternativaId ? "✗ " : "• "}
                    {alt.texto}
                    {alt.id === resposta.alternativaId && !alt.correta ? " (resposta do aluno)" : ""}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold">Explicação: </span>
                {resposta.questao.explicacao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 border-t border-slate-300 pt-3 text-xs text-slate-500">
        Relatório gerado em {dataGeracao} pelo ValeEdu Matemática.
      </footer>
    </main>
  );
}
