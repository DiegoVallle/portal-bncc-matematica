// Conteúdo real das Aulas 09-16 (Módulo 2 — Vogais & Encontros Vocálicos) do
// roteiro de 72 aulas (docs/SISTEMA_ALFABETIZACAO_SPEC.md).
//
// Mesma fatia vertical do Módulo 1 (1 atividade por bloco) e mesmo motivo:
// provar o motor novo (TRACADO_LETRA, canvas de waypoints) de ponta a ponta
// antes de aprofundar densidade. Palavras/letras escolhidas pra bater com o
// catálogo de assets já planejado (docs/recursos-visuais/catalogo-modulos-01-02.json,
// aulas 9-16) — quando as artes chegarem, plugam sem mudar este arquivo.
//
// CONSTRUCAO usa TRACADO_LETRA pras 5 vogais (Aulas 9-13) e pro til (Aula 16,
// terminação ÃO) — ver src/lib/letras-tracado.ts pros waypoints disponíveis.

import type { BlocoTipo, TipoAtividadeBloco } from "../../src/lib/aulas";

export type AtividadeBlocoSeed = {
  tipo: TipoAtividadeBloco;
  instrucaoAudio: string;
  alvoTexto: string;
  opcoes?: { texto: string; emoji: string }[];
  semValidacao?: boolean;
};

export type BlocoAulaSeed = {
  tipo: BlocoTipo;
  titulo: string;
  instrucaoAudio: string;
  atividade: AtividadeBlocoSeed;
};

export type AulaModulo02Seed = {
  numero: number;
  blocos: [BlocoAulaSeed, BlocoAulaSeed, BlocoAulaSeed, BlocoAulaSeed];
};

export const AULAS_MODULO_02: AulaModulo02Seed[] = [
  {
    numero: 9,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Fruta do Alfabeto",
        instrucaoAudio: "Escute a palavra e toque na fruta: ABACAXI.",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute a palavra e toque na fruta: ABACAXI.",
          alvoTexto: "abacaxi",
          opcoes: [
            { texto: "abacaxi", emoji: "🍍" },
            { texto: "abelha", emoji: "🐝" },
            { texto: "anel", emoji: "💍" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Encontre a Letra A",
        instrucaoAudio: "Qual destas é a letra A?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas é a letra A?",
          alvoTexto: "A",
          opcoes: [
            { texto: "A", emoji: "🔤" },
            { texto: "E", emoji: "🔤" },
            { texto: "O", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado da Letra A",
        instrucaoAudio: "Vamos traçar a letra A! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar a letra A! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "A",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Boca Bem Aberta",
        instrucaoAudio: "Abra bem a boca e fale: A!",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Abra bem a boca e fale: A!",
          alvoTexto: "a",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 10,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Palavra com E",
        instrucaoAudio: "Escute a palavra e toque nela: PÉ.",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute a palavra e toque nela: PÉ.",
          alvoTexto: "pé",
          opcoes: [
            { texto: "pé", emoji: "🦶" },
            { texto: "café", emoji: "☕" },
            { texto: "mesa", emoji: "🪑" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Encontre a Letra E",
        instrucaoAudio: "Qual destas é a letra E?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas é a letra E?",
          alvoTexto: "E",
          opcoes: [
            { texto: "E", emoji: "🔤" },
            { texto: "A", emoji: "🔤" },
            { texto: "I", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado da Letra E",
        instrucaoAudio: "Vamos traçar a letra E! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar a letra E! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "E",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "E Aberto e Fechado",
        instrucaoAudio: "Fale bem alto: BEBÊ.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale bem alto: BEBÊ.",
          alvoTexto: "bebê",
        },
      },
    ],
  },
  {
    numero: 11,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Palavra com I",
        instrucaoAudio: "Escute a palavra e toque no esquilo: ESQUILO.",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute a palavra e toque no esquilo: ESQUILO.",
          alvoTexto: "esquilo",
          opcoes: [
            { texto: "esquilo", emoji: "🐿️" },
            { texto: "abelha", emoji: "🐝" },
            { texto: "sapo", emoji: "🐸" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Encontre a Letra I",
        instrucaoAudio: "Qual destas é a letra I?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas é a letra I?",
          alvoTexto: "I",
          opcoes: [
            { texto: "I", emoji: "🔤" },
            { texto: "U", emoji: "🔤" },
            { texto: "A", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado da Letra I",
        instrucaoAudio: "Vamos traçar a letra I! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar a letra I! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "I",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Grito do Iglu",
        instrucaoAudio: "Fale bem alto: IGLU.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale bem alto: IGLU.",
          alvoTexto: "iglu",
        },
      },
    ],
  },
  {
    numero: 12,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Palavra com O",
        instrucaoAudio: "Escute a palavra e toque na onça: ONÇA.",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute a palavra e toque na onça: ONÇA.",
          alvoTexto: "onça",
          opcoes: [
            { texto: "onça", emoji: "🐆" },
            { texto: "ovelha", emoji: "🐑" },
            { texto: "gato", emoji: "🐱" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Encontre a Letra O",
        instrucaoAudio: "Qual destas é a letra O?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas é a letra O?",
          alvoTexto: "O",
          opcoes: [
            { texto: "O", emoji: "🔤" },
            { texto: "U", emoji: "🔤" },
            { texto: "E", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado da Letra O",
        instrucaoAudio: "Vamos traçar a letra O! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar a letra O! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "O",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "O Aberto e Fechado",
        instrucaoAudio: "Fale bem alto: VOVÓ.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale bem alto: VOVÓ.",
          alvoTexto: "vovó",
        },
      },
    ],
  },
  {
    numero: 13,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Palavra com U",
        instrucaoAudio: "Escute a palavra e toque na uva: UVA.",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute a palavra e toque na uva: UVA.",
          alvoTexto: "uva",
          opcoes: [
            { texto: "uva", emoji: "🍇" },
            { texto: "urso", emoji: "🐻" },
            { texto: "sapo", emoji: "🐸" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Encontre a Letra U",
        instrucaoAudio: "Qual destas é a letra U?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas é a letra U?",
          alvoTexto: "U",
          opcoes: [
            { texto: "U", emoji: "🔤" },
            { texto: "O", emoji: "🔤" },
            { texto: "A", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado da Letra U",
        instrucaoAudio: "Vamos traçar a letra U! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar a letra U! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "U",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Rugido do Urso",
        instrucaoAudio: "Fale bem alto: URSO.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale bem alto: URSO.",
          alvoTexto: "urso",
        },
      },
    ],
  },
  {
    numero: 14,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Revisão: Encontre o A",
        instrucaoAudio: "Vamos revisar! Qual destas é a letra A?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Vamos revisar! Qual destas é a letra A?",
          alvoTexto: "A",
          opcoes: [
            { texto: "A", emoji: "🔤" },
            { texto: "E", emoji: "🔤" },
            { texto: "U", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Revisão: Encontre o U",
        instrucaoAudio: "Qual destas é a letra U?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas é a letra U?",
          alvoTexto: "U",
          opcoes: [
            { texto: "U", emoji: "🔤" },
            { texto: "I", emoji: "🔤" },
            { texto: "O", emoji: "🔤" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado Relâmpago",
        instrucaoAudio: "Vamos traçar de novo a letra E! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar de novo a letra E! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "E",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "As 5 Vogais",
        instrucaoAudio: "Fale as 5 vogais, uma por uma: A, E, I, O, U.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale as 5 vogais, uma por uma: A, E, I, O, U.",
          alvoTexto: "a e i o u",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 15,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Som AI",
        instrucaoAudio: "Escute: PAI. Qual destas palavras tem o som AI?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: PAI. Qual destas palavras tem o som AI?",
          alvoTexto: "pai",
          opcoes: [
            { texto: "pai", emoji: "👨" },
            { texto: "sol", emoji: "☀️" },
            { texto: "mesa", emoji: "🪑" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Som OI",
        instrucaoAudio: "Escute: BOI. Qual destas palavras tem o som OI?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: BOI. Qual destas palavras tem o som OI?",
          alvoTexto: "boi",
          opcoes: [
            { texto: "boi", emoji: "🐮" },
            { texto: "gato", emoji: "🐱" },
            { texto: "uva", emoji: "🍇" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Som UI",
        instrucaoAudio: "Escute: MUITO. Qual destas palavras tem o som UI?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: MUITO. Qual destas palavras tem o som UI?",
          alvoTexto: "muito",
          opcoes: [
            { texto: "muito", emoji: "🙌" },
            { texto: "casa", emoji: "🏠" },
            { texto: "pote", emoji: "🍯" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "O Latido com AU",
        instrucaoAudio: "O cachorro do Tuto tropeçou e latiu: imite no microfone!",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Imite o latido do cachorro no microfone: AU AU!",
          alvoTexto: "au au",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 16,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Termina com ÃO",
        instrucaoAudio: "Escute: PÃO. Qual destas palavras também termina com ÃO?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: PÃO. Qual destas palavras também termina com ÃO?",
          alvoTexto: "leão",
          opcoes: [
            { texto: "leão", emoji: "🦁" },
            { texto: "gato", emoji: "🐱" },
            { texto: "sino", emoji: "🔔" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Mais Palavras com ÃO",
        instrucaoAudio: "Escute: SABÃO. Qual destas palavras também termina com ÃO?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: SABÃO. Qual destas palavras também termina com ÃO?",
          alvoTexto: "balão",
          opcoes: [
            { texto: "balão", emoji: "🎈" },
            { texto: "mesa", emoji: "🪑" },
            { texto: "sapo", emoji: "🐸" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Traçado do Til",
        instrucaoAudio: "Vamos traçar o til que dá o som ÃO! Arraste o dedo seguindo os pontinhos.",
        atividade: {
          tipo: "TRACADO_LETRA",
          instrucaoAudio: "Vamos traçar o til que dá o som ÃO! Arraste o dedo seguindo os pontinhos.",
          alvoTexto: "~",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Palavra com o Som Nasal",
        instrucaoAudio: "Fale bem alto: MÃO.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale bem alto: MÃO.",
          alvoTexto: "mão",
        },
      },
    ],
  },
];
