"use server";

import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import type { NivelFonico } from "@/lib/alfabetizacao";

export type EstadoRespostaFonica = undefined | {
  correta: boolean;
  erro?: string;
  vozPoucoConfiavel?: boolean;
};

async function abrirNovaTrilha(): Promise<never> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");
  redirect("/aluno/painel");
}

// Compatibilidade com abas antigas: nenhuma escrita nos modelos aposentados.
export async function iniciarNivelFonico(_nivel: NivelFonico) {
  void _nivel;
  return abrirNovaTrilha();
}

export async function responderAtividadeFonica(
  _atividadeId: string,
  _estadoAnterior: EstadoRespostaFonica,
  _formData: FormData,
): Promise<EstadoRespostaFonica> {
  void _atividadeId;
  void _estadoAnterior;
  void _formData;
  return abrirNovaTrilha();
}
