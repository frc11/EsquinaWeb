# Piezas en castellano para cargar en el Studio — B4/F6, ampliado en M6/F3

**Qué es esto:** las traducciones **propuestas** de los campos bilingües de los
proyectos del dataset. El agente **no escribe en Sanity**: esto se carga a mano
desde el Studio (`/studio`), en las casillas ES que ya existen agrupadas al lado
de sus pares en inglés —`Title (ES)`, `Category (ES)`, `Services (ES)` y, desde
M6/F3, `Project Content in Spanish`—.

**Nada de esto es urgente.** El sitio ya funciona sin cargar una sola casilla: el
render tiene **fallback cruzado**, así que un campo ES vacío muestra el inglés (y
al revés). Nunca queda un hueco. Cargarlas mejora la lectura en castellano; no
cargarlas no rompe nada.

**Estado del dataset al 2026-08-26** (leído del dataset publicado, sin
escribir nada):

- **Tres** `project` publicados, no cuatro: Valentino borró `matsutrabajo`.
- Las **ocho** casillas ES de una línea de esos tres proyectos —`Category` y
  `Services`— **están cargadas**. Verificado renderizando: la ficha en
  castellano muestra `ALIMENTOS Y BEBIDAS`, `RESTAURANTES` y `TECNOLOGÍA`. Los
  tres `Title (ES)` siguen vacíos, y eso es a propósito (ver más abajo).
- El campo **`contentEs` existe desde M6/F3** y está **vacío en los tres**. Las
  traducciones propuestas del cuerpo están en la última sección de este
  archivo.

---

## 1 · AKASHA BLENDS — `akasha-blends`

| Campo | Inglés (hoy) | Castellano (propuesto) |
|---|---|---|
| Title | `AKASHA BLENDS` | *(dejar vacío)* |
| Category | `FOOD & BEVERAGES` | `ALIMENTOS Y BEBIDAS` |
| Services | `BRANDING / PACKAGING DESIGN / ILLUSTRATION / PHOTOGRAPHY` | `BRANDING / PACKAGING / ILUSTRACIÓN / FOTOGRAFÍA` |

## 2 · TUKUMI TAKEAWAY — `tukumi-takeaway`

| Campo | Inglés (hoy) | Castellano (propuesto) |
|---|---|---|
| Title | `TUKUMI TAKEAWAY` | *(dejar vacío)* |
| Category | `RESTAURANTS` | `RESTAURANTES` |
| Services | `BRANDING / PACKAGING / SOCIAL MEDIA` | `BRANDING / PACKAGING / REDES` |

## 3 · MATSU — `matsu`

| Campo | Inglés (hoy) | Castellano (propuesto) |
|---|---|---|
| Title | `MATSU` | *(dejar vacío)* |
| Category | `TECHNOLOGY` | `TECNOLOGÍA` |
| Services | `BRANDING / WEB DESIGN` | `BRANDING / DISEÑO WEB` |

## 4 · Matsu — `matsutrabajo` — **dado de baja**

> Valentino borró este proyecto del dataset. La tabla queda como registro de lo
> que se había propuesto; no hay nada que cargar.

| Campo | Inglés (hoy) | Castellano (propuesto) |
|---|---|---|
| Title | `Matsu` | *(dejar vacío)* |
| Category | `FOOD & SEVERAGES` | `ALIMENTOS Y BEBIDAS` |
| Services | `PACKAGING` | *(dejar vacío)* |

---

## Por qué los títulos van vacíos

Los nombres de los proyectos son **marcas**, no texto: `AKASHA BLENDS` se llama
igual en las dos versiones del sitio. Dejar la casilla ES vacía es mejor que
copiar el mismo valor: el fallback cruzado ya muestra el inglés, y una casilla
vacía es una sola fuente de verdad — si algún día cambia el nombre, se cambia en
un solo lado. Lo mismo vale para `PACKAGING` en el proyecto 4, que se escribe
igual en castellano.

## Dos cosas del contenido que conviene mirar

Son **contenido de las clientas**, así que no se tocaron desde el código. Se
dejan anotadas para que las decidan ellas:

1. **`FOOD & SEVERAGES`** (proyecto 4) parece un error de tipeo por
   `FOOD & BEVERAGES`. Se propone la misma traducción que el proyecto 1 —
   `ALIMENTOS Y BEBIDAS`— pero **el inglés conviene corregirlo también**.
2. **`matsutrabajo`** duplica el nombre de `matsu` con otro número de proyecto,
   otro año y una sola disciplina. Si es una prueba, conviene despublicarlo:
   aparece en `/work` y es candidato del cierre de `/services`, que toma las
   cuatro portadas más recientes.

## Vocabulario, para que la próxima carga sea consistente

| Inglés | Castellano | Por qué |
|---|---|---|
| BRANDING | BRANDING | Se dice en inglés en el rubro, acá |
| PACKAGING / PACKAGING DESIGN | PACKAGING | Ídem, y además más corto |
| ILLUSTRATION | ILUSTRACIÓN | |
| PHOTOGRAPHY | FOTOGRAFÍA | |
| SOCIAL MEDIA | REDES | Es como se dice; «redes sociales» es la forma larga |
| WEB DESIGN | DISEÑO WEB | |
| FOOD & BEVERAGES | ALIMENTOS Y BEBIDAS | En prosa el sitio usa «gastronomía»; como rótulo de rubro conviene el preciso |
| RESTAURANTS | RESTAURANTES | |
| TECHNOLOGY | TECNOLOGÍA | |
| MOTION GRAPHICS | MOTION GRAPHICS | Se dice en inglés |
| EDITORIAL DESIGN | DISEÑO EDITORIAL | |
| ART DIRECTION | DIRECCIÓN DE ARTE | |

## Lo que **no** tiene casilla ES, y es a propósito

- ~~**El cuerpo del proyecto** (`content`, el Portable Text con las
  imágenes).~~ **Resuelto en M6/F3**, y sin duplicar los bloques de media, que
  era exactamente la razón por la que no se había hecho: el campo nuevo
  `contentEs` lleva **solo el texto** y las imágenes se siguen tomando de
  `content`. Ver la última sección.
- **La metadata de la ficha** (título y descripción de la pestaña, Open Graph):
  la arma el servidor, que siempre rinde inglés. Es una aceptación escrita del
  sprint.
- **Los títulos de la Fun Gallery**: el schema `funGalleryImage` no tiene casilla
  ES. Se muestran como están.
- **`year` y el número de proyecto**: no son texto.

---

# El cuerpo de los proyectos en castellano — M6/F3

## Cómo funciona el campo nuevo

En el Studio, dentro de cada proyecto, el grupo **«Project Content (English
composition, Spanish text)»** tiene ahora dos campos:

| Campo | Qué lleva |
|---|---|
| `Project Content` | La **composición**: párrafos e imágenes mezclados, en el orden en que se ven. No cambia. |
| `Project Content in Spanish (text only)` | **Solo los párrafos.** Nada de imágenes. |

Al ver el sitio en castellano, **los párrafos salen del campo nuevo y las
imágenes siguen saliendo del de siempre, en el mismo lugar**. No hay una segunda
copia de ninguna foto: si mañana se cambia una imagen, cambia en los dos
idiomas.

## Cómo se emparejan los párrafos

**Por posición, contando solo los párrafos.** Los bloques de imagen no cuentan.

```
  Project Content:            [ párrafo 1 ] [ imagen ] [ imagen ] [ párrafo 2 ]
                                    │                                   │
  Project Content in Spanish: [ párrafo 1 ]                       [ párrafo 2 ]
```

O sea: **el primer párrafo del campo castellano reemplaza al primer párrafo del
campo inglés, el segundo al segundo**, y así. No hay que dejar huecos ni marcar
dónde van las imágenes.

## Qué pasa si no coinciden en cantidad

| Caso | Qué se ve |
|---|---|
| El campo castellano está **vacío** | Todo el cuerpo en inglés, con sus imágenes. Es lo que se ve hoy. |
| Hay **menos** párrafos en castellano | Los que faltan salen **en inglés**, cada uno en su lugar exacto. Nunca queda un hueco. |
| Un párrafo castellano quedó **en blanco** | Cuenta como si no estuviera: sale el inglés. |
| Hay **más** párrafos en castellano | Los que sobran **no se muestran**, y el Studio avisa cuántos son. El orden de textos e imágenes lo manda el campo inglés. |

## Las traducciones propuestas

**Cinco bloques de texto en total**, repartidos en los tres proyectos. La
instrucción del sprint hablaba de siete en cuatro proyectos: la diferencia es
`matsutrabajo`, que ya no está.

Criterio de traducción, el mismo de B4: contextual y no literal, voseo cuando el
texto se dirige a alguien —**en estos cinco no pasa nunca**, son todos
descriptivos en tercera persona, así que el voseo no aparece— y las marcas y los
términos del rubro sin traducir (`Akasha`, `Tukumi`, `Matsu`, `branding`,
`packaging`).

---

### 1 · AKASHA BLENDS — párrafo 1 de 2

**Inglés (hoy):**

> A sensory brand and packaging system for Akasha, built around botanical
> detail, texture, and product ritual. Every element—from label composition to
> color story—was designed to evoke warmth, intention, and craft.

**Castellano (propuesto):**

> Un sistema sensorial de marca y packaging para Akasha, construido en torno al
> detalle botánico, la textura y el ritual del producto. Cada elemento —de la
> composición de la etiqueta a la paleta de color— fue pensado para evocar
> calidez, intención y oficio.

Tres decisiones: *color story* → **«paleta de color»** (traducirlo literal da
«historia de color», que no se dice); *craft* → **«oficio»**, que es la palabra
del rubro para el trabajo hecho a mano y con cuidado; y *was designed to* →
**«fue pensado para»**, para no repetir la familia de «diseño» tres veces en dos
oraciones.

### 2 · AKASHA BLENDS — párrafo 2 de 2 — **vacío**

El segundo bloque de texto de este proyecto **está en blanco en el dataset**: es
un párrafo que quedó creado y sin escribir. En el sitio no se ve nada, pero
ocupa el espacio entre bloques.

**Qué hacer:** dejar vacío también en castellano (el fallback no muestra nada,
igual que hoy) y, si se quiere, **borrar el bloque vacío del campo inglés** desde
el Studio. Es contenido, así que la decisión es de ustedes.

### 3 · TUKUMI TAKEAWAY — párrafo 1 de 1

**Inglés (hoy):**

> A vivid brand world built through illustration, color, and expressive
> packaging detail. Tukumi's identity brings energy to every touchpoint—from
> takeaway boxes to social content.

**Castellano (propuesto):**

> Un universo de marca vívido, construido con ilustración, color y un packaging
> expresivo hasta en el detalle. La identidad de Tukumi le pone energía a cada
> punto de contacto: de las cajas de takeaway al contenido de redes.

*takeaway* queda sin traducir a propósito: es parte del nombre del proyecto
(`TUKUMI TAKEAWAY`), así que traducirlo rompería el eco. *touchpoint* →
**«punto de contacto»**, que es como se dice en el rubro. *social content* →
**«contenido de redes»**, igual que la tabla de vocabulario de más arriba.

### 4 · MATSU — párrafo 1 de 2

**Inglés (hoy):**

> A digital-first brand expression shaped through interface, composition, and
> quiet visual rhythm. Matsu's web presence balances minimalism with functional
> clarity.

**Castellano (propuesto):**

> Una expresión de marca pensada primero para lo digital, moldeada por la
> interfaz, la composición y un ritmo visual sereno. La presencia web de Matsu
> equilibra el minimalismo con la claridad funcional.

*digital-first* → **«pensada primero para lo digital»**: no tiene equivalente de
una palabra y el calco («digital primero») no se entiende. *quiet visual rhythm*
→ **«un ritmo visual sereno»**; «callado» sería más literal y suena peor.

### 5 · MATSU — párrafo 2 de 2 — **repetido**

El segundo bloque de texto de Matsu es **exactamente el mismo texto que el
primero**, palabra por palabra. Parece una duplicación accidental al cargar.

**Qué hacer:** decidir primero el inglés. Si el bloque repetido se borra, en
castellano no hay nada que cargar. Si se reemplaza por un texto nuevo, ese texto
nuevo va como segundo párrafo en las dos casillas. Y si se deja como está, la
traducción es la misma del punto 4, repetida.

---

## Vocabulario nuevo que salió de estos cinco bloques

| Inglés | Castellano | Por qué |
|---|---|---|
| brand world | universo de marca | Es como se nombra en el rubro; además `/services` ya usa «UNIVERSE» como título |
| touchpoint | punto de contacto | Estándar en el rubro |
| color story | paleta de color | «Historia de color» es calco y no se dice |
| craft | oficio | El trabajo hecho a mano y con cuidado |
| digital-first | pensada primero para lo digital | No hay equivalente de una palabra |
| takeaway | takeaway | Parte del nombre del proyecto |
