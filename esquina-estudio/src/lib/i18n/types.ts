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

import type { ContactErrorKey } from "@/lib/contact";

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
    /**
     * Sufijo que anuncia el item activo del menu de mobile a un lector de
     * pantalla (M4/F2). Va como texto escondido y no como `aria-current`
     * porque `HoverButton` no expone el `<a>` que emite —el `className` que
     * recibe va al `<span>` de adentro— y el primitivo no se toca
     * (`CLAUDE.md` §4.2). Un texto visualmente oculto lo anuncia igual y no
     * depende de que la tecnologia de asistencia soporte el atributo.
     */
    readonly currentPage: string;
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

  readonly services: {
    /** Nombre accesible de la sección del intro y del menú lateral. */
    readonly introLabel: string;
    readonly sidebarLabel: string;
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

  readonly form: {
    /** Título del aside, tres líneas; el corte es del mockup. */
    readonly title: readonly [string, string, string];
    readonly subtitle: TwoLines;
    /** Nombre accesible del `<form>`. */
    readonly formLabel: string;
    /**
     * Los nueve labels. **Tupla de exactamente dos líneas** cada uno: el corte
     * lo decide el diseño y no el ancho de la columna, en los dos idiomas. Cada
     * línea puede repartirse sola dentro de su columna en los escalones chicos,
     * pero nunca pasa de tres renglones (medido en los tres escalones).
     */
    readonly labels: {
      readonly fullName: TwoLines;
      readonly email: TwoLines;
      readonly workType: TwoLines;
      readonly businessType: TwoLines;
      readonly industry: TwoLines;
      readonly country: TwoLines;
      readonly timeline: TwoLines;
      readonly budget: TwoLines;
      readonly hearAbout: TwoLines;
    };
    readonly placeholders: {
      readonly name: string;
      readonly email: string;
      readonly select: string;
      readonly shortAnswer: string;
      readonly search: string;
    };
    readonly noResults: string;
    readonly submit: string;
    readonly submitting: string;
    readonly submitError: string;
    /** Indexado por la clave que emite el esquema de zod. */
    readonly validation: { readonly [K in ContactErrorKey]: string };
  };

  readonly success: {
    readonly title: TwoLines;
    readonly body: string;
    readonly sectionLabel: string;
    /** Salida de la pantalla de éxito: el vínculo de vuelta a la raíz (M2/F3). */
    readonly backHome: string;
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
