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
