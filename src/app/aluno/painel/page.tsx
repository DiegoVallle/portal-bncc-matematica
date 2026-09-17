import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sairAluno, iniciarTentativa } from "../actions";
import { obterAtividadeAluno } from "@/lib/acesso";
import { calcularScore, NUCLEOS, STATUS_LABELS } from "@/lib/trilha";
import IniciarTesteForm from "./IniciarTesteForm";

// Peso de progresso por status, só pra desenhar a barra do mapa de núcleos —
// nunca mostrado como número/porcentagem pro aluno (ver regra "sem totais").
const PESO_STATUS: Record<string, number> = {
  NAO_INICIADO: 0,
  DIAGNOSTICO: 0.15,
  EM_APRENDIZAGEM: 0.4,
  EM_PRATICA: 0.55,
  DOMINIO_PROVISORIO: 0.75,
  DOMINADO: 1,
  REVISAO: 0.3,
  PRE_REQUISITO_PENDENTE: 0.1,
};

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

  // Mapa de progresso por núcleo — visão geral da trilha sem citar quantidade
  // de habilidades/exercícios (só a barra de preenchimento, nunca um número).
  const conteudosDoAno = await prisma.conteudo.findMany({
    where: { habilidade: { anoEscolar: aluno.anoEscolar } },
    select: { id: true, habilidade: { select: { codigo: true } } },
  });
  const progressosAluno =
    conteudosDoAno.length > 0
      ? await prisma.progressoHabilidade.findMany({
          where: { alunoId: aluno.id, conteudoId: { in: conteudosDoAno.map((c) => c.id) } },
          select: { conteudoId: true, status: true },
        })
      : [];
  const statusPorCodigo = new Map<string, string>(
    conteudosDoAno.map((c) => [
      c.habilidade.codigo,
      String(progressosAluno.find((p) => p.conteudoId === c.id)?.status ?? "NAO_INICIADO"),
    ])
  );
  const mapaNucleos = NUCLEOS.map((n) => {
    const statusDoNucleo: string[] = n.codigos
      .map((cod) => statusPorCodigo.get(cod))
      .filter((s): s is string => typeof s === "string");
    const progresso =
      statusDoNucleo.length > 0
        ? statusDoNucleo.reduce((soma, s) => soma + (PESO_STATUS[s] ?? 0), 0) / statusDoNucleo.length
        : 0;
    // Mostra o melhor status já alcançado no núcleo (não a mediana) — com só
    // 1-2 habilidades tocadas num núcleo de 5+, a mediana quase sempre dá
    // "Não iniciada" e esconde o progresso real que a barra já mostra.
    const ordenados = [...statusDoNucleo].sort((a, b) => (PESO_STATUS[b] ?? 0) - (PESO_STATUS[a] ?? 0));
    const statusPredominante = ordenados.length > 0 ? ordenados[0] : "NAO_INICIADO";
    return { ...n, progresso, disponivel: statusDoNucleo.length > 0, statusPredominante };
  }).filter((n) => n.disponivel);

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

      {mapaNucleos.length > 0 && (
        <section className="ve-card mt-6 p-6">
          <h2 className="ve-eyebrow">Seu mapa de aprendizagem</h2>
          <p className="mt-1 text-sm text-slate-600">Como você está indo em cada parte da matemática deste ano.</p>
          <ul className="mt-5 space-y-4">
            {mapaNucleos.map((n) => (
              <li key={n.letra}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800">{n.letra}. {n.nome}</span>
                  <span className="text-xs text-slate-500">{STATUS_LABELS[n.statusPredominante] ?? ""}</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  {n.progresso > 0 && (
                    <div
                      className="h-full rounded-full bg-valeedu-green transition-[width]"
                      style={{ width: `${Math.max(6, Math.round(n.progresso * 100))}%` }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Link href="/aluno/trilha" className="mt-5 inline-block text-sm font-medium text-valeedu-blue hover:underline">
            Ver toda a trilha →
          </Link>
        </section>
      )}
    </main>
  );
}
