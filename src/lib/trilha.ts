// Constantes e helpers da Trilha de Conteúdo — mesmo padrão de src/lib/bncc.ts
// (label/cor/ordem em constantes estáticas, não em coluna de banco).
//
// Regras de sequência/pré-requisito/status ficam centralizadas aqui, não
// espalhadas pelas páginas — ponto único de ajuste quando o motor adaptativo
// entrar de verdade (ver plano: selecionarProximaQuestao, calcularEstadoHabilidade
// etc. também vivem aqui).

export type Nucleo = {
  letra: string;
  nome: string;
  codigos: string[];
};

// Ordem pedagógica recomendada (7 núcleos), transcrita do documento de revisão
// do banco de conteúdo. Serve só para agrupar/ordenar a aba "Trilha por ordem
// pedagógica" — os códigos BNCC continuam os mesmos no banco.
export const NUCLEOS: Nucleo[] = [
  {
    letra: "A",
    nome: "Números e operações",
    codigos: ["EF07MA01", "EF07MA03", "EF07MA04", "EF07MA08", "EF07MA10", "EF07MA11", "EF07MA12"],
  },
  {
    letra: "B",
    nome: "Razão, proporcionalidade e porcentagem",
    codigos: ["EF07MA09", "EF07MA17", "EF07MA02"],
  },
  {
    letra: "C",
    nome: "Estratégias de resolução (transversal)",
    codigos: ["EF07MA05", "EF07MA06", "EF07MA07"],
  },
  {
    letra: "D",
    nome: "Álgebra",
    codigos: ["EF07MA13", "EF07MA14", "EF07MA15", "EF07MA16", "EF07MA18"],
  },
  {
    letra: "E",
    nome: "Geometria e transformações",
    codigos: [
      "EF07MA19",
      "EF07MA20",
      "EF07MA21",
      "EF07MA22",
      "EF07MA23",
      "EF07MA24",
      "EF07MA25",
      "EF07MA26",
      "EF07MA27",
      "EF07MA28",
    ],
  },
  {
    letra: "F",
    nome: "Grandezas, medidas, volume, área e circunferência",
    codigos: ["EF07MA29", "EF07MA30", "EF07MA31", "EF07MA32", "EF07MA33"],
  },
  {
    letra: "G",
    nome: "Probabilidade e estatística",
    codigos: ["EF07MA34", "EF07MA35", "EF07MA36", "EF07MA37"],
  },
];

// Grafo de pré-requisitos (não uma cadeia rígida — cada habilidade lista as que
// pedagogicamente vêm antes dela). Núcleo C é transversal, sem pré-requisito.
// Isso é recomendação ("recomendamos concluir X antes"), nunca bloqueio: o
// professor sempre pode abrir qualquer habilidade.
export const PRE_REQUISITOS: Record<string, string[]> = {
  // A — Números e operações
  EF07MA01: [],
  EF07MA03: [],
  EF07MA04: ["EF07MA03"],
  EF07MA08: [],
  EF07MA10: ["EF07MA03", "EF07MA08"],
  EF07MA11: ["EF07MA04", "EF07MA08", "EF07MA10"],
  EF07MA12: ["EF07MA11"],
  // B — Razão, proporcionalidade e porcentagem
  EF07MA09: ["EF07MA08"],
  EF07MA17: ["EF07MA09"],
  EF07MA02: ["EF07MA09", "EF07MA17"],
  // C — Estratégias de resolução (transversal)
  EF07MA05: [],
  EF07MA06: [],
  EF07MA07: [],
  // D — Álgebra
  EF07MA13: [],
  EF07MA14: ["EF07MA13"],
  EF07MA15: ["EF07MA14"],
  EF07MA16: ["EF07MA15"],
  EF07MA18: ["EF07MA13", "EF07MA16"],
  // E — Geometria e transformações
  EF07MA19: [],
  EF07MA20: ["EF07MA19"],
  EF07MA21: ["EF07MA19"],
  EF07MA22: [],
  EF07MA23: [],
  EF07MA24: [],
  EF07MA25: ["EF07MA24"],
  EF07MA26: ["EF07MA24", "EF07MA25"],
  EF07MA27: ["EF07MA23", "EF07MA24"],
  EF07MA28: ["EF07MA26", "EF07MA27"],
  // F — Grandezas, medidas, volume, área e circunferência
  EF07MA29: [],
  EF07MA30: ["EF07MA29"],
  EF07MA31: ["EF07MA29"],
  EF07MA32: ["EF07MA31"],
  EF07MA33: ["EF07MA22", "EF07MA29"],
  // G — Probabilidade e estatística
  EF07MA34: [],
  EF07MA35: [],
  EF07MA36: ["EF07MA35"],
  EF07MA37: ["EF07MA02"],
};

// Sequência linear 1..37 (núcleos na ordem acima, códigos na ordem listada em
// cada núcleo) — usada só para exibição/ordenação, não para bloqueio.
export const ORDEM_PEDAGOGICA: string[] = NUCLEOS.flatMap((n) => n.codigos);

export function obterNucleoPorCodigo(codigo: string): Nucleo | undefined {
  return NUCLEOS.find((n) => n.codigos.includes(codigo));
}

export function obterOrdemPedagogica(codigo: string): number {
  const posicao = ORDEM_PEDAGOGICA.indexOf(codigo);
  return posicao === -1 ? -1 : posicao + 1;
}

export function obterPreRequisitos(codigo: string): string[] {
  return PRE_REQUISITOS[codigo] ?? [];
}

// Próxima habilidade na ordem pedagógica (usada pra "Continuar para próxima" na
// tela de conclusão). Não considera domínio nem pré-requisito — só sequência.
export function obterProximaHabilidade(codigo: string): string | null {
  const posicao = ORDEM_PEDAGOGICA.indexOf(codigo);
  if (posicao === -1 || posicao === ORDEM_PEDAGOGICA.length - 1) return null;
  return ORDEM_PEDAGOGICA[posicao + 1];
}

// --- Status de domínio (StatusDominio) — labels discretos pra UI ---
// Nunca mostrar o campo numérico `dominio` (0-1) direto pro aluno: é só
// telemetria interna, sem validade pedagógica ainda.
export const STATUS_LABELS: Record<string, string> = {
  NAO_INICIADO: "Não iniciada",
  DIAGNOSTICO: "Diagnóstico",
  EM_APRENDIZAGEM: "Em aprendizagem",
  EM_PRATICA: "Em prática",
  DOMINIO_PROVISORIO: "Em consolidação",
  DOMINADO: "Dominada",
  REVISAO: "Revisão recomendada",
  PRE_REQUISITO_PENDENTE: "Pré-requisito pendente",
};

export const STATUS_ICONES: Record<string, string> = {
  NAO_INICIADO: "○",
  DIAGNOSTICO: "◐",
  EM_APRENDIZAGEM: "●",
  EM_PRATICA: "●",
  DOMINIO_PROVISORIO: "◑",
  DOMINADO: "✓",
  REVISAO: "⟳",
  PRE_REQUISITO_PENDENTE: "△",
};

// --- Teoria em micro-blocos (fallback heurístico) ---
// `Conteudo.microBlocos` ainda não está curado pra nenhuma habilidade — até que
// esteja, quebra `teoriaBase` em blocos menores pra não despejar um markdown
// inteiro numa tela só. Nunca divide no meio de lista, tabela (alinhada por
// espaços ou "|") ou fórmula: um bloco "continuação" (curto, começando com
// marcador de lista/tabela) é sempre grudado no bloco anterior em vez de virar
// um card novo — na dúvida, agrupa mais, nunca corta errado.
export function microBlocosOuFallback(teoriaBase: string): string[] {
  const blocosBrutos = teoriaBase
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const blocos: string[] = [];
  for (const bloco of blocosBrutos) {
    const pareceContinuacao =
      blocos.length > 0 &&
      (/^[-•]\s/.test(bloco) || // item de lista
        /^\d+\.\s/.test(bloco) || // item de lista numerada
        /^\|/.test(bloco) || // linha de tabela markdown
        /\s{2,}\S+\s{2,}\S+/.test(bloco) || // tabela alinhada por espaços (ex: fatoração MDC/MMC)
        bloco.length < 40); // trecho curto demais pra ser um card próprio

    if (pareceContinuacao) {
      blocos[blocos.length - 1] = `${blocos[blocos.length - 1]}\n\n${bloco}`;
    } else {
      blocos.push(bloco);
    }
  }
  return blocos;
}

// --- Prática: ordenação e seleção de questões ---
// Ordem de dificuldade dentro da prática (avaliação final não entra aqui).
export const NIVEL_PRATICA_ORDEM = ["FACIL", "MEDIO", "APOSTILA", "DESAFIO"];

export const NIVEL_LABELS: Record<string, string> = {
  FACIL: "Fácil",
  MEDIO: "Médio",
  APOSTILA: "Apostila",
  DESAFIO: "Desafio",
  AVALIACAO: "Avaliação final",
};

export function ordenarQuestoesPratica<T extends { nivel: string; ordem: number }>(questoes: T[]): T[] {
  return [...questoes].sort((a, b) => {
    const na = NIVEL_PRATICA_ORDEM.indexOf(a.nivel);
    const nb = NIVEL_PRATICA_ORDEM.indexOf(b.nivel);
    if (na !== nb) return na - nb;
    return a.ordem - b.ordem;
  });
}

// Escolhe a próxima questão de prática ainda não resolvida (nenhuma tentativa
// correta e menos de 3 tentativas usadas). V1: simplesmente a próxima
// disponível na ordem fácil→médio→apostila→desafio — esse é o ponto de
// extensão pro motor adaptativo entrar depois (dificuldade, erro anterior,
// pré-requisito, revisão espaçada) sem reescrever a UI que consome esta função.
export function selecionarProximaQuestao(
  questoesOrdenadas: { id: string }[],
  resolvidas: Set<string>,
  apartirDe?: string
): string | null {
  const indiceAtual = apartirDe ? questoesOrdenadas.findIndex((q) => q.id === apartirDe) : -1;
  const candidatas = indiceAtual >= 0 ? questoesOrdenadas.slice(indiceAtual + 1) : questoesOrdenadas;
  const proxima = candidatas.find((q) => !resolvidas.has(q.id)) ?? questoesOrdenadas.find((q) => !resolvidas.has(q.id));
  return proxima?.id ?? null;
}

// --- Fase 4: atividades interativas (piloto) ---
// Formatos de atividade guardados em QuestaoConteudo.atividadeInterativa.
// Cada tipo carrega o gabarito completo (autorado, revisado por humano) — a
// tela de exercício nunca manda esse objeto inteiro pro client, só a versão
// "pública" (ver funções `paraCliente*` abaixo), sempre comparando por TEXTO
// (nunca índice/posição), pra não vazar a resposta certa no HTML da página.
export type AtividadeOrdenacao = { tipo: "ORDENACAO"; itens: string[] };
export type AtividadeLigarPares = { tipo: "LIGAR_PARES"; pares: { esquerda: string; direita: string }[] };
export type AtividadeClassificacao = {
  tipo: "CLASSIFICACAO";
  categorias: string[];
  itens: { texto: string; categoria: string }[];
};
export type AtividadeInterativa = AtividadeOrdenacao | AtividadeLigarPares | AtividadeClassificacao;

export const TIPO_ATIVIDADE_LABELS: Record<AtividadeInterativa["tipo"], string> = {
  ORDENACAO: "Coloque em ordem",
  LIGAR_PARES: "Ligue os pares",
  CLASSIFICACAO: "Classifique",
};

function embaralhar<T>(itens: T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Versão segura pra mandar ao client: nunca inclui a ordem/categoria/par
// corretos, só os textos embaralhados que o aluno vai reorganizar.
export function paraClienteAtividade(atividade: AtividadeInterativa) {
  if (atividade.tipo === "ORDENACAO") {
    return { tipo: "ORDENACAO" as const, itens: embaralhar(atividade.itens) };
  }
  if (atividade.tipo === "LIGAR_PARES") {
    return {
      tipo: "LIGAR_PARES" as const,
      esquerda: atividade.pares.map((p) => p.esquerda),
      direita: embaralhar(atividade.pares.map((p) => p.direita)),
    };
  }
  return {
    tipo: "CLASSIFICACAO" as const,
    categorias: atividade.categorias,
    itens: embaralhar(atividade.itens.map((i) => i.texto)),
  };
}

// Corrige no servidor comparando por texto contra o gabarito guardado —
// exige acerto total (sem nota parcial), igual ao padrão de múltipla escolha.
export function corrigirAtividadeInterativa(
  atividade: AtividadeInterativa,
  resposta: unknown
): boolean {
  if (atividade.tipo === "ORDENACAO") {
    const ordemEnviada = Array.isArray(resposta) ? (resposta as unknown[]) : null;
    if (!ordemEnviada || ordemEnviada.length !== atividade.itens.length) return false;
    return ordemEnviada.every((texto, i) => texto === atividade.itens[i]);
  }
  if (atividade.tipo === "LIGAR_PARES") {
    const mapa = resposta && typeof resposta === "object" ? (resposta as Record<string, unknown>) : null;
    if (!mapa) return false;
    return atividade.pares.every((p) => mapa[p.esquerda] === p.direita);
  }
  const mapa = resposta && typeof resposta === "object" ? (resposta as Record<string, unknown>) : null;
  if (!mapa) return false;
  return atividade.itens.every((i) => mapa[i.texto] === i.categoria);
}

// Política de seleção: prioriza uma atividade interativa ainda não resolvida
// depois de ~2 exercícios padrão resolvidos desde a última interativa — não é
// uma posição fixa (ex. "toda 3ª questão"), pra não travar quando a ordem
// virar adaptativa depois. `ordemResolucao` = ids na ordem cronológica em que
// cada questão foi resolvida (1ª tentativa correta ou 3ª tentativa esgotada).
export function selecionarProximaQuestaoComInterativas(
  questoesOrdenadas: { id: string; interativa: boolean }[],
  resolvidas: Set<string>,
  ordemResolucao: string[],
  apartirDe?: string
): string | null {
  const naoResolvidas = questoesOrdenadas.filter((q) => !resolvidas.has(q.id));
  if (naoResolvidas.length === 0) return null;

  let regularesDesdeUltimaInterativa = 0;
  for (let i = ordemResolucao.length - 1; i >= 0; i--) {
    const q = questoesOrdenadas.find((x) => x.id === ordemResolucao[i]);
    if (!q) continue;
    if (q.interativa) break;
    regularesDesdeUltimaInterativa++;
  }

  const interativasDisponiveis = naoResolvidas.filter((q) => q.interativa);
  if (interativasDisponiveis.length > 0 && regularesDesdeUltimaInterativa >= 2) {
    return interativasDisponiveis[0].id;
  }

  return selecionarProximaQuestao(questoesOrdenadas, resolvidas, apartirDe);
}

// --- Feedback progressivo de tentativa (até 3 por questão) ---
// Centraliza a regra: acerto revela resposta; erro nas tentativas 1 e 2 dá uma
// dica sem revelar o gabarito; erro na 3ª revela resposta e encerra tentativas.
export type FeedbackTentativa = {
  correta: boolean;
  tentativasRestantes: number;
  dica: string | null;
  mostrarResposta: boolean;
};

export function obterFeedbackTentativa(params: {
  correta: boolean;
  numeroTentativa: number; // 1, 2 ou 3 — a tentativa que acabou de ser respondida
  dicas: string[];
}): FeedbackTentativa {
  const { correta, numeroTentativa, dicas } = params;
  if (correta) {
    return { correta: true, tentativasRestantes: 0, dica: null, mostrarResposta: true };
  }
  const tentativasRestantes = Math.max(0, 3 - numeroTentativa);
  if (tentativasRestantes === 0) {
    return { correta: false, tentativasRestantes: 0, dica: null, mostrarResposta: true };
  }
  const dica = dicas[numeroTentativa - 1] ?? null;
  return { correta: false, tentativasRestantes, dica, mostrarResposta: false };
}

// --- Sondagem da origem da dificuldade (classificação de erro por distrator) ---
// Cada item de prática pode ter, em `QuestaoConteudo.errosProvaveis`, um mapa
// autorado à mão de "se o aluno escolheu ESTE distrator errado, o motivo
// provável é ESTE tipo de erro" (ver prisma/seed-data/gerar-alternativas-pilot-*.ts
// e o TipoErro do schema). Isso já era gerado e importado desde a Fase 2, mas
// nunca era lido de volta na hora de responder — o erro era só "certo/errado".
// `classificarErro` fecha esse laço: casa o texto da alternativa escolhida com
// `distratorTexto` e devolve o tipo de erro provável, se autorado. Não é uma
// certeza pedagógica — por isso sempre acompanha uma `confianca` (<1) e nunca
// decide sozinho nenhum status de domínio.
export type ErroProvavel = { tipoErro: string; distratorTexto: string };

// Confiança fixa da Fase 2.5: os distratores são autorados manualmente (não
// inferidos automaticamente), então a classificação é confiável quando bate,
// mas continua sendo uma hipótese pedagógica — não uma verificação formal do
// raciocínio do aluno. Ver `TentativaQuestaoConteudo.confiancaErro` no schema.
export const CONFIANCA_ERRO_AUTORADO = 0.75;

export function classificarErro(
  errosProvaveis: unknown,
  textoAlternativaEscolhida: string
): { tipoErro: string; confianca: number } | null {
  if (!Array.isArray(errosProvaveis)) return null;
  const encontrado = (errosProvaveis as ErroProvavel[]).find(
    (e) => e && typeof e.distratorTexto === "string" && e.distratorTexto === textoAlternativaEscolhida
  );
  return encontrado ? { tipoErro: encontrado.tipoErro, confianca: CONFIANCA_ERRO_AUTORADO } : null;
}

// Mensagem curta, em linguagem de aluno, pra cada tipo de erro provável —
// mostrada junto da dica progressiva quando a origem da dificuldade foi
// identificada. Não substitui a dica (que ajuda a resolver ESSA questão); ela
// nomeia o PADRÃO por trás do erro, que é o que interessa pro professor
// acompanhar ao longo do tempo (`ProgressoHabilidade.ultimoTipoErro`).
export const TIPO_ERRO_LABELS: Record<string, string> = {
  CONCEITO: "Conceito",
  PROCEDIMENTO: "Procedimento",
  CALCULO: "Cálculo",
  INTERPRETACAO: "Interpretação do enunciado",
  REPRESENTACAO: "Representação da resposta",
  PRE_REQUISITO: "Pré-requisito",
  ERRO_NAO_CLASSIFICADO: "Não identificado",
};

export const TIPO_ERRO_MENSAGENS: Record<string, string> = {
  CONCEITO: "Pode não ser conta — parece que o conceito por trás da questão ainda não ficou claro. Vale revisar a teoria antes de tentar de novo.",
  PROCEDIMENTO: "O caminho usado pra chegar na resposta parece não ser o certo pra esse tipo de questão. Repense os passos, não só a conta final.",
  CALCULO: "A ideia parece certa — o problema foi na conta. Refaça o cálculo com calma.",
  INTERPRETACAO: "Releia o enunciado com atenção: o que foi pedido pode ser diferente do que foi respondido.",
  REPRESENTACAO: "A forma de escrever/representar a resposta pode estar confundindo, mesmo que o raciocínio esteja certo.",
  PRE_REQUISITO: "Esse erro costuma aparecer quando um conteúdo anterior ainda não está firme. Pode valer revisar uma habilidade de base.",
};

// O banco de conteúdo original escapa pontuação em markdown (ex: "x \+ 5 \= 12\.")
// de forma inconsistente — às vezes escapa, às vezes não, mas nunca deveria
// aparecer o "\" literal na tela. Enunciado/resolução/gabarito são exibidos
// como texto simples (não markdown completo) nas telas de exercício/avaliação
// — não passam pelo ReactMarkdown usado em TeoriaCards — então precisam desse
// unescape manual antes de renderizar.
export function unescapeMarkdown(texto: string): string {
  return texto.replace(/\\([\\`*_{}[\]()#+\-.!>=|~])/g, "$1");
}

// --- Pontuação (placar pessoal, sem ranking) ---
// Pontos por nível de questão de trilha, só pra acerto verificado pelo
// servidor (correta=true e autoavaliada=false — nunca conta autorrelato da
// avaliação sem gabarito). Mostrado só como número absoluto pro próprio
// aluno, nunca comparado com outros.
export const PONTOS_POR_NIVEL: Record<string, number> = {
  FACIL: 10,
  MEDIO: 15,
  APOSTILA: 20,
  DESAFIO: 30,
  AVALIACAO: 25,
};

export function calcularScore(
  tentativasVerificadas: { correta: boolean; autoavaliada: boolean; nivel: string }[]
): number {
  return tentativasVerificadas
    .filter((t) => t.correta && !t.autoavaliada)
    .reduce((soma, t) => soma + (PONTOS_POR_NIVEL[t.nivel] ?? 0), 0);
}
