"use client";

import { useEffect, useState } from "react";

const LETRAS = ["A", "B", "C", "D", "E", "F"];

export default function BotaoOuvirQuestao({
  enunciado,
  alternativas,
}: {
  enunciado: string;
  alternativas: string[];
}) {
  const [falando, setFalando] = useState(false);
  const [suportado, setSuportado] = useState(true);

  useEffect(() => {
    setSuportado(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  function falar() {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const partes = [enunciado, ...alternativas.map((texto, i) => `${LETRAS[i]}. ${texto}.`)];
    const utterance = new SpeechSynthesisUtterance(partes.join(" "));
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;

    utterance.onstart = () => setFalando(true);
    utterance.onend = () => setFalando(false);
    utterance.onerror = () => setFalando(false);

    window.speechSynthesis.speak(utterance);
  }

  function parar() {
    window.speechSynthesis.cancel();
    setFalando(false);
  }

  if (!suportado) return null;

  return (
    <button
      type="button"
      onClick={falando ? parar : falar}
      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
      aria-label={falando ? "Parar leitura da questão" : "Ouvir a questão e as alternativas"}
    >
      {falando ? "⏹️ Parar" : "🔊 Ouvir pergunta e respostas"}
    </button>
  );
}
