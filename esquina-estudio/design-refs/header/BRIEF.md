<!-- Destino en el repo: /design-refs/header/BRIEF.md -->
# HEADER — Brief de cambios

## Imágenes de referencia (en esta carpeta)
- `before-header-full.png` — Header actual (logo grande, padding vertical asimétrico).
- `reference-funtab-hover-balanced.png` — Tab FUN GALLERY en hover: recuadro negro **balanceado** (referencia del objetivo).
- `before-servicestab-hover-tight.png` — Tab SERVICES en hover: recuadro negro **apretado** horizontalmente (el problema).

---

## Request 1 — Logo más chico, sin cambiar el header
**Ahora:** `LogoScript` (header, `size="md"`) usa `h-16` (64px). La fila del header tiene padding asimétrico (`pt-12 pb-6`), así que el logo no queda centrado verticalmente.
**Queremos:** **achicar el logo**, pero:
- **No** cambiar el alto del header ni moverlo de lugar (queda donde está).
- El logo **centrado verticalmente** dentro del header.
- Los **tabs alineados a la mitad vertical del logo**.

## Request 2 — Padding parejo en el hover negro de los tabs
**Ahora:** el recuadro negro del hover tiene más distancia arriba/abajo que izquierda/derecha, y además es inconsistente entre tabs (por los anchos fijos por tab).
**Queremos:** que **cada tab** tenga la **misma distancia top/bottom que left/right** en el recuadro negro. Consistente en todos los tabs, balanceado como en `reference-funtab-hover-balanced.png`.

---

## Criterios de aceptación
- [ ] El logo se ve más chico.
- [ ] El alto del header NO cambia (sigue 128px) y no se mueve de su posición.
- [ ] El logo queda centrado verticalmente; los tabs alineados a su mitad vertical.
- [ ] El recuadro negro del hover tiene padding visualmente igual en los 4 lados, en TODOS los tabs.
- [ ] El indicador de subrayado activo sigue alineado bajo los tabs.
- [ ] **Sin regresiones** en los demás usos de `HoverButton`: Fun Gallery, CTA del Home, botón DISCOVER de Services, SEND de Contact, links del Footer (INSTAGRAM/LINKEDIN/develOP/LET'S WORK TOGETHER).
- [ ] El logo del footer (usa `size="sm"`) NO cambia.

## Notas de causa raíz (no apilar parches)
- **Logo:** `size="md"` es exclusivo del header → achicar el `h-16` de ese caso afecta solo al header (grep para confirmar que `md` no se usa en otro lado). `--header-height` está en `globals.css` → **NO tocar** (el header no debe cambiar de alto). Balancear el padding vertical de la fila para centrar el logo; alinear el grupo de tabs (hoy `absolute` sin `top`) al centro vertical (`top-1/2 -translate-y-1/2` o pasarlo a flujo flex con `items-center`).
- **Hover:** el padding vive en `HoverButton` (`textPaddingClass` = `py-[2px] px-[1px]`, vertical > horizontal) + los **anchos fijos por tab** del Navbar (`w-[43px]`/`w-[68px]`/`w-[102px]`/`w-[40px]`) que hacen el espacio horizontal inconsistente.
- **`HoverButton` es COMPARTIDO** (Navbar, Footer, Home, Services, Contact). Para no afectar a los demás: **agregar un prop opcional** (ej. `balancedPadding`) con default = comportamiento actual, y usarlo SOLO en los tabs; además **quitar los anchos fijos por tab** para que cada uno abrace su texto con padding parejo. Cambio aditivo → los demás usos quedan idénticos.
- Al quitar los anchos fijos, el indicador de subrayado re-mide posiciones → verificar que sigue alineado.
