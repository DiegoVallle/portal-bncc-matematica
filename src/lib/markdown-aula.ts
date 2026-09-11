/** Normaliza apenas os escapes legados dentro de fórmulas. Não aceita HTML bruto. */
export function prepararMarkdownAula(texto: string): string {
  return texto
    .replace(/R\$/g, "R\\$")
    .replace(/\*Ilustração:[\s\S]*?\*(?=\s|$)/g, "")
    .replace(/(?<!\\)\${1,2}([^$]+)(?<!\\)\${1,2}/g, (formula) => formula
      .replace(/\\\\(?=[A-Za-z ])/g, "\\")
      .replace(/\\([=+_!<>])/g, "$1")
      .replace(/(?<!\\)%/g, "\\%"))
    .trim();
}
