// Recursos visuais do roteiro de 72 aulas, produzidos por Diego/ChatGPT-Codex
// (ver docs/recursos-visuais/LEIA-ME-CLAUDE.md) — primeiro lote: 8 de 92
// catalogados pros Módulos 1-2. Só uso aqui os já `"status": "produzido"` em
// docs/recursos-visuais/catalogo-modulos-01-02.json; os outros 84 continuam
// como emoji/placeholder até serem entregues.
//
// Regras de integração do LEIA-ME-CLAUDE.md, respeitadas aqui: exibir cada
// arquivo inteiro (object-fit: contain, nunca esticar), alt="" pra decorativo
// (nenhuma destas imagens é opção de resposta — não precisam de nome
// acessível), nunca inferir fala a partir da imagem (a locução continua
// vindo só do texto no banco).

export type ImagemVisual = { src: string; largura: number; altura: number };

const MASCOTE_BOAS_VINDAS: ImagemVisual = { src: "/alfabetizacao/v2/mascotes-boas-vindas.png", largura: 1254, altura: 1254 };
const MASCOTE_ESCUTA: ImagemVisual = { src: "/alfabetizacao/v2/mascotes-escuta.png", largura: 1254, altura: 1254 };
const MASCOTE_SUCESSO: ImagemVisual = { src: "/alfabetizacao/v2/mascotes-sucesso.png", largura: 1254, altura: 1254 };
const MASCOTE_TENTAR_NOVAMENTE: ImagemVisual = { src: "/alfabetizacao/v2/mascotes-tentar-novamente.png", largura: 1254, altura: 1254 };
const MEDALHA_MODULO: ImagemVisual = { src: "/alfabetizacao/v2/medalha-modulo.png", largura: 1254, altura: 1254 };
const TAMBOR_MADEIRA: ImagemVisual = { src: "/alfabetizacao/v2/tambor-madeira.png", largura: 1254, altura: 1254 };
const CESTA_VAZIA: ImagemVisual = { src: "/alfabetizacao/v2/cesta-vazia.png", largura: 1254, altura: 1254 };

export type MascoteEstado = "BOAS_VINDAS" | "ESCUTA" | "SUCESSO" | "TENTAR_NOVAMENTE";

export const MASCOTE_POR_ESTADO: Record<MascoteEstado, ImagemVisual> = {
  BOAS_VINDAS: MASCOTE_BOAS_VINDAS,
  ESCUTA: MASCOTE_ESCUTA,
  SUCESSO: MASCOTE_SUCESSO,
  TENTAR_NOVAMENTE: MASCOTE_TENTAR_NOVAMENTE,
};

// (aula, bloco) → ícone temático que substitui a palma genérica do
// CONTADOR_TOQUES. Só a Aula 1 Bloco 2 tem imagem própria (o tambor é
// especificamente "a bateria de madeira do Tuto" dessa aula) — as outras
// aulas usam CONTADOR_TOQUES pra contar palavra/sílaba, sem objeto físico
// equivalente catalogado ainda.
const ICONE_TOQUE_POR_BLOCO: Record<string, ImagemVisual> = {
  "1-2": TAMBOR_MADEIRA,
};

// (aula, bloco) → imagem decorativa acima da instrução (mesmo objeto/cesta
// usado em mais de uma aula, per catalogo-modulos-01-02.json).
const DECORACAO_POR_BLOCO: Record<string, ImagemVisual> = {
  "1-3": CESTA_VAZIA,
  "2-2": CESTA_VAZIA,
  "3-2": CESTA_VAZIA,
};

export function obterIconeToque(numeroAula: number, ordemBloco: number): ImagemVisual | null {
  return ICONE_TOQUE_POR_BLOCO[`${numeroAula}-${ordemBloco}`] ?? null;
}

export function obterDecoracaoBloco(numeroAula: number, ordemBloco: number): ImagemVisual | null {
  return DECORACAO_POR_BLOCO[`${numeroAula}-${ordemBloco}`] ?? null;
}

// Medalha exibida na tela de "aula concluída" — catálogo marca só Aulas 4 e
// 8 como checkpoints com medalha por enquanto.
export function obterMedalhaSeAplicavel(numeroAula: number): ImagemVisual | null {
  return numeroAula === 4 || numeroAula === 8 ? MEDALHA_MODULO : null;
}
