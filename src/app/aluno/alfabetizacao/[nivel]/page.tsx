import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDEM_FONICA, type NivelFonico } from "@/lib/alfabetizacao";
import { ordenarAtividadesFonicas } from "@/lib/fonica";

function ehNivelValido(valor: string): valor is NivelFonico {
  return (ORDEM_FONICA as string[]).includes(valor);
}

// Sem estado próprio de UI — só decide pra qual atividade mandar o aluno (a
// primeira ainda não acertada) e redireciona. Mesmo padrão do entry-redirect
// de exercicios/page.tsx na trilha de Matemática.
export default async function NivelFonicoEntradaPage({ params }: { params: Promise<{ nivel: string }> }) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { nivel } = await params;
  if (!ehNivelValido(nivel)) notFound();

  const conteudo = await prisma.conteudoAlfabetizacao.findUnique({
    where: { nivel },
    include: { atividades: true },
  });
  if (!conteudo) notFound();

  const atividades = ordenarAtividadesFonicas(conteudo.atividades);

  // Nível existe mas ainda não tem atividades semeadas (rollout incremental)
  // — sem este guard, `atividades.find(...)` mais abaixo retorna undefined
  // do mesmo jeito que "tudo já foi acertado", mostrando a tela de
  // celebração pra um conteúdo que o aluno nunca viu.
  if (atividades.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 text-center">
        <p className="text-sm text-slate-600">Esta atividade ainda não está disponível.</p>
        <Link href="/aluno/alfabetizacao" className="mt-4 inline-block text-sm text-valeedu-green-dark hover:underline">
          ← Voltar
        </Link>
      </main>
    );
  }

  const tentativasCorretas = await prisma.tentativaAtividadeFonica.findMany({
    where: { alunoId: sessao.id, correta: true, atividadeId: { in: atividades.map((a) => a.id) } },
    select: { atividadeId: true },
  });
  const acertadas = new Set(tentativasCorretas.map((t) => t.atividadeId));

  const proxima = atividades.find((a) => !acertadas.has(a.id));

  if (!proxima) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 text-center">
        <p className="text-5xl">🎉</p>
        <p className="mt-4 text-xl font-semibold text-slate-900">Você concluiu esta atividade!</p>
        <Link
          href="/aluno/alfabetizacao"
          className="mt-6 inline-block rounded-lg bg-valeedu-green px-5 py-3 text-sm font-medium text-white hover:bg-valeedu-green-dark"
        >
          Ver todas as atividades
        </Link>
      </main>
    );
  }

  redirect(`/aluno/alfabetizacao/${nivel}/atividades/${proxima.id}`);
}
