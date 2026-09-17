// Constantes e helpers da Trilha de Alfabetização — mesmo padrão de
// src/lib/trilha.ts (progressão/pré-requisito em constantes estáticas, não em
// coluna de banco).
//
// Diferença de fundo em relação à trilha de Matemática: ali a ordem agrupa
// habilidades BNCC já existentes em núcleos temáticos. Aqui a ordem É a
// própria progressão pedagógica (consciência fonológica → correspondência
// grafema-fonema → sílaba → palavra → frase), com poucos ramos paralelos —
// alfabetização inicial segue uma sequência de desenvolvimento bem mais
// linear que conteúdo de matemática do 7º ano. Público: 5-8 anos, ainda não
// alfabetizados, percurso único por nível (não separado por etapa BNCC —
// decisão de Diego, 2026-09-17).
//
// IMPORTANTE — confiabilidade dos códigos BNCC abaixo: os marcados
// `confianca: "verificado"` foram conferidos contra fonte oficial/curada
// (BNCC, Nova Escola). Os marcados `"a_confirmar"` são a melhor hipótese de
// mapeamento mas o código/redação exatos ainda não foram checados contra o
// texto oficial da BNCC — não usar para gerar conteúdo didático final sem
// confirmar antes.

export type ConfiancaBncc = "verificado" | "a_confirmar";

export type NivelFonico =
  | "CONSCIENCIA_RIMA"
  | "CONSCIENCIA_SILABICA"
  | "CONSCIENCIA_FONEMICA"
  | "CORRESPONDENCIA_VOGAIS"
  | "CORRESPONDENCIA_CONSOANTES"
  | "SILABAS_SIMPLES"
  | "PALAVRAS_SIMPLES"
  | "ENCONTROS_E_DIGRAFOS"
  | "PALAVRAS_COMPLEXAS"
  | "FRASES_E_TEXTOS";

export type NivelFonicoInfo = {
  nivel: NivelFonico;
  ordem: number;
  nome: string;
  descricao: string;
  // Sem letra ainda envolvida (níveis 1-3) vs. já com grafema (4 em diante) —
  // controla se a atividade pode usar STT de leitura ou só oralidade/clique.
  envolveLetra: boolean;
  codigosBncc: { codigo: string; descricao: string; confianca: ConfiancaBncc }[];
};

export const NIVEIS_FONICOS: NivelFonicoInfo[] = [
  {
    nivel: "CONSCIENCIA_RIMA",
    ordem: 1,
    nome: "Consciência de rima e aliteração",
    descricao:
      "Perceber e produzir palavras que rimam ou começam com o mesmo som, só na oralidade — nenhuma letra é mostrada ainda.",
    envolveLetra: false,
    codigosBncc: [
      {
        codigo: "EI03EF02",
        descricao: "Inventar brincadeiras cantadas, poemas e canções, criando rimas, aliterações e ritmos.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "CONSCIENCIA_SILABICA",
    ordem: 2,
    nome: "Segmentação e contagem de sílabas orais",
    descricao:
      "Bater palma/contar as partes orais de uma palavra falada (sem escrever), preparando o terreno pra noção de sílaba escrita.",
    envolveLetra: false,
    codigosBncc: [
      {
        codigo: "EF01LP06",
        descricao: "Segmentar oralmente palavras em sílabas.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "CONSCIENCIA_FONEMICA",
    ordem: 3,
    nome: "Identificação do som inicial e final de palavras",
    descricao:
      "Isolar o primeiro/último fonema de uma palavra falada, sem ainda associar a uma letra — o passo mais difícil da consciência fonológica antes da alfabetização formal.",
    envolveLetra: false,
    codigosBncc: [
      {
        // Confirmado: a redação oficial de EI03EF02 já inclui "aliterações"
        // (não só rima) — mesmo código do nível 1, aplicado aqui ao recorte
        // mais fino de aliteração/som inicial. A BNCC não separa os dois em
        // códigos distintos; a separação em níveis é escolha pedagógica
        // nossa, não da BNCC.
        codigo: "EI03EF02",
        descricao: "Inventar brincadeiras cantadas, poemas e canções, criando rimas, aliterações e ritmos.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "CORRESPONDENCIA_VOGAIS",
    ordem: 4,
    nome: "Correspondência grafema-fonema: vogais",
    descricao: "Primeira letra mostrada na tela: associar o som de cada vogal ao seu grafema.",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF01LP05",
        descricao: "Reconhecer o sistema de escrita alfabética como representação dos sons da fala.",
        confianca: "verificado",
      },
      {
        // Mais preciso que EF01LP05 pro tipo de atividade real deste nível
        // (ouve o som, aponta a letra) — EF01LP05 é o insight conceitual,
        // este é a habilidade aplicada.
        codigo: "EF01LP07",
        descricao: "Identificar fonemas e sua representação por letras.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "CORRESPONDENCIA_CONSOANTES",
    ordem: 5,
    nome: "Correspondência grafema-fonema: consoantes simples",
    descricao:
      "Consoantes de som contínuo e fácil discriminação primeiro (F, L, M, N, S, V), depois as demais — ordem de dificuldade fonética, não ordem alfabética.",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF01LP05",
        descricao: "Reconhecer o sistema de escrita alfabética como representação dos sons da fala.",
        confianca: "verificado",
      },
      {
        codigo: "EF01LP07",
        descricao: "Identificar fonemas e sua representação por letras.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "SILABAS_SIMPLES",
    ordem: 6,
    nome: "Leitura e formação de sílabas simples (consoante+vogal)",
    descricao: "Juntar o que já foi aprendido separado: ler e montar sílabas CV (ex: BA, LE, MI, SO, VU).",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF01LP02",
        descricao: "Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética.",
        confianca: "verificado",
      },
      {
        // Cobre o lado leitura/decodificação deste nível — EF01LP02 é escrita.
        codigo: "EF12LP01",
        descricao:
          "Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "PALAVRAS_SIMPLES",
    ordem: 7,
    nome: "Leitura e escrita de palavras dissílabas simples",
    descricao: "Palavras formadas por 2 sílabas CV (ex: BOLA, SAPO, CASA) — primeira leitura de voz alta com STT.",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF01LP02",
        descricao: "Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética.",
        confianca: "verificado",
      },
      {
        codigo: "EF12LP01",
        descricao:
          "Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "ENCONTROS_E_DIGRAFOS",
    ordem: 8,
    nome: "Encontros consonantais, vocálicos e dígrafos",
    descricao: "Casos mais irregulares/complexos: CH, LH, NH, encontros consonantais (PR, BL...) e ditongos.",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF02LP02",
        descricao: "Grafar palavras desconhecidas apoiando-se no som e na grafia de palavras familiares e/ou estáveis.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "PALAVRAS_COMPLEXAS",
    ordem: 9,
    nome: "Palavras polissílabas e ortografia irregular inicial",
    descricao: "Palavras com 3+ sílabas e primeiras irregularidades ortográficas do português (ex: X, S com som de Z).",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF02LP02",
        descricao: "Grafar palavras desconhecidas apoiando-se no som e na grafia de palavras familiares e/ou estáveis.",
        confianca: "verificado",
      },
      {
        codigo: "EF12LP01",
        descricao:
          "Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização.",
        confianca: "verificado",
      },
    ],
  },
  {
    nivel: "FRASES_E_TEXTOS",
    ordem: 10,
    nome: "Leitura de frases e pequenos textos com compreensão",
    descricao:
      "Primeira leitura fluente de frases curtas e microtextos do campo da vida cotidiana (listas, bilhetes, receitas curtas, convites), com pergunta simples de compreensão — gêneros escolhidos pra bater com a redação oficial de EF12LP04, não textos narrativos genéricos.",
    envolveLetra: true,
    codigosBncc: [
      {
        codigo: "EF12LP04",
        descricao:
          "Ler e compreender, em colaboração com os colegas e com a ajuda do professor ou já com certa autonomia, listas, agendas, calendários, avisos, convites, receitas, instruções de montagem (digitais ou impressos), dentre outros gêneros do campo da vida cotidiana, considerando a situação comunicativa e o tema/assunto do texto e relacionando sua forma de organização à sua finalidade.",
        confianca: "verificado",
      },
    ],
  },
];

// Sequência é essencialmente linear — só os 2 pares abaixo têm alguma
// liberdade de ordem entre si (vogais/consoantes podem ser praticados em
// paralelo antes de exigir os dois juntos na sílaba; o mesmo vale pra
// palavras complexas/frases, que dependem do mesmo alicerce mas não uma da
// outra). Ainda assim é recomendação, nunca bloqueio — mesmo princípio da
// trilha de matemática (PRE_REQUISITOS lá).
export const PRE_REQUISITOS_FONICOS: Record<NivelFonico, NivelFonico[]> = {
  CONSCIENCIA_RIMA: [],
  CONSCIENCIA_SILABICA: [],
  CONSCIENCIA_FONEMICA: ["CONSCIENCIA_RIMA", "CONSCIENCIA_SILABICA"],
  CORRESPONDENCIA_VOGAIS: ["CONSCIENCIA_FONEMICA"],
  CORRESPONDENCIA_CONSOANTES: ["CONSCIENCIA_FONEMICA"],
  SILABAS_SIMPLES: ["CORRESPONDENCIA_VOGAIS", "CORRESPONDENCIA_CONSOANTES"],
  PALAVRAS_SIMPLES: ["SILABAS_SIMPLES"],
  ENCONTROS_E_DIGRAFOS: ["PALAVRAS_SIMPLES"],
  PALAVRAS_COMPLEXAS: ["ENCONTROS_E_DIGRAFOS"],
  FRASES_E_TEXTOS: ["PALAVRAS_COMPLEXAS"],
};

export const ORDEM_FONICA: NivelFonico[] = [...NIVEIS_FONICOS]
  .sort((a, b) => a.ordem - b.ordem)
  .map((n) => n.nivel);

export function obterNivelFonico(nivel: NivelFonico): NivelFonicoInfo | undefined {
  return NIVEIS_FONICOS.find((n) => n.nivel === nivel);
}

export function obterPreRequisitosFonicos(nivel: NivelFonico): NivelFonico[] {
  return PRE_REQUISITOS_FONICOS[nivel] ?? [];
}

// Próximo nível na sequência (usado pra "Continuar" na tela de conclusão) —
// só ordem, não considera domínio. Mesma semântica de obterProximaHabilidade
// em trilha.ts.
export function obterProximoNivelFonico(nivel: NivelFonico): NivelFonico | null {
  const posicao = ORDEM_FONICA.indexOf(nivel);
  if (posicao === -1 || posicao === ORDEM_FONICA.length - 1) return null;
  return ORDEM_FONICA[posicao + 1];
}

// Níveis cujos códigos BNCC ainda precisam ser conferidos contra a fonte
// oficial antes de qualquer conteúdo final ser gerado a partir deles.
export function obterNiveisPendentesDeConfirmacao(): NivelFonicoInfo[] {
  return NIVEIS_FONICOS.filter((n) => n.codigosBncc.some((c) => c.confianca === "a_confirmar"));
}
