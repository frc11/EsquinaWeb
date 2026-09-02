/**
 * Banco de medición — diferencia entre dos corridas de `baseline.mjs`.
 *
 *   node tools/bench/diff.mjs <base.json> <nueva.json>
 *
 * Imprime solo lo que cambió. Es la vara de no-regresión: cualquier ruta que no
 * esté en la lista de cambios esperados de la fase es una regresión.
 */
import { readFileSync } from "node:fs";

const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, "utf8")));
const n = (x) => (typeof x === "number" ? x : 0);
let changes = 0;

for (const key of Object.keys(a.pages)) {
  const before = a.pages[key];
  const after = b.pages[key];
  if (!after) { console.log(`FALTA  ${key}`); changes += 1; continue; }
  const dh = n(after.docHeight) - n(before.docHeight);
  const db = n(after.contentBottom) - n(before.contentBottom);
  if (dh !== 0 || Math.abs(db) > 0.01) {
    console.log(
      `${key.padEnd(32)} alto ${before.docHeight} -> ${after.docHeight} (${dh > 0 ? "+" : ""}${dh})   pie ${before.contentBottom} -> ${after.contentBottom} (${db > 0 ? "+" : ""}${Math.round(db * 100) / 100})`,
    );
    changes += 1;
  }
  if (after.hOverflow !== 0) console.log(`DESBORDE HORIZONTAL ${key}: ${after.hOverflow}`);
}

console.log(`\n--- fit del formulario ---`);
for (const key of Object.keys(a.form)) {
  const before = a.form[key];
  const after = b.form[key];
  const dh = n(after?.formHeight) - n(before?.formHeight);
  const db = n(after?.formBottom) - n(before?.formBottom);
  const trunc = (after?.selects ?? []).filter((s) => s.truncated);
  const mark = dh === 0 && Math.abs(db) < 0.01 ? "IDÉNTICO" : `CAMBIÓ  alto ${before.formHeight} -> ${after.formHeight}  pie ${before.formBottom} -> ${after.formBottom}`;
  console.log(
    `${key.padEnd(12)} ${mark}   pills=${after?.pills?.rows}  truncados=${trunc.length}${trunc.length ? " (" + trunc.map((s) => s.id).join(",") + ")" : ""}`,
  );
}
console.log(`\n${changes} rutas con cambio de alto sobre 48.`);
