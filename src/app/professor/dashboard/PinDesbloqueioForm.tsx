"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { atualizarPinDesbloqueio, type EstadoFormulario } from "../actions";

function BotaoSalvar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar PIN"}
    </button>
  );
}

export default function PinDesbloqueioForm({ pinAtual }: { pinAtual: string }) {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(atualizarPinDesbloqueio, undefined);

  return (
    <form action={acao} className="mt-3 flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-medium text-slate-700">PIN de desbloqueio</label>
        <input
          type="text"
          name="pin"
          inputMode="numeric"
          defaultValue={pinAtual}
          minLength={4}
          maxLength={8}
          className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <BotaoSalvar />
      {estado?.erro && <p className="text-sm text-red-600">{estado.erro}</p>}
    </form>
  );
}
