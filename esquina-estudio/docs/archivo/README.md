# Archivo — material histórico de la ronda (mayo–agosto 2026)

**Esto no es documentación de consulta corriente.** Es el material de la ronda
que cerró el **26 de agosto de 2026** (Bloques 1–4 y sprints M1–M7): sirve para
reconstruir *qué se decidió y por qué*, y para sostener una discusión con las
clientas sobre lo que se acordó. Para trabajar en el repo hoy, lo que se lee es
otra cosa (ver abajo).

Se archivó con `git mv` en el sprint **M7**. **Nada de esto se borró**, y ninguno
de estos archivos lo sirve Next ni entra al bundle: no hay una sola línea acá que
un visitante pueda ver.

## Qué hay

| Carpeta / archivo | Qué es |
| --- | --- |
| `mockups/` | Las **15 páginas de `Final.pdf`** que pasaron las clientas, más los cinco tramos de `/services` (`08a`–`08e`). **Son la fuente de verdad del diseño de la ronda.** Están medidos, no descritos: los exportes son de un diseño de 1920 escalado a 1327 (factor 0,691), y de ahí salen las constantes de `services-layout.ts`, el tope de ancho de la Fun Gallery y las tallas del footer. |
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
