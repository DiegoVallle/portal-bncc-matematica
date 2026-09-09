import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ordenarQuestoesPratica, selecionarProximaQuestao } from "@/lib/trilha";

// Sem estado próprio de UI — só decide pra qual exercício mandar o aluno (o
// primeiro ainda não resolvido) e redireciona. "Resolvido" = alguma tentativa
// correta entre as até-3, ou as 3 tentativas já usadas sem acertar.
export default async function ExerciciosEntradaPage({
  params,
}: {
  params: Promise<{ habilidadeCodigo: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { habilidadeCodigo } = await params;

  const habilidade = await prisma.habilidade.findUnique({
    where: { codigo: habilidadeCodigo },
    include: { conteudo: true },
  });
  if (!habilidade || !habilidade.conteudo) notFound();

  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudoId: habilidade.conteudo.id, tipoResposta: "MULTIPLA_ESCOLHA", nivel: { not: "AVALIACAO" } },
  });
  const ordenadas = ordenarQuestoesPratica(questoes);

  if (ordenadas.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="text-sm text-slate-600">
          Ainda não há exercícios de múltipla escolha disponíveis para {habilidadeCodigo}.
        </p>
        <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="mt-4 inline-block text-sm text-valeedu-green-dark hover:underline">
          ← Voltar
        </Link>
      </main>
    );
  }

  const tentativas = await prisma.tentativaQuestaoConteudo.findMany({
    where: { alunoId: sessao.id, questaoConteudoId: { in: ordenadas.map((q) => q.id) } },
  });

  const resolvidas = new Set<string>();
  const contagem = new Map<string, number>();
  for (const t of tentativas) {
    contagem.set(t.questaoConteudoId, (contagem.get(t.questaoConteudoId) ?? 0) + 1);
    if (t.correta) resolvidas.add(t.questaoConteudoId);
  }
  for (const [id, n] of contagem) if (n >= 3) resolvidas.add(id);

  const proximaId = selecionarProximaQuestao(ordenadas, resolvidas);

  if (!proximaId) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="text-lg font-semibold text-slate-900">Você concluiu os exercícios disponíveis! 🎉</p>
          <p className="mt-2 text-sm text-slate-600">Que tal fazer a avaliação final pra ver se você já domina essa habilidade?</p>
          <Link
            href={`/aluno/trilha/${habilidadeCodigo}/avaliacao`}
            className="mt-4 inline-block rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
          >
            Fazer avaliação final →
          </Link>
        </div>
        <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="mt-6 inline-block text-sm text-slate-600 hover:underline">
          ← Voltar para a habilidade
        </Link>
      </main>
    );
  }

  redirect(`/aluno/trilha/${habilidadeCodigo}/exercicios/${proximaId}`);
}
