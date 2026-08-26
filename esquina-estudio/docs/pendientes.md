# Registro de pendientes — Esquina Estudio

Deuda diferida, con contexto para retomarla. Lo mantiene la capa de planificación (B4/F8 lo actualizó, para cerrar la ronda). Formato: **[origen]** descripción — cuándo se retoma.

**Estado al 2026-08-26: la ronda está cerrada y archivada (M6).** Lo de abajo es todo lo que queda, y nada de eso bloquea el deploy.

**Si venís a planificar el próximo sprint, empezá por la última sección**, «Abiertos al cerrar M6»: ahí está consolidado lo que sigue vivo. El resto del archivo es historia por sprint, con lo resuelto tachado.

- **[Clientas]** Formato de entrega del logo grande del footer (lo preguntan en Final.pdf pág. 4). Responderles; es insumo del sprint de footer (B2).
- **[Clientas]** Gif/video de Team: contenido pendiente de ellas; el placeholder `VIDEO O GIF` queda hasta que llegue. No bloquea código.
- **[PDF]** La frase nueva difiere en puntuación entre el hero (pág. 2: «NOISE,») y el footer (págs. 4/8/12: «STAND OUT.»). Definir una sola contra mockup en el sprint B2-home/footer.
- ~~**[Auditoría 6.4]** Tokens de font-size del `@theme` huérfanos, `--cursor-*` y `--footer-height` sin consumidores.~~ **Cerrado en B4c:** al ir a borrarlos se verificó que **ya no existen en `globals.css`** —se habían ido en algún sprint anterior sin que nadie sincronizara la ficha—. Lo único que quedaba era `--color-gray`, duplicado de `--color-gray-brand`, y B4c lo borró. `--color-beige` **se queda**: es decisión de paleta, no limpieza.
- ~~**[Planificación]** Forma exacta de la variante ES del Portable Text de `project`.~~ **Resuelto en M6/F3, y al revés de como lo había cerrado B4.** B4 anotó «no hay variante: el `content` no se traduce», que era la consecuencia de no haber encontrado una forma que no duplicara los bloques de media. M6/F3 la encontró: **`contentEs`, de solo texto**, con las imágenes tomadas de `content` y emparejamiento por posición entre los bloques de texto. Ver `src/lib/project-text.ts`.
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
- ~~**[B3.4]** El intro de `/services` no asoma; si la verificación visual quiere el asomo, es cambiar el `min-h`.~~ **Cerrado al revés en M3/F6:** la devolución pidió lo contrario —que **no** se asome, porque se estaba asomando en el teléfono—. La medición confirmó que en el banco nunca se asoma (21 combinaciones, el borde del intro cae exacto en el alto del viewport en todas), así que el único mecanismo posible era la barra del navegador: `svh` es el viewport con la barra puesta y al retraerse quedan visibles 60–110 px de más, que superan los 80 de aire del rótulo. El intro pasó a `lvh`. **Queda sin verificar en dispositivo real** (ver la sección de M3).
- **[B3.4]** Diferencias menores contra el mockup, asumidas y documentadas: (a) las reglas de ítems y las de sección terminan en el **mismo** borde derecho, mientras el mockup deja 51 px de sangría entre ellas; (b) la lista de ítems arranca a la altura del **nombre** del pack en los cuatro, mientras `08b` la baja una línea solo en Consultation; (c) los cortes de línea del título y la bajada de Branding Packs los decide el ancho de columna, así que pueden diferir en una palabra.
- **[B3.4]** Los apóstrofos del contenido de Services son **rectos** (`we're`, `can't`, `LET'S`), tal como llegaron en el Apéndice A. Los mockups los muestran tipográficos (’). Si las clientas quieren el curvo, es una edición de `src/lib/services-content.ts` y nada más.
- **[B3.4]** El hover de LATEST PROJECTS también se dispara con el **foco de teclado**, para que quien tabula vea lo mismo que quien apunta. No está en el mockup; si molesta, se saca el par `onFocus`/`onBlur`.

## Abiertos al cerrar la ronda (B4/F8, 2026-08-21)

- ~~**[B4 · Dependencias]** **GSAP sigue instalado y sin un solo consumidor.**~~ **Resuelto en B4c/F3** (ver arriba).
- ~~**[B4 · Dependencias]** La prop **`blend` de `HoverButton` quedó huérfana**.~~ **Resuelta en B4c/F3**, y en el camino aparecieron dos más con el mismo problema: **`underlineDraw` y `underlineDrawDelay`**, cuyos consumidores —el CTA del Hero y el botón DISCOVER de `ServicesIntro`— habían desaparecido en B2 y B3.4. Las tres se fueron, junto con la rama de render del subrayado que se dibujaba solo. Los 9 call sites en 4 archivos siguen intactos.
- **[B4 · Diseño]** **Contraste del gris.** `gray-brand` (#939393) sobre off-white da **2,77:1** medido, por debajo del 4,5:1 de AA para texto normal y del 3:1 para texto grande; sobre off-black da 6,24:1 y sí pasa. Afecta a los detalles de Services, las pills sin marcar, los placeholders del formulario, los links secundarios de la ficha y el toggle EN/ES. Es atenuación deliberada, no un descuido: la decisión es de diseño y conviene tomarla una vez para todo el sitio.
- ~~**[B4 · Contenido]** **Las doce casillas ES de los cuatro proyectos de Sanity están vacías.**~~ **Al 2026-08-26 las ocho de una línea que quedaban están cargadas** (`Category` y `Services` de los tres proyectos; los tres `Title (ES)` van vacíos a propósito, porque son marcas). Lo que sigue abierto es el **cuerpo**, cuyo campo `contentEs` entró en M6/F3 — ver la sección de cierre.
- **[B4 · Contenido]** Dos cosas del dataset que decidieron mirar las clientas: el tipeo **`FOOD & SEVERAGES`** por `FOOD & BEVERAGES` —sigue abierto— y el proyecto **`matsutrabajo`**, ~~que duplica a `matsu`~~ **que Valentino borró del dataset** (verificado el 2026-08-26: quedan tres `project` publicados).
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
- ~~**[M1 · Diseño]** Las cuatro portadas del cierre de Services siguen en una
  fila en mobile; pasarlas a 2 × 2 sería una decisión nueva.~~ **Tomada en
  M3/F6:** de 1024 para arriba van en **2 × 2** y debajo en **una sola columna**,
  que es lo que salió de medir —a 390 la cuadrícula de dos daría portadas de
  184 × 138 px, más chicas que las tarjetas de `/work`, contra 374 × 280,5 en una
  columna—. Además los dos links pasaron a ir **después** de las portadas.
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
- ~~**[M2 · Diseño]** **El logo script no aparece en el footer de mobile.**~~
  **Cerrado en M4/F3: volvió.** El conflicto era compartir línea con el crédito
  —los dos juntos piden 305,53 px contra 272 de caja útil a 320—, y la salida fue
  darle **fila propia** al pie, a la derecha, en los cinco anchos. Baja a 48 px
  de alto en mobile (la altura del logo del header). En escritorio no cambió
  nada: ahí sigue cerrando la fila a 120,47 × 80.
- **[M2 · Acoplamiento]** **El alto del footer de home viaja como número.** `/`
  entra en una pantalla porque el bloque del hero **resta** el alto del footer:
  **304 px en mobile desde M4/F3** —eran 244 en M3 y 236 en M2— y 164 en
  escritorio, escritos
  en `mobile-layout.ts` y en `page.tsx`. No hay forma de medirlo desde el bloque —son archivos hermanos y el
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

## Abiertos al cerrar M3 (2026-08-23)

- **[M3 · Verificación]** **Tres cosas de este sprint no se pueden verificar en el
  banco y quedan para el dispositivo real.** Las tres son el mismo fenómeno: en un
  viewport emulado `vh`, `svh`, `lvh` y `dvh` valen todos lo mismo, porque no hay
  barra de navegador que se retraiga. (a) El scroll sobrante de `/` y de
  `/contact/success` —el mecanismo se demostró forzando el `min-height` a mano,
  pero el síntoma tal como se reportó no reproduce—; (b) el asomo de
  «BRANDING PACKS» en `/services`, que no reproduce en ninguna de las 21
  combinaciones medidas; (c) el corrimiento de ~40 px del contenido del intro que
  introduce el paso a `lvh` cuando la barra está puesta. Las tres son de una línea
  si en la mano se ven distinto.
- **[M3 · Diseño]** **La cuadrícula de LATEST PROJECTS es grande.** A 1920 cada
  portada mide 949 × 711,8 px y el bloque entero —título, descripción y las
  cuatro— mide 1698 px, o sea más de una pantalla y media. Es exactamente lo que
  pidió el punto 10 («que las portadas ocupen su propio espacio»), pero es un
  cambio de escala fuerte para esa sección: si en pantalla se siente excesivo, es
  el `aspect-[4/3]` o el ancho de la columna, una línea en `LatestProjects.tsx`.
- **[M3 · Diseño]** **La duración de la cortina pasó de 2700 a 4000 ms** (3000 de
  video + 1000 de deslizamiento). Es lo que pidió la instrucción —la cortina dura
  lo que dura el video—, pero son 1,3 s más de espera antes de ver el sitio en la
  primera visita de cada pestaña. Si se quiere recortar, lo que se puede tocar sin
  romper nada es el deslizamiento de salida (`EXIT_DURATION`), no el hold: acortar
  el hold corta el video antes de que el logo termine de dibujarse.
- **[M3 · Contenido]** **`/work/tukumi-takeaway` no tiene ningún bloque de media
  cargado en Sanity**, así que es la única ficha donde el indicador de carga nuevo
  no aparece nunca. `matsu` tiene uno y `akasha-blends` tres. No es un defecto de
  código; se anota porque desconcierta al verificarlo.
- **[M3 · Método]** El banco de medición de M2 —Chrome headless por el DevTools
  Protocol— se reutilizó entero y se le sumaron tres técnicas que conviene
  conservar: **screencast** (`Page.startScreencast`) para probar qué se pintó y
  cuándo, que es lo que permitió medir que nada del sitio se ve antes de la
  cortina; **interceptación por el dominio `Fetch`** para demorar un tipo de
  recurso sin tocar el resto, sin la cual el indicador de carga no se puede
  observar (estrangular toda la red demora también el bundle y React no llega a
  hidratar); y **`Emulation.setEmulatedMedia`** para `prefers-reduced-motion`.
- **[M3 · Asset]** El `.mp4` original quedó en `C:/Users/Valentino/Downloads/` y no
  se movió ni se borró: el repo solo tiene el derivado procesado
  (`public/preloader-logo.mp4`, sin audio). Si hace falta rehacerlo, el comando es
  `ffmpeg -i <origen> -an -c:v copy -movflags +faststart`.

## Abiertos al cerrar M4 (2026-08-24)

- ~~**[M4 · Diseño]** **El footer claro de mobile pasó de 244 a 304 px**, y eso lo
  paga la pantalla de éxito en los teléfonos de **640 px de alto**. En
  `/contact/success` el bloque de texto mide 262,89 px (inglés) / 241,89
  (castellano) y el hueco libre entre el header y el footer bajó de 268 a 208, así
  que a **320 × 640** el bloque **se desplaza dentro del panel**: 55 px en inglés
  y 34 en castellano. La ruta sigue midiendo **una pantalla exacta**
  (`docH === viewH`, verificado en los cinco anchos y los dos idiomas) y el
  desplazamiento interno es un comportamiento que la sección ya implementa a
  propósito desde M2/F3; pero el vínculo `BACK TO HOME` queda debajo del pliegue
  hasta que se desliza. **De 800 de alto para arriba no hay desplazamiento
  interno**: 0 px en 360 × 800, 390 × 844, 414 × 896 y 430 × 932, en los dos
  idiomas.
  La causa es aritmética y no tiene arreglo dentro del alcance de M4: con el logo
  script de vuelta, el footer no puede bajar de 304 sin sacarle la fila, y el
  presupuesto de un viewport de 640 es 249.~~

  **Resuelto en M6/F2, y por una cuarta palanca que este registro no había
  visto.** Las tres anotadas eran (a) achicar los huecos, (b) achicar el logo del
  footer o (c) esconderlo; la decisión del sprint fue **comprimir el texto**. Y al
  medirlo apareció que el problema mayor no era la bajada sino **el título**: a
  320 la caja útil es de 272 px y `YOUR INQUIRY WAS SENT` pide 297,63 a 26 px, así
  que el h1 medía 81,89 (**tres** líneas) y no los 54,59 que este repo creía desde
  M2. El piso del título y el tamaño de la bajada pasaron a escalar con la altura
  de la pantalla por debajo de 800 —`min(26px,3.25svh)` y
  `clamp(12px,1.875svh,15px)`, o sea el valor de hoy escrito como proporción de
  una pantalla de 800—. Sobra **0 px en las 32 combinaciones** medidas y de 800 de
  alto para arriba el bloque sale **idéntico** al de antes, al centésimo.
- **[M4 · Diseño]** **La columna izquierda del footer queda con un hueco
  grande.** El criterio pedido es que las dos columnas terminen a la misma
  altura, y como la derecha tiene tres ítems y la izquierda dos, el segundo par
  de lugar baja hasta apoyarse en el borde de abajo: entre `ARGENTINA` y
  `WORKING` quedan 52 px. Es exactamente lo que pide la alineación de bordes
  inferiores, pero es el efecto visible de la decisión y conviene mirarlo en el
  teléfono. Efecto secundario que sí queda bien: cada ítem de la derecha cae
  **centrado contra el par de la izquierda** —`© 2024` a 0 px del centro de
  `WORKING / WORLDWIDE`, `INSTAGRAM` a 2 px del de `BORN IN / ARGENTINA`—.
- **[M4 · Diseño]** **El logo del footer bajó a 48 px de alto en mobile.** Es la
  altura del logo del header, o sea una medida que ya existía en el cromo, y sale
  de dos razones: a 80 px el logo del pie quedaba **más alto que el de arriba**,
  invirtiendo la jerarquía, y le costaba 32 px al alto del footer, que en un
  teléfono de 640 se los saca al hero de `/`. Si en la mano se ve chico, es una
  clase en `LogoScript.tsx` — pero subirlo obliga a volver a medir los dos
  números de `mobile-layout.ts`.
- **[M4 · Diseño]** **El relleno vertical de los dos footers bajó a 24 px en
  mobile** (eran 40 en el claro y 40 abajo en la banda oscura). Estaba calibrado
  para una fila de información de tres renglones; con cinco, esos 80 px de aire
  propio ya no caben en un teléfono bajo. De `lg` para arriba **no cambió nada**.
- **[M4 · Verificación]** **Lo que no se puede medir desde el banco** y queda para
  el teléfono: si el giro del ícono se siente coordinado con el panel (los
  números —200 ms, retardo 0 al abrir y 300 al cerrar— están verificados en el
  CSS computado, pero la sensación es humana), y si la composición de los dos
  footers cierra visualmente con el logo donde quedó.
- **[M4 · Método]** **El banco de medición de M2/M3 se volvió a construir desde
  cero**, porque vive fuera del repo: Chrome `--headless=new` manejado por el
  DevTools Protocol sobre el `WebSocket` nativo de Node, sin dependencias. Es la
  tercera vez que se reconstruye. Sigue valiendo la pena considerar dejarlo como
  herramienta del proyecto en el sprint que instale el harness.

## Abiertos al cerrar M6 y la ronda (2026-08-26)

**Esta es la lista viva.** Todo lo anterior es historia por sprint; lo que sigue
abierto de verdad está acá.

### Decisiones de diseño y de marca — son humanas, no técnicas

- **[Diseño]** **El contraste del gris de identidad.** `gray-brand` (#939393)
  sobre off-white da **2,77:1** medido, por debajo del 4,5:1 de AA para texto
  normal y del 3:1 para texto grande; sobre off-black da 6,24:1 y sí pasa. Lo
  usan los detalles de Services, las pills sin marcar, los placeholders del
  formulario, los links secundarios de la ficha y el toggle EN/ES. Es atenuación
  deliberada, no un descuido: **conviene tomar la decisión una vez para todo el
  sitio** en vez de parchearla componente por componente.
- **[Diseño]** **El gris de las banderas en tricolores de luminosidad parecida.**
  Desde B4d las banderas son SVG reales y van en escala de grises en reposo, a
  color en hover. La concesión conocida es que **dos franjas de colores distintos
  pero de luminosidad parecida quedan indistinguibles en gris**, y eso afecta
  sobre todo a los tricolores. La alternativa es color pleno siempre. Es un filtro
  CSS: la decisión es estética, no de implementación.
- **[Marca]** **`FUN GALLERY` → `GALERÍA`** en el menú en castellano, y
  **`WORK` → `PROYECTOS`**. Las dos son una línea en `src/lib/i18n/es.ts`. Lo
  lúdico del nombre lo sostiene igual el título de la pantalla
  («¡Divertite explorando nuestros proyectos!»).
- **[Diseño]** **El tamaño de la cuadrícula 2 × 2 de LATEST PROJECTS.** A 1920
  cada portada mide 949 × 711,8 px y el bloque entero mide 1698, o sea más de una
  pantalla y media. Es exactamente lo que se pidió («que las portadas ocupen su
  propio espacio»), pero es un cambio de escala fuerte: si en pantalla se siente
  excesivo, es el `aspect-[4/3]` o el ancho de la columna, una línea en
  `LatestProjects.tsx`.

### Contenido del dataset — lo deciden las clientas

- **[Contenido]** **El tipeo `FOOD & SEVERAGES`.** Estaba en `matsutrabajo`, que
  ya no está, pero **conviene revisar que no haya quedado en otro lado**: es un
  error por `FOOD & BEVERAGES` y se corrige desde el Studio.
- **[Contenido]** **El cuerpo de los proyectos en castellano.** El campo
  `contentEs` existe desde M6/F3 y está vacío en los tres proyectos. Las
  traducciones propuestas de los cinco bloques están escritas en
  `docs/sanity-piezas-es.md`, listas para cargar a mano. **El sitio funciona sin
  ellas**: sale el inglés, con las imágenes en su lugar.
- **[Contenido]** **Dos bloques del dataset que conviene mirar.** `akasha-blends`
  tiene un **segundo bloque de texto vacío** —no se ve, pero ocupa el espacio
  entre bloques— y `matsu` tiene un **segundo bloque idéntico al primero**,
  palabra por palabra. Los dos parecen accidentes de carga. Borrarlos o
  reemplazarlos es decisión de contenido, y conviene tomarla **antes** de cargar
  la traducción, porque el emparejamiento es por posición.
- **[Contenido]** **Gif/video de Team:** sigue pendiente de las clientas. El
  placeholder `VIDEO O GIF` queda hasta que llegue. No bloquea código.
- ~~**[Contenido]** El proyecto duplicado `matsutrabajo`.~~ **Dado de baja:
  Valentino lo borró del dataset.** Verificado el 2026-08-26: quedan tres
  `project` publicados.
- ~~**[Contenido]** Las doce casillas ES de los proyectos están vacías.~~ **Ocho
  de las nueve que quedaban ya están cargadas** (`Category` y `Services` de los
  tres proyectos). Los tres `Title (ES)` van vacíos **a propósito**: los nombres
  de los proyectos son marcas y el fallback cruzado ya muestra el inglés.

### Técnico

- **[Arranque]** **El cuadro off-white antes del negro, 1 de cada 10 arranques a
  12 kB/s.** Es una carrera entre el primer pintado y el script bloqueante de la
  compuerta, y **no es una regresión**: con el mecanismo anterior pasaba 2 de 10,
  con la misma vara y las mismas diez pasadas. Cerrarlo del todo pediría que el
  negro viniera en el HTML servido, lo que reabre el problema de hidratación que
  M5 resolvió. Está medido y acotado; se anota para que no se redescubra.
- **[Composición]** **El alto del footer de mobile ya no es 304: mide 244**, y
  `mobile-layout.ts` sigue diciendo 304 en sus dos constantes. El último commit
  antes de M6 (`70e7c33`, «ajustes manuales de composicion», hecho a mano)
  reestructuró el `HomeFooter`: el crédito dejó de tener fila propia y bajó a la
  columna izquierda, así que se fue una fila de 44 px más su hueco de 16.
  **No rompe nada** —en `/` el `mt-auto` del footer absorbe la diferencia y el
  borde inferior coincide exacto con `docH` y `viewH` en los ocho viewports
  probados, o sea cero franja muerta— pero deja **60 px de aire de más** entre el
  bloque del hero y el footer, y en `/contact/success` deja `BACK TO HOME` a
  70,58 px del footer a 320 × 640 en vez de unos 10.
  **La decisión es de composición y es humana:** o el footer vuelve a 304, o las
  dos constantes pasan a 244 (lo que agranda el hero 60 px en los cinco anchos y
  sube el bloque de la pantalla de éxito). M6 lo midió y **no lo tocó**, porque es
  un footer que Valentino acaba de ajustar a mano. El comentario de
  `mobile-layout.ts` ya advertía que «si el footer cambia, este número cambia»:
  el chequeo es medir
  `document.querySelector("footer").getBoundingClientRect().height`.
- **[Seguridad]** **`SANITY_API_WRITE_TOKEN` está vencido.** Una lectura de
  prueba con ese token devuelve `401 SIO-401-ANF, "Session not found"`. No rompe
  nada —el sitio lee sin token, con `useCdn: true`— pero significa que
  **cualquier tooling de escritura local fallaría**, y que hay un secreto muerto
  en `.env.local`. Conviene rotarlo o borrarlo.
- **[Studio]** **El Studio no se puede abrir desde `127.0.0.1:3010`:** ese origen
  no está registrado en el proyecto de Sanity y la interfaz muestra la pantalla
  «Connect this studio to your project» con un `CorsOriginError` en consola. **No
  es del código** —pasaba igual antes de tocar nada— pero tiene una consecuencia
  práctica: **el agente no puede ver renderizado el formulario del Studio**, así
  que rótulos, `fieldsets` y avisos de validación se verifican del lado humano.
- **[Fit]** **A 320 × 568 la pantalla de éxito sigue sin entrar.** Es el iPhone SE
  de primera generación: la caja útil es de 136 px. M6/F2 bajó el sobrante de
  126,89 a **42 px**, pero no lo eliminó. El piso declarado del sprint era 640, y
  bajar de ahí pide una decisión distinta (esconder el logo del footer, o un
  layout propio).
- **[Fit]** **El questionnaire no entra sin scroll con los dos mensajes de
  validación a 720 px de alto** en los anchos ≥ 1600 (pide 740). Falla igual en
  los dos idiomas: no es del castellano. Solo se retoma si aparece un caso real.
- **[Repo]** **Archivos de trabajo que no se pueden borrar con las reglas
  vigentes.** Quedan dentro de `esquina-estudio/`, **ya ignorados por git**, así
  que no ensucian el repositorio; pero `git rm` no alcanza a un archivo que nunca
  estuvo en el índice y este método prohíbe `rm`. Son: `devserver.log`,
  `devserver.err.log` y `devserver-3010.log` (de sesiones del 18 y el 21 de
  agosto), `tsconfig.tsbuildinfo`, `next-env.d.ts` y el subárbol `.next/dev/`, que
  es de un `next dev` viejo. Se borran a mano cuando alguien pase.
- **[Repo]** **`public/projects/akasha.png` no tiene consumidores.** M6/F4 lo
  encontró y **no lo borró**: es una imagen de las clientas, no andamiaje. Lo
  mismo `logos/logo-favicon.png`, que nadie importa y que es la copia fuente de
  `public/logo-favicon.png`. Decisión de contenido.
- **[Auditoría 1.c]** **`NEXT_PUBLIC_SITE_URL` no está definida** →
  `metadataBase` cae al placeholder `your-site-name.netlify.app`. Fix chico:
  definirla en Netlify y en `.env.local`.
- **[Auditoría 2.c/5]** **`<main>` anidados** en `/team`, `/work`, `/work/[slug]`
  y `/fun-gallery`. Semántica y accesibilidad. Fuera de ronda.
- **[Auditoría 1.a]** **No existen `error.tsx` ni `not-found.tsx`.** Fuera de
  ronda.
- **[Deploy]** El borrado de `/api/seed-sanity` (B1) y todo lo de M1–M6 rigen en
  producción **recién con el próximo deploy**. Nada de la ronda está desplegado.
- **[Repo]** 12 branches locales mergeadas a `main`. Borrado opcional manual.

### Método

- **[Método]** **Dejar el banco de medición como herramienta del proyecto.** Es
  Chrome `--headless=new` manejado por el DevTools Protocol sobre el `WebSocket`
  nativo de Node, sin dependencias, unas 150 líneas. Vive fuera del repo y **va
  cuatro veces reconstruido desde cero** (M2, M3, M4, M6). Cada reconstrucción
  cuesta lo mismo y el resultado es el mismo. Candidato natural del sprint que
  instale el harness ECC. Lo que sabe hacer está archivado en `CLAUDE.md` §7b.
- **[Método]** **Instalar el harness ECC.** Hoy las puertas son `lint` + `build`
  nativos. Fuera de ronda.
- ~~**[Docs]** Cuando la ronda cierre, revisar si las reglas de criterio y la
  directiva estética de `CLAUDE.md` §8 siguen reflejando cómo se trabajó.~~
  **Hecho a medias, y a propósito.** M6/F5 archivó lo que faltaba —las ocho
  trampas técnicas verificadas y los límites del entorno de ejecución, en §7 y
  §7b, que hasta entonces vivían solo en reportes de sprint—. La revisión de las
  **reglas de criterio y de la directiva estética de §8** no se tocó: son
  decisiones de método y de gusto, o sea de la capa de planificación, no del
  agente de ejecución. **Queda abierta.**
- **[Método]** La Fase 0 de todo sprint verifica que HEAD coincida con el commit
  sobre el que se auditó (o registra el delta), además de que el árbol esté
  limpio.
- **[Método]** Los types stale de `.next/dev/types/` rompen el typecheck cuando un
  sprint borra o renombra rutas con un `next dev` corriendo. Se **regenera** el
  artefacto —bajar el dev server y volver a correr el build—, nunca se edita a
  mano.

### Lo que no se puede verificar desde el agente y queda para el teléfono

Consolidado de M1, M3 y M4, más lo de M6. El detalle de **por qué** cada cosa es
inverificable está en `CLAUDE.md` §7b.

- Que el tap despliegue la galería y que el flotado se vea bien; que el menú
  hamburguesa se sienta bien al abrirse y cerrarse; que el formulario se complete
  y se envíe entero, selects incluidos; y que al enfocar un input la pantalla
  **no** haga zoom.
- Las tres cosas de M3 que dependen de la barra del navegador: el scroll sobrante
  de `/` y de la pantalla de éxito, el asomo de «BRANDING PACKS» en `/services` y
  el corrimiento de ~40 px que introduce el paso a `lvh`. **Ningún banco las
  reproduce** (§7, punto 4).
- Si el giro del ícono del menú se siente coordinado con el panel, y si la
  composición de los dos footers cierra visualmente con el logo donde quedó.
- **De M6:** que `/studio` cargue bien en una pestaña nueva; que `BACK TO HOME`
  se vea sin deslizar en un teléfono chico de verdad; y que una traducción de
  prueba cargada en `contentEs` cambie los párrafos **dejando las imágenes donde
  estaban**.
