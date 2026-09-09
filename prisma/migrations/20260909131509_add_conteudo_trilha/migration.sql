-- CreateTable
CREATE TABLE "Conteudo" (
    "id" TEXT NOT NULL,
    "teoria" TEXT NOT NULL,
    "exemploResolvido" TEXT NOT NULL,
    "ilustracaoSvg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "habilidadeId" TEXT NOT NULL,

    CONSTRAINT "Conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestaoConteudo" (
    "id" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "respostaEsperada" TEXT NOT NULL,
    "explicacao" TEXT,
    "nivel" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ilustracaoSvg" TEXT,
    "conteudoId" TEXT NOT NULL,

    CONSTRAINT "QuestaoConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conteudo_habilidadeId_key" ON "Conteudo"("habilidadeId");

-- AddForeignKey
ALTER TABLE "Conteudo" ADD CONSTRAINT "Conteudo_habilidadeId_fkey" FOREIGN KEY ("habilidadeId") REFERENCES "Habilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestaoConteudo" ADD CONSTRAINT "QuestaoConteudo_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "Conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
