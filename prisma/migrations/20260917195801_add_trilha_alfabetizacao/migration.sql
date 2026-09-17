-- CreateEnum
CREATE TYPE "NivelFonico" AS ENUM ('CONSCIENCIA_RIMA', 'CONSCIENCIA_SILABICA', 'CONSCIENCIA_FONEMICA', 'CORRESPONDENCIA_VOGAIS', 'CORRESPONDENCIA_CONSOANTES', 'SILABAS_SIMPLES', 'PALAVRAS_SIMPLES', 'ENCONTROS_E_DIGRAFOS', 'PALAVRAS_COMPLEXAS', 'FRASES_E_TEXTOS');

-- CreateEnum
CREATE TYPE "TipoAtividadeFonica" AS ENUM ('RIMA', 'SEGMENTACAO_SILABICA', 'SOM_INICIAL', 'CORRESPONDENCIA_SOM_LETRA', 'LEITURA_SILABA', 'MONTAR_PALAVRA', 'LEITURA_PALAVRA', 'LEITURA_FRASE');

-- CreateEnum
CREATE TYPE "TipoErroFonico" AS ENUM ('DISCRIMINACAO_SONORA', 'TROCA_GRAFEMA', 'OMISSAO', 'INVERSAO', 'SEGMENTACAO', 'ERRO_NAO_CLASSIFICADO');

-- CreateTable
CREATE TABLE "ConteudoAlfabetizacao" (
    "id" TEXT NOT NULL,
    "nivel" "NivelFonico" NOT NULL,
    "codigoBncc" TEXT,
    "ordemPedagogica" INTEGER NOT NULL,
    "objetivoAluno" TEXT,
    "instrucaoAudio" TEXT NOT NULL,
    "ilustracaoSvg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConteudoAlfabetizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtividadeFonica" (
    "id" TEXT NOT NULL,
    "tipo" "TipoAtividadeFonica" NOT NULL,
    "instrucaoAudio" TEXT NOT NULL,
    "alvoTexto" TEXT NOT NULL,
    "opcoes" JSONB,
    "ilustracaoSvg" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "conteudoId" TEXT NOT NULL,

    CONSTRAINT "AtividadeFonica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TentativaAtividadeFonica" (
    "id" TEXT NOT NULL,
    "respostaClique" JSONB,
    "transcricaoVoz" TEXT,
    "confiancaVoz" DOUBLE PRECISION,
    "correta" BOOLEAN NOT NULL,
    "tipoErro" "TipoErroFonico",
    "tempoMs" INTEGER,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alunoId" TEXT NOT NULL,
    "atividadeId" TEXT NOT NULL,

    CONSTRAINT "TentativaAtividadeFonica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoFonico" (
    "id" TEXT NOT NULL,
    "status" "StatusDominio" NOT NULL DEFAULT 'NAO_INICIADO',
    "dominio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,

    CONSTRAINT "ProgressoFonico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConteudoAlfabetizacao_nivel_key" ON "ConteudoAlfabetizacao"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "ConteudoAlfabetizacao_ordemPedagogica_key" ON "ConteudoAlfabetizacao"("ordemPedagogica");

-- CreateIndex
CREATE INDEX "TentativaAtividadeFonica_alunoId_atividadeId_idx" ON "TentativaAtividadeFonica"("alunoId", "atividadeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoFonico_alunoId_conteudoId_key" ON "ProgressoFonico"("alunoId", "conteudoId");

-- AddForeignKey
ALTER TABLE "AtividadeFonica" ADD CONSTRAINT "AtividadeFonica_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "ConteudoAlfabetizacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TentativaAtividadeFonica" ADD CONSTRAINT "TentativaAtividadeFonica_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TentativaAtividadeFonica" ADD CONSTRAINT "TentativaAtividadeFonica_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "AtividadeFonica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoFonico" ADD CONSTRAINT "ProgressoFonico_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoFonico" ADD CONSTRAINT "ProgressoFonico_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "ConteudoAlfabetizacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
