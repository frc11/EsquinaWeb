/**
 * Capturas y peso de R5.2: texto, foto sola y par sobre los mismos bordes.
 *
 *   node tools/bench/r5-2-capturas.mjs
 *
 * Requiere `npm run build` hecho. Escribe research/R5.2-sin-tope/<ruta>-1920x1080.png
 * e imprime el peso de las imágenes de /work/akasha-blends a 1920 × 1080, DPR 1
 * (suma de `encodedBodySize` de los recursos de imagen de la página).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { launchChrome } from "./cdp.mjs";
import { openPage } from "./page.mjs";
import { startServer } from "./server.mjs";

const OUT = "research/R5.2-sin-tope";
const ROUTES = ["tukumi", "pepe", "akasha-blends"];

mkdirSync(OUT, { recursive: true });
const server = await startServer();
const client = await launchChrome();
try {
  for (const slug of ROUTES) {
    const page = await openPage(client, { width: 1920, height: 1080, locale: "es" });
    await page.goto(`${server.origin}/work/${slug}`);
    // Todas eager y esperar a que carguen; la ventana se ubica sobre el primer par.
    const info = await page.evaluate(`(async () => {
      document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; });
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline) {
        if (Array.from(document.images).every((i) => i.complete)) break;
        await new Promise((r) => setTimeout(r, 50));
      }
      let imgBytes = 0;
      for (const e of performance.getEntriesByType("resource")) {
        if (e.name.includes("/_next/image") || e.name.includes("cdn.sanity.io")) imgBytes += e.encodedBodySize;
      }
      // Los GIF van directo al CDN de Sanity (otro origen): su encodedBodySize sale
      // en 0 sin Timing-Allow-Origin. Se devuelven las URL y se pesan desde Node.
      const gifUrls = Array.from(document.images).map((i) => i.currentSrc).filter((u) => u.startsWith("https://cdn.sanity.io"));
      // Los bloques en el orden del documento, en coordenadas de página.
      const blocks = Array.from(document.querySelectorAll(
        "[data-content-text], [data-media-frame]:not([data-media-half] [data-media-frame]), [data-media-row]"
      )).map((el) => {
        const r = el.getBoundingClientRect();
        const kind = el.hasAttribute("data-content-text") ? "texto" : el.hasAttribute("data-media-row") ? "par" : "foto";
        return { kind, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      });
      const iPair = blocks.findIndex((b) => b.kind === "par");
      const iSingle = blocks.findIndex((b) => b.kind === "foto");
      const iText = blocks.findIndex((b) => b.kind === "texto");
      const picks = [iPair, iSingle, iText].filter((i) => i >= 0);
      const from = Math.min(...picks), to = Math.max(...picks);
      const clip = { x: 0, y: Math.max(0, blocks[from].top - 140), width: window.innerWidth, height: blocks[to].bottom - blocks[from].top + 180 };
      return { clip, order: blocks.map((b) => b.kind[0]).join(""), gifUrls, imgBytes, count: document.images.length };
    })()`);
    let gifBytes = 0;
    for (const url of info.gifUrls) gifBytes += (await (await fetch(url)).arrayBuffer()).byteLength;
    info.imgBytes += gifBytes;
    info.gifBytes = gifBytes;
    await page.settle(600);
    const { data } = await page.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: { ...info.clip, scale: 1 },
    });
    writeFileSync(`${OUT}/${slug}-1920x1080.png`, Buffer.from(data, "base64"));
    console.log(`  orden de bloques: ${info.order}`);
    console.log(`${slug}: ${info.count} imágenes, ${info.imgBytes} bytes de imagen, de ellos ${info.gifBytes} de GIF directo (carga de la página, DPR 1)`);
    await page.close();
  }
} finally {
  await client.close();
  server.stop();
}
