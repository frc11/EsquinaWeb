import type { Locale, ThreeLines } from "@/lib/i18n/types";

/**
 * Copy compartido entre secciones. Fuente única: Final.pdf (2026-08-13); la
 * variante en castellano la cerró Valentino (B4).
 *
 * Forma: **tres líneas visuales**, y cada línea es una lista de fragmentos,
 * porque el mockup marca la negrita por fragmento y no por línea completa
 * (línea 2 = «STAND OUT» en negrita + «WITH INTENTION.» normal;
 *  línea 3 = «WITH» normal + «IMPACT.» en negrita).
 *
 * Contrato de render: los fragmentos de una línea se separan con **un espacio**,
 * y ese espacio se emite fuera del elemento que aplica la negrita (para que su
 * avance no dependa del peso). El texto de cada fragmento no lleva espacios en
 * los extremos.
 *
 * **Los cortes son decisión de diseño en los dos idiomas.** No se parte por
 * ancho: la frase entra holgada en una línea a cualquier resolución de esta
 * ronda, así que si el corte no estuviera escrito acá, no habría corte. Medido a
 * 40 px: las tres líneas inglesas dan 500 / 546 / 260 y las castellanas
 * 587 / 541 / 279.
 *
 * El punto final va **adentro** de la negrita en los dos idiomas, igual que en
 * el mockup: `IMPACT.` y `IMPACTO.`
 */

export type { CopyFragment, CopyLine } from "@/lib/i18n/types";

export const HERO_LINES: ThreeLines = [
  [{ text: "IN A WORLD FULL OF NOISE," }],
  [{ text: "STAND OUT", bold: true }, { text: "WITH INTENTION." }],
  [{ text: "WITH" }, { text: "IMPACT.", bold: true }],
];

export const HERO_LINES_ES: ThreeLines = [
  [{ text: "EN UN MUNDO LLENO DE RUIDO," }],
  [{ text: "DESTACATE", bold: true }, { text: "CON INTENCIÓN." }],
  [{ text: "CON" }, { text: "IMPACTO.", bold: true }],
];

/**
 * La frase de la marca en el idioma activo. La consumen Hero y el Footer.
 *
 * Los dos renderizan las líneas con el **índice** como `key` y no con el texto.
 * No es un detalle de estilo: el texto cambia con el idioma, así que una `key`
 * derivada de él haría que React desmonte y vuelva a montar los `<p>` en cada
 * cambio — y los del Hero tienen animación de entrada, o sea que la frase se
 * reanimaría. El índice no cambia porque las dos variantes tienen exactamente
 * tres líneas, y el tipo `ThreeLines` lo garantiza en compilación.
 */
export function getHeroLines(locale: Locale): ThreeLines {
  return locale === "es" ? HERO_LINES_ES : HERO_LINES;
}
