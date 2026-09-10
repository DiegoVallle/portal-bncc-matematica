"use server";

// Server Actions da Trilha de Conteúdo. Arquivo próprio — nunca mexe em
// src/app/aluno/actions.ts (motor do diagnóstico).

import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { obterSessao } from "@/lib/auth";
import {
  classificarErro,
  corrigirAtividadeInterativa,
  corrigirNumerica,
  obterFeedbackTentativa,
  TIPO_ERRO_MENSAGENS,
  unescapeMarkdown,
  type AtividadeInterativa,
} from "@/lib/trilha";

type TipoErroEnum =
  | "CONCEITO"
  | "PROCEDIMENTO"
  | "CALCULO"
  | "INTERPRETACAO"
  | "REPRESENTACAO"
  | "PRE_REQUISITO"
  | "ERRO_NAO_CLASSIFICADO";

// Compartilhado entre responderExercicio e responderAtividadeInterativa —
// única fonte do upsert de ProgressoHabilidade, pra nunca reintroduzir o bug
// de contagem em dobro (create com incremento + update reaplicando por cima).
async function aplicarProgresso(
  tx: Prisma.TransactionClient,
  alunoId: string,
  conteudoId: string,
  correta: boolean,
  tipoErroSeErrado: TipoErroEnum | undefined
) {
  const progressoExistente = await tx.progressoHabilidade.findUnique({
    where: { alunoId_conteudoId: { alunoId, conteudoId } },
  });

  const incrementoDominio = correta ? 0.05 : -0.03;
  const novoDominio = Math.max(0, Math.min(1, (progressoExistente?.dominio ?? 0) + incrementoDominio));
  const novosAcertosSemAjuda = correta ? (progressoExistente?.acertosSemAjuda ?? 0) + 1 : progressoExistente?.acertosSemAjuda ?? 0;
  const novosErrosConsecutivos = correta ? 0 : (progressoExistente?.errosConsecutivos ?? 0) + 1;
  const novoUltimoTipoErro = !correta ? (tipoErroSeErrado ?? "ERRO_NAO_CLASSIFICADO") : progressoExistente?.ultimoTipoErro;

  await tx.progressoHabilidade.upsert({
    where: { alunoId_conteudoId: { alunoId, conteudoId } },
    create: {
      alunoId,
      conteudoId,
      status: "EM_APRENDIZAGEM",
      dominio: novoDominio,
      acertosSemAjuda: novosAcertosSemAjuda,
      errosConsecutivos: novosErrosConsecutivos,
      ultimoTipoErro: correta ? undefined : novoUltimoTipoErro,
    },
    update: {
      dominio: novoDominio,
      acertosSemAjuda: novosAcertosSemAjuda,
      errosConsecutivos: novosErrosConsecutivos,
      ...(correta ? {} : { ultimoTipoErro: novoUltimoTipoErro }),
    },
  });
}

export type EstadoResposta =
  | undefined
  | {
      correta: boolean;
      tentativasRestantes: number;
      dica: string | null;
      mostrarResposta: boolean;
      // 3ª tentativa errada: não revela, trava até o PIN do professor (ver
      // DesbloqueioSenha.tsx + desbloquearComSenha).
      bloqueada?: boolean;
      alternativaCorretaIndex?: number;
      // Gabarito de questão NUMERICA revelado (equivalente ao índice pra MC).
      respostaCorretaTexto?: string;
      resolucao?: string | null;
      erro?: string;
      // Sondagem da origem da dificuldade: quando o distrator escolhido tem um
      // tipo de erro autorado (ver src/lib/trilha.ts), mostra uma mensagem
      // nomeando o padrão provável, além da dica de como resolver ESSA questão.
      mensagemDiagnostico?: string | null;
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
// (nunca sobrescritas); dica evolui a cada erro. Suporta dois formatos:
// MULTIPLA_ESCOLHA (índice da alternativa) e NUMERICA (valor digitado,
// corrigido automaticamente contra `respostaEsperada` — ver corrigirNumerica).
// tempoMs é só telemetria, nunca decide nota/gate.
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
  const ehMultiplaEscolha = questao?.tipoResposta === "MULTIPLA_ESCOLHA" && Array.isArray(questao.alternativas);
  const ehNumerica = questao?.tipoResposta === "NUMERICA" && !!questao.respostaEsperada;
  if (!questao || (!ehMultiplaEscolha && !ehNumerica)) {
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: false, erro: "Questão inválida." };
  }

  const tentativasAnteriores = await prisma.tentativaQuestaoConteudo.count({
    where: { alunoId: sessao.id, questaoConteudoId },
  });
  if (tentativasAnteriores >= 3) {
    // Já esgotou as 3 — continua bloqueada até o PIN do professor (não revela aqui).
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: false, bloqueada: true };
  }

  const alternativas = ehMultiplaEscolha ? (questao.alternativas as { texto: string; correta: boolean }[]) : [];
  let indiceEscolhido: number | undefined;
  let indiceCorreto = -1;
  let valorDigitado: string | undefined;
  let correta: boolean;

  if (ehMultiplaEscolha) {
    indiceEscolhido = Number(formData.get("alternativaIndex"));
    if (!Number.isInteger(indiceEscolhido) || indiceEscolhido < 0 || indiceEscolhido >= alternativas.length) {
      return { correta: false, tentativasRestantes: 3 - tentativasAnteriores, dica: null, mostrarResposta: false, erro: "Escolha uma alternativa." };
    }
    indiceCorreto = alternativas.findIndex((a) => a.correta);
    correta = indiceEscolhido === indiceCorreto;
  } else {
    valorDigitado = String(formData.get("valorDigitado") ?? "").trim();
    if (!valorDigitado) {
      return { correta: false, tentativasRestantes: 3 - tentativasAnteriores, dica: null, mostrarResposta: false, erro: "Digite uma resposta." };
    }
    correta = corrigirNumerica(questao.respostaEsperada as string, valorDigitado);
  }

  const numeroTentativa = tentativasAnteriores + 1;
  const dicas = Array.isArray(questao.dicas) ? (questao.dicas as string[]).map(unescapeMarkdown) : [];

  const feedback = obterFeedbackTentativa({ correta, numeroTentativa, dicas });

  // Sondagem da origem da dificuldade: numa resposta errada, tenta casar o
  // distrator escolhido com o mapa `errosProvaveis` autorado pra essa questão
  // (Fase 2 — ver gerar-alternativas-pilot-*.ts). Só se aplica a múltipla
  // escolha (não há "distrator" numa resposta numérica digitada livremente).
  // Não decide nada sozinho: é guardado como hipótese (tipoErro + confiança)
  // e só vira mensagem quando encontrado; sem match, fica sem classificação.
  const diagnostico =
    !correta && ehMultiplaEscolha && indiceEscolhido !== undefined
      ? classificarErro(questao.errosProvaveis, alternativas[indiceEscolhido]?.texto ?? "")
      : null;

  // tempoMs é telemetria — não influencia correta/dica/status, só é guardado.
  const tempoMsBruto = Number(formData.get("tempoMs"));
  const tempoMs = Number.isFinite(tempoMsBruto) && tempoMsBruto > 0 ? Math.round(tempoMsBruto) : null;

  const conteudoId = questao.conteudoId;

  await prisma.$transaction(async (tx) => {
    await tx.tentativaQuestaoConteudo.create({
      data: {
        alunoId: sessao.id,
        questaoConteudoId,
        resposta: ehMultiplaEscolha ? { alternativaIndex: indiceEscolhido } : { valorDigitado },
        correta,
        tempoMs,
        tipoErro: diagnostico?.tipoErro as TipoErroEnum | undefined,
        confiancaErro: diagnostico?.confianca,
      },
    });

    await aplicarProgresso(tx, sessao.id, conteudoId, correta, diagnostico?.tipoErro as TipoErroEnum | undefined);
  });

  return {
    ...feedback,
    alternativaCorretaIndex: feedback.mostrarResposta && ehMultiplaEscolha ? indiceCorreto : undefined,
    respostaCorretaTexto: feedback.mostrarResposta && ehNumerica ? (questao.respostaEsperada as string) : undefined,
    resolucao: feedback.mostrarResposta && questao.resolucao ? unescapeMarkdown(questao.resolucao) : undefined,
    // Sempre gravado no banco (aplicarProgresso/tentativa acima), mas só
    // aparece pro aluno a partir da 2ª errada — 1ª errada fica em silêncio
    // (Fase 8a, Silent Way).
    mensagemDiagnostico: diagnostico && numeroTentativa >= 2 ? TIPO_ERRO_MENSAGENS[diagnostico.tipoErro] ?? null : null,
  };
}

// Desbloqueia uma questão travada (3 erros) depois do professor digitar o PIN
// dele (Professor.pinDesbloqueio — separado da senha de login). Marca a
// última tentativa como `desbloqueadaPeloProfessor` (é isso que faz ela
// contar como "resolvida" nas outras telas — ver calcularResolvidas em
// src/lib/trilha.ts) e devolve o gabarito, igual a uma revelação normal.
export async function desbloquearComSenha(
  questaoConteudoId: string,
  _estadoAnterior: EstadoResposta,
  formData: FormData
): Promise<EstadoResposta> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const pinDigitado = String(formData.get("pin") ?? "").trim();

  const aluno = await prisma.aluno.findUnique({ where: { id: sessao.id }, include: { professor: true } });
  if (!aluno) redirect("/aluno/entrar");

  if (!pinDigitado || pinDigitado !== aluno.professor.pinDesbloqueio) {
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: false, bloqueada: true, erro: "PIN incorreto." };
  }

  const questao = await prisma.questaoConteudo.findUnique({ where: { id: questaoConteudoId } });
  if (!questao) redirect("/aluno/trilha");

  const ultimaTentativa = await prisma.tentativaQuestaoConteudo.findFirst({
    where: { alunoId: sessao.id, questaoConteudoId },
    orderBy: { criadaEm: "desc" },
  });
  if (ultimaTentativa) {
    await prisma.tentativaQuestaoConteudo.update({
      where: { id: ultimaTentativa.id },
      data: { desbloqueadaPeloProfessor: true },
    });
  }

  const ehMultiplaEscolha = questao.tipoResposta === "MULTIPLA_ESCOLHA" && Array.isArray(questao.alternativas);
  const ehNumerica = questao.tipoResposta === "NUMERICA" && !!questao.respostaEsperada;
  const alternativas = ehMultiplaEscolha ? (questao.alternativas as { texto: string; correta: boolean }[]) : [];

  return {
    correta: false,
    tentativasRestantes: 0,
    dica: null,
    mostrarResposta: true,
    bloqueada: false,
    alternativaCorretaIndex: ehMultiplaEscolha ? alternativas.findIndex((a) => a.correta) : undefined,
    respostaCorretaTexto: ehNumerica ? (questao.respostaEsperada as string) : undefined,
    resolucao: questao.resolucao ? unescapeMarkdown(questao.resolucao) : null,
  };
}

// --- Fase 4: atividades interativas (ordenação, ligar pares, classificação) ---
// Mesmas regras do exercício padrão (até 3 tentativas, dica evolui, gabarito
// só revela no acerto ou na 3ª errada) — reaproveita obterFeedbackTentativa e
// aplicarProgresso pra manter o comportamento idêntico em toda a trilha.
// A correção compara por TEXTO contra o `atividadeInterativa` gravado no
// banco (nunca confia em índice/posição vindo do client — ver
// corrigirAtividadeInterativa em src/lib/trilha.ts).
export async function responderAtividadeInterativa(
  questaoConteudoId: string,
  _estadoAnterior: EstadoResposta,
  formData: FormData
): Promise<EstadoResposta> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const questao = await prisma.questaoConteudo.findUnique({ where: { id: questaoConteudoId } });
  const atividade = questao?.atividadeInterativa as unknown as AtividadeInterativa | null;
  if (!questao || !atividade) {
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: false, erro: "Atividade inválida." };
  }

  const tentativasAnteriores = await prisma.tentativaQuestaoConteudo.count({
    where: { alunoId: sessao.id, questaoConteudoId },
  });
  if (tentativasAnteriores >= 3) {
    // Já esgotou as 3 — continua bloqueada até o PIN do professor.
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: false, bloqueada: true };
  }

  const respostaBruta = String(formData.get("respostaJson") ?? "");
  let resposta: unknown;
  try {
    resposta = JSON.parse(respostaBruta);
  } catch {
    return { correta: false, tentativasRestantes: 3 - tentativasAnteriores, dica: null, mostrarResposta: false, erro: "Complete a atividade antes de responder." };
  }

  const correta = corrigirAtividadeInterativa(atividade, resposta);
  const numeroTentativa = tentativasAnteriores + 1;
  const dicas = Array.isArray(questao.dicas) ? (questao.dicas as string[]).map(unescapeMarkdown) : [];
  const feedback = obterFeedbackTentativa({ correta, numeroTentativa, dicas });

  const tempoMsBruto = Number(formData.get("tempoMs"));
  const tempoMs = Number.isFinite(tempoMsBruto) && tempoMsBruto > 0 ? Math.round(tempoMsBruto) : null;
  const conteudoId = questao.conteudoId;

  await prisma.$transaction(async (tx) => {
    await tx.tentativaQuestaoConteudo.create({
      data: {
        alunoId: sessao.id,
        questaoConteudoId,
        resposta: resposta as Prisma.InputJsonValue,
        correta,
        tempoMs,
      },
    });
    await aplicarProgresso(tx, sessao.id, conteudoId, correta, undefined);
  });

  return {
    ...feedback,
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
