# Set de banderas — fuente, versión y licencia

> Ficha de procedencia de los archivos que viven en `esquina-estudio/public/flags/`.
> Creada en el sprint **B4d** (2026-08-22), que retiró el set dibujado a mano.

## Qué se usa

| dato | valor |
|---|---|
| **Set** | `flag-icons` |
| **Versión** | **7.5.0** (paquete npm publicado; se tomó la carpeta `flags/4x3`) |
| **Repositorio** | https://github.com/lipis/flag-icons |
| **Autor** | Panayiotis Lipiridis (`@lipis`) |
| **Licencia** | **MIT** — confirmada leyendo el archivo `LICENSE` del propio paquete, no la ficha de npm |
| **Relación de aspecto** | 4:3 |
| **Archivos incorporados** | **196**, uno por país de `COUNTRY_OPTIONS` |
| **Peso total** | **1 300 656 bytes** (1,24 MiB) |
| **Archivo más grande** | `rs.svg` — **181 634 bytes** (Serbia; el escudo entero, con corona y manto) |

El texto íntegro de la licencia viaja con los archivos, en
`public/flags/LICENSE.txt`. La MIT pide que el aviso de copyright acompañe a
las copias, y esa es la copia.

## No es una dependencia

`flag-icons` **no está en `package.json`** y no lo va a estar. Los SVG se
**vendorizaron**: se bajó el tarball publicado, se verificó la licencia, se
copiaron los 196 archivos que la lista de países usa y ahí terminó la relación
con el paquete. El sitio sirve archivos estáticos desde `public/`; no importa
nada de `node_modules`. Actualizar el set en el futuro es repetir ese
procedimiento a mano, no un `npm update`.

## Por qué este set y no otro

Se evaluó también **`country-flag-icons` 1.6.20** (catamphetamine, también MIT,
también verificado leyendo su `LICENSE`), que tiene dos ventajas reales: pesa
**903 KB contra 2,4 MB** en el set completo —su archivo más grande son 5,3 KB
contra los 181 KB de Serbia acá— y viene en **3:2**, que es más cerca de la
caja de 24 × 15 (1,6) que el 4:3.

Perdió igual, y por el motivo que justifica el sprint entero: **sus emblemas
están simplificados hasta dejar de ser el emblema**. El águila de México es un
óvalo con dos manchas, el sol de Argentina es un círculo liso sin rayos ni
cara, la esfera armilar de Portugal es un anillo con un punto, el dragón de
Bhután es una eses blanca. B4d existe justamente porque las aproximaciones no
alcanzaban; cambiar aproximaciones propias por aproximaciones ajenas no era el
trato. `flag-icons` dibuja el escudo completo, y eso es lo que se pidió.

## Encuadre: 4:3 dentro de una caja de 1,6

La caja del selector mide **24 × 15 px** y no se mueve (§2.3 de la instrucción
de B4d). El archivo es 4:3. Las dos salidas honestas eran:

- **`object-fit: contain`** — la bandera entra entera pero mide 20 × 15 y deja
  2 px de aire a cada lado. En una lista de 196 filas eso se lee como banderas
  de anchos distintos.
- **`object-fit: cover`** — la bandera llena la caja y se recorta **1,5 px
  arriba y 1,5 abajo** de los 18 px a los que escala (16,7 % del alto).

Se eligió **`cover`**, que es lo que está en el componente. Se verificó el
recorte contra los casos peores —Estados Unidos, Brasil, Nepal, Suiza, Vaticano,
Qatar, Kenia, Bután, Sri Lanka, Camboya, Omán, Eritrea— y en ninguno se pierde
algo que haga a la lectura de la bandera. **En ningún caso se deforma**: no hay
un solo estiramiento no proporcional en el set.

## Una nota que no es técnica

`af.svg` trae el **tricolor negro-rojo-verde con el emblema**, que es la
bandera de la República Islámica de Afganistán (anterior a 2021), no la blanca
del Emirato. Es lo que publica el set y no se tocó. `sy.svg` sí trae la
**bandera de tres estrellas adoptada en 2025**. Se deja anotado porque es una
decisión de contenido, no de código, y le corresponde al estudio si algún día
quiere revisarla.
