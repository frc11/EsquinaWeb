import type { Dictionary } from "@/lib/i18n/types";

/**
 * Variante española. Criterio de traducción: contextual y no literal, **voseo
 * argentino** y brevedad como decisión de diseño —ante dos traducciones válidas
 * gana la más corta, porque hay composiciones medidas al píxel que se rompen si
 * el texto crece—. Mayúsculas con tilde (`INTENCIÓN`) se conservan.
 */
export const ES: Dictionary = {
  common: {
    language: "Idioma",
    languageNames: { en: "Inglés", es: "Español" },
  },
};
