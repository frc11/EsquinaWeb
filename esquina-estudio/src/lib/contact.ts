import { z } from "zod";
import type { Locale } from "@/lib/i18n/types";

/*
  LOS VALORES SON CANÓNICOS; LOS RÓTULOS SON DEL IDIOMA
  ─────────────────────────────────────────────────────
  Las listas de opciones **no se traducen**: se traducen sus **rótulos**. El
  valor que guarda el formulario —y el que compara `?service=`— es siempre el
  inglés, y el castellano entra como una tabla de rótulos indexada por ese valor.

  No es una preferencia de estilo, resuelve tres cosas de una:

  1. **Cambiar de idioma no pierde lo elegido.** Si el valor guardado fuera el
     rótulo visible, al pasar a castellano `workType` valdría «Package Design»
     mientras la pill dice «Packaging»: la selección se vería vacía.
  2. **Las banderas siguen funcionando.** `CountryFlag` resuelve el archivo por
     el nombre **inglés** del país —`COUNTRY_FLAG_CODES` lo lleva a su código
     ISO—; recibiendo el valor canónico no hay que tocar ni una de sus 196
     entradas.
  3. **`?service=` no depende del idioma.** El catálogo de `/services` sigue
     emitiendo `CONSULTATION` y `BRANDING`, y el formulario los resuelve igual
     en las dos.

  Al enviar, los valores **viajan como se muestran** (§F5 del sprint): eso lo
  hace `localizeContactValues`, una sola vez, en el borde. El resto del mail que
  llega al estudio queda en inglés, que es como lo leen ellas.

  Las tablas de rótulos son **tipos mapeados sobre la lista canónica**: un país
  o una opción sin traducir es un error de compilación, no un texto en inglés
  perdido en producción.
*/

/**
 * Las diez pills, en el orden del mockup.
 *
 * **R2 cambió una por otra, en su lugar**: se fue `Motion Graphics` y entró
 * `Naming` («quitar motion graphics y agregar NAMING»,
 * `docs/archivo/mockups/r2-trad-15.jpg`). La anotación no dice dónde va la
 * nueva, así que ocupa la casilla de la que salió: es la lectura literal de
 * «quitar X y agregar Y» y deja el resto del orden intacto.
 *
 * **Queda una inconsistencia del pedido, y es de ellas, no del código:**
 * `Motion graphics` sigue siendo un ítem de `+ ADICIONALES` en `/services`
 * (`services-content.ts`), así que el servicio existe pero ya no se puede elegir
 * en el formulario. Está registrado en el reporte de la ronda para consultarlo.
 */
export const WORK_TYPE_OPTIONS = [
  "Consultation",
  "Branding",
  "Rebranding",
  "Event Visual Identity",
  "Package Design",
  "Naming",
  "Advertising/Campaign",
  "Illustration",
  "Editorial Design",
  "Other",
] as const;

export type WorkTypeOption = (typeof WORK_TYPE_OPTIONS)[number];

export const BUSINESS_TYPE_OPTIONS = [
  "Startup",
  "Established business",
  "Personal brand",
  "Other",
] as const;

export type BusinessTypeOption = (typeof BUSINESS_TYPE_OPTIONS)[number];

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1-2 months",
  "3+ months",
  "Flexible",
] as const;

export type TimelineOption = (typeof TIMELINE_OPTIONS)[number];

/**
 * Los cuatro rangos, **con el formato exacto que escribieron las clientas** en
 * `docs/archivo/mockups/r2-trad-15.jpg`: sin `USD`, sin separador de miles, y
 * con guion corto rodeado de espacios. R2 los reemplazó enteros.
 *
 * **Entre `$4000 – $6500` y `$7000 +` queda un pozo**: un presupuesto de $6.800
 * no tiene opción. Se implementa como lo pidieron y queda registrado en el
 * reporte de la ronda.
 *
 * Medido: el más ancho de los cuatro (`$4000 – $6500`) pide 236,5 px a 34 px
 * contra los 314 de la lista vieja, así que **el piso del control derecho baja
 * 77,6 px**. El aire no se usa para nada: esta ronda no rediseña el fit.
 */
export const BUDGET_OPTIONS = [
  "$1000 – $2500",
  "$2500 – $4000",
  "$4000 – $6500",
  "$7000 +",
] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];

export const COUNTRY_OPTIONS = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "DR Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

export type CountryOption = (typeof COUNTRY_OPTIONS)[number];

/**
 * Rótulos en castellano de los tipos de trabajo. Son las **pills**, que fijan el
 * ancho mínimo del bloque del formulario: cada una se eligió corta a propósito.
 * Medido, la tinta total de las diez baja de 1503 px (inglés, 17 px) a 1413, así
 * que el bloque sigue cerrando en **4 filas** en los siete anchos de la matriz.
 */
const WORK_TYPE_ES: { readonly [K in WorkTypeOption]: string } = {
  Consultation: "Consultoría",
  // Se quedan en inglés: es como se dicen en el rubro acá.
  Branding: "Branding",
  Rebranding: "Rebranding",
  "Event Visual Identity": "Identidad de evento",
  "Package Design": "Packaging",
  Naming: "Naming",
  "Advertising/Campaign": "Publicidad/Campaña",
  Illustration: "Ilustración",
  "Editorial Design": "Diseño editorial",
  Other: "Otro",
};

const BUSINESS_TYPE_ES: { readonly [K in BusinessTypeOption]: string } = {
  Startup: "Startup",
  "Established business": "Negocio establecido",
  "Personal brand": "Marca personal",
  Other: "Otro",
};

const TIMELINE_ES: { readonly [K in TimelineOption]: string } = {
  // «Lo antes posible» pide 60 px más a 34 px y el campo vive en la columna
  // corta: «cuanto antes» dice lo mismo y es como se dice acá.
  ASAP: "Cuanto antes",
  "1-2 months": "1-2 meses",
  "3+ months": "3+ meses",
  Flexible: "Flexible",
};

const COUNTRY_ES: { readonly [K in CountryOption]: string } = {
  "Afghanistan": "Afganistán",
  "Albania": "Albania",
  "Algeria": "Argelia",
  "Andorra": "Andorra",
  "Angola": "Angola",
  "Antigua and Barbuda": "Antigua y Barbuda",
  "Argentina": "Argentina",
  "Armenia": "Armenia",
  "Australia": "Australia",
  "Austria": "Austria",
  "Azerbaijan": "Azerbaiyán",
  "Bahamas": "Bahamas",
  "Bahrain": "Baréin",
  "Bangladesh": "Bangladesh",
  "Barbados": "Barbados",
  "Belarus": "Bielorrusia",
  "Belgium": "Bélgica",
  "Belize": "Belice",
  "Benin": "Benín",
  "Bhutan": "Bután",
  "Bolivia": "Bolivia",
  "Bosnia and Herzegovina": "Bosnia y Herzegovina",
  "Botswana": "Botsuana",
  "Brazil": "Brasil",
  "Brunei": "Brunéi",
  "Bulgaria": "Bulgaria",
  "Burkina Faso": "Burkina Faso",
  "Burundi": "Burundi",
  "Cabo Verde": "Cabo Verde",
  "Cambodia": "Camboya",
  "Cameroon": "Camerún",
  "Canada": "Canadá",
  "Central African Republic": "República Centroafricana",
  "Chad": "Chad",
  "Chile": "Chile",
  "China": "China",
  "Colombia": "Colombia",
  "Comoros": "Comoras",
  "Congo": "Congo",
  "Costa Rica": "Costa Rica",
  "Cote d'Ivoire": "Costa de Marfil",
  "Croatia": "Croacia",
  "Cuba": "Cuba",
  "Cyprus": "Chipre",
  "Czechia": "Chequia",
  "DR Congo": "RD del Congo",
  "Denmark": "Dinamarca",
  "Djibouti": "Yibuti",
  "Dominica": "Dominica",
  "Dominican Republic": "República Dominicana",
  "Ecuador": "Ecuador",
  "Egypt": "Egipto",
  "El Salvador": "El Salvador",
  "Equatorial Guinea": "Guinea Ecuatorial",
  "Eritrea": "Eritrea",
  "Estonia": "Estonia",
  "Eswatini": "Esuatini",
  "Ethiopia": "Etiopía",
  "Fiji": "Fiyi",
  "Finland": "Finlandia",
  "France": "Francia",
  "Gabon": "Gabón",
  "Gambia": "Gambia",
  "Georgia": "Georgia",
  "Germany": "Alemania",
  "Ghana": "Ghana",
  "Greece": "Grecia",
  "Grenada": "Granada",
  "Guatemala": "Guatemala",
  "Guinea": "Guinea",
  "Guinea-Bissau": "Guinea-Bisáu",
  "Guyana": "Guyana",
  "Haiti": "Haití",
  "Honduras": "Honduras",
  "Hungary": "Hungría",
  "Iceland": "Islandia",
  "India": "India",
  "Indonesia": "Indonesia",
  "Iran": "Irán",
  "Iraq": "Irak",
  "Ireland": "Irlanda",
  "Israel": "Israel",
  "Italy": "Italia",
  "Jamaica": "Jamaica",
  "Japan": "Japón",
  "Jordan": "Jordania",
  "Kazakhstan": "Kazajistán",
  "Kenya": "Kenia",
  "Kiribati": "Kiribati",
  "Kuwait": "Kuwait",
  "Kyrgyzstan": "Kirguistán",
  "Laos": "Laos",
  "Latvia": "Letonia",
  "Lebanon": "Líbano",
  "Lesotho": "Lesoto",
  "Liberia": "Liberia",
  "Libya": "Libia",
  "Liechtenstein": "Liechtenstein",
  "Lithuania": "Lituania",
  "Luxembourg": "Luxemburgo",
  "Madagascar": "Madagascar",
  "Malawi": "Malaui",
  "Malaysia": "Malasia",
  "Maldives": "Maldivas",
  "Mali": "Malí",
  "Malta": "Malta",
  "Marshall Islands": "Islas Marshall",
  "Mauritania": "Mauritania",
  "Mauritius": "Mauricio",
  "Mexico": "México",
  "Micronesia": "Micronesia",
  "Moldova": "Moldavia",
  "Monaco": "Mónaco",
  "Mongolia": "Mongolia",
  "Montenegro": "Montenegro",
  "Morocco": "Marruecos",
  "Mozambique": "Mozambique",
  "Myanmar": "Myanmar",
  "Namibia": "Namibia",
  "Nauru": "Nauru",
  "Nepal": "Nepal",
  "Netherlands": "Países Bajos",
  "New Zealand": "Nueva Zelanda",
  "Nicaragua": "Nicaragua",
  "Niger": "Níger",
  "Nigeria": "Nigeria",
  "North Korea": "Corea del Norte",
  "North Macedonia": "Macedonia del Norte",
  "Norway": "Noruega",
  "Oman": "Omán",
  "Pakistan": "Pakistán",
  "Palau": "Palaos",
  "Palestine": "Palestina",
  "Panama": "Panamá",
  "Papua New Guinea": "Papúa Nueva Guinea",
  "Paraguay": "Paraguay",
  "Peru": "Perú",
  "Philippines": "Filipinas",
  "Poland": "Polonia",
  "Portugal": "Portugal",
  "Qatar": "Qatar",
  "Romania": "Rumania",
  "Russia": "Rusia",
  "Rwanda": "Ruanda",
  "Saint Kitts and Nevis": "San Cristóbal y Nieves",
  "Saint Lucia": "Santa Lucía",
  "Saint Vincent and the Grenadines": "San Vicente y las Granadinas",
  "Samoa": "Samoa",
  "San Marino": "San Marino",
  "Sao Tome and Principe": "Santo Tomé y Príncipe",
  "Saudi Arabia": "Arabia Saudita",
  "Senegal": "Senegal",
  "Serbia": "Serbia",
  "Seychelles": "Seychelles",
  "Sierra Leone": "Sierra Leona",
  "Singapore": "Singapur",
  "Slovakia": "Eslovaquia",
  "Slovenia": "Eslovenia",
  "Solomon Islands": "Islas Salomón",
  "Somalia": "Somalia",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  "South Sudan": "Sudán del Sur",
  "Spain": "España",
  "Sri Lanka": "Sri Lanka",
  "Sudan": "Sudán",
  "Suriname": "Surinam",
  "Sweden": "Suecia",
  "Switzerland": "Suiza",
  "Syria": "Siria",
  "Taiwan": "Taiwán",
  "Tajikistan": "Tayikistán",
  "Tanzania": "Tanzania",
  "Thailand": "Tailandia",
  "Timor-Leste": "Timor-Leste",
  "Togo": "Togo",
  "Tonga": "Tonga",
  "Trinidad and Tobago": "Trinidad y Tobago",
  "Tunisia": "Túnez",
  "Turkey": "Turquía",
  "Turkmenistan": "Turkmenistán",
  "Tuvalu": "Tuvalu",
  "Uganda": "Uganda",
  "Ukraine": "Ucrania",
  "United Arab Emirates": "Emiratos Árabes Unidos",
  "United Kingdom": "Reino Unido",
  "United States": "Estados Unidos",
  "Uruguay": "Uruguay",
  "Uzbekistan": "Uzbekistán",
  "Vanuatu": "Vanuatu",
  "Vatican City": "Ciudad del Vaticano",
  "Venezuela": "Venezuela",
  "Vietnam": "Vietnam",
  "Yemen": "Yemen",
  "Zambia": "Zambia",
  "Zimbabwe": "Zimbabue",
};

/**
 * Rótulo visible de un valor canónico. En inglés el valor **es** el rótulo, así
 * que la función es la identidad y no hay tabla que mantener de ese lado.
 *
 * Hay una tabla por lista y no una sola tabla plana a propósito: dos listas
 * pueden compartir un valor con traducciones distintas (hoy `Other` aparece en
 * dos y coincide, pero eso es casualidad, no contrato).
 */
export function workTypeLabel(locale: Locale, value: string) {
  return locale === "es"
    ? (WORK_TYPE_ES[value as WorkTypeOption] ?? value)
    : value;
}

export function businessTypeLabel(locale: Locale, value: string) {
  return locale === "es"
    ? (BUSINESS_TYPE_ES[value as BusinessTypeOption] ?? value)
    : value;
}

export function timelineLabel(locale: Locale, value: string) {
  return locale === "es"
    ? (TIMELINE_ES[value as TimelineOption] ?? value)
    : value;
}

export function countryLabel(locale: Locale, value: string) {
  return locale === "es"
    ? (COUNTRY_ES[value as CountryOption] ?? value)
    : value;
}

/**
 * # Búsqueda de países: normalización, alias y por qué el castellano sale gratis
 * (M3/F7, punto 13-alias)
 *
 * Hasta M2 el buscador comparaba `rótulo.toLowerCase().includes(consulta)`, y eso
 * fallaba en tres frentes: no encontraba `Japan` escribiendo «japon» —la tilde
 * cuenta como otro carácter—, no encontraba nada por su abreviatura o su nombre
 * de uso corriente («UK», «EEUU», «Holanda»), y solo miraba el rótulo del idioma
 * activo, así que el nombre inglés no servía con el sitio en castellano ni al
 * revés.
 *
 * ## Los tres frentes, y cómo se cubren
 *
 * 1. **Tildes y mayúsculas** las resuelve `normalizeSearch`, que descompone en
 *    NFD y borra los diacríticos combinantes. Vale también para la eñe, que en
 *    NFD es `n` + tilde: «espana» encuentra `España`. Se aplica a los dos lados
 *    de la comparación, así que da igual cómo escriba cada uno.
 *
 * 2. **El castellano de los 196 países sale del rótulo traducido y no de esta
 *    tabla.** Es la evaluación que pedía el sprint, y la respuesta es que
 *    conviene: `COUNTRY_ES` ya tiene los 196 nombres, así que meterlos en el
 *    corpus de búsqueda cubre **todos** los países sin escribir un solo alias, y
 *    no puede desincronizarse —si mañana se corrige una traducción, la búsqueda
 *    la toma sola—. Escribirlos a mano en una tabla de alias sería duplicar 196
 *    líneas que ya existen, que es exactamente lo que la regla 10 evita.
 *
 * 3. **Esta tabla queda entonces solo para lo que NO es ni el nombre inglés ni
 *    el castellano**: siglas (`UK`, `EEUU`), nombres históricos (`Suazilandia`)
 *    y formas de uso corriente que no son la traducción oficial (`Holanda`,
 *    `Inglaterra`). Son pocas y no crecen solas.
 *
 * ## Qué se busca contra qué
 *
 * El corpus de cada país son **las tres cosas a la vez** —nombre inglés, nombre
 * castellano y alias— **sin mirar el idioma activo**. Así «germany» funciona con
 * el sitio en castellano y «alemania» con el sitio en inglés: quien escribe ya
 * sabe cómo se llama el país en su cabeza, y hacerle adivinar en qué idioma está
 * el sitio no ayuda a nadie.
 *
 * Nada de esto cambia lo que se **muestra**: el rótulo sigue saliendo de
 * `countryLabel` y el valor guardado sigue siendo el canónico inglés.
 */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Nombres alternativos que **no** son ni el canónico inglés ni el castellano de
 * `COUNTRY_ES`. Solo hace falta agregar acá lo que ninguno de los dos cubre.
 *
 * Varios de los países que enumera la instrucción **no están en esta tabla, y es
 * correcto**: `Germany`, `Spain`, `Brazil`, `Japan`, `Switzerland`,
 * `South Korea`, `North Korea` y `Vatican City` ya se encuentran por su nombre
 * castellano, y `North Macedonia` por subcadena de «Macedonia del Norte».
 * Repetirlos sería tabla muerta.
 */
const COUNTRY_SEARCH_ALIASES: Partial<Record<CountryOption, readonly string[]>> = {
  "DR Congo": [
    "republica democratica del congo",
    "republica democratica",
    "democratic republic of the congo",
    "democratic republic",
    "congo",
    "rdc",
    "drc",
    "zaire",
  ],
  "United States": ["usa", "us", "eeuu", "ee uu", "united states of america"],
  "United Kingdom": [
    "uk",
    "inglaterra",
    "england",
    "gran bretaña",
    "great britain",
    "britain",
  ],
  "Cote d'Ivoire": ["ivory coast", "costa de marfil"],
  Czechia: ["republica checa", "czech republic"],
  Netherlands: ["holanda", "holland"],
  Eswatini: ["suazilandia", "swaziland"],
  "Timor-Leste": ["timor oriental", "east timor"],
  "Cabo Verde": ["cape verde"],
  "North Macedonia": ["macedonia"],
  "Vatican City": ["holy see", "santa sede"],
  "South Korea": ["korea", "republic of korea"],
  "North Korea": ["korea", "dprk"],
};

/**
 * Todo contra lo que se puede encontrar un país, ya normalizado. Se calcula una
 * vez por módulo —196 entradas— y no por tecla.
 */
const COUNTRY_SEARCH_INDEX: ReadonlyMap<string, readonly string[]> = new Map(
  COUNTRY_OPTIONS.map((option) => [
    option,
    [
      option,
      COUNTRY_ES[option],
      ...(COUNTRY_SEARCH_ALIASES[option] ?? []),
    ].map(normalizeSearch),
  ]),
);

/** Los términos por los que se puede encontrar un país. Ya normalizados. */
export function countrySearchTerms(option: string): readonly string[] {
  return COUNTRY_SEARCH_INDEX.get(option) ?? [normalizeSearch(option)];
}

/**
 * Los rangos de presupuesto **no se traducen**: son cifras. Desde R2 ni siquiera
 * llevan moneda, así que no hay nada que traducir; el formato es el que
 * escribieron las clientas y está documentado en `BUDGET_OPTIONS`.
 *
 * Nota sobre el piso del control derecho, que este archivo declaraba mal: hasta
 * R2 decía que los 352 px salían de `$2,500–$4,000 USD`, y no era cierto — el
 * más ancho de la lista vieja era `$6,500–$8,000 USD`, 2,09 px más a 34 px. Con
 * la lista nueva la discusión es otra: el piso lo fija el **placeholder**, que es
 * el único texto del select con `truncate`.
 */
export function budgetLabel(_locale: Locale, value: string) {
  return value;
}

/**
 * Los 196 países, ordenados alfabéticamente **en el idioma que se muestra**. La
 * lista sigue siendo de valores canónicos: lo único que cambia es el orden, que
 * es un asunto de lectura. Se calcula una vez por módulo, no por render.
 *
 * El orden castellano se computa con `localeCompare` y no se escribe a mano: son
 * 196 líneas que se desincronizarían con la tabla de rótulos a la primera
 * corrección. Como el servidor **siempre rinde inglés**, una diferencia de
 * colación entre motores no puede producir un desajuste de hidratación.
 */
const COUNTRY_OPTIONS_ES_ORDER: readonly string[] = [...COUNTRY_OPTIONS].sort(
  (a, b) =>
    countryLabel("es", a).localeCompare(countryLabel("es", b), "es"),
);

export function getCountryOptions(locale: Locale): readonly string[] {
  return locale === "es" ? COUNTRY_OPTIONS_ES_ORDER : COUNTRY_OPTIONS;
}

/**
 * Mensajes de validación: el esquema lleva **claves**, no frases.
 *
 * El mismo esquema lo usa el route handler, que no muestra nada, y el resolver
 * del formulario, que sí. Si llevara la frase inglesa, el mensaje en pantalla se
 * quedaría en inglés —y peor: `react-hook-form` guarda el mensaje al validar, o
 * sea que un cambio de idioma con errores en pantalla no lo actualizaría nunca—.
 * Con una clave, la frase la pone el render y sigue al idioma en el acto.
 */
export const CONTACT_ERROR_KEYS = ["fullName", "email"] as const;
export type ContactErrorKey = (typeof CONTACT_ERROR_KEYS)[number];

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "fullName"),
  email: z.string().trim().email("email"),
  workType: z.array(z.string()).optional(),
  businessType: z.string().optional(),
  industry: z.string().trim().optional(),
  country: z.string().optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  hearAbout: z.string().trim().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

/**
 * Lleva los valores canónicos a los rótulos del idioma, justo antes de enviar.
 * Es lo que hace que el mail que llega al estudio muestre lo que la clienta vio.
 * Los campos de texto libre (`fullName`, `email`, `industry`, `hearAbout`) viajan
 * tal cual: ya son de ella.
 */
export function localizeContactValues(
  values: ContactFormValues,
  locale: Locale,
): ContactFormValues {
  if (locale === "en") return values;

  return {
    ...values,
    workType: values.workType?.map((value) => workTypeLabel(locale, value)),
    businessType: values.businessType
      ? businessTypeLabel(locale, values.businessType)
      : values.businessType,
    country: values.country
      ? countryLabel(locale, values.country)
      : values.country,
    timeline: values.timeline
      ? timelineLabel(locale, values.timeline)
      : values.timeline,
    budget: values.budget ? budgetLabel(locale, values.budget) : values.budget,
  };
}
