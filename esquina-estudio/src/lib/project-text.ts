import type { Locale } from "@/lib/i18n/types";
import type { Project, ProjectContentBlock } from "@/types/project";

/**
 * Los tres campos de texto bilingües de `project`. El schema los guarda en
 * casillas hermanas (`title` / `titleEs`, …), agrupadas de a pares con
 * fieldsets, y son **opcionales**: las clientas cargan primero el inglés y el
 * castellano puede llegar más tarde, o no llegar nunca.
 *
 * # Fallback cruzado: nunca un hueco
 *
 * Si la casilla del idioma activo está vacía se muestra la otra. Cruzado y no
 * «hacia el inglés»: un proyecto cargado solo en castellano se ve en castellano
 * también con el sitio en inglés. Es la decisión 7 del plan maestro.
 *
 * «Vacía» incluye tres cosas distintas que en la práctica son la misma: la
 * casilla que nunca se llenó (GROQ devuelve `null`), la clave que ni siquiera
 * viene en la proyección (los proyectos locales de respaldo) y la casilla con
 * espacios. Por eso se recorta antes de decidir.
 *
 * # Lo que NO pasa por acá
 *
 * - El `content` (Portable Text) **no pasa por `projectText`**, que resuelve
 *   campos de una línea. Su versión castellana tiene su propia función
 *   acá abajo, `projectContent`, porque el problema es otro: no es elegir
 *   entre dos casillas sino **mezclar el texto de una con las imágenes de
 *   la otra**. Hasta M5 directamente no se traducía; M6/F3 lo resolvió sin
 *   duplicar los bloques de media, que era la razón por la que no se había
 *   hecho.
 * - La metadata de `/work/[slug]` la arma un componente de servidor y **queda en
 *   inglés** para todos, crawlers incluidos: es la aceptación escrita del
 *   sprint, no un olvido.
 * - `year` y `projectNumber` no son texto.
 * - Los títulos de la Fun Gallery no tienen casilla ES; se muestran como están.
 */

export type ProjectTextField = "title" | "category" | "services";

const ES_FIELD = {
  title: "titleEs",
  category: "categoryEs",
  services: "servicesEs",
} as const satisfies { readonly [K in ProjectTextField]: keyof Project };

function filled(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function projectText(
  project: Project,
  locale: Locale,
  field: ProjectTextField,
): string {
  const english = filled(project[field]);
  const spanish = filled(project[ES_FIELD[field]]);

  return (locale === "es" ? (spanish ?? english) : (english ?? spanish)) ?? "";
}

/** Un párrafo de Portable Text. Los bloques de imagen no son esto. */
function isTextBlock(block: ProjectContentBlock | undefined): boolean {
  return Boolean(block) && (block as { _type?: string })._type === "block";
}

/**
 * ¿El párrafo dice algo? Un bloque cargado y después vaciado sigue existiendo
 * en el array con sus `children` en blanco, y eso cuenta como ausente: se
 * muestra el inglés y no un renglón vacío. Es el mismo criterio que `filled`
 * aplica a las casillas de una línea.
 */
function hasText(block: ProjectContentBlock): boolean {
  const children = (block as { children?: unknown }).children;

  if (!Array.isArray(children)) return false;

  return children.some((child) => {
    const text = (child as { text?: unknown } | null)?.text;
    return typeof text === "string" && text.trim().length > 0;
  });
}

/**
 * # El cuerpo del proyecto en castellano (M6/F3)
 *
 * `content` es un array de **bloques mezclados**: párrafos de texto conviviendo
 * con bloques de imagen (`mediaItem`, `dualMedia`) en un orden dado. Ese orden
 * **es** la composición de la ficha.
 *
 * ## Por qué no se duplica el campo entero
 *
 * Un `contentEs` que copiara la forma de `content` obligaría a las clientas a
 * **volver a subir todas las imágenes** en el campo nuevo, y cualquier cambio
 * futuro de una foto quedaría desincronizado entre los dos idiomas: la ficha en
 * inglés mostraría la foto nueva y la castellana la vieja, sin que nada falle.
 *
 * Así que `contentEs` es **solo texto**. Al renderizar en castellano los
 * párrafos salen de `contentEs` y **las imágenes siguen saliendo de `content`,
 * en su lugar original**. Hay una sola composición y una sola copia de cada
 * imagen.
 *
 * ## La regla de correspondencia: por posición entre los bloques de texto
 *
 * Se numeran los bloques `_type === "block"` de `content` —los de imagen **no
 * cuentan**— y se emparejan con los de `contentEs` en el mismo orden: el 1.º
 * con el 1.º, el 2.º con el 2.º.
 *
 * ```
 *   content:    [ texto A ] [ imagen ] [ imagen ] [ texto B ]
 *                    │                                 │
 *   contentEs:  [ texto A' ]                      [ texto B' ]
 * ```
 *
 * Las otras dos formas posibles se descartaron, y conviene dejar escrito por
 * qué:
 *
 * - **Por `_key`.** Sanity los genera al azar (`33815fed9836`) y no los muestra
 *   en la interfaz: una clienta no puede copiarlos. Imposible de usar.
 * - **Por índice en el array completo.** Obligaría a dejar párrafos vacíos de
 *   relleno donde `content` tiene imágenes. Frágil, y sin sentido para quien
 *   escribe.
 *
 * La posición entre párrafos, en cambio, se explica en una línea —«el primero
 * con el primero»— y es lo que el campo dice en el Studio.
 *
 * ## Qué pasa si no coinciden en cantidad
 *
 * - **Menos párrafos en castellano** (incluido el caso «ninguno»): los que
 *   faltan se muestran **en inglés**, uno por uno, en su lugar exacto. Nunca
 *   queda un hueco. Es el mismo criterio del fallback cruzado de `projectText`.
 * - **Más párrafos en castellano**: los que sobran **no se muestran**. La
 *   composición la declara `content`, y un párrafo de más no tiene dónde caer
 *   sin mover una imagen. No es silencioso: el schema emite un **aviso** en el
 *   Studio diciendo cuántos sobran y que no se van a ver.
 * - Un párrafo castellano **en blanco** cuenta como ausente y cae al inglés,
 *   igual que una casilla vacía en `projectText`.
 *
 * ## Dos detalles de implementación
 *
 * 1. **El `_key` que viaja es el del inglés.** El nodo de React es entonces el
 *    mismo antes y después de cambiar de idioma —el párrafo se actualiza, no se
 *    remonta— y la unicidad de claves del array mezclado queda garantizada por
 *    `content`, que es un solo array de Sanity.
 * 2. **En inglés se devuelve `content` tal cual**, sin copiar ni recorrer nada:
 *    el inglés es el idioma que sirve el servidor (ver `LocaleProvider`) y esta
 *    función corre en cada render de la ficha.
 */
export function projectContent(
  project: Project,
  locale: Locale,
): ProjectContentBlock[] {
  const english = project.content ?? [];

  if (locale !== "es") return english;

  const spanish = (project.contentEs ?? []).filter(isTextBlock);

  if (spanish.length === 0) return english;

  let nth = 0;

  return english.map((block) => {
    if (!isTextBlock(block)) return block;

    const replacement = spanish[nth];
    nth += 1;

    if (!replacement || !hasText(replacement)) return block;

    return block._key ? { ...replacement, _key: block._key } : replacement;
  });
}
