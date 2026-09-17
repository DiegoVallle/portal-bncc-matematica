// Conteúdo do piloto da Trilha de Alfabetização — 3 níveis escolhidos pra
// cobrir os 3 padrões de interação da trilha inteira, mesmo espírito do
// piloto de 3 habilidades da trilha de Matemática (Fase 2 de lá):
//   1) CONSCIENCIA_RIMA — oral + clique, nenhuma letra na tela.
//   2) CORRESPONDENCIA_VOGAIS — letra na tela, clique (ouve o som, aponta a letra).
//   3) PALAVRAS_SIMPLES — leitura em voz alta com STT (o diferencial da trilha).
// As 7 habilidades intermediárias (silábica, fonêmica, consoantes, sílabas)
// ficam para o rollout completo — não fazem parte deste piloto.

import type { NivelFonico } from "../../src/lib/alfabetizacao";
import type { TipoAtividadeFonica } from "../../src/lib/fonica";

export type AtividadeFonicaSeed = {
  tipo: TipoAtividadeFonica;
  instrucaoAudio: string;
  alvoTexto: string;
  opcoes?: { texto: string; emoji: string }[];
  ordem: number;
};

export type ConteudoAlfabetizacaoSeed = {
  nivel: NivelFonico;
  objetivoAluno: string;
  instrucaoAudio: string;
  atividades: AtividadeFonicaSeed[];
};

export const ALFABETIZACAO_PILOTO: ConteudoAlfabetizacaoSeed[] = [
  {
    nivel: "CONSCIENCIA_RIMA",
    objetivoAluno: "Descobrir palavras que terminam com o mesmo som.",
    instrucaoAudio: "Vamos brincar de encontrar palavras que rimam!",
    atividades: [
      {
        tipo: "RIMA",
        instrucaoAudio: "Escute: GATO. Qual dessas palavras rima com GATO?",
        alvoTexto: "sapato",
        opcoes: [
          { texto: "sapato", emoji: "👞" },
          { texto: "cachorro", emoji: "🐶" },
          { texto: "bola", emoji: "⚽" },
        ],
        ordem: 1,
      },
      {
        tipo: "RIMA",
        instrucaoAudio: "Escute: PÃO. Qual dessas palavras rima com PÃO?",
        alvoTexto: "mão",
        opcoes: [
          { texto: "mão", emoji: "✋" },
          { texto: "sol", emoji: "☀️" },
          { texto: "flor", emoji: "🌸" },
        ],
        ordem: 2,
      },
      {
        tipo: "RIMA",
        instrucaoAudio: "Escute: FLOR. Qual dessas palavras rima com FLOR?",
        alvoTexto: "amor",
        opcoes: [
          { texto: "amor", emoji: "❤️" },
          { texto: "peixe", emoji: "🐟" },
          { texto: "casa", emoji: "🏠" },
        ],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "CORRESPONDENCIA_VOGAIS",
    objetivoAluno: "Reconhecer o som de cada vogal e apontar a letra certa.",
    instrucaoAudio: "Agora vamos ouvir o som de uma letra e descobrir qual é.",
    atividades: [
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /a/, como em ABELHA?",
        alvoTexto: "A",
        opcoes: [
          { texto: "A", emoji: "🅰️" },
          { texto: "O", emoji: "🅾️" },
          { texto: "I", emoji: "ℹ️" },
        ],
        ordem: 1,
      },
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /o/, como em OVO?",
        alvoTexto: "O",
        opcoes: [
          { texto: "O", emoji: "🅾️" },
          { texto: "U", emoji: "🔤" },
          { texto: "E", emoji: "🔡" },
        ],
        ordem: 2,
      },
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /i/, como em IGREJA?",
        alvoTexto: "I",
        opcoes: [
          { texto: "I", emoji: "ℹ️" },
          { texto: "A", emoji: "🅰️" },
          { texto: "U", emoji: "🔤" },
        ],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "PALAVRAS_SIMPLES",
    objetivoAluno: "Ler em voz alta palavras simples de duas sílabas.",
    instrucaoAudio: "Agora é sua vez de ler! Olhe a palavra e a figura, e leia bem alto.",
    atividades: [
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "BOLA",
        opcoes: [{ texto: "BOLA", emoji: "⚽" }],
        ordem: 1,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "SAPO",
        opcoes: [{ texto: "SAPO", emoji: "🐸" }],
        ordem: 2,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "CASA",
        opcoes: [{ texto: "CASA", emoji: "🏠" }],
        ordem: 3,
      },
    ],
  },
];
