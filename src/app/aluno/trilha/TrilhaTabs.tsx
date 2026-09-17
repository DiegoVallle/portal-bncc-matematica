"use client";

import { useState } from "react";
import AcordeaoNucleo from "./AcordeaoNucleo";
import HabilidadeLink from "./HabilidadeLink";

export type HabilidadeTrilha = {
  codigo: string;
  descricao: string;
  titulo?: string;
  status: string;
  recomendada: boolean;
};

type Nucleo = {
  letra: string;
  nome: string;
  habilidades: HabilidadeTrilha[];
};

export default function TrilhaTabs({
  porNucleo,
  todas,
}: {
  porNucleo: Nucleo[];
  todas: HabilidadeTrilha[];
}) {
  const [aba, setAba] = useState<"pedagogica" | "todas">("pedagogica");

  return (
    <div>
      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5" aria-label="Organização das aulas">
        <button
          onClick={() => setAba("pedagogica")}
          aria-pressed={aba === "pedagogica"}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            aba === "pedagogica"
              ? "bg-white text-valeedu-blue shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Meu caminho
        </button>
        <button
          onClick={() => setAba("todas")}
          aria-pressed={aba === "todas"}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            aba === "todas"
              ? "bg-white text-valeedu-blue shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Consultar habilidades
        </button>
      </div>

      {aba === "pedagogica" ? (
        <div className="mt-4 space-y-3">
          {porNucleo.filter(n => n.habilidades.length > 0).map((n) => (
            <AcordeaoNucleo key={n.letra} nucleo={n} />
          ))}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {todas.map((h) => (
            <li key={h.codigo}>
              <HabilidadeLink habilidade={h} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
