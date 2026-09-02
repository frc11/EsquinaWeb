/**
 * Banco de medición — una sonda arbitraria sobre una matriz de ruta × ancho × idioma.
 *
 *   node tools/bench/probe.mjs <archivo-de-sonda.json>
 *
 * El JSON lleva `{ cases: [{route, width, height, locale, throttleKBs}],
 * beforeScript?, expression }`. La expresión se evalúa en la página ya asentada
 * (fuentes e imágenes incluidas) y su valor sale por stdout junto al caso que lo
 * produjo. Es lo que evita escribir un script nuevo por cada medición de fase.
 *
 * `beforeScript` se instala con `Page.addScriptToEvaluateOnNewDocument`, o sea
 * **antes** de que corra una línea del documento: es la única forma de observar
 * la carga desde el principio, porque una sonda instalada después de navegar
 * llega tarde y en caché caliente reporta cero eventos.
 *
 * `throttleKBs` estrangula la red y **desactiva la caché**; sin lo segundo el
 * estrangulamiento no se nota en la segunda pasada.
 */
import { readFileSync } from "node:fs";
import { launchChrome } from "./cdp.mjs";
import { openPage } from "./page.mjs";
import { startServer } from "./server.mjs";

const spec = JSON.parse(readFileSync(process.argv[2], "utf8"));
const server = await startServer();
const client = await launchChrome();
const results = [];

try {
  for (const testCase of spec.cases) {
    const page = await openPage(client, {
      width: testCase.width,
      height: testCase.height ?? 1080,
      locale: testCase.locale ?? "en",
    });
    if (spec.beforeScript) {
      await page.send("Page.addScriptToEvaluateOnNewDocument", {
        source: spec.beforeScript,
      });
    }
    if (testCase.throttleKBs) {
      await page.send("Network.enable");
      await page.send("Network.setCacheDisabled", { cacheDisabled: true });
      await page.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: testCase.latencyMs ?? 0,
        downloadThroughput: testCase.throttleKBs * 1024,
        uploadThroughput: testCase.throttleKBs * 1024,
      });
    }
    await page.goto(`${server.origin}${testCase.route}`, {
      settleMs: testCase.settleMs ?? 250,
    });
    if (testCase.scrollTo !== undefined) {
      await page.evaluate(`window.scrollTo(0, ${testCase.scrollTo})`);
    }
    results.push({ ...testCase, value: await page.evaluate(spec.expression) });
    process.stderr.write(
      `${testCase.locale ?? "en"} ${testCase.width} ${testCase.route}\n`,
    );
    await page.close();
  }
} finally {
  await client.close();
  server.stop();
}

process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
