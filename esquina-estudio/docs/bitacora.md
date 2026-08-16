# Bitácora — Esquina Estudio

Registro único y acumulativo de lo ejecutado. **La escribe el agente de ejecución** al cerrar cada sprint o bloque. Las entradas se **agregan al final**; nunca se edita ni se borra una entrada previa.

Formato de entrada:

## [fecha] · [Bloque/Sprint] · [título]
- **Qué se hizo:**
- **Decisiones tomadas en ejecución** (deberían ser cero; si hubo, por qué):
- **Mediciones / salidas de puertas:**
- **Pendientes que deja:**
- **Verificación humana pendiente:**
- **Commits:**

---

## 2026-08-15 · B1 Fundación · Sincronización de documentación y limpieza

- **Qué se hizo:** [F1] borrados `InfoCard.tsx`, `SanityImage.tsx`, `types/service.ts` y `/api/seed-sanity` (346 líneas); los `devserver*.log` ya estaban destrackeados e ignorados desde `a477018`. [F2] creados `docs/plan-maestro.md`, `docs/pendientes.md`, `docs/bitacora.md`; `README.md` reemplazado (era el boilerplate intacto de `create-next-app`); 2 comentarios stale de Contact corregidos; `docs/reportes/` y `docs/instrucciones/` ya estaban trackeados. [F3] `CLAUDE.md` reescrito completo (ESTADO/PLAN).
- **Decisiones tomadas en ejecución:** tres, todas mecánicas, ninguna de producto. (1) La instrucción ubicaba `InfoCard.tsx` en `src/components/ui/`; el archivo real —único en el repo, cero consumidores, el mismo que cita la auditoría (`text-body` en :19, `esquina™` en :30)— vive en `src/components/sections/work/`. Se borró el real. (2) El destrackeo de los devserver logs y su regla de ignore ya estaban hechos en `a477018` (commit posterior al `2565d01` sobre el que se auditó); no se apendeó el bloque al `.gitignore` porque habría duplicado la regla `devserver*.log` ya presente en la línea 51. (3) El build de F1 falló por un artefacto stale del dev server (`.next/dev/types/validator.ts`, incluido en el typecheck por `tsconfig.json:30`) que aún importaba la ruta borrada; se le quitó ese bloque. Es caché regenerable, no versionada — en un checkout limpio el error no existe.
- **Mediciones / salidas de puertas:** línea base — lint: exit 0, sin errores ni warnings; build: exit 0 con los 2 warnings conocidos (NFT de Turbopack originado en `seed-sanity`, deprecación de `@sanity/image-url`). Final — lint: exit 0; build: exit 0 y **el warning NFT desapareció** al borrarse el seeder; solo persiste la deprecación de `@sanity/image-url`. Cero errores nuevos. Greps de consumidores (F1): `InfoCard` → solo dentro de su propio archivo; `@/components/ui/SanityImage` y `<SanityImage` → 0 (los tipos `SanityImageLike`/`SanityImageAsset` de `types/project.ts` quedan, los usa FunGallery); `@/types/service` → 0; `seed-sanity` → 0 en `src/`. Verificación extra: `SANITY_API_WRITE_TOKEN` en `src/` → 0 apariciones.
- **Pendientes que deja:** el borrado del seeder rige en producción recién con el próximo deploy (ver `docs/pendientes.md`). Observación para la capa de planificación: `esquina-estudio/AGENTS.md` existe, está versionado y sigue vigente (regla autogenerada de Next: leer `node_modules/next/dist/docs/` antes de escribir código, por breaking changes de la 16), pero el CLAUDE.md nuevo no lo menciona ni lo integra.
- **Verificación humana pendiente:** diff de `CLAUDE.md` + exactitud de plan-maestro/pendientes (Valentino); smoke visual de que nada cambió en `/`, `/work`, `/services`, `/contact`.
- **Commits:** `9e19461` (F1), `8590967` (F2), `00f57d7` (F3), más el de este cierre.
