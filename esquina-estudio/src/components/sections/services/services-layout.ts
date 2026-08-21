/**
 * Medidas compartidas del rediseño de `/services` (B3.4).
 *
 * Salen de medir los cinco mockups (`docs/mockups/08*.jpg`), que son exportes de
 * un diseño de **1920 escalados a 1327** (factor 0,691). Con ese factor el gutter
 * del diseño da exactamente 64 px —el mismo `lg:px-16` del Navbar y del Footer—
 * y la escala tipográfica cierra en 17 / 20 / 24 / 30 / 40.
 *
 * Viven acá y no dentro de un componente porque **el sidebar y el contenido
 * tienen que coincidir**: el sidebar se apoya sobre la banda que el contenido le
 * reserva con `CONTENT_INSET`. Si uno cambia sin el otro, el contenido pasa por
 * debajo del menú.
 */

/** Gutter del cromo. Alinea Services con el Navbar y el Footer. */
export const GUTTER = "px-12 lg:px-16";

/** Ancho de la columna del sidebar, en px. */
export const SIDEBAR_WIDTH = 180;

/** Aire entre el borde derecho del contenido y el sidebar, en px. */
export const SIDEBAR_GAP = 40;

/**
 * Banda que el contenido le reserva al sidebar. Solo desde `lg`: por debajo el
 * sidebar no se muestra y el contenido usa todo el ancho.
 */
export const CONTENT_INSET = "lg:pr-[220px]";

/**
 * Columnas del cuerpo de una sección: izquierda (nombre + descripción) y derecha
 * (ítems + botón). Los porcentajes son del ancho de la caja de contenido;
 * medidos contra el mockup caen dentro de 3 px.
 */
export const SPLIT_GRID =
  "grid grid-cols-1 lg:grid-cols-[18%_minmax(0,1fr)] gap-x-[3%] lg:pr-[4.5%]";

/**
 * Igual que `SPLIT_GRID` pero con **dos filas explícitas**: la primera es solo
 * para el número (`01`, `02`, `+`) y la segunda lleva el nombre y los ítems. Así
 * la lista de ítems arranca a la altura del **nombre** y no del número, que es
 * como se lee en los mockups de Universe y de Add-ons.
 *
 * No lleva `gap-y`: cuando el pack no tiene número (Consultation) la primera
 * fila queda vacía, y un `gap-y` seguiría separando igual y bajaría la sección
 * unos píxeles respecto de las otras. El aire vertical va por márgenes.
 */
export const SECTION_GRID = `${SPLIT_GRID} lg:grid-rows-[auto_auto]`;

/** Fila de un ítem: nombre a la izquierda, detalle en gris a la derecha. */
export const ITEM_GRID =
  "grid grid-cols-1 md:grid-cols-[36%_minmax(0,1fr)] gap-x-[3%] gap-y-1";

/**
 * Línea de lectura del scroll-spy y offset de los saltos del sidebar. Es el alto
 * del header fijo; se lee de `--header-height` para no duplicar el valor, con
 * 128 de reserva por si la variable no está (SSR, o un ancestro que la pise).
 */
export const HEADER_OFFSET_FALLBACK = 128;

export function getHeaderOffset(): number {
  if (typeof window === "undefined") return HEADER_OFFSET_FALLBACK;

  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim();
  const parsed = Number.parseFloat(raw);

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : HEADER_OFFSET_FALLBACK;
}

/**
 * Regla larga entre secciones. Más liviana que las de los ítems: medidas sobre
 * el mockup, la de sección pinta ~0,39 px de tinta por píxel y la de ítem ~0,84,
 * o sea que la línea grande es la **más tenue** de las dos. Es al revés de lo
 * habitual y es a propósito, así que no se «corrige».
 */
export const SECTION_RULE = "bg-off-black/25";

/**
 * Regla entre ítems de una lista. Las dos variantes van escritas enteras —y no
 * derivadas con un `replace`— porque Tailwind v4 busca los nombres de clase como
 * literales en el código: una clase armada en runtime no llega al CSS.
 */
export const ITEM_RULE_BORDER = "border-off-black/35";
