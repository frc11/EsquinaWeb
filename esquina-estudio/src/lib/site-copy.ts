/**
 * Copy compartido entre secciones. Fuente única: Final.pdf (2026-08-13).
 * El sprint B2.3 hace que Hero consuma HERO_LINES.
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
 */

export type CopyFragment = { readonly text: string; readonly bold?: boolean };

export type CopyLine = ReadonlyArray<CopyFragment>;

export const HERO_LINES: ReadonlyArray<CopyLine> = [
  [{ text: "IN A WORLD FULL OF NOISE," }],
  [{ text: "STAND OUT", bold: true }, { text: "WITH INTENTION." }],
  [{ text: "WITH" }, { text: "IMPACT.", bold: true }],
];
