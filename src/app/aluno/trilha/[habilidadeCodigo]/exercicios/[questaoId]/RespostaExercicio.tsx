"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { responderExercicio, type EstadoResposta } from "../../../actions";

const LETRAS = ["A", "B", "C", "D", "E", "F"];

function BotaoResponder({ texto }: { texto: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full rounded-lg bg-valeedu-green px-4 py-3 text-sm font-semibold text-white hover:bg-valeedu-green-dark disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Enviando..." : texto}
    </button>
  );
}

function CardAlternativas({
  alternativasTexto,
  indiceCorreto,
  indiceEscolhido,
  interativo,
  onEscolher,
}: {
  alternativasTexto: string[];
  indiceCorreto?: number;
  indiceEscolhido: number | null;
  interativo: boolean;
  onEscolher?: (i: number) => void;
}) {
  return (
    <div className="mt-4 space-y-2">
      {alternativasTexto.map((texto, i) => {
        const eCorreta = indiceCorreto === i;
        const eEscolhida = indiceEscolhido === i;
        const revelado = indiceCorreto !== undefined;

        // Verde só depois de revelado (resposta confirmada certa) — antes disso
        // uma seleção é só "escolhida", nunca fica verde, pra não parecer que
        // já foi validada como correta.
        let classe = "border-slate-200 hover:bg-slate-50";
        if (revelado && eCorreta) classe = "border-valeedu-green bg-emerald-50";
        else if (revelado && eEscolhida && !eCorreta) classe = "border-red-400 bg-red-50";
        else if (!revelado && eEscolhida) classe = "border-blue-400 bg-blue-50";

        return (
          <label
            key={i}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-base ${classe} ${
              !interativo ? "cursor-default" : ""
            }`}
          >
            {interativo && (
              <input
                type="radio"
                name="alternativaIndex"
                value={i}
                checked={eEscolhida}
                onChange={() => onEscolher?.(i)}
                required
                className="mt-1"
              />
            )}
            <span className="font-mono text-sm text-slate-500">{LETRAS[i]})</span>
            <span>{texto}</span>
            {revelado && eCorreta && <span className="ml-auto text-valeedu-green">✓</span>}
            {revelado && eEscolhida && !eCorreta && <span className="ml-auto text-red-500">✗</span>}
          </label>
        );
      })}
    </div>
  );
}

export default function RespostaExercicio({
  questaoId,
  alternativasTexto,
  tentativasUsadas,
  jaResolvidaAoEntrar,
  revelacaoInicial,
  proximaHref,
}: {
  questaoId: string;
  alternativasTexto: string[];
  tentativasUsadas: number;
  jaResolvidaAoEntrar: boolean;
  revelacaoInicial: { alternativaCorretaIndex: number; resolucao: string | null; algumaCorreta: boolean } | null;
  habilidadeCodigo: string;
  proximaHref: string;
}) {
  const [estado, acao] = useActionState<EstadoResposta, FormData>(
    responderExercicio.bind(null, questaoId),
    undefined
  );
  const [indiceEscolhido, setIndiceEscolhido] = useState<number | null>(null);
  const inicioRef = useRef<number>(0);
  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  // Limpa a seleção depois de um erro com tentativas restantes, pra não
  // deixar a alternativa errada marcada quando o aluno for tentar de novo.
  // Ajuste de estado durante a renderização (não em efeito) ao detectar que
  // `estado` mudou — padrão recomendado pelo React pra "resetar estado quando
  // uma prop muda", evita o cascading render de um setState dentro de efeito.
  const [estadoAnterior, setEstadoAnterior] = useState(estado);
  if (estado !== estadoAnterior) {
    setEstadoAnterior(estado);
    if (estado && !estado.correta && !estado.mostrarResposta) {
      setIndiceEscolhido(null);
    }
  }

  // Caso já resolvida antes de entrar nesta tela (acerto anterior ou 3
  // tentativas esgotadas em outra visita) — mostra só o resultado, sem form.
  if (jaResolvidaAoEntrar && revelacaoInicial) {
    return (
      <div>
        <CardAlternativas
          alternativasTexto={alternativasTexto}
          indiceCorreto={revelacaoInicial.alternativaCorretaIndex}
          indiceEscolhido={null}
          interativo={false}
        />
        <p className={`mt-4 text-sm font-medium ${revelacaoInicial.algumaCorreta ? "text-valeedu-green-dark" : "text-slate-600"}`}>
          {revelacaoInicial.algumaCorreta ? "Você já acertou essa questão." : "Você já usou as 3 tentativas desta questão."}
        </p>
        {revelacaoInicial.resolucao && (
          <p className="mt-2 text-sm text-slate-600">{revelacaoInicial.resolucao}</p>
        )}
        <Link
          href={proximaHref}
          className="mt-5 inline-block rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
        >
          Próxima →
        </Link>
      </div>
    );
  }

  const revelado = estado?.mostrarResposta === true;
  // A tentativa que está prestes a ser feita. Deriva do `tentativasRestantes`
  // devolvido pela action (não de `tentativasUsadas`, que é a prop inicial do
  // servidor e não muda entre re-renders do client component depois de cada
  // submit). Numa resposta inválida (sem gravar tentativa de verdade) a action
  // devolve `tentativasRestantes` sem decrementar, então a fórmula não avança.
  const numeroTentativaAtual = estado && !revelado ? 4 - estado.tentativasRestantes : tentativasUsadas + 1;

  return (
    <form
      action={(formData) => {
        if (inicioRef.current > 0) formData.set("tempoMs", String(Date.now() - inicioRef.current));
        acao(formData);
      }}
    >
      <CardAlternativas
        alternativasTexto={alternativasTexto}
        indiceCorreto={revelado ? estado?.alternativaCorretaIndex : undefined}
        indiceEscolhido={indiceEscolhido}
        interativo={!revelado}
        onEscolher={setIndiceEscolhido}
      />

      {estado?.erro && !revelado && <p className="mt-3 text-sm text-red-600">{estado.erro}</p>}

      {!revelado && estado?.mensagemDiagnostico && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          🔍 <strong>Possível causa:</strong> {estado.mensagemDiagnostico}
        </div>
      )}

      {!revelado && estado?.dica && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          💡 <strong>Dica:</strong> {estado.dica}
        </div>
      )}

      {revelado ? (
        <div className="mt-4">
          <p className={`text-sm font-medium ${estado?.correta ? "text-valeedu-green-dark" : "text-slate-700"}`}>
            {estado?.correta ? "Correto! 🎉" : "Não foi dessa vez — veja a resposta certa acima."}
          </p>
          {estado?.resolucao && <p className="mt-2 text-sm text-slate-600">{estado.resolucao}</p>}
          <Link
            href={proximaHref}
            className="mt-5 inline-block rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
          >
            Próxima →
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-xs text-slate-500">Tentativa {numeroTentativaAtual} de 3</p>
          <BotaoResponder texto={numeroTentativaAtual === 1 ? "Responder" : "Tentar de novo"} />
        </>
      )}
    </form>
  );
}
