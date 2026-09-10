import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sairProfessor } from "../actions";
import CadastrarAlunoForm from "./CadastrarAlunoForm";
import PinDesbloqueioForm from "./PinDesbloqueioForm";

export default async function DashboardProfessorPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const [professor, alunos] = await Promise.all([
    prisma.professor.findUnique({ where: { id: sessao.id } }),
    prisma.aluno.findMany({
      where: { professorId: sessao.id },
      include: {
        tentativas: { where: { finalizadoEm: { not: null } } },
      },
      orderBy: [{ anoEscolar: "asc" }, { nome: "asc" }],
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {professor?.nome}</h1>
          <p className="text-sm text-slate-600">Cadastre alunos e acompanhe o diagnóstico.</p>
        </div>
        <form action={sairProfessor}>
          <button className="text-sm text-slate-600 hover:underline">Sair</button>
        </form>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">PIN de desbloqueio</h2>
        <p className="mt-1 text-sm text-slate-600">
          Depois de 3 erros numa questão da trilha, o aluno precisa desse PIN pra ver a resposta e continuar.
        </p>
        <PinDesbloqueioForm pinAtual={professor?.pinDesbloqueio ?? "1234"} />
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Cadastrar aluno</h2>
        <p className="mt-1 text-sm text-slate-600">
          Crie o acesso do aluno e informe o usuário e a senha para ele entrar no portal.
        </p>
        <div className="mt-3">
          <CadastrarAlunoForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Seus alunos</h2>
        {alunos.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Você ainda não cadastrou nenhum aluno.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {alunos.map((aluno) => {
              const totalAcertos = aluno.tentativas.reduce((s, t) => s + t.totalAcertos, 0);
              const totalQuestoes = aluno.tentativas.reduce((s, t) => s + t.totalQuestoes, 0);
              const percentual =
                totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : null;

              return (
                <li key={aluno.id}>
                  <Link
                    href={`/professor/alunos/${aluno.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{aluno.nome}</p>
                      <p className="text-sm text-slate-500">
                        @{aluno.usuario} · {aluno.anoEscolar}º ano
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-600">
                        {aluno.tentativas.length} teste(s) concluído(s)
                      </p>
                      <p className="font-semibold text-slate-900">
                        {percentual === null ? "—" : `${percentual}% de aproveitamento`}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
