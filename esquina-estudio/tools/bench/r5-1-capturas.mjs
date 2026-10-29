/**
 * Capturas de R5.1: el primer par de /work/tukumi centrado en el viewport.
 *
 *   node tools/bench/r5-1-capturas.mjs
 *
 * Requiere `npm run build` hecho. Escribe research/R5.1-par/tukumi-<ancho>x<alto>.png.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { launchChrome } from "./cdp.mjs";
import { openPage } from "./page.mjs";
import { startServer } from "./server.mjs";

const SHOTS = [
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
];
const OUT = "research/R5.1-par";

mkdirSync(OUT, { recursive: true });
const server = await startServer();
const client = await launchChrome();
try {
  for (const { width, height } of SHOTS) {
    const page = await openPage(client, { width, height, locale: "es" });
    await page.goto(`${server.origin}/work/tukumi`);
    await page.evaluate(`(async () => {
      document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
      const row = document.querySelector("[data-media-half]").parentElement;
      row.scrollIntoView({ block: "center" });
      return true;
    })()`);
    await page.settle(600);
    writeFileSync(`${OUT}/tukumi-${width}x${height}.png`, Buffer.from(await page.screenshot(), "base64"));
    console.log(`captura ${width}x${height}`);
    await page.close();
  }
} finally {
  await client.close();
  server.stop();
}
