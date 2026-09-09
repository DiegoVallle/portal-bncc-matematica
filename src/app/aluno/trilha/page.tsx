import { redirect } from "next/navigation";
import Link from "next/link";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sairAluno } from "../actions";
import { NUCLEOS } from "@/lib/trilha";
import TrilhaTabs, { type HabilidadeTrilha } from "./TrilhaTabs";

export default async function TrilhaPage() {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const aluno = await prisma.aluno.findUnique({ where: { id: sessao.id } });
  if (!aluno) redirect("/aluno/entrar");

  const conteudos = await prisma.conteudo.findMany({
    where: { habilidade: { anoEscolar: aluno.anoEscolar } },
    include: { habilidade: true },
  });

  const progressos = await prisma.progressoHabilidade.findMany({
    where: { alunoId: aluno.id, conteudoId: { in: conteudos.map((c) => c.id) } },
  });
  const statusPorConteudo = new Map(progressos.map((p) => [p.conteudoId, p.status]));

  const habilidades: HabilidadeTrilha[] = conteudos.map((c) => ({
    codigo: c.habilidade.codigo,
    descricao: c.habilidade.descricao,
    status: statusPorConteudo.get(c.id) ?? "NAO_INICIADO",
  }));

  const habilidadePorCodigo = new Map(habilidades.map((h) => [h.codigo, h]));
  const porNucleo = NUCLEOS.map((n) => ({
    letra: n.letra,
    nome: n.nome,
    habilidades: n.codigos.map((c) => habilidadePorCodigo.get(c)).filter((h): h is HabilidadeTrilha => !!h),
  }));
  const todas = [...habilidades].sort((a, b) => a.codigo.localeCompare(b.codigo));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trilha de conteúdo</h1>
          <p className="text-sm text-slate-600">{aluno.anoEscolar}º ano · estude cada habilidade no seu ritmo</p>
        </div>
        <form action={sairAluno}>
          <button className="text-sm text-slate-600 hover:underline">Sair</button>
        </form>
      </div>

      <p className="mt-4 text-sm">
        <Link href="/aluno/painel" className="text-slate-600 hover:underline">
          ← Voltar ao painel
        </Link>
      </p>

      {habilidades.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">
          Ainda não há trilha de conteúdo cadastrada para o {aluno.anoEscolar}º ano.
        </p>
      ) : (
        <div className="mt-8">
          <TrilhaTabs porNucleo={porNucleo} todas={todas} />
        </div>
      )}
    </main>
  );
}
