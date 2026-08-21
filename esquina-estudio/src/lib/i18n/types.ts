/**
 * Tipos del idioma. Sin librerías: el i18n de este repo es un diccionario
 * tipado más un contexto de React (decisión cerrada del plan maestro; ver
 * `CLAUDE.md` §8.2).
 *
 * # El contrato que hace que no falte nada
 *
 * `Dictionary` es una **interfaz explícita**, no `typeof EN`. Las dos variantes
 * se declaran `const EN: Dictionary` y `const ES: Dictionary`, así que una clave
 * que falte —o que sobre— es un **error de compilación**, no un texto en inglés
 * perdido en producción. Los grupos que dependen del idioma (`languageNames`)
 * van como tipo mapeado sobre `Locale`: agregar un idioma obliga a completarlo
 * en las dos.
 *
 * Las composiciones cuyo **corte de línea es decisión de diseño** —la frase de
 * la marca, los labels del formulario, los títulos de dos líneas— viajan como
 * tuplas de largo fijo. El corte se escribe en el código, en los dos idiomas, y
 * nunca se lo deja al ancho del navegador.
 */

export type Locale = "en" | "es";

/** Orden en que se muestra el control del header: primero el idioma servido. */
export const LOCALES = ["en", "es"] as const satisfies readonly Locale[];

/** Una línea de una composición con fragmentos en negrita. Ver `site-copy.ts`. */
export type CopyFragment = { readonly text: string; readonly bold?: boolean };
export type CopyLine = ReadonlyArray<CopyFragment>;

/** Composición de tres líneas: la frase de la marca. El corte es de diseño. */
export type ThreeLines = readonly [CopyLine, CopyLine, CopyLine];

export interface Dictionary {
  readonly common: {
    /** Nombre accesible del grupo EN / ES del header. */
    readonly language: string;
    /** Nombre completo de cada idioma, escrito en el idioma de esta variante. */
    readonly languageNames: { readonly [L in Locale]: string };
  };
}
