"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { criarSessao, encerrarSessao, obterSessao } from "@/lib/auth";

export type EstadoFormulario = { erro?: string } | undefined;

export async function loginAluno(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  const aluno = await prisma.aluno.findUnique({ where: { usuario } });
  if (!aluno) {
    return { erro: "Usuário ou senha inválidos." };
  }

  const senhaCorreta = await bcrypt.compare(senha, aluno.senhaHash);
  if (!senhaCorreta) {
    return { erro: "Usuário ou senha inválidos." };
  }

  await criarSessao({ role: "aluno", id: aluno.id });
  redirect("/aluno/painel");
}

export async function sairAluno() {
  await encerrarSessao();
  redirect("/");
}

export async function iniciarTentativa(formData: FormData) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") {
    redirect("/aluno/entrar");
  }

  const anoEscolar = Number(formData.get("anoEscolar"));
  const bimestre = Number(formData.get("bimestre"));

  const totalQuestoes = await prisma.questao.count({ where: { anoEscolar, bimestre } });
  if (totalQuestoes === 0) {
    redirect("/aluno/painel");
  }

  const tentativa = await prisma.tentativa.create({
    data: { anoEscolar, bimestre, alunoId: sessao.id, totalQuestoes },
  });

  redirect(`/aluno/teste/${tentativa.id}`);
}

export async function submeterTentativa(tentativaId: string, formData: FormData) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") {
    redirect("/aluno/entrar");
  }

  const tentativa = await prisma.tentativa.findUnique({ where: { id: tentativaId } });
  if (!tentativa || tentativa.alunoId !== sessao.id) {
    redirect("/aluno/painel");
  }
  if (tentativa.finalizadoEm) {
    redirect(`/aluno/resultado/${tentativaId}`);
  }

  const questoes = await prisma.questao.findMany({
    where: { anoEscolar: tentativa.anoEscolar, bimestre: tentativa.bimestre },
    include: { alternativas: true },
  });

  let acertos = 0;
  const respostasParaCriar: {
    tentativaId: string;
    questaoId: string;
    alternativaId: string;
    correta: boolean;
  }[] = [];

  for (const questao of questoes) {
    const alternativaId = formData.get(`questao_${questao.id}`);
    if (!alternativaId || typeof alternativaId !== "string") continue;

    const alternativa = questao.alternativas.find((a) => a.id === alternativaId);
    if (!alternativa) continue;

    if (alternativa.correta) acertos++;

    respostasParaCriar.push({
      tentativaId,
      questaoId: questao.id,
      alternativaId,
      correta: alternativa.correta,
    });
  }

  await prisma.$transaction([
    prisma.resposta.deleteMany({ where: { tentativaId } }),
    prisma.resposta.createMany({ data: respostasParaCriar }),
    prisma.tentativa.update({
      where: { id: tentativaId },
      data: { totalAcertos: acertos, finalizadoEm: new Date() },
    }),
  ]);

  redirect(`/aluno/resultado/${tentativaId}`);
}
