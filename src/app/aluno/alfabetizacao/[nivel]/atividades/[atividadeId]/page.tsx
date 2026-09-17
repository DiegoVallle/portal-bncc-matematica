import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDEM_FONICA, type NivelFonico } from "@/lib/alfabetizacao";
import { ordenarAtividadesFonicas, hashDeterministico, type TipoAtividadeFonica } from "@/lib/fonica";
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

  const ordenadas = ordenarAtividadesFonicas(conteudo.atividades);
  const posicao = ordenadas.findIndex((a) => a.id === atividadeId);

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
      <p className="text-center text-xs font-medium text-slate-400">
        Atividade {posicao + 1} de {ordenadas.length}
      </p>
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
