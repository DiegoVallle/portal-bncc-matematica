// Seed do piloto da Trilha de Alfabetização (ConteudoAlfabetizacao/AtividadeFonica)
// a partir de prisma/seed-data/alfabetizacao-pilot.ts. Só toca as tabelas novas
// da trilha de alfabetização — nunca mexe em nada da trilha de Matemática nem
// do diagnóstico.
//
// Uso: npx tsx prisma/seed-alfabetizacao.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ALFABETIZACAO_PILOTO } from "./seed-data/alfabetizacao-pilot";
import { obterNivelFonico } from "../src/lib/alfabetizacao";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Semeando piloto da trilha de alfabetização: ${ALFABETIZACAO_PILOTO.length} nível(is).`);

  for (const item of ALFABETIZACAO_PILOTO) {
    const info = obterNivelFonico(item.nivel);
    if (!info) {
      throw new Error(`Nível ${item.nivel} não existe em src/lib/alfabetizacao.ts (NIVEIS_FONICOS).`);
    }

    const existente = await prisma.conteudoAlfabetizacao.findUnique({ where: { nivel: item.nivel } });
    if (existente) {
      // Mesma trava de segurança do seed-trilha.ts: nunca apagar um nível que
      // já tem tentativa real de aluno registrada OU progresso em andamento
      // (aluno que clicou "Começar" mas ainda não respondeu nada também tem
      // estado real que seria perdido — ProgressoFonico.conteudoId é cascade).
      const [tentativasExistentes, progressosExistentes] = await Promise.all([
        prisma.tentativaAtividadeFonica.count({ where: { atividade: { conteudoId: existente.id } } }),
        prisma.progressoFonico.count({ where: { conteudoId: existente.id } }),
      ]);
      if (tentativasExistentes > 0 || progressosExistentes > 0) {
        throw new Error(
          `${item.nivel} já tem ${tentativasExistentes} tentativa(s) e ${progressosExistentes} progresso(s) de aluno registrados — recriar apagaria esse histórico. Ajuste este script pra fazer update em vez de delete+recreate antes de rodar de novo.`
        );
      }
      await prisma.conteudoAlfabetizacao.delete({ where: { id: existente.id } });
    }

    const codigoBncc = info.codigosBncc.map((c) => c.codigo).join(", ");

    await prisma.conteudoAlfabetizacao.create({
      data: {
        nivel: item.nivel,
        codigoBncc,
        ordemPedagogica: info.ordem,
        objetivoAluno: item.objetivoAluno,
        instrucaoAudio: item.instrucaoAudio,
        atividades: {
          create: item.atividades.map((a) => ({
            tipo: a.tipo,
            instrucaoAudio: a.instrucaoAudio,
            alvoTexto: a.alvoTexto,
            opcoes: a.opcoes ?? undefined,
            ordem: a.ordem,
          })),
        },
      },
    });

    console.log(`  ${item.nivel} (${codigoBncc}): ${item.atividades.length} atividade(s) inserida(s).`);
  }

  console.log("Seed do piloto de alfabetização concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
