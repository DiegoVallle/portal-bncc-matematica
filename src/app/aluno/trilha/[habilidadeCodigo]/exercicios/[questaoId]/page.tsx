import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NIVEL_LABELS, ordenarQuestoesPratica, selecionarProximaQuestao, unescapeMarkdown } from "@/lib/trilha";
import RespostaExercicio from "./RespostaExercicio";

type AlternativaArmazenada = { texto: string; correta: boolean };

export default async function ExercicioPage({
  params,
}: {
  params: Promise<{ habilidadeCodigo: string; questaoId: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { habilidadeCodigo, questaoId } = await params;

  const questao = await prisma.questaoConteudo.findUnique({
    where: { id: questaoId },
    include: { conteudo: { include: { habilidade: true } } },
  });
  if (
    !questao ||
    questao.conteudo.habilidade.codigo !== habilidadeCodigo ||
    questao.tipoResposta !== "MULTIPLA_ESCOLHA" ||
    !Array.isArray(questao.alternativas)
  ) {
    notFound();
  }

  const todas = await prisma.questaoConteudo.findMany({
    where: { conteudoId: questao.conteudoId, tipoResposta: "MULTIPLA_ESCOLHA", nivel: { not: "AVALIACAO" } },
  });
  const ordenadas = ordenarQuestoesPratica(todas);

  const tentativas = await prisma.tentativaQuestaoConteudo.findMany({
    where: { alunoId: sessao.id, questaoConteudoId: { in: ordenadas.map((q) => q.id) } },
    orderBy: { criadaEm: "asc" },
  });

  const resolvidas = new Set<string>();
  const contagem = new Map<string, number>();
  for (const t of tentativas) {
    contagem.set(t.questaoConteudoId, (contagem.get(t.questaoConteudoId) ?? 0) + 1);
    if (t.correta) resolvidas.add(t.questaoConteudoId);
  }
  for (const [id, n] of contagem) if (n >= 3) resolvidas.add(id);

  const tentativasDestaQuestao = tentativas.filter((t) => t.questaoConteudoId === questaoId);
  const jaResolvida = resolvidas.has(questaoId);

  const posicao = ordenadas.findIndex((q) => q.id === questaoId);
  const proximaId = selecionarProximaQuestao(ordenadas, resolvidas, questaoId);

  const alternativas = questao.alternativas as AlternativaArmazenada[];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <p className="text-sm">
        <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="text-slate-600 hover:underline">
          ← Voltar para a habilidade
        </Link>
      </p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
          Nível: {NIVEL_LABELS[questao.nivel] ?? questao.nivel}
        </span>
        <span className="text-slate-500">
          Prática · {posicao + 1} de {ordenadas.length}
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-medium text-slate-900">{unescapeMarkdown(questao.enunciado)}</p>

        <RespostaExercicio
          key={questaoId}
          questaoId={questaoId}
          alternativasTexto={alternativas.map((a) => unescapeMarkdown(a.texto))}
          tentativasUsadas={tentativasDestaQuestao.length}
          jaResolvidaAoEntrar={jaResolvida}
          revelacaoInicial={
            jaResolvida
              ? {
                  alternativaCorretaIndex: alternativas.findIndex((a) => a.correta),
                  resolucao: questao.resolucao ? unescapeMarkdown(questao.resolucao) : null,
                  algumaCorreta: tentativasDestaQuestao.some((t) => t.correta),
                }
              : null
          }
          habilidadeCodigo={habilidadeCodigo}
          proximaHref={
            proximaId
              ? `/aluno/trilha/${habilidadeCodigo}/exercicios/${proximaId}`
              : `/aluno/trilha/${habilidadeCodigo}/exercicios`
          }
        />
      </div>
    </main>
  );
}
