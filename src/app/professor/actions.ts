"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { criarSessao, encerrarSessao, obterSessao } from "@/lib/auth";

export type EstadoFormulario = { erro?: string } | undefined;

export async function cadastrarProfessor(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!nome || !email || senha.length < 6) {
    return { erro: "Preencha nome, e-mail e uma senha com pelo menos 6 caracteres." };
  }

  const existente = await prisma.professor.findUnique({ where: { email } });
  if (existente) {
    return { erro: "Já existe uma conta cadastrada com esse e-mail." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const professor = await prisma.professor.create({
    data: { nome, email, senhaHash },
  });

  await criarSessao({ role: "professor", id: professor.id });
  redirect("/professor/dashboard");
}

export async function loginProfessor(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  const professor = await prisma.professor.findUnique({ where: { email } });
  if (!professor) {
    return { erro: "E-mail ou senha inválidos." };
  }

  const senhaCorreta = await bcrypt.compare(senha, professor.senhaHash);
  if (!senhaCorreta) {
    return { erro: "E-mail ou senha inválidos." };
  }

  await criarSessao({ role: "professor", id: professor.id });
  redirect("/professor/dashboard");
}

export async function sairProfessor() {
  await encerrarSessao();
  redirect("/");
}

export async function cadastrarAlunoPeloProfessor(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") {
    redirect("/professor/login");
  }

  const nome = String(formData.get("nome") ?? "").trim();
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const anoEscolar = Number(formData.get("anoEscolar"));
  const experimental = formData.get("experimental") === "on";

  if (!nome || !usuario || senha.length < 4) {
    return { erro: "Preencha nome, usuário e uma senha com pelo menos 4 caracteres." };
  }
  if (!Number.isInteger(anoEscolar) || anoEscolar < 1 || anoEscolar > 9) {
    return { erro: "Escolha um ano escolar válido (1º a 9º ano)." };
  }

  const usuarioExistente = await prisma.aluno.findUnique({ where: { usuario } });
  if (usuarioExistente) {
    return { erro: "Esse nome de usuário já está em uso. Escolha outro." };
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  await prisma.aluno.create({
    data: {
      nome,
      usuario,
      senhaHash,
      anoEscolar,
      professorId: sessao.id,
      status: experimental ? "EXPERIMENTAL" : "MATRICULADO",
    },
  });

  redirect("/professor/dashboard");
}

// PIN curto usado pra desbloquear uma questão da trilha depois de 3 erros
// (Professor.pinDesbloqueio, default "1234") — separado da senha de login.
export async function atualizarPinDesbloqueio(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "professor") redirect("/professor/login");

  const pin = String(formData.get("pin") ?? "").trim();
  if (!/^\d{4,8}$/.test(pin)) {
    return { erro: "O PIN deve ter de 4 a 8 números." };
  }

  await prisma.professor.update({ where: { id: sessao.id }, data: { pinDesbloqueio: pin } });
  redirect("/professor/dashboard");
}
