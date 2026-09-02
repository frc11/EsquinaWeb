import type { Locale } from "@/lib/i18n/types";

/**
 * Contenido de `/services`. El inglés nació como transcripción verbatim de
 * `Final.pdf` pág. 8, y esa regla se conserva **para la forma**: guiones largos
 * (—), asteriscos, mayúsculas, apóstrofos rectos y rangos con guion corto van
 * tal cual llegan. Lo que cambió en R2 es que **el inglés ya no es intocable**:
 * la ronda 2 de devoluciones lo edita donde las clientas lo pidieron por escrito
 * (`docs/archivo/mockups/r2-trad-03.jpg`). El criterio pasa a ser el de siempre:
 * el copy lo deciden ellas, y la fuente de verdad es el PDF de la ronda vigente.
 * La variante en castellano la agregó B4 con el criterio del sprint —contextual,
 * voseo, y brevedad como decisión de diseño—.
 *
 * ## Cómo entra el castellano
 *
 * Tal como lo dejó preparado B3.4: todos los textos visibles viven en los campos
 * de `ServicePack` y de `ServicesCopy`, y la estructura —qué pack, qué número, a
 * dónde va el botón— vive en los campos que **no** son texto (`id`, `number`,
 * `quoteService`). La variante ES es **otro valor del mismo tipo**, elegido por
 * idioma en `getServicePacks` / `getServicesCopy`, sin tocar la forma de ningún
 * componente. **No hizo falta rediseñar la estructura**; el único cambio es que
 * la frase del intro pasa de `string` a **tres líneas explícitas**, porque su
 * corte es composición y no puede quedar librado al ancho del navegador.
 *
 * Dos consecuencias de diseño que hay que respetar al traducir:
 * 1. `id` es la ancla del scroll-spy y del sidebar (`#consultation`, …). **No se
 *    traduce**: es identidad, no texto. `navLabel` sí.
 * 2. `quoteService` es el valor de `?service=` que consume `ContactForm`. **No se
 *    traduce** tampoco: el formulario resuelve por valor canónico.
 */

/** Identidad de cada sección; es también el `id` del DOM y el ancla del sidebar. */
export type ServicePackId =
  | "consultation"
  | "essentials"
  | "universe"
  | "addons";

export interface ServicePackItem {
  readonly name: string;
  /** Columna derecha, en gris. Add-ons no lleva detalle en ningún ítem. */
  readonly detail?: string;
}

export interface ServicePack {
  readonly id: ServicePackId;
  /** Rótulo del sidebar. */
  readonly navLabel: string;
  /** `01`, `02`, `+`. `null` en Consultation, que no lleva número. */
  readonly number: string | null;
  /**
   * Una entrada por línea: **el corte lo decide el mockup, no el ancho de la
   * columna** —mismo criterio que los labels de `ContactForm`—. No es un
   * capricho: «BRAND UNIVERSE» mide 241 px a 30 px y entra holgado en la
   * columna de 270, así que librado al ancho quedaría en una línea mientras los
   * otros dos packs quedan en dos. En el PDF los tres cortan después de
   * «BRAND».
   */
  readonly name: readonly string[];
  /** Un párrafo por entrada. */
  readonly description: readonly string[];
  /** Nota al pie de la descripción (hoy solo Universe). */
  readonly footnote?: readonly string[];
  readonly items: readonly ServicePackItem[];
  /**
   * Precio del pack, **como cadena y no como número**: es texto de catálogo, no
   * un dato calculable. Va arriba del CTA y alineado a la derecha con él (R2,
   * `docs/archivo/mockups/r2-trad-03.jpg`). Opcional porque hoy solo lo lleva
   * consultoría; los otros tres se presupuestan y por eso no cambian.
   *
   * No es —ni va a ser— un campo de Sanity: el catálogo de Services es
   * hardcodeado bilingüe por decisión cerrada, igual que el resto de este
   * archivo.
   */
  readonly price?: string;
  /**
   * Rótulo del CTA **de este pack**. Cuando está, le gana al `quoteLabel` global
   * de `ServicesCopy`; cuando no, sale el global. La resolución ocurre en un solo
   * lugar (`ServicePackSection`), no en dos ramas copiadas.
   */
  readonly quoteLabel?: string;
  /** Nota bajo el botón de cotización. */
  readonly quoteNote?: string;
  /**
   * Valor de `?service=` hacia `/contact`. `null` = sin preselección: el
   * formulario abre con las pills vacías en vez de elegir por la clienta.
   * Los valores no nulos resuelven por **match exacto** contra
   * `WORK_TYPE_OPTIONS`, no por el fallback tolerante por keyword.
   */
  readonly quoteService: string | null;
}

/** Textos de la página que no pertenecen a ningún pack. */
export interface ServicesCopy {
  readonly intro: {
    readonly navLabel: string;
    /**
     * **Tres líneas centradas, con el corte escrito.** En inglés son las mismas
     * tres que producía el ancho de 1000 px, así que el render no se mueve un
     * píxel; en castellano el corte se eligió y se midió (832 / 797 / 606 px a
     * 40 px, contra 872 / 903 / 487 del inglés). El navegador no decide: si un
     * día el copy crece, el corte lo vuelve a decidir una persona.
     */
    readonly phrase: readonly [string, string, string];
    /** Indicador de scroll. No es un botón: no se clickea. */
    readonly scrollHint: string;
  };
  readonly packsHeading: {
    readonly label: string;
    /**
     * El corte en partes es el énfasis del PDF, no un capricho tipográfico: la
     * negrita arranca en `emphasis`. `tail` existe porque en el título el punto
     * final queda **fuera** de la negrita.
     */
    readonly title: {
      readonly lead: string;
      readonly emphasis: string;
      readonly tail: string;
    };
    readonly subtitle: { readonly lead: string; readonly emphasis: string };
  };
  readonly latestProjects: {
    readonly label: string;
    readonly paragraph: string;
    readonly links: readonly { readonly label: string; readonly href: string }[];
  };
  /**
   * Rótulo del CTA por defecto. Un pack puede pisarlo con su propio
   * `quoteLabel`; ver `ServicePack.quoteLabel`.
   */
  readonly quoteLabel: string;
}

export const SERVICES_COPY: ServicesCopy = {
  intro: {
    navLabel: "INTRO",
    phrase: [
      "WE TRANSLATE IDEAS INTO LIVING IDENTITIES —",
      "CRAFTED THROUGH STRATEGY, AESTHETICS AND",
      "EVERYTHING IN-BETWEEN.",
    ],
    scrollHint: "DISCOVER OUR SERVICES",
  },
  packsHeading: {
    label: "BRANDING PACKS",
    title: {
      lead: "Good design makes the difference between being seen and being ",
      emphasis: "remembered",
      tail: ".",
    },
    subtitle: {
      lead: "Whether we're shaping a brand from scratch or reimagining an existing one, our approach is rooted in ",
      emphasis:
        "creating experiences that feel authentic, memorable and visually cohesive across every touchpoint.",
    },
  },
  latestProjects: {
    label: "LATEST PROJECTS",
    paragraph:
      "Over the past 2 years, we've brought 20+ projects to life across diverse industries — from Food and Beverage to Fashion and Automotive.",
    links: [
      { label: "SEE MORE PROJECTS", href: "/work" },
      { label: "LET'S BRING YOUR IDEAS TO LIFE", href: "/contact" },
    ],
  },
  quoteLabel: "REQUEST FORMAL QUOTE",
};

/**
 * La lista de packs, con los cuatro `id` fijados en su orden. Es lo que hace que
 * un pack de menos, uno de más o uno fuera de orden sea un **error de
 * compilación** en cualquiera de los dos idiomas, y no un hueco en la página.
 */
export type ServicePackList = readonly [
  ServicePack & { readonly id: "consultation" },
  ServicePack & { readonly id: "essentials" },
  ServicePack & { readonly id: "universe" },
  ServicePack & { readonly id: "addons" },
];

export const SERVICE_PACKS: ServicePackList = [
  {
    id: "consultation",
    navLabel: "CONSULTATION",
    number: null,
    name: ["BRAND", "CONSULTATION"],
    description: [
      "A focused deep-dive into your brand and customer experience.",
      "Where you are, where you can go, and how to get there.",
    ],
    items: [
      {
        name: "Brand & Experience Audit",
        detail: "Where your brand stands today across every touchpoint",
      },
      {
        name: "3 Virtual Sessions",
        detail: "Discovery / Validation / Presentation",
      },
      {
        name: "Priorities & Roadmap",
        detail: "What to improve to meet your goals — how and where",
      },
      {
        name: "Deliverable PDF",
        detail: "Full report with findings and actionable recommendations",
      },
      {
        name: "From point A to point B",
        detail:
          "We turn our findings into a strategic roadmap, defining priorities, opportunities, and the tools or resources needed to bring them to life",
      },
    ],
    price: "$200",
    quoteLabel: "BOOK A CONSULTATION",
    quoteNote:
      "100% of investment credited toward any branding pack you start with us",
    quoteService: "CONSULTATION",
  },
  {
    id: "essentials",
    navLabel: "ESSENTIALS",
    number: "01",
    name: ["BRAND", "ESSENTIALS"],
    description: [
      "For brands ready to take shape. We define who you are and build a distinctive visual identity, plus the core tools to show up consistently from day one.",
    ],
    items: [
      {
        name: "Strategic Definition",
        detail: "Vision, Values, Tone of Voice & Brand Personality",
      },
      {
        name: "Market Research",
        detail: "Desk Research, Target Audience Definition & SWOT Analysis",
      },
      {
        name: "Value Proposition",
        detail: "Added-value ideas to enhance the consumer experience",
      },
      {
        name: "Visual Identity Development",
        detail:
          "Institutional Identity, Typography System, Color Palette, Graphic Elements, Photographic Direction",
      },
      {
        name: "Brand Guidelines",
        detail:
          "Basic brand usage guide for consistent and correct implementation (Approximately 20–40 pages)",
      },
      {
        name: "3 Custom Brand Applications of Choice",
        detail:
          "Business Card Design / Letterhead Design / Flyers / Stationery / Instagram Post Design (first publication) / Instagram Story Template Design / Signage Design",
      },
    ],
    quoteService: "BRANDING",
  },
  {
    id: "universe",
    navLabel: "UNIVERSE",
    number: "02",
    name: ["BRAND", "UNIVERSE"],
    description: [
      "Our most complete pack — for brands that want a whole world to grow into. Everything in Essentials, expanded so your brand launches fully formed and ready to scale.",
    ],
    footnote: ["(*)", "ITEMS EXCLUSIVE TO THIS PACK"],
    items: [
      {
        name: "Strategic Definition",
        detail: "Vision, Values, Tone of Voice & Brand Personality",
      },
      {
        name: "Market Research",
        detail: "Desk Research, Target Audience Definition & SWOT Analysis",
      },
      {
        name: "Value Proposition",
        detail: "Added-value ideas to enhance the consumer experience",
      },
      {
        name: "Visual Identity Development",
        detail:
          "Institutional Identity, Typography System, Color Palette, Graphic Elements, Photographic Direction & Social Media Visual Guidelines *",
      },
      {
        name: "Brand Guidelines",
        detail:
          "Basic brand usage guide for consistent and correct implementation (Approximately 40–60 pages)",
      },
      {
        name: "Logo Animation *",
        detail:
          "Animated version of your logo for digital platforms & video intros",
      },
      {
        name: "Landing Page Design *",
        detail:
          "One-page website design to introduce & validate your brand online (does not include programming)",
      },
      {
        name: "Initial Photoshoot *",
        detail: "Art direction + first photo session aligned with your identity",
      },
      {
        name: "Curated Image Library *",
        detail:
          "A selected bank of on-brand images ready to use across channels",
      },
      {
        name: "6 Custom Brand Applications of Choice",
        detail:
          "Business Card / Letterhead / Flyers / Stationery / Instagram Post / Story Template / Signage",
      },
    ],
    quoteService: "BRANDING",
  },
  {
    id: "addons",
    navLabel: "+ ADD-ONS",
    number: "+",
    name: ["ADD-ONS"],
    description: [
      "Complementary services to extend any brand — available with branding, consultation, or as standalone projects.",
    ],
    items: [
      { name: "Package Design" },
      { name: "Printing" },
      { name: "Illustration" },
      { name: "Editorial Design" },
      { name: "Motion Graphics" },
    ],
    quoteNote: "Quoted by project",
    quoteService: null,
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   VARIANTE EN CASTELLANO (B4/F4)

   Decisiones de vocabulario del rubro, tomadas caso por caso según el uso real
   en Argentina y no según el diccionario: **branding**, **packaging**,
   **rebranding**, **motion graphics**, **startup** y **landing** se quedan en
   inglés porque así se dicen acá; **brand guidelines** va como «manual de
   marca», **SWOT** como **FODA**, **stationery** como «papelería»,
   **letterhead** como «hoja membretada», **signage** como «señalética»,
   **roadmap** como «hoja de ruta» y **quote** como «presupuesto».
   ──────────────────────────────────────────────────────────────────────────── */

export const SERVICES_COPY_ES: ServicesCopy = {
  intro: {
    navLabel: "INTRO",
    phrase: [
      "TRADUCIMOS IDEAS EN IDENTIDADES VIVAS —",
      "CONSTRUIDAS CON ESTRATEGIA, ESTÉTICA",
      "Y TODO LO QUE HAY EN EL MEDIO.",
    ],
    scrollHint: "DESCUBRÍ NUESTROS SERVICIOS",
  },
  packsHeading: {
    label: "PACKS DE BRANDING",
    title: {
      lead: "El buen diseño marca la diferencia entre ser visto y ser ",
      emphasis: "recordado",
      tail: ".",
    },
    subtitle: {
      lead: "Ya sea que estemos creando una marca desde cero o reimaginando una que ya existe, nuestro enfoque parte de ",
      emphasis:
        "crear experiencias auténticas, memorables y visualmente coherentes en cada punto de contacto.",
    },
  },
  latestProjects: {
    label: "ÚLTIMOS PROYECTOS",
    paragraph:
      "En los últimos 2 años les dimos vida a más de 20 proyectos en rubros muy distintos: de gastronomía a moda y automotor.",
    // Los `href` son estructura, no texto: van iguales que en inglés.
    links: [
      { label: "VER MÁS PROYECTOS", href: "/work" },
      { label: "HAGAMOS REALIDAD TUS IDEAS", href: "/contact" },
    ],
  },
  // Global: cubre Esenciales, Universo y Adicionales. Consultoría lleva el suyo
  // propio (`quoteLabel` del pack), que le gana a este.
  quoteLabel: "SOLICITAR PRESUPUESTO",
};

export const SERVICE_PACKS_ES: ServicePackList = [
  {
    id: "consultation",
    navLabel: "CONSULTORÍA",
    number: null,
    // El inglés corta después de «BRAND»; en castellano el orden se da vuelta y
    // el corte natural queda después del sustantivo. Siguen siendo dos líneas.
    name: ["CONSULTORÍA", "DE MARCA"],
    description: [
      "Un análisis profundo y estratégico de tu marca y de la experiencia de tus clientes.",
      "Dónde estás, hacia dónde podés llegar y cómo hacerlo.",
    ],
    items: [
      {
        // Las clientas preguntaron si «Auditoría de marca y experiencia» entra en
        // UNA línea; si no, pidieron dejar «Auditoría de Marca» (R2,
        // `docs/archivo/mockups/r2-trad-04.jpg`). **No entra**: medido sobre el
        // sitio servido, la columna de nombres da 128 / 214 / 240 / 320 / 427 px
        // a 1024 / 1280 / 1360 / 1600 / 1920, y el rótulo largo pide 601 px a
        // 30 px — o sea una sola línea recién a partir de ~2560 de viewport.
        name: "Auditoría de Marca",
        detail: "Analizamos dónde está parada tu marca hoy en cada punto de contacto",
      },
      {
        name: "3 encuentros virtuales",
        detail: "Descubrimiento / Validación / Presentación",
      },
      {
        name: "Prioridades y hoja de ruta",
        detail: "Qué mejorar para llegar a tus objetivos — cómo y dónde",
      },
      {
        name: "Informe PDF entregable",
        detail: "Informe completo con hallazgos y recomendaciones accionables",
      },
      {
        name: "Definimos cómo avanzar",
        detail:
          "Convertimos los hallazgos en un plan de acción concreto, identificando oportunidades y definiendo el mejor camino para avanzar",
      },
    ],
    price: "$200",
    quoteLabel: "SOLICITAR CONSULTORÍA",
    quoteNote:
      "El 100% de la inversión se acredita al pack de branding que arranques con nosotras",
    quoteService: "CONSULTATION",
  },
  {
    id: "essentials",
    navLabel: "ESENCIALES",
    number: "01",
    name: ["ESENCIALES", "DE MARCA"],
    description: [
      "Para marcas listas para tomar forma.",
      "Definimos la esencia de tu marca y construimos una identidad visual distintiva, junto con las herramientas clave para comunicarla con coherencia desde el primer día.",
    ],
    items: [
      {
        name: "Definición estratégica",
        detail: "Visión, valores, tono de voz y personalidad de marca",
      },
      {
        name: "Investigación de mercado",
        detail:
          "Desk Research, definición del público y análisis FODA",
      },
      {
        name: "Propuesta de valor",
        detail:
          "Ideas de valor agregado para mejorar la experiencia del consumidor",
      },
      {
        name: "Desarrollo de identidad visual",
        detail:
          "Identidad institucional, sistema tipográfico, paleta de colores, elementos gráficos y dirección fotográfica",
      },
      {
        name: "Manual de marca",
        detail:
          "Guía básica de uso de la marca para una aplicación correcta y coherente (aproximadamente 20–40 páginas)",
      },
      {
        name: "3 aplicaciones de marca a elección",
        detail:
          "Tarjeta personal / Hoja membretada / Flyers / Papelería / Posteo de Instagram (primera publicación) / Plantilla de historia de Instagram / Señalética",
      },
    ],
    quoteService: "BRANDING",
  },
  {
    id: "universe",
    navLabel: "UNIVERSO",
    number: "02",
    name: ["UNIVERSO", "DE MARCA"],
    description: [
      "El paquete completo, pensado para marcas listas para construir una identidad sólida, profunda y preparada para crecer.",
      "Incluye todo lo que ofrece Esenciales de Marca, ampliado para desarrollar una presencia coherente, estratégica y con proyección.",
    ],
    footnote: ["(*)", "ÍTEMS EXCLUSIVOS DE ESTE PACK"],
    items: [
      {
        name: "Definición estratégica",
        detail: "Visión, valores, tono de voz y personalidad de marca",
      },
      {
        name: "Investigación de mercado",
        detail:
          "Desk Research, definición del público y análisis FODA",
      },
      {
        name: "Propuesta de valor",
        detail:
          "Ideas de valor agregado para mejorar la experiencia del consumidor",
      },
      {
        name: "Desarrollo de identidad visual",
        detail:
          "Identidad institucional, sistema tipográfico, paleta de colores, elementos gráficos, dirección fotográfica y lineamientos visuales para redes *",
      },
      {
        name: "Manual de marca",
        detail:
          "Guía básica de uso de la marca para una aplicación correcta y coherente (aproximadamente 40–60 páginas)",
      },
      {
        name: "Animación del logo *",
        detail:
          "Versión animada de tu logo para plataformas digitales",
      },
      {
        name: "Diseño de landing *",
        detail:
          "Diseño de landing page para presentar tu marca y darle presencia online. No incluye programación",
      },
      {
        name: "Producción de fotos inicial *",
        detail:
          "Dirección de arte y primera sesión de fotos alineada con tu identidad",
      },
      {
        name: "Banco de imágenes curado *",
        detail:
          "Una selección de imágenes de marca listas para usar en todos los canales",
      },
      {
        name: "6 aplicaciones de marca a elección",
        detail:
          "Tarjeta personal / Hoja membretada / Flyers / Papelería / Posteo de Instagram / Plantilla de historia / Señalética",
      },
    ],
    quoteService: "BRANDING",
  },
  {
    id: "addons",
    navLabel: "+ ADICIONALES",
    number: "+",
    name: ["ADICIONALES"],
    description: [
      "Servicios complementarios para potenciar cualquier marca: disponibles junto con nuestros servicios de branding y consultoría, o como proyectos independientes.",
    ],
    items: [
      { name: "Packaging" },
      { name: "Impresión" },
      { name: "Ilustración" },
      { name: "Diseño editorial" },
      { name: "Motion graphics" },
    ],
    quoteNote: "Se presupuesta por proyecto",
    quoteService: null,
  },
];

/** Los cuatro packs por id, en orden. Lo consume la página, que es de servidor. */
export const SERVICE_PACK_IDS = [
  "consultation",
  "essentials",
  "universe",
  "addons",
] as const satisfies readonly ServicePackId[];

/**
 * Los `id` del sidebar, en orden. **No dependen del idioma**: son anclas del
 * DOM, destino del scroll-spy y objetivo de los `href="#…"`. Van aparte de los
 * rótulos justamente para eso: el observer del sidebar se arma con esta lista y
 * por lo tanto **no se reconstruye al cambiar de idioma**.
 */
export const SERVICES_NAV_IDS = [
  'intro',
  ...SERVICE_PACK_IDS,
] as const satisfies readonly string[];

/** El contenido de la página en el idioma activo. */
export function getServicesCopy(locale: Locale): ServicesCopy {
  return locale === "es" ? SERVICES_COPY_ES : SERVICES_COPY;
}

export function getServicePacks(locale: Locale): ServicePackList {
  return locale === "es" ? SERVICE_PACKS_ES : SERVICE_PACKS;
}

export function getServicePack(locale: Locale, id: ServicePackId): ServicePack {
  // El `find` no puede fallar: la tupla `ServicePackList` fija los cuatro `id`.
  return getServicePacks(locale).find((pack) => pack.id === id) as ServicePack;
}

/** Orden del sidebar: el intro primero, después los cuatro packs. */
export function getServicesNav(
  locale: Locale,
): readonly { id: string; label: string }[] {
  return [
    { id: "intro", label: getServicesCopy(locale).intro.navLabel },
    ...getServicePacks(locale).map((pack) => ({
      id: pack.id,
      label: pack.navLabel,
    })),
  ];
}
