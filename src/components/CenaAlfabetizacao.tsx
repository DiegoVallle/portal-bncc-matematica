import Image from "next/image";

import type { NivelFonico } from "@/lib/alfabetizacao";

// Uma cena própria por nível. Novos níveis precisam de uma escolha explícita.
export const CENAS_POR_NIVEL = {
  CONSCIENCIA_RIMA: "sons",
  CONSCIENCIA_SILABICA: "silabas-orais",
  CONSCIENCIA_FONEMICA: "fonemas",
  CORRESPONDENCIA_VOGAIS: "letras",
  CORRESPONDENCIA_CONSOANTES: "consoantes",
  SILABAS_SIMPLES: "silabas",
  PALAVRAS_SIMPLES: "leitura",
  ENCONTROS_E_DIGRAFOS: "encontros",
  PALAVRAS_COMPLEXAS: "palavras-complexas",
  FRASES_E_TEXTOS: "textos",
} satisfies Record<NivelFonico, string>;

export function cenaDoNivel(nivel: NivelFonico): string {
  return CENAS_POR_NIVEL[nivel];
}

export default function CenaAlfabetizacao({ nivel, compacta = false }: { nivel: NivelFonico; compacta?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-[#faf6e9] ${compacta ? "h-36 sm:h-44" : "aspect-[3/2]"}`}>
      <Image
        src={`/alfabetizacao/${cenaDoNivel(nivel)}.png`}
        alt=""
        fill
        sizes={compacta ? "(max-width: 640px) 100vw, 576px" : "(max-width: 640px) 100vw, 320px"}
        className="object-contain"
      />
    </div>
  );
}
