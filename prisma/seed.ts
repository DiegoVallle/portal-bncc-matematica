import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { HABILIDADES } from "./seed-data/habilidades";
import { QUESTOES } from "./seed-data/questoes";
import { ILUSTRACOES_SVG } from "./seed-data/ilustracoes";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida. Configure a connection string do Postgres em .env.");
}
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Limpando dados existentes de conteúdo (habilidades/questões)...");
  await prisma.resposta.deleteMany();
  await prisma.alternativa.deleteMany();
  await prisma.questao.deleteMany();
  await prisma.habilidade.deleteMany();

  console.log(`Inserindo ${HABILIDADES.length} habilidades da BNCC...`);
  for (const h of HABILIDADES) {
    await prisma.habilidade.create({ data: h });
  }

  console.log(`Inserindo ${QUESTOES.length} questões diagnósticas...`);
  const habilidades = await prisma.habilidade.findMany();
  const habilidadeIdPorCodigo = new Map(habilidades.map((h) => [h.codigo, h.id]));

  let ordem = 0;
  for (const [
    anoEscolar,
    bimestre,
    codigo,
    enunciado,
    opcoes,
    corretaIndex,
    explicacao,
    ilustracaoSvg,
  ] of QUESTOES) {
    const habilidadeId = habilidadeIdPorCodigo.get(codigo);
    if (!habilidadeId) throw new Error(`Habilidade não encontrada: ${codigo}`);

    await prisma.questao.create({
      data: {
        anoEscolar,
        bimestre,
        enunciado,
        explicacao,
        ordem: ordem++,
        habilidadeId,
        ilustracaoSvg: ilustracaoSvg ?? ILUSTRACOES_SVG[enunciado] ?? null,
        alternativas: {
          create: opcoes.map((texto, index) => ({
            texto,
            correta: index === corretaIndex,
            ordem: index,
          })),
        },
      },
    });
  }

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
