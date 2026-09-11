import { AULAS_REVISADAS } from "@/content/aulas-revisadas";

/** Mantém a consulta coerente com a aula revisada nos conceitos que mudaram.
 * O banco original permanece intacto para preservar autoria e permitir comparação.
 */
export function materialConsulta(codigo: string, teoria: string, exemplo: string) {
  const revisadas = AULAS_REVISADAS[codigo];
  // Nestas habilidades, a revisão substitui definições/atalhos imprecisos da
  // versão anterior também na consulta, para não ensinar duas regras diferentes.
  const substituir = new Set(["EF07MA01", "EF07MA04", "EF07MA05", "EF07MA17", "EF07MA19", "EF07MA20", "EF07MA23", "EF07MA24", "EF07MA25", "EF07MA28", "EF07MA33", "EF07MA35", "EF07MA36"]);
  if (revisadas && substituir.has(codigo)) {
    return {
      teoria: revisadas.map(a => `## ${a.titulo}\n\n${a.teoria}`).join("\n\n"),
      exemplo: revisadas.map(a => `## Exemplo: ${a.titulo}\n\n${a.exemplo}`).join("\n\n"),
    };
  }
  return { teoria, exemplo };
}
