import type { DesempenhoUnidade } from "@/lib/relatorios";
import { UNIDADE_LABELS } from "@/lib/bncc";

type Nivel = "alto" | "medio" | "baixo";

function nivelDe(percentual: number): Nivel {
  if (percentual >= 80) return "alto";
  if (percentual >= 50) return "medio";
  return "baixo";
}

// Textos específicos por unidade temática e nível de domínio.
const TEXTOS_POR_UNIDADE: Record<string, Record<Nivel, string>> = {
  NUMEROS: {
    alto:
      "domina bem operações, frações, decimais e porcentagem — a base numérica está sólida.",
    medio:
      "tem uma base razoável em Números, mas ainda erra em operações, frações ou decimais. Vale reforçar cálculo mental e a leitura de frações e porcentagens no dia a dia.",
    baixo:
      "precisa reforçar Números com atenção: revise as quatro operações, frações, números decimais e porcentagem com exercícios práticos e frequentes.",
  },
  ALGEBRA: {
    alto: "resolve bem equações, sequências e expressões algébricas.",
    medio:
      "entende os conceitos de Álgebra, mas ainda hesita ao resolver equações ou identificar padrões em sequências. Praticar mais problemas com equações simples ajuda bastante.",
    baixo:
      "precisa de reforço em Álgebra: revise como resolver equações do 1º grau, como identificar padrões em sequências numéricas e como interpretar expressões algébricas.",
  },
  GEOMETRIA: {
    alto:
      "tem ótimo domínio de Geometria — reconhece figuras, ângulos e suas propriedades com segurança.",
    medio:
      "tem noções boas de Geometria, mas ainda troca conceitos de ângulos, figuras planas e espaciais. Praticar com desenhos, régua e transferidor ajuda a fixar melhor.",
    baixo:
      "precisa de mais prática em Geometria: revise nomes e propriedades das figuras, cálculo de ângulos e perímetro/área, sempre com apoio visual (desenhos, régua, transferidor).",
  },
  GRANDEZAS_MEDIDAS: {
    alto: "domina bem unidades de medida, conversões e cálculos de área, perímetro e volume.",
    medio:
      "entende as ideias de Grandezas e Medidas, mas ainda erra conversões de unidade ou cálculos de área e volume. Praticar problemas do dia a dia com medidas ajuda a fixar.",
    baixo:
      "precisa reforçar Grandezas e Medidas: revise conversões de unidades (comprimento, massa, capacidade, tempo) e as fórmulas de área, perímetro e volume.",
  },
  PROBABILIDADE_ESTATISTICA: {
    alto: "interpreta bem gráficos, tabelas e noções de probabilidade.",
    medio:
      "compreende gráficos e probabilidade básica, mas ainda tem dúvidas em cálculos de probabilidade ou na leitura de dados mais complexos. Praticar a leitura de diferentes tipos de gráfico ajuda.",
    baixo:
      "precisa de reforço em Probabilidade e Estatística: pratique a leitura de gráficos e tabelas, e o cálculo de probabilidade simples (casos favoráveis dividido por casos possíveis).",
  },
};

function headlineGeral(percentual: number, nome: string): string {
  if (percentual >= 80) {
    return `Excelente resultado, ${nome}! Você demonstrou domínio sólido do conteúdo deste bimestre.`;
  }
  if (percentual >= 60) {
    return `Bom resultado, ${nome}! Você já domina boa parte do conteúdo, com alguns pontos específicos para reforçar.`;
  }
  if (percentual >= 40) {
    return `Resultado mediano, ${nome}. Há vários pontos importantes para revisar antes de avançar com segurança.`;
  }
  return `${nome}, este resultado mostra que o conteúdo deste bimestre ainda não foi consolidado. Vale a pena revisar com calma, com ajuda do professor, antes de seguir em frente.`;
}

export interface ItemRelatorioUnidade {
  unidade: string;
  label: string;
  percentual: number;
  nivel: Nivel;
  texto: string;
}

export interface RelatorioDesempenho {
  headline: string;
  porUnidade: ItemRelatorioUnidade[];
  recomendacaoFinal: string;
}

export function gerarRelatorio(
  nomeAluno: string,
  percentualGeral: number,
  desempenho: DesempenhoUnidade[]
): RelatorioDesempenho {
  const primeiroNome = nomeAluno.trim().split(/\s+/)[0] || nomeAluno;

  const porUnidade: ItemRelatorioUnidade[] = desempenho
    .filter((d) => d.total > 0)
    .map((d) => {
      const nivel = nivelDe(d.percentual);
      const textoUnidade = TEXTOS_POR_UNIDADE[d.unidade]?.[nivel] ?? "";
      return {
        unidade: d.unidade,
        label: d.label,
        percentual: d.percentual,
        nivel,
        texto: `Em ${d.label} (${d.percentual}% de acerto), ${primeiroNome} ${textoUnidade}`,
      };
    })
    // pior desempenho primeiro, para destacar as dificuldades
    .sort((a, b) => a.percentual - b.percentual);

  const areasFracas = porUnidade.filter((u) => u.nivel === "baixo").map((u) => u.label);
  const areasMedias = porUnidade.filter((u) => u.nivel === "medio").map((u) => u.label);

  let recomendacaoFinal: string;
  if (areasFracas.length > 0) {
    recomendacaoFinal = `Recomendação: priorize a revisão de ${areasFracas.join(
      " e "
    )} antes das próximas avaliações — são os pontos que mais precisam de atenção agora.`;
  } else if (areasMedias.length > 0) {
    recomendacaoFinal = `Recomendação: continue praticando ${areasMedias.join(
      " e "
    )} para consolidar o que já está bom.`;
  } else {
    recomendacaoFinal =
      "Recomendação: continue com a rotina de estudos — o desempenho está consistente em todas as áreas avaliadas.";
  }

  return {
    headline: headlineGeral(percentualGeral, primeiroNome),
    porUnidade,
    recomendacaoFinal,
  };
}

// Texto voltado aos pais/responsáveis, para o relatório impresso: explica o que foi avaliado,
// o resultado e por que o reforço nas áreas de dificuldade é importante. Sempre com base
// nos dados reais do teste — nada aqui é inventado ou exagerado.
export function gerarMensagemResponsaveis(
  nomeAluno: string,
  anoEscolar: number,
  bimestre: number,
  percentualGeral: number,
  relatorio: RelatorioDesempenho
): string[] {
  const primeiroNome = nomeAluno.trim().split(/\s+/)[0] || nomeAluno;
  const paragrafos: string[] = [];

  paragrafos.push(
    `Este diagnóstico avalia as habilidades de Matemática previstas pela BNCC (Base Nacional Comum Curricular) para o ${anoEscolar}º ano, referentes ao ${bimestre}º bimestre. ${primeiroNome} respondeu a questões elaboradas especificamente para essas habilidades, o que permite identificar com precisão o que já está consolidado e o que ainda precisa de atenção.`
  );

  const areasFracas = relatorio.porUnidade.filter((u) => u.nivel === "baixo");
  const areasMedias = relatorio.porUnidade.filter((u) => u.nivel === "medio");

  let paragrafoResultado = `No geral, ${primeiroNome} acertou ${percentualGeral}% das questões deste bimestre.`;
  if (areasFracas.length > 0) {
    paragrafoResultado += ` As maiores dificuldades apareceram em ${areasFracas
      .map((u) => `${u.label} (${u.percentual}% de acerto)`)
      .join(" e ")}, o que indica que esses conceitos ainda não foram consolidados.`;
  }
  if (areasMedias.length > 0) {
    paragrafoResultado += ` Também há pontos de atenção em ${areasMedias
      .map((u) => `${u.label} (${u.percentual}% de acerto)`)
      .join(" e ")}: conceitos já compreendidos em parte, mas que ainda geram erros.`;
  }
  paragrafos.push(paragrafoResultado);

  if (areasFracas.length > 0 || areasMedias.length > 0) {
    paragrafos.push(
      `Esses conteúdos formam a base para os assuntos seguintes do ano letivo — em Matemática, cada habilidade costuma depender diretamente das anteriores. Uma dificuldade que não é resolvida agora tende a se acumular e dificultar a compreensão dos próximos tópicos. Um acompanhamento de reforço escolar, focado exatamente nas lacunas identificadas neste diagnóstico, ajuda a consolidar esses conceitos com calma e no ritmo de ${primeiroNome}, evitando que o problema cresça ao longo do ano.`
    );
  } else {
    paragrafos.push(
      `${primeiroNome} está com um desempenho sólido em todas as habilidades avaliadas neste bimestre. Para manter esse ritmo, recomendamos revisões periódicas e o acompanhamento do conteúdo das próximas etapas do ano letivo.`
    );
  }

  return paragrafos;
}

// --- Pontos de atenção específicos, por habilidade da BNCC ---
// Diferente do resumo por unidade temática (geral), aqui apontamos exatamente quais
// habilidades (ex: EF05MA03) tiveram erro, com a descrição oficial da BNCC, para que o
// relatório explique com precisão onde está a dificuldade — não apenas "Números" em geral.

export interface RespostaComHabilidade {
  correta: boolean;
  questao: {
    habilidade: {
      codigo: string;
      descricao: string;
      unidadeTematica: string;
    };
  };
}

export interface PontoAtencao {
  codigo: string;
  descricao: string;
  unidadeLabel: string;
  acertos: number;
  total: number;
  percentual: number;
  gravidade: "critico" | "atencao";
}

/**
 * Agrupa as respostas por habilidade e retorna apenas as habilidades com pelo menos
 * um erro, ordenadas da mais crítica (mais erros) para a menos crítica.
 */
export function gerarPontosAtencao(respostas: RespostaComHabilidade[]): PontoAtencao[] {
  const porHabilidade = new Map<
    string,
    { descricao: string; unidade: string; acertos: number; total: number }
  >();

  for (const r of respostas) {
    const h = r.questao.habilidade;
    const atual = porHabilidade.get(h.codigo) ?? {
      descricao: h.descricao,
      unidade: h.unidadeTematica,
      acertos: 0,
      total: 0,
    };
    atual.total += 1;
    if (r.correta) atual.acertos += 1;
    porHabilidade.set(h.codigo, atual);
  }

  return Array.from(porHabilidade.entries())
    .filter(([, v]) => v.acertos < v.total)
    .map(([codigo, v]) => ({
      codigo,
      descricao: v.descricao,
      unidadeLabel: UNIDADE_LABELS[v.unidade] ?? v.unidade,
      acertos: v.acertos,
      total: v.total,
      percentual: Math.round((v.acertos / v.total) * 100),
      gravidade: v.acertos === 0 ? ("critico" as const) : ("atencao" as const),
    }))
    .sort((a, b) => a.percentual - b.percentual || a.unidadeLabel.localeCompare(b.unidadeLabel));
}
