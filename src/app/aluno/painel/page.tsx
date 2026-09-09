import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sairAluno } from "../actions";
import IniciarTesteForm from "./IniciarTesteForm";

export default async function PainelAlunoPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const aluno = await prisma.aluno.findUnique({ where: { id: sessao.id } });
  if (!aluno) redirect("/aluno/entrar");

  const tentativas = await prisma.tentativa.findMany({
    where: { alunoId: aluno.id },
    orderBy: { iniciadoEm: "desc" },
    take: 10,
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {aluno.nome}</h1>
          <p className="text-sm text-slate-600">{aluno.anoEscolar}º ano</p>
        </div>
        <form action={sairAluno}>
          <button className="text-sm text-slate-600 hover:underline">Sair</button>
        </form>
      </div>

      <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Trilha de conteúdo</h2>
        <p className="mt-1 text-sm text-slate-600">
          Estude teoria, exemplos e pratique exercícios por habilidade, no seu ritmo.
        </p>
        <Link
          href="/aluno/trilha"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Ir para a trilha →
        </Link>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Fazer um teste diagnóstico</h2>
        <p className="mt-1 text-sm text-slate-600">
          Escolha o ano e o bimestre que deseja praticar.
        </p>
        <div className="mt-4">
          <IniciarTesteForm anoSugerido={aluno.anoEscolar} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Testes anteriores</h2>
        {tentativas.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Você ainda não fez nenhum teste.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {tentativas.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium text-slate-900">
                    {t.anoEscolar}º ano · {t.bimestre}º bimestre
                  </p>
                  <p className="text-sm text-slate-500">
                    {t.finalizadoEm
                      ? t.finalizadoEm.toLocaleDateString("pt-BR")
                      : "Em andamento"}
                  </p>
                </div>
                {t.finalizadoEm ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/aluno/resultado/${t.id}`}
                      className="text-sm font-medium text-emerald-600 hover:underline"
                    >
                      {t.totalAcertos}/{t.totalQuestoes} · ver resultado
                    </Link>
                    <Link
                      href={`/aluno/resultado/${t.id}/imprimir`}
                      target="_blank"
                      className="text-sm text-slate-500 hover:underline"
                      title="Gerar relatório para impressão"
                    >
                      🖨️
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/aluno/teste/${t.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Continuar
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
