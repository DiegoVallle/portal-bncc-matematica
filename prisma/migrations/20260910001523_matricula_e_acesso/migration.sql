-- CreateEnum
CREATE TYPE "StatusMatricula" AS ENUM ('EXPERIMENTAL', 'MATRICULADO');

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "diagnosticoLiberado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "StatusMatricula" NOT NULL DEFAULT 'MATRICULADO';
