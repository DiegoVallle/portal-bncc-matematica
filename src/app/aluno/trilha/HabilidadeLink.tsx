import Link from "next/link";
import { STATUS_LABELS } from "@/lib/trilha";
import type { HabilidadeTrilha } from "./TrilhaTabs";

export default function HabilidadeLink({ habilidade: h }: { habilidade: HabilidadeTrilha }) {
  return <Link href={`/aluno/trilha/${h.codigo}`} className={`group flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-slate-50 ${h.recomendada ? "bg-green-50/70" : ""}`}>
    <span className="min-w-0">
      {h.recomendada && <span className="mb-2 block text-xs font-semibold text-valeedu-green">Indicada pelo professor</span>}
      <span className="block font-semibold leading-snug text-valeedu-blue-dark">{h.titulo ?? h.descricao}</span>
      <span className="mt-2 block text-xs text-slate-500">{h.codigo} · {STATUS_LABELS[h.status] ?? h.status}</span>
    </span>
    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-valeedu-blue group-hover:border-valeedu-blue">→</span>
  </Link>;
}
