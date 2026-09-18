// Conteúdo real das Aulas 01-08 (Módulo 1 — Consciência Fonológica) do
// roteiro de 72 aulas (docs/SISTEMA_ALFABETIZACAO_SPEC.md).
//
// Fatia vertical deliberada: 1 atividade por bloco (4 por aula), não a
// densidade completa de 15 minutos do roteiro original — o objetivo desta
// rodada é provar o pipeline Aula→Bloco→Atividade→Tentativa→Progresso de
// ponta a ponta com as 3 mecânicas novas (clique-comparação, contador de
// toques, leitura/produção de voz), não entregar o Módulo 1 na densidade
// final. Aprofundar depois que o formato for validado com uso real.
//
// `semValidacao: true` marca produção oral não-verbal (imitar som de bicho,
// bater palma) — não dá pra validar via STT de fala; grava a tentativa e
// sempre celebra, mesmo espírito de outras simplificações documentadas no
// projeto (autoavaliação, dominio por cobertura).

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

export type AulaModulo01Seed = {
  numero: number;
  blocos: [BlocoAulaSeed, BlocoAulaSeed, BlocoAulaSeed, BlocoAulaSeed];
};

export const AULAS_MODULO_01: AulaModulo01Seed[] = [
  {
    numero: 1,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "O Som Oculto",
        instrucaoAudio: "Escute o som e toque no que fez esse barulho: CHUVA.",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute o som e toque no que fez esse barulho: CHUVA.",
          alvoTexto: "chuva",
          opcoes: [
            { texto: "chuva", emoji: "🌧️" },
            { texto: "sino", emoji: "🔔" },
            { texto: "cachorro", emoji: "🐶" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Bateria de Madeira do Tuto",
        instrucaoAudio: "Tuto vai bater o tambor. Escute e toque o tambor o mesmo número de vezes.",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Tuto bateu o tambor: TUM, TUM, TUM. Toque o tambor 3 vezes.",
          alvoTexto: "3",
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Fábrica Silenciosa",
        instrucaoAudio: "Qual destes é silencioso?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destes é silencioso: apito, buzina ou algodão?",
          alvoTexto: "algodão",
          opcoes: [
            { texto: "apito", emoji: "📯" },
            { texto: "buzina", emoji: "📢" },
            { texto: "algodão", emoji: "☁️" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Eco do Passarinho Piti",
        instrucaoAudio: "Imite o som de um cachorro no microfone.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Imite o som de um cachorro no microfone: AU AU!",
          alvoTexto: "au au",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 2,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Sons Iguais ou Diferentes",
        instrucaoAudio: "Você vai ouvir dois sinos. Eles são iguais ou diferentes?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Você ouviu dois sinos com o mesmo som. Eles são iguais ou diferentes?",
          alvoTexto: "iguais",
          opcoes: [
            { texto: "iguais", emoji: "✅" },
            { texto: "diferentes", emoji: "❌" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Caldeirão de Rimas",
        instrucaoAudio: "Escute: PATO. Qual destas palavras rima com PATO?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: PATO. Qual destas palavras rima com PATO?",
          alvoTexto: "sapato",
          opcoes: [
            { texto: "sapato", emoji: "👞" },
            { texto: "copo", emoji: "🥤" },
            { texto: "boneca", emoji: "🪆" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Ponte das Rimas",
        instrucaoAudio: "Escute: MÃO. Qual destas palavras rima com MÃO?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: MÃO. Qual destas palavras rima com MÃO?",
          alvoTexto: "pão",
          opcoes: [
            { texto: "pão", emoji: "🍞" },
            { texto: "sol", emoji: "☀️" },
            { texto: "flor", emoji: "🌸" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Qual é o Intruso?",
        instrucaoAudio: "SOL, CARACOL, BOLA. Fale a palavra que não rima.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Escute: SOL, CARACOL, BOLA. Fale a palavra que não rima com as outras.",
          alvoTexto: "bola",
        },
      },
    ],
  },
  {
    numero: 3,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Revisão de Rimas",
        instrucaoAudio: "Escute: GATO. Qual destas palavras rima?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: GATO. Qual destas palavras rima com GATO?",
          alvoTexto: "sapato",
          opcoes: [
            { texto: "sapato", emoji: "👞" },
            { texto: "mesa", emoji: "🪑" },
            { texto: "sol", emoji: "☀️" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Cesta dos Bichos",
        instrucaoAudio: "Qual destes bichos começa com o som /s/?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destes bichos começa com o som /s/, de SAPO?",
          alvoTexto: "sapo",
          opcoes: [
            { texto: "sapo", emoji: "🐸" },
            { texto: "gato", emoji: "🐱" },
            { texto: "urso", emoji: "🐻" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Trenzinho Fonológico",
        instrucaoAudio: "Qual destas palavras começa com o som /m/?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas palavras começa com o som /m/, de MALA?",
          alvoTexto: "mala",
          opcoes: [
            { texto: "mala", emoji: "🧳" },
            { texto: "sol", emoji: "☀️" },
            { texto: "pato", emoji: "🦆" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Disparo do Som Inicial",
        instrucaoAudio: "Fale uma palavra que comece com o som /f/.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Escute o som: /fff/. Agora fale uma palavra que comece com esse som.",
          alvoTexto: "",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 4,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Aliteração Rápida",
        instrucaoAudio: "Escute: SAPO. Qual destas palavras começa com o mesmo som?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: SAPO. Qual destas palavras começa com o mesmo som?",
          alvoTexto: "sol",
          opcoes: [
            { texto: "sol", emoji: "☀️" },
            { texto: "gato", emoji: "🐱" },
            { texto: "lua", emoji: "🌙" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Passos do Tuto",
        instrucaoAudio: "Escute a frase: O PATO NADA. Toque uma vez pra cada palavra.",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Escute a frase: O PATO NADA. Toque uma vez pra cada palavra que você ouvir.",
          alvoTexto: "3",
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Separador de Blocos",
        instrucaoAudio: "Quantas palavras tem a frase: A LUA É BELA?",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Escute a frase: A LUA É BELA. Toque uma vez pra cada palavra que você ouvir.",
          alvoTexto: "4",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Gravação Frasal Pausada",
        instrucaoAudio: "Fale a frase pausadamente: O PATO NADA.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale a frase pausadamente, palavra por palavra: O PATO NADA.",
          alvoTexto: "o pato nada",
        },
      },
    ],
  },
  {
    numero: 5,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Pulo das Palavras",
        instrucaoAudio: "Quantas palavras tem a frase: O SOL BRILHA?",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Escute a frase: O SOL BRILHA. Toque uma vez pra cada palavra.",
          alvoTexto: "3",
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Monstrinho das Sílabas",
        instrucaoAudio: "Quantos pedacinhos tem a palavra PIPOCA?",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Escute: PI-PO-CA. Toque uma vez pra cada pedacinho da palavra.",
          alvoTexto: "3",
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Cama Elástica do Piti",
        instrucaoAudio: "Quantas sílabas tem a palavra BOLO?",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Escute: BO-LO. Toque uma vez pra cada sílaba.",
          alvoTexto: "2",
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Palmas no Microfone",
        instrucaoAudio: "Bata palmas para MA-CA-CO: uma palma por sílaba.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Escute: MA-CA-CO. Bata uma palma pra cada sílaba, perto do microfone.",
          alvoTexto: "",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 6,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Classificação por Tamanho",
        instrucaoAudio: "Qual palavra tem 2 sílabas: CASA ou ABACAXI?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas palavras tem só 2 sílabas: CASA ou ABACAXI?",
          alvoTexto: "casa",
          opcoes: [
            { texto: "casa", emoji: "🏠" },
            { texto: "abacaxi", emoji: "🍍" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Máquina de Cortar Sílabas",
        instrucaoAudio: "SOLDADO sem SOL. O que sobra?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Se eu tenho SOLDADO e tiro o SOL, o que sobra?",
          alvoTexto: "dado",
          opcoes: [
            { texto: "dado", emoji: "🎲" },
            { texto: "gato", emoji: "🐱" },
            { texto: "sol", emoji: "☀️" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Inversão Silábica",
        instrucaoAudio: "LO-BO invertido forma qual palavra?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: LO-BO. Se eu inverter a ordem, qual palavra aparece?",
          alvoTexto: "bolo",
          opcoes: [
            { texto: "bolo", emoji: "🎂" },
            { texto: "lobo", emoji: "🐺" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Completar o Final",
        instrucaoAudio: "Escute: SA-PA... Complete a palavra e fale.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Escute: SA-PA... Complete a palavra e fale: SAPATO.",
          alvoTexto: "sapato",
        },
      },
    ],
  },
  {
    numero: 7,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Subtração Rápida",
        instrucaoAudio: "GALINHA sem GA. O que sobra?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Se eu tenho GALINHA e tiro o GA, o que sobra?",
          alvoTexto: "linha",
          opcoes: [
            { texto: "linha", emoji: "🧵" },
            { texto: "sol", emoji: "☀️" },
            { texto: "mesa", emoji: "🪑" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Espelho das Bocas",
        instrucaoAudio: "Escute o som /sss/, de serpente. Qual boquinha faz esse som?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute o som /sss/, de serpente. Qual boquinha está fazendo esse som?",
          alvoTexto: "boca_s",
          opcoes: [
            { texto: "boca_s", emoji: "👄" },
            { texto: "boca_m", emoji: "👄" },
            { texto: "boca_a", emoji: "👄" },
          ],
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Pescaria Fonêmica",
        instrucaoAudio: "A boca está fazendo /sss/. Qual palavra começa com esse som?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "A boca está fazendo /sss/. Qual destas palavras começa com esse som?",
          alvoTexto: "sapo",
          opcoes: [
            { texto: "sapo", emoji: "🐸" },
            { texto: "mala", emoji: "🧳" },
            { texto: "urso", emoji: "🐻" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Sustentação Vocal",
        instrucaoAudio: "Fale o som /sss/ bem longo, como uma serpente.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale o som /sss/ bem longo, como uma serpente.",
          alvoTexto: "",
          semValidacao: true,
        },
      },
    ],
  },
  {
    numero: 8,
    blocos: [
      {
        tipo: "AQUECIMENTO",
        titulo: "Circuito de Rimas",
        instrucaoAudio: "Escute: FLOR. Qual destas palavras rima?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Escute: FLOR. Qual destas palavras rima com FLOR?",
          alvoTexto: "amor",
          opcoes: [
            { texto: "amor", emoji: "❤️" },
            { texto: "gato", emoji: "🐱" },
            { texto: "sol", emoji: "☀️" },
          ],
        },
      },
      {
        tipo: "DISCRIMINACAO",
        titulo: "Labirinto Silábico",
        instrucaoAudio: "Quantas sílabas tem a palavra CACHORRO?",
        atividade: {
          tipo: "CONTADOR_TOQUES",
          instrucaoAudio: "Escute: CA-CHOR-RO. Toque uma vez pra cada sílaba.",
          alvoTexto: "3",
        },
      },
      {
        tipo: "CONSTRUCAO",
        titulo: "Baú dos Sons",
        instrucaoAudio: "Qual destas palavras começa com o som /a/?",
        atividade: {
          tipo: "CLIQUE_COMPARACAO",
          instrucaoAudio: "Qual destas palavras começa com o som /a/, de ABELHA?",
          alvoTexto: "abelha",
          opcoes: [
            { texto: "abelha", emoji: "🐝" },
            { texto: "mala", emoji: "🧳" },
            { texto: "sol", emoji: "☀️" },
          ],
        },
      },
      {
        tipo: "PRODUCAO_ORAL",
        titulo: "Abertura do Reino das Letras",
        instrucaoAudio: "Fale a palavra: ABELHA.",
        atividade: {
          tipo: "LEITURA_VOZ",
          instrucaoAudio: "Fale bem alto a palavra-chave: ABELHA.",
          alvoTexto: "abelha",
        },
      },
    ],
  },
];
