import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { desempenhoPorUnidade } from "@/lib/relatorios";
import GraficoUnidades from "@/components/GraficoUnidades";
import { NUCLEOS } from "@/lib/trilha";
import DefinirPontoPartidaForm from "./DefinirPontoPartidaForm";
import { matricularAluno, liberarDiagnostico } from "./actions";

export default async function AlunoDetalhePage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const { alunoId } = await params;

  const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
  if (!aluno || aluno.professorId !== sessao.id) notFound();

  const tentativas = await prisma.tentativa.findMany({
    where: { alunoId, finalizadoEm: { not: null } },
    orderBy: [{ anoEscolar: "asc" }, { bimestre: "asc" }],
  });

  const respostas = await prisma.resposta.findMany({
    where: { tentativa: { alunoId, finalizadoEm: { not: null } } },
    select: {
      correta: true,
      questao: { select: { habilidade: { select: { unidadeTematica: true } } } },
    },
  });

  const desempenho = desempenhoPorUnidade(respostas).filter((d) => d.total > 0);

  const habilidadesTrilha = await prisma.habilidade.findMany({
    where: { anoEscolar: aluno.anoEscolar, conteudo: { isNot: null } },
    select: { codigo: true, descricao: true },
  });
  const descricaoPorCodigo = new Map(habilidadesTrilha.map((h) => [h.codigo, h.descricao]));
  const nucleosDoAno = NUCLEOS.map((n) => ({
    letra: n.letra,
    nome: n.nome,
    habilidades: n.codigos
      .filter((c) => descricaoPorCodigo.has(c))
      .map((c) => ({ codigo: c, descricao: descricaoPorCodigo.get(c)! })),
  })).filter((n) => n.habilidades.length > 0);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <p>
        <Link href="/professor/dashboard" className="text-sm text-slate-600 hover:underline">
          ← Meus alunos
        </Link>
      </p>

      <div className="mt-2">
        <h1 className="text-2xl font-bold text-slate-900">{aluno.nome}</h1>
        <p className="text-sm text-slate-600">
          @{aluno.usuario} · {aluno.anoEscolar}º ano ·{" "}
          {aluno.status === "EXPERIMENTAL" ? "Experimental" : "Matriculado"}
        </p>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Matrícula</h2>
        {aluno.status === "EXPERIMENTAL" ? (
          <>
            <p className="mt-1 text-sm text-slate-600">
              {tentativas.length === 0
                ? "Aluno ainda não finalizou o teste resumido."
                : "Veja o desempenho abaixo e, quando decidir o nível, matricule o aluno pra liberar o teste completo."}
            </p>
            <form action={matricularAluno.bind(null, aluno.id)} className="mt-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Matricular aluno
              </button>
            </form>
          </>
        ) : aluno.diagnosticoLiberado ? (
          <p className="mt-1 text-sm text-slate-600">
            Teste diagnóstico liberado — aguardando o aluno responder.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-600">
              Aluno matriculado, sem diagnóstico pendente. Libere um novo teste se quiser reavaliar o nível.
            </p>
            <form action={liberarDiagnostico.bind(null, aluno.id)} className="mt-3">
              <button
                type="submit"
                className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                Liberar novo diagnóstico
              </button>
            </form>
          </>
        )}
      </section>

      {nucleosDoAno.length > 0 && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Trilha de conteúdo</h2>
          <p className="text-sm text-slate-600">
            Escolha por onde {aluno.nome.split(" ")[0]} deve começar. Isso só direciona o ponto de partida — o
            aluno continua podendo navegar livremente pra qualquer outra habilidade.
          </p>
          <DefinirPontoPartidaForm alunoId={aluno.id} atual={aluno.trilhaPontoPartida} nucleos={nucleosDoAno} />
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Desempenho por unidade temática</h2>
        <p className="text-sm text-slate-600">Considera todos os testes finalizados.</p>
        {respostas.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Este aluno ainda não finalizou nenhum teste.</p>
        ) : (
          <div className="mt-4">
            <GraficoUnidades dados={desempenho} />
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Testes realizados</h2>
        {tentativas.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nenhum teste finalizado ainda.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {tentativas.map((t) => {
              const percentual =
                t.totalQuestoes > 0 ? Math.round((t.totalAcertos / t.totalQuestoes) * 100) : 0;
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {t.anoEscolar}º ano · {t.bimestre}º bimestre
                    </p>
                    <p className="text-sm text-slate-500">
                      {t.finalizadoEm?.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-slate-900">
                      {t.totalAcertos}/{t.totalQuestoes} ({percentual}%)
                    </p>
                    <Link
                      href={`/aluno/resultado/${t.id}/imprimir`}
                      target="_blank"
                      className="text-sm text-slate-500 hover:underline"
                      title="Gerar relatório para impressão"
                    >
                      🖨️ Relatório
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
