# AUDITORÍA COMPLETA DEL REPO — Esquina Estudio

> ## ⚠ PARCIALMENTE OBSOLETA — leer esto antes de usarla (nota agregada en R2, 2026-09-01)
>
> **Este documento describe el repo en el commit `2565d01`, del 13 de agosto de
> 2026.** No es el estado del código: entre esa fecha y hoy pasaron los bloques
> B1–B4, trece sprints (M1–M13) y la ronda 2 de devoluciones. Sigue siendo **la
> base de hechos de cómo estaba el repo aquel día** —para eso se conserva— pero
> **no se cita como si describiera el presente**.
>
> Dos ejemplos concretos, para que se vea el orden de magnitud del desfase:
>
> - **§3.4 rastrea `TITLE_1_LINE_COUNT` y lo marca de riesgo ALTO. Ese símbolo no
>   existe desde B3.4**, que desmontó el scroll-jack de `/services` entero. Lo
>   mismo vale para `TITLE_LINE_COUNT` del Hero, para el centinela
>   `"Applications may include:"` y para el `id="services-list"`.
> - Todo lo que dice sobre `/fun-gallery` y `/services` describe el diseño
>   **anterior** a B3: la galería derivaba de los `project` y no tenía schema
>   propio, y Services tenía una máquina de estados S0–S5 con lock de scroll.
>
> **Qué leer en su lugar, según lo que se busque:**
>
> | Si buscás… | Leé |
> | --- | --- |
> | El estado del código hoy | `CLAUDE.md` (raíz del proyecto), que separa ESTADO de PLAN |
> | Qué se decidió y cuándo | `docs/plan-maestro.md` |
> | Qué pasó en cada sprint, con sus mediciones | `docs/bitacora.md` |
> | Qué quedó abierto | `docs/pendientes.md` |

**Commit HEAD:** `2565d01a7917dfa12aeab8c13abce4660ab54c23`
**Branch:** `main`
**Fecha de corrida:** 2026-08-14
**Estado del working tree:** limpio salvo un directorio sin trackear.
`git status --porcelain` devuelve exactamente una línea:

```
?? esquina-estudio/docs/instrucciones/
```

No hay archivos modificados ni staged. El único contenido sin trackear es el
directorio de instrucciones de esta misma auditoría.

**Raíz del repo git:** `C:/EsquinaWeb`
**Raíz del proyecto Next:** `C:/EsquinaWeb/esquina-estudio`

**Método:** read-only. La única escritura de la corrida es este archivo.

---

## ESTADO DE LA AUDITORÍA

| Bloque | Tema | Estado |
|---|---|---|
| 0 | Base y confianza del terreno | **PARCIAL — cerrado en sesión 7 salvo el DESCONOCIDO nº 1 (branches mergeadas)** |
| 1 | Shell, rutas, transiciones, toggle de idioma | **COMPLETO** |
| 2.a | Medición bloqueante de escala tipográfica | **COMPLETO** (+ adenda de cierre, sesión 3) |
| 2.b | Dónde viven los tamaños | **COMPLETO** (sesión 4) |
| 2.c | Censo de textos fijos | **COMPLETO** (sesión 4) |
| 3 | Services | **COMPLETO** (sesión 5 — reemplaza y amplía el ANEXO A) |
| 4 | Fun Gallery | **COMPLETO** |
| 5 | Work grid / Work single / Contact / Team | **COMPLETO** (sesión 7 — Contact reespecificado tras la parada de sesión 6) |
| 6 | Primitivos compartidos y zonas de colisión | **COMPLETO** (sesión 4) |
| 7 | Sanity | **COMPLETO** (relevado por subagente — ver nota de procedencia) |
| 8 | Baseline de rendimiento | **NO CORRER** hasta pedido explícito |

**Historial de sesiones**

- **Sesión 1** (cortada por límite de cuota): Bloque 0 relevado, 25 archivos
  leídos íntegros, Bloque 7 completado por subagente. Tres subagentes más
  murieron sin devolver nada (censo de strings, primitivos compartidos,
  documentación vs. código).
- **Sesión 2**: salvataje del material de la sesión 1, Bloque 2.a y
  cierre del Bloque 1. Método secuencial, sin subagentes, escritura incremental.
- **Sesión 3** (2026-08-14): adenda de cierre del Bloque 2.a (conversión
  pt→px) y Bloque 4 completo. Mismo método. Mediciones nuevas: pool real de la
  galería contra el dataset (API + DOM), inspección binaria de alpha con sharp,
  sha1 de los originales, docs embarcadas de Next 16.2.6.
- **Sesión 4** (2026-08-14): cierre del DESCONOCIDO nº 1 del Bloque 4 por
  dato externo del usuario, Bloque 6 completo, Bloque 2.b completo y Bloque 2.c
  completo. Mismo método: secuencial, sin subagentes, read-only salvo este
  archivo. Todo leído de disco de primera mano.
- **Sesión 5** (esta, 2026-08-14): **Bloque 3 completo** — único paso de la
  sesión, por instrucción explícita. Mismo método: secuencial, sin subagentes,
  read-only salvo este archivo. Los cinco archivos de Services releídos íntegros
  de disco, más `SmoothScrollProvider`, `PreloaderProvider`, `template.tsx`,
  `RevealOnScroll` y greps exhaustivos de observadores/sticky/scroll. La parada
  condicional de la instrucción no se activó: los cuatro supuestos de la
  instrucción se confirmaron contra el código. Working tree de esta sesión:
  limpio salvo `docs/instrucciones/` y `docs/reportes/` sin trackear.
- **Sesión 6** (2026-08-14): **PARADA CONDICIONAL ACTIVADA — el Bloque 5 NO se
  corrió.** La instrucción del Bloque 5.a da por sentado que `/contact` tiene
  scroll interno (la arquitectura de `CLAUDE.md` §8.1); esa arquitectura fue
  reemplazada en los commits del 2026-06-03/04 y no existe en HEAD. Detalle
  completo, con evidencia y datación, en la sección final del reporte. Los
  pasos 2 (cierre de DESCONOCIDOS del Bloque 0) y 3 (sección CIERRE) de la
  instrucción **tampoco se corrieron**, por la parada. Lecturas de esta sesión:
  `contact/page.tsx`, `ContactForm.tsx` (íntegro), `(site)/layout.tsx`,
  `(site)/template.tsx`, `Footer.tsx:68-117`, greps dirigidos y `git log`/
  `git show` de datación. Read-only salvo este archivo.
- **Sesión 7** (2026-08-14): la parada de sesión 6 fue aceptada por el usuario y
  Contact llegó reespecificado sobre la arquitectura real. **Bloque 5 completo**
  (con medición runtime de Contact vía dev server preexistente en `:3000` +
  ventana de navegador dimensionada), **cierre de los DESCONOCIDOS menores del
  Bloque 0** (`netlify.toml`, `settings.local.json`, `AGENTS.md`, `README.md`,
  `i18next` en el lock, más `.gitignore` y los devserver logs), **barrido
  completo de `CLAUDE.md` y `AGENTS.md` contra el código**, y sección **CIERRE**
  consolidada. Mismo método: secuencial, sin subagentes, read-only salvo este
  archivo. La parada condicional NO se activó: las premisas de la instrucción
  se confirmaron una por una contra código y runtime.

---

## NÚMEROS CLAVE

| # | Valor | Estado |
|---|---|---|
| 1 | fontSize menú / hero / Team + ratios | **RESUELTO** — ver abajo |
| 2 | Strings de UI hardcodeados, por 4 categorías | **RESUELTO** (sesión 4) — **450 = 365 + 15 + 16 + 54**; sin países ni catálogo de Services: ~146. Ver Bloque 2.c |
| 3 | Imágenes del pool derivado de Fun Gallery que se pierden | **RESUELTO** — **7 (4 portadas + 3 internas)**, ver abajo |
| 4 | Campos traducibles × proyectos publicados | **RESUELTO completo** — ver abajo |
| 5 | Rutas estáticas vs. dinámicas en el build | **RESUELTO** — ver abajo |
| 6 | Clasificación de build de `/fun-gallery` | **RESUELTO** — `ƒ (Dynamic)` |
| 7 | Formatos de imagen en `next.config` y si preservan alpha | **RESUELTO** — ver abajo |

**Nº 1 — medido el 2026-08-14 sobre `next dev`, con `getComputedStyle`.**

| Elemento | 1920 px | 700 px |
|---|---|---|
| Tab del menú (`WORK`) | **13 px** | **13 px** |
| Hero de Home | **40 px** | **40 px** |
| Párrafo de Team | **30 px** | **24 px** |
| **Ratio hero ÷ menú** | **3.077** | **3.077** |
| **Ratio Team ÷ menú** | **2.308** | **1.846** |

Anotaciones de las clientas, para contraste: 40/17 = 2.353 y 30/17 = 1.765.
Píxeles del mockup: 2.22 y 1.67. **El reporte entrega el número medido, no la
conclusión.** Detalle completo en el Bloque 2.a.

**Nº 4 — resuelto completo (sesión 3).** Campos de texto traducibles de nivel
raíz por proyecto: **3** (`title`, `category`, `services`). Proyectos publicados
en el dataset `production`: **4** (medido en el build — ver Bloque 1, cierre).
**3 × 4 = 12 campos raíz.** El contenido de los 4 documentos, consultado por API
en la sesión 3 (Bloque 4.c): **7 bloques Portable Text y 0 `mediaItem.caption`
cargados.** Total: **12 + 7 + 0 = 19 piezas de texto** a recargar para poner el
contenido existente en dos idiomas.

**Nº 3 — resuelto (sesión 3, medido por API + réplica de la derivación + conteo
del DOM, con coincidencia exacta).** El pool derivado de Fun Gallery produce hoy
**7 imágenes: 4 portadas + 3 internas de galería** (9 candidatos con asset, 2
eliminados por deduplicación). Eso es lo que la galería deja de mostrar al
cambiar la fuente, contra 8 assets nuevos anunciados. Detalle en el Bloque 4.c.

**Nº 5 — resuelto** (`npm run build`, 2026-08-14): **6 rutas de página estáticas**
(`/`, `/_not-found`, `/contact/success`, `/services`, `/team`, `/work`), **1
patrón SSG** (`/work/[slug]`, 4 páginas prerenderizadas) y **3 rutas de página
dinámicas** (`/contact`, `/fun-gallery`, `/studio/[[...tool]]`), más 2 route
handlers dinámicos (`/api/contact`, `/api/seed-sanity`).

**Nº 7 — resuelto.** `next.config.ts:11`:

```ts
    formats: ["image/avif", "image/webp"],
```

Ambos formatos soportan canal alpha. No hay `qualities`, `deviceSizes` ni
`imageSizes` declarados en el archivo — `next.config.ts` completo son 15 líneas
y solo contiene `images.remotePatterns` + `images.formats`.

La construcción de URL de Sanity **no fuerza formato ni color de fondo**.
`src/components/sections/gallery/FunGallery.tsx:160`:

```ts
  const transformedUrl = urlFor(image).width(1200).quality(90).url();
```

No hay `.format()`, no hay `.bg()`, no hay `.fit()`, no hay `auto()`.

**Nº 4 — nota de composición.** Los campos de `project` que son texto visible
traducible: `title`, `category`, `services`, los bloques Portable Text de
`content`, y `mediaItem.caption`. Detalle campo por campo en el Bloque 7. (La
cantidad de proyectos publicados, que en la sesión 1 era DESCONOCIDO, quedó
medida en 4 por el build — Bloque 1, cierre — y confirmada por API en la sesión
3. Los tres conjuntos locales del repo siguen teniendo conteos y slugs
inconsistentes entre sí, 8 / 8 / 4, y ninguno coincide con el dataset — ver
7.12.)

---

# BLOQUE 0 — Base y confianza del terreno  `[PARCIAL]`

## 0.1 — Git

```
$ git rev-parse HEAD
2565d01a7917dfa12aeab8c13abce4660ab54c23

$ git rev-parse --abbrev-ref HEAD
main

$ git status --porcelain
?? esquina-estudio/docs/instrucciones/
```

`git log --oneline -20 --date=short --pretty='%h %ad %s'`:

```
2565d01 2026-06-05 commit pagina v1.1
ed45c8c 2026-06-05 commit pagina v1.1
1341579 2026-06-04 commit correcciones hechas
48af037 2026-06-04 commit correcciones hechas
b634521 2026-06-04 fix(sticky): (site)/template a transicion solo-opacidad (fix coordinado regla #5)
e4a56ad 2026-06-04 merge: fix/header (correccion ronda 2)
6424ee7 2026-06-04 merge: fix/preloader (correccion ronda 2)
19f56f6 2026-06-04 merge: fix/contact (correccion ronda 2)
fe1855a 2026-06-04 merge: fix/services-intro (correccion ronda 2)
c971917 2026-06-04 merge: fix/work-single (correccion ronda 2)
79133ee 2026-06-04 merge: fix/work-grid (correccion ronda 2)
f64867f 2026-06-04 fix(services-intro): reveal text-1 by opacity-only + seamless static swap
cc6e0f0 2026-06-04 fix(header): empujar idle fill a 110% para eliminar hairline anti-aliased tras hover
8196dab 2026-06-04 fix(contact): visible input selection, solid footer, sticky aside offset
643e566 2026-06-04 feat(preloader): gate animacion por sessionStorage — una vez por sesion
7718427 2026-06-04 fix(work-single): revert images to 4:3 cover; report aside investigation
86702bf 2026-06-04 fix(work-grid): increase staggerChildren to 0.7 for marked cascade
efec938 2026-06-04 chore: infra ronda 2 (correcciones) — specs + briefs + lane preloader
c876bb7 2026-06-04 commit
770d25b 2026-06-03 merge: lane/header (refinamiento header)
```

**El último commit es del 2026-06-05.** No hay commits entre junio y hoy
(2026-08-14).

## 0.2 — Branches y worktrees

`git branch -a`:

```
  Animaciones-Estilo-Apple
  fix/contact
  fix/header
  fix/preloader
  fix/services-intro
  fix/work-grid
  fix/work-single
  lane/contact
  lane/header
  lane/services-intro
  lane/work-grid
  lane/work-single
* main
  remotes/origin/main
```

**12 branches locales además de `main`**, en dos familias: `lane/*` (5) y
`fix/*` (6), más `Animaciones-Estilo-Apple`. El log muestra commits de merge
para `fix/header`, `fix/preloader`, `fix/contact`, `fix/services-intro`,
`fix/work-single`, `fix/work-grid` (`e4a56ad`, `6424ee7`, `19f56f6`, `fe1855a`,
`c971917`, `79133ee`) y para `lane/header` (`770d25b`).

**DESCONOCIDO:** cuáles de esos branches están efectivamente mergeados a `main`
hoy. No se corrió `git branch --merged main`. Haría falta ese comando para
afirmarlo; la existencia de un commit de merge en el log no prueba que la punta
actual del branch esté contenida en `main`.

`git worktree list`:

```
C:/EsquinaWeb 2565d01 [main]
```

**Un solo worktree.** No quedan worktrees de sprints anteriores.

## 0.3 — `package.json` completo

`esquina-estudio/package.json` (41 líneas). Scripts (`:5-10`):

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
```

`dependencies` (`:11-28`):

| Paquete | Versión declarada | Línea |
|---|---|---|
| `@hookform/resolvers` | `^5.2.2` | `package.json:12` |
| `@portabletext/react` | `^6.2.0` | `package.json:13` |
| `@sanity/client` | `^7.22.0` | `package.json:14` |
| `@sanity/image-url` | `^2.1.1` | `package.json:15` |
| `@sanity/vision` | `^5.25.1` | `package.json:16` |
| `@studio-freight/lenis` | `^1.0.42` | `package.json:17` |
| `clsx` | `^2.1.1` | `package.json:18` |
| `framer-motion` | `^12.38.0` | `package.json:19` |
| `gsap` | `^3.15.0` | `package.json:20` |
| `next` | `16.2.6` (pin exacto) | `package.json:21` |
| `next-sanity` | `^12.4.5` | `package.json:22` |
| `react` | `19.2.4` (pin exacto) | `package.json:23` |
| `react-dom` | `19.2.4` (pin exacto) | `package.json:24` |
| `react-hook-form` | `^7.75.0` | `package.json:25` |
| `resend` | `^6.12.3` | `package.json:26` |
| `zod` | `^4.4.3` | `package.json:27` |

`devDependencies` (`:29-40`):

| Paquete | Versión declarada | Línea |
|---|---|---|
| `@sanity/cli` | `^6.5.3` | `package.json:30` |
| `@tailwindcss/postcss` | `^4` | `package.json:31` |
| `@types/node` | `^20` | `package.json:32` |
| `@types/react` | `^19` | `package.json:33` |
| `@types/react-dom` | `^19` | `package.json:34` |
| `eslint` | `^9` | `package.json:35` |
| `eslint-config-next` | `16.2.6` | `package.json:36` |
| `sharp` | `^0.34.5` | `package.json:37` |
| `tailwindcss` | `^4` | `package.json:38` |
| `typescript` | `^5` | `package.json:39` |

### Confirmación del stack declarado en el Contexto de la instrucción

| Ítem del Contexto | Veredicto |
|---|---|
| Next.js 16.2.6 App Router | **CONFIRMADO** — `package.json:21`, pin exacto `"next": "16.2.6"` |
| React 19 | **CONFIRMADO** — `package.json:23-24`, pin exacto `19.2.4` |
| TypeScript | **CONFIRMADO** — `package.json:39` (`^5`), devDependency |
| Tailwind v4 | **CONFIRMADO** — `package.json:38` (`tailwindcss: ^4`) + `@tailwindcss/postcss` (`:31`) |
| Framer Motion 12 | **CONFIRMADO** — `package.json:19` (`^12.38.0`) |
| GSAP 3 + ScrollTrigger | **CONFIRMADO** — `package.json:20` (`gsap: ^3.15.0`). ScrollTrigger se importa desde el propio paquete: `src/components/sections/services/ServicesStack.tsx:6` — `import { ScrollTrigger } from "gsap/ScrollTrigger";` |
| Lenis | **CONFIRMADO con matiz** — el paquete es `@studio-freight/lenis` (`package.json:17`), el nombre legacy, no el actual `lenis` |
| Sanity (`next-sanity`) | **CONFIRMADO** — `package.json:22` |
| react-hook-form + zod | **CONFIRMADO** — `package.json:25` y `:27`. Nota: zod es **v4** (`^4.4.3`), no v3 |
| resend | **CONFIRMADO** — `package.json:26` |
| Netlify | **PARCIAL** — existe `netlify.toml` en la raíz del proyecto (106 bytes). Su contenido no fue leído. |

**Hallazgo adicional no listado en el Contexto:** `sharp ^0.34.5` está en
devDependencies (`package.json:37`). Es el optimizador de imágenes que usa Next
en build; importa para el Bloque 4.d.

## 0.4 — Constatación de i18n en dependencias

**Verificado leyendo `package.json` íntegro (41 líneas).** Ninguno de estos
paquetes aparece en `dependencies` ni en `devDependencies`:

`i18next` · `react-i18next` · `next-intl` · `next-translate` · `next-i18next` ·
`@formatjs/*` · `lingui` · `@sanity/document-internationalization` ·
`intl-messageformat`

**No hay ninguna librería de internacionalización como dependencia directa.**

**PENDIENTE:** la verificación en `package-lock.json` de que `i18next` entra
solo de forma transitiva (marcado `"peer": true`, presumiblemente vía Sanity
Studio) y de qué paquete lo arrastra. El subagente asignado a esa tarea murió
por límite de cuota antes de devolverla. Haría falta un grep con contexto sobre
`package-lock.json` buscando la entrada `node_modules/i18next` y las entradas
que la listan en sus `peerDependencies`.

**PENDIENTE:** el grep en `src/` por rastros de i18n ya empezada (`i18n`,
`locale`, `translat`, `idioma`, `lang`). Se cubre parcialmente en el Bloque 1.

## 0.5 — Contenido de `.claude/` y harness ECC

`ls -laR C:/EsquinaWeb/.claude`:

```
.claude:
-rw-r--r-- 1 Valentino 197610 1922 jun.  4 18:04 settings.local.json
```

`ls -laR C:/EsquinaWeb/esquina-estudio/.claude` → **no existe** (salida vacía).

**El harness ECC NO está instalado en este repo.** Evidencia:

- El único archivo bajo `.claude/` es `settings.local.json` (1922 bytes).
- **No existe `.claude/agents/`.**
- **No existe `.claude/commands/`.**
- **No existe `.claude/hooks/`.**
- **No existe `.claude/skills/`.**
- No hay ningún `.claude/` dentro de `esquina-estudio/`.

**Comandos y subagentes realmente disponibles en el repo: ninguno.** No hay
slash commands ni definiciones de subagente versionadas ni locales.

Esto contradice directamente lo que `CLAUDE.md` describe como método de trabajo.
`CLAUDE.md:96` (§6):

> Cinco subagentes, **uno por sección**, cada uno como markdown en `.claude/agents/`

Ese directorio no existe. Los agentes de la ronda de junio no quedaron
versionados.

**PENDIENTE:** transcripción del contenido de `settings.local.json`. No se leyó.

## 0.6 — Registros del método (bitácora, plan maestro, pendientes)

`git ls-files` devuelve **93 archivos trackeados**. La lista completa de
directorios de documentación trackeados es:

```
esquina-estudio/AGENTS.md
esquina-estudio/CLAUDE.md
esquina-estudio/README.md
esquina-estudio/docs/sanity-studio-guide.md
```

`ls -laR esquina-estudio/docs`:

```
esquina-estudio/docs:
drwxr-xr-x  ... instrucciones
-rw-r--r--  968 may. 15 18:42 sanity-studio-guide.md

esquina-estudio/docs/instrucciones:
-rw-r--r-- 30698 ago. 13 20:39 AUDITORIA-esquina-v3-FINAL.md
```

`ls -la` de la raíz del repo y de `esquina-estudio/`:

```
C:/EsquinaWeb:            .claude  .git  esquina-estudio
C:/EsquinaWeb/esquina-estudio:
  .env.local  .gitignore  .next  AGENTS.md  "Asset_ Imágenes"  "Asset_ Logo"
  "Asset_ Tipografía"  CLAUDE.md  design-refs  devserver.err.log
  devserver.log  docs  eslint.config.mjs  logos  netlify.toml  next.config.ts
  next-env.d.ts  node_modules  package.json  package-lock.json
  postcss.config.mjs  public  README.md  src  tailwind.config.ts  tipografia
  tsconfig.json  tsbuildinfo
```

**Ausencias verificadas** (ni en `git ls-files`, ni en el `ls` de ambos niveles):

- **NO existe `.develop/`**
- **NO existe `planning/`**
- **NO existe ningún `*bitacora*`**
- **NO existe ningún `PENDIENTES*`**
- **NO existe ningún `PLAN*`**
- **NO existe `briefs/` ni `specs/`**

**El único registro de método versionado es `CLAUDE.md`** (9947 bytes,
modificado 2026-06-03), que en su §6-§8 describe el método de subagentes por
carril y ocho hallazgos de causa raíz. No hay bitácora ni registro de pendientes.

Esto choca con `CLAUDE.md:99` (§6), que habla de recolectar reportes de
subagentes, y con el commit `efec938` (`chore: infra ronda 2 (correcciones) —
specs + briefs + lane preloader`): los specs y briefs mencionados en ese mensaje
de commit **no están en el árbol de trabajo actual**.

**Matiz honesto sobre el alcance de esta afirmación.** Cuatro directorios
aparecen en `ls` pero no en `git ls-files` ni en `git status --porcelain`:
`Asset_ Imágenes`, `Asset_ Logo`, `Asset_ Tipografía` y `design-refs`. Como
`git status` no los reporta como sin trackear, están cubiertos por `.gitignore`.
**No se inspeccionó su contenido**, así que no puedo afirmar que no haya
documentación de método adentro. `.gitignore` tampoco fue leído.

## 0.7 — Documentación contra código

`[PARCIAL]` — el subagente asignado al barrido exhaustivo murió por cuota. Lo
que sigue son las apariciones verificadas de primera mano (leyendo `CLAUDE.md`
íntegro) más las que devolvió el subagente de Sanity, que sí terminó.

### Reglas documentadas que ya no se corresponden con lo que se va a hacer

**1. `CLAUDE.md:78` — la más importante.** Fragmento literal:

> **Sanity:** un único schema `project` (`src/sanity/schemas/project`). El schema `Service` fue eliminado y **Fun Gallery NO tiene schema propio** — se deriva de los `project` (portadas + galerías, sin duplicados). No crear schemas nuevos.

Contradice directamente la decisión cerrada de la sección 2.b de la instrucción:
Fun Gallery pasa a tener schema propio en Sanity. **Hay que corregir esta línea
antes de la corrida de Fun Gallery.** Contiene tres afirmaciones a revisar: que
Fun Gallery no tiene schema propio, que se deriva de los `project`, y que no se
crean schemas nuevos.

**2. `CLAUDE.md:90` — regla innegociable nº 7.** Fragmento literal:

> 7. **Sanity simple para no-técnicos:** favorecer automatización y derivación de contenido; no crear schemas innecesarios.

Formulada como principio ("innecesarios"), no como prohibición absoluta, pero es
la que da sustento a la regla de la línea 78.

**3. `CLAUDE.md:88` — regla innegociable nº 6.** Fragmento literal:

> 6. **No agregar libs de terceros** sin necesidad real.

Relevante para i18n: la decisión cerrada es implementarlo a mano, lo cual
**coincide** con esta regla. No hay conflicto; se registra porque toca el tema.

**4. `docs/sanity-studio-guide.md:20-25` — resto documental de un schema de Fun
Gallery que no existe en el código.** Contenido reportado por el subagente de
Sanity:

```
## Add Fun Gallery Images

1. Open Fun Gallery Image.
2. Upload the image.
3. Add a short alt text.
4. Set an order number if a specific sequence is needed.
5. Publish.
```

La guía que leen las clientas instruye abrir un documento **"Fun Gallery Image"**
con campos imagen + alt + order. Ese tipo de documento **no está registrado en
`src/sanity/sanity.config.ts`**, así que no aparece en el Studio. La guía
contradice a `CLAUDE.md:78`. Su forma implícita (`image`, `alt`, `order`) es el
único vestigio de un schema de Fun Gallery en el repo.

**5. `CLAUDE.md:96` (§6) — el método de subagentes en `.claude/agents/`.**
Describe infraestructura que no existe (ver 0.5).

**6. `CLAUDE.md` §4, tabla de arquitectura por sección** — no lista Team ni Fun
Gallery entre las secciones con archivos propios, aunque ambas existen:
`src/app/(site)/team/page.tsx`, `src/components/sections/team/TeamSection.tsx`,
`src/app/(site)/fun-gallery/page.tsx`,
`src/components/sections/gallery/FunGallery.tsx`.

**7. `CLAUDE.md:36` — el shell descrito.** Fragmento literal:

> `SmoothScrollProvider → RouteTransitionProvider → Navbar + PageTransitionShell( main + Footer )`

**Esta línea SÍ coincide** con el código real de `src/app/(site)/layout.tsx:13-21`.
Se registra como verificada, no como desactualizada.

**8. `CLAUDE.md:23` — valores de identidad visual.** Declara
`--header-height: 128px` y `--footer-height: 480px`. **PENDIENTE de verificar**
contra `globals.css` (no leído). Se anota porque `src/app/(site)/page.tsx:5` usa
`h-[calc(100vh-320px)]`, un `320px` que no corresponde a ninguno de esos dos
valores documentados.

**PENDIENTE:** barrido exhaustivo de `AGENTS.md` (327 bytes, no leído) y
`README.md` (1450 bytes, no leído).

## 0.8 — Configuración de build

### `next.config.ts` — completo (15 líneas), leído directo

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
```

Es todo el archivo. No hay `experimental`, `redirects`, `headers`, `rewrites`,
`output`, `deviceSizes`, `imageSizes`, `qualities`, `minimumCacheTTL` ni
`dangerouslyAllowSVG`.

### `netlify.toml`

**PENDIENTE.** Existe (106 bytes, `esquina-estudio/netlify.toml`). No fue leído.

### `.env.example`

**NO EXISTE.** Verificado por el subagente de Sanity (`ls .env.example
.env.sample` → ambos ausentes) y consistente con `git ls-files`, donde no
aparece. El único archivo de entorno es `.env.local` (402 bytes, ignorado por
git). **No hay ninguna plantilla de entorno versionada.**

Variables esperadas por el código (detalle completo en Bloque 7):
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_WRITE_TOKEN`, `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

## 0.9 — Los dos snapshots contradictorios de `ServicesIntro.tsx`

La instrucción advierte que el volcado del repo que circula fuera del repo tiene
dos snapshots del mismo archivo, uno con `h-[120vh]` y otro con `h-[200vh]`.

**RESUELTO leyendo el archivo en disco.** El valor real, hoy, es `h-[200vh]`, y
está en **las dos ramas** del componente:

- `src/components/sections/services/ServicesIntro.tsx:545` (rama estática)
- `src/components/sections/services/ServicesIntro.tsx:569` (rama intro)

Detalle y transcripción en el ANEXO A. **`h-[120vh]` no existe en el archivo.**

---

## HECHOS VERIFICADOS — Bloque 0

- HEAD `2565d01`, branch `main`, working tree limpio salvo `docs/instrucciones/` sin trackear.
- El último commit del repo es del **2026-06-05**. Dos meses sin cambios.
- 93 archivos trackeados. Un solo worktree.
- 12 branches locales además de `main`, en familias `lane/*` y `fix/*`.
- El stack del Contexto se confirma ítem por ítem, con dos matices: Lenis es el paquete legacy `@studio-freight/lenis`, y zod es v4 (`^4.4.3`).
- `sharp ^0.34.5` está presente como devDependency.
- **Ninguna librería de i18n como dependencia directa** (verificado sobre `package.json` íntegro).
- **El harness ECC no está instalado.** `.claude/` contiene un solo archivo (`settings.local.json`); no hay `agents/`, `commands/`, `hooks/` ni `skills/`.
- **No existen bitácora, plan maestro ni registro de pendientes** en los archivos trackeados ni en el primer nivel de directorios.
- `next.config.ts` tiene 15 líneas: solo `images.remotePatterns` (cdn.sanity.io) y `images.formats` (`avif`, `webp`).
- **No existe `.env.example`.**
- `ServicesIntro.tsx` usa `h-[200vh]` en ambas ramas. El snapshot de `h-[120vh]` es obsoleto.
- Seis puntos de documentación desactualizada identificados, encabezados por `CLAUDE.md:78`.

## DESCONOCIDO — Bloque 0

1. **Qué branches están mergeados a `main`.** No se corrió `git branch --merged main`. La presencia de commits de merge en el log no prueba que la punta actual de cada branch esté contenida en `main`.
2. **Si `i18next` entra al lock file de forma transitiva o directa, y qué paquete lo arrastra.** El subagente asignado murió por cuota. Haría falta grep con contexto sobre `package-lock.json`.
3. **Contenido de `.claude/settings.local.json`.** No leído.
4. **Contenido de `netlify.toml`.** No leído. Sin él no se puede afirmar nada sobre redirects, headers ni comando de build.
5. **Contenido de `.gitignore`.** No leído.
6. **Contenido de `AGENTS.md` y `README.md`.** No leídos. El barrido de documentación desactualizada está incompleto por eso.
7. **Contenido de `devserver.log` y `devserver.err.log`.** No leídos.
8. **Si los cuatro directorios ignorados por git (`Asset_ Imágenes`, `Asset_ Logo`, `Asset_ Tipografía`, `design-refs`) contienen documentación de método.** No inspeccionados.

## RIESGOS PARA LO QUE VIENE — Bloque 0

- **`CLAUDE.md:78` es una regla activa que prohíbe exactamente lo que se va a hacer en Fun Gallery.** Cualquier agente que lea ese archivo como contexto va a resistirse a crear el schema, o va a "corregir" el trabajo hacia la derivación. Corregir esa línea es prerrequisito de la corrida de Fun Gallery, no una tarea de limpieza posterior.
- **`docs/sanity-studio-guide.md` documenta para las clientas un documento del Studio que no existe.** Si las clientas siguieron esa guía alguna vez, no encontraron el documento. Al crear el schema nuevo, esa guía queda parcialmente correcta por accidente, lo que puede enmascarar diferencias entre lo documentado y lo implementado.
- **Dos meses de distancia entre el último commit y hoy, sin bitácora ni registro de pendientes.** No hay ningún artefacto en el repo que registre qué quedó a medias en junio. La única fuente es el código.
- **No hay `.env.example`.** Cualquier persona que clone el repo no tiene forma de saber qué variables hacen falta sin leer el código.
- **La infraestructura de subagentes que `CLAUDE.md` describe como método no existe en el repo.** Reproducir el método de junio requiere reconstruirla desde cero.
- **12 branches locales de estado de merge desconocido.** Riesgo de trabajo perdido o de reintroducir código viejo si alguno se mergea a ciegas.

---

# BLOQUE 1 — Shell, rutas, transiciones y el terreno del toggle de idioma  `[COMPLETO]`

> Esta sección es el material leído directo de disco en la sesión 1. El censo de
> consumidores de `usePreloader()`, el de `localStorage`/`sessionStorage`, la
> clasificación de render por ruta del build y el censo de scroll programático
> están en la sección **BLOQUE 1 — CIERRE**, más abajo. Las tres listas finales
> (`HECHOS VERIFICADOS` / `DESCONOCIDO` / `RIESGOS`) del bloque están al final de
> esa sección.

## 1.a — Estructura de `src/app/`

Árbol completo derivado de `git ls-files` (lista exhaustiva, working tree limpio):

```
src/app/
├── layout.tsx                          ← server component (raíz)
├── globals.css
├── favicon.ico
├── (site)/                             ← ÚNICO route group
│   ├── layout.tsx                      ← server component
│   ├── template.tsx                    ← client component
│   ├── page.tsx                        ← server component  (home  /)
│   ├── contact/
│   │   ├── page.tsx                                        (/contact)
│   │   └── success/page.tsx                                (/contact/success)
│   ├── fun-gallery/page.tsx            ← server, async     (/fun-gallery)
│   ├── services/
│   │   ├── page.tsx                    ← server            (/services)
│   │   └── ServicesPageClient.tsx      ← client component
│   ├── team/page.tsx                                       (/team)
│   └── work/
│       ├── page.tsx                                        (/work)
│       └── [slug]/
│           ├── page.tsx                                    (/work/[slug])
│           └── ProjectDetailClient.tsx ← client component
├── api/
│   ├── contact/route.ts
│   └── seed-sanity/route.ts
└── studio/[[...tool]]/page.tsx         ← client component  (/studio)
```

**Hallazgo estructural verificado por ausencia en la lista completa de archivos
trackeados:**

- **NO existe ningún `loading.tsx`** en todo `src/app/`.
- **NO existe ningún `error.tsx`.**
- **NO existe ningún `not-found.tsx`.**
- **NO existe ningún `global-error.tsx`.**
- **NO existe ningún `default.tsx`.**
- **Hay un solo route group: `(site)`.** `/studio` y `/api` quedan fuera de él,
  o sea fuera de `SmoothScrollProvider`, `RouteTransitionProvider`, `Navbar`,
  `PageTransitionShell`, `Footer` y `template.tsx`.

Clasificación server/client **verificada leyendo la primera línea de cada
archivo**:

| Archivo | Directiva | Tipo |
|---|---|---|
| `src/app/layout.tsx` | sin `"use client"` | **server** |
| `src/app/(site)/layout.tsx` | sin `"use client"` | **server** |
| `src/app/(site)/template.tsx:1` | `"use client";` | **client** |
| `src/app/(site)/page.tsx` | sin `"use client"` | **server** |
| `src/app/(site)/services/page.tsx` | sin `"use client"` | **server** |
| `src/app/(site)/services/ServicesPageClient.tsx:1` | `"use client";` | **client** |
| `src/app/(site)/fun-gallery/page.tsx` | sin `"use client"`, `export default async function` (`:39`) | **server async** |

**PENDIENTE:** la clasificación de `contact/page.tsx`, `contact/success/page.tsx`,
`team/page.tsx`, `work/page.tsx`, `work/[slug]/page.tsx`. Se cierra abajo.

## 1.b — Orden de anidación de providers

`src/app/(site)/layout.tsx` — archivo completo (23 líneas):

```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransitionShell from "@/components/layout/PageTransitionShell";
import RouteTransitionProvider from "@/components/layout/RouteTransitionProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <RouteTransitionProvider>
        <Navbar />
        <PageTransitionShell>
          <main className="pt-[var(--header-height)]">{children}</main>
          <Footer />
        </PageTransitionShell>
      </RouteTransitionProvider>
    </SmoothScrollProvider>
  );
}
```

Y por encima, `src/app/layout.tsx:56-62`:

```tsx
    <html lang="en" className={`${manropeFont.variable} antialiased`}>
      <body className="bg-off-white text-off-black font-body min-h-screen">
        <RootClientShell>{children}</RootClientShell>
      </body>
    </html>
```

`src/components/providers/RootClientShell.tsx:28-34`:

```tsx
  return (
    <PreloaderProvider>
      <CustomCursor />
      <LoadingScreen />
      {children}
    </PreloaderProvider>
  );
```

**Cadena completa de anidación, verificada:**

```
<html lang="en">                                    ← src/app/layout.tsx:57
  <body>                                            ← src/app/layout.tsx:58
    RootClientShell            (client)             ← RootClientShell.tsx:9
      PreloaderProvider        (client)             ← RootClientShell.tsx:29
        CustomCursor           (client)             ← RootClientShell.tsx:30
        LoadingScreen          (client)             ← RootClientShell.tsx:31
        SmoothScrollProvider   (client)             ← (site)/layout.tsx:13
          RouteTransitionProvider (client)          ← (site)/layout.tsx:14
            Navbar             (client)             ← (site)/layout.tsx:15
            PageTransitionShell (client)            ← (site)/layout.tsx:16
              <main class="pt-[var(--header-height)]">  ← (site)/layout.tsx:17
                template.tsx   (client)             ← (site)/template.tsx
                  {page}
              Footer           (client)             ← (site)/layout.tsx:18
```

`RootClientShell` corta el árbol entero para `/studio` — `RootClientShell.tsx:14-26`:

```tsx
  const pathname = usePathname();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");

  useEffect(() => {
    if (isStudio) {
      delete document.body.dataset.customCursor;
      return;
    }
  }, [isStudio]);

  if (isStudio) {
    return <>{children}</>;
  }
```

En `/studio` no se montan `PreloaderProvider`, `CustomCursor` ni `LoadingScreen`.

## 1.c — `src/app/layout.tsx`: `lang`, `metadata`, y lo hardcodeado a inglés

Archivo completo, 63 líneas. Objeto `metadata` (`:16-49`):

```ts
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://your-site-name.netlify.app",
  ),
  title: {
    template: "%s | ESQUINA ESTUDIO™",
    default: "ESQUINA ESTUDIO™ | Branding & Design",
  },
  description: defaultDescription,
  icons: {
    icon: [
      {
        url: "/logo-favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/logo-favicon.png",
    apple: "/logo-favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "ESQUINA ESTUDIO™ | Branding & Design",
    description: defaultDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ESQUINA ESTUDIO™",
      },
    ],
  },
};
```

Y `:13-14`:

```ts
const defaultDescription =
  "A design studio focused on building brands and shaping ideas with clarity, intention, and strong visual identity based in Tucumán, Argentina.";
```

### Inventario de lo hardcodeado a inglés en el layout raíz

| Ítem | Valor literal | Línea |
|---|---|---|
| `<html lang>` | `"en"` | `src/app/layout.tsx:57` |
| `openGraph.locale` | `"en_US"` | `src/app/layout.tsx:37` |
| `title.template` | `"%s \| ESQUINA ESTUDIO™"` | `src/app/layout.tsx:21` |
| `title.default` | `"ESQUINA ESTUDIO™ \| Branding & Design"` | `src/app/layout.tsx:22` |
| `description` | la cadena de `defaultDescription` | `src/app/layout.tsx:24` (definida en `:13-14`) |
| `openGraph.title` | `"ESQUINA ESTUDIO™ \| Branding & Design"` | `src/app/layout.tsx:38` |
| `openGraph.description` | la misma `defaultDescription` | `src/app/layout.tsx:39` |
| `openGraph.images[0].alt` | `"ESQUINA ESTUDIO™"` | `src/app/layout.tsx:45` |

**Ocho ítems hardcodeados a inglés en el layout raíz.** Ninguno tiene variante
en español ni depende de estado.

**Nota sobre `metadataBase` (`:17-19`):** el fallback es
`"https://your-site-name.netlify.app"`, un placeholder sin reemplazar. Si
`NEXT_PUBLIC_SITE_URL` no está definida, todas las URLs absolutas de OG apuntan
a ese dominio. El subagente de Sanity reportó que `NEXT_PUBLIC_SITE_URL` **no
está en `.env.local`**.

## 1.d — El sistema de transiciones

### Qué dispara la transición hoy

`src/components/layout/RouteTransitionProvider.tsx` (225 líneas). Constantes
(`:14-20`):

```ts
export const PAGE_EXIT_DURATION = 0.65;
export const PAGE_EXIT_EASE: [number, number, number, number] = [
  0.76, 0, 0.24, 1,
];
export const PAGE_EXIT_EASE_CSS = "cubic-bezier(0.76, 0, 0.24, 1)";

const REDUCED_EXIT_DURATION = 0.06;
```

Estado y cálculo de `isLeaving` (`:97-110`):

```ts
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const router = useRouter();
  const [leavingPathname, setLeavingPathname] = useState<string | null>(null);
  const [pendingPathname, setPendingPathname] = useState<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const exitDuration = reduceMotion
    ? REDUCED_EXIT_DURATION
    : PAGE_EXIT_DURATION;
  const isLeaving = leavingPathname === pathname;
```

El disparador es un **listener de click a nivel documento en fase de captura**
(`:180-202`):

```ts
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const anchor = getAnchor(event);
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const destination = getInternalUrl(anchor.href);
      if (!destination || isCurrentRoute(destination)) return;

      event.preventDefault();
      navigateWithTransition(getRouteHref(destination));
    };

    document.addEventListener("click", handleDocumentClick, true);
```

Y `navigateWithTransition` (`:126-149`):

```ts
  const navigateWithTransition = useCallback(
    (href: string) => {
      const destination = getInternalUrl(href);

      if (!destination) return;
      if (isCurrentRoute(destination)) {
        router.push(getRouteHref(destination));
        return;
      }

      const routeHref = getRouteHref(destination);
      if (pendingHrefRef.current === routeHref) return;

      pendingHrefRef.current = routeHref;
      setPendingPathname(destination.pathname);
      setLeavingPathname(pathname);
      clearNavigationTimer();

      navigationTimerRef.current = window.setTimeout(() => {
        router.push(routeHref);
      }, exitDuration * 1000);
    },
    [clearNavigationTimer, exitDuration, pathname, router],
  );
```

**Respuestas exactas a las preguntas de la instrucción:**

- **¿`usePathname()`?** Sí, `RouteTransitionProvider.tsx:97`. Se usa para
  comparar contra `leavingPathname`, no como key.
- **¿`AnimatePresence` con `key={pathname}`?** **NO.** No hay ningún
  `AnimatePresence` en `RouteTransitionProvider.tsx` ni en
  `PageTransitionShell.tsx`. Verificado leyendo ambos archivos completos.
- **¿Un evento del router?** No. El disparo es un click interceptado en el
  documento; `router.push` se llama **después**, con un `setTimeout` de
  `exitDuration * 1000` ms (`:144-146`).

### LA PREGUNTA CENTRAL: ¿se puede disparar la transición sin que cambie la ruta?

`src/components/layout/PageTransitionShell.tsx` — archivo completo (36 líneas):

```tsx
"use client";

import { motion } from "framer-motion";
import {
  PAGE_EXIT_EASE,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";

export default function PageTransitionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { exitDuration, isLeaving } = useRouteTransition();

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{ opacity: isLeaving ? 0 : 1 }}
        transition={{ duration: exitDuration, ease: PAGE_EXIT_EASE }}
        className="will-change-opacity"
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isLeaving ? 1 : 0 }}
        transition={{ duration: exitDuration, ease: PAGE_EXIT_EASE }}
        className="pointer-events-none absolute inset-0 z-20 bg-off-white"
      />
    </div>
  );
}
```

**Línea determinante: `PageTransitionShell.tsx:20` —
`animate={{ opacity: isLeaving ? 0 : 1 }}`.**

La animación es una **interpolación de opacidad gobernada por un booleano de
contexto**, no un montaje/desmontaje con key. No hay `AnimatePresence`, no hay
`key`, no hay `exit`. El contenido no se remonta: se desvanece a opacidad 0
mientras un overlay `bg-off-white` sube a opacidad 1 (`:30`).

**Consecuencia mecánica, afirmada sobre esas dos líneas:** la animación de
transición se dispara con cualquier cosa que ponga `isLeaving` en `true`. No
depende de que cambie la ruta.

**Lo que hoy bloquea el disparo sin cambio de ruta** es que `isLeaving` se
calcula en `RouteTransitionProvider.tsx:108` como
`leavingPathname === pathname`, y el único lugar del archivo que llama a
`setLeavingPathname(pathname)` es `navigateWithTransition` (`:141`), que antes
descarta el caso de misma ruta en `:131-134`:

```ts
      if (isCurrentRoute(destination)) {
        router.push(getRouteHref(destination));
        return;
      }
```

Además, el efecto de `:151-168` limpia el estado en cada cambio de `pathname`:

```ts
  useEffect(() => {
    const completedHref = pendingHrefRef.current;

    pendingHrefRef.current = null;
    clearNavigationTimer();

    const frame = window.requestAnimationFrame(() => {
      if (!completedHref) {
        resetTransitionState();
        return;
      }

      setLeavingPathname(null);
      setPendingPathname(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [clearNavigationTimer, pathname, resetTransitionState]);
```

**Estado de hecho:** hoy el contexto **no expone** ninguna función que ponga
`isLeaving` en `true` sin navegar. El valor del contexto (`:204-217`) expone
`exitDuration`, `isLeaving`, `navigateWithTransition` y `pendingPathname` — no
un setter.

**No es una key de `AnimatePresence`,** así que la pregunta de la instrucción
("si la key es el pathname, qué variable habría que sumarle") **no aplica a esta
arquitectura**. El mecanismo es un booleano, no una key.

### Qué se preserva y qué se remonta durante una transición

Verificado sobre la cadena de anidación de 1.b:

**SE PRESERVAN** (están por encima o por fuera del `{children}` que cambia):

| Componente | Por qué se preserva | Evidencia |
|---|---|---|
| `RootClientShell` | está en el layout raíz | `src/app/layout.tsx:59` |
| `PreloaderProvider` | idem | `RootClientShell.tsx:29` |
| `CustomCursor` | idem | `RootClientShell.tsx:30` |
| `LoadingScreen` | idem | `RootClientShell.tsx:31` |
| `SmoothScrollProvider` | está en `(site)/layout.tsx` | `(site)/layout.tsx:13` |
| `RouteTransitionProvider` | idem | `(site)/layout.tsx:14` |
| `Navbar` | idem | `(site)/layout.tsx:15` |
| `PageTransitionShell` | idem | `(site)/layout.tsx:16` |
| `Footer` | idem | `(site)/layout.tsx:18` |

**SE REMONTA:**

- **`src/app/(site)/template.tsx`** — es un `template.tsx` de App Router, que por
  contrato de Next se remonta en cada navegación. Archivo completo (23 líneas):

```tsx
"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Template({ children }: { children: React.ReactNode }) {
  const { isPreloaderDone } = usePreloader();

  return (
    <div className="min-h-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPreloaderDone ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

- **La página** de cada ruta y todo su subárbol.

**Consecuencia directa para el cambio de idioma, afirmada sobre la estructura:**
la máquina de estados de `ServicesIntro` y el layout de `FunGallery` viven dentro
de la página, o sea **en la parte que se remonta**. `PreloaderProvider` vive en
el layout raíz, o sea **en la parte que se preserva**: su estado
`isPreloaderDone` sobrevive a una navegación.

Además, `SmoothScrollProvider` **sí reacciona a la navegación** aunque no se
remonte, porque su efecto depende de `pathname` (ver 1.g), y
`ServicesPageClient.tsx:30` fuerza el remonte de `ServicesStack` con
`key={pathname}`:

```tsx
      <ServicesStack key={pathname} services={services} />
```

## 1.e — El preloader como cortina

`src/components/providers/PreloaderProvider.tsx` — archivo completo (67 líneas).
Clave de sesión (`:12`):

```ts
const SESSION_KEY = "esquina:preloaderShown";
```

Inicialización y sincronización (`:36-54`):

```ts
  // SSR-safe init: always false on server to avoid hydration mismatch.
  // On the client, useEffect resolves the real sessionStorage value.
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  useEffect(() => {
    // Sync from sessionStorage (external store) on mount.
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      // Intentional: syncing external store state into React on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPreloaderDone(true);
    }
  }, []);

  const markPreloaderDone = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setIsPreloaderDone(true);
  }, []);
```

### Cuándo se considera terminado y cuánto dura

`src/components/ui/LoadingScreen.tsx:11-15`:

```ts
const PROGRESS_DURATION_MS = 1000;
const HOLD_AFTER_COMPLETE_MS = 700;
const EXIT_DURATION = 1;
const EXIT_DELAY = PROGRESS_DURATION_MS + HOLD_AFTER_COMPLETE_MS;
const HIDE_DELAY = EXIT_DELAY + EXIT_DURATION * 1000;
```

**Duración total medida sobre esas constantes: `HIDE_DELAY` = 1000 + 700 +
1×1000 = 2700 ms.** Desglose: 1000 ms de barra de progreso, 700 ms de sostén,
1000 ms de salida (`exit={{ y: "-100%" }}`, `LoadingScreen.tsx:367`).

El punto exacto en que se marca terminado — `LoadingScreen.tsx:346-350`:

```ts
    const exitTimer = setTimeout(() => setIsExiting(true), EXIT_DELAY);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      markPreloaderDone();
    }, HIDE_DELAY);
```

**`markPreloaderDone()` se llama a los 2700 ms, en el mismo tick en que el
overlay se desmonta** (`setIsVisible(false)` + el `if (!shouldRender ||
!isVisible) return null;` de `:360`).

### Cómo persiste entre visitas

`sessionStorage`, clave `"esquina:preloaderShown"`, valor `"1"`. Escrita en
`PreloaderProvider.tsx:51` y **leída en dos lugares independientes**:

1. `PreloaderProvider.tsx:42` — para inicializar el contexto.
2. `LoadingScreen.tsx:316` — para decidir si arrancar la animación:

```ts
    // Session already has the flag set (preloader was shown earlier this session).
    // Skip animation entirely — no overlay, no timers.
    if (window.sessionStorage.getItem("esquina:preloaderShown") === "1") return;
```

**Nota:** en `LoadingScreen.tsx:316` la clave está **escrita como literal
duplicado**, no importada de `PreloaderProvider`. Son dos fuentes del mismo
string.

Al ser `sessionStorage`, la bandera vive por pestaña y se pierde al cerrarla.

### En qué punto del ciclo de vida se podría resolver el idioma antes de levantar la cortina

**Ventana medida:** entre el montaje de `PreloaderProvider` y la llamada a
`markPreloaderDone()` hay **2700 ms** en una visita fresca de sesión
(`LoadingScreen.tsx:15` + `:347-350`). Durante todo ese lapso el overlay
`fixed inset-0 z-[9998] bg-off-black` (`LoadingScreen.tsx:369`) cubre la pantalla
completa.

**En una recarga a mitad de sesión esa ventana es 0 ms:** `LoadingScreen.tsx:316`
retorna temprano y no se monta ningún overlay.

### El caso descubierto: recarga dura a mitad de sesión

**CONFIRMADO.** Cadena de evidencia:

1. `LoadingScreen.tsx:316` corta el efecto antes de crear timers si la bandera de
   sesión está puesta → `shouldRender` queda en `false` (`:306`) → `:360`
   (`if (!shouldRender || !isVisible) return null;`) devuelve `null`. **No se
   monta overlay.**
2. `PreloaderProvider.tsx:38` inicializa `isPreloaderDone` en `false` **siempre**,
   incluido el render del servidor y el primer render del cliente. El comentario
   del código lo dice explícitamente (`:36-37`): *"SSR-safe init: always false on
   server to avoid hydration mismatch."*
3. El `useEffect` de `:40-47` corre **después** del primer paint del cliente y
   recién ahí pone `true`.

**Qué se ve en pantalla en esa recarga, antes de que hidrate React** — afirmado
sobre `template.tsx:14-15`:

```tsx
        initial={{ opacity: 0 }}
        animate={{ opacity: isPreloaderDone ? 1 : 0 }}
```

Con `isPreloaderDone === false` en el HTML del servidor, el contenido de la
página se sirve con **opacidad 0**. **No hay preloader y no hay contenido: se ve
el fondo del `<body>`, que es `bg-off-white`** (`src/app/layout.tsx:58`).
`--color-off-white` está documentado como `#F3F3F3` en `CLAUDE.md:19`
(pendiente de verificar contra `globals.css`).

El contenido aparece cuando corre el efecto de `PreloaderProvider.tsx:40-47` y
`template.tsx` interpola a opacidad 1 en **0,5 s** (`template.tsx:17` —
`transition={{ duration: 0.5, ease: EASE }}`).

Lo mismo aplica a `Hero`, que además fuerza remonte por key
(`src/components/sections/home/Hero.tsx:43`):

```tsx
        key={isPreloaderDone ? "home-ready" : "home-waiting"}
```

**PENDIENTE:** el censo completo de componentes que leen `usePreloader()`. Se
cierra abajo.

## 1.f — Navbar

`src/components/layout/Navbar.tsx` (409 líneas).

### Mapeo `pathname` → tab activo

`:49-55`:

```ts
function isPathActive(pathname: string, href: DesktopNavHref) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isHomePath(pathname: string) {
  return pathname === "/";
}
```

`:58-78`:

```ts
  const pathname = usePathname();
  const { pendingPathname } = useRouteTransition();
  const visualPathname = pendingPathname ?? pathname;
  ...
  const activeDesktopHref: DesktopNavHref | null = isPathActive(
    visualPathname,
    "/contact",
  )
    ? "/contact"
    : (NAV_LINKS.find((link) => isPathActive(visualPathname, link.href))
        ?.href ?? null);
```

**Detalle relevante:** el tab activo se calcula sobre `visualPathname`, que
prefiere `pendingPathname` del contexto de transición. El subrayado se mueve
**apenas se hace click**, antes de que `router.push` complete.

### Cálculo de la animación del subrayado

**No es CSS: es medición del DOM.** `:96-130`:

```ts
  const updateIndicator = useCallback(
    (animateMove: boolean) => {
      const desktopNav = desktopNavRef.current;
      const activeLink = activeDesktopHref
        ? desktopLinkRefs.current[activeDesktopHref]
        : null;
      const logo = desktopLogoRef.current;
      const baselineLink = desktopLinkRefs.current["/work"];
      ...
      const navRect = desktopNav.getBoundingClientRect();
      const baselineRect = baselineLink.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
```

Se mide con `getBoundingClientRect()` sobre cada `<span>` que envuelve un
`HoverButton`, y se anima `x`, `width` y `opacity` con Framer (`:341-357`):

```tsx
          <motion.span
            aria-hidden
            className={`pointer-events-none absolute left-0 z-10 hidden h-px bg-current md:block ${linkTextClass}`}
            style={{ top: indicator.top }}
            initial={false}
            animate={{
              opacity: indicator.opacity,
              x: indicator.x,
              width: indicator.width,
            }}
```

Constantes de la animación (`:19-25`):

```ts
const NAV_INDICATOR_DURATION = 0.62;
const NAV_INDICATOR_DOT_WIDTH = 5;
const NAV_INDICATOR_EASE: [number, number, number, number] = [
  0.65, 0, 0.15, 1,
];
const NAV_INDICATOR_TIMES = [0, 0.28, 0.72, 1];
const NAV_INDICATOR_HOME_GAP = 24;
```

Se recalcula en `useLayoutEffect` con `requestAnimationFrame` (`:248-254`) y en
cada `resize` (`:256-261`).

**`/work` es el link de referencia** (`:103` — `const baselineLink =
desktopLinkRefs.current["/work"];`). Si `/work` no se renderiza, el indicador se
anula por completo (`:105-109`).

### Dónde entraría físicamente un toggle `EN / ES`

Estructura del header, `:285-339`:

```tsx
      <div
        ref={desktopNavRef}
        className="pointer-events-auto relative flex h-[var(--header-height)] items-center justify-between px-12 py-10 lg:px-16"
      >
        <div ref={desktopLogoRef} className="flex-shrink-0">
          <LogoScript size="md" tone={navTone} />
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => { ... })}
        </div>

        <div className="flex-1" />

        <div className="hidden md:block">
          <span ref={setDesktopLinkRef("/contact")} className="inline-flex">
            <HoverButton href="/contact" ... >
              CONTACT US
            </HoverButton>
          </span>
        </div>
```

**Hechos sobre el terreno físico:**

- El contenedor es `flex ... justify-between` (`:287`), con tres hijos en flujo:
  el logo (`flex-shrink-0`, `:289`), un espaciador `flex-1` (`:320`) y el bloque
  de `CONTACT US` (`hidden md:block`, `:322`).
- **El grupo de tabs centrales NO está en el flujo**: es
  `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` (`:293`). Está
  centrado respecto del header, no respecto de sus vecinos.
- El lugar contiguo a `CONTACT US` es el `<div className="hidden md:block">` de
  `:322-339`.

**¿Hay anchos fijos por tab que lo compliquen?** **NO.** Verificado: ningún tab
declara `w-*`. El espaciado es `gap-8` en el contenedor de tabs (`:293`) y los
anchos son los del texto. Las clases de cada tab (`:307-311`):

```tsx
                  className={`text-[13px] uppercase font-body ${
                    isFunGallery ? "font-thin" : "font-[480]"
                  } ${
                    isFunGallery ? "tracking-[0.09em]" : "tracking-wider"
                  } ${linkTextClass}`}
```

**Lo que sí es sensible al ancho:** el indicador de subrayado se dimensiona con
`linkRect.width` medido en runtime (`:186`), y usa `/work` como línea base
(`:103`). Un toggle agregado al bloque de `CONTACT US` **no** entra en
`desktopLinkRefs` salvo que se lo registre, así que no participa de la medición.

## 1.g — Lenis

`src/components/providers/SmoothScrollProvider.tsx` — archivo completo (81
líneas). Lo determinante, `:13-15`:

```ts
function shouldUseSmoothScroll(pathname: string) {
  return pathname === "/team" || pathname.startsWith("/work");
}
```

**HALLAZGO: Lenis solo se instancia en `/team` y en `/work*`.** En `/`,
`/services`, `/fun-gallery`, `/contact` y `/contact/success` **no hay smooth
scroll**: el efecto sale temprano y limpia (`:29-34`):

```ts
    if (!shouldUseSmoothScroll(pathname)) {
      document.documentElement.style.scrollBehavior = "auto";
      delete window.lenis;
      lenisRef.current = null;
      return;
    }
```

Instanciación (`:38-57`), con import dinámico:

```ts
    const setupSmoothScroll = async () => {
      const { default: LenisConstructor } = await import("@studio-freight/lenis");

      if (isDisposed) return;

      const lenis = new LenisConstructor({
        lerp: 0.1,
        duration: 1.2,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      let animationFrame = 0;
      const updateLenis = (time: number) => {
        lenis.raf(time);
        animationFrame = window.requestAnimationFrame(updateLenis);
      };

      animationFrame = window.requestAnimationFrame(updateLenis);
```

Destrucción (`:59-76`):

```ts
      cleanupSmoothScroll = () => {
        window.cancelAnimationFrame(animationFrame);
        lenis.destroy();
        delete window.lenis;
        lenisRef.current = null;
      };
      ...
    return () => {
      isDisposed = true;
      cleanupSmoothScroll?.();
    };
```

**¿Se recrea en cada navegación?** Sí. El `useEffect` tiene `[pathname]` como
dependencia (`:77`), así que en cada cambio de ruta se destruye y, si la ruta
nueva califica, se crea una instancia nueva. La instancia se expone globalmente
en `window.lenis` (`:49`, declarado en `:7-11`).

### `window.scrollTo` por fuera de Lenis — hallazgos parciales

Encontrados leyendo archivos, **sin grep exhaustivo todavía**:

| Ubicación | Fragmento | Contexto |
|---|---|---|
| `src/app/(site)/services/ServicesPageClient.tsx:24` | `window.scrollTo(0, 0);` | dentro de `useLayoutEffect` con dep `[pathname]`; antes setea `window.history.scrollRestoration = "manual"` (`:20-22`) |
| `src/components/sections/services/ServicesIntro.tsx:441` | `window.scrollTo(0, window.innerHeight);` | compensación de scroll del swap a estático |
| `src/components/sections/services/ServicesIntro.tsx:510` | `window.scrollTo(0, startY + distance * finalEase);` | animación manual de scroll del botón DISCOVER, 1000 ms |
| `src/components/sections/services/ServiceItem.tsx:162` | `window.scrollBy({ top: -heightToLose, behavior: "instant" });` | compensación al colapsar un item |

**Los cuatro están en rutas donde Lenis NO corre** (`/services`), así que operan
sobre el scroll nativo. **PENDIENTE:** grep exhaustivo por `scrollTo` /
`scrollIntoView` en todo `src/`.

---

# BLOQUE 7 — Sanity  `[COMPLETO]`

> **Nota de procedencia.** Este bloque lo relevó un subagente de exploración que
> terminó su tarea. La sesión principal verificó de forma independiente los
> siguientes puntos, y **todos coincidieron exactamente** con lo reportado:
> el contenido íntegro de `src/types/service.ts`; `export const dynamic =
> "force-dynamic"` en `fun-gallery/page.tsx:17`; `const randomSeed =
> randomUUID()` en `fun-gallery/page.tsx:41`; `import { randomUUID } from
> "crypto"` en `fun-gallery/page.tsx:2`; el import de
> `FUN_GALLERY_PROJECTS_QUERY` en `fun-gallery/page.tsx:5`; `formats:
> ["image/avif", "image/webp"]` en `next.config.ts:11`; los datos hardcodeados
> de Services en `services/page.tsx:11`; la interfaz `ServiceContent` en
> `ServicesStack.tsx:11`; y `urlFor(image).width(1200).quality(90).url()` en
> `FunGallery.tsx:160`. Los puntos **no** verificados de forma independiente son
> los que citan `project.ts`, `sanity.config.ts`, `sanity.ts`,
> `sanity.queries.ts`, `.env.local`, `mock-data.ts` y `seed-sanity/route.ts`,
> archivos que la sesión principal no leyó.

## 7.1 — Schemas presentes

`src/sanity/` contiene exactamente **2 archivos**:

- `src/sanity/sanity.config.ts`
- `src/sanity/schemas/project.ts`

**Existe UN solo schema: `project`.** No hay `service.ts`, no hay
`funGalleryImage.ts`, no hay barrel `index.ts`, no hay carpeta `objects/`.

## 7.2 — Estructura completa del schema `project`, campo por campo

| # | Línea | `name` | `title` (label Studio) | `type` | Requerido | ¿Texto visible traducible? |
|---|---|---|---|---|---|---|
| 1 | `project.ts:9-12` | `title` | `"Project Name"` | `string` | **SÍ** (`Rule.required()`) | **SÍ** |
| 2 | `project.ts:15-19` | `slug` | `"URL Slug"` | `slug` | **SÍ** (`Rule.required()`) | NO — técnico (URL) |
| 3 | `project.ts:22-24` | `projectNumber` | `"Project Number (e.g. 01, 02)"` | `string` | No | Visible, **no traducible** (numeral) |
| 4 | `project.ts:27-29` | `category` | `"Category (e.g. FOOD & BEVERAGES)"` | `string` | No | **SÍ** |
| 5 | `project.ts:32-34` | `services` | `"Services (e.g. BRANDING / PACKAGING DESIGN)"` | `string` | No | **SÍ** |
| 6 | `project.ts:37-39` | `year` | `"Year (e.g. Y / 2025)"` | `string` | No | Visible, traducible parcial (formato `"Y / 2025"`) |
| 7 | `project.ts:42-45` | `coverImage` | `"Cover Image (shown in grid)"` | `image` (hotspot) | No | NO — media. **Sin campo `alt`** |
| 8 | `project.ts:48-52` | `coverColor` | `"Cover Background Color (hex, optional)"` | `string` | No | NO — hex |
| 9 | `project.ts:55-57` | `order` | `"Display Order"` | `number` | No | NO — estructural |
| 10 | `project.ts:61-115` | `content` | `"Project Content"` | `array` | No | MIXTO — ver bloques |

### Tipos de bloque anidados dentro de `content` (`project.ts:64-114`)

**Bloque A — Portable Text (`project.ts:66-69`):**

```ts
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        },
```

Sin `name`. Un solo estilo (`normal`). Sin `lists`, sin `marks` custom.
→ **TEXTO VISIBLE / TRADUCIBLE.**

**Bloque B — `mediaItem` (`project.ts:71-93`):**

```ts
        {
          type: "object",
          name: "mediaItem",
          title: "Single Media (Image, GIF, or Video)",
          fields: [
            { name: "file",  title: "Image/GIF", type: "image", options: { hotspot: true } },
            { name: "video", title: "Video URL (Vimeo/YouTube embed or direct .mp4)", type: "url" },
            { name: "caption", title: "Caption (optional)", type: "string" },
          ],
        },
```

`file` → técnico (sin `alt`). `video` → técnico. **`caption` → TRADUCIBLE.**
Ningún campo tiene `validation`. El objeto no tiene `preview`.

**Bloque C — `dualMedia` (`project.ts:95-113`):**

```ts
        {
          type: "object",
          name: "dualMedia",
          title: "Dual Media (2 vertical images side by side)",
          fields: [
            { name: "left",  title: "Left Image/GIF",  type: "image", options: { hotspot: true } },
            { name: "right", title: "Right Image/GIF", type: "image", options: { hotspot: true } },
          ],
        },
```

Ambos técnicos. Sin `alt`, sin `caption`, sin `validation`, sin `preview`.

### Resumen de traducibilidad

**Traducibles:** `title`, `category`, `services` (3 campos raíz) + los bloques
Portable Text de `content` + `mediaItem.caption` (2 dentro de `content`).

**No traducibles:** `slug`, `coverImage`, `coverColor`, `order`,
`mediaItem.file`, `mediaItem.video`, `dualMedia.left`, `dualMedia.right`.

**Ambiguos por formato, no por idioma:** `projectNumber` (`"01"`), `year`
(`"Y / 2025"`).

## 7.3 — Restos de schemas eliminados

### Schema `Service`

**En código Sanity: NO queda nada.** No hay `src/sanity/schemas/service.ts`, no
aparece en `sanity.config.ts`, no hay `_type == "service"` en ninguna query GROQ.

**Resto único — tipo TypeScript huérfano.** `src/types/service.ts` existe
completo (8 líneas) y **no lo importa nadie** (grep de `@/types/service` en
`src/` → 0 importadores):

```ts
export interface Service {
  _id: string;
  title: string;
  description: string;
  items: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery?: any[];
}
```

Es código muerto. Su forma revela que el schema viejo tenía `title`,
`description`, `items: string[]` y `gallery`.

Las únicas otras apariciones de "Service" en `src/` sin relación con Sanity:
`src/components/sections/contact/ContactForm.tsx:128` (`function
resolveWorkTypeFromService(service: string | null)`) y `:467-468`.

### Schema viejo de Fun Gallery

**En código: NO existe ni existió** un schema `funGallery`/`galleryImage`. Cero
coincidencias en schemas, queries, tipos y desk structure. Fun Gallery hoy se
deriva de `project` vía `FUN_GALLERY_PROJECTS_QUERY`
(`src/lib/sanity.queries.ts:18`).

**En documentación: sí hay un resto reaprovechable.**
`docs/sanity-studio-guide.md:20-25` documenta un tipo de documento **"Fun Gallery
Image"** con campos imagen + alt text + order, que no está registrado en
`sanity.config.ts`. Es el único vestigio de forma de un schema de Fun Gallery en
todo el repo. Ver Bloque 0.7, punto 4.

### `defineType` en el repo

Una sola aparición de import y una de uso, ambas en `project.ts`:

- `src/sanity/schemas/project.ts:1` — `import { defineType, defineField } from "sanity";`
- `src/sanity/schemas/project.ts:3` — `export default defineType({`

`defineField` aparece 10 veces en `project.ts` (líneas 8, 14, 21, 26, 31, 36, 41,
47, 54, 60) y en ningún otro archivo.

## 7.4 — Registro de schemas y Studio

`src/sanity/sanity.config.ts` — completo (16 líneas):

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import project from "./schemas/project";

export default defineConfig({
  name: "esquina-estudio",
  title: "Esquina Estudio CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [project],
  },
});
```

**Registro de schemas:** import default desde `./schemas/<nombre>` (línea 4) +
push al array `schema.types` (línea 14).

**Desk / structure: NO hay structure personalizada.** `sanity.config.ts:12`
invoca `structureTool()` **sin argumentos** — es la desk por defecto de Sanity,
que lista automáticamente todo tipo registrado en `schema.types`. No existe
`structure.ts` ni `deskStructure.ts` ni prop `structure:`.

Notas verificadas: `dataset` está **hardcodeado** a `"production"` (línea 10), no
lee `NEXT_PUBLIC_SANITY_DATASET`. `projectId` usa non-null assertion. No hay
`apiVersion` en la config del Studio. `visionTool()` está activo.

`src/app/studio/[[...tool]]/page.tsx` — completo (10 líneas):

```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

**No existen `sanity.cli.ts` ni `sanity.config.ts` en la raíz del proyecto.** La
única config vive en `src/sanity/`.

## 7.5 — Convenciones para agregar un schema nuevo

Verificado contra el único precedente (`project.ts`):

1. **Ubicación:** `src/sanity/schemas/<nombre>.ts`. Un archivo por schema, sin
   barrel file.
2. **Export:** `export default`, no named (`project.ts:3` — `export default
   defineType({`; import sin llaves en `sanity.config.ts:4`).
3. **Helpers:** `defineType` para el documento raíz, `defineField` para **cada**
   campo de nivel raíz. Import desde `"sanity"` (`project.ts:1`).
4. **Excepción observada:** los campos **dentro de objetos anidados NO usan
   `defineField`** — son objetos literales planos (`project.ts:75-92` y
   `:99-112`). Los miembros del array `of:` (`:66`, `:71`, `:95`) tampoco usan
   `defineArrayMember`.
5. **Nombres:** `name` en camelCase; `title` en inglés con el ejemplo entre
   paréntesis para guiar a la clienta (`"Category (e.g. FOOD & BEVERAGES)"`).
6. **Archivo EXACTO de registro:** `src/sanity/sanity.config.ts`, **línea 4**
   (import) y **línea 14** (`types: [project],`). Son los dos únicos puntos. No
   hay auto-discovery.
7. **Alias de import:** `@/*` → `./src/*` (`tsconfig.json:21-23`).

## 7.6 — Referencias: no hay precedente

**NO EXISTE NINGÚN CAMPO `type: "reference"` EN NINGÚN SCHEMA DEL REPO.**
`project.ts` es el único schema y ninguno de sus 10 campos raíz ni de sus 5
anidados es `reference`. Los tipos usados son solo: `string`, `slug`, `image`,
`number`, `array`, `block`, `object`, `url`.

**`->` en GROQ: existe, pero solo para desreferenciar el asset de imagen**
(`asset->`), el patrón estándar de Sanity — no una referencia entre documentos.
Las 7 apariciones, todas en `src/lib/sanity.queries.ts` dentro de
`FUN_GALLERY_PROJECTS_QUERY`: líneas 23, 34, 40, 44, 49, 53, 57.
`ALL_PROJECTS_QUERY` y `PROJECT_BY_SLUG_QUERY` **no tienen ningún `->`**.

`_type: "reference"` en código: una sola aparición, también asset de imagen —
`src/app/api/seed-sanity/route.ts:64-70`.

**CONCLUSIÓN EXPLÍCITA: no hay ningún precedente en el proyecto de una
referencia documento-a-documento en Sanity.** Ni campo `reference` en un schema,
ni proyección `campo->{...}` que desreferencie otro documento, ni tipo TypeScript
que lo modele. Si el schema nuevo de Fun Gallery enlaza a `project`, **sería el
primer uso de referencias del proyecto.**

## 7.7 — Validaciones, previews, options de `project`

**`validation:` — 2 apariciones, ambas idénticas:**

```ts
project.ts:12   validation: (Rule) => Rule.required(),   // title
project.ts:19   validation: (Rule) => Rule.required(),   // slug
```

**Solo `title` y `slug` son requeridos.** Ningún otro campo tiene `validation`.
No hay `.min()`, `.max()`, `.regex()`, `.custom()`. `coverColor` es un hex **sin
validar**.

**`preview:` — 1 aparición, a nivel documento (`project.ts:124-126`):**

```ts
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
```

Solo `select`, **sin `prepare()`**. Ningún objeto anidado tiene `preview` propio.

**`options:` — 5 apariciones:** `:18` (`{ source: "title" }` en slug), `:45`,
`:80`, `:104`, `:110` (todas `{ hotspot: true }`). No hay `options.list`, ni
`options.layout`, ni `maxLength` en el slug.

**`orderings:` — 1 aparición (`project.ts:117-123`):**

```ts
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
```

**`group` / `fieldset`: NO EXISTE NINGUNO.** Los 10 campos se muestran en una
sola columna plana en el Studio.

**`initialValue`, `readOnly`, `hidden`, `icon`: ninguno presente.**

## 7.8 — Tipos TypeScript

`src/types/project.ts` — completo (46 líneas):

```ts
export interface SanityImageAsset {
  _id?: string;
  _ref?: string;
  url?: string;
}

export interface SanityImageLike {
  _type?: "image";
  asset?: SanityImageAsset;
  alt?: string;
}

export interface ProjectMediaItem {
  _type: "mediaItem";
  _key?: string;
  file?: SanityImageLike;
  video?: string;
  caption?: string;
}

export interface ProjectDualMedia {
  _type: "dualMedia";
  _key?: string;
  left?: SanityImageLike;
  right?: SanityImageLike;
}

export type ProjectContentBlock =
  | ProjectMediaItem
  | ProjectDualMedia
  // Portable Text and unknown Sanity content blocks.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>;

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  projectNumber: string;
  category: string;
  services: string;
  year: string;
  coverImage: SanityImageLike | string | null;
  coverColor?: string;
  content?: ProjectContentBlock[];
}
```

**Desajustes verificados contra el schema:**

- `SanityImageLike.alt` (línea 10) existe en TS pero **el schema no define ningún
  campo `alt`** en ninguna imagen. Campo fantasma.
- `coverImage` acepta `string` porque los fallbacks locales pasan rutas
  (`local-projects.ts:22`).
- `projectNumber`, `category`, `services`, `year` están tipados como
  **requeridos**, pero en el schema **ninguno tiene `Rule.required()`**. El tipo
  es más estricto que el schema.

**¿Escritos a mano o generados? ESCRITOS A MANO.** Evidencia negativa múltiple:
no existe `sanity.types.ts`; no existe `.sanity/`; no existe
`sanity-typegen.json`; grep repo-wide de `sanity typegen` / `sanity-typegen` → 0
coincidencias; `package.json` no tiene script `typegen` (solo `dev`, `build`,
`start`, `lint`); no existen `sanity.cli.ts` ni `sanity.config.ts` en la raíz,
que typegen requiere. `@sanity/cli` está en devDependencies pero no se usa en
ningún script.

## 7.9 — `src/lib/sanity.ts`

Completo (33 líneas):

```ts
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const isValidProjectId =
  /^[a-z0-9-]+$/.test(projectId) && projectId !== "YOUR_PROJECT_ID";

export const client = isValidProjectId
  ? createClient({
      projectId,
      dataset: "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

const builder = isValidProjectId && client ? imageUrlBuilder(client) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => {
  if (!builder) {
    const stub = {
      width: () => stub,
      height: () => stub,
      quality: () => stub,
      url: () => "",
    };

    return stub;
  }

  return builder.image(source);
};
```

| Ítem | Valor | Línea |
|---|---|---|
| Import del cliente | `createClient` desde **`next-sanity`** | `sanity.ts:1` |
| `projectId` | `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID \|\| ""` | `sanity.ts:4` |
| Guard | `/^[a-z0-9-]+$/.test(projectId) && projectId !== "YOUR_PROJECT_ID"` | `sanity.ts:5-6` |
| `dataset` | **`"production"` hardcodeado** | `sanity.ts:11` |
| `apiVersion` | `"2024-01-01"` | `sanity.ts:12` |
| `useCdn` | **`true`** | `sanity.ts:13` |
| `token` | **AUSENTE** — el cliente de lectura no lleva token | — |
| `perspective` / `stega` | **AUSENTES** — no hay draft mode ni visual editing | — |

**Patrón crítico: `client` puede ser `null`** (`sanity.ts:15`). Si el
`projectId` no pasa el regex, todas las rutas caen a datos locales.

**`urlFor` no es un re-export del builder.** Es un wrapper (`:20-33`) que, con
`builder === null`, devuelve un **stub encadenable** con `width()`, `height()`,
`quality()` que se retornan a sí mismos y `url()` que devuelve `""`. El stub
**no expone** `fit()`, `format()`, `auto()`, `blur()` — llamarlos en modo stub
tiraría `TypeError`.

## 7.10 — Queries GROQ, consumidores y caché

`src/lib/sanity.queries.ts` — 61 líneas, 3 queries exportadas.

**`ALL_PROJECTS_QUERY` (`:2-7`):**

```groq
  *[_type == "project"] | order(order asc) {
    _id, title, slug, projectNumber, category, services, year,
    coverImage, coverColor
  }
```

Sin `->`. **No trae `content`.**

**`PROJECT_BY_SLUG_QUERY` (`:10-15`):**

```groq
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, projectNumber, category, services, year,
    coverImage, content
  }
```

Trae `content` pero **no trae `coverColor`** (asimetría con la query 1). Sin `->`.

**`FUN_GALLERY_PROJECTS_QUERY` (`:18-61`):**

```groq
  *[_type == "project"] | order(order asc) {
    _id, title, slug, projectNumber, category, services, year,
    coverImage { ..., asset-> },
    coverColor,
    content[] {
      _type, _key, ...,
      _type == "mediaItem" => { caption, file { ..., asset-> } },
      _type == "dualMedia" => { left { ..., asset-> }, right { ..., asset-> } },
      image { ..., asset-> },
      images[] { ..., asset-> },
      gallery[] { ..., asset-> }
    }
  }
```

**Observación verificada:** las proyecciones `image`, `images[]` y `gallery[]`
(`:47-58`) **no corresponden a ningún campo del schema `project`** — el schema no
define `image`, `images` ni `gallery` en ningún nivel. Son proyecciones
defensivas sobre campos inexistentes. `gallery` sí aparece en el tipo huérfano
`Service` (`src/types/service.ts:7`).

### Consumidores

| Query | Consumidor | Contexto |
|---|---|---|
| `ALL_PROJECTS_QUERY` | `src/app/(site)/work/page.tsx:3` (import), `:21` (fetch) | Grid de Work |
| `ALL_PROJECTS_QUERY` | `src/app/(site)/work/[slug]/page.tsx:4`, `:114` | Navegación prev/next |
| `PROJECT_BY_SLUG_QUERY` | `src/app/(site)/work/[slug]/page.tsx:4`, `:84` | Detalle |
| `FUN_GALLERY_PROJECTS_QUERY` | `src/app/(site)/fun-gallery/page.tsx:5`, `:24` | Galería |

**Query inline** (fuera de `sanity.queries.ts`),
`src/app/(site)/work/[slug]/page.tsx:20-22`:

```ts
    const projects = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "project"]{ "slug": slug.current }`,
    );
```

Dentro de `generateStaticParams()`. **Sin tercer argumento** → sin opción de
caché explícita.

### Políticas de caché por ruta

**NO EXISTE NINGÚN `export const revalidate` EN EL REPO.** Cero coincidencias. La
revalidación se configura **exclusivamente per-fetch** vía el tercer argumento de
`client.fetch`.

**Solo 2 `export const dynamic`, ambos `force-dynamic`:**
`src/app/(site)/fun-gallery/page.tsx:17` y `src/app/studio/[[...tool]]/page.tsx:6`.

| Ruta | `dynamic` | `revalidate` | Opción per-fetch | Línea |
|---|---|---|---|---|
| `/work` | ausente | ausente | `{ next: { revalidate: 60 } }` | `work/page.tsx:21-23` |
| `/work/[slug]` (detalle) | ausente | ausente | `{ next: { revalidate: 60 } }` | `work/[slug]/page.tsx:86` |
| `/work/[slug]` (prev/next) | ausente | ausente | `{ next: { revalidate: 60 } }` | `work/[slug]/page.tsx:114-116` |
| `/work/[slug]` (`generateStaticParams`) | — | — | **NINGUNA** | `work/[slug]/page.tsx:20-22` |
| `/fun-gallery` | **`force-dynamic`** | ausente | `{ next: { revalidate: 60 } }` | `fun-gallery/page.tsx:17` y `:26` |
| `/studio/[[...tool]]` | **`force-dynamic`** | ausente | — | `studio/.../page.tsx:6` |

**Contradicción verificada en `/fun-gallery`:** declara `force-dynamic` (`:17`)
mientras el fetch pide `revalidate: 60` (`:26`), y además genera un `randomUUID()`
por request (`:41`). Con `force-dynamic` la ruta se renderiza en cada request; el
`revalidate: 60` del fetch queda subordinado a esa declaración.

**Fallback uniforme:** las tres rutas envuelven el fetch en `try/catch` y caen a
`LOCAL_WORK_PROJECTS` si `client` es `null`, si el array viene vacío, o si tira
error. `/work/[slug]` tiene cadena de dos niveles: `getLocalProjectBySlug(slug)
?? getMockProjectBySlug(slug) ?? null`.

### Queries que cambiarían si los campos de texto pasan a tener variante ES/EN

Las **tres** exportadas, más la inline:

1. `ALL_PROJECTS_QUERY` (`sanity.queries.ts:2-7`) — proyecta `title`, `category`, `services`, `year`.
2. `PROJECT_BY_SLUG_QUERY` (`:10-15`) — proyecta esos mismos + `content`.
3. `FUN_GALLERY_PROJECTS_QUERY` (`:18-61`) — proyecta esos mismos + `content` con `mediaItem.caption`.
4. La query inline de `generateStaticParams` (`work/[slug]/page.tsx:20-22`) — solo proyecta `slug`, **no cambiaría**.

## 7.11 — Variables de entorno

| Variable | archivo:línea | Fragmento |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `src/app/layout.tsx:18` | `process.env.NEXT_PUBLIC_SITE_URL \|\| "https://your-site-name.netlify.app",` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `src/lib/sanity.ts:4` | `const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID \|\| "";` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `src/sanity/sanity.config.ts:9` | `projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `src/app/api/seed-sanity/route.ts:10` | `const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;` |
| `SANITY_API_WRITE_TOKEN` | `src/app/api/seed-sanity/route.ts:11` | `const token = process.env.SANITY_API_WRITE_TOKEN;` |
| `RESEND_API_KEY` | `src/app/api/contact/route.ts:44` | `if (!process.env.RESEND_API_KEY) {` |
| `RESEND_API_KEY` | `src/app/api/contact/route.ts:63` | `const resend = new Resend(process.env.RESEND_API_KEY);` |
| `CONTACT_FROM_EMAIL` | `src/app/api/contact/route.ts:7` | `process.env.CONTACT_FROM_EMAIL \|\| "ESQUINA ESTUDIO <onboarding@resend.dev>";` |

**Variables de Sanity esperadas por el código: exactamente 2** —
`NEXT_PUBLIC_SANITY_PROJECT_ID` (3 sitios) y `SANITY_API_WRITE_TOKEN` (1 sitio,
solo el seeder).

**`NEXT_PUBLIC_SANITY_DATASET` NO se lee en ningún lado.** El dataset está
hardcodeado a `"production"` en los 3 sitios que lo necesitan (`sanity.ts:11`,
`sanity.config.ts:10`, `seed-sanity/route.ts:21`).

### `.env.local` (existe, 402 bytes, 5 variables — solo nombres y presencia)

| Nombre | Estado |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | **PRESENTE** (valor no vacío) |
| `NEXT_PUBLIC_SANITY_DATASET` | **PRESENTE** — pero ningún archivo del código la lee |
| `SANITY_API_WRITE_TOKEN` | **PRESENTE** (valor no vacío) |
| `RESEND_API_KEY` | **PRESENTE** (valor no vacío) |
| `CONTACT_FROM_EMAIL` | **PRESENTE** (valor no vacío) |

La única variable leída por el código y **AUSENTE** de `.env.local` es
`NEXT_PUBLIC_SITE_URL` (`src/app/layout.tsx:18`), que cae a su default
placeholder.

**Permisos del token configurado: DESCONOCIDO.** El repo registra que
`SANITY_API_WRITE_TOKEN` existe y que el seeder lo usa para escribir, pero los
permisos efectivos del token solo se pueden consultar en el panel de Sanity. El
cliente de lectura (`src/lib/sanity.ts`) **no usa token**, así que lee el dataset
como público.

## 7.12 — Cantidad de proyectos publicados

**DESCONOCIDO.** No se puede determinar sin consultar la API de Sanity por red.
El repo no contiene ningún dump, snapshot, `.ndjson` ni conteo del dataset
`production`. No existe `.sanity/`. Haría falta ejecutar
`*[_type == "project"] | count()` contra la API con el `projectId` de
`.env.local` — operación de red que esta corrida read-only no ejecutó.

**Los tres conjuntos locales tienen conteos y slugs inconsistentes entre sí, y
ninguno sirve como proxy:**

- **`src/lib/local-projects.ts` — 8 proyectos** (`LOCAL_WORK_PROJECTS`, `:13`):
  `akasha-blends`, `brook`, `brooks`, `matsu`, `matsu-identity`, `romar`,
  `tukumi`, `akasha-packaging`. `projectNumber` de `"01"` a `"08"`.
- **`src/lib/mock-data.ts` — 8 proyectos** (`MOCK_PROJECTS`, `:20`), con slugs
  **mayormente distintos**: `akasha-blends`, `nomada-studio`, `terracota-living`,
  `luna-botanical`, `verso-editorial`, `savia-organica`, `cobre-joyeria`,
  `raiz-cafe`. Solo `akasha-blends` coincide con el conjunto anterior.
- **`src/app/api/seed-sanity/route.ts` — 4 proyectos** (`:108`):
  `akasha-blends`, `brook-motors`, `tukumi-takeaway`, `matsu`. `brook-motors` y
  `tukumi-takeaway` **no existen** en ninguno de los otros dos.

---

## HECHOS VERIFICADOS — Bloque 7

- Existe **un solo schema**: `project`, en `src/sanity/schemas/project.ts`.
- Solo `title` y `slug` son requeridos. Ningún otro campo tiene validación.
- **Campos de texto traducibles de `project`: 3 raíz** (`title`, `category`, `services`) **+ 2 dentro de `content`** (bloques Portable Text, `mediaItem.caption`).
- **Ninguna imagen del schema tiene campo `alt`**, aunque el tipo TS lo declara.
- **No hay structure/desk personalizada**: `structureTool()` sin argumentos.
- **No hay ningún precedente de referencia documento-a-documento** en el proyecto.
- Los tipos TS de Sanity están **escritos a mano**, no generados.
- El cliente tiene `useCdn: true`, `dataset` hardcodeado a `"production"`, **sin token**.
- `urlFor` es un wrapper con stub; **no fuerza formato ni color de fondo**.
- **No existe ningún `export const revalidate`** en el repo. La caché se configura per-fetch.
- `/fun-gallery` declara `force-dynamic` y a la vez pide `revalidate: 60` en el fetch.
- `FUN_GALLERY_PROJECTS_QUERY` proyecta tres campos (`image`, `images[]`, `gallery[]`) que **no existen en el schema**.
- Restos del schema `Service`: solo el tipo TS huérfano `src/types/service.ts`, sin importadores.
- `docs/sanity-studio-guide.md:20-25` documenta un documento "Fun Gallery Image" que no existe en el código.
- Las 3 queries exportadas cambiarían si los campos de texto pasan a tener variante ES/EN.

## DESCONOCIDO — Bloque 7

1. **Cuántos proyectos publicados hay en el dataset `production`.** Requiere consulta de red a la API de Sanity. Sin ese número, el cálculo "campos traducibles × proyectos" del Nº 4 de NÚMEROS CLAVE no se puede cerrar.
2. **Los permisos efectivos del token `SANITY_API_WRITE_TOKEN`.** Solo consultables en el panel de Sanity.
3. **Si el dataset `production` es público o privado.** El cliente lee sin token, lo que funciona con datasets públicos; no se verificó la configuración del proyecto en Sanity.

## RIESGOS PARA LO QUE VIENE — Bloque 7

- **El schema nuevo de Fun Gallery con referencia opcional a `project` sería el primer uso de referencias del proyecto.** No hay patrón interno que copiar: ni en el schema, ni en GROQ, ni en los tipos TS escritos a mano.
- **Los tipos TS están escritos a mano y ya divergen del schema** (`alt` fantasma, opcionalidad más estricta que el schema). Cada campo nuevo hay que escribirlo a mano en dos lugares y mantenerlos sincronizados sin ayuda de herramientas.
- **El Studio no tiene groups ni fieldsets**: los 10 campos de `project` se muestran en una sola columna plana. Duplicar cada campo de texto para ES/EN llevaría `project` de 10 a 13 campos raíz en una lista plana, sin agrupación. Es riesgo de producto (usabilidad para las clientas), no de código.
- **Ninguna imagen tiene campo `alt` en el schema.** Los `alt` que hoy se renderizan salen de `project.title` o de `mediaItem.caption`. Si el schema nuevo de Fun Gallery quiere `alt` propio, no hay precedente en `project`.
- **`urlFor` devuelve un stub sin `format()` ni `fit()`.** Cualquier código nuevo que necesite forzar formato en las URLs de imagen rompería en el camino de fallback (cuando `client === null`), porque el stub no expone esos métodos.
- **`FUN_GALLERY_PROJECTS_QUERY` va a borrarse entera** al cambiar la fuente de datos; contiene 3 proyecciones muertas que no hay que arrastrar al schema nuevo.
- **No hay `.env.example`**, y `NEXT_PUBLIC_SANITY_DATASET` está definida en `.env.local` pero es ignorada por el código: quien la vea puede asumir que cambiarla surte efecto. No lo hace.

---

# ANEXO A — Material bruto de Services (insumo del Bloque 3)  `[SUPERADO]`

> Leído directo de disco en la sesión 1. **No es el Bloque 3.** Es el material
> verificado que sobrevivió, para que la corrida del Bloque 3 no lo relea a
> ciegas.
>
> **Sesión 5: el BLOQUE 3 (al final del documento) reemplaza a este anexo.**
> Todo lo de acá fue releído de disco y confirmado, con tres ampliaciones: la
> máquina de estados de A.4 estaba incompleta (faltaban la compensación de
> scroll de `ServicesIntro.tsx:439-442` y el guard de ancestros `:444-482` como
> efectos de la máquina), el PENDIENTE de A.11 quedó cerrado con grep exhaustivo,
> y A.12 quedó respondido con evidencia. Ante cualquier diferencia, manda el
> Bloque 3.

## A.1 — Archivos confirmados

Los cinco archivos que la instrucción nombra **existen con esos nombres exactos**:

- `src/app/(site)/services/page.tsx` (175 líneas)
- `src/app/(site)/services/ServicesPageClient.tsx` (33 líneas)
- `src/components/sections/services/ServicesIntro.tsx` (649 líneas)
- `src/components/sections/services/ServicesStack.tsx` (140 líneas)
- `src/components/sections/services/ServiceItem.tsx` (424 líneas)

**No hay archivos adicionales** en `src/components/sections/services/` según
`git ls-files`.

## A.2 — De dónde salen los datos: array hardcodeado

**Confirmado: array hardcodeado, sin ningún resto de fetch a Sanity.**
`src/app/(site)/services/page.tsx:11`:

```ts
const services: ServiceContent[] = [
```

El array va de `:11` a `:170` y contiene **6 entradas**: `"01"` (BRAND
ESSENTIALS), `"02"` (BRAND UNIVERSE), `"A.S/01"` (MOTION GRAPHICS), `"A.S/02"`
(PACKAGING), `"A.S/03"` (EDITORIAL), `"A.S/04"` (ILLUSTRATION).

Se pasa al cliente en `:172-174`:

```tsx
export default function ServicesPage() {
  return <ServicesPageClient services={services} />;
}
```

El tipo está definido en `src/components/sections/services/ServicesStack.tsx:11-17`:

```ts
export interface ServiceContent {
  id: string;
  name: string;
  description: string;
  note?: string;
  items: Array<string | { main: string; subs?: string[] }>;
}
```

**El archivo de la página no importa nada de Sanity.** Sus imports son
(`page.tsx:1-3`): `Metadata` de next, `ServiceContent` de `ServicesStack`, y
`ServicesPageClient`.

## A.3 — El contrato de altura: VERIFICADO, las dos ramas coinciden

**Rama estática — `ServicesIntro.tsx:542-559`:**

```tsx
  if (isStatic || shouldReduceMotion) {
    return (
      <div
        className="relative h-[200vh] w-full -mt-[var(--header-height)]"
        ref={containerRef}
      >
        <div className="flex h-screen w-full flex-col items-center justify-center bg-off-white px-6 text-center">
          <div className="relative flex flex-col items-center">
            <Text1Lines reduceMotion active />
          </div>
        </div>
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-off-white px-6 text-center">
          <FloatingMediaLayer float={isStatic && !shouldReduceMotion} />
          <div className="relative z-10 flex flex-col items-center">
            <Text2Lines reduceMotion active />
          </div>
        </div>
      </div>
    );
  }
```

**Rama intro — `ServicesIntro.tsx:567-572`:**

```tsx
    <div
      className="relative h-[200vh] w-full -mt-[var(--header-height)]"
      ref={containerRef}
    >
      <div className="sticky top-0 h-screen w-full bg-off-white z-10">
```

**Verificado: las clases del contenedor externo son idénticas carácter por
carácter** — `"relative h-[200vh] w-full -mt-[var(--header-height)]"` en `:545` y
en `:569`. **`h-[120vh]` no aparece en ninguna parte del archivo.**

Diferencia estructural entre ramas: la estática tiene **dos** `h-screen` en flujo
normal (`:548` y `:553`); la intro tiene **un** `sticky top-0 h-screen` (`:572`)
con dos capas `absolute inset-0` superpuestas (`:574` y `:625`).

## A.4 — La máquina de estados

**Cuatro estados + un ref de camino** (`ServicesIntro.tsx:307-317`):

```ts
  const [isJumping, setIsJumping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  // Latched once the forward intro is done. Never reset within a mount -> kills
  // the scroll-up replay at the source.
  const [isStatic, setIsStatic] = useState(false);
  const jumpedViaButtonRef = useRef(false);
```

Más `isPreloaderDone` de contexto (`:303`) y `reduceMotion` (`:304-305`).

**Constantes de tiempo (`:59-89`):**

```ts
const FADE_OUT_TIME = 1;
const FADE_IN_TIME = 1;
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const TITLE_DELAY = 0.12;
const TITLE_STAGGER = 0.08;
const TITLE_LINE_DURATION = 0.42;
const TITLE_1_LINE_COUNT = 3;
const CTA_DURATION = 0.45;
const CTA_DELAY =
  TITLE_DELAY + TITLE_STAGGER * (TITLE_1_LINE_COUNT - 1) + TITLE_LINE_DURATION;
const CTA_UNDERLINE_DELAY = CTA_DELAY + CTA_DURATION;
const TEXT2_DELAY_CHILDREN = TITLE_DELAY + FADE_OUT_TIME;
const TEXT1_REVEAL_MS =
  (TITLE_DELAY + TITLE_STAGGER * (TITLE_1_LINE_COUNT - 1) + TITLE_LINE_DURATION) *
  1000;
const INITIAL_LOCK_MS = TEXT1_REVEAL_MS;
const CROSSFADE_MS = (FADE_OUT_TIME + FADE_IN_TIME) * 1000;
```

Valores calculados: `CTA_DELAY` = 0,12 + 0,08×2 + 0,42 = **0,70 s**.
`CTA_UNDERLINE_DELAY` = **1,15 s**. `TEXT1_REVEAL_MS` = **700 ms**.
`INITIAL_LOCK_MS` = **700 ms**. `CROSSFADE_MS` = **2000 ms**.
`TEXT2_DELAY_CHILDREN` = **1,12 s**.

**Transiciones:**

1. `isInitialLoadComplete` false → true (`:324-332`): timer de `INITIAL_LOCK_MS`
   (700 ms) que arranca cuando `isPreloaderDone && !hasInteracted`. Bajo
   `reduceMotion` el delay es 0.
2. `hasInteracted` false → true: por `wheel` con `deltaY > 0` (`:366-369`), por
   `touchmove` con `deltaY > 0` (`:384-387`), o por el botón (`:490`).
3. `isStatic` false → true, **camino scroll** (`:341-349`): timer de
   `CROSSFADE_MS` (2000 ms) tras `hasInteracted`.
4. `isStatic` false → true, **camino botón** (`:520-527`): `setTimeout` de 1600
   ms anidado dentro de otro de 400 ms.
5. `isJumping`: true en `handleDiscover` (`:489`), false a los 400+1600 ms
   (`:521`).

**`isStatic` nunca vuelve a false dentro de un montaje** (comentario explícito en
`:310-311`).

## A.5 — Listeners y `preventDefault`

`ServicesIntro.tsx:355-408`. Se registran **solo si `!isStatic`** (`:356`):

```ts
    if (isStatic) return;

    let touchStartY = 0;
    const isLocked = () => !isInitialLoadComplete && !shouldReduceMotion;

    const handleWheel = (event: WheelEvent) => {
      if (isJumping) return;
      if (!isPreloaderDone) return;
      if (isLocked()) return;

      if (!hasInteracted && event.deltaY > 0) {
        event.preventDefault();
        setHasInteracted(true);
      }
    };
```

```ts
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
```

**`preventDefault()` se llama bajo exactamente esta conjunción:** no está en modo
estático, no está saltando, el preloader terminó, `isInitialLoadComplete` es true
(o `reduceMotion`), `hasInteracted` es false, y el delta es hacia abajo. Los tres
listeners son `passive: false`.

## A.6 — El bloqueo de scroll del body

`ServicesIntro.tsx:418-431`, en `useLayoutEffect`:

```ts
  useLayoutEffect(() => {
    if (isStatic || isJumping || shouldReduceMotion) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    } else {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isStatic, isJumping, shouldReduceMotion]);
```

**Condición exacta de liberación: `isStatic || isJumping || shouldReduceMotion`.**
Mientras las tres sean false, `document.body.style.overflow === "hidden"`.

## A.7 — `FloatingMediaLayer` y `FLOATING_MEDIA`

**Las imágenes son 7 archivos locales de `/public/projects/`**, no de Sanity.
`ServicesIntro.tsx:20-56` — `FLOATING_MEDIA`:

| `src` | `alt` | `className` |
|---|---|---|
| `/projects/akasha-producto-2.jpg` | `Akasha packaging detail` | `top-[15%] left-[8%] w-[180px] h-[240px]` |
| `/projects/matsu-compu.png` | `Matsu digital identity` | `top-[45%] left-[2%] w-[140px] h-[200px]` |
| `/projects/romar.jpg` | `Romar brand atmosphere` | `bottom-[10%] left-[10%] w-[160px] h-[160px]` |
| `/projects/tukumi.jpg` | `Tukumi illustration and packaging` | `top-[12%] right-[12%] w-[200px] h-[280px]` |
| `/projects/brook-logo-texto.png` | `Brook identity detail` | `top-[40%] right-[5%] w-[150px] h-[150px]` |
| `/projects/akasha-producto.png` | `Akasha packaging alternate detail` | `bottom-[25%] right-[20%] w-[120px] h-[160px]` |
| `/projects/matsu.png` | `Matsu identity detail` | `bottom-[5%] right-[5%] w-[220px] h-[220px]` |

**Por qué el float arranca solo en modo estático** — comentario del propio código
(`:196-198`) y la prop:

```tsx
      // Bug B: the gentle float starts ONLY in static mode. During the intro the
      // images stay at their base position, so the static layer (which mounts at
      // base) produces no jump on the swap — the float then begins from base.
      animate={float ? { y: [0, -25, 0], x: [0, 15, 0] } : { y: 0, x: 0 }}
      transition={
        float
          ? { duration: 8 + index * 1.5, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0 }
      }
```

Llamadas: `float={false}` en la rama intro (`:637`), `float={isStatic &&
!shouldReduceMotion}` en la rama estática (`:554`).

**Repulsión al cursor** (`:151-191`): `triggerRadius = 100` px, `maxPush = 80`
px, spring `{ stiffness: 50, damping: 15, mass: 0.5 }` (`:146`), con dirección
lockeada al primer contacto (`lockedDirection`, `:149`, `:163-168`).

## A.8 — El botón DISCOVER

**CORRECCIÓN A LA INSTRUCCIÓN.** El texto del botón es
**`DISCOVER OUR BRANDING SERVICES`**, no `DISCOVER OUR SERVICES`.
`ServicesIntro.tsx:618`:

```tsx
                DISCOVER OUR BRANDING SERVICES
```

JSX completo (`:610-619`):

```tsx
              <HoverButton
                as="button"
                className="font-body text-[17px] uppercase"
                underline={isPreloaderDone}
                underlineDraw={isPreloaderDone}
                underlineDrawDelay={CTA_UNDERLINE_DELAY}
                onClick={handleDiscover}
              >
                DISCOVER OUR BRANDING SERVICES
              </HoverButton>
```

`handleDiscover` (`:484-529`) — scroll suave programático **escrito a mano**, sin
Lenis ni `scroll-behavior`:

```ts
  const handleDiscover = () => {
    jumpedViaButtonRef.current = true;
    setIsJumping(true);
    setHasInteracted(true);

    setTimeout(() => {
      const target = document.getElementById("services-list");
      if (target) {
        const headerOffset = 140;
        const elementPosition = target.getBoundingClientRect().top;
        const targetY = elementPosition + window.scrollY - headerOffset;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 1000;
        let start: number | null = null;

        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          let ease = progress / duration;
          ease = ease < 0.5 ? 2 * ease * ease : -1 + (4 - 2 * ease) * ease;

          const finalEase = Math.min(Math.max(ease, 0), 1);
          window.scrollTo(0, startY + distance * finalEase);

          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        };

        window.requestAnimationFrame(step);
      }

      setTimeout(() => {
        setIsJumping(false);
        setIsStatic(true);
      }, 1600);
    }, 400);
  };
```

**Números exactos:** delay inicial 400 ms · `duration` del scroll 1000 ms ·
`headerOffset` 140 px · easing cuadrático in-out escrito a mano ·
`setIsStatic(true)` diferido 1600 ms después del arranque del scroll (2000 ms
desde el click). Destino: `document.getElementById("services-list")`, que es
`ServicesStack.tsx:93` (`id="services-list"`).

## A.9 — Los textos partidos en líneas

**`Text1Lines` — 3 líneas** (`ServicesIntro.tsx:250-254`):

```ts
  const lines = [
    "WE TRANSLATE IDEAS INTO LIVING IDENTITIES —",
    "CRAFTED THROUGH STRATEGY, AESTHETICS AND",
    "DETAIL-ORIENTED DESIGN SYSTEMS.",
  ];
```

Contenedor (`:256`): `className="font-display text-[40px] uppercase leading-[1.05] text-off-black max-w-5xl"`.

**`Text2Lines` — 4 líneas, las dos últimas en negrita** (`:279-284`):

```ts
  const lines: Array<{ text: React.ReactNode; bold?: boolean }> = [
    { text: <>Whether we&rsquo;re shaping a brand from scratch or</> },
    { text: "reimagining an existing one, our approach is rooted in" },
    { text: "creating experiences that feel authentic, memorable", bold: true },
    { text: "and visually cohesive across every touchpoint.", bold: true },
  ];
```

Contenedor (`:286`): `className="font-display text-[40px] leading-[1.05] text-off-black max-w-5xl"` (sin `uppercase`).

**Nota para el censo del Bloque 2.c:** la primera línea de `Text2Lines` **no es
un string plano** — es JSX con la entidad `&rsquo;` (categoría 3, texto con
markup embebido). Las otras tres sí son strings.

**Cómo se calcula el delay de cada línea** — `RevealLine`, `:116-129`:

```tsx
    <motion.span
      className={`block${bold ? " font-bold" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: TITLE_LINE_DURATION,
        delay: active ? delayBase + index * TITLE_STAGGER : 0,
        ease: EASE,
      }}
    >
```

**`delay = delayBase + index * 0.08`.** `delayBase` es `TITLE_DELAY` (0,12) para
texto 1 (`:261`) y `TEXT2_DELAY_CHILDREN` (1,12) para texto 2 (`:293`).

**El acoplamiento a la cantidad de líneas.** `TITLE_1_LINE_COUNT = 3` (`:68`) es
una **constante literal**, no `lines.length`. Alimenta `CTA_DELAY` (`:71-72`),
`CTA_UNDERLINE_DELAY` (`:73`), `TEXT1_REVEAL_MS` (`:85-87`) y por lo tanto
`INITIAL_LOCK_MS` (`:88`), que es el tiempo de bloqueo del scroll-jack. **Si el
texto 1 en español pasa de 3 a 4 líneas, esa constante queda desincronizada del
arreglo y el scroll se desbloquea antes de que termine el reveal.** El texto 2 no
tiene constante equivalente: su delay solo depende de `index`.

`Hero` tiene el mismo patrón con el mismo riesgo, pero con las líneas **no** en
arreglo: son tres `<motion.p>` hermanos con `staggerChildren`
(`src/components/sections/home/Hero.tsx:53-70`), y `TITLE_LINE_COUNT = 3` en
`Hero.tsx:11` alimenta `CTA_DELAY` en `:13-14`.

## A.10 — Qué debe sobrevivir al rediseño

| Elemento | Ubicación | Nota |
|---|---|---|
| Reveal por líneas estilo Hero | `ServicesIntro.tsx:98-130` (`RevealLine`) | Comentario `:91-97` explica por qué NO usa `staggerChildren` orquestado |
| Crossfade texto1 → texto2 | `ServicesIntro.tsx:573-586` (capa 1) y `:624-635` (capa 2) | `FADE_OUT_TIME`/`FADE_IN_TIME` = 1 s cada uno |
| Imágenes flotantes con repulsión | `ServicesIntro.tsx:134-233` | 7 imágenes locales, radio 100 px, push 80 px |
| Contrato de altura | `ServicesIntro.tsx:545` y `:569` | `h-[200vh]` idéntico en ambas ramas |
| Manejo de `prefers-reduced-motion` | `ServicesIntro.tsx:304-305`, `:113-115`, `:328`, `:342`, `:419`, `:542` | `useReducedMotion()` de Framer; con reduced motion cae directo a la rama estática |
| Gating por preloader | `ServicesIntro.tsx:303`, `:326`, `:363`, `:377`, `:577`, `:595`, `:613-614` | `isPreloaderDone` gatea reveal, listeners y underline |

## A.11 — Scroll-spy, sticky y observadores existentes (hallazgos parciales)

**Encontrados leyendo los archivos de Services. Sin grep exhaustivo del repo.**

| Técnica | Ubicación | Fragmento |
|---|---|---|
| GSAP `ScrollTrigger` | `ServicesStack.tsx:64-74` | `ScrollTrigger.create({ trigger: lastItem, start: "top 104px", once: true, onEnter: ... })` |
| GSAP `ScrollTrigger` | `ServiceItem.tsx:148-170` | `ScrollTrigger.create({ trigger: article, start: "top bottom", end: () => "bottom 128px", invalidateOnRefresh: true, once: true, onLeave: ... })` |
| `position: sticky` | `ServiceItem.tsx:68-70` | `const headerPositionClass = isLast ? "relative z-10" : "sticky top-[115px] z-40";` |
| `RevealOnScroll` | `ServiceItem.tsx:212` | `<RevealOnScroll delay={index * 0.05}>` |
| `ScrollTrigger.refresh()` | `ServiceItem.tsx:166` | dentro de un `setTimeout` de 50 ms tras colapsar |

**Los dos `ScrollTrigger` usan `once: true`**, o sea son **latches de un disparo,
no scroll-spies continuos**. Ninguno reporta "sección actual". **No se encontró
ningún `IntersectionObserver` en los archivos de Services.**

**PENDIENTE:** grep exhaustivo de `IntersectionObserver`, `useInView`,
`whileInView`, `useScroll`, `useTransform` y `sticky` en todo `src/`.

## A.12 — El menú lateral sticky y el bloqueo de scroll

**Lo que gobierna la operabilidad:** `document.body.style.overflow = "hidden"`
en `ServicesIntro.tsx:423`, activo mientras `!isStatic && !isJumping &&
!shouldReduceMotion`.

**Hecho medible:** durante ese lapso el `<body>` no scrollea. Un menú lateral
`position: sticky` depende del scroll de su contenedor de scroll para
reposicionarse.

**No afirmo qué se vería en pantalla.** Eso depende de dónde se monte el menú en
el árbol y de qué contenedor de scroll herede, y ese componente no existe todavía.
Lo verificable hoy es la condición de bloqueo, transcrita arriba.

**Dato adicional relevante:** `ServicesIntro.tsx:444-482` recorre los ancestros
del contenedor y **fuerza a `overflow: visible`** cualquier ancestro con
`overflow` `hidden` o `clip`, restaurándolos al desmontar:

```ts
      const hasStickyBlockingOverflow = [
        styles.overflow,
        styles.overflowX,
        styles.overflowY,
      ].some((value) => value === "hidden" || value === "clip");
```

El comentario del código y el nombre de la variable indican que existe
específicamente para que `position: sticky` funcione.

---

# ANEXO B — Material bruto de Fun Gallery (insumo del Bloque 4)  `[PARCIAL]`

> Leído directo de disco en la sesión 1. **No es el Bloque 4.**
> *(Sesión 3: el Bloque 4, al final del documento, releyó los cuatro archivos
> íntegros, verificó todas las citas de este anexo línea por línea y cerró sus
> pendientes — incluido B.10. Este anexo queda como material de respaldo.)*

## B.1 — La ruta

`src/app/(site)/fun-gallery/page.tsx` — archivo completo (44 líneas):

```tsx
import { Metadata } from "next";
import { randomUUID } from "crypto";
import FunGallery from "@/components/sections/gallery/FunGallery";
import { client } from "@/lib/sanity";
import { FUN_GALLERY_PROJECTS_QUERY } from "@/lib/sanity.queries";
import {
  LOCAL_WORK_PROJECTS,
  withLocalProjectImages,
} from "@/lib/local-projects";
import { Project } from "@/types/project";

export const metadata: Metadata = {
  title: "Fun Gallery - ESQUINA ESTUDIO™",
  description:
    "A free-form visual gallery from ESQUINA ESTUDIO with images, references and studio moments.",
};
export const dynamic = "force-dynamic";

async function getGalleryProjects(): Promise<Project[]> {
  try {
    if (!client) return LOCAL_WORK_PROJECTS;

    const projects = await client.fetch(
      FUN_GALLERY_PROJECTS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    if (!projects || projects.length === 0) {
      return LOCAL_WORK_PROJECTS;
    }

    return withLocalProjectImages(projects);
  } catch {
    return LOCAL_WORK_PROJECTS;
  }
}

export default async function FunGalleryPage() {
  const projects = await getGalleryProjects();
  const randomSeed = randomUUID();

  return <FunGallery projects={projects} randomSeed={randomSeed} />;
}
```

**Bloque 4.f — confirmado:** `export const dynamic = "force-dynamic"` (`:17`)
combinado con `randomUUID()` por request (`:41`) **sigue así**. La clasificación
que produce el build está PENDIENTE.

## B.2 — La cadena de derivación

Todas en `src/components/sections/gallery/FunGallery.tsx`:

| Función | Líneas | Qué hace |
|---|---|---|
| `hashString` | `113-122` | FNV-1a de 32 bits sobre el string |
| `createRandom` | `124-131` | LCG determinista sembrado con `hashString(seed)` |
| `randomBetween` | `133-135` | `min + random() * (max - min)` |
| `shuffle` | `137-149` | Fisher-Yates con el `random` inyectado |
| `getImageAssetKey` | `151-154` | `image.asset._id ?? image.asset._ref ?? null`; si es string, el string |
| `getImageUrl` | `156-162` | `urlFor(image).width(1200).quality(90).url()` con fallback a `image.asset.url` |
| `isMediaItem` | `164-166` | `block?._type === "mediaItem"` |
| `isDualMedia` | `168-170` | `block?._type === "dualMedia"` |
| `isSanityImageLike` | `172-177` | objeto con `.asset` truthy |
| `getGenericBlockImageCandidates` | `179-211` | busca `block.image`, `block.images[]`, `block.gallery[]` |
| `getProjectImageCandidates` | `213-252` | portada + `content` aplanado |
| `getGalleryItems` | `254-278` | dedup por asset key y armado de `GalleryItem` |
| `buildMapLayout` | `280-345` | posiciones, tamaños, rotación, zIndex, parallax |

**La deduplicación** (`:255`, `:264-266`):

```ts
  const seenAssetKeys = new Set<string>();
  ...
      if (!assetKey || !imageUrl || seenAssetKeys.has(assetKey)) return [];

      seenAssetKeys.add(assetKey);
```

Es un `Set` **global a toda la pasada**, no por proyecto: si dos proyectos usan
el mismo asset, aparece una sola vez.

**El origen de la portada** (`:244-251`):

```ts
  return [
    {
      image: project.coverImage,
      alt: project.title,
      keySuffix: "cover",
    },
    ...contentImages,
  ];
```

**PENDIENTE (Bloque 4.a):** el grep repo-wide que determina si estas funciones
las usa alguien más además de Fun Gallery. Las funciones están **definidas en el
propio `FunGallery.tsx`** (módulo local, no exportadas — ninguna lleva `export`),
lo que acota el riesgo, pero el grep no se corrió.

## B.3 — Los tipos que consume el layout

`FunGallery.tsx:76-103`:

```ts
type GalleryItem = {
  id: string;
  title: string;
  href?: string;
  imageUrl: string;
};

type ProjectImageCandidate = {
  image: SanityImageLike | string | null | undefined;
  alt?: string;
  keySuffix: string;
};

type MapItem = GalleryItem & {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  parallaxFactor: number;
};

type MapLayout = {
  width: number;
  height: number;
  items: MapItem[];
};
```

**Campos mínimos que la fuente nueva tiene que producir para que el layout siga
funcionando sin tocarlo: `id` (string), `title` (string), `imageUrl` (string) y
`href` (string, OPCIONAL).** `MapItem` lo deriva `buildMapLayout` a partir de
`GalleryItem`; la fuente no lo produce.

## B.4 — ¿El layout asume que todo ítem es un link? NO

**Verificado: el layout ya soporta ítems sin link.** `FunGallery.tsx:410-429`:

```tsx
    <motion.div
      className={`absolute transform-gpu will-change-transform ${
        item.href ? "cursor-pointer" : ""
      }`}
      ...
      whileHover={{ scale: HOVER_SCALE, zIndex: HOVER_Z_INDEX }}
      transition={{ duration: HOVER_DURATION, ease: EASE }}
      role={item.href ? "link" : undefined}
      tabIndex={item.href ? 0 : undefined}
      aria-label={item.href ? `View ${item.title}` : undefined}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
```

Y los handlers salen temprano sin `href` (`:369-380`):

```ts
  const handleNavigate = () => {
    if (!item.href) return;
    navigateWithTransition(item.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!item.href) return;
    ...
```

**`href` ya es opcional en el tipo (`:79` — `href?: string;`) y el componente ya
lo maneja en 5 lugares.** La referencia opcional del schema nuevo encaja con lo
que el layout ya sabe hacer.

**Cómo se navega hoy** (`:258` en `getGalleryItems`):

```ts
    const href = project.slug?.current ? `/work/${project.slug.current}` : undefined;
```

y (`:371`) `navigateWithTransition(item.href)` — usa el sistema de transición de
ruta, **no** `<Link>` ni `<a>`. Nota: como el disparo de la transición global es
un listener de click sobre anchors (`RouteTransitionProvider.tsx:180-202`) y acá
no hay anchor, la navegación pasa por la llamada directa al contexto.

## B.5 — El hover actual, con precisión

Constantes (`FunGallery.tsx:69-71`):

```ts
const HOVER_SCALE = 1.2;
const HOVER_DURATION = 0.5;
const HOVER_Z_INDEX = 999;
```

Aplicación (`:423-424`):

```tsx
      whileHover={{ scale: HOVER_SCALE, zIndex: HOVER_Z_INDEX }}
      transition={{ duration: HOVER_DURATION, ease: EASE }}
```

con `EASE = [0.25, 0.1, 0.25, 1]` (`:74`).

**Valores exactos: escala 1.2 · duración 0,5 s · easing cúbico `[0.25, 0.1, 0.25,
1]` · zIndex 999.**

**No hay `hover:z-50` en `FunGallery.tsx`.** La instrucción menciona `hover:z-50`;
la clase Tailwind `hover:z-50` sí existe pero en **`ServicesIntro.tsx:195`**
(`className={\`pointer-events-auto absolute z-0 hover:z-50 ${item.className}\`}`),
que es la capa de imágenes flotantes de Services, no la galería. En Fun Gallery
el z-index de hover se aplica vía Framer con el valor 999.

**El "movimiento" del que hablan las clientas** — dos capas de parallax
independientes del hover:

1. **Parallax del mapa completo** (`:512-521`): el contenedor entero se desplaza
   con `springX`/`springY`, hasta `MAP_MOVE_X = 900` px y `MAP_MOVE_Y = 700` px
   (`:30-31`), spring `{ stiffness: 500, damping: 100, mass: 1 }` (`:41-48`).
2. **Parallax por ítem** (`:360-367`, `:393-396`): cada imagen se mueve con su
   `parallaxFactor` (entre 2 y 3, `:36-37`) por
   `ITEM_PARALLAX_STRENGTH_X/Y = 40` (`:38-39`), spring
   `{ stiffness: 500, damping: 100, mass: 1.5 }` (`:50-54`). La capa interna es
   `absolute -inset-[8%]`, o sea sobredimensionada un 8% para que el
   desplazamiento no muestre bordes.

## B.6 — El layout y el seed

`buildMapLayout` (`:280-345`). Constantes de dimensionado (`:22-73`):

```ts
const MAP_WIDTH_FEW_IMAGES = 2550;
const MAP_HEIGHT_FEW_IMAGES = 1450;
const MAP_WIDTH_MANY_IMAGES = 3100;
const MAP_HEIGHT_MANY_IMAGES = 1750;
const MAP_SIZE_PER_IMAGE = 20;
const GRID_CELL_DENSITY = 1.15;
const MIN_IMAGE_WIDTH_FEW_IMAGES = 380;
const MAX_IMAGE_WIDTH_FEW_IMAGES = 680;
const MIN_IMAGE_WIDTH_MANY_IMAGES = 320;
const MAX_IMAGE_WIDTH_MANY_IMAGES = 560;
const ROTATION_RANGE = 0;
const EDGE_BLEED = -180;
const EAGER_IMAGE_COUNT = 6;
```

**`ROTATION_RANGE = 0`**: la rotación está calculada (`:335` —
`rotate: randomBetween(random, -ROTATION_RANGE, ROTATION_RANGE)`) pero **da
siempre 0**. El sistema de rotación existe y está desactivado por constante.

**Cómo depende del `randomSeed`** (`:299`):

```ts
  const random = createRandom(randomSeed);
```

**Ese único `random` alimenta, en orden, todo el layout:** el shuffle de celdas
(`:304-307`), y por cada ítem el ancho, la relación de aspecto, dos jitters de
posición, la rotación, el zIndex y el `parallaxFactor` (`:316-341`). Es un LCG
secuencial: **cambiar el seed cambia el layout entero**.

**Qué pasa si el seed deja de ser aleatorio por request:** el layout pasa a ser
determinista y estable entre requests. La densidad se calcula con
`density = clamp((count - 6) / 18, 0, 1)` (`:282`), o sea que con 8 imágenes
`density = 0.111` — cerca del extremo "pocas imágenes".

## B.7 — Cómo se cargan las imágenes

`FunGallery.tsx:397-405`:

```tsx
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 78vw, 26vw"
          priority={index < EAGER_IMAGE_COUNT}
          onLoadingComplete={() => setIsLoaded(true)}
          className="object-cover"
        />
```

- `fill`: **sí**
- `sizes`: `"(max-width: 768px) 78vw, 26vw"`
- `priority`: **las primeras 6** (`EAGER_IMAGE_COUNT = 6`, `:73`)
- `loading`: no se declara → default de Next
- `placeholder`: **no se declara** → sin blur placeholder
- `className="object-cover"` — **relevante para PNG con alpha:** `object-cover`
  recorta para llenar la caja; con recortes de producto de anchos muy variables
  (31%–84% del cuadrado) el encuadre no preserva la proporción del contenido.

**Cuántas se montan de una en el primer render:** **todas.**
`FunGallery.tsx:523-531`:

```tsx
          {mapLayout.items.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              pointerX={springPointerX}
              pointerY={springPointerY}
            />
          ))}
```

No hay virtualización, no hay paginado, no hay ventana. Se monta un
`GalleryCard` por cada ítem del pool. Las 6 primeras con `priority` (o sea
precargadas), el resto con lazy loading nativo del componente `Image`.

El fade de entrada por imagen (`:386-391`):

```tsx
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{
        duration: IMAGE_FADE_DURATION,
        delay: (index % IMAGE_FADE_STAGGER_BUCKET) * IMAGE_FADE_STAGGER,
        ease: EASE,
      }}
```

con `IMAGE_FADE_DURATION = 1.2`, `IMAGE_FADE_STAGGER = 0.3`,
`IMAGE_FADE_STAGGER_BUCKET = 6` (`:65-67`).

## B.8 — El contenedor de la galería

`FunGallery.tsx:507-511`:

```tsx
    <main className="fixed inset-0 h-[100svh] w-screen overflow-hidden overscroll-none bg-off-white text-off-black">
      <section
        className="relative h-full w-full overflow-hidden bg-off-white"
        aria-label="Fun Gallery"
      >
```

**`fixed inset-0` + `overflow-hidden`: la ruta no scrollea.** Es la única ruta
del sitio con esa forma. Nota: este `<main>` está **anidado dentro** del `<main
className="pt-[var(--header-height)]">` de `(site)/layout.tsx:17`.

## B.9 — `LOCAL_WORK_PROJECTS` y `withLocalProjectImages`

`src/lib/local-projects.ts` (195 líneas).

**`LOCAL_WORK_PROJECTS` (`:13-150`) — 8 proyectos con contenido real**, no
placeholders: título, slug, `projectNumber` `"01"`–`"08"`, `category`,
`services`, `year`, `coverImage` apuntando a `/public/projects/`, `coverColor`
hex, y un bloque de texto por proyecto. Ejemplo (`:14-30`):

```ts
  {
    _id: "local-akasha",
    title: "AKASHA BLENDS",
    slug: { current: "akasha-blends" },
    projectNumber: "01",
    category: "FOOD & BEVERAGES",
    services: "BRANDING / PACKAGING DESIGN / PHOTOGRAPHY",
    year: "Y / 2025",
    coverImage: "/projects/akasha-producto-2.jpg",
    coverColor: "#C4A77D",
    content: [
      textBlock(
        "local-akasha-intro",
        "A sensory brand and packaging system for Akasha, built around botanical detail, texture, and product ritual.",
      ),
    ],
  },
```

**Cuándo se activan:** cuando `client === null`, cuando la query devuelve vacío, o
cuando tira error (`fun-gallery/page.tsx:20-36`). Es un **fallback de
producción**, no solo de desarrollo: el mismo camino corre en el build desplegado.

**`withLocalProjectImages` (`:181-194`):** solo rellena `coverImage` cuando el
proyecto de Sanity no la trae, buscando por coincidencia de slug/título en
`LOCAL_PROJECT_IMAGE_MATCHERS` (`:152-161`). **No toca `content`.**

Exports adicionales: `getLocalProjectBySlug` (`:170-172`), `getLocalProjectImage`
(`:174-179`).

**PENDIENTE:** grep de quién más consume `LOCAL_WORK_PROJECTS` y
`withLocalProjectImages`. Verificado hasta ahora: `fun-gallery/page.tsx:7-8`.
El subagente de Sanity reportó consumo también en `work/page.tsx` y
`work/[slug]/page.tsx`, sin número de línea del import.

## B.10 — Los ocho PNG nuevos

**No encontrados en el repo.** `git ls-files` lista 10 archivos en
`public/projects/`: `akasha-producto-2.jpg`, `akasha-producto.png`,
`akasha.png`, `brook-logo-texto.png`, `brooks-logo.png`, `matsu-compu.png`,
`matsu.png`, `romar.jpg`, `team.jpg`, `tukumi.jpg`.

**DESCONOCIDO:** dónde están los ocho PNG de 2250×2250 con alpha que describe la
instrucción. No están en `public/`. Existen cuatro directorios ignorados por git
(`Asset_ Imágenes`, `Asset_ Logo`, `Asset_ Tipografía`, `design-refs`) que no se
inspeccionaron. Las propiedades que la instrucción atribuye a esos archivos
(dimensiones, alpha real, pesos de 365 KB a 2,9 MB, ~12 MB totales, contenido al
75–88% del alto y 31–84% del ancho) **no fueron verificadas por esta corrida**.

## B.11 — Otros lugares del sitio que sirven imágenes con transparencia

**PARCIAL.** Verificado hasta ahora: hay PNG en uso en `FLOATING_MEDIA` de
Services (`matsu-compu.png`, `brook-logo-texto.png`, `akasha-producto.png`,
`matsu.png`) y en `SLIDESHOW_IMAGES` de `ServiceItem.tsx:39-44`
(`akasha.png`, `matsu.png`). **Todos se renderizan con `object-cover`** dentro de
contenedores con fondo (`bg-gray-brand/20` en `ServicesIntro.tsx:211`,
`bg-gray-brand/30` / `bg-off-white/15` en `ServiceItem.tsx:393`).

**No verifiqué si esos PNG tienen canal alpha real.** Requiere inspeccionar los
archivos binarios. Los logos del header sí lo tienen por su uso
(`logo-header-blanco.png` se pinta como partículas leyendo el canal alfa en
`LoadingScreen.tsx:207` — `const alpha = pixels[(y * sourceCanvas.width + x) * 4 + 3];`),
lo que **prueba que al menos `logos/logo-header-blanco.png` tiene alpha**, pero
ese archivo se carga como `<img>`/canvas, no por el pipeline de `next/image`.

---

# ANEXO C — Otros datos verificados de la sesión 1

## C.1 — Navbar y Footer: valores tipográficos declarados (insumo del Bloque 2.b)

> Son los **valores declarados en clases Tailwind**, no medidos en runtime. La
> medición del Bloque 2.a es la que manda.

**Navbar** (`src/components/layout/Navbar.tsx`):

| Elemento | font-size | tracking | Línea |
|---|---|---|---|
| Tabs `WORK`/`SERVICES`/`TEAM`/`FUN GALLERY` | `text-[13px]` | `tracking-wider` (o `tracking-[0.09em]` en fun-gallery) | `:307-311` |
| `CONTACT US` | `text-[13px]` | `tracking-wider` (o `tracking-[0.09em]` en fun-gallery) | `:330-334` |
| Botón cerrar menú móvil (`X`) | `text-[17px]` | — | `:384` |
| Links del menú móvil | `text-[48px]`, `leading-none` | — | `:397` |

Labels hardcodeados en `:10-15`:

```ts
const NAV_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "TEAM", href: "/team" },
  { label: "FUN GALLERY", href: "/fun-gallery" },
] as const;
```

y `CONTACT US` en `:336`.

**Footer** (`src/components/layout/Footer.tsx`):

| Elemento | Clases | Línea |
|---|---|---|
| Bloque de textos chicos (`BORN IN`, `ARGENTINA`, `WORKING`, `WORLDWIDE`, `INSTAGRAM`, `LINKEDIN`, `© 2024`) | `text-[17px] uppercase leading-none` + `tracking-normal` (o `tracking-[0.035em]` en fun-gallery) + peso `font-[550]` (o `font-thin`) | `:117` |
| `BY develOP` (variante chica) | `font-body text-[17px] leading-none tracking-normal` | `:42` |
| `POWERED BY develOP` (variante grande) | `font-display text-[40px] leading-none tracking-normal` | `:41` |
| `LET'S WORK TOGETHER!` (CTA) | `font-display ... text-[40px] uppercase leading-none` + `tracking-normal` (o `tracking-[0.02em]` en fun-gallery) | `:188` |

**Importante para el pedido de "interletrado 0":** el tracking del footer ya es
`tracking-normal` en todas las rutas salvo `/fun-gallery`. `tracking-normal` en
Tailwind es `letter-spacing: 0em`. El menú, en cambio, usa `tracking-wider`
(`0.05em` en Tailwind por defecto) en todas las rutas salvo `/fun-gallery`.
**Los valores computados reales están PENDIENTES de medición (Bloque 2.a/2.b).**

Textos hardcodeados del footer, con línea:

| Texto | Línea |
|---|---|
| `BORN IN` | `Footer.tsx:120` |
| `ARGENTINA` | `Footer.tsx:123` |
| `WORKING` | `Footer.tsx:126` |
| `WORLDWIDE` | `Footer.tsx:129` |
| `INSTAGRAM` | `Footer.tsx:141` |
| `LINKEDIN` | `Footer.tsx:154` |
| `&copy; 2024` | `Footer.tsx:159` |
| `POWERED BY ` / `BY ` + `develOP` | `Footer.tsx:51-52` |
| `LET&apos;S WORK TOGETHER!` | `Footer.tsx:190` |

**Nota de categoría (Bloque 2.c):** `&copy; 2024` (`:159`) y `LET&apos;S WORK
TOGETHER!` (`:190`) son **categoría 3** (texto con markup/entidad embebida).
`POWERED BY develOP` está partido en JSX con un `<span>` interno (`:50-53`),
también categoría 3.

## C.2 — Hero de Home

`src/components/sections/home/Hero.tsx` — tres párrafos hermanos, **no un
arreglo** (`:53-70`):

```tsx
          <motion.p
            variants={lineVariants}
            className="font-display text-[40px] uppercase leading-[1.05] text-off-black"
          >
            IN A WORLD FULL OF NOISE
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="mt-1 font-display text-[40px] uppercase font-semibold leading-[1.05] text-off-black"
          >
            MAKE YOUR BRAND STAND OUT.
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="mt-1 font-display text-[40px] uppercase leading-[1.05] text-off-black"
          >
            WITH INTENTION. WITH IMPACT.
          </motion.p>
```

**La segunda línea es `font-semibold`; las otras dos no.**

CTA (`:83-91`):

```tsx
          <HoverButton
            href="/contact"
            underline={isPreloaderDone}
            underlineDraw={isPreloaderDone}
            underlineDrawDelay={CTA_UNDERLINE_DELAY}
            className="font-display text-[24px] uppercase tracking-wider"
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
```

Constantes de tiempo (`:7-15`), idénticas en forma a las de `ServicesIntro`:

```ts
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const TITLE_DELAY = 0.12;
const TITLE_STAGGER = 0.08;
const TITLE_LINE_DURATION = 0.42;
const TITLE_LINE_COUNT = 3;
const CTA_DURATION = 0.45;
const CTA_DELAY =
  TITLE_DELAY + TITLE_STAGGER * (TITLE_LINE_COUNT - 1) + TITLE_LINE_DURATION;
const CTA_UNDERLINE_DELAY = CTA_DELAY + CTA_DURATION;
```

**Diferencia técnica con `ServicesIntro`:** Hero **sí** usa orquestación por
`staggerChildren` (`:17-35`), que en `ServicesIntro` se descartó explícitamente
por el problema documentado en `ServicesIntro.tsx:91-97`.

`src/app/(site)/page.tsx` — completo (9 líneas):

```tsx
import Hero from "@/components/sections/home/Hero";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-320px)] min-h-[50vh] w-full items-center justify-center overflow-hidden">
      <Hero />
    </div>
  );
}
```

**El `320px` de `h-[calc(100vh-320px)]` (`:5`) no corresponde a
`--header-height` (128px) ni a `--footer-height` (480px)** según los valores que
documenta `CLAUDE.md:23`. Es una constante en línea. Pendiente de verificar
contra `globals.css`.

## C.3 — El preloader: constantes y anatomía

Ya cubierto en 1.e. Datos adicionales:

- El overlay es `fixed inset-0 z-[9998] bg-off-black` (`LoadingScreen.tsx:369`).
- Sale con `exit={{ y: "-100%" }}` en 1 s, ease `[0.76, 0, 0.24, 1]` (`:367-368`).
- Renderiza el logo como **sistema de partículas en canvas** leyendo el canal
  alfa de `logos/logo-header-blanco.png` (`:205-262`), con umbral
  `PARTICLE_ALPHA_THRESHOLD = 40` (`:19`) y paso 2 px en desktop / 5 px en móvil
  (`:20-21`).
- Barra de progreso: `w-48 md:w-64 h-[1px] bg-off-white/20` con relleno
  `scaleX: progress` (`:441-446`).
- Respeta `useReducedMotion()` de Framer (`:304`): con reduced motion salta a
  `progress = 1` sin animar (`:340-341`).

---

# BLOQUE 2.a — La medición bloqueante  `[COMPLETO]`

## Condiciones de la medición

| Ítem | Valor |
|---|---|
| Servidor | `npm run dev` (`next dev`, Next.js 16.2.6, Turbopack), `http://localhost:3000` |
| Navegador | Chrome, `devicePixelRatio = 1` |
| Método | `getComputedStyle(el)` sobre el nodo que porta la clase de tamaño |
| Anchos medidos | **1920 px** (viewport real de la ventana) y **700 px** (iframe same-origin de ancho controlado) |
| `document.documentElement.lang` medido | `"en"` |
| `font-size` de `:root` medido | `16px` |
| Familia tipográfica computada | `manropeFont, "manropeFont Fallback", sans-serif` |

**Por qué dos anchos.** La ventana de Chrome estaba maximizada y `resize_window`
no modificó el viewport (`window.innerWidth` siguió en 1920 después de pedir
1440 y 1024). La segunda medición se hizo con un `<iframe>` same-origin de
`width: 700px` cargando la misma ruta: las media queries se resuelven contra el
viewport del iframe, y el iframe reportó `innerWidth = 700` y
`matchMedia("(min-width: 768px)").matches === false`. Los iframes se eliminaron
después de medir (`document.querySelectorAll("iframe").length === 0`).

**Los valores se midieron sobre el dev server, no sobre un build de producción.**

## LOS TRES VALORES ABSOLUTOS

### A 1920 px de ancho de viewport

| Elemento | `font-size` | `line-height` | `letter-spacing` | `font-weight` |
|---|---|---|---|---|
| **(a) Tab del Navbar (`WORK`)** | **13px** | 19.5px | **0.65px** | 480 |
| **(b) Hero de Home (línea 1)** | **40px** | 42px | **normal** (= 0) | 400 |
| **(c) Párrafo de Team (`Founded by…`)** | **30px** | 37.5px | **normal** (= 0) | 400 |

### A 700 px de ancho de viewport

| Elemento | `font-size` | `line-height` | `letter-spacing` | `font-weight` |
|---|---|---|---|---|
| **(a) Tab del Navbar (`WORK`)** | **13px** | 19.5px | 0.65px | 480 |
| **(b) Hero de Home (línea 1)** | **40px** | 42px | normal | 400 |
| **(c) Párrafo de Team** | **24px** | 30px | normal | 400 |

## LOS DOS RATIOS

### A 1920 px

| Ratio | Cálculo | Valor medido |
|---|---|---|
| **hero ÷ menú** | 40 ÷ 13 | **3.077** |
| **Team ÷ menú** | 30 ÷ 13 | **2.308** |

### A 700 px

| Ratio | Cálculo | Valor medido |
|---|---|---|
| **hero ÷ menú** | 40 ÷ 13 | **3.077** |
| **Team ÷ menú** | 24 ÷ 13 | **1.846** |

## Contraste con las anotaciones de las clientas

> Se transcribe para que quede junto al número medido. **No se saca ninguna
> conclusión sobre qué quisieron decir.**

| Fuente | hero ÷ menú | Team ÷ menú |
|---|---|---|
| Anotaciones de las clientas (40/17 y 30/17) | 2.353 | 1.765 |
| Píxeles medidos sobre el mockup | 2.22 | 1.67 |
| **Medido en el código, 1920 px** | **3.077** | **2.308** |
| **Medido en el código, 700 px** | **3.077** | **1.846** |

**Tres hechos adicionales, sin interpretación:**

1. El hero mide **exactamente 40 px** y el párrafo de Team mide **exactamente
   30 px** a 1920 px de ancho — los dos números que las clientas anotaron como
   "40pt" y "30pt".
2. El tab del menú mide **13 px**, no 17.
3. **17 px sí es un tamaño usado en el sitio**, en otros lugares, medido o leído
   del código:
   - Footer, todos los bloques chicos: **17px** medido (`Footer.tsx:117`)
   - Footer, `BY develOP` variante chica: `text-[17px]` (`Footer.tsx:42`)
   - `aside` de Team (`01 THE TEAM`): **17px** medido (`TeamSection.tsx:88`)
   - Botón `DISCOVER OUR BRANDING SERVICES`: `text-[17px]` (`ServicesIntro.tsx:612`)
   - Encabezados y filas de `ServiceItem`: `text-[17px]` (`ServiceItem.tsx:245`, `:286`, `:358`, `:375`, `:379`, `:387`)
   - `h2` de `ServicesStack`: `text-[17px]` (`ServicesStack.tsx:98`, `:117`)
   - Botón de cerrar del menú móvil: `text-[17px]` (`Navbar.tsx:384`)

## ¿La escala es fija o responsive?

**Medido en dos anchos, con resultado distinto según el elemento:**

| Elemento | 1920 px | 700 px | ¿Responsive? | Origen |
|---|---|---|---|---|
| Tab del Navbar | 13px | 13px | **NO** | `text-[13px]` sin prefijo de breakpoint (`Navbar.tsx:307`) |
| `CONTACT US` | 13px | — | **NO** | `text-[13px]` sin prefijo (`Navbar.tsx:330`) |
| Hero de Home | 40px | 40px | **NO** | `text-[40px]` sin prefijo (`Hero.tsx:55`, `:61`, `:67`) |
| Párrafo de Team | 30px | 24px | **SÍ** | `text-[24px] … md:text-[30px]` (`TeamSection.tsx:102` y `:111`) |
| `StudioIntro` de Team | 40px | 32px | **SÍ** | `text-[32px] … md:text-[40px]` (`TeamSection.tsx:44`) |

**El único breakpoint tipográfico encontrado en estos elementos es `md` (768 px).**
No hay `clamp()` ni unidades `vw` en ninguno de los tamaños medidos: los
`clamp()` que sí existen en `TeamSection.tsx` (`:59`, `:146`) son de **altura y
espaciado**, no de `font-size`:

```tsx
TeamSection.tsx:59   h-[clamp(260px,42vh,520px)]
TeamSection.tsx:146  gap-[clamp(20px,3vh,34px)] pb-[clamp(24px,4vh,48px)] pt-[clamp(40px,7vh,78px)]
```

**Consecuencia medible del breakpoint `md`: el ratio Team ÷ menú NO es un solo
número.** Vale 2.308 en desktop y 1.846 en mobile, porque el menú es fijo y Team
no.

## Interletrado actual en menú y footer

Las clientas piden interletrado 0 en ambos. **Medido:**

| Elemento | `letter-spacing` computado | Clase de origen | Estado respecto de "0" |
|---|---|---|---|
| Tab del Navbar (`WORK`) | **0.65px** | `tracking-wider` (`Navbar.tsx:310`) | **No es 0** |
| `CONTACT US` | **0.65px** | `tracking-wider` (`Navbar.tsx:333`) | **No es 0** |
| Footer, bloques chicos | **normal** | `tracking-normal` (`Footer.tsx:117`) | **Ya es 0** |
| Footer, `INSTAGRAM` | **normal** | heredado de `Footer.tsx:117` | **Ya es 0** |
| Footer, `POWERED BY develOP` | **normal** | `tracking-normal` (`Footer.tsx:41`) | **Ya es 0** |

`0.65px` es exactamente `0.05em` a 13px, el valor de `tracking-wider` de Tailwind.
`letter-spacing: normal` es el valor inicial de CSS, equivalente a 0 de espaciado
adicional.

**Excepción por ruta, verificada en el código:** en `/fun-gallery` el menú usa
`tracking-[0.09em]` (`Navbar.tsx:310`, `:333`) y el footer `tracking-[0.035em]`
(`Footer.tsx:117`), `tracking-[0.02em]` en el CTA (`Footer.tsx:188`). **Esos
valores no fueron medidos en runtime.**

## Otros valores medidos en la misma corrida

Custom properties leídos con `getComputedStyle(document.documentElement).getPropertyValue(...)`:

| Propiedad | Valor medido | ¿Coincide con `CLAUDE.md:23`? |
|---|---|---|
| `--header-height` | `128px` | **SÍ** |
| `--footer-height` | `480px` | **SÍ** |
| `--color-off-white` | `#f3f3f3` | **SÍ** (`CLAUDE.md:19`) |
| `--color-off-black` | `#0f0f0f` | **SÍ** (`CLAUDE.md:20`) |

Elementos adicionales medidos a 1920 px, útiles para el Bloque 2.b:

| Elemento | `font-size` | `line-height` | `letter-spacing` | `font-weight` |
|---|---|---|---|---|
| Hero CTA (`LET'S WORK TOGETHER!`) | 24px | 36px | 1.2px | 400 |
| Footer `BORN IN` | 17px | 17px | normal | 550 |
| Footer `INSTAGRAM` | 17px | 17px | normal | 550 |
| Footer `POWERED BY develOP` | 40px | 40px | normal | 400 |
| Team `aside` (`01 THE TEAM`) | 17px | 17px | 0.425px | 400 |
| Team `StudioIntro` | 40px | 48px | normal | 400 |
| Hero línea 2 (`MAKE YOUR BRAND…`) | 40px | 42px | normal | **600** |

---

## HECHOS VERIFICADOS — Bloque 2.a

- **Tab del menú: 13 px** (`line-height` 19.5px, `letter-spacing` 0.65px, peso 480). Igual a 1920 y a 700 px.
- **Hero de Home: 40 px** (`line-height` 42px, `letter-spacing` normal). Igual a 1920 y a 700 px.
- **Párrafo de Team: 30 px a 1920 px, 24 px a 700 px** (`line-height` 37.5px / 30px).
- **Ratio hero ÷ menú = 3.077**, idéntico en los dos anchos.
- **Ratio Team ÷ menú = 2.308 a 1920 px y 1.846 a 700 px.** No es un número único.
- El único breakpoint tipográfico en juego es `md` (768 px). **No hay `clamp()` ni `vw` en ningún `font-size` de los elementos medidos.**
- El menú tiene `letter-spacing: 0.65px`; **el footer ya está en 0** (`normal`) en todas las rutas salvo `/fun-gallery`.
- `--header-height: 128px`, `--footer-height: 480px`, `--color-off-white: #f3f3f3`, `--color-off-black: #0f0f0f` — los cuatro coinciden con lo documentado en `CLAUDE.md`.
- `document.documentElement.lang === "en"` en runtime. `:root` font-size = 16px.
- 17 px es un tamaño real del sistema, usado en footer, aside de Team, botón DISCOVER, filas de ServiceItem y encabezados de ServicesStack — pero **no** en los tabs del menú.

## DESCONOCIDO — Bloque 2.a

1. **Qué significan las anotaciones "17pt / 30pt / 40pt" de las clientas.** El reporte entrega los números medidos. Determinar si describen el estado actual o piden un cambio requiere a las clientas o el archivo original del diseño, que la instrucción indica que no está disponible.
2. **Los valores computados de `letter-spacing` en `/fun-gallery`.** Esa ruta usa `tracking-[0.09em]` en el menú y `tracking-[0.035em]` / `tracking-[0.02em]` en el footer. No se midieron en runtime; solo se leyeron del código.
3. **Si los valores difieren en un build de producción.** La medición se hizo sobre `next dev`. Los tamaños salen de clases Tailwind estáticas, pero no se corroboró contra un build.
4. **A qué ancho exacto de mockup corresponden los ratios 2.22 y 1.67** que la instrucción cita como medidos sobre los píxeles del mockup. Sin ese dato, la comparación contra 3.077 / 2.308 (1920 px) y 3.077 / 1.846 (700 px) no está normalizada por ancho.

## RIESGOS PARA LO QUE VIENE — Bloque 2.a

- **El ratio Team ÷ menú cambia con el ancho** (2.308 ↔ 1.846) porque el menú es de tamaño fijo y Team es responsive. Cualquier especificación tipográfica expresada como un único ratio va a ser satisfacible en un solo breakpoint.
- **El hero es de tamaño fijo (40 px) en todos los anchos**, incluidos 700 px y menores. No tiene variante mobile, a diferencia de Team.
- **Los tamaños son valores arbitrarios por componente** (`text-[13px]`, `text-[40px]`, `md:text-[30px]`), no tokens de un `@theme`. Un pase tipográfico global toca cada componente, no un archivo central. El relevamiento completo del patrón es el Bloque 2.b, pendiente.
- **El footer ya cumple el pedido de interletrado 0** en todas las rutas menos `/fun-gallery`. El pedido de "interletrado 0 en menú y footer" solo tiene efecto real en el menú, y en el footer solo en `/fun-gallery`.
- **`ServicesIntro` y `Hero` usan `text-[40px]` igual que el hero de Home** (`ServicesIntro.tsx:256`, `:286`). Un cambio del "tamaño de hero" toca las tres pantallas si se hace por valor y no por componente.
- El peso del tab del menú es `480` (`font-[480]`), un valor no estándar de la escala de Tailwind, y `CONTACT US` usa `500`. **Los tabs y el CTA del header no tienen el mismo peso.**

---

## ADENDA — cierre de la conversión pt→px  *(sesión 3, 2026-08-14)*

> Tres mediciones que quedaban abiertas. Mismas condiciones que el resto del
> bloque: `next dev` en `http://localhost:3000`, Chrome con
> `devicePixelRatio = 1`, `getComputedStyle` sobre el elemento que porta el
> texto. La medición a 2560 px usó la misma técnica del iframe same-origin que
> la de 700 px: iframe de `width: 2560px` cargando `/team`; el iframe reportó
> `innerWidth = 2560` y `matchMedia("(min-width: 768px)").matches === true`
> mientras la ventana física seguía en 1920. El iframe se eliminó tras medir
> (`document.querySelectorAll("iframe").length === 0`).
> **Los números se reportan sin conclusión sobre qué significan las anotaciones
> de las clientas.**

### A.1 — Párrafo de Team a 2560 px de ancho de viewport

| Elemento | `font-size` | `line-height` |
|---|---|---|
| Párrafo 1 de Team (`Founded by…`) | **30px** | **37.5px** |
| Párrafo 2 de Team (`Over the years…`) | **30px** | **37.5px** |

**No supera los 30 px en pantallas más anchas que 1920.** Serie completa medida:
**24px @ 700 · 30px @ 1920 · 30px @ 2560.** Origen en el código:
`text-[24px] leading-[1.25] … md:text-[30px]` (`TeamSection.tsx:102` y `:111`);
el archivo completo (166 líneas, releído en esta sesión) no contiene ningún
prefijo `lg:`/`xl:`/`2xl:` de `font-size` — `md` (768 px) es el único breakpoint
tipográfico del componente.

### A.2 — `letter-spacing` computado en `/fun-gallery` (viewport 1920 px)

Cierra el punto que en la corrida anterior quedó leído solo del código.

| Elemento | `font-size` | `letter-spacing` computado | Clase de origen | Verificación aritmética |
|---|---|---|---|---|
| Tab del menú (`WORK`) | 13px | **1.17px** | `tracking-[0.09em]` (`Navbar.tsx:310`) | 0.09 × 13 = 1.17 |
| `CONTACT US` | 13px | **1.17px** | `tracking-[0.09em]` (`Navbar.tsx:333`) | 0.09 × 13 = 1.17 |
| Footer, bloques chicos (`BORN IN`, `INSTAGRAM`, `LINKEDIN`, `© 2024`) | 17px | **0.595px** | `tracking-[0.035em]` (`Footer.tsx:117`) | 0.035 × 17 = 0.595 |
| Footer, CTA `LET'S WORK TOGETHER!` | 40px | **0.8px** | `tracking-[0.02em]` (`Footer.tsx:188`) | 0.02 × 40 = 0.8 |
| Footer, crédito chico `BY develOP` | 17px | **normal** (= 0) | `tracking-normal` (`Footer.tsx:42`, sin variante por ruta) | — |

Pesos medidos en la misma pasada, incidentales: tabs del menú **100**
(`font-thin`, `Navbar.tsx:308`), `CONTACT US` **400** (`font-normal`,
`Navbar.tsx:331`), bloques chicos del footer **100** (`font-thin`,
`Footer.tsx:83`), CTA **100** (`font-thin`, `Footer.tsx:188`). En `/fun-gallery`
el footer es `fixed bottom-[26px] … z-[100] … mix-blend-difference`
(`Footer.tsx:103`): está presente y visible sobre la galería.

**Esto cierra el DESCONOCIDO nº 2 del Bloque 2.a.**

### A.3 — Los seis bloques del footer en `/` (viewport 1920 px)

| Bloque | `font-size` | `line-height` | `letter-spacing` | `font-weight` |
|---|---|---|---|---|
| `BORN IN` / `ARGENTINA` | **17px** | **17px** | **normal** (= 0) | 550 |
| `WORKING` / `WORLDWIDE` | **17px** | **17px** | **normal** (= 0) | 550 |
| `© 2024` | **17px** | **17px** | **normal** (= 0) | 550 |
| `POWERED BY develOP` | **40px** | **40px** | **normal** (= 0) | 400 |
| `INSTAGRAM` | **17px** | **17px** | **normal** (= 0) | 550 |
| `LINKEDIN` | **17px** | **17px** | **normal** (= 0) | 550 |

Los cuatro spans de `BORN IN`/`ARGENTINA`/`WORKING`/`WORLDWIDE` se midieron por
separado y dieron idéntico. Dos hechos de composición medidos en la misma
pasada: en `/` **no se renderiza** el CTA `LET'S WORK TOGETHER!` (0 apariciones
en el `<footer>`; lo reemplaza `POWERED BY develOP` — `Footer.tsx:76`,
`:172-181`) y **tampoco se renderiza** el crédito chico `BY develOP` (0
apariciones; `Footer.tsx:160` lo condiciona a `!shouldReplaceFooterCta`).

---

# BLOQUE 1 — CIERRE

> Completa las partes que quedaron `[PARCIAL]` arriba. Con esto el Bloque 1 pasa
> a **COMPLETO**.

## 1.c (cierre) — Censo completo de consumidores de `usePreloader()`

Grep sobre todo `src/`. **Nueve archivos**, contando el provider:

| # | Archivo | Línea de import | Línea de uso | Qué consume |
|---|---|---|---|---|
| — | `src/components/providers/PreloaderProvider.tsx` | — | `:21` | define el hook |
| 1 | `src/app/(site)/template.tsx` | `:4` | `:9` | `isPreloaderDone` |
| 2 | `src/components/sections/home/Hero.tsx` | `:4` | `:38` | `isPreloaderDone` |
| 3 | `src/components/sections/work/WorkGrid.tsx` | `:5` | `:28` | `isPreloaderDone` |
| 4 | `src/components/sections/contact/ContactForm.tsx` | `:8` | `:464` | `isPreloaderDone` |
| 5 | `src/components/sections/contact/ContactSuccess.tsx` | `:4` | `:10` | `isPreloaderDone` |
| 6 | `src/app/(site)/work/[slug]/ProjectDetailClient.tsx` | `:5` | `:20` | `isPreloaderDone` |
| 7 | `src/components/sections/services/ServicesIntro.tsx` | `:17` | `:303` | `isPreloaderDone` |
| 8 | **`src/components/ui/RevealOnScroll.tsx`** | `:5` | `:26` | `isPreloaderDone` |
| 9 | `src/components/ui/LoadingScreen.tsx` | `:5` | `:305` | **`markPreloaderDone`** |

**Solo `LoadingScreen` consume `markPreloaderDone`.** Los otros siete leen
`isPreloaderDone`.

**Hallazgo de mayor alcance: `RevealOnScroll` lee `usePreloader()`
(`RevealOnScroll.tsx:26`).** Es un primitivo compartido, así que **todo consumidor
de `RevealOnScroll` queda gateado por el preloader de forma transitiva**, sin
importar el hook. Consumidores de `RevealOnScroll` verificados hasta ahora:
`src/components/sections/services/ServiceItem.tsx:212` y
`src/components/sections/team/TeamSection.tsx:43`, `:82`, `:95`, `:120`. **El
censo completo de consumidores de `RevealOnScroll` es del Bloque 6, pendiente.**

## 1.d (cierre) — `lang`, persistencia y render estático

### ¿Se puede cambiar el `lang` del `<html>` desde React?

**Confirmado que `src/app/layout.tsx` es server component.** Grep de
`^"use client"` sobre todo `src/app/`: devuelve **exactamente 4 archivos**, y
`layout.tsx` no está entre ellos:

```
src/app/(site)/template.tsx
src/app/(site)/services/ServicesPageClient.tsx
src/app/(site)/work/[slug]/ProjectDetailClient.tsx
src/app/studio/[[...tool]]/page.tsx
```

**Consecuencia, afirmada sobre eso:** el atributo `lang="en"` de
`src/app/layout.tsx:57` lo emite un server component. Ningún componente cliente
del repo renderiza el elemento `<html>`, así que **ningún estado de React puede
cambiar ese atributo**. Modificarlo en runtime requiere escritura directa al DOM
(`document.documentElement.lang = …`).

**Clasificación server/client completa de `src/app/` (cerrada):**

| Archivo | Tipo |
|---|---|
| `src/app/layout.tsx` | **server** |
| `src/app/(site)/layout.tsx` | **server** |
| `src/app/(site)/page.tsx` | **server** |
| `src/app/(site)/contact/page.tsx` | **server** (`async`, `:14`) |
| `src/app/(site)/contact/success/page.tsx` | **server** |
| `src/app/(site)/fun-gallery/page.tsx` | **server** (`async`, `:39`) |
| `src/app/(site)/services/page.tsx` | **server** |
| `src/app/(site)/team/page.tsx` | **server** |
| `src/app/(site)/work/page.tsx` | **server** |
| `src/app/(site)/work/[slug]/page.tsx` | **server** |
| `src/app/(site)/template.tsx` | **client** |
| `src/app/(site)/services/ServicesPageClient.tsx` | **client** |
| `src/app/(site)/work/[slug]/ProjectDetailClient.tsx` | **client** |
| `src/app/studio/[[...tool]]/page.tsx` | **client** |

### ¿Existe ya algún componente cliente montado en el shell que pueda escribir al `documentElement`?

**SÍ. Dos que YA lo hacen hoy, más tres montados en el shell que no lo hacen.**

**Ya escriben al documento:**

1. **`src/components/providers/SmoothScrollProvider.tsx`** — client (`:1`),
   montado en `(site)/layout.tsx:13`. Escribe a `document.documentElement`:

```ts
SmoothScrollProvider.tsx:30      document.documentElement.style.scrollBehavior = "auto";
SmoothScrollProvider.tsx:36      document.documentElement.style.scrollBehavior = "";
```

   Su efecto ya depende de `pathname` (`:77`).

2. **`src/components/providers/RootClientShell.tsx`** — client (`:1`), montado
   en `src/app/layout.tsx:59`, **por encima de todo el sitio y de `/studio`**.
   Escribe a `document.body`:

```ts
RootClientShell.tsx:19      delete document.body.dataset.customCursor;
```

   Ya tiene `usePathname()` (`:14`) y un `useEffect` (`:17-22`).

**Montados en el shell y que no tocan el documento hoy:**
`PreloaderProvider` (`RootClientShell.tsx:29`), `CustomCursor`
(`RootClientShell.tsx:30`), `LoadingScreen` (`RootClientShell.tsx:31`).

**Cobertura relevante:** `RootClientShell` es el único de esa lista que está en
el layout **raíz**; los demás están dentro de `(site)/layout.tsx` y por lo tanto
no se montan en `/studio`.

### Persistencia existente

Grep de `localStorage|sessionStorage` sobre todo `src/`. Resultado completo:

| Archivo:línea | Fragmento | Tipo |
|---|---|---|
| `src/components/providers/PreloaderProvider.tsx:42` | `if (window.sessionStorage.getItem(SESSION_KEY) === "1") {` | lectura |
| `src/components/providers/PreloaderProvider.tsx:51` | `window.sessionStorage.setItem(SESSION_KEY, "1");` | escritura |
| `src/components/ui/LoadingScreen.tsx:316` | `if (window.sessionStorage.getItem("esquina:preloaderShown") === "1") return;` | lectura |

(Las líneas `LoadingScreen.tsx:9`, `PreloaderProvider.tsx:37` y `:41` son
comentarios, no código.)

**Hechos:**

- **`localStorage` NO se usa en ninguna parte de `src/`. Cero apariciones.**
- **`sessionStorage` se usa en 2 archivos, 3 sitios, para una sola cosa:** la
  bandera del preloader.
- **NO existe ningún wrapper ni hook reutilizable de persistencia.** Son llamadas
  directas a `window.sessionStorage`.
- La clave está declarada como constante en un archivo
  (`PreloaderProvider.tsx:12` — `const SESSION_KEY = "esquina:preloaderShown";`)
  y **duplicada como string literal** en el otro (`LoadingScreen.tsx:316`).
- `sessionStorage` es por pestaña y se pierde al cerrarla. **No hay ningún
  precedente de persistencia entre visitas en el repo.**

### Rastros de i18n ya empezada en `src/`

Grep case-insensitive de `i18n|i18next|next-intl|locale|translat|idioma|navigator\.language|documentElement\.lang` sobre todo `src/`.

**Resultado: NINGÚN rastro real de internacionalización.** Los aciertos son todos
falsos positivos o el metadata ya inventariado:

| Archivo:línea | Fragmento | Por qué no cuenta |
|---|---|---|
| `src/app/layout.tsx:37` | `locale: "en_US",` | **Es el único acierto real** — ya inventariado en 1.c |
| `src/components/ui/LoadingScreen.tsx:294` | `-translate-x-1/2 -translate-y-1/2` | clase CSS de Tailwind |
| `src/components/ui/CustomCursor.tsx:25`, `:72` | `translate3d(...)` | CSS transform |
| `src/components/layout/Navbar.tsx:293` | `-translate-x-1/2 -translate-y-1/2` | clase CSS |
| `src/components/sections/contact/ContactForm.tsx:195` | `translate-y-full` | clase CSS |
| `src/components/sections/services/ServicesIntro.tsx:251` | `"WE TRANSLATE IDEAS INTO LIVING IDENTITIES —"` | copy del sitio |
| `src/components/sections/team/TeamSection.tsx:18` | `"…observing and translating what we see…"` | copy del sitio |

**`navigator.language` no aparece en ninguna parte del repo.
`document.documentElement.lang` tampoco se escribe en ninguna parte.**

### Clasificación de render por ruta — `npm run build`

Ejecutado el 2026-08-14 sobre el commit `2565d01`. Salida literal de la tabla de
rutas:

```
Route (app)                Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/contact
├ ƒ /api/seed-sanity
├ ƒ /contact
├ ○ /contact/success
├ ƒ /fun-gallery
├ ○ /services
├ ƒ /studio/[[...tool]]
├ ○ /team
├ ○ /work                          1m      1y
└ ● /work/[slug]                   1m      1y
  ├ /work/tukumi-takeaway          1m      1y
  ├ /work/matsu                    1m      1y
  ├ /work/akasha-blends            1m      1y
  └ /work/matsutrabajo             1m      1y

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

**Tabla ordenada:**

| Ruta | Clasificación | Revalidate | Expire |
|---|---|---|---|
| `/` | **○ Static** | — | — |
| `/_not-found` | **○ Static** | — | — |
| `/contact/success` | **○ Static** | — | — |
| `/services` | **○ Static** | — | — |
| `/team` | **○ Static** | — | — |
| `/work` | **○ Static** | 1m | 1y |
| `/work/[slug]` | **● SSG** (4 slugs) | 1m | 1y |
| `/contact` | **ƒ Dynamic** | — | — |
| `/fun-gallery` | **ƒ Dynamic** | — | — |
| `/studio/[[...tool]]` | **ƒ Dynamic** | — | — |
| `/api/contact` | **ƒ Dynamic** (route handler) | — | — |
| `/api/seed-sanity` | **ƒ Dynamic** (route handler) | — | — |

**Conteo (solo rutas de página, excluyendo `/api/*`):**

- **Estáticas (`○`): 6** — `/`, `/_not-found`, `/contact/success`, `/services`, `/team`, `/work`
- **SSG (`●`): 1 patrón** (`/work/[slug]`), **4 páginas prerenderizadas**
- **Dinámicas (`ƒ`): 3** — `/contact`, `/fun-gallery`, `/studio/[[...tool]]`

**Total de páginas HTML prerenderizadas: 10** (6 estáticas + 4 de `/work/[slug]`).

### Por qué `/contact` es dinámica — causa verificada

**No tiene `export const dynamic`.** La causa es que la página **espera
`searchParams`.** `src/app/(site)/contact/page.tsx:10-16`:

```tsx
type ContactPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { service } = await searchParams;
  const serviceParam = typeof service === "string" ? service : null;
```

El parámetro `?service=` lo produce `ServiceItem.tsx:81-83`:

```ts
  const quoteHref = `/contact?service=${encodeURIComponent(
    service.name.toLowerCase(),
  )}`;
```

### HALLAZGO DERIVADO: la cantidad de proyectos publicados en Sanity ya no es DESCONOCIDA

El build prerenderizó **4 slugs**: `tukumi-takeaway`, `matsu`, `akasha-blends`,
`matsutrabajo`.

**Esos 4 slugs vienen del dataset real de Sanity, no de un fallback local.**
Prueba, leyendo `src/app/(site)/work/[slug]/page.tsx:14-32`:

```ts
export async function generateStaticParams() {
  try {
    if (!client) {
      return LOCAL_WORK_PROJECTS.map((p) => ({ slug: p.slug.current }));
    }

    const projects = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "project"]{ "slug": slug.current }`,
    );

    if (!projects || projects.length === 0) {
      return LOCAL_WORK_PROJECTS.map((p) => ({ slug: p.slug.current }));
    }

    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return LOCAL_WORK_PROJECTS.map((p) => ({ slug: p.slug.current }));
  }
}
```

**Los tres caminos de fallback devuelven los 8 slugs de `LOCAL_WORK_PROJECTS`**
(`akasha-blends`, `brook`, `brooks`, `matsu`, `matsu-identity`, `romar`,
`tukumi`, `akasha-packaging`). El build devolvió 4, y dos de ellos
(`tukumi-takeaway` y `matsutrabajo`) **no existen en `LOCAL_WORK_PROJECTS`**.
`matsutrabajo` tampoco existe en `MOCK_PROJECTS` ni en el seeder. Por lo tanto el
`client.fetch` se ejecutó con éxito contra la API.

**CONCLUSIÓN MEDIDA: el dataset `production` de Sanity contiene exactamente 4
documentos `project` publicados**, con slugs `tukumi-takeaway`, `matsu`,
`akasha-blends`, `matsutrabajo`.

**Precisiones sobre el alcance de ese número:**

- La query es `*[_type == "project"]{ "slug": slug.current }` — **sin filtro
  adicional y sin límite**, así que devuelve todos los documentos de ese tipo que
  el cliente puede ver.
- El cliente lee **sin token** y con `useCdn: true` (`src/lib/sanity.ts:11-13`),
  o sea que ve **solo documentos publicados**, no borradores.
- El número es del **2026-08-14**. El dataset puede cambiar.

**Esto cierra el DESCONOCIDO nº 1 del Bloque 7 y actualiza el NÚMERO CLAVE nº 4.**
Ver la corrección al final de esta sección.

### Observaciones incidentales del build

> **El Bloque 8 NO se corrió.** Lo que sigue apareció al ejecutar `npm run build`
> para la clasificación de 1.d, y se registra porque ya está medido.

**1. La salida de build de Next 16.2.6 no incluye tamaños de bundle por ruta.**
La tabla tiene columnas `Route (app)`, `Revalidate` y `Expire` — **no hay
columnas de `Size` ni de `First Load JS`**. Quien corra el Bloque 8 necesita otra
fuente para el peso de bundle por ruta.

**2. Warning de Turbopack sobre el NFT trace.** Literal:

```
Turbopack build encountered 1 warnings:
./next.config.ts
Encountered unexpected file in NFT list
A file was traced that indicates that the whole project was traced unintentionally.

Import trace:
  App Route:
    ./next.config.ts
    ./src/app/api/seed-sanity/route.ts
```

El origen es `src/app/api/seed-sanity/route.ts`, la ruta del seeder.

**3. Deprecación de `@sanity/image-url`,** emitida 5 veces durante la generación
de páginas. Literal:

```
The default export of @sanity/image-url has been deprecated. Use the named export `createImageUrlBuilder` instead.
```

Corresponde a `src/lib/sanity.ts:2` —
`import imageUrlBuilder from "@sanity/image-url";`.

**4. Tiempos del build:** compilación 25,8 s · TypeScript 15,8 s · generación de
15 páginas estáticas en 2,6 s con 15 workers. **El build terminó sin errores.**

## 1.f (cierre) — Censo completo de scroll programático

Grep de `scrollTo|scrollIntoView|scrollBy|scrollRestoration|scroll-behavior|scrollBehavior` sobre todo `src/`. Resultado completo:

| Archivo:línea | Fragmento | ¿Corre Lenis en esa ruta? |
|---|---|---|
| `src/app/(site)/services/ServicesPageClient.tsx:20` | `if ("scrollRestoration" in window.history) {` | **NO** (`/services`) |
| `src/app/(site)/services/ServicesPageClient.tsx:21` | `window.history.scrollRestoration = "manual";` | **NO** |
| `src/app/(site)/services/ServicesPageClient.tsx:24` | `window.scrollTo(0, 0);` | **NO** |
| `src/components/providers/SmoothScrollProvider.tsx:30` | `document.documentElement.style.scrollBehavior = "auto";` | es el propio provider |
| `src/components/providers/SmoothScrollProvider.tsx:36` | `document.documentElement.style.scrollBehavior = "";` | es el propio provider |
| `src/components/sections/contact/ContactForm.tsx:333` | `window.scrollBy({` | **NO** (`/contact`) |
| `src/components/sections/services/ServiceItem.tsx:162` | `window.scrollBy({ top: -heightToLose, behavior: "instant" });` | **NO** (`/services`) |
| `src/components/sections/services/ServicesIntro.tsx:441` | `window.scrollTo(0, window.innerHeight);` | **NO** (`/services`) |
| `src/components/sections/services/ServicesIntro.tsx:510` | `window.scrollTo(0, startY + distance * finalEase);` | **NO** (`/services`) |

**`scrollIntoView` no aparece en ninguna parte del repo.**

**Hecho relevante:** las **seis** llamadas de scroll programático están en
`/services` y `/contact`, **exactamente las rutas donde `shouldUseSmoothScroll`
devuelve `false`** (`SmoothScrollProvider.tsx:13-15`). Ningún componente hace
scroll programático en `/team` ni en `/work*`, que son las dos rutas donde Lenis
sí corre. **No hay conflicto entre scroll manual y Lenis en el código actual.**

---

## CORRECCIÓN A BLOQUES YA ESCRITOS

Derivada del build de 1.d:

- **NÚMEROS CLAVE nº 4** — pasa de PARCIAL a: **3 campos de texto traducibles de
  nivel raíz por proyecto (`title`, `category`, `services`) × 4 proyectos
  publicados = 12 campos raíz** que las clientas tendrían que volver a cargar
  para poner al día el contenido existente. **A eso se le suman los bloques
  Portable Text de `content` y los `mediaItem.caption` de cada proyecto, cuya
  cantidad total sigue siendo DESCONOCIDA** porque requiere consultar el
  contenido de cada documento.
- **NÚMEROS CLAVE nº 5** — resuelto: **6 rutas estáticas, 1 patrón SSG (4 páginas)
  y 3 rutas de página dinámicas.**
- **NÚMEROS CLAVE nº 6** — resuelto: `/fun-gallery` se clasifica **`ƒ (Dynamic)`,
  server-rendered on demand.**
- **Bloque 7, DESCONOCIDO nº 1** — resuelto: **4 proyectos publicados.**
- **Bloque 7** — queda registrado que el `client.fetch` a Sanity **funciona** en
  este entorno: el dataset es alcanzable sin token desde el build.

---

## HECHOS VERIFICADOS — Bloque 1

**Estructura**

- Un solo route group: `(site)`. `/studio` y `/api` quedan fuera del shell.
- **No existe ningún `loading.tsx`, `error.tsx`, `not-found.tsx`, `global-error.tsx` ni `default.tsx`** en todo `src/app/`.
- **Solo 4 archivos de `src/app/` son client components**: `template.tsx`, `ServicesPageClient.tsx`, `ProjectDetailClient.tsx` y `studio/[[...tool]]/page.tsx`. Todos los `page.tsx` de contenido y ambos `layout.tsx` son server components.

**Transiciones**

- **`RouteTransitionProvider` NO usa `AnimatePresence` ni `key={pathname}`.** La transición es una interpolación de opacidad gobernada por el booleano `isLeaving` (`PageTransitionShell.tsx:20` y `:30`).
- El disparador es un listener de click en fase de captura sobre `document` (`RouteTransitionProvider.tsx:196`), que hace `preventDefault()` y llama a `navigateWithTransition`; `router.push` se difiere `exitDuration * 1000` ms (`:144-146`).
- `PAGE_EXIT_DURATION = 0.65` s; con `prefers-reduced-motion` baja a `0.06` s.
- **`navigateWithTransition` descarta explícitamente el caso de misma ruta** (`:131-134`) y el contexto **no expone ningún setter** de `isLeaving` (`:204-217`).
- Durante una transición **se preservan** `RootClientShell`, `PreloaderProvider`, `CustomCursor`, `LoadingScreen`, `SmoothScrollProvider`, `RouteTransitionProvider`, `Navbar`, `PageTransitionShell` y `Footer`. **Se remontan** `(site)/template.tsx` y la página.
- `ServicesStack` se remonta a propósito con `key={pathname}` (`ServicesPageClient.tsx:30`).

**Preloader**

- Clave `sessionStorage`: `"esquina:preloaderShown"`, valor `"1"`.
- **Duración total: 2700 ms** (1000 de progreso + 700 de sostén + 1000 de salida).
- `markPreloaderDone()` se llama a los 2700 ms, en el mismo tick del desmontaje del overlay (`LoadingScreen.tsx:347-350`).
- **En recarga dura a mitad de sesión el preloader NO se muestra** (`LoadingScreen.tsx:316`) y la ventana de cortina es **0 ms**.
- En esa recarga, antes de que hidrate React, **se ve el fondo `bg-off-white` (`#f3f3f3`, medido) sin contenido**: `isPreloaderDone` se inicializa en `false` en el servidor (`PreloaderProvider.tsx:38`) y `template.tsx:15` renderiza el contenido a opacidad 0. Aparece con un fade de 0,5 s cuando corre el efecto de montaje.
- **9 archivos consumen `usePreloader()`.** Solo `LoadingScreen` usa `markPreloaderDone`.
- **`RevealOnScroll` lee `usePreloader()`**, así que todos sus consumidores quedan gateados transitivamente.

**`lang` y persistencia**

- `<html lang="en">` en `src/app/layout.tsx:57`, emitido por un server component. **Ningún componente cliente renderiza `<html>`**, así que ningún estado de React puede cambiarlo. Requiere escritura directa al DOM.
- **8 ítems hardcodeados a inglés en el layout raíz**, incluido `openGraph.locale: "en_US"` (`:37`).
- **Ya existen dos componentes cliente en el shell que escriben al documento**: `SmoothScrollProvider` (`:30`, `:36` — `document.documentElement.style`) y `RootClientShell` (`:19` — `document.body.dataset`). `RootClientShell` es el único de los dos que está en el layout **raíz**.
- **`localStorage` no se usa en ninguna parte de `src/`. Cero apariciones.**
- `sessionStorage` se usa en 2 archivos, 3 sitios, solo para el preloader. **No hay wrapper ni hook reutilizable.** La clave está duplicada como literal en `LoadingScreen.tsx:316`.
- **No hay ningún rastro de i18n ya empezada en `src/`.** `navigator.language` y la escritura de `documentElement.lang` no aparecen en el repo.

**Build**

- **6 rutas estáticas, 1 patrón SSG con 4 páginas, 3 rutas de página dinámicas** (más 2 route handlers dinámicos).
- `/fun-gallery` es **`ƒ (Dynamic)`**.
- `/contact` es dinámica **por esperar `searchParams`** (`contact/page.tsx:11`, `:14-15`), no por una directiva.
- **El dataset de Sanity tiene 4 proyectos publicados**: `tukumi-takeaway`, `matsu`, `akasha-blends`, `matsutrabajo`.
- El build termina **sin errores**, con 1 warning de Turbopack y 5 avisos de deprecación de `@sanity/image-url`.
- **La salida de build de Next 16.2.6 no reporta tamaños de bundle por ruta.**

**Navbar**

- El tab activo se calcula sobre `visualPathname = pendingPathname ?? pathname` (`Navbar.tsx:60`): el subrayado se mueve al hacer click, antes de que complete la navegación.
- El subrayado se calcula midiendo el DOM con `getBoundingClientRect()`, no con CSS. `NAV_INDICATOR_DURATION = 0.62`.
- **`/work` es el link de referencia del indicador** (`:103`); si no se renderiza, el indicador se anula.
- **Ningún tab tiene ancho fijo.** El contenedor de tabs es `absolute` y centrado; el bloque contiguo a `CONTACT US` es el `<div className="hidden md:block">` de `:322-339`.

**Lenis**

- **Lenis solo se instancia en `/team` y en `/work*`** (`SmoothScrollProvider.tsx:13-15`). En `/`, `/services`, `/fun-gallery`, `/contact` y `/contact/success` no hay smooth scroll.
- Se destruye y recrea en cada cambio de `pathname` (dep `[pathname]`, `:77`). Se expone en `window.lenis`.
- **Las 6 llamadas de scroll programático del repo están todas en rutas donde Lenis no corre.** No hay conflicto en el código actual.

## DESCONOCIDO — Bloque 1

1. **Qué se ve exactamente en pantalla en la recarga dura a mitad de sesión, medido con captura.** La cadena de código está verificada línea por línea y el color de fondo está medido (`#f3f3f3`), pero **no se tomó una captura de pantalla del estado pre-hidratación** para confirmarlo visualmente. Haría falta una captura con throttling de red o con JS deshabilitado.
2. **Cuánto tarda la hidratación en esa recarga**, o sea cuántos milisegundos dura el estado de pantalla vacía. No se midió. Haría falta instrumentar el tiempo entre el primer paint y la corrida del efecto de `PreloaderProvider`.
3. **Si `structuredClone` del estado de scroll o el `scrollRestoration: "manual"` de `ServicesPageClient.tsx:21` afecta a otras rutas.** El atributo se setea globalmente sobre `window.history` y **no se restaura al desmontar** (el `useLayoutEffect` de `:19-25` no devuelve función de limpieza). No se midió el efecto en otras rutas.
4. **Cuántos bloques Portable Text y `mediaItem.caption` tienen en total los 4 proyectos publicados.** Requiere una consulta GROQ al contenido de cada documento.
5. **El censo completo de consumidores de `RevealOnScroll`.** Se verificaron los de `ServiceItem` y `TeamSection`; el barrido exhaustivo es del Bloque 6.
6. **Contenido de `netlify.toml`.** Sin él no se puede afirmar si el deploy de Netlify altera la clasificación de rutas del build local.

## RIESGOS PARA LO QUE VIENE — Bloque 1

**Para el toggle de idioma**

- **La transición de página es un booleano, no una key de `AnimatePresence`.** El mecanismo de `PageTransitionShell` no depende de que cambie la ruta. Lo que hoy impide dispararla sin navegar es que `isLeaving` se deriva de `leavingPathname === pathname` y que el contexto no expone ningún setter (`RouteTransitionProvider.tsx:108`, `:204-217`).
- **El efecto de limpieza de `RouteTransitionProvider.tsx:151-168` corre en cada cambio de `pathname` y resetea el estado de transición.** Un cambio de idioma que no cambie la ruta no dispara ese efecto, así que nada devolvería `isLeaving` a `false` por sí solo.
- **`(site)/template.tsx` se remonta en cada navegación, pero NO en un cambio de estado.** Si el idioma cambia sin navegar, la página no se remonta: `ServicesIntro` conserva su máquina de estados y `FunGallery` conserva su layout. Si en cambio se fuerza un remonte, se reinician los dos.
- **El `lang` del `<html>` no es alcanzable desde React.** Es un server component el que lo emite. Sostener `lang` sincronizado con el idioma elegido requiere escritura directa al DOM desde un cliente montado en el shell.
- **Los 8 ítems de metadata en inglés del layout raíz son estáticos y se resuelven en el servidor.** Con render de servidor siempre en inglés, `<title>`, `description` y todo `openGraph` quedan en inglés también para los visitantes en español. Lo mismo aplica al `metadata` de cada `page.tsx`.
- **No hay ningún precedente de persistencia entre visitas en el repo.** Cero usos de `localStorage`. La decisión de que la elección explícita del usuario le gane a la detección en visitas posteriores no tiene infraestructura previa: el único patrón existente es `sessionStorage`, que muere al cerrar la pestaña.
- **La ventana de cortina del preloader es de 2700 ms en visita fresca y de 0 ms en recarga a mitad de sesión.** La detección de idioma "durante el preloader" solo tiene cortina en el primer caso. En el segundo, cualquier swap ocurre a la vista.
- **En recarga a mitad de sesión el contenido ya se sirve a opacidad 0 y aparece con un fade de 0,5 s** (`template.tsx:15-17`). Ese fade es el único momento en que el contenido no se ve, y no está gobernado por el idioma.
- **`RevealOnScroll` está acoplado al preloader.** Cualquier cambio en el ciclo de vida del preloader para hacerle lugar a la detección de idioma afecta a todos los consumidores de `RevealOnScroll`, no solo a los 8 que lo usan directamente.
- **En el Navbar no hay anchos fijos, pero el indicador de subrayado se mide en runtime y usa `/work` como línea base.** Un toggle agregado al bloque de `CONTACT US` no participa de esa medición salvo que se lo registre en `desktopLinkRefs`; el `<div className="flex-1" />` de `:320` y el centrado absoluto del grupo de tabs (`:293`) hacen que el ancho del bloque derecho no desplace los tabs centrales.

**Para el resto de los trabajos**

- **No existe `not-found.tsx` ni `error.tsx` en ninguna parte.** `/_not-found` sale del default de Next. Cualquier texto de esas pantallas está fuera del control del repo y por lo tanto fuera del alcance de un diccionario de traducción.
- **Lenis no corre en `/services` ni en `/fun-gallery`**, las dos rutas que se rediseñan. Cualquier suposición de que el smooth scroll está activo ahí es falsa.
- **`ServicesPageClient.tsx:21` setea `window.history.scrollRestoration = "manual"` sin restaurarlo al desmontar.** Es un efecto global que sobrevive a la navegación fuera de `/services`.
- **`/contact` es dinámica por `searchParams`**, no por elección. Es la ruta que las clientas quieren que entre entera en pantalla; cualquier trabajo ahí arranca desde una ruta que no se prerenderiza.
- **`/fun-gallery` es la única ruta con `<main className="fixed inset-0 ... overflow-hidden">`** anidado dentro del `<main>` del layout. El rediseño de la pantalla de entrada opera dentro de esa restricción.
- **El dataset tiene 4 proyectos publicados**, no los 8 de `LOCAL_WORK_PROJECTS`. Cualquier cálculo del pool derivado de Fun Gallery (Bloque 4.c) se hace sobre 4 proyectos, no sobre 8.

---

# BLOQUE 4 — Fun Gallery  `[COMPLETO]`

> Corrido en la sesión 3 (2026-08-14) sobre HEAD `2565d01`. Los cuatro archivos
> centrales se releyeron íntegros en esta sesión: `FunGallery.tsx` (537 líneas),
> `fun-gallery/page.tsx` (44), `local-projects.ts` (195) y `sanity.queries.ts`
> (61). **Todas las citas del ANEXO B coincidieron línea por línea**; este bloque
> las incorpora por referencia y agrega lo que faltaba: los greps repo-wide, la
> medición del pool contra el dataset real, la verificación binaria de alpha y
> la semántica de caché de la versión exacta de Next.

## 4.a — Qué se va a borrar, y qué lo sostiene

### La cadena de derivación, completa

`fun-gallery/page.tsx` está transcrito completo en el ANEXO B.1. La query, el
GROQ entero, verbatim de `src/lib/sanity.queries.ts:18-61`:

```groq
// Projects with every image source needed by Fun Gallery
export const FUN_GALLERY_PROJECTS_QUERY = `
  *[_type == "project"] | order(order asc) {
    _id, title, slug, projectNumber, category, services, year,
    coverImage {
      ...,
      asset->
    },
    coverColor,
    content[] {
      _type,
      _key,
      ...,
      _type == "mediaItem" => {
        caption,
        file {
          ...,
          asset->
        }
      },
      _type == "dualMedia" => {
        left {
          ...,
          asset->
        },
        right {
          ...,
          asset->
        }
      },
      image {
        ...,
        asset->
      },
      images[] {
        ...,
        asset->
      },
      gallery[] {
        ...,
        asset->
      }
    }
  }
`;
```

Los helpers de identidad y URL — `FunGallery.tsx:151-162`:

```ts
function getImageAssetKey(image: SanityImageLike | string | null | undefined) {
  if (typeof image === "string") return image;
  return image?.asset?._id ?? image?.asset?._ref ?? null;
}

function getImageUrl(image: SanityImageLike | string | null | undefined) {
  if (typeof image === "string") return image;
  if (!getImageAssetKey(image)) return null;

  const transformedUrl = urlFor(image).width(1200).quality(90).url();
  return transformedUrl || image?.asset?.url || null;
}
```

Los type guards — `FunGallery.tsx:164-177`:

```ts
function isMediaItem(block: ProjectContentBlock): block is ProjectMediaItem {
  return block?._type === "mediaItem";
}

function isDualMedia(block: ProjectContentBlock): block is ProjectDualMedia {
  return block?._type === "dualMedia";
}

function isSanityImageLike(value: unknown): value is SanityImageLike {
  if (!value || typeof value !== "object") return false;

  const maybeImage = value as SanityImageLike;
  return Boolean(maybeImage.asset);
}
```

`getGenericBlockImageCandidates` — `FunGallery.tsx:179-211` — busca en cada
bloque no tipado los campos `image`, `images[]` y `gallery[]` (los tres que el
schema no define; ver 7.10) y arma candidatos con `alt: project.title`:

```ts
  if (isSanityImageLike(blockRecord.image)) {
    candidates.push({
      image: blockRecord.image,
      alt: project.title,
      keySuffix: `${blockKey}-image`,
    });
  }

  for (const fieldName of ["images", "gallery"] as const) {
```

`getProjectImageCandidates` — `FunGallery.tsx:213-252`, completo:

```ts
function getProjectImageCandidates(project: Project): ProjectImageCandidate[] {
  const contentImages = (project.content ?? []).flatMap((block) => {
    if (isMediaItem(block)) {
      return [
        {
          image: block.file,
          alt: block.caption,
          keySuffix: block._key ?? "media",
        },
      ];
    }

    if (isDualMedia(block)) {
      const blockKey = block._key ?? "dual";
      return [
        {
          image: block.left,
          alt: project.title,
          keySuffix: `${blockKey}-left`,
        },
        {
          image: block.right,
          alt: project.title,
          keySuffix: `${blockKey}-right`,
        },
      ];
    }

    return getGenericBlockImageCandidates(block, project);
  });

  return [
    {
      image: project.coverImage,
      alt: project.title,
      keySuffix: "cover",
    },
    ...contentImages,
  ];
}
```

`getGalleryItems` — `FunGallery.tsx:254-278`, completo, con la deduplicación
por asset key **global a toda la pasada** (no por proyecto):

```ts
function getGalleryItems(projects: Project[]): GalleryItem[] {
  const seenAssetKeys = new Set<string>();

  return projects.flatMap((project) => {
    const href = project.slug?.current ? `/work/${project.slug.current}` : undefined;

    return getProjectImageCandidates(project).flatMap((candidate) => {
      const assetKey = getImageAssetKey(candidate.image);
      const imageUrl = getImageUrl(candidate.image);

      if (!assetKey || !imageUrl || seenAssetKeys.has(assetKey)) return [];

      seenAssetKeys.add(assetKey);

      return [
        {
          id: `${project._id}-${assetKey}-${candidate.keySuffix}`,
          title: candidate.alt || project.title,
          href,
          imageUrl,
        },
      ];
    });
  });
}
```

Orden de candidatos por proyecto: **portada primero, después el `content` en
orden** (`:244-251`). Con la dedup global, si una imagen interna repite el asset
de una portada ya vista, la interna se descarta.

### ¿Quién más los usa? Greps repo-wide, medidos en esta sesión

**`FUN_GALLERY_PROJECTS_QUERY` — 3 apariciones en `src/`, todas de la propia
galería:** definición (`sanity.queries.ts:18`), import
(`fun-gallery/page.tsx:5`) y uso (`fun-gallery/page.tsx:24`). Nadie más. **Se
borra limpio.**

**Las 15 funciones del módulo se borran limpio.** `clamp`, `lerp`, `hashString`,
`createRandom`, `randomBetween`, `shuffle`, `getImageAssetKey`, `getImageUrl`,
`isMediaItem`, `isDualMedia`, `isSanityImageLike`,
`getGenericBlockImageCandidates`, `getProjectImageCandidates`,
`getGalleryItems` y `buildMapLayout` están definidas **sin `export`** dentro de
`FunGallery.tsx` (líneas 105, 109, 113, 124, 133, 137, 151, 156, 164, 168, 172,
179, 213, 254, 280). El grep por los 13 nombres no triviales sobre todo `src/`
devuelve apariciones **solo dentro de `FunGallery.tsx`**. Cero consumidores
externos.

**`urlFor` NO se borra: es compartido.** Consumidores medidos:
`work/[slug]/page.tsx:3`, `:53` · `ProjectContentRenderer.tsx:5`, `:70`,
`:125-126` · `ProjectCard.tsx:7`, `:33` · `FunGallery.tsx:13`, `:160` ·
definición en `sanity.ts:20`.

**`local-projects.ts` NO se borra: está acoplado a Work.** Consumidores medidos:

| Export | Consumidores fuera de la galería |
|---|---|
| `LOCAL_WORK_PROJECTS` | `work/page.tsx:5`, `:19`, `:26`, `:31` · `work/[slug]/page.tsx:7`, `:17`, `:25`, `:30`, `:123` |
| `withLocalProjectImages` | `work/page.tsx:6`, `:29` · `work/[slug]/page.tsx:9`, `:93`, `:125` |
| `getLocalProjectBySlug` | `work/[slug]/page.tsx:8`, `:80`, `:90`, `:95` |
| `getLocalProjectImage` | **ninguno** — solo lo llama `withLocalProjectImages` (`local-projects.ts:185`) |

Al cambiar la fuente de la galería, lo único que desaparece de ese archivo es su
consumo desde `fun-gallery/page.tsx:7-9`; el resto queda sosteniendo Work.
`mock-data.ts` (`getMockProjectBySlug`) lo consume solo `work/[slug]/page.tsx:5`,
`:80`, `:90`, `:95`.

**Qué son `LOCAL_WORK_PROJECTS` y `withLocalProjectImages`** — detalle en ANEXO
B.9, verificado en esta sesión: 8 proyectos con contenido real (títulos, slugs,
categorías, un bloque de texto cada uno, `coverImage` hacia
`/public/projects/`), **fallback de producción** activo cuando `client === null`,
la query devuelve vacío, o tira error (`fun-gallery/page.tsx:20-36`).
`withLocalProjectImages` solo rellena `coverImage` faltante por matching de
slug/título (`local-projects.ts:181-194`); no toca `content`.

**Los tipos.** `Project` y los tipos de bloque viven en `src/types/project.ts`
(transcrito completo en 7.8). Importadores de `Project` — 10 archivos:
`mock-data.ts:1`, `local-projects.ts:1`, `InfoCard.tsx:3`, `ProjectCard.tsx:6`,
`WorkGrid.tsx:6`, `FunGallery.tsx:15`, `fun-gallery/page.tsx:10`,
`work/page.tsx:8`, `ProjectDetailClient.tsx:6`, `work/[slug]/page.tsx:11`.
**Los tipos de bloque (`ProjectContentBlock`, `ProjectMediaItem`,
`ProjectDualMedia`) y `SanityImageLike` los importa, fuera de su archivo de
definición, únicamente `FunGallery.tsx:16-19`** (grep sobre todo `src/`;
`ProjectContentRenderer.tsx` no los importa — solo importa `urlFor`).

## 4.b — Qué tiene que sobrevivir

**La forma exacta del objeto que consume el layout** — `GalleryItem`, `MapItem`,
`MapLayout` y `ProjectImageCandidate` están transcritos completos en ANEXO B.3
(`FunGallery.tsx:76-103`), verificados idénticos en esta sesión. **Campos
mínimos que la fuente nueva tiene que producir: `id` (string), `title` (string),
`imageUrl` (string) y `href` (string, opcional).** `MapItem` (posición, tamaño,
rotación, zIndex, parallax) lo deriva `buildMapLayout`; la fuente no lo produce.

**El cálculo del layout** — constantes y mecánica en ANEXO B.6, verificado. Lo
esencial: un solo LCG determinista sembrado con `hashString(randomSeed)`
(`:299`) alimenta secuencialmente el shuffle de celdas y, por ítem, ancho,
aspecto, dos jitters de posición, rotación (siempre 0 por `ROTATION_RANGE = 0`),
zIndex y `parallaxFactor`. Grilla: `columns = ceil(sqrt(count × 1.15))`,
`rows = ceil(count / columns)` (`:300-301`). **Si el seed deja de ser aleatorio
por request, el layout completo pasa a ser determinista y estable entre
requests** (mismo seed ⇒ misma secuencia ⇒ mismas posiciones). Con el pool
actual de 7 ítems, `density = clamp((7 − 6) / 18, 0, 1) = 0.056` (`:282`) — el
extremo "pocas imágenes" de todas las interpolaciones.

**El hover, con precisión** — ANEXO B.5, verificado: `whileHover={{ scale: 1.2,
zIndex: 999 }}`, duración 0,5 s, ease `[0.25, 0.1, 0.25, 1]`
(`FunGallery.tsx:69-71`, `:423-424`). `hover:z-50` no existe en la galería (está
en `ServicesIntro.tsx:195`). Las dos capas de parallax (mapa completo hasta
900/700 px; por ítem con factor 2–3 sobre una capa `-inset-[8%]`) están
detalladas en B.5.

**La navegación y el caso sin link** — ANEXO B.4, verificado: `href` se arma con
`/work/${project.slug.current}` (`:258`), se navega con
`navigateWithTransition(item.href)` (`:371`) — sin `<Link>` ni `<a>` — y **el
layout no asume que todo ítem es un link**: `cursor-pointer`, `role`,
`tabIndex`, `aria-label` y ambos handlers están condicionados a `item.href`
(`:412-429`, `:369-380`). **Medido en runtime en esta sesión: hoy las 7 tarjetas
del pool real renderizan `role="link"`** — el camino "sin referencia" existe en
el código pero **nunca se ejercitó con datos reales**.

## 4.c — Dimensionar el cambio  *(medido, doble fuente)*

**Método.** (1) Consulta GROQ directa a la API de Sanity
(`*[_type == "project"]`, proyectando refs de `coverImage.asset`,
`file.asset`, `left.asset`, `right.asset` y `defined(image/images/gallery)` por
bloque), dataset `production`, mismo `projectId` público del `.env.local`;
(2) réplica aritmética de la derivación de 4.a sobre esos datos; (3) conteo del
DOM en `/fun-gallery` sobre `next dev` con los datos reales. **Las tres fuentes
coinciden exactamente.**

**Derivación por proyecto (orden `order asc`, el que usa la query):**

| # | Proyecto (`order`) | Candidatos con asset | Únicos que aporta | Detalle |
|---|---|---|---|---|
| 1 | `AKASHA BLENDS` (1) | 4 — cover **A**, mediaItem **B**, dualMedia left **A**, dualMedia right **C** | **3** (1 portada + 2 internas) | `dualMedia.left` repite el asset de la portada → eliminado por dedup |
| 2 | `TUKUMI TAKEAWAY` (3) | 1 — cover **D** | **1** (portada) | `content` = 1 bloque de texto, sin media |
| 3 | `MATSU` (4) | 2 — cover **E**, mediaItem **F** | **2** (1 portada + 1 interna) | — |
| 4 | `Matsu` / slug `matsutrabajo` (5) | 2 — cover **G**, mediaItem **G** | **1** (portada) | el `mediaItem` repite el asset de la portada → eliminado por dedup |

Assets (los 7 `_ref` reales):

| Letra | Asset | Rol |
|---|---|---|
| A | `image-6fb6ebec…-3456x5184-jpg` | portada AKASHA BLENDS |
| B | `image-d89bbaaf…-3456x5184-png` | interna (mediaItem) AKASHA BLENDS |
| C | `image-fe0b91d8…-2161x2701-png` | interna (dualMedia.right) AKASHA BLENDS |
| D | `image-041f9bba…-2400x3000-jpg` | portada TUKUMI TAKEAWAY |
| E | `image-7b791ccd…-1024x1536-png` | portada MATSU |
| F | `image-9f89d0b0…-6000x4500-png` | interna (mediaItem) MATSU |
| G | `image-e5452969…-1024x576-jpg` | portada matsutrabajo |

### EL NÚMERO

**El pool derivado produce hoy 7 imágenes: 4 portadas + 3 internas.**
9 candidatos con asset, 2 eliminados por la deduplicación global. Eso es lo que
la galería deja de mostrar el día que cambie la fuente, contra **8 assets
nuevos** anunciados por la instrucción. 7 → 8: los números quedan reportados,
la comparación perceptual no se resuelve acá.

**Verificación contra el DOM vivo** (`/fun-gallery`, `next dev`, 2026-08-14):
**7 `GalleryCard` montadas, las 7 con `<img>` de `cdn.sanity.io`** (0 del
fallback local), las 7 con `role="link"`, y los nombres de archivo de las 7 URLs
coinciden hash por hash y **en el mismo orden** que la derivación replicada
(A, B, C, D, E, F, G).

**Ninguna proyección muerta matchea datos:** `defined(image)`,
`defined(images)`, `defined(gallery)` devolvieron `false` en los 12 bloques de
`content` del dataset. Las tres proyecciones de 7.10 están muertas en el schema
**y** en los datos.

**Cierre incidental — el contenido de `content` de los 4 proyectos publicados**
(cierra el DESCONOCIDO nº 4 del Bloque 1 y completa el NÚMERO CLAVE nº 4):

| Proyecto | Bloques PT | mediaItem | dualMedia | `caption` cargados |
|---|---|---|---|---|
| AKASHA BLENDS | 2 | 1 | 1 | 0 |
| TUKUMI TAKEAWAY | 1 | 0 | 0 | 0 |
| MATSU | 2 | 1 | 0 | 0 |
| matsutrabajo | 2 | 1 | 0 | 0 |
| **Total** | **7** | **3** | **1** | **0** |

**Costo de la carga bilingüe del contenido existente: 12 campos raíz + 7
bloques Portable Text + 0 captions = 19 piezas de texto.** Dato incidental: los
`order` publicados son 1, 3, 4, 5 — no hay `order` 2.

## 4.d — El pipeline de imágenes con transparencia

**`urlFor` y las URLs** — transcrito completo en 7.9: no fuerza `format`, no
aplica `bg`, no usa `fit()` ni `auto()`; la única transformación de la galería
es `width(1200).quality(90)` (`FunGallery.tsx:160`). El stub del camino fallback
no expone `format()`/`fit()` (7.9).

**`next.config.ts`** — completo en 0.8: `formats: ["image/avif", "image/webp"]`
(`next.config.ts:11`), `remotePatterns` solo `cdn.sanity.io`, sin `deviceSizes`,
`imageSizes` ni `qualities`. Ambos formatos soportan canal alpha (NÚMEROS CLAVE
nº 7).

**Cómo carga la galería** — ANEXO B.7, verificado: `fill`, `sizes="(max-width:
768px) 78vw, 26vw"`, `priority` en las primeras 6, sin `placeholder`,
`object-cover`, y **todas las tarjetas se montan en el primer render** (sin
virtualización).

### Inventario medido de transparencia (sesión 3)

Herramientas: `sharp 0.34.5` del propio `node_modules` sobre los archivos
locales (canales, `hasAlpha`, `isOpaque` de píxeles) y `metadata` de la API de
Sanity para los assets del CDN. Read-only.

**Los 7 assets del pool actual — ninguno tiene píxeles transparentes:**

| Asset | mime | Dimensiones | Peso origen (bytes) | `hasAlpha` (Sanity) | `isOpaque` (Sanity) |
|---|---|---|---|---|---|
| A `6fb6ebec…` | image/jpeg | 3456×5184 | 6.438.273 | false | **true** |
| B `d89bbaaf…` | image/png | 3456×5184 | 20.182.427 | true | **true** |
| C `fe0b91d8…` | image/png | 2161×2701 | 165.858 | true | **true** |
| D `041f9bba…` | image/jpeg | 2400×3000 | 4.995.455 | false | **true** |
| E `7b791ccd…` | image/png | 1024×1536 | 2.378.176 | true (ver nota) | **true** |
| F `9f89d0b0…` | image/png | 6000×4500 | 41.337.893 | true | **true** |
| G `e5452969…` | image/jpeg | 1024×576 | 281.723 | false | **true** |

**Peso total de los originales del pool en el CDN: 75.779.805 bytes (~75,8
MB)**, con un máximo de **41,3 MB** en un solo PNG de 6000×4500 (F, la interna
de MATSU). Son los originales: el sitio sirve derivados `w=1200 q=90` vía
`next/image` → avif/webp.

Nota sobre E: el original local byte-idéntico (`Asset_ Imágenes/Matsu.png`,
sha1 igual, mismo tamaño 2.378.176) da con sharp **3 canales, sin canal alpha**,
mientras el `metadata.hasAlpha` de Sanity dice `true` para el mismo archivo. Se
reportan ambos valores medidos; los dos coinciden en que es opaco.

**Los 6 PNG de `public/projects/` — ninguno tiene siquiera canal alpha** (sharp:
3 canales, `hasAlpha: false`, `isOpaque: true` los seis): `akasha-producto.png`
(1920×2880), `akasha.png` (1920×2400), `brook-logo-texto.png` (1920×2397),
`brooks-logo.png` (1920×3415), `matsu-compu.png` (1920×1440), `matsu.png`
(1024×1536). Los 4 JPG del directorio y `og-image.jpg` tampoco (JPEG no porta
alpha).

**Las únicas imágenes con alpha real y píxeles no opacos que el sitio sirve hoy
son los logos** (sharp: 4 canales, `isOpaque: false`):

| Archivo | Dimensiones | Cómo se sirve |
|---|---|---|
| `logos/logo-header-negro.png` / `logo-header-blanco.png` | 1172×384 | import estático + `next/image` (`LogoScript.tsx:3-5`, `:33-39`) |
| `logos/logo-footer.png` | 1087×724 | import estático + `next/image` (`LogoScript.tsx:3`, `:33-39`) |
| `logos/logodevelOP.png` | 1024×1024 | import estático + `next/image` (`Footer.tsx:7`, `:54-63`) |
| `public/logo-favicon.png` (= `logos/logo-favicon.png`, 1.969 bytes ambos) | 67×67 | favicon (`layout.tsx:25-33`) |
| `logos/logo-header-blanco.png` | 1172×384 | además, partículas en canvas leyendo el canal alfa (`LoadingScreen.tsx:207`) |

**Consecuencia medida, sin interpretación:** el camino "PNG con transparencia
real servido desde `cdn.sanity.io` a través del optimizador de `next/image`" —
exactamente el camino de los 8 assets nuevos — **no está ejercitado hoy por
ninguna imagen del sitio**. El precedente de alpha existe solo por la vía de
imports estáticos locales.

### Los ocho PNG de 2250×2250: ausencia verificada en todo el repo

En la sesión 3 se inspeccionaron los cuatro directorios ignorados por git que
quedaban sin mirar (cierra también el DESCONOCIDO nº 8 del Bloque 0):

- **`design-refs/` está vacío** (0 archivos).
- **`Asset_ Tipografía/`**: solo `Manrope-VariableFont_wght.ttf` (164.936 bytes).
- **`Asset_ Logo/`**: los 4 PNG de logos, byte-idénticos a los de `logos/`.
- **`Asset_ Imágenes/`**: 10 archivos. **Son los originales de los assets ya
  conocidos**, mapeados por sha1 contra los IDs de asset de Sanity (el hash del
  `_ref` de Sanity es el sha1 del archivo):

| Archivo | sha1 | Dimensiones | canales / opaco (sharp) | ¿Subido a Sanity? |
|---|---|---|---|---|
| `Akasha Producto 2.JPG` | `6fb6ebec…` | 3456×5184 | 3 / opaco | **SÍ** = A |
| `Akasha Producto.png` | `d89bbaaf…` | 3456×5184 | 4 / opaco | **SÍ** = B |
| `Akasha.png` | `fe0b91d8…` | 2161×2701 | 4 / opaco | **SÍ** = C |
| `Brook Logo texto.png` | `399f21e1…` | 4690×5856 | **4 / NO opaco** | NO |
| `Brooks Logo.png` | `74e12225…` | 3241×5765 | 4 / opaco | NO |
| `Matsu compu.png` | `9f89d0b0…` | 6000×4500 | 4 / opaco | **SÍ** = F |
| `Matsu.png` | `7b791ccd…` | 1024×1536 | 3 / opaco | **SÍ** = E |
| `Romar.jpg` | `51595fb2…` | 3240×4051 | 3 / opaco | NO |
| `Team.jpg` | `89c8cb05…` | 4160×3120 | 3 / opaco | NO |
| `Tukumi.JPG` | `041f9bba…` | 2400×3000 | 3 / opaco | **SÍ** = D |

6 de los 7 assets del pool tienen su original acá; **G (`e5452969…`, 1024×576,
la portada de `matsutrabajo`) no tiene original en el repo.**

**Ningún archivo del repo mide 2250×2250.** La única imagen con píxeles
realmente transparentes de todo el repo es `Asset_ Imágenes/Brook Logo
texto.png` (4690×5856, 24,6 MB) — y no está en el pool de la galería. **Los ocho
PNG de 2250×2250 con alpha que describe la instrucción no existen en el repo**:
ni en `public/`, ni en los cuatro directorios ignorados. Dónde están físicamente
es DESCONOCIDO (fuera del repo; no verificable desde esta corrida).

## 4.e — Terreno para el schema nuevo

Los cinco puntos están relevados con detalle en el Bloque 7; acá el mapa con las
citas:

- **Convenciones de schema** (7.5): un archivo por schema en
  `src/sanity/schemas/<nombre>.ts`, `export default defineType({...})`,
  `defineField` por campo raíz (los campos de objetos anidados son literales
  planos), `title` en inglés con ejemplo entre paréntesis. **Registro en
  exactamente dos puntos:** `src/sanity/sanity.config.ts:4` (import) y `:14`
  (`types: [project]`). Sin auto-discovery, sin barrel.
- **Desk / structure** (7.4): `structureTool()` **sin argumentos**
  (`sanity.config.ts:12`) — desk por defecto; un tipo nuevo registrado aparece
  solo en el Studio.
- **Referencias** (7.6): **no existe ningún campo `reference` ni ninguna
  desreferencia documento-a-documento en GROQ en todo el repo.** El `->` solo se
  usa para `asset->`. La referencia opcional a `project` del schema nuevo es el
  **primer** uso de referencias del proyecto; no hay patrón interno que copiar
  (ni schema, ni query, ni tipo TS).
- **Tipos TS** (7.8): escritos a mano en `src/types/`, sin typegen. Cada campo
  nuevo se escribe dos veces (schema + tipo) y ya hay divergencias precedentes
  (`alt` fantasma, opcionalidad).
- **Validaciones y previews de `project` como modelo** (7.7): solo
  `Rule.required()` en `title` y `slug`; `preview.select`
  `{title, subtitle: category, media: coverImage}` sin `prepare()`; `options`
  solo `hotspot: true` y `slug.source: title`; un `orderings` por `order asc`;
  sin `groups`/`fieldsets`/`initialValue`.
- **Prerequisito documental** (0.7, punto 1): `CLAUDE.md:78` prohíbe
  exactamente este schema ("Fun Gallery NO tiene schema propio… No crear
  schemas nuevos"). La instrucción v3 §2.b lo marca como documentación
  desactualizada a corregir antes de la corrida de Fun Gallery.
- **Vestigio reaprovechable** (7.3): `docs/sanity-studio-guide.md:20-25`
  documenta un documento "Fun Gallery Image" con forma imagen + alt + order que
  nunca existió en código.

## 4.f — Rendimiento de la ruta

**Confirmado en esta sesión, releyendo el archivo:** `export const dynamic =
"force-dynamic"` (`fun-gallery/page.tsx:17`) sigue combinado con
`const randomSeed = randomUUID()` por request (`:41`) y con un fetch que pide
`{ next: { revalidate: 60 } }` (`:26`).

**Clasificación de build medida** (Bloque 1, cierre): `/fun-gallery` = **`ƒ
(Dynamic) — server-rendered on demand`**, y en la tabla del build es una de las
rutas **sin valores en las columnas `Revalidate`/`Expire`** (contra `/work`, que
muestra `1m / 1y`).

**Semántica de la combinación según la documentación embarcada de la versión
exacta instalada** (Next 16.2.6,
`node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`):

- `:97-99` — `'force-dynamic'` fuerza render dinámico por request y equivale a
  poner **todos** los `fetch()` del segmento en
  `{ cache: 'no-store', next: { revalidate: 0 } }`, o sea al segment config
  `fetchCache = 'force-no-store'`.
- `:133` — `'force-no-store'`: *"This forces all fetch requests to be re-fetched
  every request even if they provide a 'force-cache' option."*

**Según la documentación de la versión instalada, el `revalidate: 60` del fetch
de `fun-gallery/page.tsx:26` queda anulado por la declaración de ruta: render
por request y fetch re-ejecutado por request, sin caché de datos.** El
comportamiento no se midió sobre un servidor de producción corriendo (no se
ejecutó `npm run start`); lo medido es la clasificación del build y lo citado es
la semántica documentada por el propio paquete.

---

## HECHOS VERIFICADOS — Bloque 4

- **La cadena de derivación entera es local a `FunGallery.tsx`**: 15 funciones sin `export`, cero consumidores externos (grep repo-wide). `FUN_GALLERY_PROJECTS_QUERY` la consume solo `fun-gallery/page.tsx`. **Todo eso se borra limpio.**
- **`urlFor`, `local-projects.ts` y `types/project.ts` NO se borran**: los sostienen Work grid, Work single y sus fallbacks. Los tipos de bloque, en cambio, solo los importa la galería.
- Campos mínimos para el layout: **`id`, `title`, `imageUrl`, `href?`**. El layout ya soporta ítems sin link en 5 lugares; hoy las 7 tarjetas reales son links.
- **El pool derivado produce 7 imágenes: 4 portadas + 3 internas** (9 candidatos, 2 dedup). Medido por API + réplica + DOM, con coincidencia exacta 1:1 en cantidad, hashes y orden.
- Contenido de los 4 proyectos publicados: **7 bloques Portable Text, 3 `mediaItem`, 1 `dualMedia`, 0 `caption` cargados.**
- **Ninguna imagen del pool actual tiene píxeles transparentes** (`isOpaque: true` los 7). Ninguna imagen de contenido del sitio ejercita hoy el camino "alpha real vía cdn.sanity.io + next/image"; el único precedente de alpha servido son los logos por import estático.
- Originales del pool en el CDN: **75,8 MB en total; 41,3 MB el mayor** (PNG 6000×4500).
- Los 6 PNG de `public/projects/` no tienen canal alpha (3 canales los seis).
- **Los ocho PNG de 2250×2250 no existen en el repo** — verificado también en los 4 directorios ignorados por git (`design-refs/` está vacío; `Asset_ Imágenes/` contiene los originales sha1-mapeados de los assets ya conocidos).
- `/fun-gallery` sigue con `force-dynamic` + `randomUUID()` por request + `revalidate: 60` en el fetch; build = `ƒ (Dynamic)` sin Revalidate/Expire; la doc de Next 16.2.6 declara que esa combinación re-fetchea todo por request.

## DESCONOCIDO — Bloque 4

1. ~~**Dónde están físicamente los ocho PNG de 2250×2250 con alpha.**~~ **CERRADO en sesión 4 por dato externo del usuario (2026-08-14):** los ocho PNG están en la máquina del usuario, **NO van a entrar al repositorio**, y se van a cargar a mano por el Sanity Studio. Procedencia: declaración directa del usuario, no verificable desde el repo — y no necesita verificación: define el plan de carga, no un hecho del código. Consecuencia operativa: **ninguna corrida futura debe buscar estos archivos en el repo**; la verificación de sus propiedades (2250×2250, alpha real, pesos) va a ser posible recién cuando estén subidos al dataset, vía API de Sanity (misma técnica del Bloque 4.c/4.d). La ausencia verificada en sesión 3 (ni en `public/` ni en los 4 directorios ignorados) queda como estado permanente esperado, no como falta.
2. **Qué significa exactamente `metadata.hasAlpha` de Sanity** en el caso del asset E (`7b791ccd…`): el archivo local sha1-idéntico no tiene canal alpha según sharp, pero Sanity reporta `hasAlpha: true`. Ambos coinciden en `isOpaque: true`, que es lo que decide visualmente. Resolverlo requiere documentación interna de Sanity sobre cómo computa ese flag.
3. **El comportamiento de caché medido en producción.** La semántica citada es la documentada por el paquete instalado; no se corrió `npm run start` para observar el runtime real de la ruta.
4. **El asset G (`e5452969…`, portada de `matsutrabajo`) no tiene original en el repo** — su procedencia es desconocida.

## RIESGOS PARA LO QUE VIENE — Bloque 4

- **El camino crítico de los assets nuevos (PNG con alpha real desde el CDN por `next/image`) no está ejercitado por ninguna imagen actual.** Cualquier problema de ese camino (aplanado, fondo, formato) se va a descubrir recién con el primer asset nuevo, no hay cobertura previa que lo delate.
- **Al cambiar la fuente, la galería deja de mostrar las 7 imágenes derivadas.** Si se quiere conservar alguna, hay que recargarla a mano en el schema nuevo — no hay migración automática posible entre fuentes.
- **El fallback local queda desalineado con la fuente nueva.** `LOCAL_WORK_PROJECTS` alimenta hoy la galería cuando Sanity falla (`fun-gallery/page.tsx:20-36`); con schema propio, ese camino de error queda apuntando a una estructura de datos que la galería nueva ya no lee. Qué muestra la galería cuando Sanity falle es una decisión abierta del rediseño.
- **La referencia opcional introduce el primer ítem no clickeable con datos reales.** El código ya lo soporta (`role`/`tabIndex`/`aria-label`/handlers condicionados), pero ese camino nunca corrió en producción.
- **`object-cover` recorta** (`FunGallery.tsx:404`): con recortes de producto de ancho variable (31–84% según la instrucción), el encuadre actual no preserva la proporción del contenido. Está registrado como hecho del código actual, no como propuesta.
- **Dos de los 7 originales actuales pesan 20–41 MB en el CDN.** Los assets nuevos anunciados (~12 MB totales) entran a un pipeline sin `qualities` ni `deviceSizes` configurados y a una ruta que, según la doc de la versión, no cachea nada.
- **`ROTATION_RANGE = 0`**: el sistema de rotación existe y está apagado por constante. Cualquier spec de la pantalla nueva que pida rotación tiene el mecanismo ya construido; cualquier spec que asuma "sin rotación de fábrica" debe saber que es una constante, no una ausencia.
- **El primer uso de referencias del proyecto** (7.6) y **la regla activa de `CLAUDE.md:78` que prohíbe el schema** (0.7) siguen siendo los dos prerequisitos no-código de esta corrida.

---

## CORRECCIÓN A BLOQUES YA ESCRITOS (sesión 3)

- **Bloque 2.a, DESCONOCIDO nº 2** — resuelto por la ADENDA: `letter-spacing` computado en `/fun-gallery` medido (menú 1.17px, footer chico 0.595px, CTA 0.8px, crédito `normal`).
- **Bloque 1, DESCONOCIDO nº 4** — resuelto (Bloque 4.c): los 4 proyectos publicados tienen **7 bloques Portable Text y 0 `mediaItem.caption`** cargados.
- **Bloque 0, DESCONOCIDO nº 8** — resuelto (Bloque 4.d): los cuatro directorios ignorados no contienen documentación de método — solo assets (`Asset_ Imágenes` 10 originales, `Asset_ Logo` 4 logos, `Asset_ Tipografía` 1 fuente) y `design-refs/` vacío.
- **ANEXO B.10** — resuelto por la negativa: los ocho PNG de 2250×2250 **no están en el repo**; las propiedades que la instrucción les atribuye siguen sin poder verificarse (los archivos no son alcanzables desde esta corrida).
- **NÚMEROS CLAVE nº 3** — resuelto: **7 imágenes (4 portadas + 3 internas)**.
- **NÚMEROS CLAVE nº 4** — completo: **12 campos raíz + 7 bloques PT + 0 captions = 19 piezas de texto** a recargar para poner el contenido existente en dos idiomas.

---

# BLOQUE 6 — Primitivos compartidos y zonas de colisión  `[COMPLETO — sesión 4]`

> Todo leído de disco de primera mano en esta sesión: `HoverButton.tsx` (139
> líneas, íntegro), `RevealOnScroll.tsx` (47 líneas, íntegro), `globals.css`
> (76 líneas, íntegro), `CustomCursor.tsx` (78 líneas, íntegro), `Navbar.tsx`,
> `Footer.tsx`, `Hero.tsx`, `ServiceItem.tsx`, `ServicesStack.tsx`,
> `TeamSection.tsx`, `ContactForm.tsx`, `WorkGrid.tsx`, `InfoCard.tsx`
> íntegros, más greps repo-wide sobre `src/`.

## 6.1 — `HoverButton.tsx`: anatomía y la pregunta que gobierna el sprint tipográfico

### LA RESPUESTA PRIMERO

**`HoverButton` NO define ningún `font-size` internamente.** El archivo completo
(139 líneas) no contiene ninguna clase `text-[...]` ni ninguna propiedad
tipográfica. El tamaño de fuente entra exclusivamente por dos caminos del lado
del consumidor:

1. **La prop `className`**, que aterriza entera en el `motion.span` exterior:
   `HoverButton.tsx:67` —
   `` className={`group relative inline-block overflow-hidden ${className}`} ``
2. **Herencia CSS del ancestro**, cuando el consumidor no pasa tamaño en
   `className` (caso real: `INSTAGRAM` y `LINKEDIN` del footer, ver tabla).

Las únicas clases propias del componente son estructurales: el wrapper
(`group relative inline-block overflow-hidden`, `:67`), el fill de hover
(`absolute top-0 ... h-full`, `:72`), el padding del texto (`p-[6px]` /
`px-[1px] pb-0 pt-[1px]` / `py-[2px] px-[1px]`, `:55-59`) y los subrayados de
1px (`:89`, `:96`). Ninguna toca `font-size`, `line-height` ni
`letter-spacing`.

**Consecuencia directa para el cambio 13px → 17px del menú:** cambiar el tamaño
de los tabs toca `Navbar.tsx:307` (tabs) y `Navbar.tsx:330` (`CONTACT US`) — los
dos únicos lugares donde vive el `text-[13px]` — y **no se filtra a ningún otro
consumidor**, porque cada consumidor porta su propio tamaño en su propio
`className` (o lo hereda de su propio contenedor). No hay ningún tamaño
compartido dentro del primitivo.

### CORRECCIÓN A LA INSTRUCCIÓN (y a `CLAUDE.md` §7)

La instrucción del Bloque 6 dice "Es compartido entre Navbar, Footer, Home,
Services, Contact **y Fun Gallery**", y `CLAUDE.md` §7 dice "**`HoverButton` es
compartido con Fun Gallery**: tocarlo puede regresionar la galería".
**`FunGallery.tsx` no importa `HoverButton`.** Grep repo-wide de esta sesión:
los únicos archivos que lo importan son `Footer.tsx:6`, `Navbar.tsx:8`,
`Hero.tsx:5`, `ContactForm.tsx:10`, `ServiceItem.tsx:19` y
`ServicesIntro.tsx:18`. La relación real con Fun Gallery es **indirecta**: en
`/fun-gallery` se renderizan el Navbar y el Footer del shell, y esos consumidores
le pasan a `HoverButton` props condicionadas por ruta (`blend={useGalleryBlend}`,
pesos y trackings distintos — ver tabla). Tocar `HoverButton` puede regresionar
la galería **vía el header/footer que flotan sobre ella**, no vía un consumo
propio de la galería.

### Censo completo de call sites — 11 en 6 archivos

Colores/condiciones que aparecen en la tabla, definidos en cada consumidor:
`navTone = isFunGallery || isDarkRoute ? "dark" : "light"` (`Navbar.tsx:81`),
`useGalleryBlend = isFunGallery && !menuOpen` (`Navbar.tsx:80`; en Footer es
`isFunGallery` a secas, `Footer.tsx:79`), `linkTextClass`/`textClass` =
`text-off-white` u `text-off-black` por ruta (`Navbar.tsx:82-84`,
`Footer.tsx:81-82`).

| # | Consumidor | Call site | Texto | Props exactas |
|---|---|---|---|---|
| 1 | Navbar — tabs desktop (×4: `WORK`, `SERVICES`, `TEAM`, `FUN GALLERY`) | `Navbar.tsx:301-314` | `{link.label}` | `href={link.href}` · `underline={false}` · `tone={navTone}` · `blend={useGalleryBlend}` · `balancedPadding` · `` className={`text-[13px] uppercase font-body ${isFunGallery ? "font-thin" : "font-[480]"} ${isFunGallery ? "tracking-[0.09em]" : "tracking-wider"} ${linkTextClass}`} `` |
| 2 | Navbar — `CONTACT US` desktop | `Navbar.tsx:324-337` | `CONTACT US` | `href="/contact"` · `underline={false}` · `tone={navTone}` · `blend={useGalleryBlend}` · `balancedPadding` · `` className={`text-[13px] uppercase font-body ${isFunGallery ? "font-normal" : "font-medium"} ${isFunGallery ? "tracking-[0.09em]" : "tracking-wider"} ${linkTextClass}`} `` |
| 3 | Navbar — menú móvil (×5 vía `MOBILE_LINKS`) | `Navbar.tsx:393-401` | `{link.label}` | `href={link.href}` · `tone="dark"` · `className="font-display text-[48px] uppercase leading-none"` · `onClick={() => setMenuOpen(false)}` — **sin prop `underline`** → usa el default `underline = true` con subrayado estático (`HoverButton.tsx:31`, `:87-92`) |
| 4 | Footer — `DevelopCredit` (chico `BY develOP` y grande `POWERED BY develOP`, mismo call site parametrizado) | `Footer.tsx:32-65` | `BY develOP` / `POWERED BY develOP` + logo | `href={DEVELOP_URL}` · `external` · `underline` · `tightUnderline` · `tone={tone}` · `blend={blend}` · `` className={`normal-case ${textClassName} ${isLarge ? "font-display text-[40px] leading-none tracking-normal" : "font-body text-[17px] leading-none tracking-normal"}`} `` |
| 5 | Footer — `INSTAGRAM` | `Footer.tsx:133-142` | `INSTAGRAM` | `href="https://www.instagram.com/esquina_estudio/"` · `external` · `underline` · `tightUnderline` · `tone={footerTone}` · `blend={useGalleryBlend}` — **SIN `className`: hereda los 17px del grid contenedor** (`Footer.tsx:117`) |
| 6 | Footer — `LINKEDIN` | `Footer.tsx:146-155` | `LINKEDIN` | `href="https://www.linkedin.com/company/esquina-estudio/"` · `external` · `underline` · `tightUnderline` · `tone={footerTone}` · `blend={useGalleryBlend}` — **SIN `className`: hereda de `Footer.tsx:117`** |
| 7 | Footer — CTA | `Footer.tsx:182-191` | `LET&apos;S WORK TOGETHER!` | `href="/contact"` · `underline` · `tightUnderline` · `tone={footerTone}` · `blend={useGalleryBlend}` · `` className={`font-display ${footerCtaWeight} whitespace-nowrap text-[40px] uppercase leading-none ${isFunGallery ? "tracking-[0.02em] font-thin" : "tracking-normal"} ${textClass}`} `` |
| 8 | Home — CTA del Hero | `Hero.tsx:83-91` | `LET&apos;S WORK TOGETHER!` | `href="/contact"` · `underline={isPreloaderDone}` · `underlineDraw={isPreloaderDone}` · `underlineDrawDelay={CTA_UNDERLINE_DELAY}` · `className="font-display text-[24px] uppercase tracking-wider"` |
| 9 | Services — botón DISCOVER | `ServicesIntro.tsx:610-619` | `DISCOVER OUR BRANDING SERVICES` | `as="button"` · `className="font-body text-[17px] uppercase"` · `underline={isPreloaderDone}` · `underlineDraw={isPreloaderDone}` · `underlineDrawDelay={CTA_UNDERLINE_DELAY}` · `onClick={handleDiscover}` |
| 10 | Services — quote por fila | `ServiceItem.tsx:282-289` | `REQUEST FORMAL QUOTE` | `href={quoteHref}` · `as="a"` · `tone={isDark ? "dark" : "light"}` · `className="font-body text-[17px] uppercase tracking-wider"` — nota: con `href` presente, `as="a"` es **inerte**: la rama de `href` (`HoverButton.tsx:121-127`) renderiza `<Link>` antes de que `as` se consulte |
| 11 | Contact — SEND | `ContactForm.tsx:806-811` | `SEND QUESTIONNAIRE` / `SENDING...` | `as="span"` · `className="font-body text-[21px] uppercase md:text-[24px]"` — anidado dentro de un `<button type="submit">` real (`ContactForm.tsx:800-812`); `as="span"` evita `<button>` dentro de `<button>` |

**Tamaños que cada consumidor le inyecta a `HoverButton`, consolidado:** 13px
(Navbar desktop ×5), 48px (Navbar móvil ×5), 17px (Footer crédito chico,
DISCOVER, REQUEST FORMAL QUOTE, y por herencia INSTAGRAM/LINKEDIN), 40px
(Footer crédito grande y CTA del footer), 24px (CTA del Hero), 21px→24px en
`md` (SEND de Contact). **No hay dos consumidores que compartan la misma
declaración**: cada uno escribe la suya.

**Única vía de contagio real entre consumidores:** `INSTAGRAM` y `LINKEDIN` no
portan tamaño propio — heredan del grid de `Footer.tsx:117` (`text-[17px]`).
Cambiar ese contenedor cambia esos dos botones. Es contagio **dentro del
Footer**, no entre secciones.

## 6.2 — `RevealOnScroll.tsx`: consumidores

El primitivo (`src/components/ui/RevealOnScroll.tsx`, 47 líneas): `useInView`
de Framer con `{ once: true, margin: "-80px" }` (`:28`), gate por
`isPreloaderDone` (`:26`, `:35`), anima `opacity` + `x` + `y` desde
`initialX`/`initialY` (defaults `0`/`24`), `duration` default 0.6, ease
`[0.25, 0.1, 0.25, 1]`.

**Dos consumidores en todo el repo** (grep repo-wide):

| Consumidor | Call sites | Props |
|---|---|---|
| `TeamSection.tsx` | `:43` (StudioIntro: `delay={0.5}`) · `:82-87` (aside: `delay={TEAM_ASIDE_DELAY}`, `duration={TEAM_REVEAL_DURATION}`, `initialY={20}`, `className="md:sticky md:top-24 md:self-start"`) · `:95-99` (texto: `delay={TEAM_TEXT_DELAY}`, `duration=0.8`, `initialX={40}`, `initialY={0}`) · `:120-124` (imagen: `delay={TEAM_IMAGE_DELAY}`, `duration=0.8`, `initialX={40}`, `initialY={0}`) | constantes en `TeamSection.tsx:32-39`: `TEAM_ASIDE_DELAY = 0.1`, `TEAM_TEXT_DELAY = TEAM_IMAGE_DELAY = 0.5` |
| `ServiceItem.tsx` | `:212` (`delay={index * 0.05}`, envuelve el `<article>` entero de cada servicio) | — |

## 6.3 — ¿Cuántos sistemas de reveal conviven hoy?

La documentación de junio registraba tres (inline en `WorkGrid`,
`RevealOnScroll`, GSAP en Services). **Verificado en esta sesión: NO se
consolidaron, y el mapa real cambió de forma.**

**Sistemas de reveal por scroll (aparecer al entrar al viewport): 2.**

1. **Inline en `WorkGrid`** (`WorkGrid.tsx:13-30`): `useInView` propio
   (`{ once: true, margin: "-80px" }`, `:27`) + variants con
   `staggerChildren: 0.7` (`:17`) e ítems `{ opacity: 0, y: 40 }` →
   `{ opacity: 1, y: 0 }` en 0.7s (`:20-23`), gate por `isPreloaderDone` y
   `useReducedMotion`. Los offsets horizontales `DIRECTIONS x: ±60` que
   documentaba `CLAUDE.md` §8.3 **ya no existen**: el reveal actual es solo
   hacia arriba.
2. **`RevealOnScroll`** — los dos consumidores de 6.2.

**GSAP `ScrollTrigger` ya NO es un sistema de reveal.** Sus dos usos actuales
(únicos en el repo) son maquinaria de estado de scroll, sin animación de
aparición: `ServiceItem.tsx:148-170` colapsa el contenido de un servicio cuando
el scroll lo pasó (`onLeave` → `setHasBeenPassed` + `scrollBy` compensatorio) y
`ServicesStack.tsx:64-74` marca `hasReachedEnd` cuando el último ítem toca el
header. El reveal visual de cada `ServiceItem` lo hace `RevealOnScroll`
(`ServiceItem.tsx:212`).

**Además conviven los reveals de entrada gateados por preloader (no por
scroll), cada uno artesanal:** el Hero con `staggerChildren` (`Hero.tsx:17-35`),
`ServicesIntro` con `RevealLine` por índice (`ServicesIntro.tsx:116-129`, que
descartó `staggerChildren` explícitamente — `:91-97`), y Contact con variants de
`clipPath` + `blur` (`ContactForm.tsx:52-118`). Sumándolos, siguen conviviendo
**cinco implementaciones de "aparecer"** (2 por scroll + 3 de entrada), ninguna
compartida entre secciones salvo `RevealOnScroll`.

## 6.4 — `globals.css`: transcripción completa y análisis de capas

El archivo entero son **76 líneas**. Reglas, en orden:

```css
@import "tailwindcss";                             /* :1 */

:root {                                            /* :3-12 — UNLAYERED */
  --color-off-white: #F3F3F3;
  --color-off-black: #0F0F0F;
  --color-beige: #EFEEDA;
  --color-gray: #939393;
  --cursor-size: 12px;
  --cursor-size-hover: 48px;
  --header-height: 128px;
  --footer-height: 480px;
}

@theme inline {                                    /* :14-43 */
  --color-off-white: #F3F3F3;
  --color-off-black: #0F0F0F;
  --color-beige: #EFEEDA;
  --color-gray-brand: #939393;

  --font-display: var(--font-manrope), sans-serif;
  --font-body: var(--font-manrope), sans-serif;

  --font-size-display: 40px;
  --font-size-display--line-height: 1.05;
  --font-size-display--letter-spacing: -0.02em;

  --font-size-body: 17px;
  --font-size-body--line-height: 1.5;

  --font-size-footer-cta: 40px;
  --font-size-footer-cta--line-height: 1;
  --font-size-footer-cta--letter-spacing: -0.02em;

  --font-size-project-text: 30px;
  --font-size-project-text--line-height: 1.3;

  --font-size-nav: 13px;
  --font-size-nav--line-height: 1;
  --font-size-nav--letter-spacing: 0.05em;
}

body[data-custom-cursor="true"],                   /* :45-48 — UNLAYERED */
body[data-custom-cursor="true"] * {
  cursor: none !important;
}

html {                                             /* :50-53 — UNLAYERED */
  background-color: var(--color-off-white);
  color: var(--color-off-black);
}

body {                                             /* :55-57 — UNLAYERED */
  font-family: var(--font-body);
}

html, body, * {                                    /* :60-63 — UNLAYERED */
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

::-webkit-scrollbar {                              /* :65-70 — UNLAYERED */
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

::selection {                                      /* :72-75 — UNLAYERED */
  background-color: var(--color-off-black);
  color: var(--color-off-white);
}
```

**Qué gana por especificidad de capa.** Todas las reglas del archivo salvo el
`@theme` están **fuera de `@layer`**, y en el cascade de CSS una regla sin capa
le gana a cualquier regla dentro de una capa, independientemente de la
especificidad — y todas las utilities de Tailwind v4 viven en
`@layer utilities`. La única forma de sobreescribir estas reglas desde un
componente es `!important` del lado layered. **Ese mecanismo ya está usado y
documentado dentro del propio código:** `ContactForm.tsx:29-44` explica
exactamente esto en un comentario y lo aplica en `SCOPED_SELECTION`
(`ContactForm.tsx:43-44`):

```ts
const SCOPED_SELECTION =
  "[[data-contact]_&]:selection:bg-off-white! [[data-contact]_&]:selection:text-off-black!";
```

— selección invertida scopeada bajo `[data-contact]` con el sufijo `!`
(`!important`), sin tocar `globals.css`. Es el precedente a copiar para
cualquier otra sobreescritura puntual.

**HALLAZGO — el sistema de tokens tipográficos existe y está huérfano.** El
`@theme` declara cinco tamaños con nombre (`display` 40px, `body` 17px,
`footer-cta` 40px, `project-text` 30px, `nav` 13px) que generan las utilities
`text-display`, `text-body`, `text-footer-cta`, `text-project-text`,
`text-nav`. Grep repo-wide sobre `src/`: `text-display`, `text-nav`,
`text-footer-cta` y `text-project-text` tienen **cero usos**; `text-body` tiene
**exactamente uno**, en `InfoCard.tsx:19` — y `InfoCard` **no tiene ningún
consumidor** (grep repo-wide: solo se referencia a sí mismo; es código muerto).
Todos los componentes reales usan valores arbitrarios (`text-[13px]`,
`text-[40px]`, …) que coinciden numéricamente con los tokens pero no los
consumen. **Consecuencia para el sprint tipográfico: cambiar
`--font-size-nav` en `globals.css` no cambia nada visible** — el 13px real del
menú vive en `Navbar.tsx:307` y `:330`.

**Discrepancias internas del archivo, registradas:**

- `:root` declara `--color-gray` (`:7`); el `@theme` declara `--color-gray-brand`
  (`:19`). Mismo valor `#939393`, dos nombres; los componentes usan
  `gray-brand`.
- `--cursor-size: 12px` y `--cursor-size-hover: 48px` (`:8-9`) **no los consume
  nadie**: grep repo-wide da cero usos fuera de su declaración, y
  `CustomCursor.tsx` usa dimensiones fijas (ver 6.5). `CLAUDE.md` §2 los lista
  como parte de la identidad; son tokens muertos.
- El `@theme` duplica los cuatro `--color-*` del `:root` (`:16-19` vs `:4-7`).

## 6.5 — Cursor custom

- **Dónde vive:** `src/components/ui/CustomCursor.tsx` (78 líneas), montado una
  sola vez en `RootClientShell.tsx:30`, dentro de `PreloaderProvider`, en el
  layout raíz — por eso persiste entre rutas.
- **Cómo funciona:** en dispositivos no táctiles (`pointer: coarse` /
  `ontouchstart`, `:12-16`) setea `document.body.dataset.customCursor = "true"`
  (`:18`), lo que activa la regla unlayered `cursor: none !important` de
  `globals.css:45-48` sobre todo el body. El punto visible es un `div`
  `fixed z-[9999] h-4 w-4 rounded-full bg-white mix-blend-difference`
  (`:69`) — **16px fijos vía `h-4 w-4`; no usa `--cursor-size` (12px) ni
  `--cursor-size-hover` (48px), y no tiene ningún estado de hover que lo
  agrande**. Sigue al mouse por `transform` con rAF-throttle (`:20-40`).
- **Cómo se excluye de Sanity Studio:** `RootClientShell.tsx:14-26` — si
  `pathname` es `/studio` o empieza con `/studio/`, el shell borra
  `document.body.dataset.customCursor` en un efecto y retorna `{children}` sin
  montar `CustomCursor` (ni preloader ni `LoadingScreen`). La exclusión es por
  ruta en el cliente, no por CSS.
- El cleanup del efecto (`:54-63`) borra el dataset al desmontar, así el cursor
  nativo vuelve si el componente muere.

## HECHOS VERIFICADOS — Bloque 6

- **`HoverButton` no define tamaño de fuente: el `text-[13px]` del menú vive solo en `Navbar.tsx:307` y `:330`. Cambiarlo a 17px NO se propaga a ningún otro consumidor.** Cada uno de los 11 call sites porta su propio tamaño o lo hereda de su propio contenedor.
- Los consumidores reales de `HoverButton` son **6 archivos**: `Navbar`, `Footer`, `Hero`, `ContactForm`, `ServiceItem`, `ServicesIntro`. **`FunGallery.tsx` no lo importa** — la premisa de la instrucción y de `CLAUDE.md` §7 es indirecta: le llega por el Navbar/Footer que se renderizan sobre la galería.
- `INSTAGRAM` y `LINKEDIN` son los únicos `HoverButton` sin `className`: heredan los 17px de `Footer.tsx:117`.
- `RevealOnScroll` tiene 2 consumidores: `TeamSection` (4 call sites) y `ServiceItem` (1).
- Sistemas de reveal por scroll: **2** (inline de `WorkGrid` + `RevealOnScroll`). GSAP dejó de ser reveal: sus 2 usos son estado de scroll (colapso y `hasReachedEnd`). Reveals de entrada gateados por preloader: 3 más, artesanales (Hero, `RevealLine` de ServicesIntro, variants de Contact).
- El reveal de `WorkGrid` ya es solo vertical (`y: 40`), con `staggerChildren: 0.7` y duración 0.7s — los offsets horizontales de `CLAUDE.md` §8.3 no existen más; el valor 0.7 que citaba la documentación de junio para el stagger es el vigente (`WorkGrid.tsx:17`).
- `globals.css` completo: 76 líneas. Todas sus reglas están **unlayered** (le ganan a cualquier utility); el precedente de sobreescritura correcta es `SCOPED_SELECTION` en `ContactForm.tsx:43-44` (`!important` layered + scope `[data-contact]`).
- **El `@theme` tiene 5 tokens de font-size que casi nadie consume**: 4 con cero usos y `text-body` usado una vez en `InfoCard.tsx:19`, componente sin consumidores (código muerto). El patrón real del repo es el valor arbitrario por componente.
- `--cursor-size` / `--cursor-size-hover` no los consume nadie; el cursor real es `h-4 w-4` (16px) fijo, `mix-blend-difference`, sin estado hover.
- El cursor se excluye del Studio por early-return de `RootClientShell` (`:14-26`), no por CSS.

## DESCONOCIDO — Bloque 6

1. **Si los tokens `@theme` huérfanos y los `--cursor-*` muertos son restos de un plan abandonado o preparación de uno futuro.** El código solo muestra que hoy no se consumen; la intención no es verificable desde el repo.
2. **Si `InfoCard.tsx` (código muerto) debe borrarse.** Decisión de producto, fuera del alcance read-only.

## RIESGOS PARA LO QUE VIENE — Bloque 6

- **El sprint tipográfico no tiene un punto central de cambio.** Los tokens existen pero están desconectados; tocar `globals.css` no mueve nada. Si el sprint quiere centralizar, primero hay que migrar componentes a los tokens (o aceptar el patrón por componente y editar cada `text-[...]`). Son dos estrategias distintas con superficies de diff muy distintas.
- **El menú a 17px iguala el tamaño de los tabs con los bloques chicos del footer y todo el "sistema 17px"** (footer, aside de Team, DISCOVER, filas de ServiceItem, encabezados de ServicesStack — Bloque 2.a). Es un cambio de jerarquía visual, no solo de un número: hoy el menú es el único elemento en 13px de todo el sitio (ver 2.b).
- **`balancedPadding` en los tabs** (`Navbar.tsx:306`, `:329`) cambia el padding a `p-[6px]` alrededor de un texto de 13px; a 17px el botón crece en las dos dimensiones y el indicador subrayado del Navbar se posiciona midiendo el DOM (`getBoundingClientRect`, `Navbar.tsx:111-130` y `:175-187`, con el `-7` hardcodeado en `:129` y `:187`). Un cambio de tamaño mueve esa geometría; el indicador se recalcula solo (rAF + resize listener), pero el offset `-7` es una constante afinada al tamaño actual.
- **Tocar `HoverButton` sigue siendo global** (Navbar + Footer + 4 secciones), y en `/fun-gallery` el Navbar/Footer lo usan con `blend` + `mix-blend-difference` encima de la galería: la regresión posible que `CLAUDE.md` §7 le atribuye a Fun Gallery es real, solo que por esa vía indirecta.
- **`as="a"` inerte en `ServiceItem.tsx:284`**: documenta una expectativa que el componente no cumple (con `href` siempre renderiza `<Link>`). Hoy es inocuo (el destino es interno); si alguien copia el patrón para un link externo sin `external`, obtiene un `<Link>` de Next hacia afuera.

---

# BLOQUE 2.b — Dónde viven los tamaños  `[COMPLETO — sesión 4]`

## El patrón dominante

**Valores arbitrarios por componente** (`text-[13px]`, `text-[40px]`,
`md:text-[30px]`), sin excepción real. El sistema de tokens del `@theme` de
`globals.css:25-42` (`--font-size-display`, `--font-size-body`,
`--font-size-nav`, `--font-size-footer-cta`, `--font-size-project-text`)
existe pero está desconectado: su único consumo es `text-body` en el código
muerto `InfoCard.tsx:19` — detalle completo en el Bloque 6.4. Los valores de
los tokens coinciden numéricamente con los arbitrarios (40/17/13/40/30) pero
ningún componente vivo los usa. **Un pase tipográfico global se hace editando
cada componente**, no un archivo central.

## Inventario exacto — los elementos pedidos por la instrucción

> `fs` = font-size declarado, `lh` = line-height declarado, `ls` =
> letter-spacing declarado. "—" = sin declaración (hereda / default). Los
> valores computados medidos están en 2.a y su ADENDA; acá va la declaración
> con su ubicación exacta.

| Elemento | fs | lh | ls | Evidencia |
|---|---|---|---|---|
| Tabs Navbar (`WORK`/`SERVICES`/`TEAM`/`FUN GALLERY`) | `text-[13px]` | — (computado 19.5px) | `tracking-wider` · en `/fun-gallery` `tracking-[0.09em]` | `Navbar.tsx:307-311` |
| `CONTACT US` | `text-[13px]` | — | `tracking-wider` · fun-gallery `tracking-[0.09em]` | `Navbar.tsx:330-334` |
| Footer bloques chicos (`BORN IN`, `ARGENTINA`, `WORKING`, `WORLDWIDE`, `INSTAGRAM`, `LINKEDIN`, `© 2024`) | `text-[17px]` | `leading-none` | `tracking-normal` · fun-gallery `tracking-[0.035em]` | `Footer.tsx:117` (grid contenedor; los 7 heredan de ahí) |
| `BY develOP` | `text-[17px]` | `leading-none` | `tracking-normal` | `Footer.tsx:42` |
| `POWERED BY develOP` | `text-[40px]` | `leading-none` | `tracking-normal` | `Footer.tsx:41` |
| Footer CTA `LET'S WORK TOGETHER!` | `text-[40px]` | `leading-none` | `tracking-normal` · fun-gallery `tracking-[0.02em]` | `Footer.tsx:188` |
| Hero de Home (3 líneas) | `text-[40px]` | `leading-[1.05]` | — | `Hero.tsx:55`, `:61` (+`font-semibold`), `:67` |
| Hero CTA | `text-[24px]` | — | `tracking-wider` | `Hero.tsx:88` |
| **Services intro — texto 1** | `text-[40px]` | `leading-[1.05]` | — | `ServicesIntro.tsx:256` (`font-display`, `uppercase`, `max-w-5xl`) |
| **Services intro — texto 2** | `text-[40px]` | `leading-[1.05]` | — | `ServicesIntro.tsx:286` (idéntico al texto 1 **menos `uppercase`**; negrita por línea vía `font-bold` en `RevealLine`, `:118`) |
| **Botón `DISCOVER OUR BRANDING SERVICES`** | `text-[17px]` | — | — | `ServicesIntro.tsx:612` (`font-body`, `uppercase`) |
| Párrafos de Team (los dos) | `text-[24px]` → `md:text-[30px]` | `leading-[1.25]` | — | `TeamSection.tsx:102` (párrs. 1-2) y `:111` (subsecciones 02/03) |
| **Contact — título `LET'S BRING YOUR IDEAS TO LIFE`** | `text-[56px]` → `md:text-[68px]` → `lg:text-[clamp(74px,5.25vw,96px)]` | `leading-[0.9]` | — | `ContactForm.tsx:546` (`font-display font-thin uppercase`; `LIFE` en `font-semibold`, `:551`) |
| **Contact — subtítulo** (`SHARE YOUR PROJECT DETAILS…`) | `text-[20px]` → `md:text-[23px]` → `lg:text-[25px]` | `leading-[1.24]` | — | `ContactForm.tsx:556` (la flecha `→` aparte: `text-[28px]` → `md:text-[32px]` `leading-none`, `:566`) |
| **Contact — labels de las preguntas** | `text-[14px]` → `md:text-[16px]` | `leading-[1.15]` | — | `ContactForm.tsx:167` (`FieldShell`, común a los 9 campos; `md:text-right`) |

## Inventario complementario — el resto de la superficie tipográfica

| Elemento | Declaración | Evidencia |
|---|---|---|
| Navbar móvil — links | `text-[48px] leading-none` | `Navbar.tsx:397` |
| Navbar móvil — botón `X` | `text-[17px]` | `Navbar.tsx:384` |
| Team — intro del estudio (`StudioIntro`) | `text-[32px]` → `md:text-[40px]`, `leading-[1.2]` | `TeamSection.tsx:44` |
| Team — aside (`01 THE TEAM`) | `text-[17px] leading-none tracking-wide` | `TeamSection.tsx:88` |
| Team — placeholder `VIDEO O GIF` | `text-sm tracking-wider` (única utility de escala Tailwind en un font-size del sitio) | `TeamSection.tsx:60` |
| Contact — inputs de texto | `text-[28px]` → `md:text-[34px]`, `leading-none` | `ContactForm.tsx:45-46` (`CONTROL_TEXT_CLASS`) |
| Contact — botón de select | `text-[28px]` → `md:text-[34px]`, `leading-none` | `ContactForm.tsx:47-48` |
| Contact — buscador del select de país | `text-[20px]` → `md:text-[22px]`, `leading-none` | `ContactForm.tsx:49-50` |
| Contact — opciones del dropdown | `text-[18px]` → `md:text-[20px]`, `leading-none` | `ContactForm.tsx:438` |
| Contact — pills de work type | `text-[15px]` → `md:text-[17px]`, `leading-none` | `ContactForm.tsx:236` |
| Contact — mensajes de error | `text-[13px]` → `md:text-[14px]`, `tracking-wider` | `ContactForm.tsx:173` (y submit error `text-[13px] tracking-wider`, `:785`) |
| Contact — SEND | `text-[21px]` → `md:text-[24px]` | `ContactForm.tsx:808` |
| Contact success — título | `text-[clamp(40px,5vw,64px)] leading-[1.05]` | `ContactSuccess.tsx:77` |
| Contact success — párrafo | `text-[17px] leading-[1.45]` | `ContactSuccess.tsx:83` |
| ServiceItem — id (`01`, `A.S/01`) | `text-[17px] leading-none` | `ServiceItem.tsx:245` |
| ServiceItem — nombre del servicio | `text-[30px] leading-none` (`font-display`) | `ServiceItem.tsx:252` |
| ServiceItem — hint `[ SCROLL TO END TO UNLOCK ]` | `text-[12px] tracking-widest` | `ServiceItem.tsx:270` |
| ServiceItem — descripción | `text-[17px] leading-[1.5]` | `ServiceItem.tsx:358` |
| ServiceItem — nota | `text-[14px] leading-[1.4] tracking-wide` | `ServiceItem.tsx:365` |
| ServiceItem — label + listas de features | `text-[17px] leading-none` / `leading-[1.45]` | `ServiceItem.tsx:375`, `:379`, `:387` |
| ServicesStack — encabezados (`BRANDING PACK OPTIONS`, `ADDITIONAL SERVICES`) | `text-[17px]` | `ServicesStack.tsx:98`, `:117` |
| ServicesStack — hint `[ CLICK SERVICE TO TOGGLE ]` | `text-[12px] tracking-widest` | `ServicesStack.tsx:35` |
| Work single — aside meta | `text-[17px] leading-relaxed` | `ProjectDetailClient.tsx:37` |
| Work single — título | `text-[40px] leading-[1.05] tracking-tight` | `ProjectDetailClient.tsx:43` |
| Work single — nav inferior (`All Projects`, `Next →`) | `text-[13px] tracking-wider` / título siguiente `text-[24px]` | `ProjectDetailClient.tsx:70`, `:81`, `:84` |
| Work grid — overlay de hover de tarjeta | `text-[17px] leading-[1.15]` / `leading-none` | `ProjectCard.tsx:68`, `:72`, `:83` |
| Work grid — placeholder sin imagen | `text-[80px] font-bold` | `ProjectCard.tsx:55` |
| Portable Text de proyecto | `text-[30px] leading-[1.3]` | `ProjectContentRenderer.tsx:11` (y vacío `:166`) |
| Captions de media | `text-[13px]` | `ProjectContentRenderer.tsx:40`, `:60`, `:90`, `:110` |

## ¿La escala es fija o responsive?

**Mayoritariamente fija.** El censo completo de mecanismos responsive en
`font-size` sobre todo `src/`:

- **`clamp()` en font-size: exactamente 2 casos.** `ContactForm.tsx:546`
  (`lg:text-[clamp(74px,5.25vw,96px)]`, título de Contact) y
  `ContactSuccess.tsx:77` (`text-[clamp(40px,5vw,64px)]`). Son también los
  únicos font-size con unidad `vw` (dentro de esos `clamp`).
- **Breakpoints que cambian tamaños:** `md:` (768px) en Team (24→30,
  `TeamSection.tsx:102`/`:111`), StudioIntro (32→40, `:44`), y todos los
  controles de Contact (labels 14→16, inputs 28→34, search 20→22, opciones
  18→20, pills 15→17, errores 13→14, SEND 21→24, flecha 28→32, título 56→68);
  `lg:` (1024px) **solo en Contact** (título → clamp, subtítulo 23→25). La
  afirmación de 2.a ("el único breakpoint tipográfico en juego es `md`") era
  correcta para los elementos medidos en 2.a; **con el inventario completo, el
  conjunto es `md` + `lg`, y el `lg` es exclusivo de Contact.**
- **Todo lo demás es un solo valor fijo en todos los anchos**: menú (13),
  footer (17/40), Hero (40), Services intro (40) y botón (17), Services stack
  (12/14/17/30), Work grid/single (13/17/24/40/80), galería (sin texto).

## Letter-spacing actual en menú y footer (pedido de "interletrado 0")

Consolidado de lo medido (2.a + ADENDA) y lo declarado:

| Contexto | Declarado | Computado medido |
|---|---|---|
| Menú, rutas normales | `tracking-wider` (`Navbar.tsx:310`, `:333`) | **0.65px** (= 0.05em × 13px) |
| Menú, `/fun-gallery` | `tracking-[0.09em]` | **1.17px** |
| Footer chico, rutas normales | `tracking-normal` (`Footer.tsx:117`) | **normal** (= 0) — **ya cumple** |
| Footer chico, `/fun-gallery` | `tracking-[0.035em]` | **0.595px** |
| Footer CTA, rutas normales | `tracking-normal` (`Footer.tsx:188`) | **normal** (= 0) — **ya cumple** |
| Footer CTA, `/fun-gallery` | `tracking-[0.02em]` | **0.8px** |
| Crédito `BY develOP` (todas las rutas) | `tracking-normal` (`Footer.tsx:42`) | **normal** (= 0) |

**El pedido de interletrado 0 tiene efecto real en: el menú (todas las rutas) y
el footer solo en `/fun-gallery`.** El resto del footer ya está en 0.

## HECHOS VERIFICADOS — Bloque 2.b

- Patrón dominante: **valor arbitrario por componente**; los tokens del `@theme` están huérfanos (Bloque 6.4). No hay ningún componente vivo que tome su font-size de un token.
- Los dos textos del intro de Services comparten `text-[40px] leading-[1.05]` con el hero de Home; difieren solo en `uppercase` (texto 1 sí, texto 2 no) y en la negrita por línea del texto 2.
- El botón DISCOVER es `text-[17px]` sin line-height ni tracking declarados (`ServicesIntro.tsx:612`).
- Contact es la sección tipográficamente más compleja: 10 escalas distintas, los únicos dos `clamp()` del sitio (uno en Contact, otro en Success) y el único uso de `lg:` para font-size.
- **`text-[13px]` existe en exactamente 12 declaraciones repartidas en 5 archivos** (grep repo-wide de esta sesión): las 2 del menú (`Navbar.tsx:307`, `:330`), 3 del nav inferior de Work single (`ProjectDetailClient.tsx:70`, `:81`, `:93`), 3 de Contact (errores `:173`, `No results` `:450`, error de envío `:785`) y 4 captions de media (`ProjectContentRenderer.tsx:40`, `:60`, `:90`, `:110`). **Subir "el menú" a 17px es tocar solo las dos de Navbar**; las otras 10 son decisiones aparte.
- 17px es el tamaño más repetido del sitio (footer, asides, DISCOVER, filas de ServiceItem, encabezados de Stack, overlay de Work, meta de Work single, párrafo de Success).
- `text-sm` (`TeamSection.tsx:60`) es la única utility de escala estándar de Tailwind usada para font-size, en un placeholder interno.

## DESCONOCIDO — Bloque 2.b

1. **Los computados de line-height de los elementos no medidos en 2.a** (Contact, Services stack, Work single). Declarados quedan citados; no se midieron en runtime en esta sesión (no se levantó dev server — corrida estática).

## RIESGOS PARA LO QUE VIENE — Bloque 2.b

- **`text-[40px]` aparece en 7 declaraciones de 4 secciones** (Hero ×3, Services intro ×2, footer CTA + crédito grande, Work single título, StudioIntro md). Un "subí el hero" hecho por buscar-y-reemplazar del valor toca pantallas que nadie pidió tocar. El cambio correcto es por componente.
- **El título de Contact ya es fluido (`clamp`) y el resto del sitio es fijo.** Cualquier decisión de sistema (¿fijo o fluido?) tiene hoy un precedente de cada lado.
- **Los tamaños de Contact están en constantes compartidas** (`CONTROL_TEXT_CLASS` etc., `ContactForm.tsx:45-50`): un cambio ahí mueve inputs y selects juntos — es el único lugar del sitio donde varios elementos ya comparten una declaración.

---

# BLOQUE 2.c — Censo de textos fijos y su forma  `[COMPLETO — sesión 4]`

> **Criterio del censo.** Se cuentan strings de UI hardcodeados en `src/` que el
> usuario final puede ver (o que asisten tecnología de apoyo / SEO — categoría
> 4). **Se excluyen del conteo principal y se reportan aparte:** (a) el
> contenido fallback que replica datos de Sanity (`local-projects.ts`,
> `mock-data.ts`) — es contenido, no cromo de UI, y solo aparece si Sanity
> falla; (b) el mail interno del route handler (`api/contact/route.ts` — llega
> a la casilla del estudio, no a la pantalla); (c) código muerto
> (`InfoCard.tsx`, `SanityImage.tsx` — sin consumidores, verificado por grep).
> Cada string se cuenta una vez por aparición en el código.

## EL NÚMERO

**450 strings de UI hardcodeados**, así:

| Categoría | Conteo | Qué contiene |
|---|---|---|
| **1 — String simple** | **365** | de los cuales **196 son países** (`COUNTRY_OPTIONS`) y **108 son el catálogo de Services** — sin esos dos bloques de datos: **61** |
| **2 — Texto partido en líneas** | **15 strings en 4 grupos** | detalle completo abajo |
| **3 — Texto con markup embebido** | **16** | entidades, `<br>`, spans con clase, fragmentos que componen `<strong>` |
| **4 — No visible pero traducible** | **54** | 18 de metadata, 17 `alt`, 9 `placeholder`, 8 `aria-label`, 2 mensajes de zod |

**La suposición "no son tantos textos fijos" es falsa en el total pero
matizable:** el 68% del censo son dos estructuras de datos (países + catálogo
de Services). El cromo de UI propiamente dicho (lo que no es dato enumerable)
ronda los **146 strings**.

### Conteo por archivo (los 23 archivos con strings)

| Archivo | Total | Desglose |
|---|---|---|
| **`src/lib/contact.ts`** | **217** | 196 países + 19 opciones (7 work type, 4 business, 4 timeline, 4 budget) + 2 mensajes zod |
| **`src/app/(site)/services/page.tsx`** | **110** | catálogo completo: 6 nombres + 6 descripciones + 6 ids + 90 ítems/sub-ítems + 2 metadata |
| **`src/components/sections/contact/ContactForm.tsx`** | **25** | 9 cat.1 (5 labels simples, `No results`, error de envío, `SEND QUESTIONNAIRE`/`SENDING...`) + 6 cat.3 + 9 placeholders + 1 aria-label |
| `TeamSection.tsx` | 19 | 9 cat.1 + 5 cat.2 + 4 cat.3 + 1 alt |
| `ServicesIntro.tsx` | 15 | 1 cat.1 (DISCOVER) + 7 cat.2 + 7 alt |
| `Footer.tsx` | 10 | 6 cat.1 + 4 cat.3 |
| `Navbar.tsx` | 8 | 6 cat.1 (4 tabs, `CONTACT US`, `X`) + 2 aria-label |
| `ProjectContentRenderer.tsx` | 6 | 1 cat.1 + 5 alt/title fallback |
| `src/app/layout.tsx` | 6 | metadata textual (title template/default, description, OG title/description/alt) |
| `ServiceItem.tsx` | 5 | 3 cat.1 + 2 alt template |
| `ServicesStack.tsx` | 4 | 3 cat.1 + 1 aria-label |
| `Hero.tsx` | 4 | 3 cat.2 + 1 cat.3 |
| `ContactSuccess.tsx` | 3 | 1 cat.1 + 1 cat.3 + 1 aria-label |
| `ProjectDetailClient.tsx` | 3 | `All Projects` + `Next →` ×2 |
| `FunGallery.tsx` | 2 | 2 aria-label (uno template) |
| `LogoScript.tsx` | 2 | aria-label + alt |
| `contact/page.tsx` · `team/page.tsx` · `work/page.tsx` · `fun-gallery/page.tsx` | 2 c/u | metadata title + description |
| `work/[slug]/page.tsx` | 1 | fallback `Project Not Found` |
| `contact/success/page.tsx` | 1 | metadata title |
| `LoadingScreen.tsx` | 1 | alt |

**Los tres archivos con más strings: `lib/contact.ts` (217),
`services/page.tsx` (110), `ContactForm.tsx` (25).**

Archivos verificados **sin** strings de UI: `WorkGrid.tsx`, `ProjectCard.tsx`,
`HoverButton.tsx`, `RevealOnScroll.tsx`, `CustomCursor.tsx`, `template.tsx`,
`(site)/page.tsx`, `(site)/layout.tsx`, los tres providers,
`PageTransitionShell.tsx`, `MonochromeCountryFlag.tsx` (SVG decorativo,
`countryFlagColors.ts` es data de colores), `studio/[[...tool]]/page.tsx`.

## Metadata de cada `page.tsx` (transcripción)

| Ruta | title | description |
|---|---|---|
| raíz (`app/layout.tsx:20-23`) | template `%s \| ESQUINA ESTUDIO™` · default `ESQUINA ESTUDIO™ \| Branding & Design` | `A design studio focused on building brands and shaping ideas with clarity, intention, and strong visual identity based in Tucumán, Argentina.` (+ OG title/description iguales, OG alt `ESQUINA ESTUDIO™`, `locale: en_US`) |
| `/` | **sin metadata propia** — hereda el default del layout raíz | — |
| `/contact` (`contact/page.tsx:5-7`) | `Contact - ESQUINA ESTUDIO™` (con `™`) | `Share your project details with ESQUINA ESTUDIO and receive a custom proposal.` |
| `/contact/success` (`success/page.tsx:5`) | `Inquiry Sent - ESQUINA ESTUDIO™` | — (sin description) |
| `/services` (`services/page.tsx:6-8`) | `Services - ESQUINA ESTUDIO(TM)` — **`(TM)` literal, no `™`; única página con esa forma** | `Branding, motion graphics, packaging, editorial and illustration services by ESQUINA ESTUDIO.` |
| `/team` (`team/page.tsx:5-7`) | `Team - ESQUINA ESTUDIO™` | `Meet ESQUINA ESTUDIO, a design studio focused on building brands and shaping ideas with clarity and intention.` |
| `/work` (`work/page.tsx:12-14`) | `Work — ESQUINA ESTUDIO™` — **separador em-dash, no guión como las demás** | `Selected projects by ESQUINA ESTUDIO™. Branding, packaging design, art direction, illustration and photography.` |
| `/work/[slug]` (`[slug]/page.tsx:34-75`) | dinámico: `project.title`; fallback hardcodeado `Project Not Found` (`:44`) | dinámico: `` `${project.category} — ${project.services}` `` |
| `/fun-gallery` (`fun-gallery/page.tsx:12-16`) | `Fun Gallery - ESQUINA ESTUDIO™` | `A free-form visual gallery from ESQUINA ESTUDIO with images, references and studio moments.` |
| `/studio` | sin metadata | — |

## CATEGORÍA 2 — los cuatro grupos, transcriptos enteros, con su mecánica de delay

### Grupo 1 — `Text1Lines`, intro de Services — 3 líneas

`ServicesIntro.tsx:250-254`:

```ts
  const lines = [
    "WE TRANSLATE IDEAS INTO LIVING IDENTITIES —",
    "CRAFTED THROUGH STRATEGY, AESTHETICS AND",
    "DETAIL-ORIENTED DESIGN SYSTEMS.",
  ];
```

**Delay por línea:** cada línea es un `RevealLine` con
`delay = delayBase + index * TITLE_STAGGER` (`ServicesIntro.tsx:123`), donde
`delayBase = TITLE_DELAY = 0.12` (`:65`, pasado en `:262`) y
`TITLE_STAGGER = 0.08` (`:66`). Líneas: 0.12s / 0.20s / 0.28s, duración 0.42s
c/u (`TITLE_LINE_DURATION`, `:67`).

**Acoplamiento a la cantidad — el más peligroso del repo.**
`TITLE_1_LINE_COUNT = 3` (`:68`) es un **literal**, no `lines.length`, y
alimenta cuatro constantes:
- `CTA_DELAY = TITLE_DELAY + TITLE_STAGGER * (TITLE_1_LINE_COUNT - 1) + TITLE_LINE_DURATION` = **0.70s** (`:71-72`)
- `CTA_UNDERLINE_DELAY = CTA_DELAY + CTA_DURATION` = **1.15s** (`:73`)
- `TEXT1_REVEAL_MS` = misma fórmula × 1000 = **700ms** (`:85-87`)
- `INITIAL_LOCK_MS = TEXT1_REVEAL_MS` = **700ms** (`:88`) — **el tiempo que el
  scroll-jack mantiene la página bloqueada** (`:324-332`).

Si la traducción pasa de 3 a 4 líneas y solo se edita el arreglo, el botón
aparece y el scroll se desbloquea 80ms antes de que la 4ª línea termine de
revelar.

### Grupo 2 — `Text2Lines`, intro de Services — 4 líneas, 2 en negrita

`ServicesIntro.tsx:279-284`:

```ts
  const lines: Array<{ text: React.ReactNode; bold?: boolean }> = [
    { text: <>Whether we&rsquo;re shaping a brand from scratch or</> },
    { text: "reimagining an existing one, our approach is rooted in" },
    { text: "creating experiences that feel authentic, memorable", bold: true },
    { text: "and visually cohesive across every touchpoint.", bold: true },
  ];
```

**Delay por línea:** mismo `RevealLine`, con
`delayBase = TEXT2_DELAY_CHILDREN = TITLE_DELAY + FADE_OUT_TIME = 1.12`
(`:75`, pasado en `:293`). Líneas: 1.12s / 1.20s / 1.28s / 1.36s.
**No hay constante de cantidad para el texto 2**: su delay depende solo de
`index`; agregar una 5ª línea solo alarga la cola. La línea 1 **no es un string
plano** (JSX con `&rsquo;` — solapa categoría 3) y las líneas 3-4 portan
`bold: true` (estructura, no markup).

### Grupo 3 — Hero de Home — 3 líneas hermanas (sin arreglo)

`Hero.tsx:53-70` — tres `<motion.p>` literales en JSX:

```
"IN A WORLD FULL OF NOISE"          (:57)
"MAKE YOUR BRAND STAND OUT."        (:63)  ← font-semibold (:61)
"WITH INTENTION. WITH IMPACT."      (:69)
```

**Delay por línea:** orquestación por `staggerChildren: TITLE_STAGGER (0.08)` +
`delayChildren: TITLE_DELAY (0.12)` en el contenedor (`Hero.tsx:17-26`) — la
mecánica que `ServicesIntro` descartó (`ServicesIntro.tsx:91-97`). Mismos
números efectivos: 0.12/0.20/0.28.
**Mismo acoplamiento:** `TITLE_LINE_COUNT = 3` literal (`Hero.tsx:11`) alimenta
`CTA_DELAY` (0.70s, `:13-14`) y `CTA_UNDERLINE_DELAY` (1.15s, `:15`). Acá no
hay scroll-lock: el riesgo es solo que el CTA aparezca antes de que termine la
última línea.

### Grupo 4 — `studioIntroLines`, Team — 5 líneas, sin stagger

`TeamSection.tsx:6-12`:

```ts
const studioIntroLines = [
  "<b>ESQUINA ESTUDIO</b>™ is a design studio focused on building brands",
  "and shaping ideas with clarity, intention, and strong visual identity.",
  "We help startups turn their vision into professional, visually",
  "compelling businesses, while also working with established",
  "brands to rethink and elevate their identity.",
];
```

**Delay por línea: NO tiene.** Las 5 líneas se renderizan como `<p>` con
`dangerouslySetInnerHTML` (`:45-50`) dentro de **un solo** `RevealOnScroll
delay={0.5}` (`:43`): revelan juntas. Los cortes siguen siendo manuales (el
ancho de línea está decidido a mano, no por wrapping), y la línea 1 lleva
**HTML como string** (`<b>…</b>`) — solapa categoría 3 vía
`dangerouslySetInnerHTML`, la única aparición de ese patrón en el repo.
Cambiar la cantidad de líneas acá no desincroniza nada.

### Resumen categoría 2

| Grupo | Líneas | Stagger por línea | Constante de cantidad | Riesgo al traducir |
|---|---|---|---|---|
| Text1Lines (Services) | 3 | 0.08s | `TITLE_1_LINE_COUNT = 3` → **alimenta el scroll-lock** | **ALTO** |
| Text2Lines (Services) | 4 | 0.08s | ninguna | BAJO |
| Hero (Home) | 3 | 0.08s (staggerChildren) | `TITLE_LINE_COUNT = 3` → CTA | MEDIO |
| studioIntroLines (Team) | 5 | sin stagger | ninguna | BAJO (solo re-cortar) |

## CATEGORÍA 3 — los 16 textos con markup, listados

| # | Texto | Forma del markup | Evidencia |
|---|---|---|---|
| 1 | `© 2024` | entidad `&copy;` | `Footer.tsx:159` |
| 2 | `POWERED BY develOP` | string partido + `<span className="normal-case">` | `Footer.tsx:51-52` |
| 3 | `BY develOP` | idem (misma estructura, variante chica) | `Footer.tsx:51-52` |
| 4 | `LET'S WORK TOGETHER!` (footer CTA) | entidad `&apos;` | `Footer.tsx:190` |
| 5 | `LET'S WORK TOGETHER!` (CTA del Hero) | entidad `&apos;` | `Hero.tsx:90` |
| 6 | `LET'S BRING / YOUR IDEAS / TO LIFE` | `&apos;` + 2 `<br>` + `<span className="font-semibold">LIFE</span>` — cortes de línea manuales | `ContactForm.tsx:547-552` |
| 7 | `SHARE YOUR PROJECT DETAILS / TO RECEIVE A CUSTOM PROPOSAL` | `<br>` | `ContactForm.tsx:562-564` |
| 8-11 | Labels de 2 líneas: `WHAT ARE YOU / LOOKING TO WORK ON?` · `WHERE ARE / YOU BASED?` · `WHAT IS YOUR / BUDGET RANGE?` · `HOW DID YOU / HEAR ABOUT US?` | 2 `<span className="block">` c/u — corte manual | `ContactForm.tsx:634-635`, `:687-688`, `:747-748`, `:769-770` |
| 12 | `YOUR INQUIRY WAS SENT / SUCCESSFULLY!` | `<br>` | `ContactSuccess.tsx:78-80` |
| 13-16 | `teamParagraphs` — 4 fragmentos que componen 2 párrafos | arreglo de fragmentos: `"Founded by "` + `<strong>{"Virginia and Victoria"}</strong>` + resto; el 4º es el párrafo 2 entero | `TeamSection.tsx:14-19`, ensamblado en `:103-108` |

(Solapamientos ya contados en cat. 2, no acá: línea 1 de `Text2Lines`
(`&rsquo;`) y línea 1 de `studioIntroLines` (`<b>` vía
`dangerouslySetInnerHTML`).)

## CATEGORÍA 4 — desglose

- **Metadata (18):** tabla de arriba — 6 del layout raíz + 12 de las páginas.
- **`alt` (17):** los 7 de `FLOATING_MEDIA` (`ServicesIntro.tsx:23-53`); 2
  templates de ServiceItem (`` `${service.name} hover visual` `` `:323`,
  `` `${service.name} visual reference` `` `:407`); `ESQUINA ESTUDIO team`
  (`TeamSection.tsx:129`); `ESQUINA ESTUDIO` (`LoadingScreen.tsx:408`,
  `LogoScript.tsx:35`); 5 fallbacks de `ProjectContentRenderer` (`Project
  video` `:33`, `Project media` `:85`, `:103`, `:139`, `:151`). El alt del
  logo develOP es `""` (decorativo, `Footer.tsx:56`) — no cuenta.
- **`placeholder` (9):** `NAME` (`ContactForm.tsx:606`), `EMAIL` (`:622`),
  `SHORT ANSWER` ×2 (`:677`, `:775`), `SELECT OPTION` ×4 (`:659`, `:694`,
  `:732`, `:754`), `SEARCH` (`:423`).
- **`aria-label` (8):** `Open menu` / `Close menu` (`Navbar.tsx:363`, `:385`),
  `Services` (`ServicesStack.tsx:94`), `Project questionnaire`
  (`ContactForm.tsx:592`), `Inquiry sent confirmation`
  (`ContactSuccess.tsx:16`), `Fun Gallery` (`FunGallery.tsx:510`),
  `` `View ${item.title}` `` (`FunGallery.tsx:427`, template),
  `ESQUINA ESTUDIO home` (`LogoScript.tsx:31`).
- **Mensajes de zod (2):** `Please enter your full name`
  (`lib/contact.ts:234`), `Please enter a valid email` (`:235`). **Son los
  únicos dos**: los demás campos del schema son `.optional()` sin mensaje
  (`:236-242`) — `workType`, aunque el form muestra `errors.workType?.message`
  (`ContactForm.tsx:638`), no tiene validación que lo dispare.

## Reportado aparte (fuera del censo, por criterio)

- **Fallback de contenido: 82 strings.** `LOCAL_WORK_PROJECTS`
  (`lib/local-projects.ts:13-150`): 8 proyectos × (title, category, services,
  year, 1 bloque de texto) = 40. `MOCK_PROJECTS` (`lib/mock-data.ts:20-155`):
  8 × 4 campos + 10 bloques = 42. Visibles solo cuando Sanity falla o falta
  (`work/page.tsx:17-33`, `[slug]/page.tsx:77-97`, `fun-gallery/page.tsx:19-37`).
- **Mail del route handler** (`api/contact/route.ts`): asunto, encabezados de
  tabla y `Not specified` — inglés, llega a `valenolme@gmail.com` (`:5`,
  hardcodeado), nunca a la pantalla. Los mensajes de error JSON del route
  (`:45-107`) tampoco se muestran: `ContactForm.tsx:526-531` solo mira
  `res.ok` y muestra su propio string.
- **Código muerto:** `esquina™` (`InfoCard.tsx:30`) y `SanityImage.tsx` (0
  consumidores, verificado por grep en esta sesión).

## Hallazgos incidentales del censo

1. **`VIDEO O GIF` (`TeamSection.tsx:61`) es el único string en español de todo
   el sitio** — el placeholder del video de Team que las clientas aún no
   entregaron.
2. **`Applications may include:` es a la vez UI y centinela de parsing.**
   `ServiceItem.tsx:73-80` lo busca con `.includes()` dentro de
   `service.description` para separar el label del cuerpo. Traducir el catálogo
   sin actualizar el centinela (o viceversa) rompe silenciosamente el split: el
   label quedaría duplicado dentro de la descripción.
3. **Las descripciones y varios ítems del catálogo de Services traen `\n`
   manuales** (p. ej. `services/page.tsx:16`, `:64`, `:93`, `:101`) renderizados
   con `whitespace-pre-line` (`ServiceItem.tsx:358`): los cortes de línea del
   inglés están decididos a mano **dentro de strings simples** — mismo problema
   de re-corte que la categoría 2, sin stagger.
4. **Metadata inconsistente entre páginas:** `(TM)` literal en Services, em-dash
   en Work vs. guión en el resto, `/contact/success` sin description, y la home
   sin metadata propia (hereda el default del layout).
5. **`<main>` anidados.** El shell ya envuelve todo en `<main>`
   (`(site)/layout.tsx:17`); aún así `ServicesPageClient.tsx:28`,
   `TeamSection.tsx:145`, `work/page.tsx:39`, `ProjectDetailClient.tsx:23` y
   `FunGallery.tsx:507` renderizan su propio `<main>` → dos `<main>` anidados
   en `/services`, `/team`, `/work`, `/work/[slug]` y `/fun-gallery`. Contact
   lo evita a propósito y lo documenta (`contact/page.tsx:19-21`). Registrado
   como hecho; es tema de accesibilidad/semántica, no de i18n.

## HECHOS VERIFICADOS — Bloque 2.c

- **450 strings** en 4 categorías: **365 / 15 / 16 / 54**. Sin los dos bloques de datos (196 países + 108 del catálogo de Services): ~146.
- Top 3 archivos: `lib/contact.ts` (217), `services/page.tsx` (110), `ContactForm.tsx` (25).
- **Categoría 2: 4 grupos.** Solo dos tienen constante de cantidad acoplada (`TITLE_1_LINE_COUNT` en ServicesIntro — que gobierna el scroll-lock — y `TITLE_LINE_COUNT` en Hero — que gobierna el CTA). Text2Lines y studioIntroLines no tienen acoplamiento.
- Los delays de categoría 2 son todos `base + index × 0.08` (0.12 base en textos iniciales, 1.12 en texto 2), salvo Team que revela en bloque.
- Solo 2 mensajes de validación de zod; el resto del schema es opcional sin mensajes.
- 18 piezas de metadata hardcodeadas; la home no tiene metadata propia.
- 82 strings más en fallbacks de contenido (fuera del censo por criterio, reportados aparte).

## DESCONOCIDO — Bloque 2.c

1. **Si los países se traducen o quedan en inglés.** Decisión de producto; el censo los cuenta pero 196/450 dependen de esa decisión.
2. **Si el catálogo de Services (108 strings) migrará a Sanity o quedará hardcodeado bilingüe.** La instrucción v3 lo trata como rediseño (Bloque 3); la decisión de fuente de datos cambia el tamaño real del diccionario más que ninguna otra.

## RIESGOS PARA LO QUE VIENE — Bloque 2.c

- **Un diccionario plano NO alcanza tal cual**: 15 strings viven en arreglos de líneas cortadas a mano (cat. 2), 16 llevan markup (cat. 3), y 2 grupos de cat. 2 tienen constantes de cantidad que hay que convertir en `lines.length` (o recalcular a mano por idioma) antes de traducir. El español +15-25% casi garantiza que Text1Lines pase de 3 a 4 líneas.
- **El centinela `Applications may include:`** rompe el render de los 4 servicios A.S si catálogo y centinela no se traducen juntos.
- **`&rsquo;`/`&apos;`/`<br>`/`<b>`-en-string obligan a que el diccionario soporte nodos, no solo strings** (o a normalizar esos 16+2 casos antes).
- **El fallback local queda monolingüe**: si el contenido de Sanity se vuelve bilingüe, los 82 strings de fallback muestran inglés fijo en el idioma que sea.

---

## CORRECCIÓN A BLOQUES YA ESCRITOS (sesión 4)

- **Bloque 4, DESCONOCIDO nº 1** — cerrado por dato externo del usuario: los ocho PNG están en su máquina, no entran al repo, y se cargarán a mano por el Sanity Studio. Ninguna corrida futura debe buscarlos en el repo.
- **NÚMEROS CLAVE nº 2** — resuelto: **450 strings (365/15/16/54)**; ~146 sin los dos bloques de datos (países + catálogo de Services).
- **Bloque 0.7 (documentación vs. código), dos entradas nuevas:**
  - `CLAUDE.md` §7 ("**`HoverButton` es compartido con Fun Gallery**") es **inexacto**: `FunGallery.tsx` no importa `HoverButton`; la relación es indirecta vía Navbar/Footer renderizados sobre la galería (Bloque 6.1).
  - `CLAUDE.md` §8.3 ("hoy `WorkGrid` anima con offsets **horizontales** (`DIRECTIONS` con `x: ±60`)") describe código que **ya no existe**: el reveal actual de `WorkGrid.tsx:20-23` es solo vertical (`y: 40`), sin `DIRECTIONS`. La corrección que §8.3 pedía ya fue aplicada en junio (commit `86702bf` menciona el stagger 0.7 vigente).
- **Bloque 2.a, HECHOS** — "el único breakpoint tipográfico en juego es `md`" era correcto para los elementos medidos; el inventario completo (2.b) suma `lg:` (exclusivo de Contact) y 2 `clamp()` (Contact y Success).
- **Bloque 1.f (scroll programático)** — el censo de la sesión 2 queda confirmado sin altas: los `window.scrollTo`/`scrollBy` vistos en esta sesión (`ServicesIntro.tsx:441`, `:510`; `ServiceItem.tsx:162`; `ServicesStack` no tiene; `CustomSelect` `ContactForm.tsx:333`; `ServicesPageClient.tsx:24`) ya estaban registrados o son los mismos call sites releídos.

---

# BLOQUE 3 — Services  `[COMPLETO — sesión 5]`

> Bloque de rediseño. Directiva de la instrucción: **el intro NO se reemplaza,
> se conserva**; el botón pasa a ser indicador de scroll; todo lo de packs es
> nuevo hacia abajo, con un menú lateral sticky nuevo.
>
> Método de esta corrida: los cinco archivos de Services releídos íntegros de
> disco (`page.tsx` 175 líneas, `ServicesPageClient.tsx` 33, `ServicesIntro.tsx`
> 649, `ServicesStack.tsx` 140, `ServiceItem.tsx` 424), más
> `SmoothScrollProvider.tsx` (81), `PreloaderProvider.tsx` (66), `template.tsx`
> (23) y `RevealOnScroll.tsx` (46) completos, y greps exhaustivos sobre `src/`
> (`TITLE_1_LINE_COUNT`, `IntersectionObserver|useInView|whileInView|useScroll|useTransform`,
> `sticky`, `ScrollTrigger`, `services-list`, `scrollbar-width`). Este bloque
> reemplaza al ANEXO A; lo repite solo donde hace falta para que se lea solo.

## 3.0 — Parada condicional: NO se activó

Los cuatro supuestos de la instrucción, contrastados contra el código de hoy:

| Supuesto | Veredicto |
|---|---|
| `TITLE_1_LINE_COUNT = 3` alimenta el lock de 700 ms | **CONFIRMADO** — `ServicesIntro.tsx:68`, `:85-88`, `:328`. Con una precisión de alcance: alimenta la **compuerta de gesto** de 700 ms, no la liberación del `overflow` del body. Ver 3.3.6. |
| Contrato `h-[200vh]` / `h-screen` idéntico en las dos ramas | **CONFIRMADO** — `:545` y `:569`, clase idéntica carácter por carácter |
| Lenis NO corre en `/services` | **CONFIRMADO** — `SmoothScrollProvider.tsx:13-15` y `:29-34`, releído hoy |
| Catálogo con `\n` manuales y centinela `Applications may include:` | **CONFIRMADO** — `page.tsx:11-170`; `ServiceItem.tsx:73-80` |

## 3.1 — Mapa de archivos

Los cinco archivos existen con esos nombres exactos; no hay archivos
adicionales en `src/components/sections/services/` (`git ls-files`, sesión 1,
árbol sin cambios desde entonces). Soportes externos que participan de la ruta:
`SmoothScrollProvider.tsx`, `PreloaderProvider.tsx`, `template.tsx`,
`RevealOnScroll.tsx`, `HoverButton.tsx`, `globals.css`.

**Hallazgo estructural: `<main>` anidado.** El shell ya envuelve la página en
`<main className="pt-[var(--header-height)]">` (`(site)/layout.tsx:17`), y
`ServicesPageClient.tsx:28` renderiza **otro** `<main
className="overflow-visible bg-off-white text-off-black">` adentro. Contraste
directo: `contact/page.tsx:19-20` usa `<section>` con este comentario: *"The
site layout already wraps page content in `<main>`; use a `<section>` here to
avoid nesting `<main>`"*. Services hace exactamente lo que Contact evita.

Estructura de la página (`ServicesPageClient.tsx:27-32`):

```tsx
    <main className="overflow-visible bg-off-white text-off-black">
      <ServicesIntro />
      <ServicesStack key={pathname} services={services} />
    </main>
```

`key={pathname}` es inerte en la práctica: `pathname` es constante mientras el
componente está montado (solo renderiza en `/services`).

## 3.2 — Qué gobierna el scroll de `/services` hoy

Seis piezas, todas verificadas de primera mano:

1. **Lenis no se instancia.** `SmoothScrollProvider.tsx:13-15`:
   `shouldUseSmoothScroll` devuelve true solo para `/team` y `/work*`. En
   `/services` el efecto sale por la rama `:29-34`: setea
   `document.documentElement.style.scrollBehavior = "auto"` (estilo inline
   sobre `<html>`, que pisa cualquier `scroll-behavior` de CSS) y borra
   `window.lenis`. **El scroll de la ruta es 100 % nativo.**
2. **Restauración manual + arranque en 0.** `ServicesPageClient.tsx:19-25`:
   `window.history.scrollRestoration = "manual"` y `window.scrollTo(0, 0)` en
   `useLayoutEffect` con dep `[pathname]`. La mutación de `scrollRestoration`
   es global y **nadie la restaura al salir de la ruta** (censo 1.f: es el
   único call site que la toca).
3. **El lock del body durante el intro.** `ServicesIntro.tsx:418-431` (detalle
   en 3.3.6).
4. **Cuatro scrolls programáticos nativos**, censo 1.f confirmado hoy sin
   altas: `ServicesPageClient.tsx:24`, `ServicesIntro.tsx:441`, `:510`,
   `ServiceItem.tsx:162`.
5. **Scrollbars ocultas globalmente** (`globals.css:59-66`), con lo cual el
   lock no produce salto de layout (ver 3.3.6, paddingRight).
6. **Después del latch estático: scroll nativo puro.** No hay listener de
   `scroll` propio en la sección; los únicos consumidores del scroll son los
   dos `ScrollTrigger` de GSAP (3.6.3).

## 3.3 — La máquina de estados del scroll-jack, exhaustiva

### 3.3.1 — Entradas (no son estado propio)

| Entrada | Fuente | Semántica |
|---|---|---|
| `isPreloaderDone` | `usePreloader()` — `ServicesIntro.tsx:303`; contexto en `PreloaderProvider.tsx:38-54` | Arranca `false` (SSR-safe); pasa a `true` una sola vez: por `markPreloaderDone()` (primera visita de la sesión) o por sync con `sessionStorage["esquina:preloaderShown"]` en el mount (`PreloaderProvider.tsx:12`, `:40-47`). **Monotónica dentro del montaje** — el comentario `ServicesIntro.tsx:236-237` depende de eso. |
| `reduceMotion` → `shouldReduceMotion` | `useReducedMotion()` de Framer — `:304-305` | Hook reactivo de media query; refleja el ajuste del SO en vivo. |

### 3.3.2 — Estado propio

`ServicesIntro.tsx:307-317`:

```ts
  const [isJumping, setIsJumping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  // Latched once the forward intro is done. Never reset within a mount -> kills
  // the scroll-up replay at the source.
  const [isStatic, setIsStatic] = useState(false);
  const jumpedViaButtonRef = useRef(false);
```

Censo completo de setters:

| Variable | Se pone `true` en | Se pone `false` en |
|---|---|---|
| `hasInteracted` | `:368` (wheel), `:386` (touchmove), `:490` (botón) | nunca |
| `isJumping` | `:489` (botón) | `:521` (timer 400+1600 ms) |
| `isInitialLoadComplete` | `:329` (timer de 700 ms) | nunca |
| `isStatic` | `:345` (camino scroll), `:526` (camino botón) | **nunca** (comentario `:310-311`) |
| `jumpedViaButtonRef.current` | `:488` | nunca |

### 3.3.3 — Los seis efectos + el handler

| # | Tipo | Líneas | Qué hace |
|---|---|---|---|
| E1 | `useEffect` | `:324-332` | Timer de la compuerta inicial: si `isPreloaderDone && !hasInteracted && !isInitialLoadComplete`, agenda `setIsInitialLoadComplete(true)` a los `INITIAL_LOCK_MS` = 700 ms (0 ms bajo reduced motion). Cleanup limpia el timer. |
| E2 | `useEffect` | `:341-349` | Timer del latch por scroll: si `hasInteracted && !isStatic && !isJumping && !shouldReduceMotion`, agenda `setIsStatic(true)` a los `CROSSFADE_MS` = 2000 ms. |
| E3 | `useEffect` | `:355-408` | Registra los tres listeners de gesto (detalle en 3.3.5). Única condición de registro: `!isStatic` (`:356`). |
| E4 | `useLayoutEffect` | `:418-431` | El lock del body (detalle en 3.3.6). |
| E5 | `useLayoutEffect` | `:439-442` | Compensación de scroll del camino crossfade: cuando `isStatic` pasa a true y `jumpedViaButtonRef.current` es false, `window.scrollTo(0, window.innerHeight)`. |
| E6 | `useLayoutEffect` | `:444-482` | Solo al montar (`[]`): recorre los ancestros del contenedor y fuerza a `overflow(-X/-Y): visible` (estilo inline) cualquier ancestro cuyo computed sea `hidden` o `clip`; restaura al desmontar. Existe para que `position: sticky` funcione (nombre de la variable: `hasStickyBlockingOverflow`, `:453`). |
| — | handler | `:484-529` | `handleDiscover`, el camino botón (detalle en 3.3.7). |

**Orden de declaración E4 → E5 es contrato:** en el commit en que `isStatic`
pasa a true, los layout effects corren en ese orden — primero se levanta el
lock, después corre el `scrollTo`. El comentario `:415-417` lo dice textual:
*"Runs as a layout effect so the lock is lifted before the companion
scroll-compensation effect calls `scrollTo` in the same commit."* El propio
archivo trata al lock como bloqueante también del scroll programático: **nunca
llama `scrollTo` con el lock puesto** (el camino botón lo levanta vía
`isJumping` antes de su scroll diferido — 3.3.7).

### 3.3.4 — Diagrama completo de estados y transiciones

Estados alcanzables (sin reduced motion), como conjunción de las variables:

```
S0  PRELOADER      (!isPreloaderDone)                    body LOCKED, listeners inertes
S1  REVELANDO      (done, !initialComplete, !interacted) body LOCKED, gesto cerrado, 0-700ms
S2  ESPERANDO      (done, initialComplete, !interacted)  body LOCKED, gesto ABIERTO
S3  CROSSFADE      (interacted, !jumping, !static)       body LOCKED, timer 2000ms corriendo
S4  SALTANDO       (interacted, jumping, !static)        body LIBRE, scroll manual en curso
S5  ESTATICO       (static)                              terminal: rama estática, sin listeners
```

Transiciones:

| De → A | Disparador | Evidencia |
|---|---|---|
| S0 → S1 | `isPreloaderDone` pasa a true (LoadingScreen / sessionStorage) | `:326` deja de cortar; E1 agenda su timer |
| S1 → S2 | timer E1 a los 700 ms | `:328-329` |
| S2 → S3 | wheel con `deltaY > 0`, o touchmove con arrastre hacia arriba (`touchStartY - touchEndY > 0`); **ese evento recibe `preventDefault`** | `:366-369`, `:384-387` |
| S1 → S4, S2 → S4 | click en DISCOVER (`handleDiscover` no tiene ningún guard de estado) | `:484-490` |
| S3 → S5 | timer E2 a los 2000 ms del gesto | `:344-346` |
| S4 → S5 | `setIsJumping(false)` + `setIsStatic(true)` en el mismo callback (batcheados, un solo commit) a los 400+1600 = 2000 ms del click | `:520-527` |
| S3 → S4 | **inalcanzable**: al entrar a S3 la capa 1 pone `pointerEvents: "none"` (`:578`) y el botón vive adentro de esa capa | `:573-620` |
| S5 → * | **no existe**: `isStatic` nunca vuelve a false; E3 no re-registra (`:356`) | `:310-311` |

Caminos degenerados, también verificados:

- **Click en DISCOVER durante S1 (los primeros 700 ms).** El botón es
  clickeable desde el mount (su `motion.div` arranca en opacity 1 —
  `initial={false}`, `:601-604`). El click dispara S4 con normalidad, y además
  deja **`isInitialLoadComplete` en false para siempre**: E1 se re-ejecuta con
  `hasInteracted` true y corta en `:326` sin re-agendar el timer. Es inerte —
  después de `hasInteracted` nadie consume esa variable con efecto observable
  (`isLocked()` en `:359` solo gobierna el `preventDefault` de un gesto que ya
  no puede disparar nada).
- **Click en DISCOVER durante S3 (crossfade en curso).** Bloqueado por
  `pointerEvents: "none"` de la capa 1 (`:578`). La capa 2 (`:624-635`) pasa a
  `pointerEvents: "auto"` con `hasInteracted`, pero no contiene ningún botón.
- **Gesto durante S4.** Los dos handlers cortan en `isJumping` (`:362`,
  `:377`).
- **Wheel hacia arriba (deltaY < 0) en S2.** No entra al `if` (`:366`); no hay
  preventDefault ni transición; el body sigue locked → no pasa nada. El replay
  hacia arriba está muerto en el origen.
- **Teclado.** No existe listener de `keydown` en el archivo (lectura íntegra:
  los únicos `addEventListener` son `:390-394`). Espacio/PageDown/flechas no
  disparan la crossfade; con el body locked tampoco scrollean. **El único
  camino de teclado es el botón** (`as="button"`, focuseable).
- **Recarga a mitad de sesión** (`sessionStorage` ya en "1"):
  `isPreloaderDone` pasa a true apenas monta el provider → S0 dura un frame y
  los 700 ms corren desde ahí. La máquina no cambia de forma.

**Rama reduced motion** (`shouldReduceMotion === true`): el render va directo
a la rama estática (`:542`), el body nunca se lockea (`:419`), E1 corre con
delay 0, E2 corta (`:342`). Pero **E3 igual registra los listeners** — su única
condición es `!isStatic` (`:356`) e `isStatic` es false — y `isLocked()`
devuelve false (`:359`), así que **el primer wheel hacia abajo (o primer
swipe) del montaje recibe `preventDefault` y setea `hasInteracted`**
(`:366-369`, `:384-387`) sin ningún efecto visual: un evento de scroll perdido
por montaje, para usuarios con reduced motion. Después de ese primer evento
`hasInteracted` queda true y los handlers no vuelven a prevenir. Hallazgo menor
nuevo de esta sesión.

### 3.3.5 — Censo completo de listeners

Registrados en E3 (`:390-394`), removidos en su cleanup (`:396-400`) — o sea
re-registrados en cada cambio de deps (`:401-408`) y removidos para siempre
cuando `isStatic` pasa a true:

| Evento | Target | Opciones | Handler | ¿`preventDefault`? |
|---|---|---|---|---|
| `wheel` | `window` | `{ passive: false }` | `:361-370` | Sí, bajo la conjunción exacta de abajo |
| `touchstart` | `window` | `{ passive: false }` | `:372-374` | **Nunca** — solo guarda `touchStartY` |
| `touchmove` | `window` | `{ passive: false }` | `:376-388` | Sí, misma conjunción con `deltaY = touchStartY - touchEndY` |

**Conjunción exacta del `preventDefault`** (idéntica para wheel y touchmove):
`!isStatic` (E3 registrado) ∧ `!isJumping` ∧ `isPreloaderDone` ∧
(`isInitialLoadComplete` ∨ `shouldReduceMotion`) ∧ `!hasInteracted` ∧
delta hacia abajo. Se cumple **a lo sumo una vez por montaje**: el mismo evento
que la cumple setea `hasInteracted`.

Fuera de E3: `onMouseMove`/`onMouseLeave` por imagen flotante (React,
`:208-209`) para la repulsión, y el `onClick` del botón (`:616`). En el archivo
no hay listeners de `scroll`, `resize` ni `keydown`.

### 3.3.6 — El lock del body: aplicación y liberación EXACTAS

E4, `:418-431`:

```ts
  useLayoutEffect(() => {
    if (isStatic || isJumping || shouldReduceMotion) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    } else {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isStatic, isJumping, shouldReduceMotion]);
```

- **Se aplica** en el primer commit del montaje (las tres variables arrancan
  false) y en cada commit donde `isStatic ∨ isJumping ∨ shouldReduceMotion`
  sea false.
- **Se libera** en el primer commit donde esa disyunción es true. En la
  historia real de un montaje eso ocurre exactamente una vez, por uno de tres
  caminos: `isJumping = true` (click del botón, S4 — y ahí queda liberado,
  porque S4 termina en `isStatic = true`), `isStatic = true` (timer del camino
  scroll, S3→S5), o `shouldReduceMotion` true desde el arranque. También se
  libera en el cleanup de desmontaje (`:427-430`) — navegar fuera de
  `/services` a mitad de intro no deja el body bloqueado.
- **Dos precisiones sobre "el lock de 700 ms" de la instrucción:** los 700 ms
  de `INITIAL_LOCK_MS` **no liberan este lock**. Liberan la *compuerta de
  gesto* (`isInitialLoadComplete`, vía `isLocked()` `:359`): a los 700 ms el
  usuario ya puede disparar la crossfade, pero `document.body.style.overflow`
  sigue en `"hidden"` durante toda la crossfade y se libera recién con el
  latch (`isStatic`) o el salto (`isJumping`). La cadena completa:
  `TITLE_1_LINE_COUNT` → 700 ms de compuerta → gesto → 2000 ms de crossfade →
  `isStatic` → liberación del body.
- **`paddingRight` es inerte.** `--scrollbar-width` no está definida en ningún
  archivo de `src/` (grep: la única otra aparición de "scrollbar-width" es la
  propiedad CSS `scrollbar-width: none !important` de `globals.css:61`, que es
  otra cosa). El fallback `0px` aplica siempre. Coherente: con las scrollbars
  ocultas globalmente (`globals.css:59-66`) no hay gutter que compensar.

### 3.3.7 — El camino botón, con sus números

`handleDiscover` (`:484-529`): `jumpedViaButtonRef.current = true` →
`setIsJumping(true)` (**esto libera el lock del body en ese mismo commit**, vía
E4) → `setHasInteracted(true)` → a los **400 ms**, scroll manual por `rAF`
hacia `document.getElementById("services-list")` con `headerOffset = 140`,
`duration = 1000` ms y easing cuadrático in-out escrito a mano (`:503-515`) →
a los **400+1600 = 2000 ms** del click, `setIsJumping(false)` +
`setIsStatic(true)` en un solo commit.

- El destino se calcula **en vivo** con `getBoundingClientRect()` (`:496-497`)
  — robusto a cambios de layout debajo del intro.
- Guard `if (target)` (`:494`): si el id `services-list` no existe, **no hay
  scroll pero el latch ocurre igual** a los 2000 ms — el usuario queda parado
  en `scrollY 0` viendo el bloque 1 de la rama estática. Silencioso.
- `jumpedViaButtonRef` hace que E5 no corra (`:440`): el botón es dueño de la
  posición final; la compensación de `innerHeight` es solo del camino scroll.
- Durante S4 las **dos** capas del intro van a opacity 0 (`:577` y `:628`
  cortan por `isJumping`): el viewport scrollea sobre la pantalla sticky en
  blanco (`bg-off-white`) hasta salir de los 200vh.

## 3.4 — `TITLE_1_LINE_COUNT`: rastreo completo y qué pasa con 4 líneas

### La cadena de consumo, exhaustiva

Grep repo-wide: la constante aparece **exactamente 3 veces**, todas en
`ServicesIntro.tsx` (`:68` definición, `:72`, `:86`). Ningún otro archivo la
consume. (`Hero.tsx:11` tiene su gemela `TITLE_LINE_COUNT` — nombre distinto,
mismo patrón, ya registrada en A.9 y 2.c.)

```
TITLE_1_LINE_COUNT = 3                                   (:68, literal — NO lines.length)
 ├─► CTA_DELAY = 0.12 + 0.08×(3-1) + 0.42 = 0.70 s       (:71-72)
 │    └─► CTA_UNDERLINE_DELAY = 0.70 + 0.45 = 1.15 s     (:73)   ← único consumidor de CTA_DELAY
 │         └─► underlineDrawDelay del HoverButton         (:615)  ← único consumidor runtime
 │              └─► delay del draw scaleX 0→1 del subrayado, duración 2.5 s
 │                  (HoverButton.tsx:97-106) → el subrayado termina a los 3.65 s
 └─► TEXT1_REVEAL_MS = 700 ms                            (:85-87)
      └─► INITIAL_LOCK_MS = TEXT1_REVEAL_MS              (:88)   ← único consumidor
           └─► delay del timer E1 (compuerta de gesto)   (:328)  ← único consumidor
```

**Dos sumideros runtime, nada más:** (a) el delay del subrayado del CTA
(1.15 s), (b) la compuerta de gesto (700 ms). La constante **no** gobierna la
aparición del botón (el botón está en opacity 1 desde el mount,
`initial={false}` `:603`), **no** toca a `TEXT2_DELAY_CHILDREN` (`:75` — es
`TITLE_DELAY + FADE_OUT_TIME`, sin conteo), y **no** participa del lock del
body (3.3.6).

El desacople estructural: la constante vive en `:68` a nivel módulo; el
arreglo real de líneas vive dentro de `Text1Lines` en `:250-254`, 182 líneas
más abajo. **Nada los liga** — ni `lines.length`, ni un test, ni un tipo.

### Si el arreglo pasa a 4 líneas y la constante queda en 3 (el escenario ES)

Los delays por línea son `delayBase + index × 0.08` con duración 0.42
(`RevealLine`, `:121-125`): la línea 4 anima de 0.36 s a **0.78 s**. Contra
eso:

1. **La compuerta de gesto abre a los 700 ms, 80 ms antes de que la línea 4
   termine.** Un gesto en esa ventana dispara la crossfade con el reveal a
   medio hacer: la capa 1 arranca su fade-out de 1 s con la línea 4 todavía
   subiendo. No hay traba ni estado inconsistente — es glitch visual y
   violación del contrato escrito en el comentario `:80-84` (*"the
   initial scroll-lock holds only until text 1's LINES have finished
   revealing"*).
2. **El subrayado queda desincronizado de la intención, no roto:** arranca a
   los 1.15 s, que sigue siendo después de 0.78 s. Con la constante corregida
   a 4 los valores pasan a: compuerta 780 ms, subrayado 1.23 s.
3. Nada más cambia: el latch de 2000 ms, el lock del body, la rama estática y
   `Text2Lines` no dependen del conteo del texto 1.

Caso inverso (constante 4, arreglo 3): compuerta 780 ms (80 ms de sobra) y
subrayado 1.23 s. Solo cosmético.

**El texto 2 no tiene constante pero tiene un techo:** su última línea (índice
3) termina en 1.12 + 0.24 + 0.42 = **1.78 s**, con **220 ms de margen** contra
el latch de 2000 ms. Con 5 líneas el margen baja a 140 ms, con 6 a 60 ms, y
**con 7 líneas (2.02 s) el latch pisa el reveal**. El pisotón no congela nada:
la rama estática renderiza las líneas como spans planos ya visibles —
`<Text1Lines reduceMotion active />` y `<Text2Lines reduceMotion active />`
(`:550`, `:556`) pasan `reduceMotion={true}` — así que un reveal en vuelo
salta a su estado final en el swap.

## 3.5 — El contrato de altura: qué lo sostiene y qué lo rompe

### Las piezas que lo sostienen, enumeradas

1. **Dos literales JSX idénticos.** `className="relative h-[200vh] w-full
   -mt-[var(--header-height)]"` en `:545` (rama estática) y `:569` (rama
   intro). **Es duplicación textual, no una constante compartida**: el
   contrato existe por convención, y cualquier edición a una sola de las dos
   líneas lo rompe sin aviso de compilador.
2. **`h-[200vh]` es altura fija, no mínima.** La altura del contenedor no
   depende del contenido en ninguna rama: los hijos no pueden agrandarla.
3. **El interior suma exacto.** Rama estática: dos bloques `h-screen` en flujo
   (`:548`, `:553`) = 200vh justos. Rama intro: un solo `sticky top-0
   h-screen` (`:572`) — sticky no agrega altura.
4. **`-mt-[var(--header-height)]` cancela el `pt-[var(--header-height)]` del
   `<main>` del shell** (`(site)/layout.tsx:17`). Entre medio no hay padding
   ni borde que corte el colapso de márgenes: `div.min-h-0` (`template.tsx:12`),
   el `motion.div` de template (`:13-20`) y el `<main
   class="overflow-visible">` de la página (`ServicesPageClient.tsx:28`).
   Resultado: **el intro ocupa el rango [0, 200vh] del documento y
   `ServicesStack` empieza exactamente en 200vh, en las dos ramas.** Cambiar
   `--header-height` no rompe nada de esto: `pt` y `-mt` usan la misma
   variable y se cancelan a cualquier valor.
5. **El invariante oculto del camino scroll:** E5 (`window.scrollTo(0,
   window.innerHeight)`, `:441`) da por sentado que el tope del bloque 2 está
   a exactamente 1 × `innerHeight` del origen del documento — que vale
   **solo** mientras el intro arranque en y = 0 (pieza 4).
6. **El camino botón no asume nada de altura:** recalcula el destino en vivo
   (`:496-497`). Su única dependencia es que exista `id="services-list"`
   (`ServicesStack.tsx:93`; único otro uso: `ServicesIntro.tsx:493`).

### Qué cambio de layout lo rompe

- **Editar la clase del contenedor en una sola rama** (la fragilidad número
  uno: son dos strings duplicados).
- **Cambiar la suma interna de la rama estática** (bloques que no sumen
  200vh): el contenedor no cambia de alto — el desajuste aparece como banda
  vacía o como desborde visual del segundo bloque sobre el stack (el bloque 1
  no tiene `overflow-hidden`; el 2 sí, `:553`).
- **Pasar `h-[200vh]` a `min-h` o `h-auto`**: la altura pasa a depender del
  contenido y las dos ramas dejan de estar garantizadas iguales.
- **Insertar contenido en flujo ANTES del intro** (adentro del main de la
  página): corre el intro hacia abajo, invalida el ancla y = 0 y **rompe E5**
  — el swap del camino scroll aterriza corrido. También desarma la cancelación
  visual del `-mt`.
- **Quitar o renombrar `id="services-list"`**: el botón deja de scrollear en
  silencio (guard `:494`) y el latch deja al usuario parado en el bloque 1.

### ¿Agregar contenido DEBAJO del intro lo afecta? — NO, con evidencia

El contenido que se agregue después del cierre del contenedor del intro (entre
`<ServicesIntro />` y `<ServicesStack />`, o reemplazando al stack) **no
participa del contrato**:

- La altura del intro es fija por unidades de viewport — los hermanos no la
  retroalimentan (pieza 2).
- Las dos ramas siguen midiendo lo mismo, así que el swap sigue sin mover a
  ningún hermano, sea cual sea el hermano.
- E5 apunta adentro del intro (`innerHeight`), independiente de lo de abajo.
- El botón recalcula su destino en vivo; con contenido nuevo entre intro y
  stack el salto aterriza igual sobre `#services-list` (más abajo, pero
  exacto).
- Los dos `ScrollTrigger` del stack miden sus posiciones contra el layout real
  en su creación (montaje) y se recalculan en cada `ScrollTrigger.refresh()`
  — el único programado es el de los colapsos (`ServiceItem.tsx:165-167`).
  **Contenido estático presente desde el montaje queda medido bien; contenido
  insertado dinámicamente después del montaje corre por cuenta de un
  `refresh()` que hoy nadie más dispara.**

**DESCONOCIDO acotado:** E5 iguala `window.innerHeight` con la altura rendida
de `h-screen` (100vh). En desktop con scrollbars ocultas coinciden; en móviles
con barra de URL dinámica la relación 100vh ↔ `innerHeight` depende del
navegador y **no se midió**. El código no contempla divergencia.

## 3.6 — El menú lateral sticky nuevo: terreno verificado

### 3.6.1 — Operabilidad durante el intro, con el body bloqueado

Hechos, en orden:

1. **Durante todo el intro el viewport está clavado en scrollY 0** —
   `scrollTo(0, 0)` al montar (`ServicesPageClient.tsx:24`) y body `overflow:
   hidden` (E4). Lo único en pantalla es la **pantalla sticky opaca del
   intro** — `sticky top-0 h-screen w-full bg-off-white z-10` (`:572`) — más
   el Navbar (`fixed ... z-[100]`, `Navbar.tsx:265`). Todo lo que esté en
   flujo debajo del intro vive de 200vh para abajo: **fuera del viewport
   durante el intro, sin excepción**.
2. Un elemento `position: sticky` se reposiciona con el scroll de su
   contenedor de scroll. Con el body bloqueado no hay scroll → un sticky
   montado queda clavado donde el layout inicial lo puso. Los eventos de
   puntero sobre él siguen vivos: nada los deshabilita globalmente (los
   `pointerEvents: "none"` del intro son de sus capas internas, `:578` y
   `:629`).
3. **Scroll programático bajo el lock: el propio archivo lo evita siempre.**
   E4 corre antes que E5 en el mismo commit para que el `scrollTo` llegue con
   el lock ya levantado (comentario `:415-417`), y el botón levanta el lock
   vía `isJumping` **antes** de su scroll diferido 400 ms (`:489`, `:492`). Un
   control nuevo que necesite scrollear durante el intro tiene un solo
   precedente en el repo, y es ese: **liberar primero (camino `isJumping`),
   scrollear después.**
4. Consecuencia verificable de 1-3, sin diseñar nada: durante el intro un menú
   lateral montado en el flujo de la página **no está en pantalla**; para
   estar en pantalla durante el intro tiene que vivir dentro de (o sobre) la
   pantalla sticky del intro, por encima de su `z-10`; y para que un click
   suyo scrollee antes del latch tiene que pasar por una liberación tipo
   `isJumping`. Después del latch, nada de esto aplica: la ruta queda en
   scroll nativo con sticky probado (3.6.2).

### 3.6.2 — El terreno sticky de la ruta, post-intro

- **Precedente funcionando en la misma ruta:** los headers de cada
  `ServiceItem` son `sticky top-[115px] z-40` (todos salvo el último —
  `ServiceItem.tsx:68-70`) y operan sobre el scroll nativo.
- **Sostén del sticky, ya construido:** `overflow-visible` explícito en el
  main de la página (`ServicesPageClient.tsx:28`) y en el root del stack
  (`ServicesStack.tsx:91`); `template.tsx` transiciona solo opacidad
  (`:13-20`, commit `b634521`); y E6 (`:444-482`) fuerza `overflow: visible`
  en cualquier ancestro `hidden`/`clip` al montar el intro.
- **Constraint para `fixed` (no para sticky):** cada `article` del stack va
  envuelto en `RevealOnScroll` — un `motion.div` que anima transform
  (`y: 24 → 0`, `RevealOnScroll.tsx:31-44`). El preview de hover de
  `ServiceItem` es `fixed` y se **portalea a `document.body`**
  (`:292-335`, `createPortal`): ese portal es el precedente del repo para
  posicionar `fixed` desde adentro de subtrees con transform.
- Offsets hoy acoplados al header de 128px (`globals.css:10`), para tener a la
  vista en el rediseño: **104** (`ServicesStack.tsx:66`, start del trigger),
  **115** (`ServiceItem.tsx:70`, sticky top), **128** (`ServiceItem.tsx:151`,
  end del trigger), **140** duplicado (`ServicesIntro.tsx:495` headerOffset y
  `ServicesStack.tsx:95` `scroll-mt-[140px]`).

### 3.6.3 — Censo exhaustivo de observadores (cierra el PENDIENTE de A.11)

Grep repo-wide sobre `src/` de `IntersectionObserver`, `useInView`,
`whileInView`, `useScroll`, `useTransform`, `ScrollTrigger` y `sticky`.
Resultado completo:

| Técnica | Ubicación | Config | ¿Scroll-spy continuo? |
|---|---|---|---|
| GSAP `ScrollTrigger` | `ServicesStack.tsx:64-74` | trigger = último item, `start: "top 104px"`, `once: true`, `onEnter` → `hasReachedEnd` + abre el último | NO — latch de un disparo |
| GSAP `ScrollTrigger` | `ServiceItem.tsx:148-170` | por item (no el último), `start: "top bottom"`, `end: () => "bottom 128px"`, `invalidateOnRefresh: true`, `once: true`, `onLeave` → colapso + `scrollBy` + `refresh()` | NO — latch de un disparo |
| `useInView` (Framer) | `RevealOnScroll.tsx:28` | `once: true, margin: "-80px"` | NO |
| `useInView` (Framer) | `WorkGrid.tsx:27` | `once: true, margin: "-80px"` | NO |
| `useTransform` (Framer) | `FunGallery.tsx:360-364` | parallax de **mouse**, no de scroll | NO |

- `IntersectionObserver` directo: **0 usos** en `src/`.
- `useScroll`: **0 usos**. `whileInView`: **0 usos**.
- `position: sticky`, censo completo (5 sitios): `ServicesIntro.tsx:572`,
  `ServiceItem.tsx:70`, `ContactForm.tsx:539`
  (`lg:sticky lg:top-[calc(var(--header-height)+3.5rem)]`),
  `ProjectDetailClient.tsx:36` (`md:sticky md:top-48`),
  `TeamSection.tsx:86` (`md:sticky md:top-24`).

**Conclusión del censo: en el repo NO existe ningún scroll-spy continuo** —
nada reporta "sección actual" mientras se scrollea. Lo más cercano a estado de
sección es el acordeón del stack: `activeAccordionId` + `hasReachedEnd`
(`ServicesStack.tsx:46-53`) y el `hasBeenPassed` por item
(`ServiceItem.tsx:61`), todos alimentados por los dos latches de un disparo.
Un indicador de sección continuo es **sistema nuevo sí o sí**; las primitivas
ya presentes en la ruta para construirlo sin agregar dependencias son GSAP
`ScrollTrigger` (ya registrado en los dos archivos del stack) y `useInView` de
Framer. La advertencia de la instrucción ("no queremos un cuarto sistema
paralelo") refiere a los tres sistemas de **reveal** del Bloque 6.3 — un
scroll-spy no duplica a ninguno de los tres, pero elegir GSAP o Framer para
hacerlo define al lado de cuál de los dos motores queda.

## 3.7 — El catálogo de Services: origen y forma exacta

### Origen

Array literal hardcodeado en el server component:
`src/app/(site)/services/page.tsx:11-170`, tipado `ServiceContent[]` con el
tipo importado del componente (`page.tsx:2` ← `ServicesStack.tsx:11-17`), y
pasado al cliente en `:172-174`. Los imports del archivo son exactamente 3
(`:1-3`: `Metadata`, el tipo, `ServicesPageClient`) — **cero rastro de
Sanity**. La `metadata` de la ruta (`:5-9`): título
`"Services - ESQUINA ESTUDIO(TM)"` — con `(TM)` ASCII, no `™` — y description
propia.

### El tipo y las 6 entradas

```ts
export interface ServiceContent {          // ServicesStack.tsx:11-17
  id: string;
  name: string;
  description: string;
  note?: string;
  items: Array<string | { main: string; subs?: string[] }>;
}
```

| `id` | `name` | items | forma de items |
|---|---|---|---|
| `"01"` | BRAND ESSENTIALS | 6 | todos `{main, subs}` con subs pobladas |
| `"02"` | BRAND UNIVERSE | 10 | 5 `{main, subs}` pobladas + 4 con `subs: []` (`:96-99`) + 1 poblada |
| `"A.S/01"` | MOTION GRAPHICS | 8 | strings planos |
| `"A.S/02"` | PACKAGING | 4 | strings planos |
| `"A.S/03"` | EDITORIAL | 9 | strings planos |
| `"A.S/04"` | ILLUSTRATION | 8 | strings planos |

**`note` es un campo muerto en los datos:** declarado en el tipo, renderizado
si existe (`ServiceItem.tsx:363-370`), y **ninguna de las 6 entradas lo
carga**.

**Los `id` llevan semántica de layout, en 4 puntos:**

1. `isDark = service.id.startsWith("A.S")` — `ServiceItem.tsx:63` **y**
   `ServicesStack.tsx:107` (fondo negro, una sola columna de items).
2. `service.id === "A.S/01"` inserta el divisor "ADDITIONAL SERVICES" antes de
   ese item — `ServicesStack.tsx:114-125`.
3. `isSectionCloser = service.id === "02" || isLast` — `ServiceItem.tsx:64`
   (padding y línea de cierre de sección).
4. Solo los packs claros parten items en dos columnas: `slice(0, 5)` /
   `slice(5)` — `ServiceItem.tsx:71-72`. Los A.S van todos en una.

### Censo de `\n` manuales

En `description`:

- `"01"` (`:16`): 2 saltos → 3 líneas cortadas a mano.
- `"02"` (`:64`): incluye la cola `"... evolve. \n \n \n (*)ITEMS EXCLUSIVE
  \nTO THIS PACK"` — **líneas cuyo contenido es un solo espacio**, que con
  `pre-line` rinden como líneas en blanco antes del disclaimer.
- Los 4 A.S (`:116`, `:131`, `:142`, `:158`): párrafos separados por `\n\n` y
  cortes de línea manuales dentro de cada párrafo (el texto entero está
  cortado a mano, no solo el final).

En `items` (solo pack `"02"`):

- `"Basic brand usage guide for\nconsistent and correct\nimplementation\n(Approximately 40–60 pages)"` (`:93`) — su equivalente del pack `"01"` (`:44`) va **sin** `\n`: asimetría deliberada o accidental entre packs.
- `"6 Custom Brand Applications\nof Choice (*)"` (`:101`).
- `"Instagram Post Design\n(first publication)"` (`:106`).

**Qué convierte los `\n` en saltos reales:** `whitespace-pre-line` en 5 sitios
de `ServiceItem.tsx` — description `:358`, note `:365`, main `:104`, subs
`:115`, item string `:130`. Sin esas clases los `\n` colapsan a espacio.

Caracteres no-ASCII en los datos: `’` (U+2019) en los A.S (`:131`, `:142`,
`:158`), `–` (en dash) en los rangos de páginas (`:44`, `:93`), `—` (em dash)
en `:116`. Son strings planos — sin entidades HTML ni markup (la entidad
`&rsquo;` del censo 2.c está en `Text2Lines` del intro, no en el catálogo).

### El centinela `"Applications may include:"` — mecánica completa

- **Definición única:** `ServiceItem.tsx:73` (`const applicationsLabel`).
- **Detección:** `service.description.includes(applicationsLabel)` (`:74`).
- **Strip:** `:75-80` — remueve primero `"\n\n" + label`, después el label
  pelado, y hace `trimEnd()`. El resultado (`cleanDescription`) es lo que se
  renderiza como descripción (`:361`).
- **Re-render:** el label vuelve a aparecer como encabezado de la columna de
  items (`:374-378`), solo si fue detectado.
- **Presencia en los datos:** al final de las 4 descriptions A.S (`page.tsx:116`,
  `:131`, `:142`, `:158`), siempre precedido por `\n\n`. Los packs `"01"` y
  `"02"` no lo tienen → su columna de items va sin encabezado.
- Es un **contrato por string literal entre el archivo de datos y el
  componente**: si la description traducida no contiene el literal exacto, la
  detección da false, el texto completo (incluido el centinela traducido)
  queda dentro de la descripción y la columna pierde el encabezado. Riesgo ya
  formulado en 2.c; acá queda el mecanismo con líneas.

### Acoples salientes del catálogo

- **Hacia Contact:** cada header lleva `REQUEST FORMAL QUOTE` con
  `href = /contact?service=${encodeURIComponent(service.name.toLowerCase())}`
  (`ServiceItem.tsx:81-83`). Lo consume `contact/page.tsx:11-16` (searchParam
  `service`, guard string) y lo recibe `ContactForm` como prop (`:27`). **Los
  6 `name` del catálogo son valores de ese contrato.**
- **Imágenes del stack:** `SLIDESHOW_IMAGES` (`ServiceItem.tsx:39-44`) — 4
  archivos locales de `/public/projects/` (`akasha.png`, `tukumi.jpg`,
  `romar.jpg`, `matsu.png`) compartidos por el preview de hover (`:314-328`)
  y el panel abierto (`:396-413`), rotando cada 2000 ms mientras el item está
  abierto o con hover (`:176-186`).
- Strings de UI del stack fuera del catálogo (ya contados en 2.c):
  `BRANDING PACK OPTIONS` (`ServicesStack.tsx:99`), `ADDITIONAL SERVICES`
  (`:118`), `[ CLICK SERVICE TO TOGGLE ]` (`:38`),
  `[ SCROLL TO END TO UNLOCK ]` (`ServiceItem.tsx:273`),
  `REQUEST FORMAL QUOTE` (`:288`), los `alt` template (`:323`, `:407`).

### Hallazgo de arranque del stack

Al montar la página, **los 6 items nacen expandidos**: `isEffectivelyOpen =
hasReachedEnd ? activeAccordionId === id : !hasBeenPassed`
(`ServiceItem.tsx:65-67`) y `hasBeenPassed` arranca false. Con eso, **los 6
intervalos de slideshow de 2000 ms corren desde el montaje**
(`:176-186`) — también durante el intro bloqueado, debajo del fold.

## 3.8 — Qué debe sobrevivir al rediseño (actualiza y reemplaza A.10)

| # | Elemento | Ubicación | Nota |
|---|---|---|---|
| 1 | La máquina del intro completa (estados, efectos, lock, listeners) | `ServicesIntro.tsx:302-529` | La instrucción: el intro se conserva entero |
| 2 | Timings espejo de Hero + `RevealLine` | `:58-89` (constantes), `:98-130` | Comentarios `:62-63` y `:91-97` explican el espejo y por qué NO usa `staggerChildren` |
| 3 | `Text1Lines` / `Text2Lines` (cortes manuales) | `:243-300` | Cat. 2 del censo 2.c; acoplados a `TITLE_1_LINE_COUNT` (3.4) |
| 4 | Crossfade de dos capas + espejo estático exacto | `:573-586`, `:624-635` (capas); `:531-561` (estática) | El espejo es la mitad del contrato del swap |
| 5 | `FLOATING_MEDIA` + repulsión al cursor | `:20-56`, `:134-233` | 7 archivos locales de `/public/projects/`; radio 100 px, push 80 px, spring `{50, 15, 0.5}` |
| 6 | Contrato de altura + compensación | `:545`, `:569`, `:439-442` + `(site)/layout.tsx:17` | Piezas e invariantes en 3.5 |
| 7 | `prefers-reduced-motion` | `:113-115`, `:304-305`, `:328`, `:342`, `:359`, `:419`, `:542`, `:550`, `:556` | Cae directo a la rama estática; con el hallazgo del primer gesto tragado (3.3.4) |
| 8 | Gating por preloader | `:303`, `:326`, `:363`, `:378`, `:577`, `:595`, `:613-614` + `PreloaderProvider.tsx:12,38-54` | `isPreloaderDone` es monotónica; sessionStorage `esquina:preloaderShown` |
| 9 | Mecánica del DISCOVER (a heredar por el indicador de scroll) | `:484-529`; `HoverButton` en `:610-619`; draw del subrayado `HoverButton.tsx:97-108` | Destino `id="services-list"` (`ServicesStack.tsx:93`) + `scroll-mt-[140px]` (`:95`); el patrón "liberar lock vía `isJumping` antes de scrollear" es el precedente para cualquier control nuevo del intro |
| 10 | Catálogo completo + centinela + `pre-line` | `page.tsx:11-170`; `ServiceItem.tsx:73-80`, `:358`, `:365`, `:104`, `:115`, `:130` | Incluye la semántica de los `id` (3.7) |
| 11 | Acople `/contact?service=` | `ServiceItem.tsx:81-83`; `contact/page.tsx:11-16`, `:27` | Los 6 `name` son valores del contrato |
| 12 | Sostén del sticky (guard + cadena overflow-visible + template solo-opacidad) | `ServicesIntro.tsx:444-482`; `ServicesPageClient.tsx:28`; `ServicesStack.tsx:91`; `template.tsx:12-20` | Terreno del sidebar nuevo (3.6.2) |
| 13 | `scrollRestoration` manual + arranque en 0 | `ServicesPageClient.tsx:19-25` | Sin esto el swap y la máquina arrancan de un scroll no determinista |
| 14 | Los dos `ScrollTrigger` + el acordeón del stack | `ServicesStack.tsx:46-53`, `:55-88`; `ServiceItem.tsx:61-67`, `:141-174`, `:176-209` | Es la zona que el rediseño de packs reemplaza; si se tira, se tira completa (colapso + `scrollBy` de compensación + `refresh()` incluidos) |
| 15 | `HoverButton` compartido | Bloque 6.1 | 11 call sites en 6 archivos — no modificarlo desde Services |

## HECHOS VERIFICADOS — Bloque 3

- Los 4 supuestos de la instrucción se confirman contra el código; la parada condicional no se activó (3.0).
- La máquina tiene 4 estados `useState` + 1 ref + 2 entradas, 6 efectos y 1 handler; 6 estados alcanzables (S0-S5) y S5 es terminal — `isStatic` nunca vuelve atrás (`:310-311`).
- **Liberación del lock del body, exacta:** `isStatic || isJumping || shouldReduceMotion` (`:419`), más el cleanup de desmontaje. Los 700 ms de `INITIAL_LOCK_MS` abren la **compuerta de gesto**, no el body: el `overflow: hidden` dura hasta el latch (camino scroll: gesto + 2000 ms) o hasta el click del botón (`isJumping`).
- `TITLE_1_LINE_COUNT` tiene exactamente 3 apariciones en el repo, todas en `ServicesIntro.tsx`, y desemboca en exactamente 2 sumideros runtime: la compuerta de 700 ms (`:328`) y el delay del subrayado del CTA (`:615` → `HoverButton.tsx:103`). Con 4 líneas y constante en 3: compuerta abre 80 ms antes del fin del reveal (ventana de glitch), subrayado desincronizado; nada se traba.
- El contrato de altura lo sostienen dos literales JSX duplicados (`:545`/`:569`), la altura fija por vh y la cancelación `pt`/`-mt` con el shell; el camino scroll suma el invariante "intro en y=0" por el `scrollTo(0, innerHeight)` de E5. Contenido nuevo debajo del intro NO lo afecta; contenido antes del intro lo rompe.
- Lenis no corre en `/services` (`SmoothScrollProvider.tsx:13-15`, `:29-34`); el scroll es nativo, con `scrollBehavior` forzado a `"auto"` inline, `scrollRestoration` manual sin restaurar al salir, y scrollbars ocultas globales.
- En todo `src/` hay **0** `IntersectionObserver` directos, **0** `useScroll`, **0** `whileInView`; los 2 `ScrollTrigger` y los 2 `useInView` son latches `once: true`. **No existe scroll-spy continuo reutilizable**; el sidebar necesita uno nuevo.
- Durante el intro lo único visible es la pantalla opaca `z-10` del intro + el Navbar `z-[100]`; un sticky en flujo debajo del intro queda fuera del viewport y sin scroll que lo opere. El precedente interno para scrollear durante el intro es liberar el lock vía `isJumping` primero (patrón del DISCOVER).
- Catálogo: array literal de 6 entradas en `page.tsx:11-170`, sin Sanity; `\n` manuales en 6 descriptions y 3 items, rendidos por `whitespace-pre-line` en 5 sitios de `ServiceItem`; centinela `"Applications may include:"` como contrato por literal entre datos y componente (definido/consumido en `ServiceItem.tsx:73-80`, presente en las 4 descriptions A.S); `id`s con semántica de layout en 4 puntos; `note` declarado y nunca poblado.
- Hallazgos nuevos de esta sesión: `<main>` anidado en `/services` (`ServicesPageClient.tsx:28` dentro de `(site)/layout.tsx:17`); primer gesto tragado bajo reduced motion (E3 solo chequea `isStatic`); `isInitialLoadComplete` queda false para siempre si el botón se clickea en los primeros 700 ms (inerte); `paddingRight` del lock inerte (`--scrollbar-width` indefinida); los 6 items del stack nacen expandidos con 6 intervalos de slideshow corriendo desde el montaje; capa 1 del intro con `pointerEvents: "auto"` en opacity 0 mientras corre el preloader (`:577-578`).

## DESCONOCIDO — Bloque 3

1. **Equivalencia `100vh` (h-screen) ↔ `window.innerHeight` por dispositivo.** E5 (`:441`) la da por hecha; en móviles con UI de navegador dinámica no se midió. Afecta dónde aterriza el swap del camino scroll en móvil.
2. **El `<title>` final compuesto de `/services`.** El page declara `"Services - ESQUINA ESTUDIO(TM)"` y el root declara template `"%s | ESQUINA ESTUDIO™"` (`layout.tsx:21`); el resultado rendido (posible marca duplicada `(TM)... ™`) no se midió — requiere dev server o build.
3. **Si Framer deja `transform: none` en reposo** en los wrappers de `RevealOnScroll` (afecta solo a descendientes `fixed` no portaleados; el repo ya esquiva el problema con el portal de `ServiceItem`). No medido en runtime.
4. **Comportamiento ante toggle de `prefers-reduced-motion` a mitad de intro.** `useReducedMotion` es reactivo y el render salta de rama en vivo; la secuencia exacta de efectos en ese salto no se ejercitó.

## RIESGOS PARA LO QUE VIENE — Bloque 3

- **El contrato de altura es duplicación textual sin constante compartida.** El rediseño va a editar exactamente ese archivo; tocar una rama y no la otra reintroduce el salto del swap sin ningún error de build. Primer candidato a extraer a constante única el día que se toque el archivo (no en esta auditoría).
- **`TITLE_1_LINE_COUNT` no está ligado al arreglo.** El paso a español (+15-25 % de largo, riesgo ya medido en 2.c) convierte el desfase en real: compuerta abierta con el reveal a medio hacer. Convertir la constante en `lines.length` es un cambio de una línea con dos sumideros conocidos (3.4).
- **El botón-indicador hereda tres dependencias implícitas:** el destino `id="services-list"` (si el rediseño lo renombra, el salto muere en silencio por el guard `:494`), el `headerOffset = 140` duplicado con `scroll-mt-[140px]`, y el patrón `isJumping` para scrollear con el lock puesto.
- **El sidebar sticky no tiene nada que reutilizar como spy** — todo lo existente es `once: true`. Construirlo con GSAP o con Framer define al lado de qué motor queda el cuarto sistema de scroll de la ruta; hoy la ruta ya corre GSAP (stack) + Framer (intro/reveal) + scroll manual (DISCOVER).
- **Durante el intro el sidebar no existe en pantalla** salvo que se monte dentro de la pantalla sticky del intro por encima de `z-10` — y ahí cualquier click que scrollee necesita la liberación previa del lock. La alternativa (aparecer recién en modo estático) no toca la máquina.
- **La traducción del catálogo rompe el centinela y el query param a la vez:** `"Applications may include:"` es contrato por literal (3.7) y los 6 `name` alimentan `/contact?service=` (3.7). Traducir datos sin tocar `ServiceItem.tsx:73` y el lado Contact deja columnas sin encabezado y params en español contra un form que los espera de alguna forma.
- **Los 6 slideshows corriendo desde el montaje** son costo de fondo del stack actual; si el rediseño de packs conserva el patrón de slideshow, conviene gatearlo por visibilidad en la corrida del rediseño (hoy no lo está).

---

# SESIÓN 6 — PARADA CONDICIONAL ACTIVADA  `[Bloque 5 NO corrido — 2026-08-14]`

## Qué se frenó y por qué

La instrucción de la sesión pedía el Bloque 5 completo con Contact como
prioridad, y dentro de Contact preguntaba textualmente **"qué crea el scroll
interno hoy (alturas y overflow del `<main>` y del contenedor)"** — dando por
sentada la arquitectura que `CLAUDE.md` §8.1 describe como causa raíz: un
`<main>` de Contact con `overflow-hidden` +
`h-[calc(100svh-var(--header-height))]` que crea el scroll interno del form.

**Esa arquitectura no existe en HEAD.** Fue reemplazada entera en los commits
del 2026-06-03/04. La condición de parada de la instrucción ("si la
arquitectura contradice lo que la instrucción da por sentado, frená y
reportá") se cumple, así que el Bloque 5 no se corrió, y los pasos 2 y 3 de la
instrucción (cierre de DESCONOCIDOS del Bloque 0 y sección CIERRE consolidada)
tampoco, por estar secuenciados detrás.

## La arquitectura real de `/contact` en HEAD, verificada

Los tres archivos de la cadena leídos íntegros de disco en esta sesión:

- **`src/app/(site)/contact/page.tsx` (31 líneas).** Renderiza
  `<section className="bg-off-white px-6 pt-6 text-off-black md:px-12 md:pt-10 lg:px-16 lg:pt-14">`
  (`page.tsx:26`) — **sin altura fija y sin overflow**. El comentario de
  `page.tsx:19-25` lo dice explícito: *"No fixed height / overflow-hidden so
  the page scrolls naturally"*.
- **`src/app/(site)/layout.tsx:17`.** El `<main>` del shell es
  `<main className="pt-[var(--header-height)]">` — sin restricción de altura
  ni overflow. No hay ningún contenedor con scroll propio entre el `<html>` y
  el formulario.
- **`ContactForm.tsx:539`.** El aside izquierdo (título + subtítulo + flecha)
  ya es sticky: `lg:sticky lg:top-[calc(var(--header-height)+3.5rem)]`.
- **`ContactForm.tsx:537`.** Layout de dos columnas en `lg`:
  `lg:grid lg:grid-cols-[minmax(420px,1.05fr)_minmax(560px,0.95fr)]`, con
  `max-w-[1680px]` centrado.
- **`ContactForm.tsx:577`.** El padding inferior que despeja el final del form
  vive dentro de la columna del form: `pb-[clamp(13rem,22vh,16rem)]`.
- **`ContactForm.tsx:43-44`.** La selección de texto scopeada a los inputs
  (`[[data-contact]_&]:selection:bg-off-white! ...`) **ya está implementada**,
  con el razonamiento de capas CSS documentado en el comentario de `:33-42`.
- Los únicos contenedores con overflow dentro del form son: el dropdown
  abierto de `CustomSelect` (`max-h-[240px]`/`max-h-[320px]` +
  `overflow-y-auto`, `ContactForm.tsx:429-432`) y el `overflow-hidden`
  decorativo de `ContactFocusSurface` (`:191`) y de los wrappers de reveal
  (`:541`, `:556`). Ninguno acota el alto del formulario.
- **`src/app/(site)/template.tsx` (23 líneas).** La transición es solo
  opacidad (`initial/animate/exit` de `opacity`, `template.tsx:14-17`), sin
  `overflow-hidden` ni transform — consistente con el fix coordinado de
  `b634521` (*"(site)/template a transicion solo-opacidad (fix coordinado
  regla #5)"*) que destrababa el sticky.

## Datación: cuándo murió la arquitectura que la instrucción da por sentado

`git log` de `contact/page.tsx` y `ContactForm.tsx`:

- **`b318ff6` (2026-06-03)** — *"contact: LIFE bold, select arrow/label fixes,
  scoped input selection, colored flags, **sticky+scroll layout**"*. Acá entra
  el layout sticky + scroll natural y la selección scopeada.
- **`8196dab` (2026-06-04)** — *"fix(contact): visible input selection,
  **solid footer**, sticky aside offset"*. Además **revirtió el footer fijo en
  `/contact`**: el diff cambia `isContactForm || isDarkRoute` por
  `isDarkRoute` en el ternario de `Footer.tsx:101-107`. En HEAD el footer solo
  es `fixed` en `/fun-gallery` y `/contact/success`; en `/contact` es
  `bg-off-white` en flujo normal (`Footer.tsx:100-107`; `isContactForm`,
  `:75`, hoy solo alimenta `shouldReplaceFooterCta`, `:76`).
- Ambos commits son ancestros de HEAD `2565d01`.

## Las contradicciones concretas

1. **"Qué crea el scroll interno hoy" → nada.** No hay scroll interno en
   `/contact`: no existe `overflow-hidden` ni altura acotada en toda la cadena
   `<main>` → `<section>` → grid → form. La página scrollea con el scroll de
   la ventana.
2. **`CLAUDE.md` §8.1 describe código que ya no existe.** La "causa raíz"
   (`<main>` con `overflow-hidden` + `h-[calc(100svh-var(--header-height))]`)
   fue eliminada en `b318ff6`. Es la **tercera** entrada de `CLAUDE.md`
   verificada como desactualizada, tras §7 (`HoverButton`/Fun Gallery) y §8.3
   (`DIRECTIONS` de WorkGrid), ambas de la sesión 4.
3. **`CLAUDE.md` §8.2 (selección scopeada) ya está implementado**
   (`ContactForm.tsx:43-44`), también desde `b318ff6`/`8196dab`.
4. **De los pedidos de las clientas que la instrucción trata como pendientes,
   "izquierda sticky / sacar scroll interno" ya está hecho.** Lo único
   plausiblemente pendiente en Contact es **"que entre todo en pantalla"** —
   la página hoy scrollea natural, no entra en un viewport.

## Hallazgo incidental: comentarios stale dentro del propio código

`contact/page.tsx:21-25` y `ContactForm.tsx:572-576` describen el footer de
`/contact` como `position: fixed` (~166 px, z-100) superpuesto al viewport.
Eso contradice `Footer.tsx:100-107` en HEAD (footer en flujo normal en
`/contact`, revertido por `8196dab`). Los dos comentarios quedaron
desactualizados respecto del archivo que describen.

## Qué premisas del resto de la instrucción SÍ se sostienen (verificado antes de frenar)

- **Work single (5.d):** el aside sticky con `md:sticky md:top-48` existe —
  `ProjectDetailClient.tsx:36` (grep de esta sesión).
- **Team (5.c):** el placeholder `VIDEO O GIF` existe — `TeamSection.tsx:60`
  (Bloque 2.b, sesión 4, mismo HEAD).
- **Work grid (5.b):** el reveal vertical con stagger existe —
  `WorkGrid.tsx:20-23` (corrección de sesión 4; stagger 0.7 citado por el
  commit `86702bf`).
- **La caracterización tipográfica de Contact del Bloque 2.b** (10 escalas,
  los 2 únicos `clamp()`, el único `lg:`) sigue siendo válida: se relevó en
  sesión 4 sobre el archivo actual, y las líneas citadas coinciden con lo
  releído hoy.

## Qué preguntas de la instrucción mueren y cuáles sobreviven

- **Muere:** "qué crea el scroll interno hoy". Respuesta cerrada: nada; el
  mecanismo fue eliminado el 2026-06-03.
- **Sobreviven pero piden re-especificación sobre la arquitectura real:** la
  medición "altura total del contenido del formulario" y "a qué altura de
  viewport entra completo sin scroll". En el layout de dos columnas hay que
  definir qué se mide (¿la columna del form con o sin su
  `pb-[clamp(13rem,22vh,16rem)]`? ¿el par aside+form?) y contra qué viewport
  se compara (descontando `--header-height` 128 px y el `pt` de la sección).
  La medición es perfectamente posible con dev server; no se hizo para no
  improvisar la re-interpretación.
- **Sobreviven tal cual:** alineación de título y subtítulo, labels, estilo de
  pills activo vs. inactivo (el archivo ya está leído íntegro; solo falta la
  autorización para escribir el bloque), y los puntos 5.b, 5.c y 5.d
  completos.
- **No afectados por la contradicción:** el paso 2 (lecturas de `netlify.toml`,
  `settings.local.json`, `AGENTS.md`, `README.md`, grep de `i18next` en el
  lock) y el paso 3 (CIERRE consolidado). Pueden re-instruirse sin cambios.

## DESCONOCIDO — Sesión 6

1. **Si el sticky del aside de Contact engancha en runtime.** Estáticamente no
   queda ningún ancestro con `overflow` ni transform que lo bloquee
   (`template.tsx` es solo opacidad), pero no se levantó dev server en esta
   sesión: el comportamiento no está medido.
2. **La altura real del formulario en píxeles.** Requiere la medición en
   runtime que quedó frenada por la parada.
   *(Los dos DESCONOCIDOS de esta sesión quedaron CERRADOS en la sesión 7 —
   ver Bloque 5.a.)*

---

# SESIÓN 7 — BLOQUE 5 + CIERRES  `[2026-08-14]`

## Método y premisas de la corrida

- La parada de la sesión 6 fue **aceptada por el usuario**: la premisa
  corregida es que `/contact` NO tiene scroll interno, scrollea con la
  ventana, el aside sticky existe y la selección está scopeada. No se relevó
  el layout viejo.
- **La parada condicional NO se activó.** Las premisas de la instrucción,
  confirmadas antes de escribir: no hay scroll interno en `/contact`
  (verificado estático en sesión 6 y hoy en runtime), el aside sticky existe
  y **engancha** (medido hoy — ver 5.a), la selección scopeada está
  implementada (`ContactForm.tsx:43-44`), el placeholder `VIDEO O GIF` existe
  (`TeamSection.tsx:61`), el reveal vertical con stagger de Work existe
  (`WorkGrid.tsx:15-23`), y el `md:sticky md:top-48` de Work single existe
  (`ProjectDetailClient.tsx:36`).
- **Runtime:** al arrancar la sesión ya había un `next dev` del proyecto
  sirviendo en `http://localhost:3000` (PID 12324,
  `node .../next/dist/server/lib/start-server.js`, iniciado hoy 2026-08-14
  13:33:50 — no por esta sesión). `next dev` compila del disco vigente, y el
  DOM medido coincide línea por línea con los archivos de HEAD (p. ej. el
  `top` computado del aside, 184 px, es exactamente
  `calc(var(--header-height) + 3.5rem)` = 128 + 56). Se usó ese server; esta
  sesión no levantó ni bajó procesos del proyecto.
- **Cómo se midió cada ancho:** la pestaña de medición corre en una ventana
  maximizada de 1920 px (viewport `innerWidth` = 1920 exacto). Para 1512 px
  se abrió una ventana popup de Chrome con viewport de `innerWidth` = 1512
  exacto y se midió adentro con `getBoundingClientRect`/`getComputedStyle`.
  Los altos de viewport reales de las corridas fueron 911 px y 902 px; la
  comparación contra 1080 y 982 es aritmética sobre alturas medidas que no
  dependen del alto del viewport (ver 5.a).

---

# BLOQUE 5 — Work grid / Work single / Contact / Team  `[COMPLETO — sesión 7]`

## 5.a — Contact

### Condiciones de la medición

Criterios fijados por la instrucción, aplicados tal cual:

- Se mide la **columna del formulario** (`ContactForm.tsx:577`, el segundo
  hijo del grid `[data-contact]`), **restando su `padding-bottom`**
  (`pb-[clamp(13rem,22vh,16rem)]`).
- El aside NO se suma (es sticky, no apila).
- Altura útil = `100svh − var(--header-height) − altura real del footer en
  flujo`.

### LOS NÚMEROS

| Valor | a 1920 px | a 1512 px |
|---|---|---|
| Columna del form, `offsetHeight` | 1434.5 px | 1434.5 px |
| `padding-bottom` computado | 208 px | 208 px |
| **Columna del form, neto (medido)** | **1226.5 px** | **1226.5 px** |
| Footer en flujo (`position: static` computado) | 166 px | 166 px |
| `--header-height` computado | 128 px | 128 px |
| Aside (referencia, no suma) | 425.2 px | 380.3 px |
| `scrollHeight` del documento | 1785 px | 1785 px |

**La altura neta del formulario es idéntica en los dos anchos: 1226.5 px.**
Entre 1512 y 1920 no cambia ningún wrap (los pills caben igual en su
contenedor `max-w-[430px]`, `ContactForm.tsx:640`); lo único que varía es el
aside, porque su título usa `lg:text-[clamp(74px,5.25vw,96px)]`
(`ContactForm.tsx:546`). El `padding-bottom` midió 208 px (el piso `13rem`
del clamp) en ambas corridas porque 22vh de 911/902 px queda debajo del piso;
por fórmula, a 1080 px de alto es 237.6 px y a 982 px es 216 px — excluido de
la cuenta por criterio de la instrucción.

### La comparación contra la altura útil

| Viewport | Altura útil (`100svh − 128 − 166`) | Form neto | Resultado |
|---|---|---|---|
| 1920 × 1080 | **786 px** | 1226.5 px | **NO entra — se pasa por 440.5 px** (1.56× el útil) |
| 1512 × 982 | **688 px** | 1226.5 px | **NO entra — se pasa por 538.5 px** (1.78× el útil) |

**Umbral:** con esta fórmula, el formulario entra completo a partir de
`1226.5 + 128 + 166 = 1520.5` → **1521 px de alto de viewport**, para
cualquier ancho del rango `lg` medido (1512–1920, donde el form neto es
invariante). No hay altura de viewport razonable de desktop que lo contenga:
el umbral queda 441 px por encima de 1080.

Dato al margen, fuera de la fórmula por criterio: la `<section>` de la página
agrega `padding-top` de 56 px (`lg:pt-14`, `contact/page.tsx:26`) entre el
header y el contenido; contarlo sube el umbral a 1577 px.

### El sticky, verificado en runtime — cierra los 2 DESCONOCIDOS de la sesión 6

`position: sticky` computado en el aside, `top` computado 184 px. Scrolleada
la página a 500 px, a 800 px y al máximo (874 px con viewport de 911), el
`getBoundingClientRect().top` del aside quedó **clavado en 184 px** en los
tres puntos: el sticky engancha y acompaña hasta el final del documento. Los
DESCONOCIDOS nº 1 (enganche) y nº 2 (altura del form) de la sesión 6 quedan
**CERRADOS**.

### Título y subtítulo — alineación

- Los dos viven en el aside sticky (`ContactForm.tsx:539`), columna izquierda
  del grid `lg:grid-cols-[minmax(420px,1.05fr)_minmax(560px,0.95fr)]`
  (`:537`), y están **alineados a la izquierda** (sin clase de `text-align`;
  arrancan del mismo borde).
- Título (`:546`): `font-display font-thin uppercase leading-[0.9]`,
  `text-[56px]` → `md:text-[68px]` → `lg:text-[clamp(74px,5.25vw,96px)]`,
  partido a mano en 3 líneas con `<br>`, con `LIFE` en `font-semibold`
  (`:551`). Reveal propio: `clipPath inset(100% 0 0 0)` + blur 7px → visible
  (`contactTitleVariants`, `:84-100`).
- Subtítulo (`:556`): `mt-9 lg:mt-12`, `max-w-[560px]`, `font-body uppercase
  leading-[1.24]`, `text-[20px]` → `md:text-[23px]` → `lg:text-[25px]`,
  2 líneas con `<br>`, seguido de la flecha `→` en `text-[28px]`/
  `md:text-[32px]` (`:566-568`). Reveal `contactAsideDetailVariants`
  (`:102-118`, delay 0.2).

### Labels

`FieldShell` (`:156-180`): cada fila es un grid `py-5` → `md:py-7` con
`md:grid-cols-[minmax(150px,176px)_minmax(0,420px)]` y `md:gap-7`. El label
(`:167`): `font-body uppercase text-[14px] leading-[1.15]` →
`md:text-[16px]`, **en mobile arriba del control y alineado a la izquierda;
de `md` en adelante en su propia columna, `md:text-right` (alineado a la
derecha, contra el control) y centrado verticalmente** (`self-center` +
`md:items-center`). Cuatro labels están partidos a mano en 2 líneas con
`<span className="block">` (`:634-636`, `:687-688`, `:747-748`, `:769-770`).
El error de validación va debajo del control: `text-[13px]`/`md:text-[14px]`
`uppercase tracking-wider` (`:173`).

### Pills — activo vs. inactivo

`WorkTypePill` (`:202-266`), botón `aria-pressed`:

- **Base común** (`:236`): `border border-off-black px-2.5 py-1.5 font-body
  text-[15px] uppercase leading-none` → `md:text-[17px]`,
  `transition-colors duration-150`, `overflow-hidden`, `shrink-0`.
- **Inactivo** (`:239`): `bg-transparent text-off-black` (borde negro, fondo
  transparente).
- **Activo** (`:238`): `bg-off-black text-off-white` — el mismo aspecto que
  producen `hover:` y `focus-visible:` (`:236`), así que hover sobre un
  inactivo anticipa el estado activo.
- **Al click** (activo o no): ripple circular `bg-off-white/65` desde el punto
  del cursor, escala 0→1 y opacidad 0.45→0 en 0.55 s ease
  `[0.22,1,0.36,1]` (`:242-262`).

## 5.b — Work grid

### Grilla y breakpoints

`WorkGrid.tsx:35`: `grid grid-cols-1 gap-6 bg-off-white p-6 sm:grid-cols-2
lg:grid-cols-3`. **1 columna hasta 640 px, 2 hasta 1024, 3 de ahí en
adelante; gutter y marco de 24 px** (`gap-6` + `p-6`).

### Proporción de las tarjetas

Cada celda es **`aspect-square` (1:1)** con `overflow-hidden` y `cursor-none`
(`WorkGrid.tsx:44`). La imagen de portada se pide al CDN en **1200 × 1600
(3:4)** — `urlFor(...).width(1200).height(1600)`, `ProjectCard.tsx:33` — y
se recorta al cuadrado con `object-cover` (`:49`), con zoom
`group-hover:scale-105` en 700 ms (`:49`). La proporción visible y la
proporción pedida al CDN no coinciden: el recorte 3:4 → 1:1 es permanente.

### Reveal: stagger y duración exactos

- **Stagger: `staggerChildren: 0.7`** — 0.7 s entre tarjeta y tarjeta
  (`WorkGrid.tsx:17`).
- **Ítem: `opacity 0→1` + `y 40→0` simultáneos, duración 0.7 s, ease
  `[0.25, 0.1, 0.25, 1]`** (`:13`, `:20-23`). Solo vertical — los
  `DIRECTIONS x: ±60` de `CLAUDE.md` §8.3 no existen en HEAD (confirmado
  releyendo el archivo hoy).
- **Gate:** `useInView(ref, { once: true, margin: "-80px" })` sobre el
  contenedor entero + `isPreloaderDone` + `useReducedMotion` (`:26-30`). El
  grid entero es un solo trigger: las 4+ tarjetas escalonan desde un mismo
  instante, no por-tarjeta al entrar al viewport.

### Overlay de hover: el padding pedido

`ProjectCard.tsx:61-88`: capa `absolute inset-0` con el `coverColor` del
proyecto (fallback `#EFEEDA`, `:63`), fade 0→1 en 0.6 s ease
`[0.25,0.1,0.25,1]` vía `whileHover` (`:64-66`). **El padding del texto es
`p-8` = 32 px en los cuatro lados** (`:62`). Adentro, `flex flex-col
justify-between`: arriba número de proyecto, título (`font-medium`),
categoría y services (`max-w-[220px]`), separados por `mt-6` (24 px), todo
`text-[17px] uppercase leading-[1.15]` (`:68-81`); abajo el año
(`leading-none`, `:83-87`). El color del texto lo decide luminancia YIQ del
`coverColor` (`getContrastClass`, `:16-27`): claro → `text-off-black`,
oscuro → `text-off-white`.

## 5.c — Team

### Estructura

`team/page.tsx` (13 líneas) solo declara metadata y renderiza
`<TeamSection />`. `TeamSection.tsx:143-165`:

1. `<main className="px-6 pb-16 md:px-12 mb-32">` (`:145`) — **`<main>`
   anidado dentro del `<main>` del shell** (`(site)/layout.tsx:17`), igual
   que Work y Work single (ver hallazgo incidental abajo).
2. Primera pantalla (`:146`): sección
   `min-h-[calc(100vh-var(--header-height,96px))]` — **el fallback `96px` no
   coincide con el token real (128 px)**; solo actúa si la var faltara —
   `flex flex-col items-center justify-start` con `gap-[clamp(20px,3vh,34px)]`,
   conteniendo `StudioIntro` + `TeamVideo`.
3. Después, `space-y-32` con las 3 `TeamSubsection` (`:150-162`): `01 THE
   TEAM` (con foto `/projects/team.jpg`, `:127-134`), `02 OUR APPROACH`,
   `03 WHERE WE ARE HEADED`. Cada una es un grid
   `md:grid-cols-[235px_minmax(0,1fr)]` con aside numerado **sticky**
   (`md:sticky md:top-24`, `:86`) en 17 px uppercase, y cuerpo en
   `text-[24px]`/`md:text-[30px]` `leading-[1.25]` (`:102`, `:111`).

### De dónde sale el texto

**Todo hardcodeado en constantes del propio componente** (`:6-30`), nada de
Sanity: `studioIntroLines` (5 líneas cortadas a mano, con `<b>` embebido,
inyectadas por `dangerouslySetInnerHTML`, `:49`), `teamParagraphs` (4
segmentos, el nombre de las fundadoras en `<strong>`, `:103-108`),
`approachContent` y `headedContent` (template strings con `\n\n` que se
parten en `<p>` por `split("\n\n")`, `:112-114`). Ya censado en el Bloque
2.c; se confirma sin cambios.

### El hueco del gif que falta

`TeamVideo()` (`:57-65`): **hoy se renderiza visible en producción** un
rectángulo de `h-[clamp(260px,42vh,520px)]`, `w-full max-w-[1500px]`, con
borde `border-off-black/10` y fondo `bg-gray-brand/20` (gris al 20 %), y en
el centro el literal **`VIDEO O GIF`** en `text-sm uppercase tracking-wider
text-gray-brand` (`:60-62`). No hay condicional que lo oculte ni fuente de
datos que lo reemplace: es un placeholder interno servido al público, **en
español dentro de un sitio cuyo copy es todo inglés** (si es el único string
en español del sitio no se verificó contra el censo completo del 2.c). No
tiene reveal propio (aparece sin
animación; `StudioIntro` arriba sí, con `RevealOnScroll delay={0.5}`, `:43`).

### Reveals de las subsecciones (referencia)

Constantes en `:32-39`: duración 0.8 s; aside `delay 0.1` con `y: 20`; texto
e imagen `delay 0.5` con `x: 40` (entran desde la derecha, a diferencia del
resto del sitio que revela vertical).

## 5.d — Work single — verificación acotada

Confirmado sobre `ProjectDetailClient.tsx` íntegro: **no hay deuda visible
más allá de lo ya conocido.** El aside `md:sticky md:top-48` está en `:36` y
los dos comentarios del archivo (`:48`, `:61-65`) describen correctamente el
código vigente (el fix coordinado del sticky). Dos observaciones menores, sin
profundizar: (a) `motion.main` (`:23`) anidado dentro del `<main>` del shell,
igual que Work y Team; (b) cuando no hay proyecto siguiente, el link de abajo
etiqueta `Next →` al proyecto **anterior** (`:88-99`) — decisión de diseño
existente, se registra sin juicio.

## Hallazgo incidental — `<main>` anidados

El shell ya emite `<main className="pt-[var(--header-height)]">`
(`(site)/layout.tsx:17`). Aun así, `work/page.tsx:39`, `TeamSection.tsx:145`
y `ProjectDetailClient.tsx:23` renderizan su propio `<main>` adentro →
`<main>` dentro de `<main>` en `/work`, `/team` y `/work/[slug]`. El
comentario de `contact/page.tsx:19-20` muestra que la regla correcta ya está
enunciada en el repo (*"use a `<section>` here to avoid nesting `<main>`"*)
pero solo Contact la cumple; `/services` y `/fun-gallery` usan sus propios
contenedores ya relevados en los Bloques 3 y 4.

## HECHOS VERIFICADOS — Bloque 5

- **Contact NO entra en pantalla en ningún viewport razonable:** form neto
  **1226.5 px** (idéntico a 1512 y 1920 px de ancho), altura útil 786 px
  (1920×1080) / 688 px (1512×982); déficit 440.5 / 538.5 px; **umbral 1521 px
  de alto de viewport**.
- Footer de `/contact` en flujo: **166 px, `position: static`** (medido,
  ambos anchos) — confirma en runtime la reversión de `8196dab`.
- El aside sticky de Contact **engancha en runtime**: top clavado en 184 px
  durante todo el rango de scroll.
- Los dos DESCONOCIDOS de la sesión 6: **CERRADOS**.
- Work grid: 1/2/3 columnas (base/`sm`/`lg`), tarjetas 1:1 con imagen pedida
  3:4 recortada, **stagger 0.7 s**, ítem 0.7 s `y:40`+fade, overlay de hover
  con **`p-8` (32 px)** y fade 0.6 s.
- Team: texto 100 % hardcodeado en `TeamSection.tsx:6-30`; el hueco del gif
  renderiza HOY un placeholder gris visible con el literal `VIDEO O GIF`
  (en español, contra el copy inglés del resto del sitio).
- Work single: sin deuda visible más allá del `md:sticky md:top-48` ya
  verificado.
- `<main>` anidados en `/work`, `/team` y `/work/[slug]`; Contact lo evita
  explícitamente.

## DESCONOCIDO — Bloque 5

1. **Los valores por debajo de 1024 px de ancho (mobile/tablet).** La
   instrucción fijó 1920 y 1512; el form neto en `md`/base (layout de una
   columna, labels arriba) no se midió.
2. **Si los números difieren en un build de producción.** Igual que el
   Bloque 2.a: se midió sobre `next dev`; las clases son estáticas pero no
   se corroboró contra `npm run start`.

## RIESGOS PARA LO QUE VIENE — Bloque 5

- **"Que entre todo en pantalla" en Contact no es un ajuste: es un rediseño
  de densidad.** Hay que recuperar 440.5 px a 1080 de alto (el form es 1.56×
  el espacio útil). Las palancas medibles: 9 filas con `py-7` (56 px
  verticales por fila = ~504 px solo de respiro entre filas), controles
  `min-h-[58px]` con texto 34 px, y el bloque SEND con `mt-16`. Ninguna
  reducción de padding alcanza sola sin tocar la escala tipográfica de los
  controles — que es identidad visual (prioridad nº 1).
- **El stagger de Work a 0.7 s por tarjeta es aritméticamente pesado con el
  grid como trigger único:** con 4 proyectos la última tarjeta arranca a los
  2.1 s; con 8 (los `LOCAL_WORK_PROJECTS` del fallback), a los 4.9 s. Todo
  cambio de catálogo cambia la duración total percibida del reveal.
- **El placeholder `VIDEO O GIF` está en producción.** Cargar el asset real
  es contenido, no código; mientras tanto cualquier QA visual del sitio lo va
  a encontrar.
- **El fallback `96px` de `TeamSection.tsx:146`** es una segunda fuente de
  verdad para `--header-height`; si el token cambia, ese fallback queda
  mintiendo en silencio.

---

# PASO 2 — CIERRE DE LOS DESCONOCIDOS MENORES DEL BLOQUE 0  `(sesión 7)`

### `netlify.toml` — cierra el nº 4 (y el nº 6 del Bloque 1)

6 líneas, transcripto entero:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Sin redirects, sin headers, sin variables de entorno, sin contexts.** El
deploy no altera la clasificación de rutas del build local → el DESCONOCIDO
nº 6 del Bloque 1 queda cerrado en el mismo acto.

### `.claude/settings.local.json` — cierra el nº 3

Vive en **`C:/EsquinaWeb/.claude/`** (raíz del repo git, no del proyecto
Next). 48 líneas: solo `permissions.allow` / `permissions.deny` de Claude
Code. `allow`: `Read/Edit/Write(*)`, `npm/npx/node`, git de trabajo local
(`status/add/commit/diff/checkout/worktree/fetch/rm`), utilidades de shell, y
dos entradas `Start-Process` para lanzar `npm run dev` oculto — una de las
cuales redirige la salida a `devserver.log`/`devserver.err.log` **dentro del
proyecto**, lo que explica la existencia de esos archivos. `deny`: todo lo
destructivo (`rm/del/rmdir/Remove-Item`, `git push`, `git reset --hard`,
`git clean`, `sudo`, `npm publish`). Es la única pieza real del "harness" que
`CLAUDE.md` §6 describe.

### `AGENTS.md` — cierra la mitad del nº 6

5 líneas: únicamente el bloque autogenerado `nextjs-agent-rules` (*"This is
NOT the Next.js you know"* + mandato de leer `node_modules/next/dist/docs/`).
Coincide con lo que `CLAUDE.md:55` le atribuye, y la advertencia sigue siendo
operativa (las docs embarcadas existen — usadas en la sesión 3). **Sin
afirmaciones desactualizadas.**

### `README.md` — cierra la otra mitad del nº 6

37 líneas: el boilerplate intacto de `create-next-app`, sin una sola línea
específica del proyecto. Tres afirmaciones no corresponden a este repo: la
fuente **Geist** (`README.md:21`) — el código usa Manrope local
(`src/app/layout.tsx:6-10`); editar **`app/page.tsx`** (`:19`) — la home real
es `src/app/(site)/page.tsx`; y el deploy en **Vercel** (`:32-36`) — el
hosting real es Netlify (`netlify.toml`).

### `i18next` en el lock — cierra el nº 2

**Es transitivo, y el paquete que lo arrastra es `sanity` (el Studio).**
Evidencia en `package-lock.json`: `sanity@5.25.1` (`:16489`) declara entre
sus dependencias `i18next: ^25.8.17` (`:16559`) y `react-i18next: 15.6.1`
(`:16577`). `i18next@25.10.10` (`:12366`) está marcado `"peer": true`
(`:12385`) — entra al árbol para satisfacer el peer de `react-i18next`
(`:15852`, `i18next >= 23.2.3`). Ningún otro paquete del lock lo declara, y
`package.json` no lo tiene como dependencia directa (Bloque 0.4). La decisión
de i18n a mano no tiene conflicto con el árbol instalado.

### `.gitignore` — cierra el nº 5 (no pedido, costo marginal)

50 líneas: estándar de `create-next-app` (`node_modules`, `.next`, `.env*`,
etc.) más `desktop.ini` y los tres directorios de assets originales
(`/Asset_ Imágenes`, `/Asset_ Logo`, `/Asset_ Tipografía`, `:47-49`).
**`design-refs/` NO está ignorado** — ver corrección abajo. Tampoco están
ignorados `devserver*.log`.

### `devserver.log` / `devserver.err.log` — cierra el nº 7 (no pedido, costo marginal)

Los dos están **trackeados en git** (`git ls-files` los lista) — commiteados
por accidente, no ignorados. Contenido trivial de una corrida `next dev`
(Next 16.2.6 Turbopack) del 2026-06-04: el `.log` registra un server en el
puerto **3001** con la extensión Console Ninja conectada; el `.err.log`
registra que el 3000 estaba ocupado por otro dev server (PID 28908 de aquel
momento). Sin información de método.

### CORRECCIÓN A BLOQUES YA ESCRITOS (sesión 7)

- **Bloque 0 / 4.d decían "los cuatro directorios ignorados por git (…
  `design-refs`)".** Inexacto: `.gitignore` solo ignora los tres `Asset_*`;
  `git check-ignore` no devuelve regla para `design-refs/`. No aparece en
  `git status` porque está **vacío** (git no lista directorios vacíos), no
  porque esté ignorado. El hallazgo de contenido ("no contiene documentación
  de método") sigue en pie.
- **Bloque 1, DESCONOCIDO nº 6** — cerrado: `netlify.toml` no altera la
  clasificación de rutas.
- **Sesión 6, DESCONOCIDOS nº 1 y nº 2** — cerrados por la medición del 5.a.
- **Bloque 0, estado:** con los cierres de esta sesión queda abierto
  únicamente el DESCONOCIDO nº 1 (branches mergeadas a `main`).

---

# PASO 3 — BARRIDO COMPLETO DE DOCUMENTACIÓN CONTRA CÓDIGO  `(sesión 7)`

`CLAUDE.md` (155 líneas) y `AGENTS.md` (5 líneas) releídos enteros hoy y
contrastados contra todo lo relevado en la auditoría. **No se corrigió nada:
esto es el inventario.**

## `CLAUDE.md` — afirmaciones que ya no se corresponden con el código

| # | Sección / línea | Lo que afirma | Estado real | Evidencia |
|---|---|---|---|---|
| 1 | §8.1, `CLAUDE.md:138` | El `<main>` de Contact con `overflow-hidden` + `h-[calc(100svh-var(--header-height))]` crea el scroll interno del form | Esa arquitectura no existe en HEAD: la página scrollea con la ventana, sin altura acotada ni overflow en la cadena | `contact/page.tsx:26`, `(site)/layout.tsx:17`; eliminada en `b318ff6` (2026-06-03); runtime medido hoy |
| 2 | §8.2, `CLAUDE.md:140` | Scopear la selección a los inputs de Contact es la solución correcta (a futuro) | Ya está implementado, con el razonamiento de capas documentado en el propio archivo | `ContactForm.tsx:43-44` (+ comentario `:29-42`); desde `b318ff6`/`8196dab` |
| 3 | §8.3, `CLAUDE.md:142` | `WorkGrid` anima con offsets horizontales (`DIRECTIONS` con `x: ±60`) y hay que pasarlo a vertical | El reveal ya es solo vertical (`y: 40` + fade + stagger 0.7); `DIRECTIONS` no existe | `WorkGrid.tsx:15-23` (releído hoy); commit `86702bf` |
| 4 | §8.4, `CLAUDE.md:144` | El reveal de Services "ya usa GSAP `ScrollTrigger` (`once: true`) + Framer" | GSAP en Services ya no es reveal: es maquinaria de estado de scroll (colapso de ítems pasados, `hasReachedEnd`); el reveal visual lo hace `RevealOnScroll` | `ServiceItem.tsx:148-170`, `:212`; `ServicesStack.tsx:64-74` (Bloque 6.3) |
| 5 | §8.5, `CLAUDE.md:146` | Conviven 3 formas de reveal (`WorkGrid` inline, `RevealOnScroll`, GSAP en Services) | El mapa real es otro: 2 sistemas de reveal por scroll + 3 reveals de entrada artesanales = 5; GSAP no está entre ellos | Bloque 6.3 |
| 6 | §7, `CLAUDE.md:127` | "`HoverButton` es compartido con Fun Gallery: tocarlo puede regresionar la galería" | `FunGallery.tsx` no importa `HoverButton` (grep de hoy: 7 archivos, la galería no está); el riesgo existe pero es indirecto, vía Navbar/Footer con `blend` sobre la galería | Bloque 6.1; grep repo-wide 2026-08-14 |
| 7 | §6, `CLAUDE.md:97` | Los subagentes viven como markdown en `.claude/agents/` | `.claude/` (raíz del repo) contiene un solo archivo: `settings.local.json`. No hay `agents/`, ni la infraestructura del método descrito | Glob de hoy; Bloque 0.5 |
| 8 | §4 tabla, `CLAUDE.md:67-73` | Mapa de secciones con archivos propios | Faltan dos secciones existentes: Team (`team/page.tsx`, `TeamSection.tsx`) y Fun Gallery (`fun-gallery/page.tsx`, `FunGallery.tsx`) | Bloque 0.7 nº 6 |

## `CLAUDE.md` — matices (no falsos, pero engañosos hoy)

| # | Línea | Matiz |
|---|---|---|
| 9 | `CLAUDE.md:37` | `--footer-height: 480px` existe en `globals.css:11` pero **nadie lo consume** (grep de hoy: única aparición = la definición) y el footer real en flujo mide **166 px**. Token huérfano citado como valor de identidad. |
| 10 | `CLAUDE.md:49` | "Lenis" es el paquete legacy `@studio-freight/lenis` (Bloque 0), y no corre en `/services` ni `/fun-gallery` (Bloque 1). |
| 11 | `CLAUDE.md:51` | zod es v4 (`^4.4.3`), matiz ya registrado en el Bloque 0. |
| 12 | `CLAUDE.md:78` | Sigue siendo **fiel al código de HEAD** (hay un solo schema `project`), pero contradice la decisión cerrada del plan (schema propio para Fun Gallery). Es conflicto plan-vs-doc, no código-vs-doc — ya registrado como 0.7 nº 1 y sigue siendo **prerrequisito de la corrida de Fun Gallery**. |
| 13 | §§0, 6, 9 (`CLAUDE.md:15`, `:95-112`, `:150-154`) | Describen una fase de trabajo ("co-diseñar specs, luego 5 subagentes en paralelo") cuya infraestructura no existe en el repo y cuyo plan ya fue reemplazado por las instrucciones v3 de esta auditoría. Método, no código; se registra porque cualquier sesión que cargue `CLAUDE.md` como contexto va a intentar obedecerlo. |

## `CLAUDE.md` — verificado como correcto en esta sesión

- **§2 completo** (`:31-40`): los 4 colores, Manrope variable `300–800`
  (`src/app/layout.tsx:6-10`), `--header-height: 128px`, `::selection`
  global, scrollbar oculto, `--cursor-size` — todo coincide con
  `globals.css:4-23, 59-74`.
- **§4 shell** (`:62`): coincide con `(site)/layout.tsx:13-21` (releído hoy).
- **§3 stack** (`:48-53`): confirmado en Bloque 0 con los matices 10-11;
  hosting Netlify confirmado hoy por `netlify.toml`.
- **§7 listas de archivos** (`:121-124`): todos los archivos listados
  existen.

## `AGENTS.md`

Sin afirmaciones desactualizadas (ver Paso 2).

## Comentarios stale dentro del código (el footer "fijo" de `/contact`)

Los dos ya detectados en la sesión 6, ahora con la contradicción **medida**
(footer `position: static`, 166 px, en flujo):

1. **`contact/page.tsx:21-25`** — *"On /contact the site Footer is `position:
   fixed` (z-100, ~166px tall) overlaying the viewport bottom"*. Falso en
   HEAD desde `8196dab`.
2. **`ContactForm.tsx:572-576`** — *"…extends past the form. That keeps the
   LET'S BRING aside pinned **while the fixed footer appears**"*. Misma
   afirmación stale; el propósito del padding (alargar el containing block
   del sticky) sigue siendo real, el "fixed footer" no.

El dato correcto que ambos deberían decir: el footer de `/contact` es
`bg-off-white` en flujo normal (`Footer.tsx:100-107`); solo `/fun-gallery` y
`/contact/success` tienen footer `fixed`.

**Cuenta final del barrido: 8 afirmaciones desactualizadas + 5 matices en
`CLAUDE.md`, 0 en `AGENTS.md`, 2 comentarios stale en código, 3 en
`README.md` (boilerplate), 1 en `docs/sanity-studio-guide.md:20-25` (0.7
nº 4).** Ninguna corregida: la corrección de `CLAUDE.md:78` sigue marcada
como prerrequisito de la corrida de Fun Gallery (Riesgo del Bloque 0).

---

# CIERRE — DESCONOCIDOS ABIERTOS EN TODA LA AUDITORÍA  `(consolidado, sesión 7)`

Lista completa de lo que la auditoría **no** sabe, tras los cierres de todas
las sesiones. Lo resuelto no se repite; procedencia en cada bloque.

**Bloque 0 — Base** *(1 abierto)*

1. Qué branches locales están mergeadas a `main` (12 branches `lane/*` y
   `fix/*`; falta `git branch --merged main`).

**Bloque 1 — Shell y transiciones** *(3 abiertos)*

2. Qué se ve exactamente en la recarga dura a mitad de sesión (falta captura
   del estado pre-hidratación; la cadena de código está verificada).
3. Cuántos milisegundos dura ese estado (hidratación no instrumentada).
4. Si `window.history.scrollRestoration = "manual"` de
   `ServicesPageClient.tsx:21` (global, sin cleanup) afecta en la práctica a
   otras rutas — no medido.

**Bloque 2.a / 2.b — Tipografía** *(4 abiertos)*

5. Qué significan las anotaciones "17pt / 30pt / 40pt" de las clientas
   (¿estado actual o pedido?) — requiere a las clientas o el archivo del
   diseño.
6. A qué ancho de mockup corresponden los ratios 2.22 / 1.67 citados.
7. Si los valores medidos difieren en un build de producción (todo se midió
   sobre `next dev`; aplica también al Bloque 5).
8. Los line-height computados de los elementos no medidos en runtime
   (Contact, Services stack, Work single).

**Bloque 2.c — Censo de strings** *(2 abiertos, decisiones de producto)*

9. Si los países (196 strings) se traducen o quedan en inglés.
10. Si el catálogo de Services (108 strings) migra a Sanity o queda
    hardcodeado bilingüe.

**Bloque 3 — Services** *(4 abiertos)*

11. Equivalencia `100vh` ↔ `window.innerHeight` en móviles con UI dinámica
    (afecta el swap del camino scroll).
12. El `<title>` final compuesto de `/services` (posible marca duplicada
    `(TM)` + `™` vía template del root) — requiere runtime.
13. Si Framer deja `transform: none` en reposo en los wrappers de
    `RevealOnScroll` (hoy inocuo por el portal de `ServiceItem`).
14. Comportamiento ante toggle de `prefers-reduced-motion` a mitad del intro.

**Bloque 4 — Fun Gallery** *(3 abiertos)*

15. Qué computa exactamente `metadata.hasAlpha` de Sanity (asset E: sharp
    dice sin alpha, Sanity dice `hasAlpha: true`; coinciden en
    `isOpaque: true`).
16. El comportamiento de caché de la ruta medido en producción (`npm run
    start` no corrido; la semántica citada es la documentada).
17. La procedencia del asset G (`e5452969…`, portada de `matsutrabajo`, sin
    original en el repo).

**Bloque 5 — Work / Contact / Team** *(2 abiertos, nuevos de sesión 7)*

18. Los valores de Contact por debajo de 1024 px de ancho (layout de una
    columna) — la instrucción fijó 1920 y 1512.
19. (= nº 7) Corroboración de las mediciones contra build de producción.

**Bloque 6 — Primitivos** *(2 abiertos, no verificables desde el repo)*

20. Si los tokens `@theme` huérfanos (incluido `--footer-height`) y los
    `--cursor-*` muertos son resto de plan abandonado o preparación futura.
21. Si `InfoCard.tsx` (código muerto) debe borrarse — decisión de producto.

**Bloque 7 — Sanity** *(2 abiertos, solo consultables fuera del repo)*

22. Los permisos efectivos del token `SANITY_API_WRITE_TOKEN` (panel de
    Sanity).
23. Si el dataset `production` es público o privado (el cliente lee sin
    token, consistente con dataset público; no confirmado en el panel).

**Bloque 8 — Baseline de rendimiento:** NO CORRIDO por instrucción; no tiene
DESCONOCIDOS propios porque no tiene hechos.

**Total: 23 entradas, 22 únicas (la nº 19 es la nº 7 aplicada al Bloque 5)** —
1 de terreno git, 11 que requieren runtime o
build adicional, 4 que requieren fuentes externas al repo (clientas, panel de
Sanity, docs internas de Sanity), 3 decisiones de producto, y el resto
menores. Ninguno bloquea el arranque de los sprints ya especificados; los que
tocan decisiones de producto (9, 10, 21) conviene cerrarlos antes del sprint
de i18n y del rediseño de Services.

---
