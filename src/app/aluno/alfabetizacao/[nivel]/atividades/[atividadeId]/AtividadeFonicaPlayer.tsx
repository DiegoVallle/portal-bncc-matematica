"use client";

// Player de uma atividade fônica: toca a instrução em voz (TTS, Web Speech
// API — SpeechSynthesis) e recebe a resposta por clique ou por voz (STT,
// SpeechRecognition), dependendo do tipo. Cliente porque both APIs só
// existem no browser.
//
// Correção sempre no servidor (ver responderAtividadeFonica) — o client só
// captura a transcrição/clique e mostra feedback, nunca decide certo/errado
// sozinho.

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { responderAtividadeFonica, type EstadoRespostaFonica } from "../../../actions";
import { ehAtividadeDeVoz, CONFIANCA_VOZ_MINIMA_CONFIAVEL, type TipoAtividadeFonica } from "@/lib/fonica";

// Web Speech API — SpeechRecognition ainda não é padrão em todo lib.dom.d.ts
// (só Chrome/Chromium implementam de fato, com prefixo webkit). Tipagem
// mínima local, não a API completa.
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

// Detecta suporte a reconhecimento de voz sem causar mismatch de hidratação:
// useSyncExternalStore usa o snapshot do servidor (sempre "não suporta", já
// que window não existe lá) até logo depois da hidratação, quando troca pro
// snapshot real do cliente — sem precisar de setState num efeito.
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

export default function AtividadeFonicaPlayer({
  atividadeId,
  tipo,
  instrucaoAudio,
  opcoes,
  nivelHref,
}: {
  atividadeId: string;
  tipo: TipoAtividadeFonica;
  instrucaoAudio: string;
  // Nunca inclui o gabarito: pra atividades de clique, `opcoes` traz todas as
  // opções sem marcar qual é a certa (a correção é só no servidor). Pra
  // atividades de voz, `opcoes[0].texto` é a própria palavra/frase que a
  // criança precisa ler em voz alta — não é "a resposta escondida", é o
  // enunciado.
  opcoes: { texto: string; emoji: string }[];
  nivelHref: string;
}) {
  const [estado, acao] = useActionState<EstadoRespostaFonica, FormData>(
    responderAtividadeFonica.bind(null, atividadeId),
    undefined
  );
  const ehVoz = ehAtividadeDeVoz(tipo);
  const inicioRef = useRef<number>(0);
  const [gravando, setGravando] = useState(false);
  const [transcricao, setTranscricao] = useState<string | null>(null);
  const [confianca, setConfianca] = useState<number | null>(null);
  const suportaVoz = useSuportaVoz();
  const formRef = useRef<HTMLFormElement>(null);

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
      setConfianca(typeof resultado?.confidence === "number" ? resultado.confidence : null);
    };
    reconhecimento.onerror = () => setGravando(false);
    reconhecimento.onend = () => setGravando(false);
    setGravando(true);
    setTranscricao(null);
    reconhecimento.start();
  }

  const vozPoucoConfiavel = confianca !== null && confianca < CONFIANCA_VOZ_MINIMA_CONFIAVEL;
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

      {opcoes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {opcoes.map((op) => (
            <div key={op.texto} className="flex flex-col items-center gap-1">
              <span className="text-6xl">{op.emoji}</span>
              {ehVoz && <span className="text-3xl font-bold tracking-wide text-slate-900">{op.texto}</span>}
            </div>
          ))}
        </div>
      )}

      {acertou ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-4xl">✅</p>
          <p className="text-lg font-semibold text-valeedu-green-dark">Isso mesmo!</p>
          <Link
            href={nivelHref}
            className="rounded-lg bg-valeedu-green px-5 py-3 text-sm font-medium text-white hover:bg-valeedu-green-dark"
          >
            Próxima →
          </Link>
        </div>
      ) : (
        <form
          ref={formRef}
          action={(formData) => {
            if (inicioRef.current > 0) formData.set("tempoMs", String(Date.now() - inicioRef.current));
            acao(formData);
          }}
          className="flex w-full flex-col items-center gap-4"
        >
          {!ehVoz && (
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              {opcoes.map((op) => (
                <button
                  key={op.texto}
                  type="submit"
                  name="respostaClique"
                  value={op.texto}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 border-slate-200 p-4 text-4xl hover:border-valeedu-blue hover:bg-valeedu-blue/5"
                >
                  <span>{op.emoji}</span>
                </button>
              ))}
            </div>
          )}

          {ehVoz && suportaVoz && (
            <div className="flex flex-col items-center gap-3">
              <input type="hidden" name="transcricao" value={transcricao ?? ""} />
              <input type="hidden" name="confianca" value={confianca ?? ""} />
              <button
                type="button"
                onClick={iniciarGravacao}
                disabled={gravando}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-valeedu-blue text-4xl text-white shadow-md disabled:opacity-60"
              >
                🎤
              </button>
              <p className="text-sm text-slate-500">{gravando ? "Ouvindo..." : "Toque no microfone e leia em voz alta"}</p>
              {transcricao !== null && (
                <p className="text-sm text-slate-600">
                  Você disse: <span className="font-medium">{transcricao || "(não entendi)"}</span>
                </p>
              )}
              {vozPoucoConfiavel && <p className="text-xs text-amber-600">Não deu pra ouvir direito, pode tentar de novo.</p>}
              <button
                type="submit"
                disabled={!transcricao}
                className="rounded-lg bg-valeedu-green px-5 py-3 text-sm font-medium text-white hover:bg-valeedu-green-dark disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          )}

          {ehVoz && !suportaVoz && (
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
