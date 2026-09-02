/**
 * Banco de medición — la matriz de la vara de no-regresión.
 *
 * Las ocho rutas del sitio, los tres anchos y los dos idiomas: 48 combinaciones.
 * Los altos por sí solos NO alcanzan (§2b): `scrollHeight` nunca baja del alto del
 * viewport, así que un documento de 1080 px a 1920 no prueba que el contenido
 * llegue al pie. Por eso cada medición trae además el **borde inferior del último
 * elemento** —la franja muerta— y el desborde horizontal.
 */

export const ROUTES = [
  "/",
  "/work",
  "/work/matsu",
  "/services",
  "/team",
  "/fun-gallery",
  "/contact",
  "/contact/success",
];

export const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1024, height: 768 },
  { width: 1920, height: 1080 },
];

export const LOCALES = ["en", "es"];

/** Los cuatro anchos donde se verifica el fit del formulario. */
export const FORM_WIDTHS = [1280, 1360, 1600, 1920];

/** Alto de documento, franja muerta y desborde horizontal, en una sola lectura. */
export const PAGE_PROBE = `(() => {
  const doc = document.documentElement;
  let bottom = 0;
  for (const el of document.body.querySelectorAll("*")) {
    const style = getComputedStyle(el);
    if (style.position === "fixed" || style.display === "none") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const value = rect.bottom + window.scrollY;
    if (value > bottom) bottom = value;
  }
  return {
    docHeight: doc.scrollHeight,
    contentBottom: Math.round(bottom * 100) / 100,
    hOverflow: doc.scrollWidth - doc.clientWidth,
    bodyOverflow: document.body.scrollWidth - doc.clientWidth,
  };
})()`;

/**
 * Fit del formulario. El «bloque» es el `<form>`; el borde inferior va en
 * coordenadas de documento. Se suman los cuatro selects: un placeholder truncado
 * se detecta con `scrollWidth > clientWidth` sobre el span que lleva `truncate`,
 * que es exacto y no una estimación.
 */
export const FORM_PROBE = `(() => {
  const form = document.getElementById("contact-form");
  if (!form) return null;
  const rect = form.getBoundingClientRect();
  const selects = [...document.querySelectorAll("[data-contact-select] button[aria-expanded]")];
  return {
    formHeight: Math.round(rect.height * 100) / 100,
    formBottom: Math.round((rect.bottom + window.scrollY) * 100) / 100,
    selects: selects.map((button) => {
      const span = button.querySelector("span.truncate") || button.querySelector("span");
      const track = button.getBoundingClientRect().width;
      return {
        id: button.id,
        text: (span ? span.textContent : "").trim(),
        spanScroll: span ? span.scrollWidth : 0,
        spanClient: span ? span.clientWidth : 0,
        truncated: span ? span.scrollWidth > span.clientWidth : false,
        buttonWidth: Math.round(track * 100) / 100,
      };
    }),
    pills: (() => {
      const group = document.querySelector('[role="group"] .flex-wrap');
      if (!group) return null;
      const rows = new Set();
      for (const pill of group.children) rows.add(Math.round(pill.getBoundingClientRect().top));
      return { rows: rows.size, width: Math.round(group.getBoundingClientRect().width * 100) / 100 };
    })(),
  };
})()`;
