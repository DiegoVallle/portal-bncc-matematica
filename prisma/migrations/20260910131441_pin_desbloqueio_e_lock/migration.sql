-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "pinDesbloqueio" TEXT NOT NULL DEFAULT '1234';

-- AlterTable
ALTER TABLE "TentativaQuestaoConteudo" ADD COLUMN     "desbloqueadaPeloProfessor" BOOLEAN NOT NULL DEFAULT false;
