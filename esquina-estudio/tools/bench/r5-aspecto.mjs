/**
 * Banco de medición — R5: las imágenes de un proyecto conservan su proporción.
 *
 *   node tools/bench/r5-aspecto.mjs [salida.json]
 *
 * Requiere `npm run build` hecho. Levanta el servidor (3010) y Chrome headless,
 * carga `/work/akasha-blends` y `/work/pepe` en los dos idiomas, y para cada una
 * redimensiona la MISMA pestaña por la matriz de 5 anchos × 2 alturas (como lo
 * hace quien arrastra el borde de la ventana: es el defecto reportado).
 *
 * La verdad de las dimensiones NO sale del helper del componente, que es lo que
 * se prueba: sale de la API pública de Sanity (el id del asset codifica
 * `<ancho>x<alto>`). Los nodos se localizan por marca propia —`data-media-frame`
 * y `data-media-half`—, no por inferencia sobre el árbol (§7b, lección de M10).
 *
 * Cada aserción imprime los números medidos. Sale con código 1 si alguna falla.
 *
 *   A1  la caja (y la imagen pintada) tienen la proporción de la foto, ±0,5 %
 *   A2  esa proporción no se mueve entre las diez combinaciones, ±0,5 %
 *   A3  nada se recorta: ningún `object-fit: cover`, la imagen pintada cabe en su
 *       caja y la llena (no queda más chica de lo que necesita)
 *   A4  ninguna imagen supera el tope de alto (88svh)
 *   A5  en cada par las dos mitades y las dos imágenes miden lo mismo, ±1 px
 *   A10 sin aire horizontal en el par: izq + der + 2 px = ancho de la fila, ±1 px
 *   A6  sin scroll horizontal
 *   A7  en cada par la imagen más baja queda centrada vertical en su mitad
 *   A8  el `sizes` declara el ancho que de verdad se pinta
 *   A9  (informe) el tope de ancho que viaja a Sanity contra el ancho pintado × 2
 *   S   alcance: solo cambian los archivos permitidos de la tanda
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { launchChrome } from "./cdp.mjs";
import { openPage } from "./page.mjs";
import { startServer } from "./server.mjs";

const ROUTES = ["akasha-blends", "pepe", "tukumi"];
const LOCALES = ["en", "es"];
const WIDTHS = [390, 768, 1024, 1366, 1920];
const HEIGHTS = [720, 1080];
const RATIO_TOL = 0.005; // 0,5 %
const PAIR_TOL_PX = 1;
const PAIR_GAP_PX = 2;
const CAP_VH = 0.88;

// Alcance permitido de la tanda R5 (rutas desde la raíz del repositorio).
const ALLOWED_SCOPE = [
  /^esquina-estudio\/src\/components\/ui\/ProjectContentRenderer\.tsx$/,
  /^esquina-estudio\/tools\/bench\//,
  /^esquina-estudio\/research\//,
  /^esquina-estudio\/docs\/bitacora\.md$/,
];

const results = [];
function check(id, label, ok, detail) {
  results.push({ id, label, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${label} — ${detail}`);
}
const pct = (n) => `${(n * 100).toFixed(3)}%`;
const f = (n, d = 4) => Number(n).toFixed(d);

/* ── Verdad: dimensiones de cada imagen según la API pública de Sanity ── */
function projectId() {
  const env = readFileSync(".env.local", "utf8");
  const match = /^NEXT_PUBLIC_SANITY_PROJECT_ID=(.*)$/m.exec(env);
  if (!match) throw new Error("Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

async function expectedImages(slug) {
  const query = `*[_type=="project" && slug.current==$slug][0].content[_type in ["mediaItem","dualMedia"]]{
    _type, video, "file": file.asset._ref, "left": left.asset._ref, "right": right.asset._ref }`;
  const url =
    `https://${projectId()}.api.sanity.io/v2024-01-01/data/query/production` +
    `?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;
  const { result } = await (await fetch(url)).json();
  const dims = (ref) => {
    const m = /^image-[a-f0-9]+-(\d+)x(\d+)-[a-z]+$/.exec(ref ?? "");
    if (!m) throw new Error(`Id de asset sin dimensiones: ${ref}`);
    return { ref, width: Number(m[1]), height: Number(m[2]) };
  };
  const out = [];
  for (const block of result ?? []) {
    if (block._type === "mediaItem" && !block.video && block.file) {
      out.push({ ...dims(block.file), slot: "single" });
    } else if (block._type === "dualMedia") {
      const slot = block.left && block.right ? "half" : "single";
      if (block.left) out.push({ ...dims(block.left), slot });
      if (block.right) out.push({ ...dims(block.right), slot });
    }
  }
  return out;
}

/* ── Sonda en la página ─────────────────────────────────────────────── */
const PROBE = `(async () => {
  const frames = Array.from(document.querySelectorAll("[data-media-frame]"));
  // Todas eager: una imagen diferida sin cargar no tiene naturalWidth (§7b).
  frames.forEach((fr) => fr.querySelectorAll("img").forEach((i) => { i.loading = "eager"; }));
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const imgs = frames.map((fr) => fr.querySelector("img"));
    if (imgs.every((i) => i && i.complete && i.naturalWidth > 0)) break;
    await new Promise((r) => setTimeout(r, 50));
  }
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
  const declaredWidth = (sizes) => {
    const parts = []; let depth = 0, cur = "";
    for (const ch of sizes) {
      if (ch === "(") depth++; if (ch === ")") depth--;
      if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; } else cur += ch;
    }
    parts.push(cur.trim());
    for (const part of parts) {
      const m = /^(\\([^)]*\\))\\s+(.*)$/.exec(part);
      if (m && !matchMedia(m[1]).matches) continue;
      const len = m ? m[2] : part;
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;height:1px;width:" + len;
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      return w;
    }
    return null;
  };
  const images = frames.map((fr, index) => {
    const img = fr.querySelector("img");
    const half = fr.closest("[data-media-half]");
    const row = half ? half.parentElement : null;
    const ir = rect(img), cs = getComputedStyle(img);
    const nw = img.naturalWidth, nh = img.naturalHeight;
    let pw = ir.w, ph = ir.h;
    if (cs.objectFit === "contain") { const s = Math.min(ir.w / nw, ir.h / nh); pw = nw * s; ph = nh * s; }
    else if (cs.objectFit === "cover") { const s = Math.max(ir.w / nw, ir.h / nh); pw = nw * s; ph = nh * s; }
    else if (cs.objectFit === "none") { pw = nw; ph = nh; }
    const sizes = img.getAttribute("sizes");
    return {
      index, frame: rect(fr), img: ir, painted: { w: pw, h: ph }, natural: { w: nw, h: nh },
      objectFit: cs.objectFit, sizes, declared: sizes ? declaredWidth(sizes) : null,
      src: img.currentSrc || img.src, half: !!half,
      rowIndex: row ? Array.from(document.querySelectorAll("[data-media-half]")).map((h) => h.parentElement).indexOf(row) : -1,
      row: row ? rect(row) : null, halfWidth: half ? half.getBoundingClientRect().width : null,
    };
  });
  return {
    images, vh: window.innerHeight, vw: window.innerWidth,
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  };
})()`;

/* ── Aserciones ─────────────────────────────────────────────────────── */
function sanityWidthOf(src) {
  try {
    const raw = new URL(src, "http://x").searchParams.get("url") ?? src;
    return Number(new URL(raw).searchParams.get("w")) || null;
  } catch {
    return null;
  }
}

async function measureRoute(client, server, slug) {
  const expected = await expectedImages(slug);
  const samples = []; // { locale, w, h, probe }
  for (const locale of LOCALES) {
    const page = await openPage(client, { width: WIDTHS[0], height: HEIGHTS[0], locale });
    await page.goto(`${server.origin}/work/${slug}`);
    for (const w of WIDTHS) {
      for (const h of HEIGHTS) {
        await page.setViewport(w, h);
        await page.settle(200);
        samples.push({ locale, w, h, probe: await page.evaluate(PROBE) });
      }
    }
    await page.close();
  }
  return { expected, samples };
}

function assertRoute(slug, { expected, samples }) {
  const tag = `/work/${slug}`;
  const counts = new Set(samples.map((s) => s.probe.images.length));
  check("A0", `${tag} imágenes renderizadas = imágenes del contenido`,
    counts.size === 1 && counts.has(expected.length),
    `API ${expected.length}, DOM ${[...counts].join("/")} en ${samples.length} muestras`);
  if (!(counts.size === 1 && counts.has(expected.length))) return;

  expected.forEach((exp, i) => {
    const want = exp.width / exp.height;
    const name = `${tag} img#${i} (${exp.width}x${exp.height}, ${exp.slot})`;
    const frameRatios = samples.map((s) => s.probe.images[i].frame.w / s.probe.images[i].frame.h);
    const paintedRatios = samples.map((s) => s.probe.images[i].painted.w / s.probe.images[i].painted.h);
    const dev = (arr) => Math.max(...arr.map((r) => Math.abs(r / want - 1)));
    check("A1", `${name} proporción`, dev(frameRatios) <= RATIO_TOL && dev(paintedRatios) <= RATIO_TOL,
      `foto ${f(want)} · caja ${f(Math.min(...frameRatios))}..${f(Math.max(...frameRatios))} (desvío ${pct(dev(frameRatios))}) · pintada desvío ${pct(dev(paintedRatios))} · ${samples.length} muestras`);

    const spread = Math.max(...frameRatios) / Math.min(...frameRatios) - 1;
    check("A2", `${name} la proporción no se mueve`, spread <= RATIO_TOL,
      `caja ${f(Math.min(...frameRatios))}..${f(Math.max(...frameRatios))} · dispersión ${pct(spread)} entre ${WIDTHS.length * HEIGHTS.length} combinaciones × ${LOCALES.length} idiomas`);

    const covers = samples.filter((s) => s.probe.images[i].objectFit === "cover").length;
    const overflow = Math.max(...samples.map((s) => {
      const im = s.probe.images[i];
      return Math.max(im.painted.w / im.img.w, im.painted.h / im.img.h) - 1;
    }));
    const fill = Math.min(...samples.map((s) => {
      const im = s.probe.images[i];
      return Math.min(im.painted.w / im.frame.w, im.painted.h / im.frame.h);
    }));
    check("A3", `${name} sin recorte`, covers === 0 && overflow <= RATIO_TOL && fill >= 1 - RATIO_TOL,
      `object-fit:cover en ${covers}/${samples.length} muestras · exceso de la pintada sobre su caja ${pct(Math.max(0, overflow))} · llenado mínimo ${pct(fill)}`);

    // En un par el tope es el de la fila (R5.1): se mide el alto de la fila.
    const capped = (s) => { const im = s.probe.images[i]; return im.half ? im.row.h : im.frame.h; };
    const worst = Math.max(...samples.map((s) => capped(s) / (s.probe.vh * CAP_VH)));
    check("A4", `${name} tope de alto${exp.slot === "half" ? " (de la fila)" : ""}`, worst <= 1 + 0.5 / 600,
      `alto/tope máximo ${f(worst)} (1 = justo en 88svh)`);

    const minW = Math.min(...samples.map((s) => s.probe.images[i].frame.w));
    const widths = samples.filter((s) => s.probe.images[i].declared !== null).map((s) => {
      const im = s.probe.images[i];
      return { diff: im.declared - im.frame.w, s };
    });
    if (widths.length) {
      const lo = Math.min(...widths.map((x) => x.diff));
      const hi = Math.max(...widths.map((x) => x.diff));
      check("A8", `${name} sizes = ancho pintado`, lo >= -0.5 && hi <= 1.5,
        `declarado − pintado ${f(lo, 2)}..${f(hi, 2)} px en ${widths.length} muestras (ancho pintado mín ${f(minW, 1)} px)`);
    } else {
      check("A8", `${name} sizes`, true, "<img> nativo (GIF): sin sizes, no aplica");
    }
  });

  // Pares
  const pairRows = new Map();
  samples.forEach((s, si) => s.probe.images.forEach((im) => {
    if (!im.half) return;
    const k = `${si}|${im.rowIndex}`;
    if (!pairRows.has(k)) pairRows.set(k, []);
    pairRows.get(k).push(im);
  }));
  const rowIds = new Set([...pairRows.keys()].map((k) => k.split("|")[1]));
  for (const rid of rowIds) {
    const rows = [...pairRows.entries()].filter(([k]) => k.endsWith(`|${rid}`)).map(([, v]) => v).filter((v) => v.length === 2);
    if (!rows.length) continue;
    const diffs = rows.map(([a, b]) => Math.abs(a.halfWidth - b.halfWidth));
    const imgDiffs = rows.map(([a, b]) => Math.abs(a.frame.w - b.frame.w));
    check("A5", `${tag} par#${rid} mitades e imágenes iguales`,
      Math.max(...diffs) <= PAIR_TOL_PX && Math.max(...imgDiffs) <= PAIR_TOL_PX,
      `|mitad izq − mitad der| máx ${f(Math.max(...diffs), 3)} px · |imagen izq − imagen der| máx ${f(Math.max(...imgDiffs), 3)} px en ${rows.length} muestras (mitad típica ${f(rows[0][0].halfWidth, 1)} px)`);
    // A10: la suma de las dos imágenes y el aire de 2 px es el ancho de la fila.
    const airs = rows.map(([a, b]) => a.row.w - (a.frame.w + b.frame.w + PAIR_GAP_PX));
    const worstAir = airs.reduce((m, v) => (Math.abs(v) > Math.abs(m) ? v : m), 0);
    check("A10", `${tag} par#${rid} sin aire horizontal`, Math.abs(worstAir) <= PAIR_TOL_PX,
      `fila − (izq + der + ${PAIR_GAP_PX}) máx ${f(worstAir, 3)} px en ${rows.length} muestras`);
    for (const [k, v] of pairRows.entries()) {
      const [si, r] = k.split("|");
      if (r !== rid || v.length !== 2 || samples[Number(si)].locale !== "en") continue;
      const s = samples[Number(si)];
      console.log(`INFO A10 ${tag} par#${rid} ${s.w}×${s.h}: fila ${f(v[0].row.w, 1)} = izq ${f(v[0].frame.w, 1)} + der ${f(v[1].frame.w, 1)} + ${PAIR_GAP_PX} → aire ${f(v[0].row.w - v[0].frame.w - v[1].frame.w - PAIR_GAP_PX, 2)} px`);
    }
    const gaps = rows.flatMap((pair) => pair.map((im) => {
      const top = im.frame.y - im.row.y;
      const bottom = im.row.y + im.row.h - (im.frame.y + im.frame.h);
      return Math.abs(top - bottom);
    }));
    const rowFit = rows.map((pair) => Math.abs(pair[0].row.h - Math.max(...pair.map((p) => p.frame.h))));
    check("A7", `${tag} par#${rid} centrado vertical`, Math.max(...gaps) <= PAIR_TOL_PX && Math.max(...rowFit) <= PAIR_TOL_PX,
      `|aire arriba − aire abajo| máx ${f(Math.max(...gaps), 3)} px · |alto de fila − alto de la más alta| máx ${f(Math.max(...rowFit), 3)} px`);
  }

  const over = samples.map((s) => s.probe.scrollW - s.probe.clientW);
  check("A6", `${tag} sin scroll horizontal`, Math.max(...over) <= 0,
    `scrollWidth − clientWidth máx ${Math.max(...over)} px en ${samples.length} muestras`);

  // A9: informe
  expected.forEach((exp, i) => {
    const s = samples.find((x) => x.w === 1920 && x.h === 1080 && x.locale === "en");
    const im = s.probe.images[i];
    const cap = sanityWidthOf(im.src);
    const need = Math.min(Math.ceil(im.frame.w * 2), exp.width);
    console.log(`INFO A9 ${tag} img#${i}: tope a Sanity w=${cap} · pintada ${f(im.frame.w, 0)} px ×2 = ${Math.ceil(im.frame.w * 2)} (original ${exp.width}) · ${cap !== null && cap < need ? "TOPE MUERDE" : "tope no muerde"}`);
  });
}

function checkScope() {
  const root = execFileSync("git", ["rev-parse", "--show-toplevel"]).toString().trim();
  const git = (...args) => execFileSync("git", ["-C", root, ...args]).toString().split("\n").filter(Boolean);
  const changed = [...new Set([...git("diff", "--name-only", "main"), ...git("ls-files", "--others", "--exclude-standard")])];
  const outside = changed.filter((p) => !ALLOWED_SCOPE.some((re) => re.test(p)));
  check("S", "alcance de archivos", outside.length === 0,
    `${changed.length} archivos cambiados contra main, ${outside.length} fuera de lo permitido${outside.length ? `: ${outside.join(", ")}` : ""}`);
}

/* ── Corrida ────────────────────────────────────────────────────────── */
const detail = {};
const server = await startServer();
const client = await launchChrome();
try {
  for (const slug of ROUTES) {
    const data = await measureRoute(client, server, slug);
    detail[slug] = data;
    assertRoute(slug, data);
  }
} finally {
  await client.close();
  server.stop();
}
checkScope();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} aserciones en verde, ${failed.length} en rojo`);
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify({ results, detail }, null, 1));
process.exit(failed.length ? 1 : 0);
