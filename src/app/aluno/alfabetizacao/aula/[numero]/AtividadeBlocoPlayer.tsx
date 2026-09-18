"use client";

// Player de um bloco de aula (roteiro de 72 aulas) — 3 mecânicas: clique-e-
// compare, contador de toques (ritmo/segmentação de palavra ou sílaba) e
// leitura/produção de voz. Mesmo princípio de correção sempre no servidor
// (ver responderAtividadeBloco) e TTS automático via SpeechSynthesis já
// usados no player da trilha de níveis — arquivo próprio pra não arriscar
// tocar num componente compartilhado que outra sessão está evoluindo.

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { responderAtividadeBloco, type EstadoRespostaBloco } from "../actions";
import type { TipoAtividadeBloco } from "@/lib/aulas";

type SpeechRecognitionResultLike = { transcript: string; confidence: number };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { [i: number]: { [j: number]: SpeechRecognitionResultLike } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function obterConstrutorReconhecimento(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function inscreverSemMudanca() {
  return () => {};
}
function useSuportaVoz(): boolean {
  return useSyncExternalStore(
    inscreverSemMudanca,
    () => !!obterConstrutorReconhecimento(),
    () => false
  );
}

function falar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export default function AtividadeBlocoPlayer({
  atividadeId,
  tipo,
  instrucaoAudio,
  opcoes,
  aulaHref,
}: {
  atividadeId: string;
  tipo: TipoAtividadeBloco;
  instrucaoAudio: string;
  opcoes: { texto: string; emoji: string }[];
  aulaHref: string;
}) {
  const [estado, acao] = useActionState<EstadoRespostaBloco, FormData>(
    responderAtividadeBloco.bind(null, atividadeId),
    undefined
  );
  const inicioRef = useRef<number>(0);
  const [toques, setToques] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [transcricao, setTranscricao] = useState<string | null>(null);
  const suportaVoz = useSuportaVoz();

  useEffect(() => {
    inicioRef.current = Date.now();
    falar(instrucaoAudio);
  }, [instrucaoAudio]);

  function iniciarGravacao() {
    const Construtor = obterConstrutorReconhecimento();
    if (!Construtor) return;
    const reconhecimento = new Construtor();
    reconhecimento.lang = "pt-BR";
    reconhecimento.interimResults = false;
    reconhecimento.maxAlternatives = 1;
    reconhecimento.onresult = (event) => {
      const resultado = event.results[0]?.[0];
      setTranscricao(resultado?.transcript ?? "");
    };
    reconhecimento.onerror = () => setGravando(false);
    reconhecimento.onend = () => setGravando(false);
    setGravando(true);
    setTranscricao(null);
    reconhecimento.start();
  }

  const respondeu = estado !== undefined;
  const acertou = estado?.correta === true;

  return (
    <div className="mt-6 flex flex-col items-center gap-6 rounded-2xl border border-valeedu-blue/20 bg-white p-8 text-center shadow-sm">
      <button
        type="button"
        onClick={() => falar(instrucaoAudio)}
        className="rounded-full bg-valeedu-blue/10 px-4 py-2 text-sm font-medium text-valeedu-blue hover:bg-valeedu-blue/20"
      >
        🔊 Ouvir de novo
      </button>

      {acertou ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-4xl">✅</p>
          <p className="text-lg font-semibold text-valeedu-green-dark">Isso mesmo!</p>
          <Link
            href={aulaHref}
            className="rounded-lg bg-valeedu-green px-5 py-3 text-sm font-medium text-white hover:bg-valeedu-green-dark"
          >
            Próxima →
          </Link>
        </div>
      ) : (
        <form
          action={(formData) => {
            if (inicioRef.current > 0) formData.set("tempoMs", String(Date.now() - inicioRef.current));
            acao(formData);
          }}
          className="flex w-full flex-col items-center gap-4"
        >
          {tipo === "CLIQUE_COMPARACAO" && (
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              {opcoes.map((op) => (
                <button
                  key={op.texto}
                  type="submit"
                  name="respostaClique"
                  value={op.texto}
                  aria-label={op.texto}
                  className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 p-4 text-5xl shadow-sm hover:border-valeedu-blue hover:bg-valeedu-blue/5"
                >
                  <span aria-hidden="true">{op.emoji}</span>
                </button>
              ))}
            </div>
          )}

          {tipo === "CONTADOR_TOQUES" && (
            <div className="flex flex-col items-center gap-3">
              <input type="hidden" name="contagem" value={toques} />
              <button
                type="button"
                onClick={() => setToques((t) => t + 1)}
                className="flex h-28 w-28 items-center justify-center rounded-full bg-valeedu-blue text-5xl text-white shadow-md active:scale-95"
                aria-label="Tocar"
              >
                👏
              </button>
              <p className="text-2xl font-bold text-valeedu-blue">{toques}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setToques(0)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600"
                >
                  Recomeçar
                </button>
                <button
                  type="submit"
                  disabled={toques === 0}
                  className="rounded-lg bg-valeedu-green px-5 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark disabled:opacity-50"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}

          {tipo === "LEITURA_VOZ" && suportaVoz && (
            <div className="flex flex-col items-center gap-3">
              <input type="hidden" name="transcricao" value={transcricao ?? ""} />
              <button
                type="button"
                onClick={iniciarGravacao}
                disabled={gravando}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-valeedu-blue text-4xl text-white shadow-md disabled:opacity-60"
                aria-label="Gravar"
              >
                🎤
              </button>
              <p className="text-sm text-slate-500">{gravando ? "Ouvindo..." : "Toque no microfone e fale"}</p>
              {transcricao !== null && (
                <p className="text-sm text-slate-600">
                  Você disse: <span className="font-medium">{transcricao || "(não entendi)"}</span>
                </p>
              )}
              <button
                type="submit"
                disabled={!transcricao}
                className="rounded-lg bg-valeedu-green px-5 py-3 text-sm font-medium text-white hover:bg-valeedu-green-dark disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          )}

          {tipo === "LEITURA_VOZ" && !suportaVoz && (
            <p className="text-sm text-amber-600">
              Este navegador não reconhece voz — peça pra um adulto abrir esta atividade no Google Chrome.
            </p>
          )}

          {respondeu && !acertou && (
            <p className="text-base font-medium text-amber-600">{estado?.erro ?? "Vamos tentar de novo! 🔁"}</p>
          )}
        </form>
      )}
    </div>
  );
}
