import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { itensPraticaGuiada, type ItemPraticaGuiada } from '../src/lib/pratica-guiada';
import PraticaGuiada from '../src/app/aluno/trilha/[habilidadeCodigo]/pratica-guiada/PraticaGuiada';
const item:ItemPraticaGuiada={id:'1',enunciado:'Explique sua estratégia.',respostaEsperada:'RESPOSTA-OCULTA',resolucao:null,nivel:'FACIL',ordem:1};
assert.equal(itensPraticaGuiada([{...item,nivel:'AVALIACAO'}]).length,0);
assert.equal(itensPraticaGuiada([{...item,enunciado:' '}]).length,0);
const html=renderToStaticMarkup(createElement(PraticaGuiada,{item,anterior:null,proximo:null,codigo:'EF07MA01'}));
assert(!html.includes('RESPOSTA-OCULTA'));
assert(html.includes('Como você resolveria?'));
let total=0,habilidades=0;
if(process.argv[2]) {
 const dados=JSON.parse(readFileSync(process.argv[2],'utf8'));
 for(const c of dados) {
  const abertas=itensPraticaGuiada(c.questoes.filter((q:ItemPraticaGuiada & {tipoResposta:string;atividadeInterativa:unknown})=>q.tipoResposta==='TEXTO' && !q.atividadeInterativa));
  for(const q of abertas) assert(q.respostaEsperada?.trim()||q.resolucao?.trim(),`Sem resposta: ${c.habilidade.codigo} ${q.id}`);
  if(abertas.length) habilidades++;
  total+=abertas.length;
 }
}
console.log(`Prática verificada: ${total} questões abertas em ${habilidades} habilidades; avaliação excluída e resposta escondida inicialmente.`);
