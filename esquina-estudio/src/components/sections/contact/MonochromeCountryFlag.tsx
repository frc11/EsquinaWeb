import { COUNTRY_FLAG_COLORS } from "@/components/sections/contact/countryFlagColors";

type FlagPattern =
  | "argentina"
  | "australia"
  | "brazil"
  | "canada"
  | "canton-stripes"
  | "center-disc"
  | "chile"
  | "china"
  | "colombia"
  | "crescent"
  | "cross"
  | "diagonal"
  | "ensign"
  | "field-emblem"
  | "greece"
  | "horizontal-bicolor"
  | "horizontal-bicolor-emblem"
  | "horizontal-stripes"
  | "horizontal-tricolor"
  | "horizontal-tricolor-emblem"
  | "israel"
  | "nepal"
  | "nordic"
  | "panels"
  | "paraguay"
  | "portugal"
  | "quartered"
  | "south-africa"
  | "south-korea"
  | "spain"
  | "triangle"
  | "union-jack"
  | "united-states"
  | "uruguay"
  | "venezuela"
  | "vertical-bicolor"
  | "vertical-tricolor"
  | "vertical-tricolor-emblem";

const HORIZONTAL_BICOLOR = new Set([
  "Angola",
  "Burkina Faso",
  "Haiti",
  "Indonesia",
  "Liechtenstein",
  "Monaco",
  "Poland",
  "Ukraine",
]);

const HORIZONTAL_BICOLOR_EMBLEM = new Set([
  "Bahrain",
  "Burkina Faso",
  "Haiti",
  "Liechtenstein",
  "Malta",
  "Nauru",
  "Singapore",
]);

const HORIZONTAL_TRICOLOR = new Set([
  "Armenia",
  "Austria",
  "Bolivia",
  "Bulgaria",
  "Estonia",
  "Gabon",
  "Germany",
  "Hungary",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Netherlands",
  "Russia",
  "Sierra Leone",
  "Yemen",
]);

const HORIZONTAL_TRICOLOR_EMBLEM = new Set([
  "Afghanistan",
  "Azerbaijan",
  "Cambodia",
  "Croatia",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Eswatini",
  "Ethiopia",
  "Ghana",
  "Kenya",
  "Honduras",
  "India",
  "Iran",
  "Iraq",
  "Laos",
  "Lebanon",
  "Lesotho",
  "Libya",
  "Malawi",
  "Myanmar",
  "Nicaragua",
  "Niger",
  "North Korea",
  "Rwanda",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Syria",
  "Tajikistan",
  "Uzbekistan",
]);

const FIELD_EMBLEM = new Set([
  "Albania",
  "Cyprus",
  "Micronesia",
  "Montenegro",
  "Samoa",
  "Somalia",
  "Vietnam",
]);

const VERTICAL_BICOLOR = new Set(["Malta", "Vatican City"]);

const VERTICAL_TRICOLOR = new Set([
  "Belgium",
  "Chad",
  "Cote d'Ivoire",
  "France",
  "Guinea",
  "Ireland",
  "Italy",
  "Mali",
  "Nigeria",
  "Peru",
  "Romania",
]);

const VERTICAL_TRICOLOR_EMBLEM = new Set([
  "Andorra",
  "Barbados",
  "Cameroon",
  "Guatemala",
  "Mexico",
  "Moldova",
  "Mongolia",
  "Senegal",
]);

const HORIZONTAL_STRIPES = new Set([
  "Belarus",
  "Botswana",
  "Cabo Verde",
  "Central African Republic",
  "Costa Rica",
  "Gambia",
  "Liberia",
  "Malaysia",
  "Mauritius",
  "North Macedonia",
  "Suriname",
  "Thailand",
  "Togo",
  "Uganda",
]);

const NORDIC = new Set([
  "Denmark",
  "Finland",
  "Iceland",
  "Norway",
  "Sweden",
]);

const TRIANGLE = new Set([
  "Antigua and Barbuda",
  "Bahamas",
  "Comoros",
  "Cuba",
  "Czechia",
  "Djibouti",
  "Equatorial Guinea",
  "Eritrea",
  "Guyana",
  "Jordan",
  "Kuwait",
  "Mozambique",
  "Oman",
  "Palestine",
  "Philippines",
  "Sao Tome and Principe",
  "South Sudan",
  "Sudan",
  "Timor-Leste",
  "Vanuatu",
  "Zimbabwe",
]);

const DIAGONAL = new Set([
  "Bhutan",
  "Bosnia and Herzegovina",
  "Brunei",
  "Burundi",
  "Congo",
  "Democratic Republic of the Congo",
  "Grenada",
  "Jamaica",
  "Marshall Islands",
  "Namibia",
  "Papua New Guinea",
  "Saint Kitts and Nevis",
  "Seychelles",
  "Solomon Islands",
  "Tanzania",
  "Trinidad and Tobago",
]);

const CENTER_DISC = new Set([
  "Bangladesh",
  "Japan",
  "Kazakhstan",
  "Kyrgyzstan",
  "Palau",
  "Somalia",
]);

const CRESCENT = new Set([
  "Algeria",
  "Maldives",
  "Mauritania",
  "Morocco",
  "Pakistan",
  "Saudi Arabia",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
]);

const CROSS = new Set([
  "Dominican Republic",
  "Georgia",
  "San Marino",
  "Switzerland",
  "Tonga",
]);

const PANELS = new Set([
  "Belize",
  "Benin",
  "Israel",
  "South Korea",
  "Sri Lanka",
  "Taiwan",
  "United Arab Emirates",
  "Zambia",
]);

function resolvePattern(country: string): FlagPattern {
  switch (country) {
    case "Argentina":
      return "argentina";
    case "Australia":
    case "Fiji":
    case "Tuvalu":
      return "australia";
    case "Brazil":
      return "brazil";
    case "Canada":
      return "canada";
    case "Chile":
      return "chile";
    case "China":
      return "china";
    case "Colombia":
      return "colombia";
    case "Greece":
      return "greece";
    case "Israel":
      return "israel";
    case "Nepal":
      return "nepal";
    case "New Zealand":
      return "ensign";
    case "Panama":
      return "quartered";
    case "Paraguay":
      return "paraguay";
    case "Portugal":
      return "portugal";
    case "South Africa":
      return "south-africa";
    case "South Korea":
      return "south-korea";
    case "Spain":
      return "spain";
    case "United Kingdom":
      return "union-jack";
    case "United States":
      return "united-states";
    case "Uruguay":
      return "uruguay";
    case "Venezuela":
      return "venezuela";
    default:
      if (NORDIC.has(country)) return "nordic";
      if (TRIANGLE.has(country)) return "triangle";
      if (DIAGONAL.has(country)) return "diagonal";
      if (CENTER_DISC.has(country)) return "center-disc";
      if (CRESCENT.has(country)) return "crescent";
      if (CROSS.has(country)) return "cross";
      if (FIELD_EMBLEM.has(country)) return "field-emblem";
      if (HORIZONTAL_TRICOLOR_EMBLEM.has(country)) {
        return "horizontal-tricolor-emblem";
      }
      if (HORIZONTAL_TRICOLOR.has(country)) return "horizontal-tricolor";
      if (VERTICAL_TRICOLOR_EMBLEM.has(country)) {
        return "vertical-tricolor-emblem";
      }
      if (VERTICAL_TRICOLOR.has(country)) return "vertical-tricolor";
      if (HORIZONTAL_BICOLOR_EMBLEM.has(country)) {
        return "horizontal-bicolor-emblem";
      }
      if (HORIZONTAL_BICOLOR.has(country)) return "horizontal-bicolor";
      if (VERTICAL_BICOLOR.has(country)) return "vertical-bicolor";
      if (HORIZONTAL_STRIPES.has(country)) return "horizontal-stripes";
      if (PANELS.has(country)) return "panels";
      return "panels";
  }
}

/**
 * In colored mode, regions are filled with the real flag colors while the
 * monochrome line-art still draws on top (subtle, low-opacity) so the
 * geometry reads identically to the mono version. `at(index)` returns the
 * color at that slot of the ordered palette, or `undefined` when the palette
 * is shorter (e.g. a country with no entry) — in which case nothing is filled
 * and the mono render is preserved untouched.
 */
function colorAt(colors: readonly string[] | undefined, index: number) {
  if (!colors || index >= colors.length) return undefined;
  return colors[index];
}

// Subtle separator drawn between two same-direction colored bands so adjacent
// regions never visually merge (e.g. white-on-white). Mono never uses this.
const COLORED_SEPARATOR = "#0F0F0F";
const COLORED_SEPARATOR_OPACITY = 0.18;

function Star({
  cx,
  cy,
  size = 1.5,
  color,
}: {
  cx: number;
  cy: number;
  size?: number;
  color?: string;
}) {
  return (
    <path
      d={`M ${cx} ${cy - size} L ${cx + size * 0.34} ${cy - size * 0.36} L ${
        cx + size
      } ${cy - size * 0.28} L ${cx + size * 0.5} ${cy + size * 0.18} L ${
        cx + size * 0.64
      } ${cy + size} L ${cx} ${cy + size * 0.58} L ${cx - size * 0.64} ${
        cy + size
      } L ${cx - size * 0.5} ${cy + size * 0.18} L ${cx - size} ${
        cy - size * 0.28
      } L ${cx - size * 0.34} ${cy - size * 0.36} Z`}
      fill={color ?? "currentColor"}
      fillOpacity={color ? 1 : 0.72}
      stroke="none"
    />
  );
}

function Seal({
  cx = 12,
  cy = 7.5,
  color,
}: {
  cx?: number;
  cy?: number;
  color?: string;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r="2.15" fill="none" stroke={color ?? "currentColor"} />
      <circle
        cx={cx}
        cy={cy}
        r="0.85"
        fill={color ?? "currentColor"}
        fillOpacity={color ? 0.85 : 0.2}
        stroke="none"
      />
    </>
  );
}

// crescent: [field, emblem]
function Crescent({
  cx = 12,
  cy = 7.5,
  colors,
}: {
  cx?: number;
  cy?: number;
  colors?: readonly string[];
}) {
  const field = colorAt(colors, 0);
  const emblem = colorAt(colors, 1);
  return (
    <>
      {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
      <circle cx={cx} cy={cy} r="3.05" fill="none" stroke={emblem ?? "currentColor"} />
      <path
        d={`M ${cx + 0.9} ${cy - 2.25} A 2.45 2.45 0 1 0 ${cx + 0.9} ${cy + 2.25}`}
        fill={field ?? "none"}
        stroke={emblem ?? "currentColor"}
      />
      <Star cx={cx + 4.1} cy={cy} size={1.1} color={emblem} />
    </>
  );
}

// horizontal-tricolor: [top, middle, bottom]
function HorizontalTricolor({
  emblem = false,
  colors,
}: {
  emblem?: boolean;
  colors?: readonly string[];
}) {
  const top = colorAt(colors, 0);
  const middle = colorAt(colors, 1);
  const bottom = colorAt(colors, 2);
  const sealColor = colorAt(colors, 3);
  if (top || middle || bottom) {
    return (
      <>
        {top && <rect x="0.7" y="0.7" width="22.6" height="4.3" fill={top} stroke="none" />}
        {middle && <rect x="0.7" y="5" width="22.6" height="5" fill={middle} stroke="none" />}
        {bottom && <rect x="0.7" y="10" width="22.6" height="4.3" fill={bottom} stroke="none" />}
        <path
          d="M 0.5 5 H 23.5 M 0.5 10 H 23.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
        {emblem && <Seal color={sealColor} />}
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 5 H 23.5 M 0.5 10 H 23.5" />
      <rect x="0.7" y="5" width="22.6" height="5" fill="currentColor" fillOpacity="0.05" stroke="none" />
      {emblem && <Seal />}
    </>
  );
}

// argentina: [top(sky), middle(white), bottom(sky), sun]
function ArgentinaFlag({ colors }: { colors?: readonly string[] }) {
  const sun = colorAt(colors, 3) ?? colorAt(colors, 1);
  return (
    <>
      <HorizontalTricolor colors={colors} />
      <circle cx="12" cy="7.5" r="1.35" fill="none" stroke={sun ?? "currentColor"} />
      <path
        d="M 12 5.15 V 9.85 M 9.65 7.5 H 14.35 M 10.35 5.85 L 13.65 9.15 M 13.65 5.85 L 10.35 9.15"
        stroke={sun ?? "currentColor"}
      />
    </>
  );
}

// horizontal-bicolor: [top, bottom]
function HorizontalBicolor({
  emblem = false,
  colors,
}: {
  emblem?: boolean;
  colors?: readonly string[];
}) {
  const top = colorAt(colors, 0);
  const bottom = colorAt(colors, 1);
  const sealColor = colorAt(colors, 2);
  if (top || bottom) {
    return (
      <>
        {top && <rect x="0.7" y="0.7" width="22.6" height="6.8" fill={top} stroke="none" />}
        {bottom && <rect x="0.7" y="7.5" width="22.6" height="6.8" fill={bottom} stroke="none" />}
        <path
          d="M 0.5 7.5 H 23.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
        {emblem && <Seal color={sealColor} />}
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 7.5 H 23.5" />
      <rect x="0.7" y="7.5" width="22.6" height="6.8" fill="currentColor" fillOpacity="0.06" stroke="none" />
      {emblem && <Seal />}
    </>
  );
}

// vertical-tricolor: [left, center, right]
function VerticalTricolor({
  emblem = false,
  colors,
}: {
  emblem?: boolean;
  colors?: readonly string[];
}) {
  const left = colorAt(colors, 0);
  const center = colorAt(colors, 1);
  const right = colorAt(colors, 2);
  const sealColor = colorAt(colors, 3);
  if (left || center || right) {
    return (
      <>
        {left && <rect x="0.7" y="0.7" width="7.3" height="13.6" fill={left} stroke="none" />}
        {center && <rect x="8" y="0.7" width="8" height="13.6" fill={center} stroke="none" />}
        {right && <rect x="16" y="0.7" width="7.3" height="13.6" fill={right} stroke="none" />}
        <path
          d="M 8 0.5 V 14.5 M 16 0.5 V 14.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
        {emblem && <Seal color={sealColor} />}
      </>
    );
  }
  return (
    <>
      <path d="M 8 0.5 V 14.5 M 16 0.5 V 14.5" />
      <rect x="8" y="0.7" width="8" height="13.6" fill="currentColor" fillOpacity="0.05" stroke="none" />
      {emblem && <Seal />}
    </>
  );
}

// vertical-bicolor: [left, right]
function VerticalBicolor({ colors }: { colors?: readonly string[] }) {
  const left = colorAt(colors, 0);
  const right = colorAt(colors, 1);
  if (left || right) {
    return (
      <>
        {left && <rect x="0.7" y="0.7" width="11.3" height="13.6" fill={left} stroke="none" />}
        {right && <rect x="12" y="0.7" width="11.3" height="13.6" fill={right} stroke="none" />}
        <path
          d="M 12 0.5 V 14.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 12 0.5 V 14.5" />
      <rect x="0.7" y="0.7" width="11.3" height="13.6" fill="currentColor" fillOpacity="0.06" stroke="none" />
    </>
  );
}

// horizontal-stripes: [s1(top), s2, s3(center), s4, s5(bottom)] — 5 bands.
// Fewer colors are tiled cyclically so 3- or 4-color schemes still fill.
function StripeFlag({ colors }: { colors?: readonly string[] }) {
  const bands = [0, 1, 2, 3, 4];
  const ys = [0.7, 3, 6, 9, 12];
  const heights = [2.3, 3, 3, 3, 2.8];
  if (colors && colors.length > 0) {
    return (
      <>
        {bands.map((band) => {
          const fill = colors[band % colors.length];
          return (
            <rect
              key={band}
              x="0.7"
              y={ys[band]}
              width="22.6"
              height={heights[band]}
              fill={fill}
              stroke="none"
            />
          );
        })}
        <path
          d="M 0.5 3 H 23.5 M 0.5 6 H 23.5 M 0.5 9 H 23.5 M 0.5 12 H 23.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 3 H 23.5 M 0.5 6 H 23.5 M 0.5 9 H 23.5 M 0.5 12 H 23.5" />
      <rect x="0.7" y="6" width="22.6" height="3" fill="currentColor" fillOpacity="0.08" stroke="none" />
    </>
  );
}

// nordic: [field, cross]
function NordicFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const cross = colorAt(colors, 1);
  if (field || cross) {
    return (
      <>
        {field && <rect x="0.5" y="0.5" width="23" height="14" fill={field} stroke="none" />}
        {cross && <rect x="6.3" y="0.5" width="3.2" height="14" fill={cross} stroke="none" />}
        {cross && <rect x="0.5" y="5.9" width="23" height="3.2" fill={cross} stroke="none" />}
      </>
    );
  }
  return (
    <>
      <rect x="6.3" y="0.5" width="3.2" height="14" fill="currentColor" fillOpacity="0.08" />
      <rect x="0.5" y="5.9" width="23" height="3.2" fill="currentColor" fillOpacity="0.08" />
    </>
  );
}

// triangle: [hoist-triangle, field, star]
function HoistTriangle({ colors }: { colors?: readonly string[] }) {
  const triangle = colorAt(colors, 0);
  const field = colorAt(colors, 1);
  const star = colorAt(colors, 2);
  if (triangle || field) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        {triangle && <path d="M 0.5 0.5 L 10 7.5 L 0.5 14.5 Z" fill={triangle} stroke="none" />}
        <Star cx={4.1} cy={7.5} size={1.15} color={star} />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 0.5 L 10 7.5 L 0.5 14.5 Z" fill="currentColor" fillOpacity="0.06" />
      <path d="M 10 7.5 H 23.5 M 10 7.5 L 23.5 3.5 M 10 7.5 L 23.5 11.5" />
      <Star cx={4.1} cy={7.5} size={1.15} />
    </>
  );
}

// diagonal: [upper-left, lower-right] (approximate — diagonally split field)
function DiagonalFlag({ colors }: { colors?: readonly string[] }) {
  const upper = colorAt(colors, 0);
  const lower = colorAt(colors, 1);
  if (upper || lower) {
    return (
      <>
        {lower && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={lower} stroke="none" />}
        {upper && <path d="M 0.5 0.5 H 23.5 L 0.5 14.5 Z" fill={upper} stroke="none" />}
        <path
          d="M 0.5 14.5 L 23.5 0.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 14.5 L 23.5 0.5" />
      <path d="M 0.5 10.7 L 17.2 0.5 M 6.8 14.5 L 23.5 4.3" />
      <rect x="0.7" y="0.7" width="22.6" height="13.6" fill="currentColor" fillOpacity="0.025" stroke="none" />
    </>
  );
}

// center-disc: [field, disc]
function CenterDiscFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const disc = colorAt(colors, 1);
  if (field || disc) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        <circle cx="12" cy="7.5" r="3.45" fill={disc ?? "none"} stroke="none" />
      </>
    );
  }
  return (
    <>
      <circle cx="12" cy="7.5" r="3.45" fill="currentColor" fillOpacity="0.07" />
      <circle cx="12" cy="7.5" r="3.45" fill="none" />
    </>
  );
}

// cross: [field, cross]
function CrossFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const cross = colorAt(colors, 1);
  if (field || cross) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        <path d="M 12 2.3 V 12.7 M 6.8 7.5 H 17.2" strokeWidth="1.6" stroke={cross ?? "currentColor"} />
      </>
    );
  }
  return (
    <>
      <path d="M 12 2.3 V 12.7 M 6.8 7.5 H 17.2" strokeWidth="1.6" />
      <rect x="0.7" y="0.7" width="22.6" height="13.6" fill="currentColor" fillOpacity="0.03" stroke="none" />
    </>
  );
}

// panels: [hoist-panel, fly-top, fly-bottom, emblem] (approximate)
function PanelFlag({ colors }: { colors?: readonly string[] }) {
  const hoist = colorAt(colors, 0);
  const flyTop = colorAt(colors, 1);
  const flyBottom = colorAt(colors, 2);
  const emblem = colorAt(colors, 3);
  if (hoist || flyTop || flyBottom) {
    return (
      <>
        {hoist && <rect x="0.7" y="0.7" width="5.8" height="13.6" fill={hoist} stroke="none" />}
        {flyTop && <rect x="6.5" y="0.7" width="16.8" height="6.8" fill={flyTop} stroke="none" />}
        {flyBottom && <rect x="6.5" y="7.5" width="16.8" height="6.8" fill={flyBottom} stroke="none" />}
        <path
          d="M 6.5 0.5 V 14.5 M 6.5 7.5 H 23.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
        <Seal cx={14.8} color={emblem} />
      </>
    );
  }
  return (
    <>
      <path d="M 6.5 0.5 V 14.5 M 0.5 7.5 H 23.5" />
      <rect x="6.5" y="0.7" width="16.8" height="6.8" fill="currentColor" fillOpacity="0.045" stroke="none" />
      <Seal cx={14.8} />
    </>
  );
}

// field-emblem: [field, emblem]
function FieldEmblemFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const emblem = colorAt(colors, 1);
  if (field || emblem) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        <Seal color={emblem} />
        <Star cx={12} cy={7.5} size={1.35} color={emblem} />
      </>
    );
  }
  return (
    <>
      <Seal />
      <Star cx={12} cy={7.5} size={1.35} />
    </>
  );
}

function UnionJack({ x = 0.5, y = 0.5, width = 23, height = 14 }: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  const right = x + width;
  const bottom = y + height;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  return (
    <>
      <path d={`M ${x} ${y} L ${right} ${bottom} M ${right} ${y} L ${x} ${bottom}`} />
      <path d={`M ${centerX} ${y} V ${bottom} M ${x} ${centerY} H ${right}`} strokeWidth="1.45" />
    </>
  );
}

// united-states: [stripe-odd, stripe-even, canton, stars]
function UnitedStatesFlag({ colors }: { colors?: readonly string[] }) {
  const odd = colorAt(colors, 0);
  const even = colorAt(colors, 1);
  const canton = colorAt(colors, 2);
  const starColor = colorAt(colors, 3);
  if (odd || even) {
    const stripeYs = [0.7, 2.6, 4.7, 6.8, 8.9, 11, 13];
    const stripeHs = [1.9, 2.1, 2.1, 2.1, 2.1, 2, 1.5];
    return (
      <>
        {stripeYs.map((y, i) => (
          <rect
            key={y}
            x="0.7"
            y={y}
            width="22.6"
            height={stripeHs[i]}
            fill={i % 2 === 0 ? odd ?? "none" : even ?? "none"}
            stroke="none"
          />
        ))}
        {canton && <rect x="0.7" y="0.7" width="10" height="7" fill={canton} stroke="none" />}
        <circle cx="3.1" cy="2.3" r="0.45" fill={starColor ?? "currentColor"} stroke="none" />
        <circle cx="5.6" cy="2.3" r="0.45" fill={starColor ?? "currentColor"} stroke="none" />
        <circle cx="8.1" cy="2.3" r="0.45" fill={starColor ?? "currentColor"} stroke="none" />
        <circle cx="4.3" cy="4.6" r="0.45" fill={starColor ?? "currentColor"} stroke="none" />
        <circle cx="6.8" cy="4.6" r="0.45" fill={starColor ?? "currentColor"} stroke="none" />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 2.6 H 23.5 M 0.5 4.7 H 23.5 M 0.5 6.8 H 23.5 M 0.5 8.9 H 23.5 M 0.5 11 H 23.5 M 0.5 13 H 23.5" />
      <rect x="0.7" y="0.7" width="10" height="7" fill="currentColor" fillOpacity="0.08" />
      <circle cx="3.1" cy="2.3" r="0.45" fill="currentColor" stroke="none" />
      <circle cx="5.6" cy="2.3" r="0.45" fill="currentColor" stroke="none" />
      <circle cx="8.1" cy="2.3" r="0.45" fill="currentColor" stroke="none" />
      <circle cx="4.3" cy="4.6" r="0.45" fill="currentColor" stroke="none" />
      <circle cx="6.8" cy="4.6" r="0.45" fill="currentColor" stroke="none" />
    </>
  );
}

// greece: [stripe-odd, stripe-even, canton, cross]
function GreeceFlag({ colors }: { colors?: readonly string[] }) {
  const odd = colorAt(colors, 0);
  const even = colorAt(colors, 1);
  const canton = colorAt(colors, 2);
  const cross = colorAt(colors, 3) ?? colorAt(colors, 1);
  if (odd || even) {
    const stripeYs = [0.7, 2.8, 5.1, 7.5, 9.9, 12.2];
    const stripeHs = [2.1, 2.3, 2.4, 2.4, 2.3, 2.3];
    return (
      <>
        {stripeYs.map((y, i) => (
          <rect
            key={y}
            x="0.7"
            y={y}
            width="22.6"
            height={stripeHs[i]}
            fill={i % 2 === 0 ? odd ?? "none" : even ?? "none"}
            stroke="none"
          />
        ))}
        {canton && <rect x="0.7" y="0.7" width="7.5" height="7.2" fill={canton} stroke="none" />}
        <path d="M 4.45 1 V 7.6 M 1 4.3 H 7.9" stroke={cross ?? "currentColor"} />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 2.8 H 23.5 M 0.5 5.1 H 23.5 M 0.5 7.5 H 23.5 M 0.5 9.9 H 23.5 M 0.5 12.2 H 23.5" />
      <rect x="0.7" y="0.7" width="7.5" height="7.2" fill="currentColor" fillOpacity="0.06" />
      <path d="M 4.45 1 V 7.6 M 1 4.3 H 7.9" />
    </>
  );
}

// brazil: [field, lozenge, disc]
function BrazilFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const lozenge = colorAt(colors, 1);
  const disc = colorAt(colors, 2);
  if (field || lozenge) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        {lozenge && <path d="M 12 2.1 L 21 7.5 L 12 12.9 L 3 7.5 Z" fill={lozenge} stroke="none" />}
        <circle cx="12" cy="7.5" r="2.75" fill={disc ?? "none"} stroke={disc ?? "currentColor"} />
        <path
          d="M 9.6 6.8 C 11 7.2 12.7 7.6 14.5 8.7"
          fill="none"
          stroke={lozenge ?? "currentColor"}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 12 2.1 L 21 7.5 L 12 12.9 L 3 7.5 Z" fill="currentColor" fillOpacity="0.04" />
      <circle cx="12" cy="7.5" r="2.75" />
      <path d="M 9.6 6.8 C 11 7.2 12.7 7.6 14.5 8.7" />
    </>
  );
}

// canada: [left-bar, white-field, right-bar, leaf]
function CanadaFlag({ colors }: { colors?: readonly string[] }) {
  const bar = colorAt(colors, 0);
  const field = colorAt(colors, 1);
  const leaf = colorAt(colors, 3) ?? colorAt(colors, 0);
  if (bar || field) {
    return (
      <>
        {field && <rect x="6" y="0.7" width="12" height="13.6" fill={field} stroke="none" />}
        {bar && <rect x="0.7" y="0.7" width="5.3" height="13.6" fill={bar} stroke="none" />}
        {bar && <rect x="18" y="0.7" width="5.3" height="13.6" fill={bar} stroke="none" />}
        <path
          d="M 12 3.2 L 13 5.4 L 15.1 4.9 L 14.1 7 L 16 8 L 13.4 8.4 L 13.6 11.4 L 12 9.9 L 10.4 11.4 L 10.6 8.4 L 8 8 L 9.9 7 L 8.9 4.9 L 11 5.4 Z"
          fill={leaf ?? "none"}
          stroke={leaf ?? "currentColor"}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 6 0.5 V 14.5 M 18 0.5 V 14.5" />
      <path d="M 12 3.2 L 13 5.4 L 15.1 4.9 L 14.1 7 L 16 8 L 13.4 8.4 L 13.6 11.4 L 12 9.9 L 10.4 11.4 L 10.6 8.4 L 8 8 L 9.9 7 L 8.9 4.9 L 11 5.4 Z" />
    </>
  );
}

// chile: [canton, white-top, red-bottom, star]
function ChileFlag({ colors }: { colors?: readonly string[] }) {
  const canton = colorAt(colors, 0);
  const top = colorAt(colors, 1);
  const bottom = colorAt(colors, 2);
  const star = colorAt(colors, 3);
  if (canton || top || bottom) {
    return (
      <>
        {top && <rect x="0.7" y="0.7" width="22.6" height="6.8" fill={top} stroke="none" />}
        {bottom && <rect x="0.7" y="7.5" width="22.6" height="6.8" fill={bottom} stroke="none" />}
        {canton && <rect x="0.7" y="0.7" width="7.1" height="6.8" fill={canton} stroke="none" />}
        <Star cx={4.1} cy={3.9} size={1.35} color={star} />
        <path
          d="M 0.5 7.5 H 23.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 7.5 H 23.5 M 7.8 0.5 V 7.5" />
      <Star cx={4.1} cy={3.9} size={1.35} />
      <rect x="0.7" y="7.5" width="22.6" height="6.8" fill="currentColor" fillOpacity="0.06" stroke="none" />
    </>
  );
}

// china: [field, stars]
function ChinaFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const star = colorAt(colors, 1);
  if (field) {
    return (
      <>
        <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />
        <Star cx={5.2} cy={4.4} size={1.8} color={star} />
        <Star cx={9.1} cy={2.5} size={0.62} color={star} />
        <Star cx={10.8} cy={4.6} size={0.62} color={star} />
        <Star cx={10.3} cy={7.1} size={0.62} color={star} />
        <Star cx={8.2} cy={8.6} size={0.62} color={star} />
      </>
    );
  }
  return (
    <>
      <Star cx={5.2} cy={4.4} size={1.8} />
      <Star cx={9.1} cy={2.5} size={0.62} />
      <Star cx={10.8} cy={4.6} size={0.62} />
      <Star cx={10.3} cy={7.1} size={0.62} />
      <Star cx={8.2} cy={8.6} size={0.62} />
    </>
  );
}

// colombia: [top(yellow, half), middle(blue, quarter), bottom(red, quarter)]
function ColombiaFlag({ colors }: { colors?: readonly string[] }) {
  const top = colorAt(colors, 0);
  const middle = colorAt(colors, 1);
  const bottom = colorAt(colors, 2);
  if (top || middle || bottom) {
    return (
      <>
        {top && <rect x="0.7" y="0.7" width="22.6" height="6.8" fill={top} stroke="none" />}
        {middle && <rect x="0.7" y="7.5" width="22.6" height="3.5" fill={middle} stroke="none" />}
        {bottom && <rect x="0.7" y="11" width="22.6" height="3.3" fill={bottom} stroke="none" />}
        <path
          d="M 0.5 7.5 H 23.5 M 0.5 11 H 23.5"
          stroke={COLORED_SEPARATOR}
          strokeOpacity={COLORED_SEPARATOR_OPACITY}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 7.5 H 23.5 M 0.5 11 H 23.5" />
      <rect x="0.7" y="0.7" width="22.6" height="6.8" fill="currentColor" fillOpacity="0.035" stroke="none" />
    </>
  );
}

// venezuela: [top, middle, bottom, stars]
function VenezuelaFlag({ colors }: { colors?: readonly string[] }) {
  const stars = colorAt(colors, 3);
  return (
    <>
      <HorizontalTricolor colors={colors} />
      <path
        d="M 8.1 8.25 C 9.7 6.15 14.3 6.15 15.9 8.25"
        fill="none"
        stroke={stars ?? "currentColor"}
      />
      <circle cx="9" cy="7.65" r="0.35" fill={stars ?? "currentColor"} stroke="none" />
      <circle cx="12" cy="6.85" r="0.35" fill={stars ?? "currentColor"} stroke="none" />
      <circle cx="15" cy="7.65" r="0.35" fill={stars ?? "currentColor"} stroke="none" />
    </>
  );
}

// uruguay: [stripe-odd(white), stripe-even(blue), canton, sun]
function UruguayFlag({ colors }: { colors?: readonly string[] }) {
  const odd = colorAt(colors, 0);
  const even = colorAt(colors, 1);
  const canton = colorAt(colors, 2);
  const sun = colorAt(colors, 3);
  if (odd || even) {
    const stripeYs = [0.7, 2.8, 5.2, 7.6, 10, 12.4];
    const stripeHs = [2.1, 2.4, 2.4, 2.4, 2.4, 1.9];
    return (
      <>
        {stripeYs.map((y, i) => (
          <rect
            key={y}
            x="0.7"
            y={y}
            width="22.6"
            height={stripeHs[i]}
            fill={i % 2 === 0 ? odd ?? "none" : even ?? "none"}
            stroke="none"
          />
        ))}
        {canton && <rect x="0.7" y="0.7" width="7" height="6.6" fill={canton} stroke="none" />}
        <circle cx="4.2" cy="3.9" r="1.3" fill="none" stroke={sun ?? "currentColor"} />
        <path d="M 4.2 1.9 V 5.9 M 2.2 3.9 H 6.2" stroke={sun ?? "currentColor"} />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 2.8 H 23.5 M 0.5 5.2 H 23.5 M 0.5 7.6 H 23.5 M 0.5 10 H 23.5 M 0.5 12.4 H 23.5" />
      <rect x="0.7" y="0.7" width="7" height="6.6" fill="currentColor" fillOpacity="0.04" />
      <circle cx="4.2" cy="3.9" r="1.3" />
      <path d="M 4.2 1.9 V 5.9 M 2.2 3.9 H 6.2" />
    </>
  );
}

// paraguay: [top, middle, bottom, emblem]
function ParaguayFlag({ colors }: { colors?: readonly string[] }) {
  return (
    <>
      <HorizontalTricolor colors={colors} />
      <Seal color={colorAt(colors, 3)} />
    </>
  );
}

// spain: [top(red), middle(yellow), bottom(red), emblem]
function SpainFlag({ colors }: { colors?: readonly string[] }) {
  const top = colorAt(colors, 0);
  const middle = colorAt(colors, 1);
  const bottom = colorAt(colors, 2);
  const emblem = colorAt(colors, 3);
  if (top || middle || bottom) {
    return (
      <>
        {top && <rect x="0.7" y="0.7" width="22.6" height="2.8" fill={top} stroke="none" />}
        {middle && <rect x="0.7" y="3.5" width="22.6" height="8" fill={middle} stroke="none" />}
        {bottom && <rect x="0.7" y="11.5" width="22.6" height="2.8" fill={bottom} stroke="none" />}
        <Seal cx={8.2} color={emblem} />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 3.5 H 23.5 M 0.5 11.5 H 23.5" />
      <rect x="0.7" y="3.5" width="22.6" height="8" fill="currentColor" fillOpacity="0.04" stroke="none" />
      <Seal cx={8.2} />
    </>
  );
}

// portugal: [hoist(green), fly(red), emblem]
function PortugalFlag({ colors }: { colors?: readonly string[] }) {
  const hoist = colorAt(colors, 0);
  const fly = colorAt(colors, 1);
  const emblem = colorAt(colors, 2);
  if (hoist || fly) {
    return (
      <>
        {fly && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={fly} stroke="none" />}
        {hoist && <rect x="0.7" y="0.7" width="8.3" height="13.6" fill={hoist} stroke="none" />}
        <circle cx="9" cy="7.5" r="2.2" fill="none" stroke={emblem ?? "currentColor"} />
        <path d="M 7.8 5.9 H 10.2 V 9.1 H 7.8 Z" fill="none" stroke={emblem ?? "currentColor"} />
      </>
    );
  }
  return (
    <>
      <path d="M 9 0.5 V 14.5" />
      <circle cx="9" cy="7.5" r="2.2" />
      <path d="M 7.8 5.9 H 10.2 V 9.1 H 7.8 Z" />
    </>
  );
}

// israel: [field(white), stripes(blue), star(blue)]
function IsraelFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const stripe = colorAt(colors, 1);
  const star = colorAt(colors, 2) ?? colorAt(colors, 1);
  if (field || stripe) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        <path d="M 0.5 3 H 23.5 M 0.5 12 H 23.5" strokeWidth="1.25" stroke={stripe ?? "currentColor"} />
        <path
          d="M 12 4.8 L 14.8 9.5 H 9.2 Z M 12 10.2 L 9.2 5.5 H 14.8 Z"
          fill="none"
          stroke={star ?? "currentColor"}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 3 H 23.5 M 0.5 12 H 23.5" strokeWidth="1.25" />
      <path d="M 12 4.8 L 14.8 9.5 H 9.2 Z M 12 10.2 L 9.2 5.5 H 14.8 Z" />
    </>
  );
}

// south-africa: [field-top, field-bottom, Y-band, hoist-triangle, V-outline]
// Approximate: full field plus the hoist triangle as the dominant colored marks.
function SouthAfricaFlag({ colors }: { colors?: readonly string[] }) {
  const top = colorAt(colors, 0);
  const bottom = colorAt(colors, 1);
  const band = colorAt(colors, 2);
  const triangle = colorAt(colors, 3);
  if (top || bottom || band || triangle) {
    return (
      <>
        {top && <rect x="0.7" y="0.7" width="22.6" height="6.8" fill={top} stroke="none" />}
        {bottom && <rect x="0.7" y="7.5" width="22.6" height="6.8" fill={bottom} stroke="none" />}
        {triangle && <path d="M 0.5 0.5 L 9.1 7.5 L 0.5 14.5 Z" fill={triangle} stroke="none" />}
        <path d="M 5.2 7.5 H 23.5" strokeWidth="1.4" stroke={band ?? "currentColor"} />
        <path
          d="M 0.5 1.3 L 9.1 7.5 L 0.5 13.7"
          fill="none"
          stroke={band ?? "currentColor"}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 0.5 1.3 L 9.1 7.5 L 0.5 13.7" />
      <path d="M 0.5 4.1 L 5.2 7.5 L 0.5 10.9" />
      <path d="M 5.2 7.5 H 23.5 M 9.1 7.5 L 23.5 2.1 M 9.1 7.5 L 23.5 12.9" />
    </>
  );
}

// south-korea: [field(white), trigram(black), taegeuk-top(red), taegeuk-bottom(blue)]
function SouthKoreaFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const trigram = colorAt(colors, 1);
  const top = colorAt(colors, 2);
  const bottom = colorAt(colors, 3);
  if (field || top || bottom) {
    return (
      <>
        {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
        <path
          d="M 9.25 7.5 A 2.75 2.75 0 0 1 14.75 7.5 A 2.75 2.75 0 0 1 9.25 7.5 Z"
          fill={top ?? "currentColor"}
          fillOpacity={top ? 1 : 0.045}
          stroke="none"
        />
        <path
          d="M 12 4.75 A 2.75 2.75 0 0 1 12 10.25 A 1.375 1.375 0 0 1 12 7.5 A 1.375 1.375 0 0 0 12 4.75 Z"
          fill={bottom ?? "none"}
          stroke="none"
        />
        <path
          d="M 5 3 L 7.1 5.1 M 4.4 3.6 L 6.5 5.7 M 17.1 9.6 L 19.2 11.7 M 17.7 9 L 19.8 11.1"
          stroke={trigram ?? "currentColor"}
        />
      </>
    );
  }
  return (
    <>
      <path d="M 9.25 7.5 A 2.75 2.75 0 0 1 14.75 7.5 A 2.75 2.75 0 0 1 9.25 7.5 Z" fill="currentColor" fillOpacity="0.045" />
      <path d="M 9.25 7.5 C 10.3 5.9 13.7 9.1 14.75 7.5" />
      <path d="M 5 3 L 7.1 5.1 M 4.4 3.6 L 6.5 5.7 M 17.1 9.6 L 19.2 11.7 M 17.7 9 L 19.8 11.1" />
    </>
  );
}

// quartered (Panama): [tl(white), tr(red), bl(blue), br(white), star-tl(blue), star-br(red)]
function QuarteredFlag({ colors }: { colors?: readonly string[] }) {
  const tl = colorAt(colors, 0);
  const tr = colorAt(colors, 1);
  const bl = colorAt(colors, 2);
  const br = colorAt(colors, 3);
  const starTl = colorAt(colors, 4) ?? colorAt(colors, 2);
  const starBr = colorAt(colors, 5) ?? colorAt(colors, 1);
  if (tl || tr || bl || br) {
    return (
      <>
        {tl && <rect x="0.7" y="0.7" width="11.3" height="6.8" fill={tl} stroke="none" />}
        {tr && <rect x="12" y="0.7" width="11.3" height="6.8" fill={tr} stroke="none" />}
        {bl && <rect x="0.7" y="7.5" width="11.3" height="6.8" fill={bl} stroke="none" />}
        {br && <rect x="12" y="7.5" width="11.3" height="6.8" fill={br} stroke="none" />}
        <Star cx={6} cy={4} size={1.1} color={starTl} />
        <Star cx={18} cy={11} size={1.1} color={starBr} />
      </>
    );
  }
  return (
    <>
      <path d="M 12 0.5 V 14.5 M 0.5 7.5 H 23.5" />
      <Star cx={6} cy={4} size={1.1} />
      <Star cx={18} cy={11} size={1.1} />
    </>
  );
}

// ensign: [field, canton-bg, stars] (Australia/NZ/Fiji/Tuvalu — approximate)
function EnsignFlag({
  newZealand = false,
  colors,
}: {
  newZealand?: boolean;
  colors?: readonly string[];
}) {
  const field = colorAt(colors, 0);
  const star = colorAt(colors, 2) ?? colorAt(colors, 1);
  return (
    <>
      {field && <rect x="0.7" y="0.7" width="22.6" height="13.6" fill={field} stroke="none" />}
      <UnionJack x={0.7} y={0.7} width={9.2} height={5.7} />
      <Star cx={16.4} cy={4.3} size={newZealand ? 1.05 : 0.85} color={star} />
      <Star cx={19.2} cy={8.1} size={0.85} color={star} />
      <Star cx={15.3} cy={11.1} size={0.85} color={star} />
      {!newZealand && <Star cx={21} cy={11.6} size={0.6} color={star} />}
    </>
  );
}

// nepal: [field(crimson), border(blue), emblems(white)]
function NepalFlag({ colors }: { colors?: readonly string[] }) {
  const field = colorAt(colors, 0);
  const border = colorAt(colors, 1);
  const emblem = colorAt(colors, 2);
  if (field || border) {
    return (
      <>
        <path
          d="M 4 0.8 V 14.2 L 15 10.5 L 8.4 7.6 L 15 4.4 Z"
          fill={field ?? "none"}
          stroke={border ?? "currentColor"}
        />
        <circle cx="8.6" cy="4.4" r="1.1" fill="none" stroke={emblem ?? "currentColor"} />
        <Star cx={8.9} cy={10} size={1.1} color={emblem} />
      </>
    );
  }
  return (
    <>
      <path d="M 4 0.8 V 14.2 L 15 10.5 L 8.4 7.6 L 15 4.4 Z" />
      <circle cx="8.6" cy="4.4" r="1.1" />
      <Star cx={8.9} cy={10} size={1.1} />
    </>
  );
}

function drawPattern(pattern: FlagPattern, colors?: readonly string[]) {
  switch (pattern) {
    case "argentina":
      return <ArgentinaFlag colors={colors} />;
    case "australia":
      return <EnsignFlag colors={colors} />;
    case "brazil":
      return <BrazilFlag colors={colors} />;
    case "canada":
      return <CanadaFlag colors={colors} />;
    case "canton-stripes":
      return <UnitedStatesFlag colors={colors} />;
    case "center-disc":
      return <CenterDiscFlag colors={colors} />;
    case "chile":
      return <ChileFlag colors={colors} />;
    case "china":
      return <ChinaFlag colors={colors} />;
    case "colombia":
      return <ColombiaFlag colors={colors} />;
    case "crescent":
      return <Crescent colors={colors} />;
    case "cross":
      return <CrossFlag colors={colors} />;
    case "diagonal":
      return <DiagonalFlag colors={colors} />;
    case "ensign":
      return <EnsignFlag newZealand colors={colors} />;
    case "field-emblem":
      return <FieldEmblemFlag colors={colors} />;
    case "greece":
      return <GreeceFlag colors={colors} />;
    case "horizontal-bicolor":
      return <HorizontalBicolor colors={colors} />;
    case "horizontal-bicolor-emblem":
      return <HorizontalBicolor emblem colors={colors} />;
    case "horizontal-stripes":
      return <StripeFlag colors={colors} />;
    case "horizontal-tricolor":
      return <HorizontalTricolor colors={colors} />;
    case "horizontal-tricolor-emblem":
      return <HorizontalTricolor emblem colors={colors} />;
    case "israel":
      return <IsraelFlag colors={colors} />;
    case "nepal":
      return <NepalFlag colors={colors} />;
    case "nordic":
      return <NordicFlag colors={colors} />;
    case "panels":
      return <PanelFlag colors={colors} />;
    case "paraguay":
      return <ParaguayFlag colors={colors} />;
    case "portugal":
      return <PortugalFlag colors={colors} />;
    case "quartered":
      return <QuarteredFlag colors={colors} />;
    case "south-africa":
      return <SouthAfricaFlag colors={colors} />;
    case "south-korea":
      return <SouthKoreaFlag colors={colors} />;
    case "spain":
      return <SpainFlag colors={colors} />;
    case "triangle":
      return <HoistTriangle colors={colors} />;
    case "union-jack":
      return <UnionJack />;
    case "united-states":
      return <UnitedStatesFlag colors={colors} />;
    case "uruguay":
      return <UruguayFlag colors={colors} />;
    case "venezuela":
      return <VenezuelaFlag colors={colors} />;
    case "vertical-bicolor":
      return <VerticalBicolor colors={colors} />;
    case "vertical-tricolor":
      return <VerticalTricolor colors={colors} />;
    case "vertical-tricolor-emblem":
      return <VerticalTricolor emblem colors={colors} />;
  }
}

export default function MonochromeCountryFlag({
  country,
  colored = false,
}: {
  country: string;
  colored?: boolean;
}) {
  const colors = colored ? COUNTRY_FLAG_COLORS[country] : undefined;

  return (
    <svg
      aria-hidden
      className="h-[15px] w-[24px] shrink-0 overflow-visible"
      viewBox="0 0 24 15"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.66"
      strokeWidth="0.72"
    >
      <rect x="0.5" y="0.5" width="23" height="14" fill="none" />
      {drawPattern(resolvePattern(country), colors)}
    </svg>
  );
}
