/**
 * COUNTRY_FLAG_COLORS — palette per country, ordered to match the geometry
 * consumed by each pattern function in `MonochromeCountryFlag.tsx`.
 *
 * ⚠️ HUMAN REVIEW REQUIRED (accuracy by country).
 * Hex values are sourced from public flag specifications (Wikipedia infobox
 * "Colors" tables / official decrees), NOT eyeballed. Patterns that are
 * stylized line-art (emblems, quartered, seals, complex charges) are
 * intentionally APPROXIMATE — only the dominant regions are colored.
 *
 * Color order per pattern (slot index → region):
 *   horizontal-tricolor        → [top, middle, bottom] (+[3] seal if emblem)
 *   horizontal-bicolor         → [top, bottom]         (+[2] seal if emblem)
 *   vertical-tricolor          → [left, center, right] (+[3] seal if emblem)
 *   vertical-bicolor           → [left, right]
 *   horizontal-stripes         → [s1..s5] top→bottom, tiled cyclically
 *   nordic                     → [field, cross]
 *   triangle (hoist)           → [hoistTriangle, field, emblem]
 *   bicolor-triangle           → [hoistTriangle, emblem, band1, band2]
 *   tricolor-triangle          → [hoistTriangle, emblem, band1, band2, band3]
 *   stripes-triangle           → [hoistTriangle, emblem, s1..s5]
 *   canton                     → [canton, emblem, field]
 *   canton-stripes             → [stripeOdd, stripeEven, canton, emblem]
 *   full-cross                 → [tl, tr, bl, br, cross]
 *   saltire                    → [wedgeTopBottom, wedgeSides, saltire, emblem]
 *   union-jack                 → [field, white, red]
 *   diagonal                   → [upperLeft, lowerRight]
 *   center-disc                → [field, disc]
 *   cross (Suiza)              → [field, cross]
 *   crescent                   → [field, emblem]
 *   field-emblem               → [field, emblem]
 *   panels                     → [hoist, flyTop, flyBottom, emblem]
 *   argentina                  → [skyTop, white, skyBottom, sun]
 *   uruguay                    → [stripeWhite, stripeBlue, canton, sun]
 *   chile                      → [canton, white, red, star]
 *   colombia                   → [yellow, blue, red]
 *   venezuela                  → [top, middle, bottom, stars]
 *   paraguay                   → [top, middle, bottom, emblem]
 *   spain                      → [topRed, yellow, bottomRed, emblem]
 *   portugal                   → [hoistGreen, flyRed, emblem]
 *   brazil                     → [field, lozenge, disc]
 *   canada                     → [redBar, white, redBar, leaf]
 *   china                      → [field, stars]
 *   greece                     → [stripeBlue, stripeWhite, canton, cross]
 *   united-states              → [stripeRed, stripeWhite, canton, stars]
 *   israel                     → [white, stripeBlue, star]
 *   south-africa               → [top, bottom, pall, hoistTriangle]
 *   south-korea                → [white, trigram, taegeukTop, taegeukBottom]
 *   quartered (Panama)         → [tl, tr, bl, br, starTl, starBr]
 *   ensign (AU/NZ/etc.)        → [field, canton, stars]
 *   nepal                      → [field, border, emblem]
 *
 * Common hexes reused below:
 *   red #CE1126 / #D52B1E / #EF3340 · blue #0033A0 / #003580 / #002868
 *   green #009639 / #006A4E · yellow #FCD116 / #FFD100 · white #FFFFFF
 *   black #000000
 */

const W = "#FFFFFF";
const K = "#000000";

export const COUNTRY_FLAG_COLORS: Record<string, string[]> = {
  // ── Horizontal tricolor [top, middle, bottom] ──
  Armenia: ["#D90012", "#0033A0", "#F2A800"],
  Austria: ["#ED2939", W, "#ED2939"],
  Bolivia: ["#D52B1E", "#F9E300", "#007A33"],
  Bulgaria: [W, "#00966E", "#D62612"],
  Estonia: ["#0072CE", K, W],
  Gabon: ["#009E60", "#FCD116", "#3A75C4"],
  Germany: [K, "#DD0000", "#FFCE00"],
  Hungary: ["#CD2A3E", W, "#436F4D"],
  Latvia: ["#9E3039", W, "#9E3039"],
  Lithuania: ["#FDB913", "#006A44", "#C1272D"],
  Luxembourg: ["#ED2939", W, "#00A1DE"],
  Netherlands: ["#AE1C28", W, "#21468B"],
  Russia: [W, "#0039A6", "#D52B1E"],
  "Sierra Leone": ["#1EB53A", W, "#0072C6"],
  Yemen: ["#CE1126", W, K],

  // ── Horizontal tricolor + emblem [top, middle, bottom, seal] ──
  Afghanistan: ["#000000", "#BE0000", "#009900", "#FFFFFF"],
  Azerbaijan: ["#00B5E2", "#EF3340", "#509E2F", W],
  Cambodia: ["#032EA1", "#E00025", "#032EA1", W],
  Croatia: ["#FF0000", W, "#171796", "#FCD116"],
  Ecuador: ["#FFDD00", "#034EA2", "#ED1C24", "#A57939"],
  Egypt: ["#CE1126", W, K, "#C09300"],
  "El Salvador": ["#0F47AF", W, "#0F47AF", "#1E5BA8"],
  Eswatini: ["#3E5EB9", "#FFD900", "#B10C0C", K],
  Ethiopia: ["#078930", "#FCDD09", "#DA121A", "#0F47AF"],
  Ghana: ["#CE1126", "#FCD116", "#006B3F", K],
  Honduras: ["#0073CF", W, "#0073CF", "#0073CF"],
  India: ["#FF9933", W, "#138808", "#000080"],
  Iran: ["#239F40", W, "#DA0000", "#DA0000"],
  Iraq: ["#CE1126", W, K, "#007A3D"],
  Kenya: [K, "#BB0000", "#006600", "#B07A2E"],
  Laos: ["#CE1126", "#002868", "#CE1126", W],
  Lebanon: ["#ED1C24", W, "#ED1C24", "#00A651"],
  Lesotho: ["#00209F", W, "#009543", K],
  Libya: ["#E70013", K, "#239E46", W],
  Malawi: [K, "#CE1126", "#339E35", "#CE1126"],
  Myanmar: ["#FECB00", "#34B233", "#EA2839", W],
  Nicaragua: ["#0067C6", W, "#0067C6", "#0067C6"],
  Niger: ["#E05206", W, "#0DB02B", "#E05206"],
  "North Korea": ["#024FA2", "#ED1C27", "#024FA2", W],
  Rwanda: ["#00A1DE", "#FAD201", "#20603D", "#E5BE01"],
  Serbia: ["#C6363C", "#0C4076", W, "#EDB92E"],
  Slovakia: [W, "#0B4EA2", "#EE1C25", "#0B4EA2"],
  Slovenia: [W, "#0000A0", "#ED1C24", "#0000A0"],
  Syria: ["#CE1126", W, K, "#007A3D"],
  Tajikistan: ["#CE1126", W, "#006600", "#F8C300"],
  Uzbekistan: ["#0099B5", W, "#1EB53A", "#CE1126"],

  // ── Horizontal bicolor [top, bottom] ──
  Angola: ["#CE1126", "#000000", "#FFCB00"],
  Indonesia: ["#FF0000", W],
  Liechtenstein: ["#002B7F", "#CE1126", "#FFD83D"],
  Monaco: ["#CE1126", W],
  Poland: [W, "#DC143C"],
  Ukraine: ["#0057B7", "#FFD700"],

  // ── Horizontal bicolor + emblem [top, bottom, seal] ──
  Bahrain: ["#FFFFFF", "#CE1126"],
  "Burkina Faso": ["#EF2B2D", "#009E49", "#FCD116"],
  Haiti: ["#00209F", "#D21034", "#FFFFFF"],
  Malta: ["#FFFFFF", "#CF142B"],
  Nauru: ["#002B7F", "#002B7F", "#FFC61E"],
  Singapore: ["#EF3340", W, W],

  // ── Vertical tricolor [left, center, right] ──
  Belgium: [K, "#FAE042", "#ED2939"],
  Chad: ["#002664", "#FECB00", "#C60C30"],
  "Cote d'Ivoire": ["#F77F00", W, "#009E60"],
  France: ["#002395", W, "#ED2939"],
  Guinea: ["#CE1126", "#FCD116", "#009460"],
  Ireland: ["#169B62", W, "#FF883E"],
  Italy: ["#008C45", "#F4F5F0", "#CD212A"],
  Mali: ["#14B53A", "#FCD116", "#CE1126"],
  Nigeria: ["#008751", W, "#008751"],
  Peru: ["#D91023", W, "#D91023"],
  Romania: ["#002B7F", "#FCD116", "#CE1126"],

  // ── Vertical tricolor + emblem [left, center, right, seal] ──
  Andorra: ["#10069F", "#FEDF00", "#D50032", "#C7B37F"],
  Barbados: ["#00267F", "#FFC726", "#00267F", K],
  Cameroon: ["#007A5E", "#CE1126", "#FCD116", "#FCD116"],
  Guatemala: ["#4997D0", W, "#4997D0", "#5C8A3A"],
  Mexico: ["#006847", W, "#CE1126", "#8C6239"],
  Moldova: ["#0046AE", "#FFD200", "#CC092F", "#B07A2E"],
  Mongolia: ["#C4272E", "#015197", "#C4272E", "#F9CF02"],
  Senegal: ["#00853F", "#FDEF42", "#E31B23", "#00853F"],

  // ── Vertical bicolor [left, right] ──
  "Vatican City": ["#FFE000", W],

  // ── Horizontal stripes [top→bottom, tiled] ──
  Belarus: ["#CE1720", "#007C30"],
  Botswana: ["#75AADB", W, K, W, "#75AADB"],
  "Cabo Verde": ["#003893", W, "#CF2027", W, "#003893"],
  "Central African Republic": ["#003082", W, "#289728", "#FFCE00", "#D21034"],
  "Costa Rica": ["#002B7F", W, "#CE1126", W, "#002B7F"],
  Gambia: ["#CE1126", W, "#0C1C8C", W, "#3A7728"],
  Liberia: ["#BF0A30", "#FFFFFF", "#002B7F", "#FFFFFF"],
  Malaysia: ["#CC0001", "#FFFFFF", "#010066", "#FFCC00"],
  Mauritius: ["#EA2839", "#1A206D", "#FFD500", "#00A551", "#EA2839"],
  "North Macedonia": ["#D20000", "#FFE600"],
  Suriname: ["#377E3F", W, "#B40A2D", W, "#377E3F"],
  Thailand: ["#A51931", W, "#2D2A4A", W, "#A51931"],
  Togo: ["#006A4E", "#FFCE00", "#D21034", "#FFFFFF"],
  Uganda: [K, "#FCDC04", "#D90000", K, "#FCDC04"],

  // ── Nordic [field, cross] ──
  Denmark: ["#C8102E", W],
  Finland: [W, "#003580"],
  Iceland: ["#02529C", W],
  Norway: ["#BA0C2F", "#00205B"],
  Sweden: ["#006AA7", "#FECC02"],

  // ── Triangle (hoist) [hoistTriangle, field, star] ──
  "Antigua and Barbuda": ["#CE1126", "#FCD116", "#000000", "#0072C6", "#FFFFFF"],
  Bahamas: ["#000000", "#FFC72C", "#00778B", "#FFC72C", "#00778B"],
  Comoros: ["#3A75C4", "#FFFFFF", "#FFFF00", "#FFFFFF", "#CE1126", "#3D8E33", "#3D8E33"],
  Cuba: ["#CF142B", "#FFFFFF", "#002A8F", "#FFFFFF", "#002A8F", "#FFFFFF", "#002A8F"],
  Czechia: ["#11457E", "#FFFFFF", "#FFFFFF", "#D7141A"],
  Djibouti: ["#FFFFFF", "#D7141A", "#6AB2E7", "#12AD2B"],
  "Equatorial Guinea": ["#0073CE", "#FFFFFF", "#3E9A00", "#FFFFFF", "#E32118"],
  Eritrea: ["#EA0437", "#12AD2B", "#FFC726"],
  Guyana: ["#FCD116", "#009E49", "#CE1126"],
  Jordan: ["#CE1126", "#FFFFFF", "#000000", "#FFFFFF", "#007A3D"],
  Kuwait: ["#000000", "#FFFFFF", "#007A3D", "#FFFFFF", "#CE1126"],
  Mozambique: ["#CE1126", "#FFFFFF", "#007168", "#000000", "#FCE100"],
  Oman: ["#DB161B", "#FFFFFF", "#008000", "#FFFFFF"],
  Palestine: ["#CE1126", "#FFFFFF", "#000000", "#FFFFFF", "#007A3D"],
  Philippines: ["#FFFFFF", "#FCD116", "#0038A8", "#CE1126"],
  "Sao Tome and Principe": ["#D21034", "#FFCE00", "#12AD2B", "#FFCE00", "#12AD2B"],
  "South Sudan": ["#0F47AF", "#FCDD09", "#000000", "#DA121A", "#078930"],
  Sudan: ["#007A3D", "#FFFFFF", "#D21034", "#FFFFFF", "#000000"],
  "Timor-Leste": ["#000000", "#DC241F", "#FFFFFF"],
  Vanuatu: ["#000000", "#FDCE12", "#D21034", "#009543"],
  Zimbabwe: ["#FFFFFF", "#FFD700", "#319208", "#FFD200", "#000000", "#FFD200", "#319208"],
  // ── Diagonal [upperLeft, lowerRight] ──
  Bhutan: ["#FFD520", "#FF4E12"],
  "Bosnia and Herzegovina": ["#002395", "#002395"],
  Brunei: ["#FFFFFF", "#F7E017"],
  Burundi: ["#CE1126", "#1EB53A", "#FFFFFF", "#CE1126"],
  Congo: ["#009543", "#DC241F"],
  "DR Congo": ["#007FFF", "#007FFF"],
  Grenada: ["#CE1126", "#CE1126"],
  Jamaica: ["#009B3A", "#000000", "#FED100", "#FED100"],
  "Marshall Islands": ["#003893", "#003893"],
  Namibia: ["#003580", "#009543"],
  "Papua New Guinea": ["#CE1126", K],
  "Saint Kitts and Nevis": ["#009E49", "#CE1126"],
  Seychelles: ["#003F87", "#D62828"],
  "Solomon Islands": ["#0051BA", "#215B33"],
  Tanzania: ["#1EB53A", "#00A3DD"],
  "Trinidad and Tobago": ["#DA1A35", "#DA1A35"],

  // ── Center-disc [field, disc] ──
  Bangladesh: ["#006A4E", "#F42A41"],
  Japan: [W, "#BC002D"],
  Kazakhstan: ["#00AFCA", "#FEC50C"],
  Kyrgyzstan: ["#E8112D", "#FFEF00"],
  Palau: ["#4AADD6", "#FFDE00"],

  // ── Cross [field, cross] ──
  "Dominican Republic": ["#002D62", "#CE1126", "#CE1126", "#002D62", "#FFFFFF"],
  Georgia: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FF0000"],
  "San Marino": ["#FFFFFF", "#5EB6E4", "#FFD700"],
  Switzerland: ["#FF0000", W],
  Tonga: ["#FFFFFF", "#C10000", "#C10000"],
  // ── Crescent [field, emblem] ──
  Algeria: ["#FFFFFF", "#D21034"],
  Maldives: ["#D21034", W],
  Mauritania: ["#00A95C", "#FFD700"],
  Morocco: ["#C1272D", "#006233"],
  Pakistan: ["#01411C", W],
  "Saudi Arabia": ["#006C35", "#FFFFFF"],
  Tunisia: ["#E70013", W],
  Turkey: ["#E30A17", W],
  Turkmenistan: ["#28AE66", W],

  // ── Field-emblem [field, emblem] ──
  Albania: ["#E41E20", K],
  Cyprus: [W, "#D47600"],
  Micronesia: ["#75B2DD", W],
  Montenegro: ["#C40308", "#D4AF37"],
  Samoa: ["#002B7F", "#FFFFFF", "#CE1126"],
  Somalia: ["#4189DD", "#FFFFFF"],
  Vietnam: ["#DA251D", "#FFFF00"],

  // ── Panels [hoist, flyTop, flyBottom, emblem] ──
  Belize: ["#003F87", "#CE1126"],
  Benin: ["#008751", "#FCD116", "#E8112D", "#008751"],
  "Sri Lanka": ["#FFBE29", "#8D153A", "#8D153A", "#FFBE29"],
  Taiwan: ["#000095", "#FFFFFF", "#FE0000"],
  "United Arab Emirates": ["#FF0000", "#00732F", K, W],
  Zambia: ["#198A00", "#EF7D00", "#000000", "#DE2010"],

  // ── Panels mapped to bespoke pattern; Israel/SouthKorea handled below ──

  // ── Bespoke national flags ──
  // argentina: [skyTop, white, skyBottom, sun]
  Argentina: ["#74ACDF", W, "#74ACDF", "#F6B40E"],
  // uruguay: [stripeWhite, stripeBlue, canton, sun]
  Uruguay: [W, "#0038A8", W, "#FCD116"],
  // chile: [canton, white, red, star]
  Chile: ["#0039A6", W, "#D52B1E", W],
  // colombia: [yellow, blue, red]
  Colombia: ["#FCD116", "#003893", "#CE1126"],
  // venezuela: [top(yellow), middle(blue), bottom(red), stars]
  Venezuela: ["#FFCC00", "#00247D", "#CF142B", W],
  // paraguay: [top(red), middle(white), bottom(blue), emblem]
  Paraguay: ["#D52B1E", W, "#0038A8", "#0038A8"],
  // spain: [topRed, yellow, bottomRed, emblem]
  Spain: ["#AA151B", "#F1BF00", "#AA151B", "#AD1519"],
  // portugal: [hoistGreen, flyRed, emblem]
  Portugal: ["#006600", "#FF0000", "#FFD700"],
  // brazil: [field(green), lozenge(yellow), disc(blue)]
  Brazil: ["#009C3B", "#FFDF00", "#002776"],
  // canada: [redBar, white, redBar, leaf]
  Canada: ["#FF0000", W, "#FF0000", "#FF0000"],
  // china: [field(red), stars(yellow)]
  China: ["#DE2910", "#FFDE00"],
  // greece: [stripeBlue, stripeWhite, canton(blue), cross(white)]
  Greece: ["#0D5EAF", W, "#0D5EAF", W],
  // united-states: [stripeRed, stripeWhite, canton(blue), stars(white)]
  "United States": ["#B22234", W, "#3C3B6E", W],
  // israel: [white, stripeBlue, star(blue)]
  Israel: [W, "#0038B8", "#0038B8"],
  // south-africa: [top(red), bottom(blue), Yband(green), hoistTriangle(black)]
  "South Africa": ["#E03C31", "#002395", "#007A4D", K],
  // south-korea: [white, trigram(black), taegeukTop(red), taegeukBottom(blue)]
  "South Korea": [W, K, "#CD2E3A", "#0047A0"],
  // quartered Panama: [tl(white), tr(red), bl(blue), br(white), starTl(blue), starBr(red)]
  Panama: [W, "#D21034", "#005293", W, "#005293", "#D21034"],
  // ensign [field, canton, stars] — field is the dark blue ground
  Australia: ["#00247D", W, W],
  "New Zealand": ["#00247D", W, "#CC142B"],
  Fiji: ["#68BFE5", W, W],
  Tuvalu: ["#5B97B1", W, "#FFD200"],
  // nepal: [field(crimson), border(blue), emblem(white)]
  Nepal: ["#DC143C", "#003893", W],
  // union-jack (UK) — drawn as line-art only; no fill regions defined.
  // ── Agregadas en B4c/F1: no tenian ninguna paleta, asi que en el estado
  //    coloreado se quedaban en el line-art monocromo. ──
  Dominica: ["#006B3F", "#006B3F", "#006B3F", "#006B3F", "#FCD116"],
  "Guinea-Bissau": ["#CE1126", "#FCD116", "#009E49", "#000000"],
  Kiribati: ["#CE1126", "#003F87", "#FFD100"],
  Madagascar: ["#FFFFFF", "#FC3D32", "#007E3A", "#FFFFFF"],
  Qatar: ["#FFFFFF", "#8A1538"],
  "Saint Lucia": ["#66CCFF", "#000000"],
  "Saint Vincent and the Grenadines": ["#0072C6", "#FCD116", "#009E49", "#009E49"],
  "United Kingdom": ["#012169", "#FFFFFF", "#C8102B"],
};
