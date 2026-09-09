// Gera o arquivo revisável de alternativas do piloto EF07MA01 (Fase 2 do plano
// da trilha). Busca as 35 questões de prática reais no banco (pra garantir que
// o enunciadoHash bate com o texto atual) e funde com as alternativas/dicas
// autoradas manualmente abaixo. NUNCA grava no banco — só gera o JSON pra
// revisão humana. O importador (prisma/import-alternativas.ts) lê esse arquivo.
//
// 7 dos 35 itens ficam de fora (permanecem tipoResposta=TEXTO): são listas
// ("liste os divisores..."), explicações abertas ou perguntas com mais de uma
// resposta válida — forçar múltipla escolha nesses casos seria inventar uma
// resposta "errada" que na verdade também pode estar certa, ou reduzir uma
// lista a uma única opção arbitrária. Ficam marcados como "naoConvertido" no
// JSON de saída, com o motivo.
//
// Uso: npx tsx prisma/seed-data/gerar-alternativas-pilot-EF07MA01.ts

import "dotenv/config";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type Alternativa = { texto: string; correta: boolean };
type ErroProvavel = { tipoErro: string; distratorTexto: string };
type Autorado = {
  ordem: number;
  alternativas: Alternativa[];
  dicas: string[];
  errosProvaveis: ErroProvavel[];
};

function hash(texto: string) {
  return createHash("sha256").update(texto).digest("hex").slice(0, 16);
}

// ordem -> conteúdo autorado. Índice da alternativa correta varia de posição
// de propósito (nunca sempre a mesma letra).
const AUTORADO: Autorado[] = [
  {
    ordem: 2,
    alternativas: [
      { texto: "Sim — 45 ÷ 9 = 5, resto 0", correta: true },
      { texto: "Não — 45 ÷ 9 = 5, resto 4", correta: false },
      { texto: "Sim — mas só porque 45 é ímpar", correta: false },
      { texto: "Não — 9 não aparece na tabuada de 45", correta: false },
    ],
    dicas: ["Divida 45 por 9 e veja se o resto é zero.", "45 ÷ 9 dá exatamente 5 — não sobra nada."],
    errosProvaveis: [
      { tipoErro: "CALCULO", distratorTexto: "Não — 45 ÷ 9 = 5, resto 4" },
      { tipoErro: "CONCEITO", distratorTexto: "Sim — mas só porque 45 é ímpar" },
    ],
  },
  {
    ordem: 3,
    alternativas: [
      { texto: "Não — 7 é primo, então não pode ser divisor de 42", correta: false },
      { texto: "Sim — 42 ÷ 7 = 6, resto 0", correta: true },
      { texto: "Não — 42 ÷ 7 = 6, resto 1", correta: false },
      { texto: "Sim — mas só de números pares", correta: false },
    ],
    dicas: ["Divida 42 por 7.", "Se o resto for zero, 7 é divisor de 42."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "Não — 7 é primo, então não pode ser divisor de 42" },
      { tipoErro: "CALCULO", distratorTexto: "Não — 42 ÷ 7 = 6, resto 1" },
    ],
  },
  {
    ordem: 5,
    alternativas: [
      { texto: "2", correta: false },
      { texto: "8", correta: false },
      { texto: "4", correta: true },
      { texto: "24", correta: false },
    ],
    dicas: ["Os divisores comuns de 8 e 12 são 1, 2 e 4.", "O MDC é o MAIOR desses divisores comuns."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "2" },
      { tipoErro: "CONCEITO", distratorTexto: "24" },
    ],
  },
  {
    ordem: 7,
    alternativas: [
      { texto: "24", correta: false },
      { texto: "3", correta: false },
      { texto: "12", correta: true },
      { texto: "4", correta: false },
    ],
    dicas: ["Os múltiplos comuns de 3 e 4 começam em 12, 24, 36...", "O MMC é o MENOR desses múltiplos comuns."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "24" }],
  },
  {
    ordem: 8,
    alternativas: [
      { texto: "1", correta: false },
      { texto: "5", correta: true },
      { texto: "30", correta: false },
      { texto: "10", correta: false },
    ],
    dicas: ["Fatore 10 e 15 ao mesmo tempo, primo por primo.", "O MDC é o produto dos primos que dividem os dois ao mesmo tempo."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "30" }],
  },
  {
    ordem: 9,
    alternativas: [
      { texto: "2", correta: false },
      { texto: "24", correta: false },
      { texto: "6", correta: false },
      { texto: "12", correta: true },
    ],
    dicas: ["Fatoração simultânea de 4 e 6.", "O MMC é o produto de TODAS as linhas da fatoração."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "2" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "24" },
    ],
  },
  {
    ordem: 10,
    alternativas: [
      { texto: "6", correta: false },
      { texto: "12", correta: true },
      { texto: "72", correta: false },
      { texto: "24", correta: false },
    ],
    dicas: ["Fatore 24 e 36 ao mesmo tempo.", "MDC = produto das linhas marcadas com ✓."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "72" }],
  },
  {
    ordem: 11,
    alternativas: [
      { texto: "5", correta: false },
      { texto: "40", correta: false },
      { texto: "300", correta: false },
      { texto: "60", correta: true },
    ],
    dicas: ["Fatoração simultânea de 15 e 20.", "MMC = produto de todas as linhas."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "5" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "300" },
    ],
  },
  {
    ordem: 12,
    alternativas: [
      { texto: "MDC = 12, MMC = 36", correta: false },
      { texto: "MDC = 6, MMC = 72", correta: true },
      { texto: "MDC = 6, MMC = 432", correta: false },
      { texto: "MDC = 3, MMC = 72", correta: false },
    ],
    dicas: ["Faça a fatoração simultânea de 18 e 24 numa tabela só.", "As linhas com ✓ formam o MDC; todas as linhas formam o MMC."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "MDC = 12, MMC = 36" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "MDC = 6, MMC = 432" },
    ],
  },
  {
    ordem: 13,
    alternativas: [
      { texto: "48 segundos", correta: false },
      { texto: "2 segundos", correta: false },
      { texto: "14 segundos", correta: false },
      { texto: "24 segundos", correta: true },
    ],
    dicas: ["'Pingar juntas de novo' é uma repetição em ciclos — isso é MMC, não MDC.", "Calcule o MMC(6, 8)."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "2 segundos" }],
  },
  {
    ordem: 14,
    alternativas: [
      { texto: "5 kits", correta: false },
      { texto: "15 kits", correta: true },
      { texto: "90 kits", correta: false },
      { texto: "3 kits", correta: false },
    ],
    dicas: ["'Do maior tamanho possível, sem sobrar' é MDC.", "Calcule o MDC(30, 45)."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "90 kits" }],
  },
  {
    ordem: 15,
    alternativas: [
      { texto: "9 minutos", correta: false },
      { texto: "3 minutos", correta: false },
      { texto: "45 minutos", correta: true },
      { texto: "135 minutos", correta: false },
    ],
    dicas: ["'Encontram de novo na largada' é MMC.", "Calcule o MMC(9, 15)."],
    errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "135 minutos" }],
  },
  {
    ordem: 16,
    alternativas: [
      { texto: "7", correta: false },
      { texto: "14", correta: true },
      { texto: "84", correta: false },
      { texto: "28", correta: false },
    ],
    dicas: ["Fatoração simultânea de 28 e 42.", "MDC = produto das linhas marcadas."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "84" }],
  },
  {
    ordem: 17,
    alternativas: [
      { texto: "3", correta: false },
      { texto: "108", correta: false },
      { texto: "18", correta: false },
      { texto: "36", correta: true },
    ],
    dicas: ["Fatoração simultânea de 9 e 12.", "MMC = produto de todas as linhas."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "3" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "108" },
    ],
  },
  {
    ordem: 18,
    alternativas: [
      { texto: "6 m", correta: false },
      { texto: "72 m", correta: false },
      { texto: "12 m", correta: true },
      { texto: "24 m", correta: false },
    ],
    dicas: ["'Do maior tamanho possível, sem sobrar terreno' é MDC.", "Calcule o MDC(24, 36)."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "72 m" }],
  },
  {
    ordem: 19,
    alternativas: [
      { texto: "1", correta: false },
      { texto: "450", correta: false },
      { texto: "30", correta: true },
      { texto: "15", correta: false },
    ],
    dicas: ["Fatoração simultânea com os três números na mesma tabela.", "MMC = produto de todas as linhas."],
    errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "450" }],
  },
  {
    ordem: 20,
    alternativas: [
      { texto: "6", correta: false },
      { texto: "2520", correta: false },
      { texto: "4", correta: false },
      { texto: "12", correta: true },
    ],
    dicas: ["Fatoração simultânea com três números na mesma tabela.", "MDC = produto das linhas marcadas com ✓ nos três."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "2520" }],
  },
  {
    ordem: 21,
    alternativas: [
      { texto: "2", correta: false },
      { texto: "120", correta: true },
      { texto: "480", correta: false },
      { texto: "48", correta: false },
    ],
    dicas: ["Fatoração simultânea com os três números.", "MMC = produto de todas as linhas."],
    errosProvaveis: [
      { tipoErro: "CONCEITO", distratorTexto: "2" },
      { tipoErro: "PROCEDIMENTO", distratorTexto: "480" },
    ],
  },
  {
    ordem: 22,
    alternativas: [
      { texto: "5 dias", correta: false },
      { texto: "300 dias", correta: false },
      { texto: "60 dias", correta: true },
      { texto: "35 dias", correta: false },
    ],
    dicas: ["'Voltam a acontecer juntas' é MMC.", "Calcule o MMC(15, 20)."],
    errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "35 dias" }],
  },
  {
    ordem: 23,
    alternativas: [
      { texto: "42 m; 3 pedaços ao todo", correta: false },
      { texto: "21 m; 18 pedaços ao todo", correta: false },
      { texto: "84 m; 4 pedaços ao todo", correta: false },
      { texto: "42 m; 9 pedaços ao todo", correta: true },
    ],
    dicas: ["O MDC dá o tamanho de cada pedaço; depois some quantos pedaços saem de cada rolo.", "MDC(84, 126, 168) = 42 m."],
    errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "42 m; 3 pedaços ao todo" }],
  },
  {
    ordem: 24,
    alternativas: [
      { texto: "2 minutos", correta: false },
      { texto: "960 minutos", correta: false },
      { texto: "120 minutos", correta: true },
      { texto: "30 minutos", correta: false },
    ],
    dicas: ["'Voltam a se encontrar' é MMC.", "Fatoração simultânea de 8, 10 e 12."],
    errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "2 minutos" }],
  },
  {
    ordem: 28,
    alternativas: [
      { texto: "São números iguais", correta: false },
      { texto: "São \"primos entre si\" — não têm nenhum divisor comum além do 1", correta: true },
      { texto: "Um dos números é primo", correta: false },
      { texto: "Não têm MMC", correta: false },
    ],
    dicas: ["Pense: se o MDC é 1, que divisores eles compartilham além do 1?", "O nome desse tipo de par de números é \"primos entre si\"."],
    errosProvaveis: [],
  },
  {
    ordem: 29,
    alternativas: [
      { texto: "9h", correta: false },
      { texto: "8h", correta: false },
      { texto: "11h", correta: false },
      { texto: "10h", correta: true },
    ],
    dicas: ["O MMC(20, 30) = 60 minutos = 1 hora entre coincidências.", "Depois das 7h: 8h (1ª vez), 9h (2ª vez), 10h (3ª vez)."],
    errosProvaveis: [
      { tipoErro: "INTERPRETACAO", distratorTexto: "9h" },
      { tipoErro: "INTERPRETACAO", distratorTexto: "8h" },
    ],
  },
  {
    ordem: 30,
    alternativas: [
      { texto: "36", correta: false },
      { texto: "41", correta: true },
      { texto: "46", correta: false },
      { texto: "31", correta: false },
    ],
    dicas: ["O número é 5 a mais que um múltiplo comum de 12 e 18.", "MMC(12, 18) = 36; some o resto 5."],
    errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "36" }],
  },
  {
    ordem: 31,
    alternativas: [
      { texto: "360 minutos", correta: false },
      { texto: "3 minutos", correta: false },
      { texto: "6 minutos", correta: true },
      { texto: "60 segundos", correta: false },
    ],
    dicas: ["Calcule o MMC(40, 60, 90) em segundos primeiro.", "Depois converta o resultado (360 segundos) pra minutos."],
    errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "360 minutos" }],
  },
  {
    ordem: 32,
    alternativas: [
      { texto: "6144", correta: false },
      { texto: "8", correta: false },
      { texto: "96", correta: true },
      { texto: "48", correta: false },
    ],
    dicas: ["Use a propriedade: MDC × MMC = produto dos dois números (só vale pra 2 números).", "MMC = 768 ÷ 8."],
    errosProvaveis: [
      { tipoErro: "PROCEDIMENTO", distratorTexto: "6144" },
      { tipoErro: "CONCEITO", distratorTexto: "8" },
    ],
  },
  {
    ordem: 33,
    alternativas: [
      { texto: "5 fileiras de tomate e 3 de alface", correta: false },
      { texto: "30 fileiras de cada", correta: false },
      { texto: "3 fileiras de tomate e 5 de alface", correta: true },
      { texto: "9 fileiras de tomate e 15 de alface", correta: false },
    ],
    dicas: ["O MDC(90, 150) dá quantos pés cabem em cada fileira.", "Divida cada quantidade pelo MDC pra saber o número de fileiras."],
    errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "5 fileiras de tomate e 3 de alface" }],
  },
  {
    ordem: 34,
    alternativas: [
      { texto: "12", correta: false },
      { texto: "45", correta: false },
      { texto: "4", correta: false },
      { texto: "20", correta: true },
    ],
    dicas: ["Use MDC × MMC = produto dos dois números.", "5 × 60 = 300; divida por 15."],
    errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "45" }],
  },
];

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudo: { habilidade: { codigo: "EF07MA01" } }, nivel: { not: "AVALIACAO" } },
    orderBy: { ordem: "asc" },
  });

  const autoradoPorOrdem = new Map(AUTORADO.map((a) => [a.ordem, a]));
  const convertidos: unknown[] = [];
  const naoConvertidos: unknown[] = [];

  for (const q of questoes) {
    const autor = autoradoPorOrdem.get(q.ordem);
    if (!autor) {
      naoConvertidos.push({
        questaoId: q.id,
        ordem: q.ordem,
        nivel: q.nivel,
        enunciado: q.enunciado,
        motivo: "Lista, explicação aberta ou pergunta com mais de uma resposta válida — não converte honestamente pra múltipla escolha.",
      });
      continue;
    }
    const corretas = autor.alternativas.filter((a) => a.correta);
    if (corretas.length !== 1) throw new Error(`ordem ${q.ordem}: precisa ter exatamente 1 alternativa correta`);

    convertidos.push({
      questaoId: q.id,
      habilidadeCodigo: "EF07MA01",
      nivel: q.nivel,
      ordem: q.ordem,
      enunciadoHash: hash(q.enunciado),
      enunciado: q.enunciado, // só pra facilitar a revisão humana, o importador confere pelo hash
      respostaEsperadaOriginal: q.respostaEsperada, // idem
      alternativas: autor.alternativas,
      dicas: autor.dicas,
      errosProvaveis: autor.errosProvaveis,
    });
  }

  const saida = {
    habilidadeCodigo: "EF07MA01",
    geradoEm: new Date().toISOString(),
    totalQuestoesPratica: questoes.length,
    totalConvertido: convertidos.length,
    totalNaoConvertido: naoConvertidos.length,
    convertidos,
    naoConvertidos,
  };

  const destino = "prisma/seed-data/alternativas-pilot-EF07MA01.json";
  writeFileSync(destino, JSON.stringify(saida, null, 2));
  console.log(`Escrito ${destino}: ${convertidos.length} convertidos, ${naoConvertidos.length} não convertidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
