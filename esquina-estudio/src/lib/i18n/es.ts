import type { Dictionary } from "@/lib/i18n/types";

/**
 * Variante española. Criterio de traducción: contextual y no literal, **voseo
 * argentino** («contanos», «elegí», «destacate») y brevedad como decisión de
 * diseño —ante dos traducciones válidas gana la más corta, porque hay
 * composiciones medidas al píxel que se rompen si el texto crece—. Mayúsculas
 * con tilde (`INTENCIÓN`, `GALERÍA`) se conservan.
 *
 * No se traducen: `ESQUINA ESTUDIO`, `develOP`, `INSTAGRAM`, `LINKEDIN`,
 * `ARGENTINA` (que además es igual), **`FUN GALLERY`** (R2), los nombres de los
 * proyectos ni los nombres propios de las fundadoras.
 */
export const ES: Dictionary = {
  common: {
    language: "Idioma",
    languageNames: { en: "Inglés", es: "Español" },
  },

  nav: {
    // «Work» es el portfolio: en castellano el rótulo del rubro es PROYECTOS,
    // que además es el que usan las otras dos secciones que lo referencian
    // (VER MÁS PROYECTOS, ÚLTIMOS PROYECTOS).
    work: "PROYECTOS",
    services: "SERVICIOS",
    team: "EQUIPO",
    // **Se queda en inglés, y lo pidieron ellas** (R2,
    // `docs/archivo/mockups/r2-trad-01.jpg`: «FUN GALLERY (MANTENER EN INGLES)»).
    // B4 lo había traducido con el argumento de que un menú con tres rótulos en
    // castellano y uno en inglés se lee como un olvido; la decisión de las
    // clientas es la contraria: «Fun Gallery» es nombre de la sección, del mismo
    // orden que *branding* o *packaging*, y por eso no se traduce.
    gallery: "FUN GALLERY",
    contact: "CONTACTANOS",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    logoHome: "ESQUINA ESTUDIO, ir al inicio",
    currentPage: "página actual",
  },

  footer: {
    // **Se quedan en inglés, y lo pidieron ellas.** Los dos PDF de R2 tachan la
    // versión castellana y escriben al lado «(MANTENER EN INGLES)»:
    // `docs/archivo/mockups/r2-trad-01.jpg` (footer claro de `/`) y
    // `r2-trad-02.jpg` (banda oscura de las rutas internas). El par sigue
    // viajando por idioma —el tipo no cambia— pero hoy las dos variantes dicen
    // lo mismo; si mañana se vuelven a traducir, se cambia acá y nada más.
    places: [
      ["BORN IN", "ARGENTINA"],
      ["WORKING", "WORLDWIDE"],
    ],
    poweredBy: "HECHO POR",
    contactCta: "CONTACTANOS",
    // «Let's bring your ideas to life» viaja como una sola frase en castellano
    // —«hagamos realidad tus ideas»— y se corta distinto en cada lugar donde
    // aparece: dos líneas acá, tres en el aside de Contact, una sola en el link
    // de Services. Es más corta que la inglesa, que es lo que pide §2.3.
    contactLines: ["HAGAMOS REALIDAD", "TUS IDEAS"],
  },

  team: {
    // Cinco líneas centradas, con los cortes elegidos y medidos: la más ancha da
    // 1333 px a 40 px contra los 1434 de la inglesa, así que el bloque en
    // castellano nunca se parte antes que el inglés.
    intro: [
      "<b>ESQUINA ESTUDIO</b>™ es un estudio de diseño dedicado a construir",
      "marcas y a dar forma a las ideas con claridad, intención",
      "e identidad visual. Ayudamos a startups a convertir su visión",
      "en negocios profesionales y visualmente potentes, y también",
      "a marcas establecidas a repensar y elevar su identidad.",
    ],
    // El guion largo vuelve al castellano, y con él se cierra el pendiente que
    // dejó el commit `046e601` (fuera de sprint, 2026-08-26): había cambiado el
    // guion por paréntesis solo en esta variante, así que EN y ES puntuaban
    // distinto. El copy de R2 los vuelve a alinear.
    whoWeAre: [
      "Somos ",
      "Virginia y Victoria",
      " —Vireli y Toli—, co-creadoras de Esquina Estudio.",
    ],
    bio: [
      "Este proyecto nace de un vínculo construido a lo largo de muchos años, entre creatividad, complicidad y aspiraciones compartidas. Antes de ser socias, fuimos compañeras de jardín, colegio y facultad en Tucumán, Argentina.",
      "Con el tiempo, desarrollamos una mirada en común y un profundo entendimiento de la identidad visual, así como del valor que tiene para las marcas, sin importar su tamaño. Nos inspira el diseño en todas sus formas, como también la moda, la gastronomía, la comunicación y todo lo que sucede a su alrededor. Pero, sobre todo, nos inspiran quienes están construyendo algo propio: emprendedores con una idea en la que creen y marcas que buscan encontrar su lugar en el mercado, comunicar con claridad y hacerlo con voz propia.",
    ],
    approach: [
      "Nuestra visión combina estética, concepto y fundamentos atemporales. Prestamos especial atención a cada detalle y creemos que el buen diseño se construye tanto desde la mirada general como desde las decisiones más pequeñas.",
      "Trabajamos de la mano de nuestros clientes, con una comunicación directa y abierta, entendiendo la colaboración y la comprensión de sus objetivos como partes esenciales del proceso. Nuestra prioridad es dar vida a cada visión desde nuestra perspectiva creativa, con apertura, criterio y atención, buscando siempre la solución más adecuada para cada proyecto.",
    ],
    headed: [
      "Creemos que crecer también significa salir de lo conocido. Queremos ampliar nuestra mirada, explorar nuevas culturas y formas de hacer diseño, y seguir aprendiendo de las personas y los contextos que encontramos en el camino.",
      "En esta próxima etapa, buscamos llevar Esquina Estudio más allá de nuestras fronteras, colaborando con clientes y creativos de distintas partes del mundo y construyendo vínculos que nos permitan seguir expandiendo nuestra perspectiva sobre el diseño y su práctica.",
      "Nos mueve la curiosidad por seguir aprendiendo, entender otras formas de trabajar y descubrir nuevas posibilidades dentro de la industria. Queremos que Esquina Estudio crezca con nosotras: manteniendo nuestra identidad, pero siempre abierta a nuevas ideas, influencias y formas de hacer.",
      "Sobre todo, queremos seguir acompañando a personas que están construyendo algo propio, transformando ideas en marcas con intención, carácter y una identidad que les pertenezca.",
    ],
    sections: ["EL EQUIPO", "NUESTRO ENFOQUE", "HACIA DÓNDE VAMOS"],
    photoAlt: "El equipo de ESQUINA ESTUDIO",
  },

  services: {
    introLabel: "Intro",
    sidebarLabel: "Secciones de servicios",
  },

  gallery: {
    title: ["DESCUBRÍ NUESTROS PROYECTOS,", "PIEZA POR PIEZA."],
    hint: "(clic para ver)",
    sectionLabel: "Galería",
    viewItem: "Ver",
    errorTitle: "LA GALERÍA NO ESTÁ DISPONIBLE AHORA",
    errorDetail: "NO PUDIMOS CARGAR LAS IMÁGENES. PROBÁ DE NUEVO EN UN RATO.",
    emptyTitle: "POR AHORA LA GALERÍA ESTÁ VACÍA",
    emptyDetail: "SE VIENEN IMÁGENES NUEVAS.",
  },

  form: {
    // «Hagamos realidad tus ideas», la misma frase del footer, cortada en tres.
    title: ["HAGAMOS", "REALIDAD", "TUS IDEAS"],
    /*
      El texto lo pidieron ellas en R2 (`docs/archivo/mockups/r2-trad-14.jpg`) y
      **no entra en dos renglones en la pista del aside**: medido a 17 px, el
      mejor corte posible de los nueve deja la mitad más larga en 333,1 px contra
      los 272 (1280–1599) / 280 (≥1600) de esa pista. O sea que no es cuestión de
      elegir mejor el corte.

      De los tres cortes que conservan el sentido, este es el de menor daño:
      tres renglones visuales en 1232–1599 —21 px más de alto— y dos a 560 px de
      caja, que es el ancho del bloque apilado por debajo de 1232. El aside es
      `self-start` (`ContactForm.tsx:780`), así que de 1232 para arriba esos
      21 px **no mueven el formulario**; por debajo empujan el bloque apilado.
    */
    subtitle: [
      "CONTANOS SOBRE TU PROYECTO",
      "PARA RECIBIR UNA PROPUESTA PERSONALIZADA",
    ],
    formLabel: "Cuestionario de proyecto",
    labels: {
      fullName: ["TU NOMBRE", "Y APELLIDO *"],
      email: ["DIRECCIÓN", "DE MAIL *"],
      /*
        El corte de dos líneas de «¿QUÉ TIPO DE PROYECTO BUSCAS REALIZAR?» **no
        puede quedar en tres renglones** en las columnas de label chicas: la
        mejor mitad pide 126,1 px a 14 px contra los 111 disponibles y 108,1 a
        12 px contra los 95. Las seis palabras no entran, con ningún corte.

        Acá no importa, y es lo que lo hace aceptable: `workType` es el único
        campo con `alignLabelTop` y su control **no es un input de 44/48/58 px
        sino el bloque de pills**, que mide 126–194 px según el rango. Un label
        de cuatro renglones mide 55,2–64,4 px, o sea que entra con 60–70 px de
        sobra. El techo de «tres renglones» que documenta `ContactForm` es el de
        los campos cuyo control es un input, no el de este.

        `BUSCAS` va sin tilde porque así lo escribieron ellas. El resto del sitio
        vosea (`CONTANOS`, `TENÉS`, `ELEGÍ`), así que la inconsistencia queda
        registrada para consultarles, no corregida por nuestra cuenta.
      */
      workType: ["¿QUÉ TIPO DE PROYECTO", "BUSCAS REALIZAR?"],
      businessType: ["¿CÓMO DEFINIRÍAS", "TU NEGOCIO?"],
      industry: ["¿EN QUÉ RUBRO", "OPERA TU NEGOCIO?"],
      /*
        Un rótulo de una sola palabra. La segunda entrada va **vacía** y no con
        un `&nbsp;`: un `<span class="block">` sin contenido no genera caja de
        línea, así que ocupa 0 px y el rótulo queda centrado contra su control
        como corresponde a un label de una línea. Con `&nbsp;` se fingiría una
        segunda línea para conservar un alto que ya no tiene razón de ser.

        Medido: en los cuatro rangos donde el label va al costado, la fila **no
        se mueve** (manda el alto del control) y lo único que cambia es que la
        primera línea baja 9,2 / 8,1 / 6,9 px al centrarse. En los dos rangos
        donde el label va arriba, el campo se acorta 18,4 / 16,1 px.
      */
      country: ["PAÍS", ""],
      timeline: ["PLAZO", "IDEAL"],
      budget: ["RANGO DE", "PRESUPUESTO"],
      hearAbout: ["¿CÓMO NOS", "CONOCISTE?"],
    },
    placeholders: {
      name: "NOMBRE",
      email: "MAIL",
      /*
        Las clientas pidieron `SELECCIONE UNA OPCIÓN`. **No entra en ningún
        rango**: mide 407,6 px a 34 px contra una pista útil de 312, y el peor
        caso de los catorce (siete rangos × dos columnas) se pasa por 95,6 px.
        `SELECCIONÁ UNA OPCIÓN` es todavía peor (409,7). El placeholder es el
        único texto del select con `truncate`, así que lo que se vería es el
        rótulo cortado con puntos suspensivos.

        `SELECCIONAR` dice lo mismo, es la primera opción de la lista de
        preferencia que entra en los siete rangos, y entra con holgura: 223,6 px
        a 34 px, mínimo de 68 px de aire en el peor rango (el actual `ELEGÍ UNA
        OPCIÓN` deja 13,8, o sea por debajo del piso de 14 px que pedía el
        sprint). Los números están en el reporte para llevárselos a ellas.
      */
      select: "SELECCIONAR",
      shortAnswer: "RESPUESTA CORTA",
      shortAnswerIndustry: "RESPUESTA BREVE",
      search: "BUSCAR",
    },
    noResults: "Sin resultados",
    submit: "ENVIAR FORMULARIO",
    submitting: "ENVIANDO...",
    submitError: "No pudimos enviar tu formulario. Probá de nuevo.",
    validation: {
      fullName: "Escribí tu nombre y apellido",
      email: "Escribí un mail válido",
    },
  },

  success: {
    title: ["¡TU CONSULTA SE ENVIÓ", "CON ÉXITO!"],
    body: "GRACIAS POR TOMARTE EL TIEMPO DE CONTARNOS TU VISIÓN. VAMOS A LEER TODO CON CALMA Y TE RESPONDEMOS A LA BREVEDAD.",
    sectionLabel: "Confirmación de consulta enviada",
    backHome: "VOLVER AL INICIO",
  },

  work: {
    backToGallery: "Volver a la galería",
    allProjects: "Todos los proyectos",
    next: "Siguiente",
    contentSoon: "El contenido del proyecto está en camino.",
    mediaAlt: "Pieza del proyecto",
    videoTitle: "Video del proyecto",
  },
};
