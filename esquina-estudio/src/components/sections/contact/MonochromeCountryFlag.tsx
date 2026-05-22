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

function Star({
  cx,
  cy,
  size = 1.5,
}: {
  cx: number;
  cy: number;
  size?: number;
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
      fill="currentColor"
      fillOpacity="0.72"
      stroke="none"
    />
  );
}

function Seal({ cx = 12, cy = 7.5 }: { cx?: number; cy?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="2.15" fill="none" />
      <circle cx={cx} cy={cy} r="0.85" fill="currentColor" fillOpacity="0.2" />
    </>
  );
}

function Crescent({ cx = 12, cy = 7.5 }: { cx?: number; cy?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="3.05" fill="none" />
      <path d={`M ${cx + 0.9} ${cy - 2.25} A 2.45 2.45 0 1 0 ${cx + 0.9} ${cy + 2.25}`} />
      <Star cx={cx + 4.1} cy={cy} size={1.1} />
    </>
  );
}

function HorizontalTricolor({ emblem = false }: { emblem?: boolean }) {
  return (
    <>
      <path d="M 0.5 5 H 23.5 M 0.5 10 H 23.5" />
      <rect x="0.7" y="5" width="22.6" height="5" fill="currentColor" fillOpacity="0.05" stroke="none" />
      {emblem && <Seal />}
    </>
  );
}

function ArgentinaFlag() {
  return (
    <>
      <HorizontalTricolor />
      <circle cx="12" cy="7.5" r="1.35" />
      <path d="M 12 5.15 V 9.85 M 9.65 7.5 H 14.35 M 10.35 5.85 L 13.65 9.15 M 13.65 5.85 L 10.35 9.15" />
    </>
  );
}

function HorizontalBicolor({ emblem = false }: { emblem?: boolean }) {
  return (
    <>
      <path d="M 0.5 7.5 H 23.5" />
      <rect x="0.7" y="7.5" width="22.6" height="6.8" fill="currentColor" fillOpacity="0.06" stroke="none" />
      {emblem && <Seal />}
    </>
  );
}

function VerticalTricolor({ emblem = false }: { emblem?: boolean }) {
  return (
    <>
      <path d="M 8 0.5 V 14.5 M 16 0.5 V 14.5" />
      <rect x="8" y="0.7" width="8" height="13.6" fill="currentColor" fillOpacity="0.05" stroke="none" />
      {emblem && <Seal />}
    </>
  );
}

function VerticalBicolor() {
  return (
    <>
      <path d="M 12 0.5 V 14.5" />
      <rect x="0.7" y="0.7" width="11.3" height="13.6" fill="currentColor" fillOpacity="0.06" stroke="none" />
    </>
  );
}

function StripeFlag() {
  return (
    <>
      <path d="M 0.5 3 H 23.5 M 0.5 6 H 23.5 M 0.5 9 H 23.5 M 0.5 12 H 23.5" />
      <rect x="0.7" y="6" width="22.6" height="3" fill="currentColor" fillOpacity="0.08" stroke="none" />
    </>
  );
}

function NordicFlag() {
  return (
    <>
      <rect x="6.3" y="0.5" width="3.2" height="14" fill="currentColor" fillOpacity="0.08" />
      <rect x="0.5" y="5.9" width="23" height="3.2" fill="currentColor" fillOpacity="0.08" />
    </>
  );
}

function HoistTriangle() {
  return (
    <>
      <path d="M 0.5 0.5 L 10 7.5 L 0.5 14.5 Z" fill="currentColor" fillOpacity="0.06" />
      <path d="M 10 7.5 H 23.5 M 10 7.5 L 23.5 3.5 M 10 7.5 L 23.5 11.5" />
      <Star cx={4.1} cy={7.5} size={1.15} />
    </>
  );
}

function DiagonalFlag() {
  return (
    <>
      <path d="M 0.5 14.5 L 23.5 0.5" />
      <path d="M 0.5 10.7 L 17.2 0.5 M 6.8 14.5 L 23.5 4.3" />
      <rect x="0.7" y="0.7" width="22.6" height="13.6" fill="currentColor" fillOpacity="0.025" stroke="none" />
    </>
  );
}

function CenterDiscFlag() {
  return (
    <>
      <circle cx="12" cy="7.5" r="3.45" fill="currentColor" fillOpacity="0.07" />
      <circle cx="12" cy="7.5" r="3.45" fill="none" />
    </>
  );
}

function CrossFlag() {
  return (
    <>
      <path d="M 12 2.3 V 12.7 M 6.8 7.5 H 17.2" strokeWidth="1.6" />
      <rect x="0.7" y="0.7" width="22.6" height="13.6" fill="currentColor" fillOpacity="0.03" stroke="none" />
    </>
  );
}

function PanelFlag() {
  return (
    <>
      <path d="M 6.5 0.5 V 14.5 M 0.5 7.5 H 23.5" />
      <rect x="6.5" y="0.7" width="16.8" height="6.8" fill="currentColor" fillOpacity="0.045" stroke="none" />
      <Seal cx={14.8} />
    </>
  );
}

function FieldEmblemFlag() {
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

function UnitedStatesFlag() {
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

function GreeceFlag() {
  return (
    <>
      <path d="M 0.5 2.8 H 23.5 M 0.5 5.1 H 23.5 M 0.5 7.5 H 23.5 M 0.5 9.9 H 23.5 M 0.5 12.2 H 23.5" />
      <rect x="0.7" y="0.7" width="7.5" height="7.2" fill="currentColor" fillOpacity="0.06" />
      <path d="M 4.45 1 V 7.6 M 1 4.3 H 7.9" />
    </>
  );
}

function BrazilFlag() {
  return (
    <>
      <path d="M 12 2.1 L 21 7.5 L 12 12.9 L 3 7.5 Z" fill="currentColor" fillOpacity="0.04" />
      <circle cx="12" cy="7.5" r="2.75" />
      <path d="M 9.6 6.8 C 11 7.2 12.7 7.6 14.5 8.7" />
    </>
  );
}

function CanadaFlag() {
  return (
    <>
      <path d="M 6 0.5 V 14.5 M 18 0.5 V 14.5" />
      <path d="M 12 3.2 L 13 5.4 L 15.1 4.9 L 14.1 7 L 16 8 L 13.4 8.4 L 13.6 11.4 L 12 9.9 L 10.4 11.4 L 10.6 8.4 L 8 8 L 9.9 7 L 8.9 4.9 L 11 5.4 Z" />
    </>
  );
}

function ChileFlag() {
  return (
    <>
      <path d="M 0.5 7.5 H 23.5 M 7.8 0.5 V 7.5" />
      <Star cx={4.1} cy={3.9} size={1.35} />
      <rect x="0.7" y="7.5" width="22.6" height="6.8" fill="currentColor" fillOpacity="0.06" stroke="none" />
    </>
  );
}

function ChinaFlag() {
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

function ColombiaFlag() {
  return (
    <>
      <path d="M 0.5 7.5 H 23.5 M 0.5 11 H 23.5" />
      <rect x="0.7" y="0.7" width="22.6" height="6.8" fill="currentColor" fillOpacity="0.035" stroke="none" />
    </>
  );
}

function VenezuelaFlag() {
  return (
    <>
      <HorizontalTricolor />
      <path d="M 8.1 8.25 C 9.7 6.15 14.3 6.15 15.9 8.25" />
      <circle cx="9" cy="7.65" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="12" cy="6.85" r="0.35" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.65" r="0.35" fill="currentColor" stroke="none" />
    </>
  );
}

function UruguayFlag() {
  return (
    <>
      <path d="M 0.5 2.8 H 23.5 M 0.5 5.2 H 23.5 M 0.5 7.6 H 23.5 M 0.5 10 H 23.5 M 0.5 12.4 H 23.5" />
      <rect x="0.7" y="0.7" width="7" height="6.6" fill="currentColor" fillOpacity="0.04" />
      <circle cx="4.2" cy="3.9" r="1.3" />
      <path d="M 4.2 1.9 V 5.9 M 2.2 3.9 H 6.2" />
    </>
  );
}

function ParaguayFlag() {
  return (
    <>
      <HorizontalTricolor />
      <Seal />
    </>
  );
}

function SpainFlag() {
  return (
    <>
      <path d="M 0.5 3.5 H 23.5 M 0.5 11.5 H 23.5" />
      <rect x="0.7" y="3.5" width="22.6" height="8" fill="currentColor" fillOpacity="0.04" stroke="none" />
      <Seal cx={8.2} />
    </>
  );
}

function PortugalFlag() {
  return (
    <>
      <path d="M 9 0.5 V 14.5" />
      <circle cx="9" cy="7.5" r="2.2" />
      <path d="M 7.8 5.9 H 10.2 V 9.1 H 7.8 Z" />
    </>
  );
}

function IsraelFlag() {
  return (
    <>
      <path d="M 0.5 3 H 23.5 M 0.5 12 H 23.5" strokeWidth="1.25" />
      <path d="M 12 4.8 L 14.8 9.5 H 9.2 Z M 12 10.2 L 9.2 5.5 H 14.8 Z" />
    </>
  );
}

function SouthAfricaFlag() {
  return (
    <>
      <path d="M 0.5 1.3 L 9.1 7.5 L 0.5 13.7" />
      <path d="M 0.5 4.1 L 5.2 7.5 L 0.5 10.9" />
      <path d="M 5.2 7.5 H 23.5 M 9.1 7.5 L 23.5 2.1 M 9.1 7.5 L 23.5 12.9" />
    </>
  );
}

function SouthKoreaFlag() {
  return (
    <>
      <path d="M 9.25 7.5 A 2.75 2.75 0 0 1 14.75 7.5 A 2.75 2.75 0 0 1 9.25 7.5 Z" fill="currentColor" fillOpacity="0.045" />
      <path d="M 9.25 7.5 C 10.3 5.9 13.7 9.1 14.75 7.5" />
      <path d="M 5 3 L 7.1 5.1 M 4.4 3.6 L 6.5 5.7 M 17.1 9.6 L 19.2 11.7 M 17.7 9 L 19.8 11.1" />
    </>
  );
}

function QuarteredFlag() {
  return (
    <>
      <path d="M 12 0.5 V 14.5 M 0.5 7.5 H 23.5" />
      <Star cx={6} cy={4} size={1.1} />
      <Star cx={18} cy={11} size={1.1} />
    </>
  );
}

function EnsignFlag({ newZealand = false }: { newZealand?: boolean }) {
  return (
    <>
      <UnionJack x={0.7} y={0.7} width={9.2} height={5.7} />
      <Star cx={16.4} cy={4.3} size={newZealand ? 1.05 : 0.85} />
      <Star cx={19.2} cy={8.1} size={0.85} />
      <Star cx={15.3} cy={11.1} size={0.85} />
      {!newZealand && <Star cx={21} cy={11.6} size={0.6} />}
    </>
  );
}

function NepalFlag() {
  return (
    <>
      <path d="M 4 0.8 V 14.2 L 15 10.5 L 8.4 7.6 L 15 4.4 Z" />
      <circle cx="8.6" cy="4.4" r="1.1" />
      <Star cx={8.9} cy={10} size={1.1} />
    </>
  );
}

function drawPattern(pattern: FlagPattern) {
  switch (pattern) {
    case "argentina":
      return <ArgentinaFlag />;
    case "australia":
      return <EnsignFlag />;
    case "brazil":
      return <BrazilFlag />;
    case "canada":
      return <CanadaFlag />;
    case "canton-stripes":
      return <UnitedStatesFlag />;
    case "center-disc":
      return <CenterDiscFlag />;
    case "chile":
      return <ChileFlag />;
    case "china":
      return <ChinaFlag />;
    case "colombia":
      return <ColombiaFlag />;
    case "crescent":
      return <Crescent />;
    case "cross":
      return <CrossFlag />;
    case "diagonal":
      return <DiagonalFlag />;
    case "ensign":
      return <EnsignFlag newZealand />;
    case "field-emblem":
      return <FieldEmblemFlag />;
    case "greece":
      return <GreeceFlag />;
    case "horizontal-bicolor":
      return <HorizontalBicolor />;
    case "horizontal-bicolor-emblem":
      return <HorizontalBicolor emblem />;
    case "horizontal-stripes":
      return <StripeFlag />;
    case "horizontal-tricolor":
      return <HorizontalTricolor />;
    case "horizontal-tricolor-emblem":
      return <HorizontalTricolor emblem />;
    case "israel":
      return <IsraelFlag />;
    case "nepal":
      return <NepalFlag />;
    case "nordic":
      return <NordicFlag />;
    case "panels":
      return <PanelFlag />;
    case "paraguay":
      return <ParaguayFlag />;
    case "portugal":
      return <PortugalFlag />;
    case "quartered":
      return <QuarteredFlag />;
    case "south-africa":
      return <SouthAfricaFlag />;
    case "south-korea":
      return <SouthKoreaFlag />;
    case "spain":
      return <SpainFlag />;
    case "triangle":
      return <HoistTriangle />;
    case "union-jack":
      return <UnionJack />;
    case "united-states":
      return <UnitedStatesFlag />;
    case "uruguay":
      return <UruguayFlag />;
    case "venezuela":
      return <VenezuelaFlag />;
    case "vertical-bicolor":
      return <VerticalBicolor />;
    case "vertical-tricolor":
      return <VerticalTricolor />;
    case "vertical-tricolor-emblem":
      return <VerticalTricolor emblem />;
  }
}

export default function MonochromeCountryFlag({ country }: { country: string }) {
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
      {drawPattern(resolvePattern(country))}
    </svg>
  );
}
