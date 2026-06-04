<!-- Destino: /design-refs/header/BRIEF.md (reemplaza el de ronda 1) -->
# HEADER — Corrección (ronda 2)

Archivos: `src/components/layout/Navbar.tsx`, `src/components/ui/HoverButton.tsx` (compartido — cambio aditivo / mínimo).

## Bug — queda una línea gris bajo el tab después del hover
**Síntoma:** al hacer hover en un tab y sacar el mouse, queda una **línea gris tenue** debajo que no se va; vuelve a desaparecer si hago hover de nuevo (ver imagen: SERVICES con línea residual mientras WORK es el activo).
**Diagnóstico — encontrá el origen exacto en devtools (no parche a ciegas):** el sospechoso #1 es el **fill del hover volviendo a `y:102%`**, que deja un hairline anti-aliased (borde del fill) visible al settear el spring. Otros candidatos: un `border`/línea introducido por `balancedPadding`, o el indicador de subrayado activo dejando un rastro.
**Fix probable:**
- Empujá la posición idle del fill claramente fuera (p. ej. `y:110%` en vez de `102%`) y/o reforzá el `overflow-hidden` del contenedor, para que no quede ningún borde visible al volver a idle.
- Verificá que `balancedPadding` no haya dejado un `border`/underline persistente.
- No rompas el padding balanceado ni el indicador activo.

## Aceptación
- [ ] Tras hacer hover y salir de CADA tab, **no queda ninguna línea** debajo.
- [ ] Se mantiene: padding balanceado en los 4 lados, indicador de subrayado activo correcto, logo y alto del header.
- [ ] Sin regresiones en los otros usos de `HoverButton` (Home CTA, DISCOVER de Services, SEND de Contact, Fun Gallery, footer).

## Self-check
`tsc`/`eslint`/`build` ok · dev `-p 3005`: hover y salir en cada tab → sin residuo (comparar con la imagen del bug). Reverificá los otros HoverButton.
