// Atividades adicionais pros 10 níveis já existentes da Trilha de
// Alfabetização — 2 por nível, mesma disciplina de conteúdo do piloto/rollout
// (correção por texto normalizado, opções sem gabarito exposto, voz sempre
// mostrando a própria palavra/frase-alvo em `opcoes[0].texto`).
//
// Só ADICIONA atividades a um ConteudoAlfabetizacao que já existe — nunca cria
// nem apaga o nível em si. Isso é o que permite expandir os 3 níveis do
// piloto (que já têm tentativa real de aluno) sem tocar no histórico deles —
// ver prisma/seed-alfabetizacao-expandir.ts.

import type { AtividadeFonicaSeed } from "./alfabetizacao-pilot";
import type { NivelFonico } from "../../src/lib/alfabetizacao";

export const ALFABETIZACAO_EXPANSAO: { nivel: NivelFonico; atividades: AtividadeFonicaSeed[] }[] = [
  {
    nivel: "CONSCIENCIA_RIMA",
    atividades: [
      {
        tipo: "RIMA",
        instrucaoAudio: "Escute: ANEL. Qual dessas palavras rima com ANEL?",
        alvoTexto: "papel",
        opcoes: [
          { texto: "papel", emoji: "📄" },
          { texto: "gato", emoji: "🐱" },
          { texto: "mesa", emoji: "🪑" },
        ],
        ordem: 4,
      },
      {
        tipo: "RIMA",
        instrucaoAudio: "Escute: JANELA. Qual dessas palavras rima com JANELA?",
        alvoTexto: "panela",
        opcoes: [
          { texto: "panela", emoji: "🍲" },
          { texto: "livro", emoji: "📖" },
          { texto: "sapo", emoji: "🐸" },
        ],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "CONSCIENCIA_SILABICA",
    atividades: [
      {
        tipo: "SEGMENTACAO_SILABICA",
        instrucaoAudio: "Qual destas palavras tem três partes?",
        alvoTexto: "cachorro",
        opcoes: [
          { texto: "cachorro", emoji: "🐶" },
          { texto: "lua", emoji: "🌙" },
          { texto: "pé", emoji: "🦶" },
        ],
        ordem: 4,
      },
      {
        tipo: "SEGMENTACAO_SILABICA",
        instrucaoAudio: "Qual destas palavras tem duas partes?",
        alvoTexto: "casa",
        opcoes: [
          { texto: "casa", emoji: "🏠" },
          { texto: "abacaxi", emoji: "🍍" },
          { texto: "girafa", emoji: "🦒" },
        ],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "CONSCIENCIA_FONEMICA",
    atividades: [
      {
        tipo: "SOM_INICIAL",
        instrucaoAudio: "Escute: MALA. Qual destas palavras começa com o mesmo som?",
        alvoTexto: "macaco",
        opcoes: [
          { texto: "macaco", emoji: "🐵" },
          { texto: "rede", emoji: "🛏️" },
          { texto: "sapo", emoji: "🐸" },
        ],
        ordem: 4,
      },
      {
        tipo: "SOM_INICIAL",
        instrucaoAudio: "Escute: VACA. Qual destas palavras começa com o mesmo som?",
        alvoTexto: "vassoura",
        opcoes: [
          { texto: "vassoura", emoji: "🧹" },
          { texto: "tatu", emoji: "🦔" },
          { texto: "nuvem", emoji: "☁️" },
        ],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "CORRESPONDENCIA_VOGAIS",
    atividades: [
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /e/, como em ELEFANTE?",
        alvoTexto: "E",
        opcoes: [
          { texto: "E", emoji: "🔤" },
          { texto: "A", emoji: "🔤" },
          { texto: "O", emoji: "🔤" },
        ],
        ordem: 4,
      },
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /u/, como em UVA?",
        alvoTexto: "U",
        opcoes: [
          { texto: "U", emoji: "🔤" },
          { texto: "I", emoji: "🔤" },
          { texto: "O", emoji: "🔤" },
        ],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "CORRESPONDENCIA_CONSOANTES",
    atividades: [
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /n/, como em NUVEM?",
        alvoTexto: "N",
        opcoes: [
          { texto: "N", emoji: "🔤" },
          { texto: "F", emoji: "🔤" },
          { texto: "L", emoji: "🔤" },
        ],
        ordem: 4,
      },
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /s/, como em SAPO?",
        alvoTexto: "S",
        opcoes: [
          { texto: "S", emoji: "🔤" },
          { texto: "V", emoji: "🔤" },
          { texto: "M", emoji: "🔤" },
        ],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "SILABAS_SIMPLES",
    atividades: [
      {
        tipo: "LEITURA_SILABA",
        instrucaoAudio: "Leia esta sílaba em voz alta.",
        alvoTexto: "SO",
        opcoes: [{ texto: "SO", emoji: "🔤" }],
        ordem: 4,
      },
      {
        tipo: "LEITURA_SILABA",
        instrucaoAudio: "Leia esta sílaba em voz alta.",
        alvoTexto: "VU",
        opcoes: [{ texto: "VU", emoji: "🔤" }],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "PALAVRAS_SIMPLES",
    atividades: [
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "PATO",
        opcoes: [{ texto: "PATO", emoji: "🦆" }],
        ordem: 4,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "MALA",
        opcoes: [{ texto: "MALA", emoji: "🧳" }],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "ENCONTROS_E_DIGRAFOS",
    atividades: [
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "FLOR",
        opcoes: [{ texto: "FLOR", emoji: "🌸" }],
        ordem: 4,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "BANHO",
        opcoes: [{ texto: "BANHO", emoji: "🛁" }],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "PALAVRAS_COMPLEXAS",
    atividades: [
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "ELEFANTE",
        opcoes: [{ texto: "ELEFANTE", emoji: "🐘" }],
        ordem: 4,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "BICICLETA",
        opcoes: [{ texto: "BICICLETA", emoji: "🚲" }],
        ordem: 5,
      },
    ],
  },
  {
    nivel: "FRASES_E_TEXTOS",
    atividades: [
      {
        tipo: "LEITURA_FRASE",
        instrucaoAudio: "Leia este bilhete em voz alta.",
        alvoTexto: "LIGUE PARA A MAMÃE",
        opcoes: [{ texto: "LIGUE PARA A MAMÃE", emoji: "📞" }],
        ordem: 4,
      },
      {
        tipo: "LEITURA_FRASE",
        instrucaoAudio: "Leia esta instrução de montagem em voz alta.",
        alvoTexto: "ABRA A CAIXA COM CUIDADO",
        opcoes: [{ texto: "ABRA A CAIXA COM CUIDADO", emoji: "📦" }],
        ordem: 5,
      },
    ],
  },
];
