# POSTMORTEM — RONDA DE CAMBIOS DE LAS CLIENTAS + ADAPTACIÓN MOBILE
**Proyecto:** Esquina Estudio · **Cierre:** 2026-08-15 · **Método:** develOP (capa de planificación + Claude Code como ejecutor)

---

## 1. QUÉ SE ENTREGÓ

Cuatro bloques y una ronda mobile, sobre un sitio en producción que arrancó con documentación desactualizada y un endpoint de escritura sin autenticación.

| | Entregado |
|---|---|
| **B1 · Fundación** | `CLAUDE.md` reescrito · registros del método creados (`plan-maestro`, `pendientes`, `bitacora`) · README real · borrado de cuatro archivos sin consumidores y de `/api/seed-sanity` |
| **B2 · Devoluciones visuales** | Footer nuevo global con logo gigante · menú a 17/0 con indicador recalibrado · home con frase nueva sin CTA · Work grid 5:4 con aparición solapada · Contact rediseñado y entrando sin scroll de 1280 a 1920 |
| **B3 · Rediseños** | Fun Gallery con schema propio, entrada en montón, despliegue animado y flotado · Services reconstruida: scroll-jack desmontado, cinco secciones nuevas, sidebar con scroll-spy, gatillo y LATEST PROJECTS |
| **B4 · Idioma** | Toggle EN/ES hecho a mano, diccionario tipado, ~400 cadenas traducidas con voseo, consumo bilingüe de Sanity |
| **Mobile (M1–M6)** | Adaptación completa · preloader nuevo con la animación de las clientas · banderas SVG reales · `contentEs` para el cuerpo de los proyectos · limpieza y archivado |

**Números que resumen el trabajo:** el formulario pasó de 1226,5 px a 426–498 según ancho, entrando en catorce resoluciones · el scroll horizontal pasó de 117–567 px a **cero en 128 combinaciones** · las imágenes de mobile bajaron 39,6 % de peso · `/fun-gallery` pasó de dinámica sin caché a estática con revalidación · se retiraron ~2.000 líneas netas entre código muerto y el set de banderas dibujado a mano.

**Cero deploys.** Ni un `git push` en toda la ronda: Netlify publica desde `main` y las clientas todavía no aprobaron.

---

## 2. LO QUE FUNCIONÓ

**Versionar los mockups fue la mejor decisión del proyecto.** Hasta el Bloque 2 el agente aplicaba mi descripción del PDF; desde que las 15 páginas quedaron en `docs/archivo/mockups/`, empezó a **medir la referencia**: el ratio 5:4 confirmado contra la imagen, el padding del overlay derivado como porcentaje con el método validado contra una captura real, los 26 px del bloque CONTACT US salidos de una relación de cap-heights. Y me corrigió cuatro veces con evidencia.

**Las paradas.** El agente frenó seis o siete veces y **en todas tenía razón**: un defecto que no existía, dos columnas que no entraban, una premisa falsa sobre las banderas, un mockup que no contenía lo que yo decía. Ninguna parada fue fricción; todas evitaron trabajo tirado.

**Pedir el diagnóstico antes que la corrección.** Los mejores resultados salieron de instrucciones que exigían entender primero: el `-7` del indicador (que no compensaba lo que yo creía), el `backdrop-filter` del menú, el `cancelable` del primer `wheel`, el `100vh` contra la barra del navegador. Cuando la instrucción decía "arreglá X", salían parches; cuando decía "explicame por qué pasa X y después arreglalo", salían causas raíz.

**La red de seguridad documental.** La instrucción del Bloque 1 pedía anotar —sin actuar— lo verdadero del documento viejo que quedaba afuera del nuevo. Eso recuperó las reglas de criterio y la directiva estética que mi reescritura había perdido. Sin ese pedido, el bloque más importante habría corrido sin gobierno.

**Las verificaciones con número.** "Cero scroll horizontal en 128 combinaciones", "48 de 48 altos idénticos", "0 de 9 labels con `htmlFor`" son afirmaciones falsables. Las verificaciones cualitativas nunca detectaron nada.

---

## 3. LO QUE FALLÓ

**Mis afirmaciones de memoria. Al menos siete veces.** Una ruta de archivo inventada (`InfoCard` en `ui/` cuando estaba en `sections/work/`) · un artefacto de 1 px que atribuí a la auditoría y no existía · pesos tipográficos al revés en Fun Gallery · una "celda de texto" en Work que nunca existió · `JOIN OUR CLUB` mezclado de dos páginas distintas del mockup · el diagnóstico de las banderas como emojis cuando eran 1.400 líneas de SVG propio · el `failsafe` del toggle que di por hardcodeado cuando ya se derivaba.

Es **la falla característica de este rol** y la regla estaba escrita desde el Bloque 1: citar del reporte o pedir un paso de descubrimiento. La seguí incumpliendo cada vez que el dato me parecía obvio. Lo que la contuvo no fue mi disciplina sino los pasos de descubrimiento obligatorios en las instrucciones.

**Especificaciones que describían el síntoma, no el problema.** El caso más caro: pedí "que el questionnaire entre en pantalla" sin advertir que el 75 % de la altura era padding vertical. Tres sprints (B2.5, B2.6, B2.7) para algo que un buen diagnóstico inicial habría resuelto en uno.

**Subestimar el ida y vuelta del trabajo animado.** Fun Gallery necesitó cuatro corridas y Services dos. No fue ineficiencia: el concepto se precisó al verlo. Pero yo planifiqué como si una especificación escrita bastara para una pantalla que se mueve, y no basta.

**Sprints demasiado grandes.** B2.7 corrió once horas y se cortó por error de API; M3, casi cuatro. Funcionaron por la estructura de fases retomables, pero el costo fue desproporcionado en los casos donde el barrido de medición era enorme.

---

## 4. LAS OCHO TRAMPAS TÉCNICAS

Cada una costó horas de diagnóstico. **Ya están archivadas en `CLAUDE.md` §7 y §7b** — este listado es el índice.

1. **Tailwind v4 emite las variantes arbitrarias `min-[...]` antes que los breakpoints con nombre.** `lg:` le gana a `min-[1600px]:`. Apareció **tres veces**; se verificó sobre la hoja de producción (bytes 39.804 contra 45.310).
2. **Tailwind v4 solo reconoce clases literales.** Una clase compuesta con plantilla nunca llega al CSS: causó 248 px de franja muerta en la home sin que nada fallara.
3. **`backdrop-filter` convierte al elemento en bloque contenedor de sus descendientes `position: fixed`.** El menú de mobile se renderizaba dentro de la banda de 128 px del header.
4. **`ResizeObserver` entrega una notificación inicial al suscribirse.** Resuscribirlo en cada medición pisaba la animación recién armada — afectaba al indicador del menú en cada navegación.
5. **Un efecto pasivo puede diferirse.** Sincronizar ahí la referencia de un observer hace que mida el render anterior. Va en `useLayoutEffect`.
6. **Chrome manda `cancelable: true` solo en el primer `wheel` de una secuencia.** Acumular delta en modo pasivo hace perder el derecho a cancelar: de ahí la vibración del gatillo.
7. **`100vh` en un teléfono es la pantalla con la barra del navegador oculta.** Explicó tres bugs distintos a la vez, y **ningún banco de medición lo reproduce**.
8. **Los locks de scroll son el riesgo más alto del repo.** Un `overflow: hidden` huérfano deja el sitio sin scroll **y el build sale verde igual**.

---

## 5. LO QUE CAMBIÓ EN EL MÉTODO

**Lo que se incorporó y funcionó:**
- Mockups versionados como imágenes, citados por nombre de archivo en cada instrucción.
- Fases con commit independiente y documentos **retomables**: salvó dos corridas cortadas (error de API y caída de red).
- Verificación humana **declarada explícitamente** en cada sprint, con la lista de lo que el agente no puede comprobar.
- Prohibiciones que salieron de incidentes: no matar procesos por nombre, no levantar `next dev`, no tocar el puerto 3000.
- Pasos de descubrimiento obligatorios antes de tocar archivos.

**El límite que se rompió al final.** Durante toda la ronda el agente no podía observar animaciones (con la pestaña oculta Chrome no corre `requestAnimationFrame`). En M2 construyó **su propio banco con Chrome headless por DevTools Protocol**, y desde ahí pudo cronometrar. Ese enfoque debería ser el punto de partida del próximo trabajo, no un descubrimiento tardío.

---

## 6. ESTADO AL CIERRE

**Cerrado y verificado:** los cuatro bloques · la adaptación mobile · el preloader nuevo · las banderas · `contentEs` con sus traducciones cargadas · la limpieza del repo · el conocimiento archivado en `CLAUDE.md`.

**Abierto, en manos de Valentino:**
- **Mostrarles a las clientas el Contact de dos columnas** — lo único de la ronda que no salió del PDF.
- **El deploy.** Cero pushes hasta ahora.
- **Borrar `SANITY_API_WRITE_TOKEN`** de `.env.local` y de Netlify: está vencido y sin consumidores.

**Decisiones menores que quedaron como están, revisables cuando molesten:**
- El gris de las banderas apaga las tricolores de luminosidad parecida (Bulgaria, Colombia, Chad, Rumania).
- `FUN GALLERY → GALERÍA` pierde el "fun" que caracteriza la sección.
- La cuadrícula 2×2 de LATEST PROJECTS quedó 4× el área anterior.
- `mobile-layout.ts` declara un footer de 304 px cuando mide 244 tras el ajuste manual: deja 60 px de aire de más. No rompe nada.
- Contraste del gris de identidad: 2,77:1, por debajo de AA.
- Un cuadro off-white aparece 1 de cada 10 arranques en frío a 12 kB/s (antes eran 2 de 10).
- 320 × 568 (iPhone SE de primera generación) sigue sin entrar en `/contact/success`; el piso declarado fue 640.

---

## 7. SI HUBIERA QUE HACERLO DE NUEVO

**Tres cosas que haría distinto desde el primer día:**

1. **Leer el PDF completo antes de definir el alcance.** El alcance inicial salió del handoff y de lo que Valentino recordaba; leer las 15 páginas apareció trabajo que no estaba en ninguna lista (el footer nuevo, el Work grid en 5:4) y disolvió un problema que parecía imposible (el fit de Contact). Fue lo primero que hizo el chat y ya cambió el mapa.

2. **Empezar por el diagnóstico medido, no por el pedido.** "Que entre en pantalla" es un síntoma; "el 75 % de la altura es padding" es el problema. La diferencia fueron dos sprints.

3. **Tratar cada pantalla animada como un ciclo de dos o tres pasadas, no como un sprint.** Planificar la iteración en vez de sufrirla.

**Y una que haría igual:** insistir con que el agente reporte lo que **no** pudo verificar. Ese hábito produjo los hallazgos más valiosos de la ronda — el mockup que no tenía `JOIN OUR CLUB`, las banderas que no eran emojis, el `matsutrabajo` duplicado, el token vencido. Un agente que solo reporta éxitos no habría encontrado ninguno.
