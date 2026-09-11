"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { microBlocosOuFallback } from "@/lib/trilha";

// `Conteudo.microBlocos` ainda não está curado — até lá, quebra teoriaBase em
// blocos menores (ver microBlocosOuFallback) e mostra um por vez, como um
// carrossel de cards curtos, em vez de despejar o markdown inteiro na tela.
export default function TeoriaCards({
  teoriaBase,
  exemploResolvido,
}: {
  teoriaBase: string;
  exemploResolvido: string;
}) {
  const blocos = microBlocosOuFallback(teoriaBase);
  const [indice, setIndice] = useState(0);
  const [mostrarExemplo, setMostrarExemplo] = useState(false);

  if (mostrarExemplo) {
    return (
      <div className="ve-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-valeedu-green">Exemplo resolvido</p>
        <div className="prose prose-slate mt-3 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{exemploResolvido}</ReactMarkdown>
        </div>
        <button
          onClick={() => setMostrarExemplo(false)}
          className="mt-6 text-sm text-slate-600 hover:underline"
        >
          ← Voltar para a teoria
        </button>
      </div>
    );
  }

  return (
    <div className="ve-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-valeedu-green">
        Vamos entender
      </p>
      <div className="prose prose-slate mt-3 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blocos[indice]}</ReactMarkdown>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          disabled={indice === 0}
          className="text-sm text-slate-600 hover:underline disabled:opacity-40"
        >
          ← Anterior
        </button>

        {indice < blocos.length - 1 ? (
          <button
            onClick={() => setIndice((i) => Math.min(blocos.length - 1, i + 1))}
            className="rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={() => setMostrarExemplo(true)}
            className="rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
          >
            Ver exemplo resolvido →
          </button>
        )}
      </div>
    </div>
  );
}
