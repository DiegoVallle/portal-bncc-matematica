"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { desbloquearComSenha, type EstadoResposta } from "../../../actions";

function BotaoDesbloquear() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
    >
      {pending ? "Verificando..." : "Desbloquear"}
    </button>
  );
}

// Tela de bloqueio depois de 3 tentativas erradas — em vez de revelar a
// resposta sozinho, pede o PIN do professor (Professor.pinDesbloqueio,
// separado da senha de login). Usado tanto por RespostaExercicio (múltipla
// escolha/numérica) quanto por AtividadeInterativa — por isso fica num
// componente próprio: as duas telas só precisam saber "quando desbloqueou"
// (via onDesbloqueado), não como o PIN é verificado.
export default function DesbloqueioSenha({
  questaoId,
  onDesbloqueado,
}: {
  questaoId: string;
  onDesbloqueado: (estado: EstadoResposta) => void;
}) {
  const [estado, acao] = useActionState<EstadoResposta, FormData>(
    desbloquearComSenha.bind(null, questaoId),
    undefined
  );

  useEffect(() => {
    if (estado?.mostrarResposta) onDesbloqueado(estado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado]);

  return (
    <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">🔒 Você usou as 3 tentativas desta questão.</p>
      <p className="mt-1 text-sm text-amber-800">Peça pro seu professor(a) digitar o PIN dele pra ver a resposta e continuar.</p>
      <form action={acao} className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="password"
          name="pin"
          inputMode="numeric"
          placeholder="PIN do professor"
          required
          className="w-40 rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-600 focus:outline-none"
        />
        <BotaoDesbloquear />
      </form>
      {estado?.erro && <p className="mt-2 text-sm text-red-600">{estado.erro}</p>}
    </div>
  );
}
