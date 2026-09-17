"use client";

import { useState } from "react";
import Link from "next/link";
import MapaDaAula from "@/components/MapaDaAula";
import TextoMatematico from "@/components/TextoMatematico";
import IlustracaoQuestao from "@/components/IlustracaoQuestao";
import type { AulaRevisada } from "@/content/aulas-revisadas";

export default function TeoriaCards({ aulas, aulaInicial, habilidadeCodigo, teoriaBase, exemploResolvido, ilustracaoHabilidade, children }: {
  aulas: AulaRevisada[]; aulaInicial: number; habilidadeCodigo: string;
  teoriaBase: string; exemploResolvido: string; ilustracaoHabilidade?: string | null; children?: React.ReactNode;
}) {
  const aula = aulas[aulaInicial];
  // Cada aula pode ter sua própria ilustração; sem uma específica, cai na
  // ilustração da habilidade (mesma pra todas as aulas que não têm a própria).
  const ilustracao = aula?.ilustracaoSvg ?? ilustracaoHabilidade;
  const [escolha, setEscolha] = useState<number | null>(null);
  const [conferiu, setConferiu] = useState(false);
  const [consultaAberta, setConsultaAberta] = useState(false);
  const proxima = aulas[aulaInicial + 1];

  return <div className="space-y-6">
    {aulas.length > 1 && <nav aria-label="Aulas desta habilidade" className="flex flex-wrap gap-2">
      {aulas.map((item, i) => <Link key={item.titulo} href={`?aula=${i + 1}`} aria-current={i === aulaInicial ? "page" : undefined}
        className={`rounded-xl border px-4 py-3 text-sm font-medium ${i === aulaInicial ? "border-valeedu-blue bg-valeedu-blue text-white" : "border-slate-200 bg-white text-valeedu-blue"}`}>
        {item.titulo}
      </Link>)}
    </nav>}
    {aula ? <div className="grid items-start gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
      <MapaDaAula />
      <div className="min-w-0 space-y-6">
      <section className="ve-lesson-hero">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-200">Um passo de cada vez</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{aula.titulo}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-blue-100">Hoje você vai: {aula.objetivo.charAt(0).toLowerCase() + aula.objetivo.slice(1)}</p>
      </section>
      {ilustracao && <IlustracaoQuestao svg={ilustracao} />}
      <section id="entender" tabIndex={-1} className="ve-card ve-lesson-section p-6 sm:p-8" aria-label="Explicação">
        <h3 className="ve-eyebrow mb-4">Vamos entender</h3>
        <TextoMatematico texto={aula.teoria} />
      </section>
      <section id="exemplo" tabIndex={-1} className="ve-card ve-lesson-section border-l-4 border-l-valeedu-green p-6 sm:p-8" aria-label="Exemplo resolvido">
        <h3 className="ve-eyebrow mb-4">Acompanhe o raciocínio</h3>
        <TextoMatematico texto={aula.exemplo} />
      </section>
      <section id="tentar" tabIndex={-1} className="ve-card ve-lesson-section p-6 sm:p-8">
        <h3 className="ve-eyebrow">Agora, pense você</h3>
        <p className="mt-2 text-sm text-slate-500">Uma pausa para entender, sem nota e sem bloqueio.</p>
        <form className="mt-5" onSubmit={(e) => { e.preventDefault(); if (escolha !== null) setConferiu(true); }}>
          <fieldset>
            <legend className="mb-4 font-semibold text-slate-900">{aula.pergunta}</legend>
            <div className="space-y-2">
              {aula.opcoes.map((opcao, i) => <label key={opcao} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${escolha === i ? "border-valeedu-blue bg-blue-50 ring-1 ring-valeedu-blue" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"}`}>
                <input type="radio" name="compreensao" value={i} checked={escolha === i} onChange={() => { setEscolha(i); setConferiu(false); }} />
                <span>{opcao}</span>
              </label>)}
            </div>
          </fieldset>
          <button disabled={escolha === null} className="mt-4 rounded-lg bg-valeedu-blue px-5 py-3 font-medium text-white disabled:opacity-50">Conferir meu raciocínio</button>
        </form>
        {conferiu && <div role="status" className={`mt-5 rounded-xl border p-5 ${escolha === aula.correta ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
          <p className="font-semibold text-valeedu-blue">{escolha === aula.correta ? "Isso mesmo!" : "Vamos pensar juntos."}</p>
          <p className="mt-2 leading-relaxed text-slate-700">{aula.feedback}</p>
          {escolha !== aula.correta && <p className="mt-2 text-sm text-slate-600">Volte ao exemplo e tente outra opção.</p>}
        </div>}
      </section>
      <div id="continuar" tabIndex={-1} className="ve-lesson-section flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        {aulaInicial > 0 && <Link href={`?aula=${aulaInicial}`} className="text-sm text-valeedu-blue hover:underline">← Retomar a aula anterior</Link>}
        {proxima ? <Link href={`?aula=${aulaInicial + 2}`} className="rounded-lg bg-valeedu-green px-5 py-3 font-medium text-white">Próxima aula: {proxima.titulo} →</Link> : children}
      </div>
      <details className="ve-card p-6" onToggle={e => setConsultaAberta(e.currentTarget.open)}>
        <summary className="cursor-pointer font-medium text-valeedu-blue">Consultar o material completo</summary>
        {consultaAberta && <div className="mt-5 space-y-6"><TextoMatematico texto={teoriaBase} /><TextoMatematico texto={exemploResolvido} /></div>}
      </details>
      </div>
    </div> : <section className="ve-card space-y-6 p-6">
      <h2 className="ve-eyebrow">Vamos entender</h2>
      {ilustracaoHabilidade && <IlustracaoQuestao svg={ilustracaoHabilidade} />}
      {teoriaBase.trim() ? <TextoMatematico texto={teoriaBase} /> : <p>A explicação desta habilidade ainda precisa ser preparada. Peça orientação ao professor antes de seguir.</p>}
      {exemploResolvido.trim() && <><h3 className="ve-eyebrow">Exemplo resolvido</h3><TextoMatematico texto={exemploResolvido} /></>}
      <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="text-valeedu-blue">Retomar a habilidade</Link>
      {children}
    </section>}
  </div>;
}
