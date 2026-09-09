"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { definirPontoPartidaTrilha, type EstadoFormulario } from "./actions";

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Definir ponto de partida"}
    </button>
  );
}

export default function DefinirPontoPartidaForm({
  alunoId,
  atual,
  nucleos,
}: {
  alunoId: string;
  atual: string | null;
  nucleos: { letra: string; nome: string; habilidades: { codigo: string; descricao: string }[] }[];
}) {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(
    definirPontoPartidaTrilha.bind(null, alunoId),
    undefined
  );

  return (
    <form action={acao} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="habilidadeCodigo" className="block text-sm font-medium text-slate-700">
          Habilidade de partida
        </label>
        <select
          id="habilidadeCodigo"
          name="habilidadeCodigo"
          defaultValue={atual ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
        >
          <option value="">Nenhuma (aluno começa pela primeira da trilha)</option>
          {nucleos.map((n) => (
            <optgroup key={n.letra} label={`${n.letra}. ${n.nome}`}>
              {n.habilidades.map((h) => (
                <option key={h.codigo} value={h.codigo}>
                  {h.codigo} — {h.descricao.length > 70 ? `${h.descricao.slice(0, 70)}...` : h.descricao}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <BotaoSalvar />
      {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}
    </form>
  );
}
