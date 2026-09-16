import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { FILTRO_PRATICA_GUIADA, itensPraticaGuiada } from "@/lib/pratica-guiada";
import PraticaGuiada from "./PraticaGuiada";

export default async function Page({params,searchParams}:{
  params: Promise<{habilidadeCodigo:string}>; searchParams:Promise<{questao?:string}>;
}) {
  const sessao=await obterSessao();
  if(!sessao || sessao.role!=="aluno") redirect("/aluno/entrar");
  const {habilidadeCodigo}=await params;
  const habilidade=await prisma.habilidade.findUnique({where:{codigo:habilidadeCodigo},select:{conteudo:{select:{id:true}}}});
  if(!habilidade?.conteudo) notFound();
  const itens=itensPraticaGuiada(await prisma.questaoConteudo.findMany({
    where:{...FILTRO_PRATICA_GUIADA,conteudoId:habilidade.conteudo.id,atividadeInterativa:{equals:Prisma.AnyNull}},
    select:{id:true,enunciado:true,respostaEsperada:true,resolucao:true,nivel:true,ordem:true},
  }));
  if(!itens.length) redirect(`/aluno/trilha/${habilidadeCodigo}`);
  const {questao}=await searchParams;
  const indice=questao ? itens.findIndex(q=>q.id===questao):0;
  if(indice<0) notFound();
  return <main className="mx-auto w-full max-w-3xl px-6 py-10">
    <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="text-sm text-valeedu-blue hover:underline">← Rever a explicação da aula</Link>
    <h1 className="mt-5 text-2xl font-bold text-valeedu-blue-dark">Prática com consulta à resposta</h1>
    <p className="mb-6 mt-2 text-slate-600">Resolva no seu ritmo e compare seu raciocínio. {habilidadeCodigo}</p>
    <PraticaGuiada key={itens[indice].id} item={itens[indice]} anterior={itens[indice-1]?.id??null} proximo={itens[indice+1]?.id??null} codigo={habilidadeCodigo}/>
  </main>;
}
