"use server";

// Server Actions do roteiro de 72 aulas. Arquivo próprio, isolado da trilha
// de 10 níveis (src/app/aluno/alfabetizacao/actions.ts) — nenhum dos dois
// mexe no outro. Mesmo princípio de correção server-side por texto/contagem
// normalizados (nunca índice/posição) e transação+lock contra corrida em
// duplo-tap, já estabelecidos nas outras trilhas deste app.

import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { obterSessao } from "@/lib/auth";
import { normalizarTextoFonico } from "@/lib/fonica";

export async function iniciarAula(numero: number) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const aula = await prisma.aula.findUnique({ where: { numero } });
  if (!aula) redirect("/aluno/alfabetizacao");

  // upsert atômico — mesmo motivo da trilha de níveis: um duplo-tap não pode
  // colidir na constraint única alunoId+aulaId.
  await prisma.progressoAula.upsert({
    where: { alunoId_aulaId: { alunoId: sessao.id, aulaId: aula.id } },
    create: { alunoId: sessao.id, aulaId: aula.id, status: "EM_ANDAMENTO" },
    update: {},
  });

  redirect(`/aluno/alfabetizacao/aula/${numero}`);
}

export type EstadoRespostaBloco =
  | undefined
  | {
      correta: boolean;
      erro?: string;
    };

async function aplicarProgressoAula(tx: Prisma.TransactionClient, alunoId: string, aulaId: string) {
  const blocos = await tx.blocoAula.findMany({
    where: { aulaId },
    include: { atividades: { select: { id: true } } },
  });

  const tentativasCorretas = await tx.tentativaAtividadeBloco.findMany({
    where: { alunoId, correta: true, atividade: { blocoAula: { aulaId } } },
    select: { atividadeId: true },
  });
  const acertadas = new Set(tentativasCorretas.map((t) => t.atividadeId));

  const blocosCompletos = blocos.filter((b) => b.atividades.every((a) => acertadas.has(a.id))).length;

  const progressoExistente = await tx.progressoAula.findUnique({
    where: { alunoId_aulaId: { alunoId, aulaId } },
  });

  // Nunca rebaixa uma aula já concluída — mesmo princípio da trilha de
  // níveis (aplicarProgressoFonico em ../actions.ts).
  const jaConcluida = progressoExistente?.status === "CONCLUIDA";
  const status = jaConcluida || blocosCompletos >= blocos.length ? "CONCLUIDA" : "EM_ANDAMENTO";

  await tx.progressoAula.upsert({
    where: { alunoId_aulaId: { alunoId, aulaId } },
    create: { alunoId, aulaId, status, blocosConcluidos: blocosCompletos, estrelas: blocosCompletos },
    update: { status, blocosConcluidos: blocosCompletos, estrelas: blocosCompletos },
  });
}

export async function responderAtividadeBloco(
  atividadeId: string,
  _estadoAnterior: EstadoRespostaBloco,
  formData: FormData
): Promise<EstadoRespostaBloco> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const atividade = await prisma.atividadeBloco.findUnique({
    where: { id: atividadeId },
    include: { blocoAula: { select: { aulaId: true } } },
  });
  if (!atividade) return { correta: false, erro: "Atividade inválida." };

  let correta: boolean;
  let respostaClique: string | null = null;
  let transcricaoVoz: string | null = null;
  let contagem: number | null = null;

  if (atividade.tipo === "CLIQUE_COMPARACAO") {
    respostaClique = String(formData.get("respostaClique") ?? "").trim();
    if (!respostaClique) return { correta: false, erro: "Escolha uma opção." };
    correta = normalizarTextoFonico(atividade.alvoTexto) === normalizarTextoFonico(respostaClique);
  } else if (atividade.tipo === "CONTADOR_TOQUES") {
    const contagemBruta = String(formData.get("contagem") ?? "").trim();
    contagem = contagemBruta === "" ? null : Number(contagemBruta);
    if (contagem === null || !Number.isFinite(contagem)) {
      return { correta: false, erro: "Toque pelo menos uma vez." };
    }
    correta = String(contagem) === atividade.alvoTexto.trim();
  } else if (atividade.tipo === "TRACADO_LETRA") {
    // O componente só chama esta action depois de completar todos os
    // waypoints (ver LetterTracer.tsx) — sem validação geométrica no
    // servidor nesta fase, mesma confiança já dada ao client em
    // CONTADOR_TOQUES (documentado no schema.prisma).
    correta = true;
  } else {
    // LEITURA_VOZ
    transcricaoVoz = String(formData.get("transcricao") ?? "").trim();
    if (!transcricaoVoz) return { correta: false, erro: "Não consegui ouvir. Tente falar de novo." };
    correta = atividade.semValidacao || normalizarTextoFonico(atividade.alvoTexto) === normalizarTextoFonico(transcricaoVoz);
  }

  const tempoMsBruto = Number(formData.get("tempoMs"));
  const tempoMs = Number.isFinite(tempoMsBruto) && tempoMsBruto > 0 ? Math.round(tempoMsBruto) : null;

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "Aluno" WHERE id = ${sessao.id} FOR UPDATE`;
    await tx.tentativaAtividadeBloco.create({
      data: {
        alunoId: sessao.id,
        atividadeId,
        correta,
        respostaClique: respostaClique ?? undefined,
        transcricaoVoz: transcricaoVoz ?? undefined,
        contagem: contagem ?? undefined,
        tempoMs,
      },
    });
    await aplicarProgressoAula(tx, sessao.id, atividade.blocoAula.aulaId);
  });

  return { correta };
}
