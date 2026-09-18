"use client";

// Motor reutilizável de traçado de letra — HTML5 Canvas nativo (sem
// dependência nova). Sistema de waypoints com detecção radial de 32px:
// a criança toca/arrasta o dedo, e cada nó da letra (em ordem) acende e
// emite um som curto quando o ponteiro passa dentro do raio de tolerância.
// Linha pontilhada guia mostra o caminho restante; a parte já traçada fica
// sólida e verde. Reset suave em caso de desvio — nunca uma mensagem de
// erro, a criança só continua tentando alcançar o próximo nó.
//
// Sem validação geométrica no servidor nesta fase — a própria mecânica
// (alcançar todos os nós em ordem, um a um) já é a "prova" de que o traçado
// foi tentado; mesmo nível de confiança já dado ao client em outras
// mecânicas desta trilha (ex: CONTADOR_TOQUES). Ver nota no schema.prisma.

import { useEffect, useMemo, useRef, useState } from "react";
import { obterWaypointsLetra, TAMANHO_CANVAS, type Ponto } from "@/lib/letras-tracado";

const RAIO_TOLERANCIA = 32;

function tocarNota(frequencia: number) {
  if (typeof window === "undefined") return;
  const AudioContextClasse = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClasse) return;
  const contexto = new AudioContextClasse();
  const oscilador = contexto.createOscillator();
  const volume = contexto.createGain();
  oscilador.type = "sine";
  oscilador.frequency.value = frequencia;
  volume.gain.setValueAtTime(0.15, contexto.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.25);
  oscilador.connect(volume);
  volume.connect(contexto.destination);
  oscilador.start();
  oscilador.stop(contexto.currentTime + 0.25);
}

function desenhar(
  ctx: CanvasRenderingContext2D,
  waypoints: Ponto[],
  indiceAtual: number,
  pontoAtual: Ponto | null
) {
  ctx.clearRect(0, 0, TAMANHO_CANVAS, TAMANHO_CANVAS);

  // Guia pontilhada — do próximo nó em diante.
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = indiceAtual; i < waypoints.length; i++) {
    const p = waypoints[i];
    if (i === indiceAtual) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Traço já feito — sólido, verde.
  ctx.setLineDash([]);
  ctx.strokeStyle = "#357a39";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (let i = 0; i <= indiceAtual && i < waypoints.length; i++) {
    const p = waypoints[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  if (pontoAtual && indiceAtual < waypoints.length) ctx.lineTo(pontoAtual.x, pontoAtual.y);
  ctx.stroke();

  // Nós.
  waypoints.forEach((p, i) => {
    ctx.beginPath();
    const alcancado = i < indiceAtual;
    const atual = i === indiceAtual;
    ctx.fillStyle = alcancado ? "#357a39" : atual ? "#1a4d80" : "#e2e8f0";
    const raio = atual ? 16 : 12;
    ctx.arc(p.x, p.y, raio, 0, Math.PI * 2);
    ctx.fill();
  });
}

export default function LetterTracer({
  letra,
  aoCompletar,
}: {
  letra: string;
  aoCompletar: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const desenhandoRef = useRef(false);
  const completouRef = useRef(false);
  const waypoints = useMemo(() => obterWaypointsLetra(letra) ?? [], [letra]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    desenhar(ctx, waypoints, indiceAtual, null);
  }, [indiceAtual, waypoints]);

  useEffect(() => {
    if (indiceAtual >= waypoints.length && waypoints.length > 0 && !completouRef.current) {
      completouRef.current = true;
      aoCompletar();
    }
  }, [indiceAtual, waypoints.length, aoCompletar]);

  function obterPontoRelativo(evento: React.PointerEvent<HTMLCanvasElement>): Ponto {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const escalaX = TAMANHO_CANVAS / rect.width;
    const escalaY = TAMANHO_CANVAS / rect.height;
    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY,
    };
  }

  function processarMovimento(ponto: Ponto) {
    if (indiceAtual >= waypoints.length) return;
    const alvo = waypoints[indiceAtual];
    const distancia = Math.hypot(ponto.x - alvo.x, ponto.y - alvo.y);
    if (distancia <= RAIO_TOLERANCIA) {
      tocarNota(440 + indiceAtual * 60);
      setIndiceAtual((i) => i + 1);
    } else {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) desenhar(ctx, waypoints, indiceAtual, ponto);
    }
  }

  if (waypoints.length === 0) {
    return <p className="text-sm text-amber-600">Traçado indisponível pra esta letra ainda.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={TAMANHO_CANVAS}
        height={TAMANHO_CANVAS}
        role="img"
        aria-label={`Área de traçado da letra ${letra}`}
        className="touch-none rounded-2xl border-2 border-valeedu-blue/20 bg-white shadow-sm"
        style={{ width: 260, height: 260 }}
        onPointerDown={(e) => {
          desenhandoRef.current = true;
          processarMovimento(obterPontoRelativo(e));
        }}
        onPointerMove={(e) => {
          if (!desenhandoRef.current) return;
          processarMovimento(obterPontoRelativo(e));
        }}
        onPointerUp={() => {
          desenhandoRef.current = false;
        }}
        onPointerLeave={() => {
          desenhandoRef.current = false;
        }}
      />
      <p className="text-xs text-slate-500">Toque e arraste seguindo os pontinhos.</p>
    </div>
  );
}
