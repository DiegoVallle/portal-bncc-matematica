// Seed do Módulo 2 (Aulas 09-16) do roteiro de 72 aulas — a partir de
// prisma/seed-data/aulas-modulo-02.ts. Mesmo padrão do Módulo 1: só toca
// Aula/BlocoAula/AtividadeBloco, nunca apaga uma Aula que já tem progresso
// real (pula em vez de abortar).
//
// Uso: npx tsx prisma/seed-aulas-modulo-02.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AULAS_MODULO_02 } from "./seed-data/aulas-modulo-02";
import { DURACAO_BLOCO_SEG, obterAulaInfo } from "../src/lib/aulas";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Semeando Módulo 2 do roteiro de aulas: ${AULAS_MODULO_02.length} aula(s).`);

  for (const item of AULAS_MODULO_02) {
    const info = obterAulaInfo(item.numero);
    if (!info) {
      throw new Error(`Aula ${item.numero} não existe em src/lib/aulas.ts (AULAS_TITULOS).`);
    }

    const existente = await prisma.aula.findUnique({ where: { numero: item.numero } });
    if (existente) {
      const progressosExistentes = await prisma.progressoAula.count({ where: { aulaId: existente.id } });
      if (progressosExistentes > 0) {
        console.log(`  Aula ${item.numero}: pulada — já tem ${progressosExistentes} progresso(s) de aluno reais registrados.`);
        continue;
      }
      await prisma.aula.delete({ where: { id: existente.id } });
    }

    await prisma.aula.create({
      data: {
        numero: item.numero,
        modulo: info.modulo,
        titulo: info.titulo,
        focoPedagogico: info.focoPedagogico,
        blocos: {
          create: item.blocos.map((bloco, index) => ({
            tipo: bloco.tipo,
            ordem: index + 1,
            duracaoSeg: DURACAO_BLOCO_SEG[bloco.tipo],
            titulo: bloco.titulo,
            instrucaoAudio: bloco.instrucaoAudio,
            atividades: {
              create: [
                {
                  tipo: bloco.atividade.tipo,
                  instrucaoAudio: bloco.atividade.instrucaoAudio,
                  alvoTexto: bloco.atividade.alvoTexto,
                  opcoes: bloco.atividade.opcoes ?? undefined,
                  semValidacao: bloco.atividade.semValidacao ?? false,
                  ordem: 1,
                },
              ],
            },
          })),
        },
      },
    });

    console.log(`  Aula ${item.numero} (${info.titulo}): 4 blocos inseridos.`);
  }

  console.log("Seed do Módulo 2 concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
