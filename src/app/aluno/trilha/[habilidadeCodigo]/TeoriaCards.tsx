"use client";

import { useState } from "react";
import Link from "next/link";
import TextoMatematico from "@/components/TextoMatematico";
import type { AulaRevisada } from "@/content/aulas-revisadas";

export default function TeoriaCards({ aulas, aulaInicial, habilidadeCodigo, teoriaBase, exemploResolvido, children }: {
  aulas: AulaRevisada[]; aulaInicial: number; habilidadeCodigo: string;
  teoriaBase: string; exemploResolvido: string; children?: React.ReactNode;
}) {
  const aula = aulas[aulaInicial];
  const [escolha, setEscolha] = useState<number | null>(null);
  const [conferiu, setConferiu] = useState(false);
  const proxima = aulas[aulaInicial + 1];

  return <div className="space-y-6">
    {aulas.length > 1 && <nav aria-label="Aulas desta habilidade" className="flex flex-wrap gap-2">
      {aulas.map((item, i) => <Link key={item.titulo} href={`?aula=${i + 1}`} aria-current={i === aulaInicial ? "page" : undefined}
        className={`rounded-xl border px-4 py-3 text-sm font-medium ${i === aulaInicial ? "border-valeedu-blue bg-valeedu-blue text-white" : "border-slate-200 bg-white text-valeedu-blue"}`}>
        {item.titulo}
      </Link>)}
    </nav>}
    {aula ? <>
      <section className="ve-welcome">
        <p className="ve-eyebrow">Nossa aula</p>
        <h2 className="mt-2 text-2xl font-semibold text-valeedu-blue-dark">{aula.titulo}</h2>
        <p className="mt-3 text-slate-700">Hoje você vai: {aula.objetivo.charAt(0).toLowerCase() + aula.objetivo.slice(1)}</p>
      </section>
      <section className="ve-card p-6 sm:p-8" aria-label="Explicação">
        <h3 className="ve-eyebrow mb-4">Vamos entender</h3>
        <TextoMatematico texto={aula.teoria} />
      </section>
      <section className="ve-card p-6 sm:p-8" aria-label="Exemplo resolvido">
        <h3 className="ve-eyebrow mb-4">Acompanhe o raciocínio</h3>
        <TextoMatematico texto={aula.exemplo} />
      </section>
      <section className="ve-card p-6 sm:p-8">
        <h3 className="ve-eyebrow">Agora, pense você</h3>
        <p className="mt-2 text-sm text-slate-500">Uma pausa para entender, sem nota e sem bloqueio.</p>
        <form className="mt-5" onSubmit={(e) => { e.preventDefault(); if (escolha !== null) setConferiu(true); }}>
          <fieldset>
            <legend className="mb-4 font-semibold text-slate-900">{aula.pergunta}</legend>
            <div className="space-y-2">
              {aula.opcoes.map((opcao, i) => <label key={opcao} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${escolha === i ? "border-valeedu-blue bg-blue-50" : "border-slate-200"}`}>
                <input type="radio" name="compreensao" value={i} checked={escolha === i} onChange={() => { setEscolha(i); setConferiu(false); }} />
                <span>{opcao}</span>
              </label>)}
            </div>
          </fieldset>
          <button disabled={escolha === null} className="mt-4 rounded-lg bg-valeedu-blue px-5 py-3 font-medium text-white disabled:opacity-50">Conferir meu raciocínio</button>
        </form>
        {conferiu && <div role="status" className="mt-5 rounded-xl bg-slate-50 p-5">
          <p className="font-semibold text-valeedu-blue">{escolha === aula.correta ? "Isso mesmo!" : "Vamos pensar juntos."}</p>
          <p className="mt-2 leading-relaxed text-slate-700">{aula.feedback}</p>
          {escolha !== aula.correta && <p className="mt-2 text-sm text-slate-600">Volte ao exemplo e tente outra opção.</p>}
        </div>}
      </section>
      <div className="flex flex-wrap items-center gap-4">
        {aulaInicial > 0 && <Link href={`?aula=${aulaInicial}`} className="text-sm text-valeedu-blue hover:underline">← Retomar a aula anterior</Link>}
        {proxima ? <Link href={`?aula=${aulaInicial + 2}`} className="rounded-lg bg-valeedu-green px-5 py-3 font-medium text-white">Próxima aula: {proxima.titulo} →</Link> : children}
      </div>
      <details className="ve-card p-6">
        <summary className="cursor-pointer font-medium text-valeedu-blue">Consultar o material completo</summary>
        <div className="mt-5 space-y-6"><TextoMatematico texto={teoriaBase} /><TextoMatematico texto={exemploResolvido} /></div>
      </details>
    </> : <section className="ve-card space-y-6 p-6">
      <h2 className="ve-eyebrow">Vamos entender</h2>
      {teoriaBase.trim() ? <TextoMatematico texto={teoriaBase} /> : <p>A explicação desta habilidade ainda precisa ser preparada. Peça orientação ao professor antes de seguir.</p>}
      {exemploResolvido.trim() && <><h3 className="ve-eyebrow">Exemplo resolvido</h3><TextoMatematico texto={exemploResolvido} /></>}
      <Link href={`/aluno/trilha/${habilidadeCodigo}`} className="text-valeedu-blue">Retomar a habilidade</Link>
      {children}
    </section>}
  </div>;
}
