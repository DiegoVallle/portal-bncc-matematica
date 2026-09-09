// Gera alternativas de múltipla escolha pra EF07MA08 (prática + avaliação),
// mesmo padrão piloto→revisão→importação. 2 dos 35 itens de prática (ordem 24
// e 34) ficam de fora — são explicações abertas, não convertem honestamente.
// Uso: npx tsx prisma/seed-data/gerar-alternativas-pilot-EF07MA08.ts

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
  { ordem: 0, alternativas: [{ texto: "2/5", correta: false }, { texto: "4/5", correta: true }, { texto: "Iguais", correta: false }, { texto: "Não dá pra comparar", correta: false }], dicas: ["Mesmo denominador: compare só os numeradores."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "2/5" }] },
  { ordem: 1, alternativas: [{ texto: "3/8", correta: false }, { texto: "5/8", correta: true }, { texto: "Iguais", correta: false }, { texto: "Depende do contexto", correta: false }], dicas: ["Mesmo denominador: compare os numeradores."], errosProvaveis: [] },
  { ordem: 2, alternativas: [{ texto: "5/6, 3/6, 1/6", correta: false }, { texto: "1/6, 3/6, 5/6", correta: true }, { texto: "3/6, 1/6, 5/6", correta: false }, { texto: "1/6, 5/6, 3/6", correta: false }], dicas: ["Mesmo denominador: ordene pelos numeradores, do menor pro maior."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "5/6, 3/6, 1/6" }] },
  { ordem: 3, alternativas: [{ texto: "10/4", correta: false }, { texto: "4/10", correta: true }, { texto: "6/10", correta: false }, { texto: "4/6", correta: false }], dicas: ["A fração é: pedaços comidos sobre o total de pedaços."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "6/10" }] },
  { ordem: 4, alternativas: [{ texto: "5/2", correta: false }, { texto: "2/5", correta: true }, { texto: "1/5", correta: false }, { texto: "2/10", correta: false }], dicas: ["2 pizzas divididas entre 5 pessoas: cada um recebe 2/5."], errosProvaveis: [] },
  { ordem: 5, alternativas: [{ texto: "4/6", correta: false }, { texto: "4/10", correta: true }, { texto: "6/10", correta: false }, { texto: "6/4", correta: false }], dicas: ["Razão é sempre sobre o TOTAL (vermelhas + azuis)."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "4/6" }] },
  { ordem: 6, alternativas: [{ texto: "2 balas", correta: false }, { texto: "10 balas", correta: true }, { texto: "20 balas", correta: false }, { texto: "40 balas", correta: false }], dicas: ["1/2 de 20 é 20 dividido por 2."], errosProvaveis: [] },
  { ordem: 7, alternativas: [{ texto: "4 figurinhas", correta: false }, { texto: "12 figurinhas", correta: true }, { texto: "16 figurinhas", correta: false }, { texto: "20 figurinhas", correta: false }], dicas: ["Primeiro ache 1/4 de 16 (divida por 4), depois multiplique por 3."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "4 figurinhas" }] },
  { ordem: 8, alternativas: [{ texto: "3/100", correta: false }, { texto: "3/10", correta: true }, { texto: "Iguais", correta: false }, { texto: "Depende", correta: false }], dicas: ["Mesmo numerador: quanto MAIOR o denominador, MENOR a fração."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "3/100" }] },
  { ordem: 9, alternativas: [{ texto: "1/4", correta: false }, { texto: "1/3", correta: true }, { texto: "Iguais", correta: false }, { texto: "Depende do contexto", correta: false }], dicas: ["Mesmo numerador: quanto MENOR o denominador, MAIOR a fração."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "1/4" }] },

  { ordem: 10, alternativas: [{ texto: "3/5", correta: false }, { texto: "2/3", correta: true }, { texto: "Iguais", correta: false }, { texto: "Impossível comparar sem calculadora", correta: false }], dicas: ["MMC(3,5)=15. Reescreva as duas frações com denominador 15."], errosProvaveis: [] },
  { ordem: 11, alternativas: [{ texto: "7/9", correta: false }, { texto: "5/6", correta: true }, { texto: "Iguais", correta: false }, { texto: "5/6 ≈ 7/9", correta: false }], dicas: ["Multiplique em X: 5×9 e 7×6, compare os resultados."], errosProvaveis: [] },
  { ordem: 12, alternativas: [{ texto: "3/4, 2/3, 5/8", correta: false }, { texto: "5/8, 2/3, 3/4", correta: true }, { texto: "2/3, 5/8, 3/4", correta: false }, { texto: "5/8, 3/4, 2/3", correta: false }], dicas: ["Ache o MMC dos três denominadores (4, 8, 3) e compare."], errosProvaveis: [] },
  { ordem: 13, alternativas: [{ texto: "9/12", correta: false }, { texto: "3/4", correta: true }, { texto: "4/3", correta: false }, { texto: "3/9", correta: false }], dicas: ["Simplifique 9/12 dividindo os dois números pelo MDC(9,12)."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "9/12" }] },
  { ordem: 14, alternativas: [{ texto: "5/3", correta: false }, { texto: "3/5", correta: true }, { texto: "12/30", correta: false }, { texto: "2/5", correta: false }], dicas: ["Razão de professoras é: mulheres sobre o TOTAL de professores."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "12/30" }] },
  { ordem: 15, alternativas: [{ texto: "9 alunos", correta: false }, { texto: "18 alunos", correta: true }, { texto: "27 alunos", correta: false }, { texto: "90 alunos", correta: false }], dicas: ["Ache 1/5 de 45 primeiro, depois multiplique por 2."], errosProvaveis: [] },
  { ordem: 16, alternativas: [{ texto: "30 páginas", correta: false }, { texto: "90 páginas", correta: true }, { texto: "80 páginas", correta: false }, { texto: "150 páginas", correta: false }], dicas: ["Ache 1/8 de 240 primeiro (divida por 8), depois multiplique por 3."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "30 páginas" }] },
  { ordem: 17, alternativas: [{ texto: "5/9", correta: false }, { texto: "4/7", correta: true }, { texto: "Iguais", correta: false }, { texto: "5/9, pois 9 > 7", correta: false }], dicas: ["Multiplique em X: 4×9 e 5×7."], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "5/9, pois 9 > 7" }] },
  { ordem: 18, alternativas: [{ texto: "2/5", correta: false }, { texto: "3/5", correta: true }, { texto: "1/5", correta: false }, { texto: "4/5", correta: false }], dicas: ["O total é 5/5. Se 2/5 é polpa, o resto é 5/5 − 2/5."], errosProvaveis: [] },
  { ordem: 19, alternativas: [{ texto: "3/5, 2/3, 7/10", correta: false }, { texto: "7/10, 2/3, 3/5", correta: true }, { texto: "2/3, 7/10, 3/5", correta: false }, { texto: "7/10, 3/5, 2/3", correta: false }], dicas: ["Ache o MMC dos três denominadores e compare os numeradores equivalentes."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "3/5, 2/3, 7/10" }] },

  { ordem: 20, alternativas: [{ texto: "5/12, 7/18, 3/8", correta: false }, { texto: "3/8, 7/18, 5/12", correta: true }, { texto: "7/18, 3/8, 5/12", correta: false }, { texto: "3/8, 5/12, 7/18", correta: false }], dicas: ["MMC(12,18,8)=72. Reescreva as três frações com denominador 72."], errosProvaveis: [] },
  { ordem: 21, alternativas: [{ texto: "Time A", correta: false }, { texto: "Time B", correta: true }, { texto: "Empate", correta: false }, { texto: "Não dá pra saber sem mais dados", correta: false }], dicas: ["Multiplique em X: 5×11 e 7×8, compare os resultados."], errosProvaveis: [] },
  { ordem: 22, alternativas: [{ texto: "3/4 xícara", correta: false }, { texto: "15/4 (3¾) xícaras", correta: true }, { texto: "20/4 (5) xícaras", correta: false }, { texto: "8/4 (2) xícaras", correta: false }], dicas: ["Multiplique 3/4 por 5 (a quantidade de bolos)."], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "3/4 xícara" }] },
  { ordem: 23, alternativas: [{ texto: "100 pessoas", correta: false }, { texto: "350 pessoas", correta: true }, { texto: "250 pessoas", correta: false }, { texto: "400 pessoas", correta: false }], dicas: ["Primeiro ache 2/9 de 450 (quem votou contra), depois subtraia do total."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "100 pessoas" }] },
  { ordem: 25, alternativas: [{ texto: "24 alunos", correta: false }, { texto: "16 alunos", correta: true }, { texto: "12 alunos", correta: false }, { texto: "8 alunos", correta: false }], dicas: ["Primeiro ache quantos FORAM (3/5 de 40), depois subtraia do total."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "24 alunos" }] },
  { ordem: 26, alternativas: [{ texto: "13/18", correta: false }, { texto: "11/15", correta: true }, { texto: "Iguais", correta: false }, { texto: "13/18, pois 18 > 15", correta: false }], dicas: ["Multiplique em X: 11×18 e 13×15."], errosProvaveis: [] },
  { ordem: 27, alternativas: [{ texto: "Tanque B", correta: false }, { texto: "Tanque A", correta: true }, { texto: "Os dois têm a mesma quantidade", correta: false }, { texto: "Não dá pra comparar sem saber o tamanho", correta: false }], dicas: ["Reescreva 5/8 com denominador 16 e compare com 9/16."], errosProvaveis: [] },
  { ordem: 28, alternativas: [{ texto: "2/5, 9/25, 7/20", correta: false }, { texto: "7/20, 9/25, 2/5", correta: true }, { texto: "9/25, 7/20, 2/5", correta: false }, { texto: "7/20, 2/5, 9/25", correta: false }], dicas: ["MMC(20,25,5)=100. Reescreva as três frações com denominador 100."], errosProvaveis: [] },
  { ordem: 29, alternativas: [{ texto: "Segunda-feira", correta: false }, { texto: "Terça-feira", correta: true }, { texto: "Os dois ficaram igualmente perto", correta: false }, { texto: "Não dá pra saber sem o valor da meta", correta: false }], dicas: ["Compare 5/6 e 11/12 — transforme em decimal ou tire o MMC."], errosProvaveis: [] },

  { ordem: 30, alternativas: [{ texto: "5/6, 7/9, 11/12, 3/4", correta: false }, { texto: "3/4, 7/9, 5/6, 11/12", correta: true }, { texto: "3/4, 5/6, 7/9, 11/12", correta: false }, { texto: "11/12, 5/6, 7/9, 3/4", correta: false }], dicas: ["MMC(6,9,12,4)=36. Reescreva as quatro frações com denominador 36."], errosProvaveis: [] },
  { ordem: 31, alternativas: [{ texto: "1500 litros", correta: false }, { texto: "900 litros", correta: true }, { texto: "300 litros", correta: false }, { texto: "1200 litros", correta: false }], dicas: ["Primeiro ache quanto JÁ tem (5/8 de 2400), depois subtraia da capacidade total."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "1500 litros" }] },
  { ordem: 32, alternativas: [{ texto: "3150 motos", correta: false }, { texto: "1350 motos", correta: true }, { texto: "1500 motos", correta: false }, { texto: "643 motos", correta: false }], dicas: ["Motos são 3/10 do total (já que carros são 7/10)."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "3150 motos" }] },
  { ordem: 33, alternativas: [{ texto: "13/15", correta: false }, { texto: "2/15", correta: true }, { texto: "1/15", correta: false }, { texto: "1/5", correta: false }], dicas: ["Some o que já foi feito (2/3 + 1/5) e depois subtraia de 1 inteiro."], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "13/15" }] },

  { ordem: 35, alternativas: [{ texto: "3/7", correta: false }, { texto: "4/9", correta: true }, { texto: "Iguais", correta: false }, { texto: "3/7, pois 7 < 9", correta: false }], dicas: [], errosProvaveis: [] },
  { ordem: 36, alternativas: [{ texto: "3/4, 5/8, 7/12", correta: false }, { texto: "7/12, 5/8, 3/4", correta: true }, { texto: "5/8, 7/12, 3/4", correta: false }, { texto: "7/12, 3/4, 5/8", correta: false }], dicas: [], errosProvaveis: [] },
  { ordem: 37, alternativas: [{ texto: "4 alunos", correta: false }, { texto: "12 alunos", correta: true }, { texto: "20 alunos", correta: false }, { texto: "16 alunos", correta: false }], dicas: [], errosProvaveis: [{ tipoErro: "PROCEDIMENTO", distratorTexto: "4 alunos" }] },
  { ordem: 38, alternativas: [{ texto: "9/15", correta: false }, { texto: "3/8", correta: true }, { texto: "5/8", correta: false }, { texto: "3/5", correta: false }], dicas: [], errosProvaveis: [{ tipoErro: "CONCEITO", distratorTexto: "9/15" }] },
  { ordem: 39, alternativas: [{ texto: "2 km", correta: false }, { texto: "10 km", correta: true }, { texto: "7,2 km", correta: false }, { texto: "6 km", correta: false }], dicas: [], errosProvaveis: [{ tipoErro: "INTERPRETACAO", distratorTexto: "2 km" }] },
];

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const questoes = await prisma.questaoConteudo.findMany({
    where: { conteudo: { habilidade: { codigo: "EF07MA08" } } },
    orderBy: { ordem: "asc" },
  });
  const autoradoPorOrdem = new Map(AUTORADO.map((a) => [a.ordem, a]));
  const convertidos: unknown[] = [];
  const naoConvertidos: unknown[] = [];

  for (const q of questoes) {
    const autor = autoradoPorOrdem.get(q.ordem);
    if (!autor) {
      naoConvertidos.push({
        questaoId: q.id, ordem: q.ordem, nivel: q.nivel, enunciado: q.enunciado,
        motivo: "Explicação aberta — não converte honestamente pra múltipla escolha.",
      });
      continue;
    }
    const corretas = autor.alternativas.filter((a) => a.correta);
    if (corretas.length !== 1) throw new Error(`ordem ${q.ordem}: precisa ter exatamente 1 alternativa correta`);
    convertidos.push({
      questaoId: q.id, habilidadeCodigo: "EF07MA08", nivel: q.nivel, ordem: q.ordem,
      enunciadoHash: hash(q.enunciado), enunciado: q.enunciado, respostaEsperadaOriginal: q.respostaEsperada,
      alternativas: autor.alternativas, dicas: autor.dicas, errosProvaveis: autor.errosProvaveis,
    });
  }

  const saida = {
    habilidadeCodigo: "EF07MA08", geradoEm: new Date().toISOString(),
    totalQuestoes: questoes.length, totalConvertido: convertidos.length, totalNaoConvertido: naoConvertidos.length,
    convertidos, naoConvertidos,
  };
  writeFileSync("prisma/seed-data/alternativas-pilot-EF07MA08.json", JSON.stringify(saida, null, 2));
  console.log(`Escrito: ${convertidos.length} convertidos, ${naoConvertidos.length} não convertidos.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
