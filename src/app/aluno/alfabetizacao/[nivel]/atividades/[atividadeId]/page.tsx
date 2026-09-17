import Link from "next/link";
import CenaAlfabetizacao from "@/components/CenaAlfabetizacao";
import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDEM_FONICA, type NivelFonico } from "@/lib/alfabetizacao";
import { hashDeterministico, type TipoAtividadeFonica } from "@/lib/fonica";
import AtividadeFonicaPlayer from "./AtividadeFonicaPlayer";

function ehNivelValido(valor: string): valor is NivelFonico {
  return (ORDEM_FONICA as string[]).includes(valor);
}

export default async function AtividadeFonicaPage({
  params,
}: {
  params: Promise<{ nivel: string; atividadeId: string }>;
}) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { nivel, atividadeId } = await params;
  if (!ehNivelValido(nivel)) notFound();

  const conteudo = await prisma.conteudoAlfabetizacao.findUnique({
    where: { nivel },
    include: { atividades: true },
  });
  if (!conteudo) notFound();

  const atividade = conteudo.atividades.find((a) => a.id === atividadeId);
  if (!atividade) notFound();


  // Embaralha a ordem das opções — o banco sempre lista a opção certa
  // primeiro (mais fácil de autorar o seed), então sem isso a criança
  // aprenderia "a certa é sempre a primeira" em vez do conteúdo real.
  // Determinístico (hash do id da atividade + texto da opção), não
  // Math.random(): Server Components precisam ser puros.
  const opcoesOriginais = (atividade.opcoes as { texto: string; emoji: string }[] | null) ?? [];
  const opcoes = [...opcoesOriginais].sort(
    (a, b) => hashDeterministico(atividadeId + a.texto) - hashDeterministico(atividadeId + b.texto)
  );

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
      <Link href="/aluno/alfabetizacao" className="mb-4 inline-flex min-h-11 items-center text-sm font-medium text-valeedu-blue">← Minhas descobertas</Link>
      <h1 className="mb-4 text-center text-xl font-bold text-valeedu-blue">Vamos descobrir juntos!</h1>
      <CenaAlfabetizacao nivel={nivel} compacta />
      <AtividadeFonicaPlayer
        key={atividade.id}
        atividadeId={atividade.id}
        tipo={atividade.tipo as TipoAtividadeFonica}
        instrucaoAudio={atividade.instrucaoAudio}
        opcoes={opcoes}
        nivelHref={`/aluno/alfabetizacao/${nivel}`}
      />
    </main>
  );
}
