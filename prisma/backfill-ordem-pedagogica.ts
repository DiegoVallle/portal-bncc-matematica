// Fase 0 do plano da Trilha de Conteúdo: popula Conteudo.ordemPedagogica e
// Conteudo.preRequisitos a partir das constantes centralizadas em src/lib/trilha.ts.
// Idempotente, update-only (nunca cria/deleta Conteudo), pode rodar quantas vezes
// precisar. Não toca em nenhuma tabela do diagnóstico.
//
// Uso: npx tsx prisma/backfill-ordem-pedagogica.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ORDEM_PEDAGOGICA, obterOrdemPedagogica, obterPreRequisitos } from "../src/lib/trilha";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Aplicando ordem pedagógica + pré-requisitos para ${ORDEM_PEDAGOGICA.length} habilidades...`);

  for (const codigo of ORDEM_PEDAGOGICA) {
    const habilidade = await prisma.habilidade.findUnique({ where: { codigo } });
    if (!habilidade) throw new Error(`Habilidade ${codigo} não encontrada no banco.`);

    const conteudo = await prisma.conteudo.findUnique({ where: { habilidadeId: habilidade.id } });
    if (!conteudo) throw new Error(`Conteudo de ${codigo} não encontrado — rode o seed da trilha antes.`);

    await prisma.conteudo.update({
      where: { id: conteudo.id },
      data: {
        ordemPedagogica: obterOrdemPedagogica(codigo),
        preRequisitos: obterPreRequisitos(codigo),
      },
    });
  }

  console.log("Conferência final (ordenado por ordemPedagogica):");
  const conferencia = await prisma.conteudo.findMany({
    include: { habilidade: { select: { codigo: true } } },
    orderBy: { ordemPedagogica: "asc" },
  });
  for (const c of conferencia) {
    console.log(
      `  ${String(c.ordemPedagogica).padStart(2, " ")}. ${c.habilidade.codigo}  preRequisitos=${JSON.stringify(c.preRequisitos)}`
    );
  }

  console.log("Backfill concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
