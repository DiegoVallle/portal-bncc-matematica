import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sairAluno, iniciarTentativa } from "../actions";
import { obterAtividadeAluno } from "@/lib/acesso";
import { calcularScore } from "@/lib/trilha";
import IniciarTesteForm from "./IniciarTesteForm";

// O aluno nunca escolhe o que fazer aqui — o painel mostra sempre uma única
// atividade, decidida por obterAtividadeAluno() (ver src/lib/acesso.ts).
// Nunca mostrar quantidade de exercícios/atividades disponíveis.
export default async function PainelAlunoPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const aluno = await prisma.aluno.findUnique({ where: { id: sessao.id } });
  if (!aluno) redirect("/aluno/entrar");

  const { enviado } = await searchParams;

  const temTentativaFinalizada =
    (await prisma.tentativa.count({
      where: { alunoId: aluno.id, finalizadoEm: { not: null } },
    })) > 0;
  const atividade = obterAtividadeAluno(aluno, temTentativaFinalizada);

  const tentativasTrilha = await prisma.tentativaQuestaoConteudo.findMany({
    where: { alunoId: aluno.id },
    select: { correta: true, autoavaliada: true, questaoConteudo: { select: { nivel: true } } },
  });
  const score = calcularScore(
    tentativasTrilha.map((t) => ({
      correta: t.correta,
      autoavaliada: t.autoavaliada,
      nivel: t.questaoConteudo.nivel,
    }))
  );

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="ve-eyebrow mb-2">Meu espaço de aprendizagem</p>
          <h1 className="text-2xl font-bold text-slate-900">Olá, {aluno.nome}</h1>
          <p className="text-sm text-slate-600">{aluno.anoEscolar}º ano</p>
        </div>
        <form action={sairAluno}>
          <button className="text-sm text-slate-600 hover:underline">Sair</button>
        </form>
      </div>

      {enviado === "1" && (
        <p className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Teste enviado! Seu professor vai revisar e definir seu próximo passo.
        </p>
      )}

      <section className="ve-welcome mt-8">
        {atividade === "TESTE_RESUMIDO" && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Vamos começar!</h2>
            <p className="mt-1 text-sm text-slate-600">
              Antes de tudo, responda um teste rápido pra seu professor conhecer seu ponto de partida.
            </p>
            <form action={iniciarTentativa} className="mt-4">
              <button
                type="submit"
                className="rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
              >
                Começar teste →
              </button>
            </form>
          </>
        )}

        {atividade === "AGUARDANDO_MATRICULA" && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Teste enviado!</h2>
            <p className="mt-1 text-sm text-slate-600">
              Seu professor vai revisar e liberar sua trilha de aprendizagem em breve.
            </p>
          </>
        )}

        {atividade === "TESTE_COMPLETO" && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Teste diagnóstico</h2>
            <p className="mt-1 text-sm text-slate-600">
              Seu professor liberou um novo teste. Escolha o ano e o bimestre indicados por ele.
            </p>
            <div className="mt-4">
              <IniciarTesteForm anoSugerido={aluno.anoEscolar} />
            </div>
          </>
        )}

        {atividade === "TRILHA" && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Trilha de conteúdo</h2>
            <p className="mt-1 text-sm text-slate-600">
              Seu professor recomendou começar por {aluno.trilhaPontoPartida}.
            </p>
            <Link
              href={`/aluno/trilha/${aluno.trilhaPontoPartida}`}
              className="mt-4 inline-block rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
            >
              Continuar de {aluno.trilhaPontoPartida} →
            </Link>
          </>
        )}

        {atividade === "AGUARDANDO_ATRIBUICAO" && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Quase lá!</h2>
            <p className="mt-1 text-sm text-slate-600">
              Seu professor vai definir por onde você começa a estudar. Volte em breve.
            </p>
          </>
        )}
      </section>

      <section className="ve-card mt-6 p-6">
        <p className="text-sm text-slate-600">Cada conquista conta</p>
        <p className="mt-2 text-4xl font-semibold tracking-tight text-valeedu-green">{score} pontos</p>
      </section>
    </main>
  );
}
