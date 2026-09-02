/**
 * Banco de medición — una pestaña, un viewport, un idioma.
 *
 * Encapsula las tres cosas que en las cinco reconstrucciones anteriores se
 * volvieron a escribir mal por lo menos una vez:
 *
 * 1. **El idioma.** `LocaleProvider` arranca en inglés y resuelve el real en un
 *    efecto de montaje leyendo `localStorage["esquina:locale"]`. Sembrarlo con un
 *    `Runtime.evaluate` después de navegar llega tarde: hay que sembrarlo con
 *    `Page.addScriptToEvaluateOnNewDocument`, que corre antes que el documento.
 * 2. **El preloader.** Sin `sessionStorage["esquina:preloaderShown"]` la cortina
 *    tapa tres segundos de cada medición y el contenido no entra hasta que empieza
 *    a irse.
 * 3. **Las imágenes.** `getBoundingClientRect` da ±1 px cuando una imagen decide un
 *    alto fraccionario sin decodificar (§7b). Se espera a que TODAS estén
 *    `complete`, y además a que el alto del documento se repita entre dos muestras.
 */

import { sleep } from "./cdp.mjs";

const SEED = `
try {
  localStorage.setItem("esquina:locale", "__LOCALE__");
  sessionStorage.setItem("esquina:preloaderShown", "1");
} catch (_) { /* about:blank no tiene origen; en la ruta real sí */ }
`;

export async function openPage(client, { width, height, locale = "en" }) {
  const { targetId } = await client.send("Target.createTarget", {
    url: "about:blank",
  });
  const { sessionId } = await client.send("Target.attachToTarget", {
    targetId,
    flatten: true,
  });

  const send = (method, params) => client.send(method, params, sessionId);

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: SEED.replace("__LOCALE__", locale),
  });

  const page = {
    sessionId,
    send,

    async setViewport(nextWidth, nextHeight) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: nextWidth,
        height: nextHeight,
        deviceScaleFactor: 1,
        mobile: false,
      });
    },

    async goto(url, { settleMs = 250 } = {}) {
      const loaded = client.once("Page.loadEventFired", sessionId, 60000);
      await send("Page.navigate", { url });
      await loaded;
      await page.settle(settleMs);
    },

    /** Espera fuentes, imágenes y dos lecturas iguales del alto del documento. */
    async settle(settleMs = 250) {
      await page.evaluate(`(async () => {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        const deadline = Date.now() + 15000;
        while (Date.now() < deadline) {
          const imgs = Array.from(document.images);
          if (imgs.every((img) => img.complete)) break;
          await new Promise((r) => setTimeout(r, 50));
        }
        return true;
      })()`);
      await sleep(settleMs);
      let previous = -1;
      for (let i = 0; i < 40; i += 1) {
        const current = await page.evaluate(
          "document.documentElement.scrollHeight",
        );
        if (current === previous) return;
        previous = current;
        await sleep(120);
      }
    },

    async evaluate(expression) {
      const result = await send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (result.exceptionDetails) {
        throw new Error(
          `Error en la página: ${JSON.stringify(result.exceptionDetails)}`,
        );
      }
      return result.result.value;
    },

    /** Captura PNG en base64. Para artefactos visuales se muestrea el píxel. */
    async screenshot(clip) {
      const params = { format: "png", captureBeyondViewport: false };
      if (clip) params.clip = { ...clip, scale: 1 };
      const { data } = await send("Page.captureScreenshot", params);
      return data;
    },

    async close() {
      await client.send("Target.closeTarget", { targetId });
    },
  };

  return page;
}
