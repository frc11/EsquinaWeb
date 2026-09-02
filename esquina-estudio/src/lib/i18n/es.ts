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
    places: [
      ["NACIDO EN", "ARGENTINA"],
      ["TRABAJANDO", "EN TODO EL MUNDO"],
    ],
    poweredBy: "HECHO POR",
    contactCta: "CONTACTANOS",
    // «Let's bring your ideas to life» viaja como una sola frase en castellano
    // —«hagamos realidad tus ideas»— y se corta distinto en cada lugar donde
    // aparece: dos líneas acá, tres en el aside de Contact, una sola en el link
    // de Services. Es más corta que la inglesa, que es lo que pide §2.3.
    contactLines: ["HAGAMOS REALIDAD", "TUS IDEAS"],
    clubCta: "SUMATE AL CLUB",
    clubLines: ["FORMÁ PARTE DE UNA", "COMUNIDAD CREATIVA"],
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
    title: ["¡DIVERTITE EXPLORANDO", "NUESTROS PROYECTOS!"],
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
    // Medido: la línea más ancha da 267,9 px a 17 px contra los 269,2 de la
    // inglesa, y ese número es justo el que fija el piso de la pista del aside.
    // O sea que el castellano no la mueve.
    subtitle: ["CONTANOS SOBRE TU PROYECTO", "Y TE MANDAMOS UNA PROPUESTA"],
    formLabel: "Cuestionario de proyecto",
    labels: {
      fullName: ["TU NOMBRE", "Y APELLIDO *"],
      email: ["DIRECCIÓN", "DE MAIL *"],
      workType: ["¿EN QUÉ", "QUERÉS TRABAJAR?"],
      businessType: ["¿CÓMO DEFINIRÍAS", "TU NEGOCIO?"],
      industry: ["¿CUÁL ES TU", "RUBRO?"],
      country: ["¿EN QUÉ PAÍS", "ESTÁS?"],
      timeline: ["¿TENÉS UN", "PLAZO EN MENTE?"],
      budget: ["¿CUÁL ES TU", "PRESUPUESTO?"],
      hearAbout: ["¿CÓMO NOS", "CONOCISTE?"],
    },
    placeholders: {
      name: "NOMBRE",
      email: "MAIL",
      select: "ELEGÍ UNA OPCIÓN",
      shortAnswer: "RESPUESTA CORTA",
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
