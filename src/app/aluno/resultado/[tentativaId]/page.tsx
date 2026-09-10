import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";

// Aluno não tem acesso ao próprio resultado de diagnóstico — quem revisa é o
// professor, em /professor/alunos/[alunoId]. Esta rota só existe pra não
// quebrar links antigos; sempre redireciona pro painel.
export default async function ResultadoTentativaPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");
  redirect("/aluno/painel");
}
