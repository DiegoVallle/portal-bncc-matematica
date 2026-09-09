"use client";

import { useState } from "react";
import AcordeaoNucleo from "./AcordeaoNucleo";
import { STATUS_ICONES, STATUS_LABELS } from "@/lib/trilha";
import Link from "next/link";

export type HabilidadeTrilha = {
  codigo: string;
  descricao: string;
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
      <div className="flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setAba("pedagogica")}
          className={`px-4 py-2 text-sm font-medium ${
            aba === "pedagogica"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Trilha por ordem pedagógica
        </button>
        <button
          onClick={() => setAba("todas")}
          className={`px-4 py-2 text-sm font-medium ${
            aba === "todas"
              ? "border-b-2 border-emerald-600 text-emerald-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Todas as habilidades (BNCC)
        </button>
      </div>

      {aba === "pedagogica" ? (
        <div className="mt-4 space-y-3">
          {porNucleo.map((n) => (
            <AcordeaoNucleo key={n.letra} nucleo={n} />
          ))}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {todas.map((h) => (
            <li key={h.codigo}>
              <Link
                href={`/aluno/trilha/${h.codigo}`}
                className={`flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 ${
                  h.recomendada ? "bg-emerald-50" : ""
                }`}
              >
                <span className="text-sm text-slate-900">
                  {h.recomendada && <span title="Recomendado pelo professor">⭐ </span>}
                  <span className="mr-2 font-mono text-slate-500">{h.codigo}</span>
                  {h.descricao}
                </span>
                <span className="shrink-0 text-sm text-slate-500" title={STATUS_LABELS[h.status]}>
                  {STATUS_ICONES[h.status] ?? "○"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
