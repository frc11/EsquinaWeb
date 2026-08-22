import { CHROME_GUTTER } from "@/lib/mobile-layout";

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

/**
 * Gutter del cromo. Alinea Services con el Navbar y el Footer: sale del módulo
 * compartido de mobile para que los tres corten en el mismo ancho (M1).
 */
export const GUTTER = CHROME_GUTTER;

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
 * Ancho de la columna izquierda: **18 % con piso de 270 px**.
 *
 * El 18 % sale del mockup y a 1920 da exactamente esos 270 px. El piso no es
 * redundante: el porcentaje es del ancho disponible, así que a 1366 la columna
 * caía a 175 px y «CONSULTATION» —que mide 245 px a 30 px— se le montaba encima
 * a la lista de ítems. Medido, no supuesto. Con el piso, de 1920 para arriba
 * manda el porcentaje y por debajo manda el piso; lo que se estira o se encoge
 * es la columna de ítems, que es la que puede.
 *
 * Las clases van escritas enteras y repetidas —no armadas con una constante—
 * porque Tailwind v4 busca los nombres de clase como **literales** en el código:
 * una clase compuesta en runtime no llega nunca al CSS.
 */

/**
 * Columnas del cuerpo de una sección: izquierda (nombre + descripción) y derecha
 * (ítems + botón). Los porcentajes son del ancho de la caja de contenido;
 * medidos contra el mockup caen dentro de 3 px.
 */
export const SPLIT_GRID =
  "grid grid-cols-1 lg:grid-cols-[minmax(270px,18%)_minmax(0,1fr)] gap-x-[3%] lg:pr-[4.5%]";

/**
 * Grilla del cierre (LATEST PROJECTS): rótulo, párrafo y links.
 *
 * Los links **no se pueden achicar** —van a 24 px fijos y el más largo mide unos
 * 430 px con la flecha—, así que las tres columnas solo entran de unos 1600 px
 * de viewport para arriba. Por debajo de `2xl` los links bajan a una segunda
 * fila dentro de la columna del párrafo, en vez de espicharlo a un renglón por
 * palabra.
 */
export const LATEST_GRID =
  "grid grid-cols-1 lg:grid-cols-[minmax(270px,18%)_minmax(0,1fr)] 2xl:grid-cols-[minmax(270px,18%)_minmax(0,1fr)_auto] gap-x-[3%]";

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

/**
 * # Escala de mobile de Services (M1/F5)
 *
 * Un solo mapeo para toda la ruta, para no inventar un tamaño por bloque:
 * **40 → 26 · 30 → 20 · 24 → 20 · 20 → 17**, con el interlineado bajando en la
 * misma proporción. Los 17 px se quedan donde están: es el tamaño de
 * información del sitio y ya era el piso.
 *
 * Vale debajo de `md`. De 768 para arriba la ruta conserva la escala del
 * rediseño de B3.4, que está medida contra los mockups y no se toca.
 */
export const SERVICES_DISPLAY_40 =
  "text-[26px] leading-[31px] md:text-[40px] md:leading-[48px]";
export const SERVICES_HEADING_30 =
  "text-[20px] leading-[24px] md:text-[30px] md:leading-[36px]";
export const SERVICES_LINK_24 =
  "text-[20px] leading-[24px] md:text-[24px] md:leading-[28px]";
export const SERVICES_BODY_20 =
  "text-[17px] leading-[21px] md:text-[20px] md:leading-[26px]";

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
 * # El criterio único de aterrizaje y marcado (B3.4b/F3)
 *
 * Las dos reglas —a dónde salta el sidebar y qué ítem marca la flecha— comparten
 * una sola geometría, y hay que leerlas juntas o no cierran:
 *
 * - **La flecha marca la última sección cuyo _tope_ cruzó la línea de lectura**
 *   (el borde inferior del header). El tope de una sección de packs es su
 *   **divisoria**, que es donde vive su centinela.
 * - **El salto aterriza el _contenido_ de la sección**, no su tope, a
 *   `HEADER + LANDING_BREATH` de la línea.
 *
 * Entre uno y otro hay 161 px —la divisoria de 1 px más el `pt-[160px]` del
 * cuerpo—, así que al terminar el salto el centinela queda **137 px por encima**
 * de la línea de lectura. Eso es lo que arregla las dos cosas de un tiro:
 *
 * 1. La divisoria termina fuera de la pantalla (medido: y = −9), no pegada bajo
 *    el header como en B3.4.
 * 2. El aterrizaje cae **holgadamente dentro** del rango en el que el spy marca
 *    esa sección, en vez de apoyarse justo en el borde. Eso era el bug: con el
 *    destino exactamente sobre la línea, el `IntersectionObserver` avisa un par
 *    de píxeles **antes** de llegar, y en la desaceleración final del
 *    desplazamiento ese aviso medía todavía «no cruzó». Después no llegaba
 *    ningún aviso más y la flecha se quedaba en la sección anterior.
 *
 * `LANDING_BREATH` no puede crecer sin romper (1): a partir de 33 px la
 * divisoria vuelve a asomar por debajo del header. 24 deja 9 px de resguardo
 * contra el redondeo a medio píxel del scroll.
 */
export const LANDING_BREATH = 24;

/**
 * Marca el bloque de contenido de una sección: lo que el sidebar aterriza. Va en
 * el elemento cuyo **cuadro de contenido** —o sea, ya descontado su relleno
 * superior— empieza donde empieza lo que se lee.
 */
export const SERVICES_ANCHOR_ATTR = "data-services-anchor";

/**
 * Posición en el documento del contenido de una sección. Sin marca —el intro—
 * cae en la sección misma, que no tiene relleno ni divisoria y por eso aterriza
 * en el tope de la página, como en `08a`.
 */
export function getSectionAnchorTop(section: Element): number {
  const anchor =
    section.querySelector(`[${SERVICES_ANCHOR_ATTR}]`) ?? section;
  const paddingTop =
    Number.parseFloat(window.getComputedStyle(anchor).paddingTop) || 0;

  return anchor.getBoundingClientRect().top + window.scrollY + paddingTop;
}

/** Destino de scroll de una sección. Ver el criterio único de arriba. */
export function getSectionScrollTarget(section: Element): number {
  return Math.max(
    0,
    getSectionAnchorTop(section) - getHeaderOffset() - LANDING_BREATH,
  );
}

/**
 * Teclas que mueven el scroll. La comparten los dos gestos programados de la
 * ruta: el gatillo del intro las **bloquea** mientras dura el lock, y el salto
 * del sidebar las toma como señal de que el usuario quiere manejar y **se
 * aparta**. Una sola lista para que no se separen.
 */
export const SCROLL_KEYS: ReadonlySet<string> = new Set([
  " ",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
]);

/**
 * Destino del gatillo del intro (`IntroScrollTrigger`). Es el encabezado de la
 * zona de packs, que **no** es una sección del sidebar: el menú no lo lista y el
 * spy no lo observa. Vive acá porque lo comparten quien lo emite y quien lo
 * busca.
 */
export const BRANDING_PACKS_ID = "branding-packs";

/**
 * Atributo del centinela del scroll-spy. Cada sección renderiza el suyo pegado a
 * su tope y el sidebar los observa; ver `ServicesSidebar` para la regla completa.
 * Se declara en el marcado —y no lo inyecta el sidebar— para que el árbol del
 * DOM no dependa de que un efecto haya corrido.
 */
export const SPY_SENTINEL_ATTR = "data-services-spy";

/** Centinela de 1 px. La sección que lo lleva tiene que ser `relative`. */
export const SPY_SENTINEL_CLASS =
  "pointer-events-none absolute left-0 top-0 block h-px w-px";

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
