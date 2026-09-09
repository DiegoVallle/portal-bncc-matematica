"use client";

import Link from "next/link";
import { STATUS_ICONES, STATUS_LABELS } from "@/lib/trilha";
import type { HabilidadeTrilha } from "./TrilhaTabs";

export default function AcordeaoNucleo({
  nucleo,
}: {
  nucleo: { letra: string; nome: string; habilidades: HabilidadeTrilha[] };
}) {
  const concluidas = nucleo.habilidades.filter((h) => h.status === "DOMINADO").length;
  const temRecomendada = nucleo.habilidades.some((h) => h.recomendada);

  return (
    <details
      className="group rounded-2xl border border-slate-200 bg-white shadow-sm"
      open={temRecomendada || nucleo.letra === "A"}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
        <span className="text-sm font-semibold text-slate-900">
          {nucleo.letra}. {nucleo.nome}
        </span>
        <span className="text-xs text-slate-500">
          {concluidas} de {nucleo.habilidades.length} habilidades
        </span>
      </summary>
      <ul className="divide-y divide-slate-200 border-t border-slate-200">
        {nucleo.habilidades.map((h) => (
          <li key={h.codigo}>
            <Link
              href={`/aluno/trilha/${h.codigo}`}
              className={`flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-slate-50 ${
                h.recomendada ? "bg-emerald-50" : ""
              }`}
            >
              <span className="text-slate-900">
                {h.recomendada && <span title="Recomendado pelo professor">⭐ </span>}
                <span className="mr-2 font-mono text-slate-500">{h.codigo}</span>
                {h.descricao}
              </span>
              <span className="shrink-0 text-slate-500" title={STATUS_LABELS[h.status]}>
                {STATUS_ICONES[h.status] ?? "○"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
