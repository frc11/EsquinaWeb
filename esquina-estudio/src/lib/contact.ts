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
  2. **Las banderas siguen funcionando.** `MonochromeCountryFlag` resuelve el
     patrón y los colores por el nombre **inglés** del país; recibiendo el valor
     canónico no hay que tocar ni una de sus 196 entradas.
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

export const WORK_TYPE_OPTIONS = [
  "Consultation",
  "Branding",
  "Rebranding",
  "Event Visual Identity",
  "Package Design",
  "Motion Graphics",
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

export const BUDGET_OPTIONS = [
  "$2,500–$4,000 USD",
  "$4,000–$6,500 USD",
  "$6,500–$8,000 USD",
  "$9,000+ USD",
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
  "Motion Graphics": "Motion graphics",
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
 * Los rangos de presupuesto **no se traducen**: son cifras y una moneda. Poner
 * el punto de miles a la argentina (`$2.500`) sobre montos en dólares se lee
 * como «2,5», que es peor que dejarlo. Además es lo que protege el piso medido
 * de 352 px del control derecho, que sale justo de `$2,500–$4,000 USD`.
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
