"use server";

// Server Actions da Trilha de Conteúdo. Arquivo próprio — nunca mexe em
// src/app/aluno/actions.ts (motor do diagnóstico).

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obterSessao } from "@/lib/auth";
import { obterFeedbackTentativa, unescapeMarkdown } from "@/lib/trilha";

export type EstadoResposta =
  | undefined
  | {
      correta: boolean;
      tentativasRestantes: number;
      dica: string | null;
      mostrarResposta: boolean;
      alternativaCorretaIndex?: number;
      resolucao?: string | null;
      erro?: string;
    };

// Ação explícita — chamada pelo botão "Começar aula"/"Continuar aula", nunca
// automaticamente ao renderizar a página de leitura (Server Component sem
// efeito colateral). Cria/atualiza ProgressoHabilidade, nunca rebaixa um
// status mais avançado que já exista.
export async function iniciarHabilidade(habilidadeCodigo: string) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const habilidade = await prisma.habilidade.findUnique({
    where: { codigo: habilidadeCodigo },
    include: { conteudo: true },
  });
  if (!habilidade || !habilidade.conteudo) redirect("/aluno/trilha");

  const existente = await prisma.progressoHabilidade.findUnique({
    where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId: habilidade.conteudo.id } },
  });

  if (!existente) {
    await prisma.progressoHabilidade.create({
      data: { alunoId: sessao.id, conteudoId: habilidade.conteudo.id, status: "EM_APRENDIZAGEM" },
    });
  } else if (existente.status === "NAO_INICIADO") {
    await prisma.progressoHabilidade.update({
      where: { id: existente.id },
      data: { status: "EM_APRENDIZAGEM" },
    });
  }
  // Qualquer outro status (EM_PRATICA, DOMINIO_PROVISORIO, DOMINADO, REVISAO...)
  // não é rebaixado — o aluno só está revisitando a aula.

  redirect(`/aluno/trilha/${habilidadeCodigo}/exercicios`);
}

// Recalcula tudo no servidor — nunca confia em "correto"/índice vindos prontos
// do client. Até 3 tentativas por questão, todas preservadas individualmente
// (nunca sobrescritas); dica evolui a cada erro, gabarito só revela na 3ª
// errada ou no acerto. tempoMs é só telemetria, nunca decide nota/gate.
export async function responderExercicio(
  questaoConteudoId: string,
  _estadoAnterior: EstadoResposta,
  formData: FormData
): Promise<EstadoResposta> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const questao = await prisma.questaoConteudo.findUnique({
    where: { id: questaoConteudoId },
    include: { conteudo: true },
  });
  if (!questao || questao.tipoResposta !== "MULTIPLA_ESCOLHA" || !Array.isArray(questao.alternativas)) {
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: false, erro: "Questão inválida." };
  }

  const tentativasAnteriores = await prisma.tentativaQuestaoConteudo.count({
    where: { alunoId: sessao.id, questaoConteudoId },
  });
  if (tentativasAnteriores >= 3) {
    const alternativas = questao.alternativas as { texto: string; correta: boolean }[];
    return {
      correta: false,
      tentativasRestantes: 0,
      dica: null,
      mostrarResposta: true,
      alternativaCorretaIndex: alternativas.findIndex((a) => a.correta),
      resolucao: questao.resolucao ? unescapeMarkdown(questao.resolucao) : null,
      erro: "Você já usou as 3 tentativas desta questão.",
    };
  }

  const indiceEscolhido = Number(formData.get("alternativaIndex"));
  const alternativas = questao.alternativas as { texto: string; correta: boolean }[];
  if (!Number.isInteger(indiceEscolhido) || indiceEscolhido < 0 || indiceEscolhido >= alternativas.length) {
    return { correta: false, tentativasRestantes: 3 - tentativasAnteriores, dica: null, mostrarResposta: false, erro: "Escolha uma alternativa." };
  }

  const indiceCorreto = alternativas.findIndex((a) => a.correta);
  const correta = indiceEscolhido === indiceCorreto;
  const numeroTentativa = tentativasAnteriores + 1;
  const dicas = Array.isArray(questao.dicas) ? (questao.dicas as string[]).map(unescapeMarkdown) : [];

  const feedback = obterFeedbackTentativa({ correta, numeroTentativa, dicas });

  // tempoMs é telemetria — não influencia correta/dica/status, só é guardado.
  const tempoMsBruto = Number(formData.get("tempoMs"));
  const tempoMs = Number.isFinite(tempoMsBruto) && tempoMsBruto > 0 ? Math.round(tempoMsBruto) : null;

  const conteudoId = questao.conteudoId;
  const incrementoDominio = correta ? 0.05 : -0.03;

  await prisma.$transaction(async (tx) => {
    await tx.tentativaQuestaoConteudo.create({
      data: {
        alunoId: sessao.id,
        questaoConteudoId,
        resposta: { alternativaIndex: indiceEscolhido },
        correta,
        tempoMs,
      },
    });

    const progresso = await tx.progressoHabilidade.upsert({
      where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId } },
      create: {
        alunoId: sessao.id,
        conteudoId,
        status: "EM_APRENDIZAGEM",
        dominio: Math.max(0, Math.min(1, incrementoDominio)),
        acertosSemAjuda: correta ? 1 : 0,
        errosConsecutivos: correta ? 0 : 1,
      },
      update: {},
    });

    await tx.progressoHabilidade.update({
      where: { id: progresso.id },
      data: {
        dominio: Math.max(0, Math.min(1, progresso.dominio + incrementoDominio)),
        acertosSemAjuda: correta ? progresso.acertosSemAjuda + 1 : progresso.acertosSemAjuda,
        errosConsecutivos: correta ? 0 : progresso.errosConsecutivos + 1,
      },
    });
  });

  return {
    ...feedback,
    alternativaCorretaIndex: feedback.mostrarResposta ? indiceCorreto : undefined,
    resolucao: feedback.mostrarResposta && questao.resolucao ? unescapeMarkdown(questao.resolucao) : undefined,
  };
}

// --- Avaliação final ---
// Formato aberto, sem gabarito automático confiável pra texto livre — em vez
// de arriscar uma comparação ingênua (falsos negativos com respostas
// matematicamente certas escritas diferente), o aluno se autoavalia depois de
// responder, comparando com a resposta esperada quando ela existir. Por isso
// o fluxo é em 2 passos/2 actions: primeiro grava só as respostas (sem
// mostrar gabarito nenhum — "sem correção na hora" de verdade, o gabarito só
// chega no payload da 2ª action, depois que o aluno já respondeu as 5), depois
// o aluno se autoavalia e só aí grava o resultado de fato.

export type EstadoRevisaoAvaliacao =
  | undefined
  | {
      questoes: {
        id: string;
        enunciado: string;
        respostaAluno: string;
        respostaEsperada: string | null;
        resolucao: string | null;
      }[];
      erro?: string;
    };

export async function revisarRespostasAvaliacao(
  conteudoId: string,
  _estadoAnterior: EstadoRevisaoAvaliacao,
  formData: FormData
): Promise<EstadoRevisaoAvaliacao> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudoId, nivel: "AVALIACAO" },
    orderBy: { ordem: "asc" },
  });
  if (questoes.length === 0) {
    return { questoes: [], erro: "Essa habilidade ainda não tem avaliação final." };
  }

  const respostasVazias = questoes.filter((q) => !String(formData.get(`resposta_${q.id}`) ?? "").trim());
  if (respostasVazias.length > 0) {
    return { questoes: [], erro: "Responda todas as questões antes de enviar." };
  }

  return {
    questoes: questoes.map((q) => ({
      id: q.id,
      enunciado: unescapeMarkdown(q.enunciado),
      respostaAluno: String(formData.get(`resposta_${q.id}`) ?? "").trim(),
      respostaEsperada: q.respostaEsperada ? unescapeMarkdown(q.respostaEsperada) : null,
      resolucao: q.resolucao ? unescapeMarkdown(q.resolucao) : null,
    })),
  };
}

// Caminho de fallback pra habilidades cuja avaliação final ainda não tem
// alternativas de múltipla escolha (rollout gradual, igual à prática). Usa
// autoavaliação porque não há gabarito automático confiável pra texto livre.
export async function submeterAvaliacaoFinalAberta(conteudoId: string, formData: FormData) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const habilidade = await prisma.habilidade.findFirst({ where: { conteudo: { id: conteudoId } } });
  if (!habilidade) redirect("/aluno/trilha");

  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudoId, nivel: "AVALIACAO" },
    orderBy: { ordem: "asc" },
  });

  let acertos = 0;
  const dados = questoes.map((q) => {
    const respostaAluno = String(formData.get(`resposta_${q.id}`) ?? "").trim();
    const correta = formData.get(`avaliacao_${q.id}`) === "true";
    if (correta) acertos++;
    return { questaoConteudoId: q.id, respostaAluno, correta };
  });

  // Todas as respostas dessa avaliação são autoavaliadas pelo aluno (não há
  // gabarito automático confiável pra texto livre nesta fase) — por isso o
  // resultado nunca fecha DOMINADO sozinho, sempre fica DOMINIO_PROVISORIO ou
  // REVISAO. Ver plano, Fase 3: "evitar consolidar DOMINADO apenas por
  // autoavaliação" até existir validação de um professor.
  const status = acertos <= 2 ? "REVISAO" : "DOMINIO_PROVISORIO";

  await prisma.$transaction(async (tx) => {
    for (const d of dados) {
      await tx.tentativaQuestaoConteudo.create({
        data: {
          alunoId: sessao.id,
          questaoConteudoId: d.questaoConteudoId,
          resposta: { texto: d.respostaAluno },
          correta: d.correta,
          autoavaliada: true,
        },
      });
    }

    await tx.progressoHabilidade.upsert({
      where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId } },
      create: { alunoId: sessao.id, conteudoId, status },
      update: { status },
    });
  });

  redirect(`/aluno/trilha/${habilidade.codigo}/avaliacao/concluida?acertos=${acertos}&total=${questoes.length}`);
}

// Caminho principal: avaliação em múltipla escolha, corrigida automaticamente
// no servidor ao final — sem feedback por questão (formulário único, igual ao
// diagnóstico), gabarito só é usado internamente pra somar o resultado.
// `correta` vem de verificação real (não autoavaliação), então o resultado
// pode fechar DOMINADO de verdade.
export async function submeterAvaliacaoFinalMC(conteudoId: string, formData: FormData) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const habilidade = await prisma.habilidade.findFirst({ where: { conteudo: { id: conteudoId } } });
  if (!habilidade) redirect("/aluno/trilha");

  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudoId, nivel: "AVALIACAO" },
    orderBy: { ordem: "asc" },
  });

  let acertos = 0;
  const dados = questoes.map((q) => {
    const alternativas = Array.isArray(q.alternativas) ? (q.alternativas as { texto: string; correta: boolean }[]) : [];
    const indiceEscolhido = Number(formData.get(`questao_${q.id}`));
    const indiceCorreto = alternativas.findIndex((a) => a.correta);
    const correta = Number.isInteger(indiceEscolhido) && indiceEscolhido === indiceCorreto;
    if (correta) acertos++;
    return { questaoConteudoId: q.id, indiceEscolhido, correta };
  });

  const status = acertos >= 4 ? "DOMINADO" : acertos === 3 ? "DOMINIO_PROVISORIO" : "REVISAO";

  await prisma.$transaction(async (tx) => {
    for (const d of dados) {
      await tx.tentativaQuestaoConteudo.create({
        data: {
          alunoId: sessao.id,
          questaoConteudoId: d.questaoConteudoId,
          resposta: { alternativaIndex: d.indiceEscolhido },
          correta: d.correta,
          autoavaliada: false,
        },
      });
    }

    await tx.progressoHabilidade.upsert({
      where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId } },
      create: { alunoId: sessao.id, conteudoId, status },
      update: { status },
    });
  });

  redirect(`/aluno/trilha/${habilidade.codigo}/avaliacao/concluida?acertos=${acertos}&total=${questoes.length}`);
}
