"use client";

import { useState } from "react";
import Link from "next/link";
import TextoMatematico from "@/components/TextoMatematico";
import type { ItemPraticaGuiada } from "@/lib/pratica-guiada";

export default function PraticaGuiada({ item, anterior, proximo, codigo }: {
  item: ItemPraticaGuiada; anterior: string | null; proximo: string | null; codigo: string;
}) {
  const [resposta, setResposta] = useState("");
  const [conferir, setConferir] = useState(false);
  return <div className="space-y-6">
    <section className="ve-card p-6 sm:p-8">
      <p className="ve-eyebrow mb-4">{item.nivel === "DESAFIO" ? "Desafio opcional" : "Pense e explique"}</p>
      <TextoMatematico texto={item.enunciado} />
      <form className="mt-6" onSubmit={e => {e.preventDefault(); if (resposta.trim()) setConferir(true);}}>
        <label htmlFor="raciocinio" className="block font-medium text-slate-800">Como você resolveria?</label>
        <p id="ajuda-raciocinio" className="mt-2 text-sm text-slate-600">Registre seu raciocínio antes de consultar a resposta. Esta prática não atribui nota nem salva sua resposta.</p>
        <textarea id="raciocinio" aria-describedby="ajuda-raciocinio" value={resposta} onChange={e => {setResposta(e.target.value); setConferir(false);}} rows={4} maxLength={4000} required className="mt-3 w-full rounded-xl border border-slate-300 p-4" />
        <button disabled={!resposta.trim()} className="mt-3 rounded-lg bg-valeedu-blue px-5 py-3 font-medium text-white disabled:opacity-50">Consultar a resposta e comparar</button>
      </form>
    </section>
    {conferir && <section role="status" className="ve-card space-y-4 p-6 sm:p-8">
      <h2 className="ve-eyebrow">Confira seu caminho</h2>
      {item.resolucao ? <TextoMatematico texto={item.resolucao} /> : item.respostaEsperada ? <TextoMatematico texto={item.respostaEsperada} /> : <p>Esta questão pede discussão com o professor. Explique o caminho que você usou.</p>}
      {item.resolucao && item.respostaEsperada && item.resolucao !== item.respostaEsperada && <TextoMatematico texto={`**Resposta esperada:** ${item.respostaEsperada}`} />}
      <p className="text-sm leading-relaxed text-slate-600">Compare as operações, as unidades e a conclusão. Se o resultado for diferente, retome a explicação da aula ou peça ajuda ao professor.</p>
    </section>}
    <nav aria-label="Navegação da prática" className="flex flex-wrap items-center gap-4">
      {anterior && <Link href={`?questao=${anterior}`} className="text-valeedu-blue hover:underline">← Anterior</Link>}
      {proximo ? <Link href={`?questao=${proximo}`} className="rounded-lg bg-valeedu-green px-5 py-3 font-medium text-white">Próximo exercício →</Link> : <Link href={`/aluno/trilha/${codigo}`} className="rounded-lg bg-valeedu-green px-5 py-3 font-medium text-white">Voltar à aula →</Link>}
    </nav>
  </div>;
}
