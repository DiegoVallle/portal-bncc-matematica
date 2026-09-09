// Importa um arquivo revisado de alternativas (gerado por
// prisma/seed-data/gerar-alternativas-pilot-*.ts, revisado à mão) pro banco.
// Só toca QuestaoConteudo.{alternativas,dicas,errosProvaveis,tipoResposta} das
// questões listadas em "convertidos" — nunca deleta nada fora do arquivo, nunca
// toca em "naoConvertidos", nunca mexe no diagnóstico.
//
// Uso: npx tsx prisma/import-alternativas.ts <arquivo.json> [--dry-run] [--apenas id1,id2]

import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type Alternativa = { texto: string; correta: boolean };
type ErroProvavel = { tipoErro: string; distratorTexto: string };
type Convertido = {
  questaoId: string;
  habilidadeCodigo: string;
  nivel: string;
  ordem: number;
  enunciadoHash: string;
  enunciado: string;
  alternativas: Alternativa[];
  dicas: string[];
  errosProvaveis: ErroProvavel[];
};
type ArquivoAlternativas = {
  habilidadeCodigo: string;
  convertidos: Convertido[];
};

function hash(texto: string) {
  return createHash("sha256").update(texto).digest("hex").slice(0, 16);
}

const [, , arquivoArg, ...flags] = process.argv;
if (!arquivoArg) {
  console.error("Uso: npx tsx prisma/import-alternativas.ts <arquivo.json> [--dry-run] [--apenas id1,id2]");
  process.exit(1);
}
const dryRun = flags.includes("--dry-run");
const apenasFlagIndex = flags.indexOf("--apenas");
const apenas = apenasFlagIndex !== -1 ? new Set(flags[apenasFlagIndex + 1]?.split(",") ?? []) : null;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const arquivo: ArquivoAlternativas = JSON.parse(readFileSync(arquivoArg, "utf-8"));
  const itens = apenas ? arquivo.convertidos.filter((c) => apenas.has(c.questaoId)) : arquivo.convertidos;

  console.log(`${dryRun ? "[DRY RUN] " : ""}Importando ${itens.length} item(ns) de ${arquivoArg}...`);

  let validas = 0;
  let atualizadas = 0;
  let ignoradas = 0;
  let erros = 0;
  const relatorio: string[] = [];

  for (const item of itens) {
    const problema = validarItem(item);
    if (problema) {
      erros++;
      relatorio.push(`ERRO  ${item.questaoId} (ordem ${item.ordem}): ${problema}`);
      continue;
    }

    const questao = await prisma.questaoConteudo.findUnique({
      where: { id: item.questaoId },
      include: { conteudo: { include: { habilidade: true } } },
    });
    if (!questao) {
      erros++;
      relatorio.push(`ERRO  ${item.questaoId}: questão não encontrada no banco`);
      continue;
    }
    if (questao.conteudo.habilidade.codigo !== item.habilidadeCodigo) {
      erros++;
      relatorio.push(
        `ERRO  ${item.questaoId}: pertence a ${questao.conteudo.habilidade.codigo}, não a ${item.habilidadeCodigo}`
      );
      continue;
    }
    const hashAtual = hash(questao.enunciado);
    if (hashAtual !== item.enunciadoHash) {
      ignoradas++;
      relatorio.push(
        `IGNORADA ${item.questaoId}: enunciado mudou desde a exportação (hash não bate) — reexportar antes de importar`
      );
      continue;
    }

    validas++;
    if (!dryRun) {
      await prisma.questaoConteudo.update({
        where: { id: item.questaoId },
        data: {
          alternativas: item.alternativas,
          tipoResposta: "MULTIPLA_ESCOLHA",
          dicas: item.dicas,
          errosProvaveis: item.errosProvaveis,
        },
      });
      atualizadas++;
    }
  }

  console.log("");
  if (relatorio.length) console.log(relatorio.join("\n"));
  console.log("");
  console.log(
    `${itens.length} entradas lidas\n${validas} válidas\n${dryRun ? "0 atualizadas (dry-run)" : `${atualizadas} atualizadas`}\n${ignoradas} ignoradas\n${erros} erros`
  );
}

function validarItem(item: Convertido): string | null {
  if (!Array.isArray(item.alternativas) || item.alternativas.length < 2) {
    return "precisa de pelo menos 2 alternativas";
  }
  const corretas = item.alternativas.filter((a) => a.correta);
  if (corretas.length !== 1) return `precisa de exatamente 1 alternativa correta (achou ${corretas.length})`;
  if (item.alternativas.some((a) => !a.texto || !a.texto.trim())) return "alternativa com texto vazio";
  return null;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
