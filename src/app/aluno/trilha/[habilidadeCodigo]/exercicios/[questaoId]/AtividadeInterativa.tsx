"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { responderAtividadeInterativa, type EstadoResposta } from "../../../actions";
import DesbloqueioSenha from "./DesbloqueioSenha";

type PayloadOrdenacao = { tipo: "ORDENACAO"; itens: string[] };
type PayloadLigarPares = { tipo: "LIGAR_PARES"; esquerda: string[]; direita: string[] };
type PayloadClassificacao = { tipo: "CLASSIFICACAO"; categorias: string[]; itens: string[] };
export type PayloadAtividade = PayloadOrdenacao | PayloadLigarPares | PayloadClassificacao;

function BotaoResponder({ texto, habilitado }: { texto: string; habilitado: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !habilitado}
      className="mt-5 w-full rounded-lg bg-valeedu-green px-4 py-3 text-sm font-semibold text-white hover:bg-valeedu-green-dark disabled:opacity-40 sm:w-auto"
    >
      {pending ? "Enviando..." : texto}
    </button>
  );
}

// Ordenação: sem drag-and-drop — mover com ▲▼, funciona igual em mouse, touch
// e teclado (sem lib extra, sem gesto que quebre em mobile).
function BlocoOrdenacao({ itens, onMudar }: { itens: string[]; onMudar: (ordem: string[]) => void }) {
  const [ordem, setOrdem] = useState(itens);
  useEffect(() => onMudar(ordem), [ordem, onMudar]);

  function mover(i: number, direcao: -1 | 1) {
    const j = i + direcao;
    if (j < 0 || j >= ordem.length) return;
    const nova = [...ordem];
    [nova[i], nova[j]] = [nova[j], nova[i]];
    setOrdem(nova);
  }

  return (
    <ol className="mt-4 space-y-2">
      {ordem.map((texto, i) => (
        <li key={texto} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
          <span className="font-mono text-sm text-slate-400">{i + 1}.</span>
          <span className="flex-1 text-sm text-slate-900">{texto}</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => mover(i, -1)}
              disabled={i === 0}
              aria-label="Mover para cima"
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => mover(i, 1)}
              disabled={i === ordem.length - 1}
              aria-label="Mover para baixo"
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            >
              ▼
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Ligar pares: clique num item da esquerda, depois num da direita, pra ligá-los.
function BlocoLigarPares({
  esquerda,
  direita,
  onMudar,
}: {
  esquerda: string[];
  direita: string[];
  onMudar: (pares: Record<string, string>) => void;
}) {
  const [ativo, setAtivo] = useState<string | null>(null);
  const [pares, setPares] = useState<Record<string, string>>({});

  // Sempre via updater funcional (nunca lendo a variável `pares` capturada no
  // closure) — evita perder atualizações se dois cliques caírem no mesmo ciclo
  // de render. `onMudar` roda num efeito reagindo ao estado, nunca com o valor
  // antigo passado na mão.
  useEffect(() => onMudar(pares), [pares, onMudar]);

  function escolherEsquerda(item: string) {
    setAtivo((atual) => (item === atual ? null : item));
  }

  function escolherDireita(item: string) {
    if (!ativo) return;
    setPares((atuais) => ({ ...atuais, [ativo]: item }));
    setAtivo(null);
  }

  const direitaUsada = new Set(Object.values(pares));

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {esquerda.map((item) => {
          const ligado = pares[item];
          return (
            <button
              type="button"
              key={item}
              onClick={() => escolherEsquerda(item)}
              className={`w-full rounded-lg border p-3 text-left text-sm ${
                ativo === item
                  ? "border-blue-400 bg-blue-50"
                  : ligado
                    ? "border-valeedu-green bg-emerald-50"
                    : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              {item}
              {ligado && <span className="ml-2 text-xs text-valeedu-green-dark">→ {ligado}</span>}
            </button>
          );
        })}
      </div>
      <div className="space-y-2">
        {direita.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => escolherDireita(item)}
            disabled={!ativo && !direitaUsada.has(item)}
            className={`w-full rounded-lg border p-3 text-left text-sm ${
              direitaUsada.has(item) ? "border-valeedu-green bg-emerald-50" : "border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

// Classificação: cada item ganha botões de categoria; clicar atribui.
function BlocoClassificacao({
  categorias,
  itens,
  onMudar,
}: {
  categorias: string[];
  itens: string[];
  onMudar: (classificacao: Record<string, string>) => void;
}) {
  const [classificacao, setClassificacao] = useState<Record<string, string>>({});
  useEffect(() => onMudar(classificacao), [classificacao, onMudar]);

  function escolher(item: string, categoria: string) {
    setClassificacao((atual) => ({ ...atual, [item]: categoria }));
  }

  return (
    <div className="mt-4 space-y-3">
      {itens.map((item) => (
        <div key={item} className="rounded-lg border border-slate-200 p-3">
          <p className="text-sm text-slate-900">{item}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <button
                type="button"
                key={categoria}
                onClick={() => escolher(item, categoria)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  classificacao[item] === categoria
                    ? "border-valeedu-green bg-emerald-50 text-valeedu-green-dark"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AtividadeInterativa({
  questaoId,
  enunciado,
  payload,
  tituloTipo,
  jaResolvidaAoEntrar,
  bloqueadaAoEntrar,
  resolucaoInicial,
  proximaHref,
}: {
  questaoId: string;
  enunciado: string;
  payload: PayloadAtividade;
  tituloTipo: string;
  jaResolvidaAoEntrar: boolean;
  bloqueadaAoEntrar: boolean;
  resolucaoInicial: { resolucao: string | null; algumaCorreta: boolean } | null;
  proximaHref: string;
}) {
  const [estado, acao] = useActionState<EstadoResposta, FormData>(
    responderAtividadeInterativa.bind(null, questaoId),
    undefined
  );
  const respostaAtualRef = useRef<unknown>(null);
  const [pronto, setPronto] = useState(false);
  const [desbloqueado, setDesbloqueado] = useState<EstadoResposta>(undefined);
  const inicioRef = useRef<number>(0);
  useEffect(() => {
    inicioRef.current = Date.now();
  }, []);

  if (jaResolvidaAoEntrar && resolucaoInicial) {
    return (
      <div>
        <p className={`text-sm font-medium ${resolucaoInicial.algumaCorreta ? "text-valeedu-green-dark" : "text-slate-600"}`}>
          {resolucaoInicial.algumaCorreta ? "Você já acertou essa atividade." : "Você já usou as 3 tentativas desta atividade."}
        </p>
        {resolucaoInicial.resolucao && <p className="mt-2 text-sm text-slate-600">{resolucaoInicial.resolucao}</p>}
        <Link
          href={proximaHref}
          className="mt-5 inline-block rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
        >
          Próxima →
        </Link>
      </div>
    );
  }

  const estadoEfetivo = desbloqueado ?? estado;
  const revelado = estadoEfetivo?.mostrarResposta === true;
  const bloqueada = estadoEfetivo?.bloqueada === true || (estado === undefined && bloqueadaAoEntrar);

  function marcarPronto(resposta: unknown, completo: boolean) {
    respostaAtualRef.current = resposta;
    setPronto(completo);
  }

  if (bloqueada) {
    return <DesbloqueioSenha questaoId={questaoId} onDesbloqueado={setDesbloqueado} />;
  }

  if (revelado) {
    return (
      <div>
        <p className={`text-sm font-medium ${estadoEfetivo?.correta ? "text-valeedu-green-dark" : "text-slate-700"}`}>
          {estadoEfetivo?.correta ? "Correto! 🎉" : "Não foi dessa vez."}
        </p>
        {estadoEfetivo?.resolucao && <p className="mt-2 text-sm text-slate-600">{estadoEfetivo.resolucao}</p>}
        <Link
          href={proximaHref}
          className="mt-5 inline-block rounded-lg bg-valeedu-green px-4 py-2 text-sm font-medium text-white hover:bg-valeedu-green-dark"
        >
          Próxima →
        </Link>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        formData.set("respostaJson", JSON.stringify(respostaAtualRef.current));
        if (inicioRef.current > 0) formData.set("tempoMs", String(Date.now() - inicioRef.current));
        acao(formData);
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-valeedu-green">{tituloTipo}</p>
      <p className="mt-1 text-lg font-medium text-slate-900">{enunciado}</p>

      {payload.tipo === "ORDENACAO" && (
        <BlocoOrdenacao itens={payload.itens} onMudar={(ordem) => marcarPronto(ordem, true)} />
      )}
      {payload.tipo === "LIGAR_PARES" && (
        <BlocoLigarPares
          esquerda={payload.esquerda}
          direita={payload.direita}
          onMudar={(pares) => marcarPronto(pares, Object.keys(pares).length === payload.esquerda.length)}
        />
      )}
      {payload.tipo === "CLASSIFICACAO" && (
        <BlocoClassificacao
          categorias={payload.categorias}
          itens={payload.itens}
          onMudar={(classificacao) => marcarPronto(classificacao, Object.keys(classificacao).length === payload.itens.length)}
        />
      )}

      {estadoEfetivo?.erro && <p className="mt-3 text-sm text-red-600">{estadoEfetivo.erro}</p>}
      {estadoEfetivo?.dica && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          💡 <strong>Dica:</strong> {estadoEfetivo.dica}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">Tentativa {estado ? 4 - estado.tentativasRestantes : 1} de 3</p>
      <BotaoResponder texto="Responder" habilitado={pronto || payload.tipo === "ORDENACAO"} />
    </form>
  );
}
