// Duas mudanças no banco de múltipla escolha do piloto (EF07MA01/08/18), a
// pedido do Diego:
// 1) Questão cujo resultado é só um número (ex: "24", "x = 7") vira NUMERICA
//    — corrigida automaticamente, sem virar múltipla escolha.
// 2) Questão que continua múltipla escolha ganha uma 5ª alternativa (curada
//    em prisma/seed-data/quinta-opcao-mc.ts).
// Nunca mexe em questões com atividadeInterativa (essas nunca aparecem como
// MC pro aluno, então classificá-las aqui seria inócuo mas arriscaria
// confundir uma reimportação futura — melhor excluir).
//
// Uso: npx tsx prisma/import-correcao-automatica-rollout.ts [--dry-run]

import { prisma } from "../src/lib/prisma";
import { quintaOpcao } from "./seed-data/quinta-opcao-mc";

const REGEX_NUMERO = /^-?\d+([.,]\d+)?$/;
const REGEX_X_IGUAL = /^x\s*=\s*(-?\d+(?:[.,]\d+)?)$/i;

function classificar(texto: string): { numerica: boolean; valor?: string } {
  const t = texto.trim();
  if (REGEX_NUMERO.test(t)) return { numerica: true, valor: t };
  const m = t.match(REGEX_X_IGUAL);
  if (m) return { numerica: true, valor: m[1] };
  return { numerica: false };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(dryRun ? "=== DRY RUN (nada será gravado) ===" : "=== APLICANDO ===");

  const todas = await prisma.questaoConteudo.findMany({ where: { tipoResposta: "MULTIPLA_ESCOLHA" } });
  const questoes = todas.filter((q) => q.atividadeInterativa === null);

  let viramNumerica = 0;
  let ganhamQuinta = 0;
  let semQuintaAutorada = 0;

  for (const q of questoes) {
    const alternativas = Array.isArray(q.alternativas) ? (q.alternativas as { texto: string; correta: boolean }[]) : [];
    const correta = alternativas.find((a) => a.correta);
    const classificacao = classificar((correta?.texto ?? "").trim());

    if (classificacao.numerica) {
      viramNumerica++;
      console.log(`[NUMERICA] ${q.id}: "${correta?.texto}" → respostaEsperada="${classificacao.valor}"`);
      if (!dryRun) {
        await prisma.questaoConteudo.update({
          where: { id: q.id },
          data: { tipoResposta: "NUMERICA", respostaEsperada: classificacao.valor },
        });
      }
      continue;
    }

    if (alternativas.length >= 5) {
      continue; // já tem 5+ (reimportação segura, não duplica)
    }

    const nova = quintaOpcao[q.id];
    if (!nova) {
      semQuintaAutorada++;
      console.log(`[SEM 5ª OPÇÃO AUTORADA] ${q.id}: "${q.enunciado.slice(0, 60)}" — pulando`);
      continue;
    }

    ganhamQuinta++;
    console.log(`[+5ª OPÇÃO] ${q.id}: + "${nova}"`);
    if (!dryRun) {
      await prisma.questaoConteudo.update({
        where: { id: q.id },
        data: { alternativas: [...alternativas, { texto: nova, correta: false }] },
      });
    }
  }

  console.log(`\n${viramNumerica} viraram NUMERICA · ${ganhamQuinta} ganharam 5ª opção · ${semQuintaAutorada} sem 5ª opção autorada`);
  console.log(dryRun ? "Dry run concluído — rode sem --dry-run para aplicar." : "Aplicado.");
  await prisma.$disconnect();
}

main();
