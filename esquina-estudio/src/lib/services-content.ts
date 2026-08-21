/**
 * Contenido de `/services`, transcrito verbatim de `Final.pdf` pág. 8.
 *
 * **No se edita el texto.** Guiones largos (—), asteriscos, mayúsculas,
 * apóstrofos rectos y rangos con guion corto van tal cual llegaron: el
 * contenido es de las clientas, no del código.
 *
 * ## Cómo entra el español en el Bloque 4
 *
 * Todos los textos visibles viven en los campos de `ServicePack` y de
 * `ServicesCopy`; la estructura (qué pack, qué número, qué ítem, a dónde va el
 * botón) vive en los campos que **no** son texto: `id`, `number`, `quoteService`.
 * Eso hace que la variante ES sea **otro valor del mismo tipo** —
 * `SERVICE_PACKS_ES: readonly ServicePack[]` y `SERVICES_COPY_ES: ServicesCopy`—
 * seleccionado por locale, sin tocar ni un componente:
 *
 * ```ts
 * const packs = locale === "es" ? SERVICE_PACKS_ES : SERVICE_PACKS;
 * ```
 *
 * Dos consecuencias de diseño que hay que respetar al traducir:
 * 1. `id` es la ancla del scroll-spy y del sidebar (`#consultation`, …). **No se
 *    traduce**: es identidad, no texto. `navLabel` sí.
 * 2. `quoteService` es el valor de `?service=` que consume `ContactForm`. **No se
 *    traduce** tampoco: el mapeo del formulario está en inglés.
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
    readonly phrase: string;
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
  readonly quoteLabel: string;
}

export const SERVICES_COPY: ServicesCopy = {
  intro: {
    navLabel: "INTRO",
    phrase:
      "WE TRANSLATE IDEAS INTO LIVING IDENTITIES — CRAFTED THROUGH STRATEGY, AESTHETICS AND EVERYTHING IN-BETWEEN.",
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

export const SERVICE_PACKS: readonly ServicePack[] = [
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
        name: "Honest Recommendations",
        detail: "What we can solve — and trusted colleagues for what we can't",
      },
    ],
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

/** Orden del sidebar: el intro primero, después los cuatro packs. */
export const SERVICES_NAV: readonly { id: string; label: string }[] = [
  { id: "intro", label: SERVICES_COPY.intro.navLabel },
  ...SERVICE_PACKS.map((pack) => ({ id: pack.id, label: pack.navLabel })),
];
