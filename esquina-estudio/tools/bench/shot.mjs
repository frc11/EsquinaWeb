/**
 * Banco de medición — captura de una zona de una ruta.
 *
 *   node tools/bench/shot.mjs <ruta> <ancho> <alto> <locale> <selector|-> <salida.png>
 *
 * El selector se lleva al tope del viewport y se captura el viewport entero: el
 * `clip` de `Page.captureScreenshot` va en coordenadas de la vista, no del
 * documento, y mezclarlas es lo que devuelve capturas en blanco. Es para mirar
 * composición, no para medir: los números salen de las sondas.
 */
import { writeFileSync } from "node:fs";
import { launchChrome, sleep } from "./cdp.mjs";
import { openPage } from "./page.mjs";
import { startServer } from "./server.mjs";

const [route, width, height, locale, selector, out] = process.argv.slice(2);
const server = await startServer();
const client = await launchChrome();
try {
  const page = await openPage(client, {
    width: Number(width),
    height: Number(height),
    locale: locale || "en",
  });
  await page.goto(`${server.origin}${route}`);
  if (selector && selector !== "-") {
    const top = await page.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return null;
      return el.getBoundingClientRect().top + window.scrollY;
    })()`);
    if (top === null) throw new Error(`No encontré ${selector}`);
    await page.evaluate(`window.scrollTo(0, ${Math.max(0, top - 24)})`);
    await sleep(400);
  }
  writeFileSync(out, Buffer.from(await page.screenshot(), "base64"));
  process.stderr.write(`escrito ${out}\n`);
  await page.close();
} finally {
  await client.close();
  server.stop();
}
