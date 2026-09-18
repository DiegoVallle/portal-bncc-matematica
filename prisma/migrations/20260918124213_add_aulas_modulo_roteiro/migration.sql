-- CreateEnum
CREATE TYPE "BlocoTipo" AS ENUM ('AQUECIMENTO', 'DISCRIMINACAO', 'CONSTRUCAO', 'PRODUCAO_ORAL');

-- CreateEnum
CREATE TYPE "StatusAula" AS ENUM ('NAO_INICIADA', 'EM_ANDAMENTO', 'CONCLUIDA');

-- CreateEnum
CREATE TYPE "TipoAtividadeBloco" AS ENUM ('CLIQUE_COMPARACAO', 'CONTADOR_TOQUES', 'LEITURA_VOZ');

-- CreateTable
CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "modulo" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "focoPedagogico" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlocoAula" (
    "id" TEXT NOT NULL,
    "tipo" "BlocoTipo" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "duracaoSeg" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "instrucaoAudio" TEXT NOT NULL,
    "aulaId" TEXT NOT NULL,

    CONSTRAINT "BlocoAula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtividadeBloco" (
    "id" TEXT NOT NULL,
    "tipo" "TipoAtividadeBloco" NOT NULL,
    "instrucaoAudio" TEXT NOT NULL,
    "alvoTexto" TEXT NOT NULL,
    "opcoes" JSONB,
    "semValidacao" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "blocoAulaId" TEXT NOT NULL,

    CONSTRAINT "AtividadeBloco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TentativaAtividadeBloco" (
    "id" TEXT NOT NULL,
    "respostaClique" JSONB,
    "transcricaoVoz" TEXT,
    "contagem" INTEGER,
    "correta" BOOLEAN NOT NULL,
    "tempoMs" INTEGER,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alunoId" TEXT NOT NULL,
    "atividadeId" TEXT NOT NULL,

    CONSTRAINT "TentativaAtividadeBloco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoAula" (
    "id" TEXT NOT NULL,
    "status" "StatusAula" NOT NULL DEFAULT 'NAO_INICIADA',
    "blocosConcluidos" INTEGER NOT NULL DEFAULT 0,
    "estrelas" INTEGER NOT NULL DEFAULT 0,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" TEXT NOT NULL,
    "aulaId" TEXT NOT NULL,

    CONSTRAINT "ProgressoAula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aula_numero_key" ON "Aula"("numero");

-- CreateIndex
CREATE INDEX "TentativaAtividadeBloco_alunoId_atividadeId_idx" ON "TentativaAtividadeBloco"("alunoId", "atividadeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoAula_alunoId_aulaId_key" ON "ProgressoAula"("alunoId", "aulaId");

-- AddForeignKey
ALTER TABLE "BlocoAula" ADD CONSTRAINT "BlocoAula_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AtividadeBloco" ADD CONSTRAINT "AtividadeBloco_blocoAulaId_fkey" FOREIGN KEY ("blocoAulaId") REFERENCES "BlocoAula"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TentativaAtividadeBloco" ADD CONSTRAINT "TentativaAtividadeBloco_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TentativaAtividadeBloco" ADD CONSTRAINT "TentativaAtividadeBloco_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "AtividadeBloco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoAula" ADD CONSTRAINT "ProgressoAula_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoAula" ADD CONSTRAINT "ProgressoAula_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
