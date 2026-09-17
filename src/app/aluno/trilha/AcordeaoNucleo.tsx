"use client";

import HabilidadeLink from "./HabilidadeLink";
import type { HabilidadeTrilha } from "./TrilhaTabs";

export default function AcordeaoNucleo({
  nucleo,
}: {
  nucleo: { letra: string; nome: string; habilidades: HabilidadeTrilha[] };
}) {
  const temRecomendada = nucleo.habilidades.some((h) => h.recomendada);

  return (
    <details
      className="ve-card group overflow-hidden"
      open={temRecomendada || nucleo.letra === "A"}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-slate-900">
          {nucleo.letra}. {nucleo.nome}
        </span>
        <span className="text-xs text-slate-500">
          <span aria-hidden="true" className="inline-block text-lg transition-transform group-open:rotate-180">⌄</span>
        </span>
      </summary>
      <ul className="divide-y divide-slate-200 border-t border-slate-200">
        {nucleo.habilidades.map((h) => (
          <li key={h.codigo}>
            <HabilidadeLink habilidade={h} />
          </li>
        ))}
      </ul>
    </details>
  );
}
