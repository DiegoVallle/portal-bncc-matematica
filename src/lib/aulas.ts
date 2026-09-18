// Trilha de Alfabetização v2 — roteiro de 72 aulas (docs/SISTEMA_ALFABETIZACAO_SPEC.md).
// Camada de organização acima de src/lib/alfabetizacao.ts — não substitui os
// 10 níveis/50 atividades existentes na base (ver nota grande em
// prisma/schema.prisma). Só os metadados das 72 aulas vivem aqui; o conteúdo
// real (blocos/atividades) só existe pras aulas já autoradas — ver
// prisma/seed-data/aulas-modulo-01.ts.

export type BlocoTipo = "AQUECIMENTO" | "DISCRIMINACAO" | "CONSTRUCAO" | "PRODUCAO_ORAL";
export type TipoAtividadeBloco = "CLIQUE_COMPARACAO" | "CONTADOR_TOQUES" | "LEITURA_VOZ" | "TRACADO_LETRA";

export const DURACAO_BLOCO_SEG: Record<BlocoTipo, number> = {
  AQUECIMENTO: 180,
  DISCRIMINACAO: 300,
  CONSTRUCAO: 240,
  PRODUCAO_ORAL: 180,
};

export const BLOCO_TIPO_LABELS: Record<BlocoTipo, string> = {
  AQUECIMENTO: "Aquecimento",
  DISCRIMINACAO: "Escutar com atenção",
  CONSTRUCAO: "Vamos construir",
  PRODUCAO_ORAL: "Sua vez de falar",
};

export type AulaInfo = {
  numero: number;
  modulo: number;
  titulo: string;
  focoPedagogico: string;
};

// Os 72 títulos do roteiro completo — só metadado (pra listagem/navegação).
// O conteúdo (blocos reais) só existe pro Módulo 1 por enquanto; as demais
// aulas aparecem na trilha como "em breve" até serem autoradas.
export const AULAS_TITULOS: AulaInfo[] = [
  // Módulo 1 — Consciência Fonológica
  { numero: 1, modulo: 1, titulo: "Sons do Ambiente e Ritmo", focoPedagogico: "Discriminar sons do ambiente e repetir ritmos." },
  { numero: 2, modulo: 1, titulo: "O Conceito de Rima", focoPedagogico: "Perceber finais sonoros parecidos." },
  { numero: 3, modulo: 1, titulo: "Aliteração (Sons Iniciais Iguais)", focoPedagogico: "Comparar o primeiro som de palavras faladas." },
  { numero: 4, modulo: 1, titulo: "Consciência de Palavras", focoPedagogico: "Segmentar uma frase falada em palavras." },
  { numero: 5, modulo: 1, titulo: "Consciência Silábica I", focoPedagogico: "Contar as sílabas de uma palavra falada." },
  { numero: 6, modulo: 1, titulo: "Consciência Silábica II", focoPedagogico: "Manipular e subtrair sílabas de palavras." },
  { numero: 7, modulo: 1, titulo: "Consciência Fonêmica Inicial", focoPedagogico: "Isolar o primeiro som de uma palavra falada." },
  { numero: 8, modulo: 1, titulo: "Checagem Lúdica da Consciência Fonológica", focoPedagogico: "Revisar rima, sílaba e som inicial." },
  // Módulo 2 — Vogais & Encontros Vocálicos
  { numero: 9, modulo: 2, titulo: "Fonema e Letra A", focoPedagogico: "Reconhecer e traçar a letra A." },
  { numero: 10, modulo: 2, titulo: "Fonema e Letra E (Aberto e Fechado)", focoPedagogico: "Reconhecer e traçar a letra E." },
  { numero: 11, modulo: 2, titulo: "Fonema e Letra I", focoPedagogico: "Reconhecer e traçar a letra I." },
  { numero: 12, modulo: 2, titulo: "Fonema e Letra O (Aberto e Fechado)", focoPedagogico: "Reconhecer e traçar a letra O." },
  { numero: 13, modulo: 2, titulo: "Fonema e Letra U", focoPedagogico: "Reconhecer e traçar a letra U." },
  { numero: 14, modulo: 2, titulo: "Síntese das 5 Vogais", focoPedagogico: "Consolidar o reconhecimento das 5 vogais." },
  { numero: 15, modulo: 2, titulo: "Encontros Vocálicos (Ditongos)", focoPedagogico: "Reconhecer ditongos comuns (AI, OU, AU, OI, UI)." },
  { numero: 16, modulo: 2, titulo: "O Som Nasal e a Terminação ÃO", focoPedagogico: "Reconhecer a nasalização e a terminação ÃO." },
  // Módulo 3 — Consoantes Contínuas & Sílabas CV
  { numero: 17, modulo: 3, titulo: "Fonema /m/ e Letra M", focoPedagogico: "Formar e ler sílabas com M." },
  { numero: 18, modulo: 3, titulo: "Fonema /v/ e Letra V", focoPedagogico: "Formar e ler sílabas com V." },
  { numero: 19, modulo: 3, titulo: "Formando Palavras Reais: M + V", focoPedagogico: "Combinar M e V em palavras reais." },
  { numero: 20, modulo: 3, titulo: "Fonema /f/ e Letra F", focoPedagogico: "Formar e ler sílabas com F." },
  { numero: 21, modulo: 3, titulo: "Fonema /l/ e Letra L", focoPedagogico: "Formar e ler sílabas com L." },
  { numero: 22, modulo: 3, titulo: "Fonema /s/ e Letra S (Sibilante Inicial)", focoPedagogico: "Formar e ler sílabas com S." },
  { numero: 23, modulo: 3, titulo: "Mini-História Lida I", focoPedagogico: "Ler e interpretar um texto curto com M, V, F, L, S." },
  { numero: 24, modulo: 3, titulo: "Fonema /z/ e Letra Z", focoPedagogico: "Formar e ler sílabas com Z." },
  { numero: 25, modulo: 3, titulo: "Fonema /n/ e Letra N", focoPedagogico: "Formar e ler sílabas com N." },
  { numero: 26, modulo: 3, titulo: "Fonema /r/ Forte Inicial", focoPedagogico: "Formar e ler sílabas com R inicial." },
  { numero: 27, modulo: 3, titulo: "Montagem Ativa de Vocabulário", focoPedagogico: "Praticar leitura e escrita com os sons contínuos." },
  { numero: 28, modulo: 3, titulo: "Consolidação das Consoantes Contínuas", focoPedagogico: "Revisar M, V, F, L, S, Z, N, R." },
  // Módulo 4 — Consoantes Oclusivas & Pares Mínimos
  { numero: 29, modulo: 4, titulo: "Fonema /p/ e Letra P", focoPedagogico: "Formar e ler sílabas com P." },
  { numero: 30, modulo: 4, titulo: "Fonema /b/ e Letra B", focoPedagogico: "Formar e ler sílabas com B." },
  { numero: 31, modulo: 4, titulo: "Par Mínimo P vs B", focoPedagogico: "Discriminar surda/sonora entre P e B." },
  { numero: 32, modulo: 4, titulo: "Fonema /t/ e Letra T", focoPedagogico: "Formar e ler sílabas com T." },
  { numero: 33, modulo: 4, titulo: "Fonema /d/ e Letra D", focoPedagogico: "Formar e ler sílabas com D." },
  { numero: 34, modulo: 4, titulo: "Par Mínimo T vs D", focoPedagogico: "Discriminar surda/sonora entre T e D." },
  { numero: 35, modulo: 4, titulo: "Fonema /k/ (Letras C e Q)", focoPedagogico: "Formar e ler sílabas com C/Q." },
  { numero: 36, modulo: 4, titulo: "Fonema /g/ (Letra G Gutural)", focoPedagogico: "Formar e ler sílabas com G." },
  { numero: 37, modulo: 4, titulo: "Par Mínimo C/K vs G", focoPedagogico: "Discriminar surda/sonora entre C e G." },
  { numero: 38, modulo: 4, titulo: "Construção e Mecânica da Frase", focoPedagogico: "Montar frases com sujeito, ação e objeto." },
  { numero: 39, modulo: 4, titulo: "Pequenas Histórias Narradas II", focoPedagogico: "Ler e interpretar um texto curto com as oclusivas." },
  { numero: 40, modulo: 4, titulo: "Conquista do Castelo Alfabético Simples", focoPedagogico: "Revisar todas as consoantes em padrão CV." },
  // Módulo 5 — Regularidades Ortográficas & Dígrafos
  { numero: 41, modulo: 5, titulo: "Fonema /ʒ/ e Letra J", focoPedagogico: "Formar e ler sílabas com J." },
  { numero: 42, modulo: 5, titulo: "O Som Suave do R (R Brando)", focoPedagogico: "Reconhecer o R fraco entre vogais." },
  { numero: 43, modulo: 5, titulo: "O Dígrafo RR", focoPedagogico: "Reconhecer o RR forte entre vogais." },
  { numero: 44, modulo: 5, titulo: "O Dígrafo SS", focoPedagogico: "Reconhecer o SS entre vogais." },
  { numero: 45, modulo: 5, titulo: "O S com Som de Z (Intervocálico)", focoPedagogico: "Reconhecer o S com som de Z entre vogais." },
  { numero: 46, modulo: 5, titulo: "A Família do C Suave (CE e CI)", focoPedagogico: "Reconhecer CE e CI com som de S." },
  { numero: 47, modulo: 5, titulo: "O Ç (Cedilha)", focoPedagogico: "Reconhecer o uso do Ç antes de A, O, U." },
  { numero: 48, modulo: 5, titulo: "O Dígrafo CH", focoPedagogico: "Reconhecer e ler palavras com CH." },
  { numero: 49, modulo: 5, titulo: "O Dígrafo LH", focoPedagogico: "Reconhecer e ler palavras com LH." },
  { numero: 50, modulo: 5, titulo: "O Dígrafo NH", focoPedagogico: "Reconhecer e ler palavras com NH." },
  { numero: 51, modulo: 5, titulo: "A Letra X e seus Sons Comuns", focoPedagogico: "Reconhecer e ler palavras com X." },
  { numero: 52, modulo: 5, titulo: "Leitura de Quadrinhos e Balões de Fala", focoPedagogico: "Ler tirinhas curtas com autonomia." },
  // Módulo 6 — Sílabas Complexas (CVC e CCV)
  { numero: 53, modulo: 6, titulo: "Sílabas Fechadas por R (AR, ER, IR, OR, UR)", focoPedagogico: "Ler sílabas travadas por R." },
  { numero: 54, modulo: 6, titulo: "Sílabas Fechadas por S (AS, ES, IS, OS, US)", focoPedagogico: "Ler sílabas travadas por S." },
  { numero: 55, modulo: 6, titulo: "Sílabas Fechadas por L (AL, EL, IL, OL, UL)", focoPedagogico: "Ler sílabas travadas por L." },
  { numero: 56, modulo: 6, titulo: "Sílabas Fechadas por M e N (AM, EM, IM, OM, UM)", focoPedagogico: "Ler sílabas nasais travadas." },
  { numero: 57, modulo: 6, titulo: "Encontros Consonantais com R (PR, TR, BR, CR, FR, GR, DR)", focoPedagogico: "Ler encontros consonantais com R." },
  { numero: 58, modulo: 6, titulo: "Prática Leitora com Encontros com R", focoPedagogico: "Consolidar a leitura de encontros com R." },
  { numero: 59, modulo: 6, titulo: "Encontros Consonantais com L (PL, BL, CL, FL, GL)", focoPedagogico: "Ler encontros consonantais com L." },
  { numero: 60, modulo: 6, titulo: "Palavras Polissílabas", focoPedagogico: "Ler palavras de 4 ou mais sílabas." },
  { numero: 61, modulo: 6, titulo: "Acentos Gráficos (Agudo e Circunflexo)", focoPedagogico: "Reconhecer acento agudo e circunflexo." },
  { numero: 62, modulo: 6, titulo: "Fluência de Leitura em Nível de Parágrafo", focoPedagogico: "Ler um parágrafo curto com fluência." },
  { numero: 63, modulo: 6, titulo: "Escrita Espontânea Interativa", focoPedagogico: "Escrever uma frase descrevendo uma cena." },
  { numero: 64, modulo: 6, titulo: "Desafio da Selva das Sílabas Complexas", focoPedagogico: "Revisar CVC, CCV e polissílabas." },
  // Módulo 7 — Fluência, Interpretação & Alfabetização Plena
  { numero: 65, modulo: 7, titulo: "Pontuação e Entonação I (Ponto Final e Vírgula)", focoPedagogico: "Respeitar ponto final e vírgula na leitura." },
  { numero: 66, modulo: 7, titulo: "Pontuação e Expressividade II (? e !)", focoPedagogico: "Ler com entonação de pergunta e exclamação." },
  { numero: 67, modulo: 7, titulo: "Gêneros Textuais Curtos (Bilhete e Lista)", focoPedagogico: "Ler e compreender bilhetes e listas." },
  { numero: 68, modulo: 7, titulo: "Interpretação de Texto: Informação Explícita", focoPedagogico: "Localizar informação explícita num texto." },
  { numero: 69, modulo: 7, titulo: "Interpretação de Texto: Inferências e Humor", focoPedagogico: "Inferir informação não explícita num texto." },
  { numero: 70, modulo: 7, titulo: "Pequena Produção Textual Guiada", focoPedagogico: "Escrever uma historinha curta guiada." },
  { numero: 71, modulo: 7, titulo: "Leitura Fluente de Livro Digital Ilustrado", focoPedagogico: "Ler um livro digital ilustrado com fluência." },
  { numero: 72, modulo: 7, titulo: "Avaliação Final de Alfabetização Plena & Formatura", focoPedagogico: "Avaliação final e celebração de conclusão." },
];

export function obterAulaInfo(numero: number): AulaInfo | undefined {
  return AULAS_TITULOS.find((a) => a.numero === numero);
}

export function obterProximaAula(numero: number): number | null {
  return numero < AULAS_TITULOS.length ? numero + 1 : null;
}

// Aulas com conteúdo real (blocos/atividades) já semeado — as demais
// aparecem na trilha como "em breve" até serem autoradas nas próximas fases.
export const NUMERO_ULTIMA_AULA_PRONTA = 16;
