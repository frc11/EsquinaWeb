# Registro de pendientes — Esquina Estudio

Deuda diferida, con contexto para retomarla. Lo mantiene la capa de planificación. Formato: **[origen]** descripción — cuándo se retoma.

- **[Clientas]** Formato de entrega del logo grande del footer (lo preguntan en Final.pdf pág. 4). Responderles; es insumo del sprint de footer (B2).
- **[Clientas]** Gif/video de Team: contenido pendiente de ellas; el placeholder `VIDEO O GIF` queda hasta que llegue. No bloquea código.
- **[PDF]** La frase nueva difiere en puntuación entre el hero (pág. 2: «NOISE,») y el footer (págs. 4/8/12: «STAND OUT.»). Definir una sola contra mockup en el sprint B2-home/footer.
- **[Auditoría 6.4]** Tokens de font-size del `@theme` huérfanos, `--cursor-*` y `--footer-height` sin consumidores: adoptar como punto central o borrar. Decisión del ritual de B2.
- **[Planificación]** Forma exacta de la variante ES del Portable Text de `project` (duplicar solo texto, no media). Ritual de B3.
- **[Auditoría 1.c]** `NEXT_PUBLIC_SITE_URL` no está definida → `metadataBase` cae al placeholder `your-site-name.netlify.app`. Fix chico: definirla en Netlify y `.env.local`. Colar en B2 o resolver a mano.
- **[Auditoría]** Corroborar las mediciones (tipografía / Contact) contra un build de producción antes del cierre de la ronda (todo se midió sobre `next dev`).
- **[Auditoría 2.c/5]** `<main>` anidados en /team, /work, /work/[slug] y /fun-gallery (Contact y, desde B3.4, /services lo evitan y lo documentan). Semántica/a11y. Fuera de ronda.
- **[Auditoría 1.a]** No existen `error.tsx` ni `not-found.tsx`. Fuera de ronda.
- **[Repo]** 12 branches locales mergeadas a `main` (verificado 2026-08-15, `--no-merged` vacío). Borrado opcional manual: `git branch -d …`.
- **[Seguridad]** Regla nueva registrada: tooling de escritura a Sanity = script local fuera de `app/`, con guard; nunca ruta pública. (Origen: `/api/seed-sanity`, eliminado en B1.)
- **[Deploy]** El borrado de `/api/seed-sanity` rige en producción recién con el **próximo deploy**. Decidir si se despliega B1 solo o junto con B2.
- **[Método]** Evaluar instalar el harness ECC en este repo (hoy las puertas son `lint` + `build` nativos). Fuera de ronda.
- **[Ronda futura]** Adaptación mobile: chat propio + skill dedicada, con los datos de breakpoints y contratos de animación de la auditoría.
- **[Ejecución B1]** Los types stale de `.next/dev/types/` rompen el typecheck cuando un sprint borra o renombra rutas con un `next dev` corriendo. Regla para sprints futuros: **regenerar** el artefacto (frenar el dev server y volver a correr el build), nunca editarlo a mano. Considerar bajar el dev server antes de sprints que muevan rutas.
- **[Método]** La Fase 0 de todo sprint verifica que HEAD coincida con el commit sobre el que se auditó (o registra explícitamente el delta), además de que el árbol esté limpio. Origen: en B1 se descubrió tarde que HEAD ya no era `2565d01`; el delta (`a477018`) resultó ser solo documentación, sin `src/`, así que la auditoría sigue siendo base válida.
- **[Docs]** Cuando la ronda cierre, revisar si las reglas de criterio y la directiva estética de `CLAUDE.md` §8 siguen reflejando cómo se trabajó, y ajustar con lo aprendido.
- **[B3.4]** **GSAP quedó sin ningún consumidor en el repo** tras el desmontaje del acordeón de Services (verificado con grep: cero imports de `gsap` y de `gsap/ScrollTrigger`). Sigue en `package.json`. Desinstalarlo es un cambio de dependencias, fuera del alcance de un sprint de sección: decidir en el cierre de la ronda.
- **[B3.4]** El intro de `/services` mide exactamente una pantalla menos el header, así que Branding Packs empieza justo en el pliegue y **no asoma**. El mockup `08a` lo muestra asomando, pero el alto del recorte no es el de un viewport, así que no se puede deducir de ahí. Si la verificación visual quiere el asomo, es cambiar el `min-h` del intro por algo tipo `85vh`: una línea.
- **[B3.4]** Diferencias menores contra el mockup, asumidas y documentadas: (a) las reglas de ítems y las de sección terminan en el **mismo** borde derecho, mientras el mockup deja 51 px de sangría entre ellas; (b) la lista de ítems arranca a la altura del **nombre** del pack en los cuatro, mientras `08b` la baja una línea solo en Consultation; (c) los cortes de línea del título y la bajada de Branding Packs los decide el ancho de columna, así que pueden diferir en una palabra.
- **[B3.4]** Los apóstrofos del contenido de Services son **rectos** (`we're`, `can't`, `LET'S`), tal como llegaron en el Apéndice A. Los mockups los muestran tipográficos (’). Si las clientas quieren el curvo, es una edición de `src/lib/services-content.ts` y nada más.
- **[B3.4]** El hover de LATEST PROJECTS también se dispara con el **foco de teclado**, para que quien tabula vea lo mismo que quien apunta. No está en el mockup; si molesta, se saca el par `onFocus`/`onBlur`.
