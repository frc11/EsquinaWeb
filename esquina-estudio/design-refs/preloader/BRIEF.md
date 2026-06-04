<!-- Destino: /design-refs/preloader/BRIEF.md (carpeta nueva) -->
# PRELOADER — Mostrar una vez por sesión (ronda 2, lane nuevo)

Archivo: `src/components/providers/PreloaderProvider.tsx` (confirmá la ruta real del provider del preloader).

## Objetivo
El preloader debe correr **una sola vez por sesión** (al entrar al sitio), **no en cada recarga**. Usar `sessionStorage` (persiste entre recargas de la misma pestaña; se limpia al cerrarla → vuelve a aparecer en una sesión nueva).

## Qué hacer
- En el init del provider: leé `sessionStorage` (con guarda SSR: solo en cliente, `typeof window !== "undefined"`, dentro de `useEffect` o lazy initializer).
- **Si ya se mostró esta sesión** (flag presente): saltá el preloader por completo → `isPreloaderDone = true` inmediatamente, **sin animación**.
- **Si no:** corré el preloader como siempre y, al completarse, seteá el flag (`sessionStorage.setItem("esquina:preloaderShown","1")`).
- No rompas el contrato de `usePreloader()` / `isPreloaderDone` que consumen Work, Services y Contact (sigue exponiendo lo mismo; cambia solo cuándo arranca).

## Aceptación
- [ ] Primera visita de la sesión: el preloader corre normal.
- [ ] Recargar (misma pestaña): NO vuelve a correr; el sitio entra directo.
- [ ] Cerrar y reabrir la pestaña (sesión nueva): vuelve a correr.
- [ ] Sin errores de hidratación SSR.

## Self-check
`tsc`/`eslint`/`build` ok · dev `-p 3006`, `/`: cargar (corre) → recargar (no corre) → cerrar/reabrir pestaña (corre). Sin warnings de hydration en consola.
