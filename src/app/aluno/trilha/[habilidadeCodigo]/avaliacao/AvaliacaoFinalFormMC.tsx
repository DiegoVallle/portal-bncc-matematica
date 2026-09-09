"use client";

import { useFormStatus } from "react-dom";
import { submeterAvaliacaoFinalMC } from "../../actions";

const LETRAS = ["A", "B", "C", "D", "E", "F"];

function BotaoEnviar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-lg bg-valeedu-green px-4 py-3 text-sm font-semibold text-white hover:bg-valeedu-green-dark disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Enviando..." : "Enviar avaliação"}
    </button>
  );
}

// Múltipla escolha, formulário único (igual ao diagnóstico) — sem feedback
// por questão. A correção é automática no servidor, mas só é usada/mostrada
// depois que o aluno envia as 5 respostas de uma vez.
export default function AvaliacaoFinalFormMC({
  conteudoId,
  questoes,
}: {
  conteudoId: string;
  questoes: { id: string; enunciado: string; alternativasTexto: string[] }[];
}) {
  return (
    <form action={submeterAvaliacaoFinalMC.bind(null, conteudoId)}>
      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        🔒 Na avaliação final, a correção é feita apenas ao final. Faça com calma.
      </div>

      {questoes.map((q, i) => (
        <fieldset key={q.id} className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-1 text-sm font-semibold text-slate-500">
            Questão {i + 1} de {questoes.length}
          </legend>
          <p className="mt-1 text-lg font-medium text-slate-900">{q.enunciado}</p>
          <div className="mt-4 space-y-2">
            {q.alternativasTexto.map((texto, alt) => (
              <label
                key={alt}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 text-base hover:bg-slate-50 has-[:checked]:border-valeedu-green has-[:checked]:bg-emerald-50"
              >
                <input type="radio" name={`questao_${q.id}`} value={alt} required className="mt-1" />
                <span className="font-mono text-sm text-slate-500">{LETRAS[alt]})</span>
                <span>{texto}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <BotaoEnviar />
    </form>
  );
}
