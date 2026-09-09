// Parser do banco-conteudo-*-completo.md → estrutura para seed de Conteudo/QuestaoConteudo.
// Preserva o markdown original (inclusive escapes tipo \) \. \=) sem alterar o texto —
// esses escapes são markdown válido e serão desfeitos por qualquer renderizador de markdown.

import { readFileSync } from "node:fs";

export type ConteudoParsed = {
  codigo: string;
  titulo: string;
  teoria: string;
  exemploResolvido: string;
  exercicios: { enunciado: string; respostaEsperada: string | null; nivel: string }[];
  recursosVisuais: string[];
  notaImplementacao: string | null;
};

const NIVEL_HEADERS: [RegExp, string][] = [
  [/^\*\*Fáceis \(10\)\*\*$/, "FACIL"],
  [/^\*\*Médios \(10\)\*\*$/, "MEDIO"],
  [/^\*\*Nível apostila \/ tipo Anglo \(10\)\*\*$/, "APOSTILA"],
  [/^\*\*Desafios \(5, opcionais.*\)\*\*$/, "DESAFIO"],
];

// Extrai o enunciado e a resposta de uma linha "N. texto... *(resposta...\)*"
// (o fechamento pode vir como "\)*" ou ")*" — o documento não é consistente nisso).
function splitEnunciadoResposta(line: string): { enunciado: string; respostaEsperada: string } | null {
  const m = line.match(/^(\d+)\.\s+([\s\S]*?)\s*\*\(([\s\S]*?)\\?\)\*\s*$/);
  if (!m) return null;
  return { enunciado: m[2].trim(), respostaEsperada: m[3].trim() };
}

function parseNumberedBlock(block: string, nivel: string): ConteudoParsed["exercicios"] {
  const linhas = block.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: ConteudoParsed["exercicios"] = [];
  // Algumas habilidades (estatística) intercalam uma linha de contexto solta, tipo
  // "*(Tabela 1: pesquisa com 30 alunos ... )*", antes de um grupo de questões que
  // usam essa tabela. Como cada QuestaoConteudo é uma linha independente no banco,
  // dobra esse contexto para dentro do enunciado da(s) questão(ões) seguinte(s).
  let contextoPendente: string | null = null;
  for (const linha of linhas) {
    const contexto = linha.match(/^\*\(([\s\S]*?)\\?\)\*$/);
    if (contexto && !/^\d+\./.test(linha)) {
      contextoPendente = contexto[1].trim();
      continue;
    }
    const parsed = splitEnunciadoResposta(linha);
    if (!parsed) {
      throw new Error(`Linha não bateu com o padrão N. texto *(resposta)*: ${JSON.stringify(linha)}`);
    }
    const enunciado = contextoPendente ? `*(${contextoPendente})*\n\n${parsed.enunciado}` : parsed.enunciado;
    out.push({ enunciado, respostaEsperada: parsed.respostaEsperada, nivel });
  }
  return out;
}

// Remove (e retorna) uma eventual nota de implementação solta depois do A5,
// tipo "**Implementação no sistema:** ...". Não é parte da pergunta A5.
function extrairNotaImplementacao(block: string): { texto: string; nota: string | null } {
  const m = block.match(/([\s\S]*?)\n{2,}\*\*Implementação no sistema:\*\*\s*([\s\S]*)$/);
  if (!m) return { texto: block, nota: null };
  return { texto: m[1], nota: m[2].trim() };
}

function parseAvaliacao(blockRaw: string): { exercicios: ConteudoParsed["exercicios"]; nota: string | null } {
  const { texto: semNota, nota } = extrairNotaImplementacao(blockRaw);
  const texto = semNota.trim();
  // Divide em "A1. ...", "A2. ...", etc. — às vezes em uma linha só (com resposta inline),
  // às vezes em parágrafos separados sem nenhuma resposta (avaliação "sem correção na hora").
  const partes = texto.split(/(?=A\d+\.\s)/).map((p) => p.trim()).filter(Boolean);
  const out: ConteudoParsed["exercicios"] = [];
  for (const parte of partes) {
    const comResposta = parte.match(/^A\d+\.\s+([\s\S]*?)\s*\*\(([\s\S]*?)\\?\)\*\s*$/);
    if (comResposta) {
      out.push({ enunciado: comResposta[1].trim(), respostaEsperada: comResposta[2].trim(), nivel: "AVALIACAO" });
      continue;
    }
    const semResposta = parte.match(/^A\d+\.\s+([\s\S]*)$/);
    if (!semResposta) throw new Error(`Item de avaliação não bateu com o padrão: ${JSON.stringify(parte)}`);
    out.push({ enunciado: semResposta[1].trim(), respostaEsperada: null, nivel: "AVALIACAO" });
  }
  if (out.length !== 5) throw new Error(`Avaliação com ${out.length} itens em vez de 5: ${JSON.stringify(texto).slice(0, 200)}`);
  return { exercicios: out, nota };
}

export function parseTrilhaMarkdown(filePath: string): ConteudoParsed[] {
  const raw = readFileSync(filePath, "utf-8");
  const blocos = raw.split(/\n(?=## EF\d{2}MA\d{2})/).filter((b) => b.startsWith("## EF"));

  return blocos.map((bloco) => {
    const headerMatch = bloco.match(/^## (EF\d{2}MA\d{2}) — (.+)$/m);
    if (!headerMatch) throw new Error(`Cabeçalho de habilidade não encontrado em bloco: ${bloco.slice(0, 80)}`);
    const [, codigo, titulo] = headerMatch;

    const teoriaMatch = bloco.match(/### Teoria\n([\s\S]*?)\n### Exemplo resolvido/);
    const exemploMatch = bloco.match(/### Exemplo resolvido\n([\s\S]*?)\n### Banco de exercícios/);
    const bancoMatch = bloco.match(/### Banco de exercícios\n([\s\S]*?)\n### Avaliação final[^\n]*\n([\s\S]*?)(?:\n---|\n?$)/);

    if (!teoriaMatch) throw new Error(`${codigo}: seção Teoria não encontrada`);
    if (!exemploMatch) throw new Error(`${codigo}: seção Exemplo resolvido não encontrada`);
    if (!bancoMatch) throw new Error(`${codigo}: seção Banco de exercícios/Avaliação não encontrada`);

    const banco = bancoMatch[1];
    const avaliacaoTexto = bancoMatch[2];

    const exercicios: ConteudoParsed["exercicios"] = [];
    // Divide o banco de exercícios pelos cabeçalhos de nível, na ordem em que aparecem.
    const headerRegex = /^\*\*(Fáceis \(10\)|Médios \(10\)|Nível apostila \/ tipo Anglo \(10\)|Desafios \(5, opcionais[^*]*\))\*\*$/m;
    const partes = banco.split(headerRegex).slice(1); // [headerText, body, headerText, body, ...]
    for (let i = 0; i < partes.length; i += 2) {
      const headerText = `**${partes[i]}**`;
      const body = partes[i + 1];
      const nivelEntry = NIVEL_HEADERS.find(([re]) => re.test(headerText.trim()));
      if (!nivelEntry) throw new Error(`${codigo}: cabeçalho de nível não reconhecido: ${headerText}`);
      exercicios.push(...parseNumberedBlock(body, nivelEntry[1]));
    }
    const avaliacao = parseAvaliacao(avaliacaoTexto);
    exercicios.push(...avaliacao.exercicios);

    const teoria = teoriaMatch[1].trim();
    // Extrai as notas "*Ilustração: ...*" da teoria como recursos visuais estruturados.
    // Ficam mantidas no texto da teoria também (não removidas), só espelhadas aqui.
    const recursosVisuais = [...teoria.matchAll(/\*Ilustração: ([\s\S]*?)\*(?:\n|$)/g)].map((m) => m[1].trim());

    return {
      codigo,
      titulo: titulo.trim(),
      teoria,
      exemploResolvido: exemploMatch[1].trim(),
      exercicios,
      recursosVisuais,
      notaImplementacao: avaliacao.nota,
    };
  });
}
