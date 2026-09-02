/**
 * Banco de medición — la vara de no-regresión.
 *
 * Produce en JSON los 48 altos (8 rutas × 3 anchos × 2 idiomas), su franja muerta,
 * su desborde horizontal y el fit del formulario en los cuatro anchos donde está
 * medido. Toda fase posterior se compara contra este archivo.
 *
 *   node tools/bench/baseline.mjs > docs/archivo/mediciones/<nombre>.json
 */

import { launchChrome } from "./cdp.mjs";
import { openPage } from "./page.mjs";
import { startServer } from "./server.mjs";
import {
  FORM_PROBE,
  FORM_WIDTHS,
  LOCALES,
  PAGE_PROBE,
  ROUTES,
  VIEWPORTS,
} from "./matrix.mjs";

const out = (line) => process.stderr.write(`${line}\n`);

const server = await startServer();
const client = await launchChrome();
const result = { origin: server.origin, pages: {}, form: {} };

try {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      const page = await openPage(client, { ...viewport, locale });
      for (const route of ROUTES) {
        await page.goto(`${server.origin}${route}`);
        const probe = await page.evaluate(PAGE_PROBE);
        result.pages[`${route}|${viewport.width}|${locale}`] = probe;
        out(
          `${locale} ${viewport.width} ${route.padEnd(18)} h=${probe.docHeight} bottom=${probe.contentBottom} hx=${probe.hOverflow}`,
        );
      }
      await page.close();
    }

    for (const width of FORM_WIDTHS) {
      const page = await openPage(client, { width, height: 1080, locale });
      await page.goto(`${server.origin}/contact`);
      const probe = await page.evaluate(FORM_PROBE);
      result.form[`${width}|${locale}`] = probe;
      out(
        `${locale} form ${width} height=${probe.formHeight} bottom=${probe.formBottom} pills=${probe.pills?.rows} trunc=${probe.selects.filter((s) => s.truncated).length}`,
      );
      await page.close();
    }
  }
} finally {
  await client.close();
  server.stop();
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
