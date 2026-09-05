import { UNIDADES_ORDEM, UNIDADE_LABELS } from "@/lib/bncc";

export interface RespostaComUnidade {
  correta: boolean;
  questao: { habilidade: { unidadeTematica: string } };
}

export interface DesempenhoUnidade {
  unidade: string;
  label: string;
  total: number;
  acertos: number;
  percentual: number;
}

export function desempenhoPorUnidade(respostas: RespostaComUnidade[]): DesempenhoUnidade[] {
  const contagem = new Map<string, { total: number; acertos: number }>();
  for (const unidade of UNIDADES_ORDEM) contagem.set(unidade, { total: 0, acertos: 0 });

  for (const resposta of respostas) {
    const unidade = resposta.questao.habilidade.unidadeTematica;
    const atual = contagem.get(unidade) ?? { total: 0, acertos: 0 };
    atual.total += 1;
    if (resposta.correta) atual.acertos += 1;
    contagem.set(unidade, atual);
  }

  return UNIDADES_ORDEM.map((unidade) => {
    const { total, acertos } = contagem.get(unidade)!;
    return {
      unidade,
      label: UNIDADE_LABELS[unidade],
      total,
      acertos,
      percentual: total > 0 ? Math.round((acertos / total) * 100) : 0,
    };
  });
}
