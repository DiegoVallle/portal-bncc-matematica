import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AULAS_REVISADAS } from '../src/content/aulas-revisadas';
import TextoMatematico from '../src/components/TextoMatematico';
import TeoriaCards from '../src/app/aluno/trilha/[habilidadeCodigo]/TeoriaCards';
import { materialConsulta } from '../src/lib/material-consulta';
import { prepararMarkdownAula } from '../src/lib/markdown-aula';
const codigos = Array.from({length:37},(_,i)=>`EF07MA${String(i+1).padStart(2,'0')}`);
assert.deepEqual(Object.keys(AULAS_REVISADAS),codigos);
let total=0;
for (const [codigo,aulas] of Object.entries(AULAS_REVISADAS)) {
 for (const [i,a] of aulas.entries()) {
  assert(a.teoria.length>150 && a.exemplo.length>60 && a.feedback.length>40, codigo);
  assert(a.correta>=0 && a.correta<a.opcoes.length && Number.isInteger(a.correta));
  assert.equal(new Set(a.opcoes).size,a.opcoes.length);
  const html=renderToStaticMarkup(createElement(TeoriaCards,{aulas,aulaInicial:i,habilidadeCodigo:codigo,teoriaBase:a.teoria,exemploResolvido:a.exemplo}));
  assert(html.includes(a.pergunta.replace(/&/g,'&amp;')),codigo);
  assert(!html.includes('undefined'));
  total++;
 }
}
const formula=String.raw`$$\\text{Média} \= \\dfrac{21}{3}$$`;
assert.equal(prepararMarkdownAula(formula), String.raw`$$\text{Média} = \dfrac{21}{3}$$`);
const formulaHtml=renderToStaticMarkup(createElement(TextoMatematico,{texto:formula}));
assert(formulaHtml.includes('katex-mathml') && !formulaHtml.includes('katex-error'));
const dinheiro=renderToStaticMarkup(createElement(TextoMatematico,{texto:'Custa R$ 50 e caiu para R$ 40.'}));
assert(!dinheiro.includes('katex') && dinheiro.includes('R$ 50'));
assert(!prepararMarkdownAula('*Ilustração: nota de produção*\n\nTexto.').includes('Ilustração:'));
const consulta=materialConsulta('EF07MA24','antigo','exemplo conflitante');
assert(!consulta.exemplo.includes('dessa moldura'));
// Opcional: valida o material real da auditoria, sem acessar alunos ou respostas.
if (process.argv[2]) {
 const dados=JSON.parse(readFileSync(process.argv[2],'utf8'));
 for(const c of dados) {
  const m=materialConsulta(c.habilidade.codigo,c.teoriaBase,c.exemploResolvido);
  for(const texto of [m.teoria,m.exemplo]) {
   const html=renderToStaticMarkup(createElement(TextoMatematico,{texto}));
   assert(!html.includes('katex-error'),c.habilidade.codigo+' fórmula inválida');
  }
 }
}
console.log(`37 habilidades, ${total} aulas e perguntas guiadas; renderização e fórmulas verificadas.`);
