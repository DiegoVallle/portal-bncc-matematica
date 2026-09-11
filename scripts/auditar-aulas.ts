import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';
async function main() {
 const dados = await prisma.conteudo.findMany({include:{habilidade:true,questoes:true},orderBy:{habilidade:{codigo:'asc'}}});
 writeFileSync('/tmp/valeedu-aulas-auditoria.json',JSON.stringify(dados,null,2));
 console.log(dados.map(c=>({codigo:c.habilidade.codigo,teoria:c.teoriaBase.length,exemplo:c.exemploResolvido.length,questoes:c.questoes.length}))); 
}
main().finally(()=>prisma.$disconnect());
