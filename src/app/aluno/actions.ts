"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { criarSessao, encerrarSessao, obterSessao } from "@/lib/auth";

export type EstadoFormulario = { erro?: string } | undefined;

// Quantidade de questões do "teste resumido" (aluno experimental) — usa as
// primeiras N por ordem do bimestre 1 do ano do aluno, em vez do banco
// completo. Ajustável; não é um banco separado.
const TAMANHO_TESTE_RESUMIDO = 12;

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

// O aluno nunca escolhe livremente fazer um teste — só chega aqui a partir do
// botão do painel, que só aparece quando obterAtividadeAluno() indica
// TESTE_RESUMIDO ou TESTE_COMPLETO (ver src/lib/acesso.ts). `formData` só
// carrega ano/bimestre no caso do teste completo; o resumido ignora o que
// vier do form e usa sempre o ano do aluno + 1º bimestre.
export async function iniciarTentativa(formData: FormData) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") {
    redirect("/aluno/entrar");
  }

  const aluno = await prisma.aluno.findUnique({ where: { id: sessao.id } });
  if (!aluno) redirect("/aluno/entrar");

  const resumido = aluno.status === "EXPERIMENTAL";
  if (!resumido && !aluno.diagnosticoLiberado) {
    // Matriculado sem liberação: sem acesso a novo diagnóstico.
    redirect("/aluno/painel");
  }

  const anoEscolar = resumido ? aluno.anoEscolar : Number(formData.get("anoEscolar"));
  const bimestre = resumido ? 1 : Number(formData.get("bimestre"));

  const totalDisponivel = await prisma.questao.count({ where: { anoEscolar, bimestre } });
  if (totalDisponivel === 0) {
    redirect("/aluno/painel");
  }

  const limiteQuestoes = resumido ? TAMANHO_TESTE_RESUMIDO : null;
  const totalQuestoes = limiteQuestoes ? Math.min(limiteQuestoes, totalDisponivel) : totalDisponivel;

  const tentativa = await prisma.tentativa.create({
    data: { anoEscolar, bimestre, alunoId: sessao.id, totalQuestoes, limiteQuestoes },
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
    redirect("/aluno/painel");
  }

  const todasQuestoes = await prisma.questao.findMany({
    where: { anoEscolar: tentativa.anoEscolar, bimestre: tentativa.bimestre },
    include: { alternativas: true },
    orderBy: { ordem: "asc" },
  });
  // Mesmo teto aplicado na tela do teste (ver TesteDiagnosticoPage) — garante
  // que o resumido corrige exatamente as questões que o aluno viu, nunca mais.
  const questoes = tentativa.limiteQuestoes
    ? todasQuestoes.slice(0, tentativa.limiteQuestoes)
    : todasQuestoes;

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
    // O aluno nunca vê o próprio resultado — quem revisa é o professor
    // (/professor/alunos/[alunoId]). Uma liberação de diagnóstico vale pra
    // uma única tentativa: fecha aqui, só reabre se o professor liberar de novo.
    prisma.aluno.update({ where: { id: sessao.id }, data: { diagnosticoLiberado: false } }),
  ]);

  redirect("/aluno/painel?enviado=1");
}
