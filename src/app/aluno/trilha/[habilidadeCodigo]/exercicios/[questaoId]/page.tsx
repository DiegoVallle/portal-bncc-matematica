import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  NIVEL_LABELS,
  ordenarQuestoesPratica,
  paraClienteAtividade,
  selecionarProximaQuestaoComInterativas,
  TIPO_ATIVIDADE_LABELS,
  unescapeMarkdown,
  type AtividadeInterativa as TipoAtividadeInterativa,
} from "@/lib/trilha";
import RespostaExercicio from "./RespostaExercicio";
import AtividadeInterativaView from "./AtividadeInterativa";

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
  const atividade = questao?.atividadeInterativa as unknown as TipoAtividadeInterativa | null | undefined;
  const ehMultiplaEscolha =
    questao?.tipoResposta === "MULTIPLA_ESCOLHA" && Array.isArray(questao.alternativas);
  if (!questao || questao.conteudo.habilidade.codigo !== habilidadeCodigo || (!ehMultiplaEscolha && !atividade)) {
    notFound();
  }

  // Pool de prática = múltipla escolha OU atividade interativa, nunca avaliação.
  const todas = await prisma.questaoConteudo.findMany({
    where: {
      conteudoId: questao.conteudoId,
      nivel: { not: "AVALIACAO" },
      OR: [{ tipoResposta: "MULTIPLA_ESCOLHA" }, { atividadeInterativa: { not: Prisma.DbNull } }],
    },
  });
  const ordenadas = ordenarQuestoesPratica(todas).map((q) => ({ id: q.id, interativa: !!q.atividadeInterativa }));

  const tentativas = await prisma.tentativaQuestaoConteudo.findMany({
    where: { alunoId: sessao.id, questaoConteudoId: { in: ordenadas.map((q) => q.id) } },
    orderBy: { criadaEm: "asc" },
  });

  const resolvidas = new Set<string>();
  const contagem = new Map<string, number>();
  const ordemResolucao: string[] = [];
  for (const t of tentativas) {
    const n = (contagem.get(t.questaoConteudoId) ?? 0) + 1;
    contagem.set(t.questaoConteudoId, n);
    const passouAResolvida = !resolvidas.has(t.questaoConteudoId) && (t.correta || n >= 3);
    if (passouAResolvida) {
      resolvidas.add(t.questaoConteudoId);
      ordemResolucao.push(t.questaoConteudoId);
    }
  }

  const tentativasDestaQuestao = tentativas.filter((t) => t.questaoConteudoId === questaoId);
  const jaResolvida = resolvidas.has(questaoId);

  const proximaId = selecionarProximaQuestaoComInterativas(ordenadas, resolvidas, ordemResolucao, questaoId);
  const proximaHref = proximaId
    ? `/aluno/trilha/${habilidadeCodigo}/exercicios/${proximaId}`
    : `/aluno/trilha/${habilidadeCodigo}/exercicios`;

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
        <span className="text-slate-500">Continue praticando</span>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {atividade ? (
          <AtividadeInterativaView
            key={questaoId}
            questaoId={questaoId}
            enunciado={unescapeMarkdown(questao.enunciado)}
            payload={paraClienteAtividade(atividade)}
            tituloTipo={TIPO_ATIVIDADE_LABELS[atividade.tipo]}
            jaResolvidaAoEntrar={jaResolvida}
            resolucaoInicial={
              jaResolvida
                ? {
                    resolucao: questao.resolucao ? unescapeMarkdown(questao.resolucao) : null,
                    algumaCorreta: tentativasDestaQuestao.some((t) => t.correta),
                  }
                : null
            }
            proximaHref={proximaHref}
          />
        ) : (
          <>
            <p className="text-lg font-medium text-slate-900">{unescapeMarkdown(questao.enunciado)}</p>
            <RespostaExercicio
              key={questaoId}
              questaoId={questaoId}
              alternativasTexto={(questao.alternativas as AlternativaArmazenada[]).map((a) => unescapeMarkdown(a.texto))}
              tentativasUsadas={tentativasDestaQuestao.length}
              jaResolvidaAoEntrar={jaResolvida}
              revelacaoInicial={
                jaResolvida
                  ? {
                      alternativaCorretaIndex: (questao.alternativas as AlternativaArmazenada[]).findIndex((a) => a.correta),
                      resolucao: questao.resolucao ? unescapeMarkdown(questao.resolucao) : null,
                      algumaCorreta: tentativasDestaQuestao.some((t) => t.correta),
                    }
                  : null
              }
              habilidadeCodigo={habilidadeCodigo}
              proximaHref={proximaHref}
            />
          </>
        )}
      </div>
    </main>
  );
}
