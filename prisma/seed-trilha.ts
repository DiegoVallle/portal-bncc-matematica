// Seed da trilha de conteúdo (Conteudo/QuestaoConteudo) a partir do banco-conteudo-*.md.
// Só toca as tabelas novas da trilha — nunca mexe em Habilidade/Questao/Alternativa/
// Tentativa/Resposta (diagnóstico), que continuam intocados.
//
// Uso: npx tsx prisma/seed-trilha.ts <caminho-do-md> [--apenas EF07MA01,EF07MA08,EF07MA18]

import "dotenv/config";
import { PrismaClient, NivelQuestaoConteudo } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseTrilhaMarkdown } from "./seed-data/parse-trilha";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}

const [, , mdPathArg, filtroFlag, filtroValor] = process.argv;
if (!mdPathArg) {
  console.error("Uso: npx tsx prisma/seed-trilha.ts <caminho-do-md> [--apenas EF07MA01,EF07MA08,EF07MA18]");
  process.exit(1);
}
const apenas = filtroFlag === "--apenas" && filtroValor ? new Set(filtroValor.split(",")) : null;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const todos = parseTrilhaMarkdown(mdPathArg);
  const itens = apenas ? todos.filter((c) => apenas.has(c.codigo)) : todos;

  if (itens.length === 0) {
    throw new Error("Nenhuma habilidade selecionada — confira os códigos passados em --apenas.");
  }

  console.log(`Semeando trilha de conteúdo para ${itens.length} habilidade(s): ${itens.map((i) => i.codigo).join(", ")}`);

  for (const item of itens) {
    const habilidade = await prisma.habilidade.findUnique({ where: { codigo: item.codigo } });
    if (!habilidade) {
      throw new Error(`Habilidade ${item.codigo} não existe no banco — rode o seed do diagnóstico antes.`);
    }

    // Idempotente: apaga o Conteudo (e QuestaoConteudo em cascata) dessa habilidade, se já existir,
    // e recria do zero. Isso nunca afeta Habilidade nem nada do diagnóstico — mas, uma vez que
    // alunos comecem a usar a trilha, apagar o Conteudo também apagaria (em cascata) o histórico
    // de TentativaQuestaoConteudo/ProgressoHabilidade ligado a ele. Trava essa recriação assim que
    // existir qualquer tentativa real, pra não perder progresso de aluno num re-seed de conteúdo.
    const tentativasExistentes = await prisma.tentativaQuestaoConteudo.count({
      where: { questaoConteudo: { conteudo: { habilidadeId: habilidade.id } } },
    });
    if (tentativasExistentes > 0) {
      throw new Error(
        `${item.codigo} já tem ${tentativasExistentes} tentativa(s) de aluno registradas — recriar o Conteudo apagaria esse histórico. Ajuste este script pra fazer update em vez de delete+recreate antes de rodar de novo.`
      );
    }
    await prisma.conteudo.deleteMany({ where: { habilidadeId: habilidade.id } });

    const microBlocos = item.notaImplementacao
      ? [{ tipo: "NOTA_IMPLEMENTACAO", texto: item.notaImplementacao }]
      : undefined;

    await prisma.conteudo.create({
      data: {
        habilidadeId: habilidade.id,
        teoriaBase: item.teoria,
        exemploResolvido: item.exemploResolvido,
        recursosVisuais: item.recursosVisuais.length ? item.recursosVisuais : undefined,
        microBlocos,
        questoes: {
          create: item.exercicios.map((ex, index) => ({
            enunciado: ex.enunciado,
            respostaEsperada: ex.respostaEsperada,
            nivel: ex.nivel as NivelQuestaoConteudo,
            ordem: index,
            podeSerAvaliacao: ex.nivel === "AVALIACAO",
          })),
        },
      },
    });

    console.log(`  ${item.codigo}: ${item.exercicios.length} exercícios inseridos.`);
  }

  console.log("Seed da trilha concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
