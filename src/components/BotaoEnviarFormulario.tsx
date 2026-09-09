"use client";

import { useFormStatus } from "react-dom";

export default function BotaoEnviarFormulario({ texto = "Enviar respostas" }: { texto?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-valeedu-green px-4 py-3 text-sm font-semibold text-white hover:bg-valeedu-green-dark disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Enviando..." : texto}
    </button>
  );
}
