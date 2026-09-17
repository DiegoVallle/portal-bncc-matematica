import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Cena, { CENAS_POR_NIVEL } from '../src/components/CenaAlfabetizacao';
import { ORDEM_FONICA } from '../src/lib/alfabetizacao';
assert.equal(ORDEM_FONICA.length, 10);
assert.deepEqual(Object.keys(CENAS_POR_NIVEL).sort(), [...ORDEM_FONICA].sort());
assert.equal(new Set(Object.values(CENAS_POR_NIVEL)).size, 10);
for (const nivel of ORDEM_FONICA) {
  const path = join(process.cwd(), 'public/alfabetizacao', CENAS_POR_NIVEL[nivel]+'.png');
  assert(existsSync(path), `Falta imagem: ${nivel}`);
  const data = readFileSync(path);
  assert.equal(data.subarray(1,4).toString(), 'PNG');
  assert(data.readUInt32BE(16) >= 1000 && data.readUInt32BE(20) >= 600);
  for (const compacta of [false,true]) {
    const html = renderToStaticMarkup(createElement(Cena,{nivel, compacta}));
    assert(html.includes(CENAS_POR_NIVEL[nivel]), nivel);
    assert(html.includes('alt=""') && html.includes('sizes='));
  }
}
console.log('10 níveis, 10 imagens distintas existentes, dimensões e renderização responsiva verificadas.');
