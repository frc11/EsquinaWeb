# Piezas en castellano para cargar en el Studio — B4/F6

**Qué es esto:** las traducciones **propuestas** de los campos bilingües de los
cuatro proyectos del dataset. El agente **no escribe en Sanity**: esto se carga a
mano desde el Studio (`/studio`), en las casillas `Title (ES)`, `Category (ES)` y
`Services (ES)` que ya existen agrupadas al lado de sus pares en inglés.

**Nada de esto es urgente.** El sitio ya funciona sin cargar una sola casilla: el
render tiene **fallback cruzado**, así que un campo ES vacío muestra el inglés (y
al revés). Nunca queda un hueco. Cargarlas mejora la lectura en castellano; no
cargarlas no rompe nada.

Estado del dataset al **2026-08-21**: cuatro `project` publicados, las **doce**
casillas ES vacías.

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

## 4 · Matsu — `matsutrabajo`

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

- **El cuerpo del proyecto** (`content`, el Portable Text con las imágenes):
  duplicarlo duplicaría también los bloques de media. Decisión cerrada del plan
  maestro.
- **La metadata de la ficha** (título y descripción de la pestaña, Open Graph):
  la arma el servidor, que siempre rinde inglés. Es una aceptación escrita del
  sprint.
- **Los títulos de la Fun Gallery**: el schema `funGalleryImage` no tiene casilla
  ES. Se muestran como están.
- **`year` y el número de proyecto**: no son texto.
