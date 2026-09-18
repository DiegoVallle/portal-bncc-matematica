// Seed do Módulo 1 (Aulas 01-08) do roteiro de 72 aulas — a partir de
// prisma/seed-data/aulas-modulo-01.ts. Só toca Aula/BlocoAula/AtividadeBloco
// (modelos novos) — nunca mexe em ConteudoAlfabetizacao/AtividadeFonica (a
// trilha de 10 níveis existente, com progresso real de Diego) nem em nada da
// trilha de Matemática.
//
// Mesma trava de segurança das outras seeds desta trilha: nunca apaga uma
// Aula que já tem progresso real — pula (log + continue) em vez de abortar.
//
// Uso: npx tsx prisma/seed-aulas-modulo-01.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AULAS_MODULO_01 } from "./seed-data/aulas-modulo-01";
import { DURACAO_BLOCO_SEG, obterAulaInfo } from "../src/lib/aulas";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Semeando Módulo 1 do roteiro de aulas: ${AULAS_MODULO_01.length} aula(s).`);

  for (const item of AULAS_MODULO_01) {
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

  console.log("Seed do Módulo 1 concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
