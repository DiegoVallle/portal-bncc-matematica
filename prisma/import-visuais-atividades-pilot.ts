// Importa o piloto de ilustrações + atividades interativas (Fase 4) definido
// em prisma/seed-data/visuais-atividades-pilot.ts. Aditivo/reversível: só
// atualiza os 3 Conteudo (ilustracaoSvg) e as 3 QuestaoConteudo listadas
// (enunciado + atividadeInterativa) — nunca mexe em outra linha.
//
// Uso: npx tsx prisma/import-visuais-atividades-pilot.ts [--dry-run]

import { prisma } from "../src/lib/prisma";
import { ilustracoes, atividades } from "./seed-data/visuais-atividades-pilot";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(dryRun ? "=== DRY RUN (nada será gravado) ===" : "=== APLICANDO ===");

  for (const [codigo, svg] of Object.entries(ilustracoes)) {
    const habilidade = await prisma.habilidade.findUnique({ where: { codigo }, include: { conteudo: true } });
    if (!habilidade?.conteudo) {
      console.log(`[ilustração] ${codigo}: SEM conteúdo — pulando`);
      continue;
    }
    console.log(`[ilustração] ${codigo}: ${svg.length} chars ${habilidade.conteudo.ilustracaoSvg ? "(substituindo existente)" : "(novo)"}`);
    if (!dryRun) {
      await prisma.conteudo.update({ where: { id: habilidade.conteudo.id }, data: { ilustracaoSvg: svg } });
    }
  }

  for (const a of atividades) {
    const questao = await prisma.questaoConteudo.findUnique({ where: { id: a.questaoId } });
    if (!questao) {
      console.log(`[atividade] ${a.questaoId}: NÃO ENCONTRADA — pulando`);
      continue;
    }
    console.log(
      `[atividade] ${a.questaoId} (${a.atividadeInterativa.tipo}): "${questao.enunciado.slice(0, 50)}" → "${(a.novoEnunciado ?? questao.enunciado).slice(0, 50)}"`
    );
    if (!dryRun) {
      await prisma.questaoConteudo.update({
        where: { id: a.questaoId },
        data: {
          ...(a.novoEnunciado ? { enunciado: a.novoEnunciado } : {}),
          atividadeInterativa: a.atividadeInterativa,
        },
      });
    }
  }

  console.log(dryRun ? "\nDry run concluído — rode sem --dry-run para aplicar." : "\nAplicado.");
  await prisma.$disconnect();
}

main();
