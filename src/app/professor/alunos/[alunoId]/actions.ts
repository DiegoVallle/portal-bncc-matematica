"use server";

// Ações do professor sobre a Trilha de Conteúdo de um aluno específico.
// Arquivo próprio — não mexe em src/app/professor/actions.ts nem em
// src/app/aluno/trilha/actions.ts.

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { obterSessao } from "@/lib/auth";
import { ORDEM_PEDAGOGICA } from "@/lib/trilha";

export type EstadoFormulario = { erro?: string } | undefined;

// Só direciona o ponto de partida do aluno na trilha (o que ele vê ao clicar
// "Continuar estudando" no painel) — nunca bloqueia acesso às outras
// habilidades, que continuam navegáveis livremente.
export async function definirPontoPartidaTrilha(
  alunoId: string,
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
  if (!aluno || aluno.professorId !== sessao.id) redirect("/professor/dashboard");

  const codigo = String(formData.get("habilidadeCodigo") ?? "").trim();

  if (codigo && !ORDEM_PEDAGOGICA.includes(codigo)) {
    return { erro: "Habilidade inválida." };
  }

  await prisma.aluno.update({
    where: { id: alunoId },
    data: { trilhaPontoPartida: codigo || null },
  });

  redirect(`/professor/alunos/${alunoId}`);
}

// Converte um aluno experimental em matriculado e libera o teste completo de
// nivelamento — o "nível sugerido" é o próprio professor lendo o gráfico de
// desempenho por unidade desta página, não um cálculo automático.
export async function matricularAluno(alunoId: string) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
  if (!aluno || aluno.professorId !== sessao.id) redirect("/professor/dashboard");

  await prisma.aluno.update({
    where: { id: alunoId },
    data: { status: "MATRICULADO", diagnosticoLiberado: true },
  });

  redirect(`/professor/alunos/${alunoId}`);
}

// Libera um novo diagnóstico completo pra um aluno já matriculado (ex: pra
// reavaliar o nível depois de um tempo na trilha). Uso único — fecha sozinho
// assim que o aluno finaliza a tentativa (ver submeterTentativa).
export async function liberarDiagnostico(alunoId: string) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
  if (!aluno || aluno.professorId !== sessao.id) redirect("/professor/dashboard");

  await prisma.aluno.update({
    where: { id: alunoId },
    data: { diagnosticoLiberado: true },
  });

  redirect(`/professor/alunos/${alunoId}`);
}
