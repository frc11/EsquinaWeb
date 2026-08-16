# Registro de pendientes — Esquina Estudio

Deuda diferida, con contexto para retomarla. Lo mantiene la capa de planificación. Formato: **[origen]** descripción — cuándo se retoma.

- **[Clientas]** Formato de entrega del logo grande del footer (lo preguntan en Final.pdf pág. 4). Responderles; es insumo del sprint de footer (B2).
- **[Clientas]** Gif/video de Team: contenido pendiente de ellas; el placeholder `VIDEO O GIF` queda hasta que llegue. No bloquea código.
- **[PDF]** La frase nueva difiere en puntuación entre el hero (pág. 2: «NOISE,») y el footer (págs. 4/8/12: «STAND OUT.»). Definir una sola contra mockup en el sprint B2-home/footer.
- **[PDF]** «Un solo scroll ya va a branding packs» — nice-to-have del intro de Services. Evaluar en el ritual de B3.
- **[Auditoría 6.4]** Tokens de font-size del `@theme` huérfanos, `--cursor-*` y `--footer-height` sin consumidores: adoptar como punto central o borrar. Decisión del ritual de B2.
- **[Planificación]** Forma exacta de la variante ES del Portable Text de `project` (duplicar solo texto, no media). Ritual de B3.
- **[Auditoría 1.c]** `NEXT_PUBLIC_SITE_URL` no está definida → `metadataBase` cae al placeholder `your-site-name.netlify.app`. Fix chico: definirla en Netlify y `.env.local`. Colar en B2 o resolver a mano.
- **[Auditoría]** Corroborar las mediciones (tipografía / Contact) contra un build de producción antes del cierre de la ronda (todo se midió sobre `next dev`).
- **[Auditoría 2.c/5]** `<main>` anidados en /services, /team, /work, /work/[slug] y /fun-gallery (Contact lo evita y lo documenta). Semántica/a11y. Fuera de ronda.
- **[Auditoría 1.a]** No existen `error.tsx` ni `not-found.tsx`. Fuera de ronda.
- **[Repo]** 12 branches locales mergeadas a `main` (verificado 2026-08-15, `--no-merged` vacío). Borrado opcional manual: `git branch -d …`.
- **[Seguridad]** Regla nueva registrada: tooling de escritura a Sanity = script local fuera de `app/`, con guard; nunca ruta pública. (Origen: `/api/seed-sanity`, eliminado en B1.)
- **[Deploy]** El borrado de `/api/seed-sanity` rige en producción recién con el **próximo deploy**. Decidir si se despliega B1 solo o junto con B2.
- **[Método]** Evaluar instalar el harness ECC en este repo (hoy las puertas son `lint` + `build` nativos). Fuera de ronda.
- **[Ronda futura]** Adaptación mobile: chat propio + skill dedicada, con los datos de breakpoints y contratos de animación de la auditoría.
