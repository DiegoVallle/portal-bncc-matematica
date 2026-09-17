-- CreateEnum
CREATE TYPE "TrilhaTipo" AS ENUM ('MATEMATICA', 'ALFABETIZACAO');

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "trilhaTipo" "TrilhaTipo" NOT NULL DEFAULT 'MATEMATICA';
