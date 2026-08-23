# Registro de pendientes — Esquina Estudio

Deuda diferida, con contexto para retomarla. Lo mantiene la capa de planificación (B4/F8 lo actualizó, para cerrar la ronda). Formato: **[origen]** descripción — cuándo se retoma.

**Estado al 2026-08-21: la ronda está cerrada.** Lo de abajo es todo lo que queda, y nada de eso bloquea el deploy.

- **[Clientas]** Formato de entrega del logo grande del footer (lo preguntan en Final.pdf pág. 4). Responderles; es insumo del sprint de footer (B2).
- **[Clientas]** Gif/video de Team: contenido pendiente de ellas; el placeholder `VIDEO O GIF` queda hasta que llegue. No bloquea código.
- **[PDF]** La frase nueva difiere en puntuación entre el hero (pág. 2: «NOISE,») y el footer (págs. 4/8/12: «STAND OUT.»). Definir una sola contra mockup en el sprint B2-home/footer.
- ~~**[Auditoría 6.4]** Tokens de font-size del `@theme` huérfanos, `--cursor-*` y `--footer-height` sin consumidores.~~ **Cerrado en B4c:** al ir a borrarlos se verificó que **ya no existen en `globals.css`** —se habían ido en algún sprint anterior sin que nadie sincronizara la ficha—. Lo único que quedaba era `--color-gray`, duplicado de `--color-gray-brand`, y B4c lo borró. `--color-beige` **se queda**: es decisión de paleta, no limpieza.
- ~~**[Planificación]** Forma exacta de la variante ES del Portable Text de `project`.~~ **Resuelto: no hay variante.** El `content` no se traduce; quedó confirmado en B4.
- **[Auditoría 1.c]** `NEXT_PUBLIC_SITE_URL` no está definida → `metadataBase` cae al placeholder `your-site-name.netlify.app`. Fix chico: definirla en Netlify y `.env.local`. Colar en B2 o resolver a mano.
- ~~**[Auditoría]** Corroborar las mediciones (tipografía / Contact) contra un build de producción antes del cierre de la ronda.~~ **Resuelto:** desde B3.4 todo se mide sobre `npm run build` + `npm run start`, y B4 volvió a levantar la matriz completa de Contact así, en los dos idiomas.
- **[Auditoría 2.c/5]** `<main>` anidados en /team, /work, /work/[slug] y /fun-gallery (Contact y, desde B3.4, /services lo evitan y lo documentan). Semántica/a11y. Fuera de ronda.
- **[Auditoría 1.a]** No existen `error.tsx` ni `not-found.tsx`. Fuera de ronda.
- **[Repo]** 12 branches locales mergeadas a `main` (verificado 2026-08-15, `--no-merged` vacío). Borrado opcional manual: `git branch -d …`.
- **[Seguridad]** Regla nueva registrada: tooling de escritura a Sanity = script local fuera de `app/`, con guard; nunca ruta pública. (Origen: `/api/seed-sanity`, eliminado en B1.)
- **[Deploy]** El borrado de `/api/seed-sanity` rige en producción recién con el **próximo deploy**. Decidir si se despliega B1 solo o junto con B2.
- **[Método]** Evaluar instalar el harness ECC en este repo (hoy las puertas son `lint` + `build` nativos). Fuera de ronda.
- ~~**[Ronda futura]** Adaptación mobile.~~ **Hecha:** sprint **M1**, 2026-08-22, nueve fases. Puntos de corte, decisiones y mediciones en `CLAUDE.md` §2b y en la entrada de bitácora.
- **[Ejecución B1]** Los types stale de `.next/dev/types/` rompen el typecheck cuando un sprint borra o renombra rutas con un `next dev` corriendo. Regla para sprints futuros: **regenerar** el artefacto (frenar el dev server y volver a correr el build), nunca editarlo a mano. Considerar bajar el dev server antes de sprints que muevan rutas.
- **[Método]** La Fase 0 de todo sprint verifica que HEAD coincida con el commit sobre el que se auditó (o registra explícitamente el delta), además de que el árbol esté limpio. Origen: en B1 se descubrió tarde que HEAD ya no era `2565d01`; el delta (`a477018`) resultó ser solo documentación, sin `src/`, así que la auditoría sigue siendo base válida.
- **[Docs]** Cuando la ronda cierre, revisar si las reglas de criterio y la directiva estética de `CLAUDE.md` §8 siguen reflejando cómo se trabajó, y ajustar con lo aprendido.
- ~~**[B3.4]** **GSAP quedó sin ningún consumidor en el repo** tras el desmontaje del acordeón de Services.~~ **Resuelto en B4c/F3:** desinstalado de `package.json`, del lockfile y de `node_modules` (5,97 MB en 179 archivos). El lockfile pasa de 1372 a 1371 paquetes, cero agregados y cero cambios de versión.
- **[B3.4]** El intro de `/services` mide exactamente una pantalla menos el header, así que Branding Packs empieza justo en el pliegue y **no asoma**. El mockup `08a` lo muestra asomando, pero el alto del recorte no es el de un viewport, así que no se puede deducir de ahí. Si la verificación visual quiere el asomo, es cambiar el `min-h` del intro por algo tipo `85vh`: una línea.
- **[B3.4]** Diferencias menores contra el mockup, asumidas y documentadas: (a) las reglas de ítems y las de sección terminan en el **mismo** borde derecho, mientras el mockup deja 51 px de sangría entre ellas; (b) la lista de ítems arranca a la altura del **nombre** del pack en los cuatro, mientras `08b` la baja una línea solo en Consultation; (c) los cortes de línea del título y la bajada de Branding Packs los decide el ancho de columna, así que pueden diferir en una palabra.
- **[B3.4]** Los apóstrofos del contenido de Services son **rectos** (`we're`, `can't`, `LET'S`), tal como llegaron en el Apéndice A. Los mockups los muestran tipográficos (’). Si las clientas quieren el curvo, es una edición de `src/lib/services-content.ts` y nada más.
- **[B3.4]** El hover de LATEST PROJECTS también se dispara con el **foco de teclado**, para que quien tabula vea lo mismo que quien apunta. No está en el mockup; si molesta, se saca el par `onFocus`/`onBlur`.

## Abiertos al cerrar la ronda (B4/F8, 2026-08-21)

- ~~**[B4 · Dependencias]** **GSAP sigue instalado y sin un solo consumidor.**~~ **Resuelto en B4c/F3** (ver arriba).
- ~~**[B4 · Dependencias]** La prop **`blend` de `HoverButton` quedó huérfana**.~~ **Resuelta en B4c/F3**, y en el camino aparecieron dos más con el mismo problema: **`underlineDraw` y `underlineDrawDelay`**, cuyos consumidores —el CTA del Hero y el botón DISCOVER de `ServicesIntro`— habían desaparecido en B2 y B3.4. Las tres se fueron, junto con la rama de render del subrayado que se dibujaba solo. Los 9 call sites en 4 archivos siguen intactos.
- **[B4 · Diseño]** **Contraste del gris.** `gray-brand` (#939393) sobre off-white da **2,77:1** medido, por debajo del 4,5:1 de AA para texto normal y del 3:1 para texto grande; sobre off-black da 6,24:1 y sí pasa. Afecta a los detalles de Services, las pills sin marcar, los placeholders del formulario, los links secundarios de la ficha y el toggle EN/ES. Es atenuación deliberada, no un descuido: la decisión es de diseño y conviene tomarla una vez para todo el sitio.
- **[B4 · Contenido]** **Las doce casillas ES de los cuatro proyectos de Sanity están vacías.** El sitio en castellano muestra los proyectos en inglés por el fallback cruzado, así que no hay hueco ni error. Las traducciones propuestas están listas en `docs/sanity-piezas-es.md` para cargarlas a mano en el Studio.
- **[B4 · Contenido]** Dos cosas del dataset que decidieron mirar las clientas, anotadas en el mismo archivo: el tipeo **`FOOD & SEVERAGES`** por `FOOD & BEVERAGES`, y el proyecto **`matsutrabajo`**, que duplica a `matsu` y es candidato del cierre de `/services` (las cuatro portadas más recientes).
- **[B4 · Traducción]** **Dos decisiones de tono que conviene que Valentino confirme o cambie**, porque son de marca y no de código: (a) **`FUN GALLERY` → `GALERÍA`** en el menú —lo lúdico del nombre lo sostiene el título de la pantalla, «¡Divertite explorando nuestros proyectos!»— y (b) **`WORK` → `PROYECTOS`**. Las dos son una línea en `src/lib/i18n/es.ts`.
- **[B4 · Fit]** El questionnaire **no entra sin scroll con los dos mensajes de validación a 720 px de alto** en los anchos ≥ 1600 (pide 740). Es el piso que dejó B2.7 y **falla igual en los dos idiomas**: no es una regresión del castellano. Solo se retoma si aparece un caso real de 1920×720.
- ~~**[B4 · Mobile]** El menú de mobile no está diseñado.~~ **Resuelto en M1/F1:** los links bajan a 34/40 —a 48 px `CONTACTANOS` medía 350,7 y no entraba en 320—, la hamburguesa y el botón de cierre pasan a cajas de 44 × 44 y el toggle de idioma toma su área táctil con un `::after` que no toca la caja que mide la barrita.
- **[B4 · Método]** La **técnica de medición** que quedó afinada: `iframe` same-origin de tamaño fijo para tener el viewport exacto (la pantalla física no llega a 1080 de alto útil), medidor de texto con las fuentes reales del documento para probar traducciones **antes** de escribirlas, y espía de `fetch` para ejercitar el formulario entero sin que salga un solo mail. Sigue vigente el límite de siempre: con la pestaña en segundo plano **no corre `requestAnimationFrame`**, así que ninguna animación se puede observar y las capturas salen parciales; las capturas de este sprint salieron bien porque la pestaña estaba activa.

## Abiertos al cerrar M1 (adaptación mobile, 2026-08-22)

Todo lo de acá es **decisión de diseño con el teléfono en la mano**, no deuda
técnica: son cosas que se ajustan con una constante y que el agente no toca
porque §3 de la instrucción no las cubría.

- **[M1 · Diseño]** **El tamaño de los objetos de Fun Gallery en mobile.** La
  instrucción pedía «el mismo criterio de B3.3c», que es *el lado mayor del
  objeto vale el 20 % del ancho del viewport*, y así quedó: **64 px a 320, 78 a
  390 y 86 a 430** —exactamente la misma proporción que los 384 px de un 1920—.
  La escena de entrada entra completa en los tres anchos. Si en la mano se siente
  chico, es **una constante**: `TARGET_MAX_ITEM_VIEWPORT_SHARE` en
  `FunGallery.tsx`. Ojo con el efecto secundario: subirla agranda los objetos y
  **estira el alto de la composición**, que es justo lo que §3.3 autorizaba
  («puede ser más alta que la pantalla y scrollear»).
- **[M1 · Diseño]** **Las cuatro portadas del cierre de Services siguen en una
  fila** en mobile: a 390 miden 89 × 67 px cada una. §3.2 pedía que se mostraran
  quietas y que fueran cuatro, y eso se respetó; pasarlas a 2 × 2 sería una
  decisión nueva. Cada una supera el piso táctil de 44 × 44.
- **[M1 · Diseño]** **Los pares de `dualMedia` de la ficha de proyecto siguen
  lado a lado** en mobile: a 390 cada mitad mide 170 px de ancho. Es una
  composición de dos que el contenido declara a propósito, así que no se partió.
  **Ningún proyecto del dataset usa hoy ese bloque**, así que no se pudo ver
  renderizado.
- **[M1 · Diseño]** **El header sigue midiendo 128 px en mobile.** En un teléfono
  de 640 de alto es el 20 % de la pantalla. La instrucción acotaba el Navbar a
  «verificar», así que no se tocó. Bajarlo es **una línea**: una media query
  sobre `--header-height` en `globals.css`; todo lo demás lo lee de ahí
  (`scroll-mt`, el offset del spy de Services, el `-mt` de la pantalla de éxito).
- **[M1 · Diseño]** **El footer de home mide 488 px en mobile** (una columna, con
  las áreas táctiles de 44 px adentro). Por eso home deja de entrar en una
  pantalla exacta debajo de 1024: el hero se queda con la pantalla menos el
  header y el footer se alcanza scrolleando. Está escrito en `page.tsx`.
- **[M1 · Verificación]** **Lo que el agente no puede probar** y queda para el
  teléfono: que el tap despliegue la galería y que el flotado se vea bien, que
  el menú hamburguesa se sienta bien al abrirse y cerrarse, que el formulario se
  complete y se envíe entero —selects incluidos— y que al enfocar un input la
  pantalla **no** haga zoom. Lo medible ya está medido.
- **[M1 · Método]** **El banco de medición tiene ±1 px de ruido** en el alto del
  documento cuando una imagen decide un alto fraccionario (el logo grande del
  footer mide 571,672 px sin decodificar y 572 decodificado). Se resolvió
  forzando `loading=eager` y esperando a que **todas** las imágenes estén
  `complete` antes de medir; sin eso, dos corridas del mismo código difieren.
  Y dos límites del entorno que conviene tener escritos: con la pestaña oculta
  Chrome **estrangula los temporizadores** a uno por minuto y **no corre
  `requestAnimationFrame`**, así que el banco no puede usar `setTimeout` para
  asentar ni observar una sola animación.

## Abiertos al cerrar B4c (2026-08-22)

- ~~**[B4c · Diseño]** **La revisión país por país del set de banderas.**~~
  **Dado de baja en B4d (2026-08-22): el set dibujado a mano se retiró entero.**
  Las cinco limitaciones que este punto listaba —`diagonal` de dos colores
  (Congo y RD del Congo), `panels` de dos bandas al batiente (Emiratos y Omán),
  los emblemas resueltos con silueta (España, India, Líbano), Antigua y Barbuda
  entrando por descarte, y los tercios parejos de `horizontal-tricolor`
  (Letonia)— **ya no aplican**: eran propiedades de los 44 patrones
  geométricos, y ahora cada país tiene su SVG real. Ver `docs/banderas-set.md`.

  Lo que **sí queda del lado humano**, y es otra cosa: revisar la hoja de
  contactos de B4d confirmando que las 196 se ven correctas, y decidir si el
  **gris en reposo** cierra dentro del sitio. Es la concesión estética del
  cambio: antes era line-art (contornos), ahora son manchas de gris con la
  forma correcta. Si no cierra, la alternativa es color pleno siempre.
- **[B4c · Método]** **Con la pestaña oculta, Chrome estrangula los `setTimeout`
  a uno por segundo y no corre `requestAnimationFrame`.** Ya estaba anotado; en
  B4c costó dos intentos de banco de medición. La salida es **ceder con
  `MessageChannel`**, que no se estrangula: `postMessage` sobre un canal propio
  da un tick de macrotarea real y además deja terminar la hidratación de React,
  que se programa sobre el mismo mecanismo. Consecuencia que hay que aceptar:
  **el timing del toggle de idioma no se puede cronometrar** desde el agente;
  se verifica por derivación de las constantes y a ojo, del lado humano.

## Abiertos al cerrar M2 (2026-08-23)

- **[M2 · Diseño]** **El prefooter en fila no entra a 320 ni a 360.** El punto 6
  pedía la frase a la izquierda y el bloque de contacto a la derecha, alineado
  abajo. Los dos bloques tienen ancho mínimo propio —la frase, su palabra más
  larga (146 px en castellano a 26 px); el bloque de contacto, su corte de línea
  escrito, que por contrato no se deja al ancho del navegador— y la suma pide
  328 px contra los 272 de caja útil a 320. Se resolvió con `flex-wrap`: **donde
  entra va en fila (390, 414, 430) y donde no, el bloque baja solo** y queda como
  estaba. Las alternativas eran bajar la frase de la marca a 18 px o partir un
  corte de línea que es decisión de diseño; las dos parecían peores que apilar en
  los dos anchos más chicos. Si la verificación humana quiere la fila también a
  320, la decisión es de tipografía y hay que tomarla.
- **[M2 · Diseño]** **El logo script no aparece en el footer de mobile.** Con él,
  la línea del nivel 2 —`© 2024` + el crédito— se va a 335 px contra 272 de caja
  útil a 320. El punto 7 enumera lo que lleva la fila de mobile y el logo no está
  en esa lista, así que se ocultó debajo de 1024. En escritorio no cambia nada.
- **[M2 · Acoplamiento]** **El alto del footer de home viaja como número.** `/`
  entra en una pantalla porque el bloque del hero **resta** el alto del footer:
  236 px en mobile y 164 en escritorio, escritos en `mobile-layout.ts` y en
  `page.tsx`. No hay forma de medirlo desde el bloque —son archivos hermanos y el
  layout tiene que salir del servidor—, así que es la misma convención que el
  escritorio arrastra desde B2. **Si el footer cambia, hay que volver a medir**;
  el chequeo es `docH === viewH` en `/` en los cinco anchos y los dos idiomas.
- **[M2 · Método]** **La extensión de Chrome no estaba disponible**, así que las
  mediciones de este sprint salieron de un banco propio sin dependencias: Chrome
  `--headless=new` manejado por el DevTools Protocol sobre el `WebSocket` nativo
  de Node. Resuelve el límite que arrastraban B4c y B4d —con la pestaña oculta no
  corren `requestAnimationFrame` ni la carga diferida—, porque en headless la
  página se pinta de verdad. Vive fuera del repo. Vale la pena considerar dejarlo
  como herramienta del proyecto en el sprint que instale el harness.
- **[M2 · Contenido]** El dataset de Sanity **ya tiene las ocho imágenes de la
  Fun Gallery** cargadas (al 2026-08-23 la ruta renderiza la composición y no la
  pantalla de vacío). La ficha de `CLAUDE.md` §5 decía «0 `funGalleryImage`» con
  fecha 2026-08-19 y quedó vieja por contenido, no por código.
