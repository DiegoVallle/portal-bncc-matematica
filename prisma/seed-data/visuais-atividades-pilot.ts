// Piloto de Fase 4 (visuais + atividades interativas) — EF07MA01/08/18, as
// mesmas 3 habilidades já convertidas pra múltipla escolha. Conteúdo curado
// por mim (não gerado direto de IA pro banco sem revisão); reversível — ver
// prisma/rollback-visuais-atividades-pilot.ts se precisar desfazer.

export const ilustracoes: Record<string, string> = {
  EF07MA01: `<svg viewBox="0 0 560 220" width="560" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <rect x="10" y="10" width="260" height="200" rx="16" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="140" y="38" fill="#1e3a8a" font-size="16" font-weight="700" text-anchor="middle">Múltiplos de 4</text>
  <g fill="#2563eb">
    <circle cx="40" cy="90" r="14"/><text x="40" y="95" fill="#fff" font-size="13" text-anchor="middle" font-weight="600">4</text>
    <circle cx="90" cy="90" r="14"/><text x="90" y="95" fill="#fff" font-size="13" text-anchor="middle" font-weight="600">8</text>
    <circle cx="140" cy="90" r="14"/><text x="140" y="95" fill="#fff" font-size="12" text-anchor="middle" font-weight="600">12</text>
    <circle cx="190" cy="90" r="14"/><text x="190" y="95" fill="#fff" font-size="12" text-anchor="middle" font-weight="600">16</text>
  </g>
  <text x="230" y="95" fill="#2563eb" font-size="22" font-weight="700">...</text>
  <text x="140" y="140" fill="#1e40af" font-size="13" text-anchor="middle">nunca acaba →</text>
  <path d="M 250 90 L 268 90" stroke="#2563eb" stroke-width="2" marker-end="url(#seta)"/>

  <rect x="290" y="10" width="260" height="200" rx="16" fill="#f0fdf4" stroke="#357a39" stroke-width="2"/>
  <text x="420" y="38" fill="#1a4d2e" font-size="16" font-weight="700" text-anchor="middle">Divisores de 12</text>
  <g fill="#357a39">
    <circle cx="320" cy="90" r="14"/><text x="320" y="95" fill="#fff" font-size="13" text-anchor="middle" font-weight="600">1</text>
    <circle cx="360" cy="90" r="14"/><text x="360" y="95" fill="#fff" font-size="13" text-anchor="middle" font-weight="600">2</text>
    <circle cx="400" cy="90" r="14"/><text x="400" y="95" fill="#fff" font-size="13" text-anchor="middle" font-weight="600">3</text>
    <circle cx="440" cy="90" r="14"/><text x="440" y="95" fill="#fff" font-size="12" text-anchor="middle" font-weight="600">4</text>
    <circle cx="480" cy="90" r="14"/><text x="480" y="95" fill="#fff" font-size="12" text-anchor="middle" font-weight="600">6</text>
    <circle cx="520" cy="90" r="14"/><text x="520" y="95" fill="#fff" font-size="11" text-anchor="middle" font-weight="600">12</text>
  </g>
  <rect x="308" y="76" width="228" height="28" rx="14" fill="none" stroke="#357a39" stroke-width="2" stroke-dasharray="3 3"/>
  <text x="420" y="140" fill="#1a4d2e" font-size="13" text-anchor="middle">lista fechada, para em 12</text>
</svg>`,

  EF07MA08: `<svg viewBox="0 0 400 220" width="400" height="220" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="30" fill="#334155" font-size="14" text-anchor="middle" font-weight="600">Comparando 3/4 e 5/8 — multiplicação cruzada</text>

  <text x="110" y="90" fill="#1a4d80" font-size="30" font-weight="700" text-anchor="middle">3</text>
  <line x1="90" y1="98" x2="130" y2="98" stroke="#1a4d80" stroke-width="2"/>
  <text x="110" y="125" fill="#1a4d80" font-size="30" font-weight="700" text-anchor="middle">4</text>

  <text x="290" y="90" fill="#357a39" font-size="30" font-weight="700" text-anchor="middle">5</text>
  <line x1="270" y1="98" x2="310" y2="98" stroke="#357a39" stroke-width="2"/>
  <text x="290" y="125" fill="#357a39" font-size="30" font-weight="700" text-anchor="middle">8</text>

  <line x1="130" y1="70" x2="270" y2="140" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>
  <line x1="130" y1="140" x2="270" y2="70" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>

  <text x="110" y="170" fill="#1a4d80" font-size="16" text-anchor="middle" font-weight="700">3×8=24</text>
  <text x="290" y="170" fill="#357a39" font-size="16" text-anchor="middle" font-weight="700">4×5=20</text>

  <rect x="60" y="185" width="280" height="26" rx="13" fill="#f0fdf4" stroke="#357a39"/>
  <text x="200" y="203" fill="#1a4d2e" font-size="13" text-anchor="middle" font-weight="600">24 &gt; 20 → 3/4 é maior</text>
</svg>`,

  EF07MA18: `<svg viewBox="0 0 400 240" width="400" height="240" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,sans-serif">
  <text x="200" y="26" fill="#334155" font-size="14" text-anchor="middle" font-weight="600">x + 3 = 10 — a balança fica sempre equilibrada</text>

  <polygon points="200,50 185,90 215,90" fill="#cbd5e1"/>
  <rect x="196" y="90" width="8" height="70" fill="#cbd5e1"/>
  <line x1="60" y1="70" x2="340" y2="70" stroke="#1a4d80" stroke-width="6" stroke-linecap="round"/>
  <circle cx="200" cy="70" r="6" fill="#0f3159"/>

  <line x1="60" y1="70" x2="60" y2="105" stroke="#1a4d80" stroke-width="2"/>
  <line x1="340" y1="70" x2="340" y2="105" stroke="#1a4d80" stroke-width="2"/>
  <path d="M 20 105 Q 60 135 100 105 Z" fill="#dbeafe" stroke="#1a4d80" stroke-width="2"/>
  <path d="M 300 105 Q 340 135 380 105 Z" fill="#f0fdf4" stroke="#357a39" stroke-width="2"/>

  <text x="60" y="122" fill="#1a4d80" font-size="20" font-weight="700" text-anchor="middle">x + 3</text>
  <text x="340" y="122" fill="#357a39" font-size="20" font-weight="700" text-anchor="middle">10</text>

  <rect x="150" y="170" width="8" height="70" fill="#cbd5e1" transform="translate(0,0)" opacity="0"/>
  <text x="200" y="200" fill="#64748b" font-size="12" text-anchor="middle">tirar 3 dos dois lados mantém o equilíbrio → x = 7</text>
</svg>`,
};

export const atividades: {
  questaoId: string;
  novoEnunciado?: string;
  atividadeInterativa:
    | { tipo: "CLASSIFICACAO"; categorias: string[]; itens: { texto: string; categoria: string }[] }
    | { tipo: "LIGAR_PARES"; pares: { esquerda: string; direita: string }[] }
    | { tipo: "ORDENACAO"; itens: string[] };
}[] = [
  {
    // EF07MA01 — questão TEXTO adormecida (nunca aparecia no pool de prática,
    // que só pega MULTIPLA_ESCOLHA ou atividadeInterativa) — reaproveitada aqui.
    questaoId: "cmtu6khmw0002gmuva7azgv9h",
    novoEnunciado: "Classifique cada número: ele é múltiplo de 4 ou divisor de 12?",
    atividadeInterativa: {
      tipo: "CLASSIFICACAO",
      categorias: ["Múltiplo de 4", "Divisor de 12"],
      itens: [
        { texto: "8", categoria: "Múltiplo de 4" },
        { texto: "3", categoria: "Divisor de 12" },
        { texto: "16", categoria: "Múltiplo de 4" },
        { texto: "6", categoria: "Divisor de 12" },
        { texto: "20", categoria: "Múltiplo de 4" },
        { texto: "2", categoria: "Divisor de 12" },
      ],
    },
  },
  {
    // EF07MA08 — reaproveita a 1ª questão de prática (comparação simples) pra
    // fixar as 4 ideias de fração ensinadas na aula.
    questaoId: "cmtu6kqk50080gmuvew3qzg5r",
    novoEnunciado: "Ligue cada ideia de fração ao exemplo que combina com ela.",
    atividadeInterativa: {
      tipo: "LIGAR_PARES",
      pares: [
        { esquerda: "Parte de um inteiro", direita: "3/4 de uma pizza" },
        { esquerda: "Resultado de divisão", direita: "3 chocolates para 4 crianças" },
        { esquerda: "Razão", direita: "3 bolinhas azuis para 4 vermelhas" },
        { esquerda: "Operador", direita: "3/4 de 40 alunos presentes" },
      ],
    },
  },
  {
    // EF07MA18 — mesma equação que já existia (3x + 7 = 25), agora em passos.
    questaoId: "cmtu6l2o000jogmuvuadvrtph",
    novoEnunciado: "Coloque em ordem os passos para resolver 3x + 7 = 25.",
    atividadeInterativa: {
      tipo: "ORDENACAO",
      itens: [
        "Começar com 3x + 7 = 25",
        "Subtrair 7 dos dois lados: 3x = 18",
        "Dividir os dois lados por 3: x = 6",
        "Conferir: 3×6 + 7 = 25 ✓",
      ],
    },
  },
];
