import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterAtividadeAluno } from "@/lib/acesso";
import { TIPO_ERRO_LABELS } from "@/lib/trilha";
import { sairProfessor } from "../actions";
import CadastrarAlunoForm from "./CadastrarAlunoForm";
import PinDesbloqueioForm from "./PinDesbloqueioForm";

export default async function DashboardProfessorPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const [professor, alunos, errosDaTurma] = await Promise.all([
    prisma.professor.findUnique({ where: { id: sessao.id } }),
    prisma.aluno.findMany({
      where: { professorId: sessao.id },
      include: {
        tentativas: { where: { finalizadoEm: { not: null } } },
      },
      orderBy: [{ anoEscolar: "asc" }, { nome: "asc" }],
    }),
    prisma.tentativaQuestaoConteudo.groupBy({
      by: ["tipoErro"],
      where: { aluno: { professorId: sessao.id }, tipoErro: { not: null } },
      _count: { tipoErro: true },
      orderBy: { _count: { tipoErro: "desc" } },
      take: 3,
    }),
  ]);

  // Quem precisa de uma ação do professor agora — matricular ou atribuir
  // ponto de partida (ver src/lib/acesso.ts, mesma regra do painel do aluno).
  const precisamDeAcao = alunos
    .map((aluno) => ({ aluno, atividade: obterAtividadeAluno(aluno, aluno.tentativas.length > 0) }))
    .filter((a) => a.atividade === "AGUARDANDO_MATRICULA" || a.atividade === "AGUARDANDO_ATRIBUICAO");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="ve-eyebrow mb-2">Espaço do professor</p>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {professor?.nome}</h1>
          <p className="text-sm text-slate-600">Cadastre alunos e acompanhe o diagnóstico.</p>
        </div>
        <form action={sairProfessor}>
          <button className="text-sm text-slate-600 hover:underline">Sair</button>
        </form>
      </div>

      {precisamDeAcao.length > 0 && (
        <section className="ve-card mt-8 border-l-4 border-l-amber-400 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Precisa da sua atenção</h2>
          <p className="mt-1 text-sm text-slate-600">Esses alunos estão esperando uma decisão sua pra continuar.</p>
          <ul className="mt-4 divide-y divide-slate-200">
            {precisamDeAcao.map(({ aluno, atividade }) => (
              <li key={aluno.id}>
                <Link href={`/professor/alunos/${aluno.id}`} className="flex items-center justify-between gap-3 py-3 hover:text-valeedu-blue">
                  <span className="font-medium text-slate-900">{aluno.nome}</span>
                  <span className="text-sm text-amber-700">
                    {atividade === "AGUARDANDO_MATRICULA" ? "Fez o teste resumido — matricular" : "Falta definir o ponto de partida"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {errosDaTurma.length > 0 && (
        <section className="ve-card mt-8 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Erros mais comuns da turma</h2>
          <p className="mt-1 text-sm text-slate-600">Padrões de erro identificados nas respostas da trilha de conteúdo, somando todos os alunos.</p>
          <ul className="mt-4 space-y-2">
            {errosDaTurma.map((e) => (
              <li key={e.tipoErro} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 text-sm">
                <span className="text-slate-800">{TIPO_ERRO_LABELS[e.tipoErro ?? ""] ?? e.tipoErro}</span>
                <span className="font-medium text-slate-500">{e._count.tipoErro}×</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="ve-card mt-8 p-6">
        <h2 className="text-lg font-semibold text-slate-900">PIN de desbloqueio</h2>
        <p className="mt-1 text-sm text-slate-600">
          Depois de 3 erros numa questão da trilha, o aluno precisa desse PIN pra ver a resposta e continuar.
        </p>
        <PinDesbloqueioForm pinAtual={professor?.pinDesbloqueio ?? "1234"} />
      </section>

      <section className="ve-card mt-8 p-6">
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
