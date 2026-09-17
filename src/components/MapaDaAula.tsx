export default function MapaDaAula() {
  return <nav aria-label="Navegar nesta aula" className="ve-lesson-map print:hidden">
    <p className="hidden text-xs font-semibold uppercase tracking-widest text-slate-500 lg:block">Nesta aula</p>
    <div className="flex flex-wrap gap-2 lg:mt-4 lg:flex-col">
      <a href="#entender" className="ve-map-link"><span aria-hidden="true">◉</span> Entender</a>
      <a href="#exemplo" className="ve-map-link"><span aria-hidden="true">↳</span> Ver um exemplo</a>
      <a href="#tentar" className="ve-map-link"><span aria-hidden="true">✎</span> Tentar sozinho</a>
      <a href="#continuar" className="ve-map-link"><span aria-hidden="true">→</span> Continuar</a>
    </div>
    <p className="mt-6 hidden text-sm leading-relaxed text-slate-500 lg:block">Pode voltar ao exemplo sempre que precisar. Aprender também é experimentar outro caminho.</p>
  </nav>;
}
