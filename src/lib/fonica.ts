// Helpers da Trilha de Alfabetização — mesmo espírito de src/lib/trilha.ts
// (seleção/correção centralizadas aqui, não espalhadas pelas páginas).
//
// Interação por voz e por clique convivem no mesmo fluxo — ver
// TipoAtividadeFonica no schema. Correção de voz é sempre por comparação de
// TEXTO normalizado (nunca índice/posição), mesmo princípio já usado nas
// atividades interativas da trilha de matemática: a resposta certa nunca
// pode vazar na estrutura de dados antes de o aluno responder.

import type { NivelFonico } from "./alfabetizacao";

export type TipoAtividadeFonica =
  | "RIMA"
  | "SEGMENTACAO_SILABICA"
  | "SOM_INICIAL"
  | "CORRESPONDENCIA_SOM_LETRA"
  | "LEITURA_SILABA"
  | "MONTAR_PALAVRA"
  | "LEITURA_PALAVRA"
  | "LEITURA_FRASE";

// Atividades cujo tipo de resposta é clique/seleção entre opções pré-definidas.
export const TIPOS_ATIVIDADE_CLIQUE: TipoAtividadeFonica[] = [
  "RIMA",
  "SEGMENTACAO_SILABICA",
  "SOM_INICIAL",
  "CORRESPONDENCIA_SOM_LETRA",
  "MONTAR_PALAVRA",
];

// Atividades cujo tipo de resposta é falar em voz alta (STT). O aluno ainda
// não lê, então mesmo aqui a palavra/frase aparece na tela como apoio visual
// (grande, com ilustração) — o objetivo é a leitura em voz alta, não decorar
// texto que ele não consegue processar sozinho.
export const TIPOS_ATIVIDADE_VOZ: TipoAtividadeFonica[] = ["LEITURA_SILABA", "LEITURA_PALAVRA", "LEITURA_FRASE"];

export function ehAtividadeDeVoz(tipo: TipoAtividadeFonica): boolean {
  return TIPOS_ATIVIDADE_VOZ.includes(tipo);
}

// Normaliza texto pra comparação: minúsculas, sem acento, sem pontuação, sem
// espaços extras. Usado tanto pra corrigir clique (texto da opção) quanto
// transcrição de voz (o reconhecimento de fala não devolve acentos/pontuação
// de forma confiável em pt-BR).
export function normalizarTextoFonico(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function corrigirRespostaClique(alvoTexto: string, respostaClique: string): boolean {
  return normalizarTextoFonico(alvoTexto) === normalizarTextoFonico(respostaClique);
}

// Leitura em voz alta: comparação exata após normalização é intencionalmente
// rígida pro piloto — sem tolerância fonética/distância de edição ainda. Uma
// criança de 5-8 anos lendo "BOLA" como "bola." (com ponto final vindo do STT)
// já precisa passar; variações de pronúncia real (ex: "BOLA" reconhecido como
// "bola" vs "boola") ficam para quando houver dado real de uso — não estimar
// tolerância sem ouvir crianças reais primeiro.
export function corrigirLeituraVoz(alvoTexto: string, transcricaoVoz: string): boolean {
  return normalizarTextoFonico(alvoTexto) === normalizarTextoFonico(transcricaoVoz);
}

// Confiança mínima do reconhecimento de voz abaixo da qual tratamos a
// transcrição como "não deu pra ouvir direito" em vez de "errou" — evita
// punir a criança por ruído de microfone/ambiente. Web Speech API costuma
// devolver confidence baixo (às vezes 0 ou undefined) mesmo em transcrições
// corretas — por isso o valor é só um sinal auxiliar de UI, nunca decide
// certo/errado sozinho (ver corrigirLeituraVoz, que só olha o texto).
export const CONFIANCA_VOZ_MINIMA_CONFIAVEL = 0.5;

// Hash simples e determinístico (djb2-like) — usado pra embaralhar a ordem
// das opções de forma estável por atividade sem depender de Math.random()
// (Server Components precisam ser puros; o mesmo id sempre produz a mesma
// ordem, o que também torna a tela reproduzível em teste/debug).
export function hashDeterministico(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) | 0;
  }
  return h;
}

// Sequência de atividades dentro de um nível: por `ordem`, sem adaptação
// ainda (piloto). Mesma observação de trilha.ts: ponto único de ajuste
// quando a seleção adaptativa de verdade entrar (fora de escopo do piloto).
export function ordenarAtividadesFonicas<T extends { ordem: number }>(atividades: T[]): T[] {
  return [...atividades].sort((a, b) => a.ordem - b.ordem);
}

export const NIVEL_FONICO_LABELS: Record<NivelFonico, string> = {
  CONSCIENCIA_RIMA: "Rimas",
  CONSCIENCIA_SILABICA: "Partes das palavras",
  CONSCIENCIA_FONEMICA: "Sons das palavras",
  CORRESPONDENCIA_VOGAIS: "Vogais",
  CORRESPONDENCIA_CONSOANTES: "Consoantes",
  SILABAS_SIMPLES: "Sílabas",
  PALAVRAS_SIMPLES: "Palavras",
  ENCONTROS_E_DIGRAFOS: "Sons especiais",
  PALAVRAS_COMPLEXAS: "Palavras grandes",
  FRASES_E_TEXTOS: "Frases",
};
