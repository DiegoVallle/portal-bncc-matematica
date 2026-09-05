"use client";

import { useState } from "react";
import { iniciarTentativa } from "../actions";
import { ANOS_ESCOLARES, BIMESTRES } from "@/lib/bncc";

export default function IniciarTesteForm({ anoSugerido }: { anoSugerido: number }) {
  const [ano, setAno] = useState(anoSugerido);
  const [bimestre, setBimestre] = useState(1);

  return (
    <form action={iniciarTentativa} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700">Ano escolar</label>
        <select
          name="anoEscolar"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {ANOS_ESCOLARES.map((a) => (
            <option key={a} value={a}>
              {a}º ano
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700">Bimestre</label>
        <select
          name="bimestre"
          value={bimestre}
          onChange={(e) => setBimestre(Number(e.target.value))}
          className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {BIMESTRES.map((b) => (
            <option key={b} value={b}>
              {b}º bimestre
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Iniciar teste
      </button>
    </form>
  );
}
