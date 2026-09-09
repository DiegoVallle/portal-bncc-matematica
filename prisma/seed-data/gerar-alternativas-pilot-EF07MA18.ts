// Gera alternativas de múltipla escolha pra EF07MA18 (prática + avaliação),
// mesmo padrão piloto→revisão→importação. Todos os 40 itens (35 prática + 5
// avaliação) convertem — nenhuma questão aberta/explicativa nessa habilidade.
// Uso: npx tsx prisma/seed-data/gerar-alternativas-pilot-EF07MA18.ts

import "dotenv/config";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type Alternativa = { texto: string; correta: boolean };
type ErroProvavel = { tipoErro: string; distratorTexto: string };
type Autorado = { ordem: number; alternativas: Alternativa[]; dicas: string[]; errosProvaveis: ErroProvavel[] };

function hash(t: string) {
  return createHash("sha256").update(t).digest("hex").slice(0, 16);
}

const AUTORADO: Autorado[] = [
  { ordem: 0, alternativas: [{ texto: "x = 17", correta: false }, { texto: "x = 7", correta: true }, { texto: "x = 60", correta: false }, { texto: "x = 2,4", correta: false }], dicas: ["Faça a operação inversa dos dois lados: subtraia 5."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 17" }] },
  { ordem: 1, alternativas: [{ texto: "x = 7", correta: false }, { texto: "x = 13", correta: true }, { texto: "x = 30", correta: false }, { texto: "x = 3,33", correta: false }], dicas: ["Faça a operação inversa: some 3 dos dois lados."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 7" }] },
  { ordem: 2, alternativas: [{ texto: "x = 16", correta: false }, { texto: "x = 9", correta: true }, { texto: "x = 36", correta: false }, { texto: "x = 20", correta: false }], dicas: ["Divida os dois lados por 2."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 16" }] },
  { ordem: 3, alternativas: [{ texto: "x = 1,33", correta: false }, { texto: "x = 12", correta: true }, { texto: "x = 7", correta: false }, { texto: "x = 4/3", correta: false }], dicas: ["Multiplique os dois lados por 3."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "x = 1,33" }] },
  { ordem: 4, alternativas: [{ texto: "x = 4,5", correta: false }, { texto: "x = 4", correta: true }, { texto: "x = 10", correta: false }, { texto: "x = 16", correta: false }], dicas: ["Primeiro subtraia 1 dos dois lados, depois divida por 2."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 4,5" }] },
  { ordem: 5, alternativas: [{ texto: "x = 15", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 11", correta: false }, { texto: "x = 45", correta: false }], dicas: ["Primeiro some 2 dos dois lados (3x = 15), depois divida por 3."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 15" }] },
  { ordem: 6, alternativas: [{ texto: "x = 16", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 80", correta: false }, { texto: "x = 24", correta: false }], dicas: ["Divida os dois lados por 4."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 16" }] },
  { ordem: 7, alternativas: [{ texto: "x = 8", correta: false }, { texto: "x = 0", correta: true }, { texto: "x = 16", correta: false }, { texto: "x = 1", correta: false }], dicas: ["Subtraia 8 dos dois lados: x = 8 − 8."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "x = 8" }] },
  { ordem: 8, alternativas: [{ texto: "x = 25", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 15", correta: false }, { texto: "x = 3", correta: false }], dicas: ["Primeiro some 5 dos dois lados (5x = 25), depois divida por 5."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 25" }] },
  { ordem: 9, alternativas: [{ texto: "x = 21", correta: false }, { texto: "x = 9", correta: true }, { texto: "x = 90", correta: false }, { texto: "x = 2,5", correta: false }], dicas: ["A equação é x + 6 = 15. Subtraia 6 dos dois lados."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 21" }] },

  { ordem: 10, alternativas: [{ texto: "x = 18", correta: false }, { texto: "x = 6", correta: true }, { texto: "x = 54", correta: false }, { texto: "x = 32", correta: false }], dicas: ["Primeiro subtraia 7 dos dois lados (3x = 18), depois divida por 3."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 18" }] },
  { ordem: 11, alternativas: [{ texto: "x = 35", correta: false }, { texto: "x = 7", correta: true }, { texto: "x = 5,4", correta: false }, { texto: "x = 95", correta: false }], dicas: ["Primeiro some 8 dos dois lados (5x = 35), depois divida por 5."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 35" }] },
  { ordem: 12, alternativas: [{ texto: "x = 16", correta: false }, { texto: "x = 8", correta: true }, { texto: "x = 23", correta: false }, { texto: "x = 32", correta: false }], dicas: ["Primeiro subtraia 15 dos dois lados (2x = 16), depois divida por 2."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 16" }] },
  { ordem: 13, alternativas: [{ texto: "x = 30", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 2", correta: false }, { texto: "x = 180", correta: false }], dicas: ["Primeiro some 9 dos dois lados (6x = 30), depois divida por 6."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 30" }] },
  { ordem: 14, alternativas: [{ texto: "x = 40", correta: false }, { texto: "x = 10", correta: true }, { texto: "x = 13", correta: false }, { texto: "x = 8", correta: false }], dicas: ["Primeiro subtraia 6 dos dois lados (4x = 40), depois divida por 4."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 40" }] },
  { ordem: 15, alternativas: [{ texto: "x = 32", correta: false }, { texto: "x = 8", correta: true }, { texto: "x = 46", correta: false }, { texto: "x = 9,75", correta: false }], dicas: ["A equação é 4x + 7 = 39. Primeiro subtraia 7, depois divida por 4."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 32" }] },
  { ordem: 16, alternativas: [{ texto: "x = 22", correta: false }, { texto: "x = 11", correta: true }, { texto: "x = 16", correta: false }, { texto: "x = 44", correta: false }], dicas: ["A equação é 5 + 2x = 27. Primeiro subtraia 5, depois divida por 2."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 22" }] },
  { ordem: 17, alternativas: [{ texto: "x = 17", correta: false }, { texto: "x = 13", correta: true }, { texto: "x = 21", correta: false }, { texto: "x = 5", correta: false }], dicas: ["A equação é 3(x+4) = 51. Primeiro divida por 3, depois subtraia 4."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 17" }] },
  { ordem: 18, alternativas: [{ texto: "x = 25", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 1", correta: false }, { texto: "x = -5", correta: false }], dicas: ["Junte os termos com x de um lado e os números do outro."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 25" }] },
  { ordem: 19, alternativas: [{ texto: "x = 14", correta: false }, { texto: "x = 7", correta: true }, { texto: "x = 3,5", correta: false }, { texto: "x = 13", correta: false }], dicas: ["Junte os termos com x de um lado e os números do outro (2x = 14)."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 14" }] },

  { ordem: 20, alternativas: [{ texto: "x = 3", correta: false }, { texto: "x = 7", correta: true }, { texto: "x = 14", correta: false }, { texto: "x = -3", correta: false }], dicas: ["Distribua o 5 em 5(x−2) antes de juntar os termos."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 3" }] },
  { ordem: 21, alternativas: [{ texto: "x = -5", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 1", correta: false }, { texto: "x = 9", correta: false }], dicas: ["Distribua os dois lados antes de juntar os termos."], errosProvaveis: [{ tipoErro: "CALCULO", distratorTexto: "x = -5" }] },
  { ordem: 22, alternativas: [{ texto: "x = 6", correta: false }, { texto: "x = 12", correta: true }, { texto: "x = 60", correta: false }, { texto: "x = 5", correta: false }], dicas: ["Ache um denominador comum pra x/2 e x/3 (é 6)."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 6" }] },
  { ordem: 23, alternativas: [{ texto: "x = 6", correta: false }, { texto: "x = 8", correta: true }, { texto: "x = 2", correta: false }, { texto: "x = 24", correta: false }], dicas: ["Primeiro some 5 dos dois lados (3x/4 = 6), depois multiplique por 4/3."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 6" }] },
  { ordem: 24, alternativas: [{ texto: "x = 4", correta: false }, { texto: "x = 8", correta: true }, { texto: "x = 16", correta: false }, { texto: "x = 2", correta: false }], dicas: ["Monte a equação: 3x − 8 = x/2 + 12."], errosProvaveis: [] },
  { ordem: 25, alternativas: [{ texto: "x = 30", correta: false }, { texto: "x = 40", correta: true }, { texto: "x = 43,33", correta: false }, { texto: "x = 60", correta: false }], dicas: ["A equação é x + (2x+10) = 130."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 30" }] },
  { ordem: 26, alternativas: [{ texto: "x = 16,5", correta: false }, { texto: "x = 14", correta: true }, { texto: "x = 28", correta: false }, { texto: "x = 9", correta: false }], dicas: ["A equação é x + (x+5) = 33."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 28" }] },
  { ordem: 27, alternativas: [{ texto: "x = 15", correta: false }, { texto: "x = 12", correta: true }, { texto: "x = 20", correta: false }, { texto: "x = 7,5", correta: false }], dicas: ["A equação é x + 3x = 60 − x. Junte todos os x de um lado."], errosProvaveis: [] },
  { ordem: 28, alternativas: [{ texto: "x = 22", correta: false }, { texto: "x = 11", correta: true }, { texto: "x = 4", correta: false }, { texto: "x = -4", correta: false }], dicas: ["A equação é 6x − 15 = 4x + 7. Junte os x de um lado."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "x = 22" }] },
  { ordem: 29, alternativas: [{ texto: "x = 120", correta: false }, { texto: "x = 160", correta: true }, { texto: "x = 200", correta: false }, { texto: "x = 90", correta: false }], dicas: ["A equação é x/4 + 30 + 90 = x."], errosProvaveis: [] },

  { ordem: 30, alternativas: [{ texto: "x = 7", correta: false }, { texto: "x = 6", correta: true }, { texto: "x = 2", correta: false }, { texto: "x = -6", correta: false }], dicas: ["Distribua os dois lados antes de juntar os termos."], errosProvaveis: [{ tipoErro: "CALCULO", distratorTexto: "x = 7" }] },
  { ordem: 31, alternativas: [{ texto: "x = 0", correta: false }, { texto: "x = 20", correta: true }, { texto: "x = 30", correta: false }, { texto: "x = -20", correta: false }], dicas: ["A equação é x + 10 = 2(x−5). Distribua o lado direito primeiro."], errosProvaveis: [{ tipoErro: "CALCULO", distratorTexto: "x = 0" }] },
  { ordem: 32, alternativas: [{ texto: "12 cm", correta: false }, { texto: "16 cm", correta: true }, { texto: "14 cm", correta: false }, { texto: "18 cm", correta: false }], dicas: ["Ache x primeiro (3x+6=42), depois calcule x+4 pro maior lado."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "12 cm" }] },
  { ordem: 33, alternativas: [{ texto: "Marcos: R$ 48,00 e Júlia: R$ 48,00", correta: false }, { texto: "Marcos: R$ 32,00 e Júlia: R$ 64,00", correta: true }, { texto: "Marcos: R$ 64,00 e Júlia: R$ 32,00", correta: false }, { texto: "Marcos: R$ 24,00 e Júlia: R$ 72,00", correta: false }], dicas: ["A equação é x + 2x = 96, onde x é o dinheiro de Marcos."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "Marcos: R$ 48,00 e Júlia: R$ 48,00" }] },
  { ordem: 34, alternativas: [{ texto: "x = 8", correta: false }, { texto: "x = 4", correta: true }, { texto: "x = 2", correta: false }, { texto: "x = -4", correta: false }], dicas: ["Distribua os dois lados antes de juntar os termos."], errosProvaveis: [{ tipoErro: "CALCULO", distratorTexto: "x = 8" }] },

  { ordem: 35, alternativas: [{ texto: "x = 15", correta: false }, { texto: "x = 5", correta: true }, { texto: "x = 75", correta: false }, { texto: "x = 25", correta: false }], dicas: [], errosProvaveis: [] },
  { ordem: 36, alternativas: [{ texto: "x = -4", correta: false }, { texto: "x = 4", correta: true }, { texto: "x = 11", correta: false }, { texto: "x = 8", correta: false }], dicas: [], errosProvaveis: [] },
  { ordem: 37, alternativas: [{ texto: "x = 40", correta: false }, { texto: "x = 8", correta: true }, { texto: "x = 5,6", correta: false }, { texto: "x = 28", correta: false }], dicas: [], errosProvaveis: [] },
  { ordem: 38, alternativas: [{ texto: "x = 15", correta: false }, { texto: "x = 10", correta: true }, { texto: "x = 30", correta: false }, { texto: "x = 20", correta: false }], dicas: [], errosProvaveis: [] },
  { ordem: 39, alternativas: [{ texto: "x = 45", correta: false }, { texto: "x = 50", correta: true }, { texto: "x = 150", correta: false }, { texto: "x = 41,67", correta: false }], dicas: [], errosProvaveis: [] },
];

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudo: { habilidade: { codigo: "EF07MA18" } } },
    orderBy: { ordem: "asc" },
  });
  const autoradoPorOrdem = new Map(AUTORADO.map((a) => [a.ordem, a]));
  const convertidos: unknown[] = [];
  const naoConvertidos: unknown[] = [];

  for (const q of questoes) {
    const autor = autoradoPorOrdem.get(q.ordem);
    if (!autor) {
      naoConvertidos.push({ questaoId: q.id, ordem: q.ordem, nivel: q.nivel, enunciado: q.enunciado, motivo: "Sem alternativas autoradas." });
      continue;
    }
    const corretas = autor.alternativas.filter((a) => a.correta);
    if (corretas.length !== 1) throw new Error(`ordem ${q.ordem}: precisa ter exatamente 1 alternativa correta`);
    convertidos.push({
      questaoId: q.id, habilidadeCodigo: "EF07MA18", nivel: q.nivel, ordem: q.ordem,
      enunciadoHash: hash(q.enunciado), enunciado: q.enunciado, respostaEsperadaOriginal: q.respostaEsperada,
      alternativas: autor.alternativas, dicas: autor.dicas, errosProvaveis: autor.errosProvaveis,
    });
  }

  const saida = {
    habilidadeCodigo: "EF07MA18", geradoEm: new Date().toISOString(),
    totalQuestoes: questoes.length, totalConvertido: convertidos.length, totalNaoConvertido: naoConvertidos.length,
    convertidos, naoConvertidos,
  };
  writeFileSync("prisma/seed-data/alternativas-pilot-EF07MA18.json", JSON.stringify(saida, null, 2));
  console.log(`Escrito: ${convertidos.length} convertidos, ${naoConvertidos.length} não convertidos.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
