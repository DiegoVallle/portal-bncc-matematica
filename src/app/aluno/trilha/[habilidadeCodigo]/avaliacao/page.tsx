import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AvaliacaoFinalFormMC from "./AvaliacaoFinalFormMC";
import AvaliacaoFinalFormAberta from "./AvaliacaoFinalFormAberta";
import { unescapeMarkdown } from "@/lib/trilha";

type AlternativaArmazenada = { texto: string; correta: boolean };

export default async function AvaliacaoFinalPage({
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
    where: { conteudoId: habilidade.conteudo.id, nivel: "AVALIACAO" },
    orderBy: { ordem: "asc" },
  });

  if (questoes.length === 0) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="text-sm text-slate-600">Ainda não há avaliação final pronta para {habilidadeCodigo}.</p>
        <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="mt-4 inline-block text-sm text-valeedu-green-dark hover:underline">
          ← Voltar
        </Link>
      </main>
    );
  }

  // Rollout gradual (igual à prática): quando as 5 questões já têm alternativas
  // de múltipla escolha, a avaliação é corrigida automaticamente no fim; senão,
  // cai no formato aberto com autoavaliação até alguém gerar as alternativas
  // dessa habilidade.
  const todasMultiplaEscolha = questoes.every((q) => q.tipoResposta === "MULTIPLA_ESCOLHA");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <p className="text-sm">
        <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="text-slate-600 hover:underline">
          ← Voltar para a habilidade
        </Link>
      </p>

      <h1 className="mt-2 text-2xl font-bold text-slate-900">Avaliação final — {habilidade.codigo}</h1>

      {todasMultiplaEscolha ? (
        <AvaliacaoFinalFormMC
          conteudoId={habilidade.conteudo.id}
          questoes={questoes.map((q) => ({
            id: q.id,
            enunciado: unescapeMarkdown(q.enunciado),
            alternativasTexto: (q.alternativas as AlternativaArmazenada[]).map((a) => unescapeMarkdown(a.texto)),
          }))}
        />
      ) : (
        <AvaliacaoFinalFormAberta
          conteudoId={habilidade.conteudo.id}
          questoes={questoes.map((q) => ({ id: q.id, enunciado: unescapeMarkdown(q.enunciado) }))}
        />
      )}
    </main>
  );
}
