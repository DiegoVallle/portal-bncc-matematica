"use server";

// Server Actions da Trilha de Alfabetização. Arquivo próprio, isolado da
// trilha de Matemática (src/app/aluno/trilha/actions.ts) — nenhum dos dois
// mexe no outro.
//
// Deliberadamente mais simples que o motor da trilha de Matemática nesta
// primeira versão (piloto): sem limite de 3 tentativas nem PIN de bloqueio
// (não faz sentido pedagógico travar uma criança de 5-8 anos ainda não
// alfabetizada atrás de um PIN que ela não consegue nem ler), sem dica
// progressiva (a instrução em áudio já é a "dica" — Silent Way: deixamos a
// criança tentar de novo em silêncio antes de qualquer ajuda adicional).
// Toda tentativa é preservada (nunca sobrescrita), igual ao padrão da outra
// trilha.

import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { obterSessao } from "@/lib/auth";
import type { NivelFonico } from "@/lib/alfabetizacao";
import { corrigirRespostaClique, corrigirLeituraVoz, ehAtividadeDeVoz, type TipoAtividadeFonica } from "@/lib/fonica";

// Ação explícita — chamada pelo botão "Começar", nunca automaticamente ao
// renderizar a página (mesmo princípio de iniciarHabilidade em trilha/actions.ts:
// Server Component de leitura não deve ter efeito colateral).
//
// `upsert` (não find+create) é atômico — um duplo-tap no botão não faz duas
// requisições concorrentes colidirem na constraint única alunoId+conteudoId.
// `update: {}` é intencionalmente vazio: esta trilha só cria o progresso com
// EM_APRENDIZAGEM (nunca com NAO_INICIADO), então não existe um estado
// "represado" pra promover de volta, diferente da trilha de Matemática.
export async function iniciarNivelFonico(nivel: NivelFonico) {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const conteudo = await prisma.conteudoAlfabetizacao.findUnique({ where: { nivel } });
  if (!conteudo) redirect("/aluno/alfabetizacao");

  await prisma.progressoFonico.upsert({
    where: { alunoId_conteudoId: { alunoId: sessao.id, conteudoId: conteudo.id } },
    create: { alunoId: sessao.id, conteudoId: conteudo.id, status: "EM_APRENDIZAGEM" },
    update: {},
  });

  redirect(`/aluno/alfabetizacao/${nivel}`);
}

export type EstadoRespostaFonica =
  | undefined
  | {
      correta: boolean;
      erro?: string;
      // Confiança do STT abaixo do limiar confiável — sinal de UI só ("não
      // deu pra ouvir direito, tenta de novo"), nunca decide certo/errado
      // sozinho (ver CONFIANCA_VOZ_MINIMA_CONFIAVEL em src/lib/fonica.ts).
      vozPoucoConfiavel?: boolean;
    };

async function aplicarProgressoFonico(
  tx: Prisma.TransactionClient,
  alunoId: string,
  conteudoId: string,
  correta: boolean
) {
  // Simplificação deliberada pro piloto: status por cobertura (quantas
  // atividades distintas já têm 1 tentativa certa), não por índice de domínio
  // ponderado como na trilha de Matemática — não há dado real de uso ainda
  // pra calibrar um score mais fino.
  const [total, atividadesComAcerto, progressoExistente] = await Promise.all([
    tx.atividadeFonica.count({ where: { conteudoId } }),
    tx.tentativaAtividadeFonica.groupBy({
      by: ["atividadeId"],
      where: { alunoId, correta: true, atividade: { conteudoId } },
    }),
    tx.progressoFonico.findUnique({ where: { alunoId_conteudoId: { alunoId, conteudoId } } }),
  ]);

  // Nunca rebaixa um domínio já alcançado — mesmo princípio de
  // iniciarHabilidade em trilha/actions.ts ("não rebaixa um status mais
  // avançado que já exista"). Sem isso, revisitar uma atividade já certa (via
  // voltar do navegador, por exemplo) e errar dessa vez desfaria a conclusão.
  const jaDominado = progressoExistente?.status === "DOMINADO";
  const cobriuTudo = correta && atividadesComAcerto.length >= total;
  const status = jaDominado || cobriuTudo ? "DOMINADO" : "EM_PRATICA";

  await tx.progressoFonico.upsert({
    where: { alunoId_conteudoId: { alunoId, conteudoId } },
    create: { alunoId, conteudoId, status },
    update: { status },
  });
}

export async function responderAtividadeFonica(
  atividadeId: string,
  _estadoAnterior: EstadoRespostaFonica,
  formData: FormData
): Promise<EstadoRespostaFonica> {
  const sessao = await obterSessao();
  if (!sessao || sessao.role !== "aluno") redirect("/aluno/entrar");

  const atividade = await prisma.atividadeFonica.findUnique({ where: { id: atividadeId } });
  if (!atividade) return { correta: false, erro: "Atividade inválida." };

  const tipo = atividade.tipo as TipoAtividadeFonica;
  const ehVoz = ehAtividadeDeVoz(tipo);

  let correta: boolean;
  let transcricaoVoz: string | null = null;
  let confiancaVoz: number | null = null;
  let respostaClique: string | null = null;

  if (ehVoz) {
    transcricaoVoz = String(formData.get("transcricao") ?? "").trim();
    // String vazia (STT sem confiança relatada, caso comum na Web Speech API)
    // precisa virar `null`, não `0` — `Number("")` é `0`, e 0 significaria
    // "reconhecimento confiante" em vez de "sem sinal nenhum" (ver
    // CONFIANCA_VOZ_MINIMA_CONFIAVEL em src/lib/fonica.ts).
    const confiancaBrutaTexto = String(formData.get("confianca") ?? "").trim();
    const confiancaBruta = confiancaBrutaTexto === "" ? null : Number(confiancaBrutaTexto);
    confiancaVoz = confiancaBruta !== null && Number.isFinite(confiancaBruta) ? confiancaBruta : null;
    if (!transcricaoVoz) {
      return { correta: false, erro: "Não consegui ouvir. Tente falar de novo." };
    }
    correta = corrigirLeituraVoz(atividade.alvoTexto, transcricaoVoz);
  } else {
    respostaClique = String(formData.get("respostaClique") ?? "").trim();
    if (!respostaClique) {
      return { correta: false, erro: "Escolha uma opção." };
    }
    correta = corrigirRespostaClique(atividade.alvoTexto, respostaClique);
  }

  const tempoMsBruto = Number(formData.get("tempoMs"));
  const tempoMs = Number.isFinite(tempoMsBruto) && tempoMsBruto > 0 ? Math.round(tempoMsBruto) : null;

  // Transação + lock na linha do Aluno: mesmo padrão de responderExercicio em
  // trilha/actions.ts, pra impedir que um duplo-tap/retry concorrente leia o
  // progresso antes do outro escrever e perca uma atualização (ex: os dois
  // veem "faltam 2 acertos" e nenhum computa DOMINADO, mesmo com as duas
  // respostas corretas já gravadas).
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "Aluno" WHERE id = ${sessao.id} FOR UPDATE`;
    await tx.tentativaAtividadeFonica.create({
      data: {
        alunoId: sessao.id,
        atividadeId,
        correta,
        respostaClique: respostaClique ?? undefined,
        transcricaoVoz: transcricaoVoz ?? undefined,
        confiancaVoz: confiancaVoz ?? undefined,
        tempoMs,
      },
    });
    await aplicarProgressoFonico(tx, sessao.id, atividade.conteudoId, correta);
  });

  return { correta };
}
