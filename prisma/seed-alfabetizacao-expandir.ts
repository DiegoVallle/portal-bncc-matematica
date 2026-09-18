// Adiciona atividades extras aos 10 níveis já existentes da Trilha de
// Alfabetização, a partir de prisma/seed-data/alfabetizacao-expansao.ts.
// Diferente de seed-alfabetizacao.ts: NUNCA apaga nem recria um
// ConteudoAlfabetizacao — só cria AtividadeFonica novas dentro dele. Por isso
// é seguro rodar mesmo nos níveis que já têm tentativa/progresso real de
// aluno (os 3 do piloto, onde Diego já tem DOMINADO) — nada existente é
// tocado.
//
// Idempotente por conteúdo: pula uma atividade se já existir outra com o
// mesmo (conteudoId, tipo, alvoTexto) — evita duplicar ao rodar de novo.
//
// Uso: npx tsx prisma/seed-alfabetizacao-expandir.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ALFABETIZACAO_EXPANSAO } from "./seed-data/alfabetizacao-expansao";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Expandindo atividades em ${ALFABETIZACAO_EXPANSAO.length} nível(is).`);

  for (const item of ALFABETIZACAO_EXPANSAO) {
    const conteudo = await prisma.conteudoAlfabetizacao.findUnique({
      where: { nivel: item.nivel },
      include: { atividades: { select: { tipo: true, alvoTexto: true } } },
    });
    if (!conteudo) {
      throw new Error(`Nível ${item.nivel} não existe no banco — rode seed-alfabetizacao.ts antes.`);
    }

    const existentes = new Set(conteudo.atividades.map((a) => `${a.tipo}::${a.alvoTexto}`));
    const novas = item.atividades.filter((a) => !existentes.has(`${a.tipo}::${a.alvoTexto}`));

    if (novas.length === 0) {
      console.log(`  ${item.nivel}: nada novo pra adicionar (já existe).`);
      continue;
    }

    await prisma.atividadeFonica.createMany({
      data: novas.map((a) => ({
        conteudoId: conteudo.id,
        tipo: a.tipo,
        instrucaoAudio: a.instrucaoAudio,
        alvoTexto: a.alvoTexto,
        opcoes: a.opcoes ?? undefined,
        ordem: a.ordem,
      })),
    });

    console.log(`  ${item.nivel}: ${novas.length} atividade(s) nova(s) adicionada(s).`);
  }

  console.log("Expansão de atividades concluída com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
