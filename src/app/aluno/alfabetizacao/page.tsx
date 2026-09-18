import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";

// A trilha por níveis foi aposentada. O painel retoma o roteiro novo de aulas.
export default async function EntradaAlfabetizacaoPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");
  redirect("/aluno/painel");
}
