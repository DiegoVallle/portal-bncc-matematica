-- CreateEnum
CREATE TYPE "NivelQuestaoConteudo" AS ENUM ('FACIL', 'MEDIO', 'APOSTILA', 'DESAFIO', 'AVALIACAO');

-- CreateEnum
CREATE TYPE "TipoRespostaConteudo" AS ENUM ('MULTIPLA_ESCOLHA', 'NUMERICA', 'TEXTO', 'ORDENACAO', 'CONSTRUCAO', 'SIMULACAO', 'PROJETO');

-- CreateEnum
CREATE TYPE "TipoErro" AS ENUM ('CONCEITO', 'PROCEDIMENTO', 'CALCULO', 'INTERPRETACAO', 'REPRESENTACAO', 'PRE_REQUISITO', 'ERRO_NAO_CLASSIFICADO');

-- CreateEnum
CREATE TYPE "StatusDominio" AS ENUM ('NAO_INICIADO', 'DIAGNOSTICO', 'EM_APRENDIZAGEM', 'EM_PRATICA', 'DOMINIO_PROVISORIO', 'DOMINADO', 'REVISAO', 'PRE_REQUISITO_PENDENTE');

-- AlterTable: Conteudo — renomeia teoria -> teoriaBase (preserva as 3 linhas existentes)
-- em vez de dropar+recriar como o diff automático sugeriu.
ALTER TABLE "Conteudo" RENAME COLUMN "teoria" TO "teoriaBase";
ALTER TABLE "Conteudo"
  ADD COLUMN     "errosComuns" JSONB,
  ADD COLUMN     "microBlocos" JSONB,
  ADD COLUMN     "objetivoAluno" TEXT,
  ADD COLUMN     "ordemPedagogica" INTEGER,
  ADD COLUMN     "preRequisitos" JSONB,
  ADD COLUMN     "recursosVisuais" JSONB;

-- AlterTable: QuestaoConteudo — troca "explicacao" (sempre nulo até agora) por "resolucao",
-- e converte "nivel" de texto pra enum com USING cast (valores já batem 1:1 com o enum),
-- em vez de dropar+recriar a coluna.
ALTER TABLE "QuestaoConteudo" DROP COLUMN "explicacao",
  ADD COLUMN     "alternativas" JSONB,
  ADD COLUMN     "atividadePratica" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN     "conceitoAvaliado" TEXT,
  ADD COLUMN     "dicas" JSONB,
  ADD COLUMN     "errosProvaveis" JSONB,
  ADD COLUMN     "podeSerAvaliacao" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN     "podeSerDiagnostico" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN     "podeSerRevisao" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN     "preRequisitos" JSONB,
  ADD COLUMN     "recursoVisual" JSONB,
  ADD COLUMN     "requerImagem" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN     "resolucao" TEXT,
  ADD COLUMN     "subhabilidade" TEXT,
  ADD COLUMN     "tipoResposta" "TipoRespostaConteudo" NOT NULL DEFAULT 'TEXTO';

ALTER TABLE "QuestaoConteudo"
  ALTER COLUMN "nivel" TYPE "NivelQuestaoConteudo" USING ("nivel"::"NivelQuestaoConteudo");

-- Marca AVALIACAO como podendo ser usada em avaliação, já que os dados existentes
-- foram semeados antes desse campo existir (default é false).
UPDATE "QuestaoConteudo" SET "podeSerAvaliacao" = true WHERE "nivel" = 'AVALIACAO';

-- CreateTable
CREATE TABLE "TentativaQuestaoConteudo" (
    "id" TEXT NOT NULL,
    "resposta" JSONB,
    "correta" BOOLEAN NOT NULL,
    "tipoErro" "TipoErro",
    "confiancaErro" DOUBLE PRECISION,
    "usouDica" BOOLEAN NOT NULL DEFAULT false,
    "dicasUsadas" INTEGER NOT NULL DEFAULT 0,
    "tempoMs" INTEGER,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alunoId" TEXT NOT NULL,
    "questaoConteudoId" TEXT NOT NULL,

    CONSTRAINT "TentativaQuestaoConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoHabilidade" (
    "id" TEXT NOT NULL,
    "status" "StatusDominio" NOT NULL DEFAULT 'NAO_INICIADO',
    "dominio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "acertosSemAjuda" INTEGER NOT NULL DEFAULT 0,
    "errosConsecutivos" INTEGER NOT NULL DEFAULT 0,
    "ultimoTipoErro" "TipoErro",
    "proximaRevisaoEm" TIMESTAMP(3),
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" TEXT NOT NULL,
    "conteudoId" TEXT NOT NULL,

    CONSTRAINT "ProgressoHabilidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TentativaQuestaoConteudo_alunoId_questaoConteudoId_idx" ON "TentativaQuestaoConteudo"("alunoId", "questaoConteudoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoHabilidade_alunoId_conteudoId_key" ON "ProgressoHabilidade"("alunoId", "conteudoId");

-- AddForeignKey
ALTER TABLE "TentativaQuestaoConteudo" ADD CONSTRAINT "TentativaQuestaoConteudo_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TentativaQuestaoConteudo" ADD CONSTRAINT "TentativaQuestaoConteudo_questaoConteudoId_fkey" FOREIGN KEY ("questaoConteudoId") REFERENCES "QuestaoConteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoHabilidade" ADD CONSTRAINT "ProgressoHabilidade_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoHabilidade" ADD CONSTRAINT "ProgressoHabilidade_conteudoId_fkey" FOREIGN KEY ("conteudoId") REFERENCES "Conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
