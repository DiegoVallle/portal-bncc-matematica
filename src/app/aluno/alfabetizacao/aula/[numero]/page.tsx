import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterAulaInfo, obterProximaAula, NUMERO_ULTIMA_AULA_PRONTA, BLOCO_TIPO_LABELS } from "@/lib/aulas";
import { hashDeterministico } from "@/lib/fonica";
import { obterMedalhaSeAplicavel, obterDecoracaoBloco, obterIconeToque } from "@/lib/assets-visuais";
import AtividadeBlocoPlayer from "./AtividadeBlocoPlayer";

// Única trilha ativa de alfabetização: roteiro sequencial de 72 aulas.
export default async function AulaPage({ params }: { params: Promise<{ numero: string }> }) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const { numero: numeroBruto } = await params;
  const numero = Number(numeroBruto);
  if (!Number.isInteger(numero) || numero < 1 || numero > 72) notFound();

  const info = obterAulaInfo(numero);
  if (!info) notFound();

  if (numero > NUMERO_ULTIMA_AULA_PRONTA) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 text-center">
        <p className="text-sm text-slate-600">
          Aula {numero}: {info.titulo}
        </p>
        <p className="mt-4 text-lg font-semibold text-slate-900">Essa aula ainda está em preparação.</p>
        <Link href="/aluno/alfabetizacao" className="mt-6 inline-block text-sm text-valeedu-green-dark hover:underline">
          ← Voltar
        </Link>
      </main>
    );
  }

  const aula = await prisma.aula.findUnique({
    where: { numero },
    include: { blocos: { orderBy: { ordem: "asc" }, include: { atividades: { orderBy: { ordem: "asc" } } } } },
  });
  if (!aula) notFound();

  const atividadeIds = aula.blocos.flatMap((b) => b.atividades.map((a) => a.id));
  const tentativasCorretas = await prisma.tentativaAtividadeBloco.findMany({
    where: { alunoId: sessao.id, correta: true, atividadeId: { in: atividadeIds } },
    select: { atividadeId: true },
  });
  const acertadas = new Set(tentativasCorretas.map((t) => t.atividadeId));

  const blocoAtual = aula.blocos.find((b) => !b.atividades.every((a) => acertadas.has(a.id)));

  if (!blocoAtual) {
    const proximaAula = obterProximaAula(numero);
    const medalha = obterMedalhaSeAplicavel(numero);
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 text-center">
        {medalha ? (
          <Image src={medalha.src} alt="" width={medalha.largura} height={medalha.altura} className="mx-auto h-32 w-32 object-contain" />
        ) : (
          <p className="text-5xl">🎉</p>
        )}
        <p className="mt-4 text-xl font-semibold text-slate-900">Aula {numero} concluída!</p>
        <p className="mt-1 text-sm text-slate-600">{info.titulo}</p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {proximaAula && (
            <Link
              href={`/aluno/alfabetizacao/aula/${proximaAula}`}
              className="rounded-lg bg-valeedu-green px-5 py-3 text-sm font-medium text-white hover:bg-valeedu-green-dark"
            >
              Próxima aula →
            </Link>
          )}
          <Link href="/aluno/alfabetizacao" className="text-sm text-slate-600 hover:underline">
            ← Voltar às descobertas
          </Link>
        </div>
      </main>
    );
  }

  const atividade = blocoAtual.atividades[0];
  // Embaralha as opções — mesmo motivo da trilha de níveis (o banco lista a
  // certa primeiro; sem isso a criança aprenderia posição, não conteúdo).
  const opcoesOriginais = (atividade.opcoes as { texto: string; emoji: string }[] | null) ?? [];
  const opcoes = [...opcoesOriginais].sort(
    (a, b) => hashDeterministico(atividade.id + a.texto) - hashDeterministico(atividade.id + b.texto)
  );

  const decoracao = obterDecoracaoBloco(numero, blocoAtual.ordem);
  const iconeToque = obterIconeToque(numero, blocoAtual.ordem);

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
      <p className="text-center text-xs font-medium text-slate-400">{BLOCO_TIPO_LABELS[blocoAtual.tipo]}</p>
      <h1 className="mt-1 text-center text-lg font-semibold text-slate-900">{blocoAtual.titulo}</h1>
      {decoracao && (
        <Image
          src={decoracao.src}
          alt=""
          width={decoracao.largura}
          height={decoracao.altura}
          className="mx-auto mt-3 h-28 w-28 object-contain"
        />
      )}
      <AtividadeBlocoPlayer
        key={atividade.id}
        atividadeId={atividade.id}
        tipo={atividade.tipo}
        instrucaoAudio={atividade.instrucaoAudio}
        opcoes={opcoes}
        aulaHref={`/aluno/alfabetizacao/aula/${numero}`}
        primeiroBloco={blocoAtual.ordem === 1}
        iconeToque={iconeToque}
        alvoTexto={atividade.alvoTexto}
      />
    </main>
  );
}
