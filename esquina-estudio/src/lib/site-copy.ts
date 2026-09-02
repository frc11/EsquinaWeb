import type { CopyLines, Locale } from "@/lib/i18n/types";

/**
 * Copy compartido entre secciones. Fuente única: Final.pdf (2026-08-13); la
 * variante en castellano la cerró Valentino (B4) y **la reescribieron las
 * clientas en R2** (`docs/archivo/mockups/r2-trad-01.jpg` y `r2-trad-02.jpg`).
 *
 * Forma: **una entrada por línea visual**, y cada línea es una lista de
 * fragmentos, porque el mockup marca la negrita por fragmento y no por línea
 * completa (en inglés, línea 2 = «STAND OUT» en negrita + «WITH INTENTION.»
 * normal; línea 3 = «WITH» normal + «IMPACT.» en negrita).
 *
 * Contrato de render: los fragmentos de una línea se separan con **un espacio**,
 * y ese espacio se emite fuera del elemento que aplica la negrita (para que su
 * avance no dependa del peso). El texto de cada fragmento no lleva espacios en
 * los extremos.
 *
 * **Los cortes son decisión de diseño en los dos idiomas.** No se parte por
 * ancho: la frase entra holgada en una línea a cualquier resolución de esta
 * ronda, así que si el corte no estuviera escrito acá, no habría corte. Medido a
 * 40 px: las tres líneas inglesas dan 500 / 546 / 260.
 *
 * **Los dos idiomas ya NO tienen la misma cantidad de líneas** (R2): el
 * castellano pasó de tres a dos —el PDF pide «Destacá con intención. / Comunicá
 * con impacto.», sin el «En un mundo lleno de ruido»— y el inglés se queda en
 * tres. Por eso el tipo es `CopyLines`, de largo variable, y por eso `Hero`
 * tiene que ocuparse del `<p>` que se monta al pasar de castellano a inglés; ver
 * la nota de `CopyLines` en `i18n/types.ts`.
 *
 * Las mayúsculas son del sitio, no del PDF: el PDF anota la frase en caja baja y
 * el sitio la compone en versales, como las tres líneas inglesas. Las negritas
 * replican el patrón del inglés —la primera palabra de una línea y la última de
 * la otra—, y el punto final va **adentro** de la negrita: `IMPACT.` / `IMPACTO.`
 */

export type { CopyFragment, CopyLine } from "@/lib/i18n/types";

export const HERO_LINES: CopyLines = [
  [{ text: "IN A WORLD FULL OF NOISE," }],
  [{ text: "STAND OUT", bold: true }, { text: "WITH INTENTION." }],
  [{ text: "WITH" }, { text: "IMPACT.", bold: true }],
];

export const HERO_LINES_ES: CopyLines = [
  [{ text: "DESTACÁ", bold: true }, { text: "CON INTENCIÓN." }],
  [{ text: "COMUNICÁ CON" }, { text: "IMPACTO.", bold: true }],
];

/**
 * La frase de la marca en el idioma activo. La consumen Hero y el Footer.
 *
 * Los dos renderizan las líneas con el **índice** como `key` y no con el texto.
 * No es un detalle de estilo: el texto cambia con el idioma, así que una `key`
 * derivada de él haría que React desmonte y vuelva a montar **todos** los `<p>`
 * en cada cambio — y los del Hero tienen animación de entrada, o sea que la
 * frase se reanimaría entera. Con el índice sobreviven las líneas que existen en
 * los dos idiomas y se monta solo la que sobra; de esa única `<p>` nueva se
 * ocupa `Hero`.
 */
export function getHeroLines(locale: Locale): CopyLines {
  return locale === "es" ? HERO_LINES_ES : HERO_LINES;
}
