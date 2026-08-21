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
 * la marca, los pares del footer, los títulos de dos líneas, los labels del
 * formulario— viajan como tuplas de largo fijo. El corte se escribe en el
 * código, en los dos idiomas, y nunca se lo deja al ancho del navegador. Los
 * bloques que sí pueden fluir —los párrafos de Team— van como arreglo suelto.
 */

export type Locale = "en" | "es";

/** Orden en que se muestra el control del header: primero el idioma servido. */
export const LOCALES = ["en", "es"] as const satisfies readonly Locale[];

/**
 * Fragmento de una composición con negrita por partes. La frase de la marca
 * marca el énfasis por fragmento y no por línea completa; el contrato de render
 * está documentado en `site-copy.ts`.
 */
export type CopyFragment = { readonly text: string; readonly bold?: boolean };
export type CopyLine = ReadonlyArray<CopyFragment>;

/** Composición de tres líneas: la frase de la marca, en hero y en footer. */
export type ThreeLines = readonly [CopyLine, CopyLine, CopyLine];

/** Par de dos líneas: el corte lo decide el mockup, no el ancho de la caja. */
export type TwoLines = readonly [string, string];

export interface Dictionary {
  readonly common: {
    /** Nombre accesible del grupo EN / ES del header. */
    readonly language: string;
    /** Nombre completo de cada idioma, escrito en el idioma de esta variante. */
    readonly languageNames: { readonly [L in Locale]: string };
  };

  readonly nav: {
    readonly work: string;
    readonly services: string;
    readonly team: string;
    readonly gallery: string;
    readonly contact: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    /** Nombre accesible del logo, que es el link a home. */
    readonly logoHome: string;
  };

  readonly footer: {
    /**
     * Los dos pares de la fila de info. `ARGENTINA` es nombre propio y no se
     * traduce, pero viaja igual porque la primera línea de cada par sí cambia.
     */
    readonly places: readonly [TwoLines, TwoLines];
    /** El crédito. `develOP` es marca y queda afuera, sin traducir. */
    readonly poweredBy: string;
    readonly contactCta: string;
    readonly contactLines: TwoLines;
    readonly clubCta: string;
    readonly clubLines: TwoLines;
  };

  readonly team: {
    /** Intro centrado. Los cortes son de diseño y van explícitos. */
    readonly intro: readonly string[];
    /**
     * Primer párrafo, partido en tres porque el medio va en semibold: los dos
     * nombres propios. Los extremos llevan sus espacios como en el original.
     */
    readonly foundedBy: readonly [string, string, string];
    readonly bio: string;
    /** Bloques con párrafos separados por línea en blanco (`whitespace-pre-line`). */
    readonly approach: string;
    readonly headed: string;
    readonly sections: readonly [string, string, string];
    readonly photoAlt: string;
  };

  readonly gallery: {
    readonly title: TwoLines;
    readonly hint: string;
    readonly sectionLabel: string;
    /** Verbo del nombre accesible de cada objeto: «Ver <título>». */
    readonly viewItem: string;
    readonly errorTitle: string;
    readonly errorDetail: string;
    readonly emptyTitle: string;
    readonly emptyDetail: string;
  };

  readonly success: {
    readonly title: TwoLines;
    readonly body: string;
    readonly sectionLabel: string;
  };

  readonly work: {
    readonly backToGallery: string;
    readonly allProjects: string;
    readonly next: string;
    readonly contentSoon: string;
    readonly mediaAlt: string;
    readonly videoTitle: string;
  };
}
