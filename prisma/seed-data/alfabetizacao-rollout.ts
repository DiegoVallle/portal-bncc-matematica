// Rollout dos 7 níveis restantes da Trilha de Alfabetização (os outros 3 —
// CONSCIENCIA_RIMA, CORRESPONDENCIA_VOGAIS, PALAVRAS_SIMPLES — são o piloto,
// ver alfabetizacao-pilot.ts). Mesmo formato, mesma disciplina de conteúdo:
// alvoTexto só existe pra corrigir a resposta (nunca é enviado ao client
// marcado como "a certa" antes de responder — ver page.tsx do [atividadeId]),
// e pra atividades de voz, alvoTexto é literalmente a palavra/frase mostrada
// em `opcoes[0].texto`, não um gabarito escondido.

import type { NivelFonico } from "../../src/lib/alfabetizacao";
import type { ConteudoAlfabetizacaoSeed } from "./alfabetizacao-pilot";

export const ALFABETIZACAO_ROLLOUT: ConteudoAlfabetizacaoSeed[] = [
  {
    nivel: "CONSCIENCIA_SILABICA" as NivelFonico,
    objetivoAluno: "Contar as partes de uma palavra batendo palma.",
    instrucaoAudio: "Vamos contar as partes das palavras batendo palma!",
    atividades: [
      {
        tipo: "SEGMENTACAO_SILABICA",
        instrucaoAudio: "Qual destas palavras tem duas partes? BO-LA tem duas. Escute e escolha.",
        alvoTexto: "bola",
        opcoes: [
          { texto: "bola", emoji: "⚽" },
          { texto: "abacaxi", emoji: "🍍" },
          { texto: "sol", emoji: "☀️" },
        ],
        ordem: 1,
      },
      {
        tipo: "SEGMENTACAO_SILABICA",
        instrucaoAudio: "Qual destas palavras tem quatro partes?",
        alvoTexto: "borboleta",
        opcoes: [
          { texto: "gato", emoji: "🐱" },
          { texto: "borboleta", emoji: "🦋" },
          { texto: "pé", emoji: "🦶" },
        ],
        ordem: 2,
      },
      {
        tipo: "SEGMENTACAO_SILABICA",
        instrucaoAudio: "Qual destas palavras tem só uma parte?",
        alvoTexto: "sol",
        opcoes: [
          { texto: "sol", emoji: "☀️" },
          { texto: "casa", emoji: "🏠" },
          { texto: "telefone", emoji: "📞" },
        ],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "CONSCIENCIA_FONEMICA" as NivelFonico,
    objetivoAluno: "Descobrir palavras que começam com o mesmo som.",
    instrucaoAudio: "Vamos descobrir palavras que começam com o mesmo som!",
    atividades: [
      {
        tipo: "SOM_INICIAL",
        instrucaoAudio: "Escute: BOLA. Qual destas palavras começa com o mesmo som?",
        alvoTexto: "boneca",
        opcoes: [
          { texto: "boneca", emoji: "🪆" },
          { texto: "gato", emoji: "🐱" },
          { texto: "sapo", emoji: "🐸" },
        ],
        ordem: 1,
      },
      {
        tipo: "SOM_INICIAL",
        instrucaoAudio: "Escute: CASA. Qual destas palavras começa com o mesmo som?",
        alvoTexto: "cavalo",
        opcoes: [
          { texto: "cavalo", emoji: "🐴" },
          { texto: "mesa", emoji: "🪑" },
          { texto: "livro", emoji: "📖" },
        ],
        ordem: 2,
      },
      {
        tipo: "SOM_INICIAL",
        instrucaoAudio: "Escute: PATO. Qual destas palavras começa com o mesmo som?",
        alvoTexto: "pipoca",
        opcoes: [
          { texto: "pipoca", emoji: "🍿" },
          { texto: "anel", emoji: "💍" },
          { texto: "sol", emoji: "☀️" },
        ],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "CORRESPONDENCIA_CONSOANTES" as NivelFonico,
    objetivoAluno: "Reconhecer o som de cada consoante e apontar a letra certa.",
    instrucaoAudio: "Agora vamos ouvir o som de uma consoante e descobrir qual letra é.",
    atividades: [
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /f/, como em FOCA?",
        alvoTexto: "F",
        opcoes: [
          { texto: "F", emoji: "🔤" },
          { texto: "L", emoji: "🔤" },
          { texto: "M", emoji: "🔤" },
        ],
        ordem: 1,
      },
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /l/, como em LUA?",
        alvoTexto: "L",
        opcoes: [
          { texto: "L", emoji: "🔤" },
          { texto: "M", emoji: "🔤" },
          { texto: "N", emoji: "🔤" },
        ],
        ordem: 2,
      },
      {
        tipo: "CORRESPONDENCIA_SOM_LETRA",
        instrucaoAudio: "Qual letra faz o som /m/, como em MALA?",
        alvoTexto: "M",
        opcoes: [
          { texto: "M", emoji: "🔤" },
          { texto: "S", emoji: "🔤" },
          { texto: "V", emoji: "🔤" },
        ],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "SILABAS_SIMPLES" as NivelFonico,
    objetivoAluno: "Ler sílabas formadas por consoante e vogal.",
    instrucaoAudio: "Agora é sua vez de ler sílabas em voz alta!",
    atividades: [
      {
        tipo: "LEITURA_SILABA",
        instrucaoAudio: "Leia esta sílaba em voz alta.",
        alvoTexto: "BA",
        opcoes: [{ texto: "BA", emoji: "🔤" }],
        ordem: 1,
      },
      {
        tipo: "LEITURA_SILABA",
        instrucaoAudio: "Leia esta sílaba em voz alta.",
        alvoTexto: "LE",
        opcoes: [{ texto: "LE", emoji: "🔤" }],
        ordem: 2,
      },
      {
        tipo: "LEITURA_SILABA",
        instrucaoAudio: "Leia esta sílaba em voz alta.",
        alvoTexto: "MI",
        opcoes: [{ texto: "MI", emoji: "🔤" }],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "ENCONTROS_E_DIGRAFOS" as NivelFonico,
    objetivoAluno: "Ler palavras com sons especiais como CH, LH, NH e encontros de consoantes.",
    instrucaoAudio: "Estas palavras têm sons especiais. Vamos ler em voz alta!",
    atividades: [
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "CHUVA",
        opcoes: [{ texto: "CHUVA", emoji: "🌧️" }],
        ordem: 1,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "GALINHA",
        opcoes: [{ texto: "GALINHA", emoji: "🐔" }],
        ordem: 2,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "PRATO",
        opcoes: [{ texto: "PRATO", emoji: "🍽️" }],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "PALAVRAS_COMPLEXAS" as NivelFonico,
    objetivoAluno: "Ler palavras maiores, com três sílabas ou mais.",
    instrucaoAudio: "Estas palavras são maiores. Vamos ler com calma!",
    atividades: [
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "BORBOLETA",
        opcoes: [{ texto: "BORBOLETA", emoji: "🦋" }],
        ordem: 1,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "TARTARUGA",
        opcoes: [{ texto: "TARTARUGA", emoji: "🐢" }],
        ordem: 2,
      },
      {
        tipo: "LEITURA_PALAVRA",
        instrucaoAudio: "Leia esta palavra em voz alta.",
        alvoTexto: "GIRASSOL",
        opcoes: [{ texto: "GIRASSOL", emoji: "🌻" }],
        ordem: 3,
      },
    ],
  },
  {
    nivel: "FRASES_E_TEXTOS" as NivelFonico,
    objetivoAluno: "Ler frases curtas do dia a dia, como listas e convites.",
    instrucaoAudio: "Agora vamos ler frases inteiras, como as que vemos no dia a dia!",
    atividades: [
      {
        tipo: "LEITURA_FRASE",
        instrucaoAudio: "Leia esta lista em voz alta.",
        alvoTexto: "PÃO E LEITE",
        opcoes: [{ texto: "PÃO E LEITE", emoji: "🛒" }],
        ordem: 1,
      },
      {
        tipo: "LEITURA_FRASE",
        instrucaoAudio: "Leia este convite em voz alta.",
        alvoTexto: "VENHA À FESTA",
        opcoes: [{ texto: "VENHA À FESTA", emoji: "🎉" }],
        ordem: 2,
      },
      {
        tipo: "LEITURA_FRASE",
        instrucaoAudio: "Leia esta receita em voz alta.",
        alvoTexto: "MISTURE O OVO",
        opcoes: [{ texto: "MISTURE O OVO", emoji: "🥣" }],
        ordem: 3,
      },
    ],
  },
];
