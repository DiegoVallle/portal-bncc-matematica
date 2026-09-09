// Gera alternativas de múltipla escolha para as 5 questões de AVALIAÇÃO final
// de EF07MA01 (piloto). Mesmo padrão piloto→revisão→importação já usado pra
// prática — busca as questões reais no banco (garante enunciadoHash correto)
// e funde com as alternativas autoradas abaixo. Não grava no banco.
//
// Uso: npx tsx prisma/seed-data/gerar-alternativas-avaliacao-EF07MA01.ts

import "dotenv/config";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type Alternativa = { texto: string; correta: boolean };
type ErroProvavel = { tipoErro: string; distratorTexto: string };
type Autorado = { ordem: number; alternativas: Alternativa[]; errosProvaveis: ErroProvavel[] };

function hash(texto: string) {
  return createHash("sha256").update(texto).digest("hex").slice(0, 16);
}

const AUTORADO: Autorado[] = [
  {
    ordem: 35, // "Calcule o MDC(16, 24)." → 8
    alternativas: [
      { texto: "4", correta: false },
      { texto: "48", correta: false },
      { texto: "8", correta: true },
      { texto: "16", correta: false },
    ],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "48" },
      { tipoErro: "CONCEITO", distratorTexto: "16" },
    ],
  },
  {
    ordem: 36, // "Calcule o MMC(6, 10)." → 30
    alternativas: [
      { texto: "2", correta: false },
      { texto: "60", correta: false },
      { texto: "16", correta: false },
      { texto: "30", correta: true },
    ],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "2" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "16" },
    ],
  },
  {
    ordem: 37, // campainhas 15/25 → MMC=75 minutos
    alternativas: [
      { texto: "15 minutos", correta: false },
      { texto: "75 minutos", correta: true },
      { texto: "375 minutos", correta: false },
      { texto: "40 minutos", correta: false },
    ],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "15 minutos" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "375 minutos" },
    ],
  },
  {
    ordem: 38, // tábuas 48/72 → MDC=24 cm
    alternativas: [
      { texto: "12 cm", correta: false },
      { texto: "144 cm", correta: false },
      { texto: "48 cm", correta: false },
      { texto: "24 cm", correta: true },
    ],
    errosProvaveis: [
      { tipoErro: "CALCULO", distratorTexto: "12 cm" },
      { tipoErro: "CONCEITO", distratorTexto: "144 cm" },
    ],
  },
  {
    ordem: 39, // MMC(4,6,9) → 36
    alternativas: [
      { texto: "1", correta: false },
      { texto: "216", correta: false },
      { texto: "36", correta: true },
      { texto: "12", correta: false },
    ],
    errosProvaveis: [
      { tipoErro: "PROCEDIMENTO", distratorTexto: "216" },
      { tipoErro: "CALCULO", distratorTexto: "12" },
    ],
  },
];

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudo: { habilidade: { codigo: "EF07MA01" } }, nivel: "AVALIACAO" },
    orderBy: { ordem: "asc" },
  });

  const autoradoPorOrdem = new Map(AUTORADO.map((a) => [a.ordem, a]));
  const convertidos: unknown[] = [];

  for (const q of questoes) {
    const autor = autoradoPorOrdem.get(q.ordem);
    if (!autor) throw new Error(`Sem alternativas autoradas pra ordem ${q.ordem}`);
    const corretas = autor.alternativas.filter((a) => a.correta);
    if (corretas.length !== 1) throw new Error(`ordem ${q.ordem}: precisa ter exatamente 1 alternativa correta`);

    convertidos.push({
      questaoId: q.id,
      habilidadeCodigo: "EF07MA01",
      nivel: q.nivel,
      ordem: q.ordem,
      enunciadoHash: hash(q.enunciado),
      enunciado: q.enunciado,
      respostaEsperadaOriginal: q.respostaEsperada,
      alternativas: autor.alternativas,
      dicas: [], // avaliação não mostra dica — sem correção/ajuda até o fim
      errosProvaveis: autor.errosProvaveis,
    });
  }

  const saida = {
    habilidadeCodigo: "EF07MA01",
    geradoEm: new Date().toISOString(),
    totalConvertido: convertidos.length,
    totalNaoConvertido: 0,
    convertidos,
    naoConvertidos: [],
  };

  const destino = "prisma/seed-data/alternativas-avaliacao-EF07MA01.json";
  writeFileSync(destino, JSON.stringify(saida, null, 2));
  console.log(`Escrito ${destino}: ${convertidos.length} convertidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
