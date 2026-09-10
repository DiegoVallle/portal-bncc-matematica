// Importa o rollout de ilustrações + atividades interativas (Fase 4) pras 34
// habilidades restantes, definido em prisma/seed-data/visuais-atividades-rollout.ts.
// Mesmo padrão do piloto (prisma/import-visuais-atividades-pilot.ts): aditivo,
// só toca nos 34 Conteudo (ilustracaoSvg) e nas 34 QuestaoConteudo listadas.
//
// Uso: npx tsx prisma/import-visuais-atividades-rollout.ts [--dry-run]

import { prisma } from "../src/lib/prisma";
import { ilustracoes, atividades } from "./seed-data/visuais-atividades-rollout";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(dryRun ? "=== DRY RUN (nada será gravado) ===" : "=== APLICANDO ===");

  let ilustracoesOk = 0;
  for (const [codigo, svg] of Object.entries(ilustracoes)) {
    const habilidade = await prisma.habilidade.findUnique({ where: { codigo }, include: { conteudo: true } });
    if (!habilidade?.conteudo) {
      console.log(`[ilustração] ${codigo}: SEM conteúdo — pulando`);
      continue;
    }
    if (habilidade.conteudo.ilustracaoSvg) {
      console.log(`[ilustração] ${codigo}: JÁ TEM ilustração — pulando (rollout nunca sobrescreve)`);
      continue;
    }
    console.log(`[ilustração] ${codigo}: ${svg.length} chars (novo)`);
    ilustracoesOk++;
    if (!dryRun) {
      await prisma.conteudo.update({ where: { id: habilidade.conteudo.id }, data: { ilustracaoSvg: svg } });
    }
  }

  let atividadesOk = 0;
  for (const a of atividades) {
    const questao = await prisma.questaoConteudo.findUnique({ where: { id: a.questaoId } });
    if (!questao) {
      console.log(`[atividade] ${a.habilidadeCodigo} (${a.questaoId}): NÃO ENCONTRADA — pulando`);
      continue;
    }
    if (questao.atividadeInterativa) {
      console.log(`[atividade] ${a.habilidadeCodigo}: JÁ TEM atividade interativa — pulando`);
      continue;
    }
    console.log(`[atividade] ${a.habilidadeCodigo} (${a.atividadeInterativa.tipo}): "${questao.enunciado.slice(0, 40)}" → "${a.novoEnunciado.slice(0, 40)}"`);
    atividadesOk++;
    if (!dryRun) {
      await prisma.questaoConteudo.update({
        where: { id: a.questaoId },
        data: { enunciado: a.novoEnunciado, atividadeInterativa: a.atividadeInterativa },
      });
    }
  }

  console.log(`\n${ilustracoesOk}/${Object.keys(ilustracoes).length} ilustrações · ${atividadesOk}/${atividades.length} atividades`);
  console.log(dryRun ? "Dry run concluído — rode sem --dry-run para aplicar." : "Aplicado.");
  await prisma.$disconnect();
}

main();
