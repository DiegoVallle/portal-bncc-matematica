"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  revisarRespostasAvaliacao,
  submeterAvaliacaoFinalAberta,
  type EstadoRevisaoAvaliacao,
} from "../../actions";

function BotaoEnviar({ texto }: { texto: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Enviando..." : texto}
    </button>
  );
}

// Passo 1 — o aluno responde as 5 questões, texto livre, sem nenhuma dica ou
// gabarito visível (nem embutido na página: a resposta esperada só chega no
// retorno da action, depois que ele já respondeu). Passo 2 — compara a
// própria resposta com a esperada (quando existir) e se autoavalia; só aí o
// resultado é gravado de fato.
export default function AvaliacaoFinalFormAberta({
  conteudoId,
  questoes,
}: {
  conteudoId: string;
  questoes: { id: string; enunciado: string }[];
}) {
  const [revisao, enviarRespostas] = useActionState<EstadoRevisaoAvaliacao, FormData>(
    revisarRespostasAvaliacao.bind(null, conteudoId),
    undefined
  );

  if (!revisao || revisao.questoes.length === 0) {
    return (
      <form action={enviarRespostas}>
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          🔒 Na avaliação final, a correção é feita apenas ao final. Faça com calma.
        </div>

        {revisao?.erro && <p className="mt-3 text-sm text-red-600">{revisao.erro}</p>}

        {questoes.map((q, i) => (
          <fieldset key={q.id} className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <legend className="px-1 text-sm font-semibold text-slate-500">
              Questão {i + 1} de {questoes.length}
            </legend>
            <p className="mt-1 text-lg font-medium text-slate-900">{q.enunciado}</p>
            <textarea
              name={`resposta_${q.id}`}
              required
              rows={2}
              className="mt-3 w-full rounded-lg border border-slate-300 p-3 text-base"
              placeholder="Sua resposta..."
            />
          </fieldset>
        ))}

        <BotaoEnviar texto="Enviar avaliação" />
      </form>
    );
  }

  return (
    <form action={submeterAvaliacaoFinalAberta.bind(null, conteudoId)}>
      <p className="mt-6 text-sm text-slate-600">
        Confira sua resposta em cada questão e marque se você acertou.
      </p>

      {revisao.questoes.map((q, i) => (
        <fieldset key={q.id} className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-1 text-sm font-semibold text-slate-500">
            Questão {i + 1} de {revisao.questoes.length}
          </legend>
          <p className="mt-1 text-base font-medium text-slate-900">{q.enunciado}</p>
          <p className="mt-2 text-sm text-slate-600">
            <strong>Sua resposta:</strong> {q.respostaAluno}
          </p>
          {q.respostaEsperada ? (
            <p className="mt-1 text-sm text-emerald-700">
              <strong>Resposta esperada:</strong> {q.respostaEsperada}
            </p>
          ) : (
            <p className="mt-1 text-sm italic text-slate-500">
              Sem gabarito disponível para essa questão — releia sua resposta e avalie se você entende bem esse
              conceito.
            </p>
          )}

          <div className="mt-3 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name={`avaliacao_${q.id}`} value="true" required />
              Acertei
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name={`avaliacao_${q.id}`} value="false" required />
              Errei
            </label>
          </div>

          <input type="hidden" name={`resposta_${q.id}`} value={q.respostaAluno} />
        </fieldset>
      ))}

      <BotaoEnviar texto="Confirmar resultado" />
    </form>
  );
}
