import type { Locale } from "@/lib/i18n/types";
import type { Project } from "@/types/project";

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
 * - El `content` (Portable Text) **no se traduce**: duplicarlo duplicaría
 *   también los bloques de media. Decisión cerrada del plan maestro.
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
