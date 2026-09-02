# Archivo — material histórico de la ronda (mayo–agosto 2026)

**Esto no es documentación de consulta corriente.** Es el material de las rondas
de devolución —la primera cerró el **26 de agosto de 2026** (Bloques 1–4 y
sprints M1–M7) y la segunda el **1 de septiembre**—: sirve para reconstruir *qué
se decidió y por qué*, y para sostener una discusión con las clientas sobre lo
que se acordó. Para trabajar en el repo hoy, lo que se lee es otra cosa (ver
abajo).

**Los mockups son la excepción a «esto es histórico».** Mientras una ronda está
abierta, los suyos son la fuente de verdad y se miden contra ellos; después
quedan como registro. Los de R2 (`r2-*.jpg`) se agregaron el 1 de septiembre.

Se archivó con `git mv` en el sprint **M7**. **Nada de esto se borró**, y ninguno
de estos archivos lo sirve Next ni entra al bundle: no hay una sola línea acá que
un visitante pueda ver.

## Qué hay

| Carpeta / archivo | Qué es |
| --- | --- |
| `mockups/` (ronda 1) | Las **15 páginas de `Final.pdf`** que pasaron las clientas, más los cinco tramos de `/services` (`08a`–`08e`). **Son la fuente de verdad del diseño de la ronda 1.** Están medidos, no descritos: los exportes son de un diseño de 1920 escalado a 1327 (factor 0,691), y de ahí salen las constantes de `services-layout.ts`, el tope de ancho de la Fun Gallery y las tallas del footer. |
| `mockups/r2-trad-01…15.jpg` | Las **15 páginas de `Correcciones_Traducción`**, la ronda 2 (2026-09-01). Anotaciones de las clientas sobre capturas del sitio publicado: **rojo** = cambio de copy en castellano, **verde** = corrección en inglés, **azul** = pregunta o cambio de comportamiento. **Son la fuente de verdad de R2.** De acá salen el precio y el CTA de consultoría, el copy de los cuatro packs, la frase de la marca en dos líneas, la salida de `JOIN OUR CLUB`, los rótulos y rangos del formulario y la frase de la galería. |
| `mockups/r2-mob-01…05.jpg` | Las **5 páginas de `Correcciones_Mobile`**, la ronda 2. Cada página lleva dos capturas del teléfono —la primera es el sitio de hoy, la segunda el estado deseado— y a veces una tercera de referencia ajena. **Se miden, no se describen**, y la escala se deriva de la propia captura: el ancho de pantalla da 708–714 px sobre un viewport de 393 CSS (factor ≈1,81). De acá salen el alto del logo del header (37 px), el desplegable `EN ⌄`, el footer en dos columnas, la alineación de Team, el tamaño de la frase y de los objetos de la galería, y el botón de volver arriba. |
| `mediciones/` | Las varas de no-regresión en JSON, una por ronda. `r2-fase0-base.json` es la del sitio **antes** de R2: 48 altos (8 rutas × 3 anchos × 2 idiomas), su franja muerta, su desborde horizontal y el fit del formulario en cuatro anchos. Se compara con `node tools/bench/diff.mjs`. |
| `instrucciones/` | Los documentos de instrucción de la ronda, generados en la capa de planificación (develOP). Son **el historial de por qué el código quedó como quedó**. |
| `banderas-set.md` | Fuente, versión y licencia del set de banderas vendorizado en `public/flags/` (`flag-icons` 7.5.0, MIT). El texto de la licencia **no está acá**: viaja con las copias, en `public/flags/LICENSE.txt`, que es donde tiene que estar. |
| `sanity-piezas-es.md` | Las traducciones al castellano propuestas para las casillas ES de los proyectos. Se cargan **a mano desde el Studio**; ningún agente escribe en Sanity. |

## Qué NO está acá, y por qué

Estos siguen en su lugar porque **son de consulta corriente**, no historia:

- **`CLAUDE.md`** (raíz del proyecto) — el contrato de todo agente que toque el
  repo. Se lee antes de tocar nada.
- **`docs/plan-maestro.md`**, **`docs/pendientes.md`**, **`docs/bitacora.md`** —
  el registro **vivo** del método. Se escriben en cada sprint.
- **`docs/reportes/`** — la auditoría completa del 13 de agosto y el postmortem
  de la ronda: la base de hechos del proyecto.

## Si movés algo de acá

**Un puntero a un archivo movido es el mismo problema documental que el Bloque 1
vino a arreglar.** Antes de mover nada, grep de la ruta vieja en `CLAUDE.md`,
`README.md`, `docs/*.md` y los comentarios de `src/` — hay comentarios de código
que citan estos mockups por ruta (`services-layout.ts`, `FunGallery.tsx`,
`LocaleToggle.tsx`) y dos que citan `banderas-set.md` (`CountryFlag.tsx`,
`countryFlagCodes.ts`).

Una excepción deliberada: **`docs/reportes/2026-08-13-auditoria-completa.md`
sigue diciendo `docs/instrucciones/`** en cinco lugares. No es un puntero roto
por descuido: son **transcripciones literales de `git status`** de aquel día, y
reescribirlas falsearía el registro. La traducción es esta tabla.
