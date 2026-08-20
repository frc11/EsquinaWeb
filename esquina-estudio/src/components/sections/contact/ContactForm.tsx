"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import MonochromeCountryFlag from "@/components/sections/contact/MonochromeCountryFlag";
import HoverButton from "@/components/ui/HoverButton";
import {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COUNTRY_OPTIONS,
  TIMELINE_OPTIONS,
  WORK_TYPE_OPTIONS,
  contactSchema,
} from "@/lib/contact";
import type { ContactFormValues } from "@/lib/contact";

type FieldError = string | undefined;
type WorkTypeOption = (typeof WORK_TYPE_OPTIONS)[number];

export const CONTACT_FORM_ID = "contact-form";
// Gap (px) kept between an open dropdown and the viewport edge when the page
// auto-scrolls the select into view.
const SELECT_SCROLL_GUTTER = 24;
const CONTACT_EASE = [0.22, 1, 0.36, 1] as const;
// Scoped text selection inside the contact inputs: off-white fill / off-black
// text — the inverse of the global ::selection — so the highlight stays visible
// against the black focus surface. `leading-none` keeps it hugging the glyphs.
//
// Why this needs `!important` (the `!` suffix) and not just higher specificity:
// the global `::selection` in globals.css is written UNLAYERED, while every
// Tailwind utility lives inside `@layer utilities`. In the CSS cascade an
// unlayered rule beats any layered rule regardless of specificity, so a plain
// (or even higher-specificity) `selection:bg-off-white` utility can never win
// against the global — which is why the highlight stayed invisible. We can't
// edit the shared globals.css, so we override from the layered side with
// `!important`: an important layered declaration outranks a normal unlayered one.
// The `[data-contact]` ancestor scope keeps this `!important` confined to the
// contact form inputs so it can't leak to the rest of the site.
const SCOPED_SELECTION =
  "[[data-contact]_&]:selection:bg-off-white! [[data-contact]_&]:selection:text-off-black!";
// Escala tipografica por rango de ancho. Solo hay tres escalones y el de
// >= 1600 es EXACTAMENTE el aprobado en B2.5b: 34/58 en los controles.
//
//   escalon 0  >= 1600      34 px / min-h 58   (composicion aprobada, intocable)
//   escalon 1  1360-1599    28 px / min-h 48   (la escala base que el archivo
//                                               ya tenia para < 768: no se
//                                               inventa ningun tamano nuevo)
//   escalon 2  1280-1359    26 px / min-h 44   (el unico tamano nuevo, y existe
//                                               solo para que 1280 entre)
//
// El escalon 1 no necesita clase propia: es el valor SIN variante, el mismo que
// gobierna debajo de 768. Por eso `md:` queda acotado con `max-[1279.98px]`, y
// el rango 1360-1599 cae al valor base. Los cuatro rangos son mutuamente
// excluyentes a proposito: Tailwind emite las variantes arbitrarias antes que
// los breakpoints con nombre, asi que sin acotar `md:` le ganaria a todo lo de
// arriba (la trampa que B2.5b y B2.6 verificaron dos veces).
const CONTROL_SCALE =
  "md:max-[1279.98px]:min-h-[58px] md:max-[1279.98px]:text-[34px] min-[1280px]:max-[1359.98px]:min-h-[44px] min-[1280px]:max-[1359.98px]:text-[26px] min-[1600px]:min-h-[58px] min-[1600px]:text-[34px]";
const CONTROL_TEXT_CLASS =
  `min-h-[48px] w-full bg-transparent pl-1 font-body text-[28px] uppercase leading-none text-off-black caret-off-black outline-none transition-colors duration-200 placeholder:text-gray-brand ${SCOPED_SELECTION} group-focus-within/contact-focus:text-off-white group-focus-within/contact-focus:caret-off-white group-focus-within/contact-focus:placeholder:text-off-white/70 ${CONTROL_SCALE}`;
const SELECT_BUTTON_CLASS =
  `flex min-h-[48px] w-full pl-1 items-center justify-between gap-4 bg-transparent text-left font-body text-[28px] uppercase leading-none text-off-black outline-none transition-colors duration-200 ${SCOPED_SELECTION} group-focus-within/contact-focus:text-off-white ${CONTROL_SCALE}`;
const SELECT_SEARCH_CLASS =
  `w-full bg-transparent pl-1  font-body text-[20px] uppercase leading-none text-off-black caret-off-black outline-none transition-colors duration-200 placeholder:text-gray-brand ${SCOPED_SELECTION} group-focus-within/contact-focus:text-off-white group-focus-within/contact-focus:caret-off-white group-focus-within/contact-focus:placeholder:text-off-white/70 md:max-[1279.98px]:text-[22px] min-[1600px]:text-[22px]`;

/**
 * Un solo lugar decide el `id` del label de un campo. Lo usan los dos lados de
 * la asociación: `FieldShell`, que emite el label, y `CustomSelect`, que lo cita
 * en su `aria-labelledby` para que el nombre accesible del disparador sea
 * «label + valor elegido» y no solo el label (un `<button>` toma su nombre del
 * contenido, así que un `htmlFor` a secas le taparía el valor).
 */
const labelIdFor = (controlId: string) => `${controlId}-label`;

const contactFieldGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.24,
      staggerChildren: 0.075,
    },
  },
};

const contactFieldVariants: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    filter: "blur(5px)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      clipPath: { duration: 0.82, ease: CONTACT_EASE },
      filter: { duration: 0.62, ease: CONTACT_EASE },
      opacity: { duration: 0.42, ease: CONTACT_EASE },
    },
    transitionEnd: {
      clipPath: "none",
      filter: "none",
    },
  },
};

const contactTitleVariants: Variants = {
  hidden: {
    clipPath: "inset(100% 0 0 0)",
    filter: "blur(7px)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      clipPath: { duration: 1.05, ease: CONTACT_EASE },
      filter: { duration: 0.72, ease: CONTACT_EASE },
      opacity: { duration: 0.48, ease: CONTACT_EASE },
    },
  },
};

const contactAsideDetailVariants: Variants = {
  hidden: {
    clipPath: "inset(0 0 100% 0)",
    filter: "blur(4px)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.72,
      ease: CONTACT_EASE,
    },
  },
};

function normalizeServiceParam(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Fallback tolerante de `?service=`: gana el primer trozo que aparezca en el
 * valor ya normalizado. Cubre los nombres del catálogo de /services —`brand
 * essentials`, `brand universe`, `packaging`, `editorial`, `illustration`,
 * `motion graphics`— y los nombres viejos de las pills, para que los links ya
 * emitidos sigan resolviendo después del rename `PACKAGING DESIGN` →
 * `PACKAGE DESIGN`. El orden importa: `brand` va último porque también está
 * dentro de `rebranding`.
 */
const SERVICE_KEYWORDS: ReadonlyArray<readonly [string, WorkTypeOption]> = [
  ["consult", "Consultation"],
  ["rebrand", "Rebranding"],
  ["event", "Event Visual Identity"],
  ["packag", "Package Design"],
  ["motion", "Motion Graphics"],
  ["advertis", "Advertising/Campaign"],
  ["campaign", "Advertising/Campaign"],
  ["illustrat", "Illustration"],
  ["editorial", "Editorial Design"],
  ["brand", "Branding"],
];

/**
 * Un valor desconocido devuelve `null`: el formulario abre sin nada marcado en
 * vez de elegir una opción por la clienta.
 */
function resolveWorkTypeFromService(service: string | null): WorkTypeOption | null {
  if (!service) return null;

  const normalized = normalizeServiceParam(service);
  if (!normalized) return null;

  const exactMatch = WORK_TYPE_OPTIONS.find(
    (option) => normalizeServiceParam(option) === normalized,
  );
  if (exactMatch) return exactMatch;

  const keyword = SERVICE_KEYWORDS.find(([needle]) =>
    normalized.includes(needle),
  );

  return keyword ? keyword[1] : null;
}

function FieldShell({
  label,
  controlId,
  error,
  alignLabelTop = false,
  asGroup = false,
  children,
}: {
  /** Dos líneas fijas: el corte lo decide el mockup, no el ancho de la columna. */
  label: readonly [string, string];
  /**
   * `id` del control que este label nombra. Los cuatro selects ya usaban este
   * mismo string como llave de `openSelectId`: ahora además viaja al DOM.
   */
  controlId: string;
  error?: FieldError;
  /** El bloque de pills es mucho más alto que su label: ahí el label va arriba. */
  alignLabelTop?: boolean;
  /**
   * El campo no es un control sino un grupo (las pills): ahí no hay un `id` al
   * que apuntar, así que el label deja de ser `<label>` y pasa a ser el nombre
   * accesible de un `role="group"`.
   */
  asGroup?: boolean;
  children: React.ReactNode;
}) {
  const labelId = labelIdFor(controlId);
  const labelClassName = `${
    alignLabelTop ? "self-start" : "self-center"
  } font-body text-[14px] uppercase leading-[1.15] text-off-black md:max-[1279.98px]:text-[16px] min-[1280px]:max-[1359.98px]:text-[12px] min-[1600px]:text-[16px]`;
  const labelLines = label.map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ));

  return (
    // El label va al costado en todos los rangos donde su ancho entra: en una
    // sola columna entre 768 y 880, y en dos columnas a partir de 1280 (B2.7
    // bajo ese umbral desde 1600 achicando la columna del label a su piso de
    // tres lineas y la tipografia un escalon). Queda ARRIBA solo entre 880 y
    // 1279, que es donde las dos columnas no entran de otra forma; ahi cuesta
    // 48,8 px de alto por campo.
    // Los rangos son mutuamente excluyentes a proposito: Tailwind emite las
    // variantes arbitrarias antes que los breakpoints con nombre, asi que sin
    // rangos disjuntos `md:` le ganaria a `min-[1600px]:` (B2.5b).
    <div className="grid gap-3 py-5 md:items-center md:gap-x-[var(--contact-gap)] md:py-3 md:max-[879.98px]:grid-cols-[var(--contact-label-w)_minmax(0,420px)] min-[1280px]:max-[1599.98px]:grid-cols-[var(--contact-label-w)_minmax(0,420px)] min-[1600px]:grid-cols-[var(--contact-label-w)_minmax(0,420px)]">
      {asGroup ? (
        <span id={labelId} className={labelClassName}>
          {labelLines}
        </span>
      ) : (
        <label id={labelId} htmlFor={controlId} className={labelClassName}>
          {labelLines}
        </label>
      )}
      <div
        className="min-w-0 self-center"
        role={asGroup ? "group" : undefined}
        aria-labelledby={asGroup ? labelId : undefined}
      >
        {children}
        {error && (
          <p className="mt-2 font-body text-[13px] uppercase tracking-wider text-off-black md:text-[14px]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function ContactFocusSurface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group/contact-focus relative isolate overflow-hidden border-b border-gray-brand ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full translate-y-full bg-off-black transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within/contact-focus:translate-y-0 motion-reduce:transition-none"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function WorkTypePill({
  option,
  selected,
  onToggle,
}: {
  option: WorkTypeOption;
  selected: boolean;
  onToggle: (option: WorkTypeOption) => void;
}) {
  const [ripple, setRipple] = useState<{
    id: number;
    size: number;
    x: number;
    y: number;
  } | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.8;

    setRipple({
      id: window.performance.now(),
      size,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    onToggle(option);
  };

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={handleClick}
      // El padding horizontal baja a su piso medido (4 px) debajo de 1600: es
      // lo que deja el bloque de pills en 4 filas dentro de 332 px en vez de
      // 356, y esos 24 px de ancho son los que sostienen el label al costado.
      className={`relative shrink-0 cursor-pointer overflow-hidden border border-gray-brand px-2.5 py-1.5 font-body text-[15px] uppercase leading-none transition-colors duration-150 hover:bg-off-black hover:text-off-white focus-visible:bg-off-black focus-visible:text-off-white md:max-[1279.98px]:text-[17px] min-[1280px]:max-[1599.98px]:px-1 min-[1280px]:max-[1359.98px]:text-[13px] min-[1600px]:text-[17px] ${
        selected
          ? "bg-off-black text-off-white"
          : "bg-transparent text-gray-brand"
      }`}
    >
      {ripple && (
        <motion.span
          key={ripple.id}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full bg-off-white/65"
          style={{
            height: ripple.size,
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
          }}
          initial={{ opacity: 0.45, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() =>
            setRipple((current) =>
              current?.id === ripple.id ? null : current,
            )
          }
        />
      )}
      <span className="relative z-10">{option}</span>
    </button>
  );
}

function ContactFieldReveal({
  children,
  reduceMotion,
}: {
  children: React.ReactNode;
  reduceMotion: boolean;
}) {
  return (
    <motion.div variants={reduceMotion ? undefined : contactFieldVariants}>
      {children}
    </motion.div>
  );
}

function CustomSelect({
  id,
  value,
  options,
  placeholder,
  searchable = false,
  renderOptionMeta,
  renderValueMeta,
  openSelectId,
  setOpenSelectId,
  onChange,
}: {
  id: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  searchable?: boolean;
  renderOptionMeta?: (option: string) => React.ReactNode;
  renderValueMeta?: (value: string) => React.ReactNode;
  openSelectId: string | null;
  setOpenSelectId: React.Dispatch<React.SetStateAction<string | null>>;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOpen = openSelectId === id;
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  // The dropdown is rendered out of flow (absolute overlay), so opening it no
  // longer changes the field height. When it would spill past the bottom of
  // the viewport, nudge the whole page (window) up just enough to reveal it.
  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const dropdown = dropdownRef.current;
      if (!dropdown) return;

      const dropdownRect = dropdown.getBoundingClientRect();
      const overflowBelow =
        dropdownRect.bottom - window.innerHeight + SELECT_SCROLL_GUTTER;

      if (overflowBelow > 0) {
        window.scrollBy({
          top: overflowBelow,
          behavior: "smooth",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && rootRef.current?.contains(target)) {
        return;
      }

      setOpenSelectId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenSelectId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setOpenSelectId]);

  return (
    <div ref={rootRef} data-contact-select className="relative">
      <ContactFocusSurface>
        <button
          type="button"
          id={id}
          className={SELECT_BUTTON_CLASS}
          onClick={() =>
            setOpenSelectId((current) => (current === id ? null : id))
          }
          aria-expanded={isOpen}
          // El `<label>` de `FieldShell` apunta acá con `htmlFor` --que es lo
          // que hace clickeable el label--, pero el nombre accesible se arma a
          // mano: primero el label, después este mismo botón, cuyo contenido es
          // el valor elegido. Sin la autorreferencia el label le ganaría al
          // contenido y el valor dejaría de anunciarse.
          aria-labelledby={`${labelIdFor(id)} ${id}`}
        >
          {value ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 text-off-black transition-colors duration-200 group-focus-within/contact-focus:text-off-white">
              {/* Sin `truncate`: un valor que no entra se parte en dos o tres
                  líneas en vez de perder texto. Los países más largos --con DR
                  Congo abreviado, el peor pasa a ser Saint Vincent and the
                  Grenadines-- no entran en una línea en NINGÚN ancho, ni
                  siquiera a 1920. El campo crece, pero es el de la columna
                  corta: el alto del bloque no se mueve en ningún rango
                  (medido). */}
              <span className="min-w-0">{value}</span>
              {renderValueMeta?.(value)}
            </span>
          ) : (
            <span className="min-w-0 flex-1 truncate text-gray-brand transition-colors duration-200 group-focus-within/contact-focus:text-off-white/70">
              {placeholder}
            </span>
          )}
          <span
            aria-hidden
            className="flex shrink-0 items-center self-center pr-1 text-gray-brand transition-colors duration-200 group-focus-within/contact-focus:text-off-white"
          >
            <svg
              viewBox="0 0 12 12"
              className="h-[14px] w-[14px] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:max-[1279.98px]:h-[16px] md:max-[1279.98px]:w-[16px] min-[1280px]:max-[1359.98px]:h-[12px] min-[1280px]:max-[1359.98px]:w-[12px] min-[1600px]:h-[16px] min-[1600px]:w-[16px]"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 4 2.5 L 8 6 L 4 9.5" />
            </svg>
          </span>
        </button>
      </ContactFocusSurface>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full z-30 mt-2 flex min-h-0 flex-col border border-off-black bg-off-white p-2"
        >
          {searchable && (
            <ContactFocusSurface className="mb-2 shrink-0">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="SEARCH"
                className={SELECT_SEARCH_CLASS}
              />
            </ContactFocusSurface>
          )}

          <div
            className={`space-y-1 overflow-y-auto overscroll-contain pr-1 ${
              searchable ? "max-h-[320px]" : "max-h-[240px]"
            }`}
          >
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="group flex w-full items-center justify-between gap-3 px-2 py-2 text-left font-body text-[18px] uppercase leading-none transition-colors hover:bg-off-black hover:text-off-white md:max-[1279.98px]:text-[20px] min-[1600px]:text-[20px]"
                onClick={() => {
                  onChange(option);
                  setOpenSelectId(null);
                  setQuery("");
                }}
              >
                <span>{option}</span>
                {renderOptionMeta?.(option)}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <p className="px-2 py-4 font-body text-[13px] uppercase tracking-wider text-gray-brand">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactForm({ service = null }: { service?: string | null }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { isPreloaderDone } = usePreloader();
  const shouldReduceMotion = Boolean(reduceMotion);
  const prefilledWorkType = useMemo(() => {
    const resolvedService = resolveWorkTypeFromService(service);
    return resolvedService ? [resolvedService] : [];
  }, [service]);
  const [submitError, setSubmitError] = useState("");
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      workType: prefilledWorkType,
      businessType: "",
      industry: "",
      country: "",
      timeline: "",
      budget: "",
      hearAbout: "",
    },
  });

  const workType = useWatch({ control, name: "workType" }) ?? [];
  const businessType = useWatch({ control, name: "businessType" }) ?? "";
  const country = useWatch({ control, name: "country" }) ?? "";
  const timeline = useWatch({ control, name: "timeline" }) ?? "";
  const budget = useWatch({ control, name: "budget" }) ?? "";

  useEffect(() => {
    if (prefilledWorkType.length === 0) return;

    setValue("workType", prefilledWorkType, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [prefilledWorkType, setValue]);

  const toggleWorkType = (option: string) => {
    const next = workType.includes(option)
      ? workType.filter((item) => item !== option)
      : [...workType, option];

    setValue("workType", next, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/contact/success");
      return;
    }

    setSubmitError("We could not send your questionnaire. Please try again.");
  };

  return (
    <div
      data-contact
      // El aside se sienta al costado solo mientras la pista de 280 px entra
      // al lado del formulario: 280 + 40 + 784 = 1104 de contenido = 1232 de
      // viewport. Debajo de eso apila arriba (palanca 2), que es el `flex
      // flex-col` de base. La pista del aside toma el sobrante como en >= 1600
      // y el formulario queda pegado al borde derecho en todos los rangos, asi
      // que al cruzar 1600 el bloque crece hacia la izquierda sin moverse de
      // su margen. Rangos disjuntos, sin `lg:` (ver FieldShell).
      //
      // De 1280 a 1599 la pista del aside baja de 280 a 272: el ancho
      // max-content del aside medido es 269,16 (lo fija el subtitulo, no el
      // titulo), asi que 272 lo deja intacto y devuelve 8 px al formulario.
      // Ni el titulo ni el subtitulo cambian de tamano en ningun rango.
      className="mx-auto flex w-full max-w-[1680px] flex-col gap-12 [--contact-gap:28px] [--contact-label-w:176px] min-[1232px]:grid min-[1232px]:items-start min-[1232px]:gap-x-10 min-[1232px]:max-[1279.98px]:grid-cols-[minmax(280px,1fr)_minmax(784px,872px)] min-[1280px]:max-[1359.98px]:grid-cols-[minmax(272px,1fr)_minmax(840px,1099px)] min-[1280px]:max-[1359.98px]:[--contact-label-w:95px] min-[1360px]:max-[1599.98px]:grid-cols-[minmax(272px,1fr)_minmax(920px,1129px)] min-[1360px]:max-[1599.98px]:[--contact-label-w:111px] min-[1600px]:grid-cols-[minmax(280px,1fr)_minmax(1120px,1192px)]"
    >
      <aside className="flex w-full max-w-[700px] flex-none flex-col self-start">
        <motion.div
          className="overflow-hidden"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={isPreloaderDone ? "visible" : "hidden"}
          variants={shouldReduceMotion ? undefined : contactTitleVariants}
        >
          <h1 className="font-display text-[40px] font-thin uppercase leading-[48px] tracking-normal">
            LET&apos;S BRING
            <br />
            YOUR IDEAS
            <br />
            TO LIFE
          </h1>
        </motion.div>

        <motion.div
          className="mt-9 max-w-[560px] overflow-hidden font-body text-[17px] uppercase leading-[21px] tracking-normal"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={isPreloaderDone ? "visible" : "hidden"}
          variants={shouldReduceMotion ? undefined : contactAsideDetailVariants}
        >
          <p>
            SHARE YOUR PROJECT DETAILS
            <br />
            TO RECEIVE A CUSTOM PROPOSAL
          </p>
        </motion.div>
      </aside>

      <div className="min-w-0 min-[1232px]:w-full min-[1232px]:justify-self-end">
        <motion.form
          id={CONTACT_FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          onFocusCapture={(event) => {
            const target = event.target;

            if (
              target instanceof HTMLElement &&
              !target.closest("[data-contact-select]")
            ) {
              setOpenSelectId(null);
            }
          }}
          aria-label="Project questionnaire"
          className="w-full"
          initial={shouldReduceMotion ? false : "hidden"}
          animate={isPreloaderDone ? "visible" : "hidden"}
          variants={shouldReduceMotion ? undefined : contactFieldGroupVariants}
        >
          {/* Seis estados, un solo eje: el ancho. Ninguno es una preferencia
              --cada corte es el ancho donde el estado de arriba deja de entrar
              sin romper una restriccion medida. Cada pista es
              [label + gap + control] y su piso es la suma de esos tres.

              >= 1600  label al costado, escalon 0 (34/58, pills 17 px-2.5,
                       labels 16 a dos lineas):
                       280 + 40 + [176 + 24 + 396] + 32 + [140 + 24 + 352]
                       = 1472 de contenido = 1600 de viewport.
              >= 1360  label al costado, escalon 1 (28/48, pills 15 px-1,
                       labels 14 a tres lineas):
                       272 + 40 + [111 + 24 + 332] + 32 + [98 + 24 + 295]
                       = 1228 + 4 de aire = 1232 de contenido = 1360.
              >= 1280  label al costado, escalon 2 (26/44, pills 13 px-1,
                       labels 12 a tres lineas):
                       272 + 40 + [95 + 24 + 291] + 32 + [84 + 24 + 275]
                       = 1137 + 15 de aire = 1152 de contenido = 1280.
              >= 1232  label ARRIBA del control, escalon 0. Sacar el label del
                       costado libera 364 px y deja el piso en
                       280 + 40 + [396 + 32 + 352] = 1100, mas 4 de aire
                       = 1104 de contenido = 1232 de viewport.
              >=  880  lo mismo, pero con el aside APILADO arriba del
                       formulario: sin la pista del aside el piso baja a 784 de
                       contenido, y debajo de 1024 el padding de pagina es 96,
                       o sea 880 de viewport.
              <   880  una sola columna, que es donde el label vuelve al
                       costado porque ahi si entra (176 + 24 + 420 = 620).

              Los tres pisos de control estan medidos, no elegidos: 396/332/291
              es el ancho minimo donde las 10 pills siguen entrando en 4 filas
              a 17/15/13 px, y 352/295/275 el minimo donde $2,500-$4,000 USD no
              se trunca a 34/28/26 px. Las columnas de label (176/111/95 y
              140/98/84) son el minimo donde ningun label pasa de tres lineas,
              que es lo que entra en el alto del control sin engordar el campo.
              El tope de 420 en todas las pistas es el mismo tope de control del
              layout de una columna, para que ningun control quede estirado.

              El costo de las palancas es alto, no ancho: el label arriba suma
              48,8 px por campo (36,8 de dos lineas a 16/1,15 mas 12 de gap) y
              el aside apilado suma 270 (222 del bloque mas 48 de gap). Por eso
              el label al costado baja hasta 1280 en vez de dejar que el label
              suba: el bloque mide 450 y 426 en los escalones 1 y 2, contra los
              741,9 que costaba el label arriba.

              El orden del DOM sigue siendo el orden de tipeo: la primera
              columna lleva los primeros cinco campos y la segunda el resto mas
              el boton, asi que Tab recorre nombre, email, pills, negocio,
              industria, ubicacion, plazo, presupuesto, como nos conociste y
              SEND. Sin reordenar markup ni posicionamiento absoluto. */}
          <div className="min-[880px]:grid min-[880px]:items-start min-[880px]:gap-x-8 min-[880px]:max-[1279.98px]:grid-cols-[minmax(396px,420px)_minmax(352px,420px)] min-[1280px]:max-[1359.98px]:grid-cols-[minmax(418px,539px)_minmax(390px,528px)] min-[1280px]:max-[1599.98px]:[--contact-gap:24px] min-[1360px]:max-[1599.98px]:grid-cols-[minmax(469px,555px)_minmax(419px,542px)] min-[1600px]:grid-cols-[minmax(600px,620px)_minmax(520px,540px)] min-[1600px]:[--contact-gap:24px]">
            <div>
              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["STATE YOUR", "FULL NAME *"]}
                  controlId="full-name"
                  error={errors.fullName?.message}
                >
                  <ContactFocusSurface>
                    <input
                      id="full-name"
                      type="text"
                      placeholder="NAME"
                      className={CONTROL_TEXT_CLASS}
                      {...register("fullName")}
                    />
                  </ContactFocusSurface>
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["EMAIL", "ADDRESS *"]}
                  controlId="email"
                  error={errors.email?.message}
                >
                  <ContactFocusSurface>
                    <input
                      id="email"
                      type="email"
                      placeholder="EMAIL"
                      className={CONTROL_TEXT_CLASS}
                      {...register("email")}
                    />
                  </ContactFocusSurface>
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["WHAT ARE YOU", "LOOKING TO WORK ON?"]}
                  controlId="work-type"
                  error={errors.workType?.message}
                  alignLabelTop
                  asGroup
                >
                  <div className="flex max-w-[430px] flex-wrap gap-1.5">
                    {WORK_TYPE_OPTIONS.map((option) => (
                      <WorkTypePill
                        key={option}
                        option={option}
                        selected={workType.includes(option)}
                        onToggle={toggleWorkType}
                      />
                    ))}
                  </div>
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["WHAT BEST DESCRIBES", "YOUR BUSINESS?"]}
                  controlId="business-type"
                >
                  <CustomSelect
                    id="business-type"
                    value={businessType}
                    options={BUSINESS_TYPE_OPTIONS}
                    placeholder="SELECT OPTION"
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    onChange={(value) =>
                      setValue("businessType", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["WHAT IS YOUR", "INDUSTRY/FIELD"]}
                  controlId="industry"
                >
                  <ContactFocusSurface>
                    <input
                      id="industry"
                      type="text"
                      placeholder="SHORT ANSWER"
                      className={CONTROL_TEXT_CLASS}
                      {...register("industry")}
                    />
                  </ContactFocusSurface>
                </FieldShell>
              </ContactFieldReveal>
            </div>

            <div className="min-[1280px]:max-[1359.98px]:[--contact-label-w:84px] min-[1360px]:max-[1599.98px]:[--contact-label-w:98px] min-[1600px]:[--contact-label-w:140px]">
              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["WHERE ARE", "YOU BASED?"]}
                  controlId="country"
                >
                  <CustomSelect
                    id="country"
                    value={country}
                    options={COUNTRY_OPTIONS}
                    placeholder="SELECT OPTION"
                    searchable
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    renderOptionMeta={(option) => (
                      // Mono by default; the colored variant fades in on row
                      // hover via `group-hover` (no per-option JS state).
                      <span className="relative grid shrink-0 place-items-center">
                        <span className="col-start-1 row-start-1 transition-opacity duration-150 group-hover:opacity-0">
                          <MonochromeCountryFlag country={option} />
                        </span>
                        <span
                          aria-hidden
                          className="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        >
                          <MonochromeCountryFlag country={option} colored />
                        </span>
                      </span>
                    )}
                    renderValueMeta={(option) => (
                      <MonochromeCountryFlag country={option} colored />
                    )}
                    onChange={(value) =>
                      setValue("country", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["DO YOU HAVE A", "TIMELINE IN MIND?"]}
                  controlId="timeline"
                >
                  <CustomSelect
                    id="timeline"
                    value={timeline}
                    options={TIMELINE_OPTIONS}
                    placeholder="SELECT OPTION"
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    onChange={(value) =>
                      setValue("timeline", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["WHAT IS YOUR", "BUDGET RANGE?"]}
                  controlId="budget"
                >
                  <CustomSelect
                    id="budget"
                    value={budget}
                    options={BUDGET_OPTIONS}
                    placeholder="SELECT OPTION"
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    onChange={(value) =>
                      setValue("budget", value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={["HOW DID YOU", "HEAR ABOUT US?"]}
                  controlId="hear-about"
                >
                  <ContactFocusSurface>
                    <input
                      id="hear-about"
                      type="text"
                      placeholder="SHORT ANSWER"
                      className={CONTROL_TEXT_CLASS}
                      {...register("hearAbout")}
                    />
                  </ContactFocusSurface>
                </FieldShell>
              </ContactFieldReveal>

              {/* El boton ocupa el lugar de un campo al final de la segunda
                  columna. Entra al <form> (antes vivia afuera, atado por el
                  atributo `form`), pero conserva su propio initial/animate: eso
                  lo deja como raiz de animacion independiente, fuera del
                  stagger de los campos, igual que antes.

                  Su margen superior es lo unico que empareja las dos columnas,
                  porque la izquierda lleva 5 campos y la derecha 4 mas el
                  boton: cada palanca que engorda un campo agranda la izquierda
                  una vez mas que la derecha, y el margen tiene que absorber esa
                  diferencia. Con el label al costado son 64 px (498 contra
                  440,5: 57,5 de diferencia). Con el label arriba cada campo
                  suma 48,8, asi que el margen sube esos mismos 48,8 --112 en
                  vez de 64-- y la diferencia se queda donde estaba. En una
                  sola columna se queda en 28. En los escalones 1 y 2 el campo
                  adelgaza (73 y 69 contra 83), asi que el margen se queda en 64
                  y baja a 56: la diferencia medida es 54 en los dos, debajo del
                  tope de 60. */}
              <motion.div
                className="mt-12 md:grid md:gap-x-[var(--contact-gap)] md:max-[879.98px]:mt-7 md:max-[879.98px]:grid-cols-[var(--contact-label-w)_minmax(0,420px)] min-[880px]:max-[1279.98px]:mt-28 min-[1280px]:max-[1359.98px]:mt-14 min-[1280px]:max-[1599.98px]:grid-cols-[var(--contact-label-w)_minmax(0,420px)] min-[1360px]:max-[1599.98px]:mt-16 min-[1600px]:mt-16 min-[1600px]:grid-cols-[var(--contact-label-w)_minmax(0,420px)]"
                initial={shouldReduceMotion ? false : "hidden"}
                animate={isPreloaderDone ? "visible" : "hidden"}
                variants={shouldReduceMotion ? undefined : contactAsideDetailVariants}
              >
                <div
                  aria-hidden
                  className="hidden md:max-[879.98px]:block min-[1280px]:max-[1599.98px]:block min-[1600px]:block"
                />
                <div className="flex md:justify-end">
                  <button
                    type="submit"
                    form={CONTACT_FORM_ID}
                    disabled={isSubmitting}
                    className="w-fit disabled:opacity-50"
                  >
                    <HoverButton
                      as="span"
                      className="font-body text-[21px] uppercase md:max-[1279.98px]:text-[24px] min-[1600px]:text-[24px]"
                    >
                      {isSubmitting ? "SENDING..." : "SEND QUESTIONNAIRE"}
                    </HoverButton>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {submitError && (
            <ContactFieldReveal reduceMotion={shouldReduceMotion}>
              <p className="mt-6 text-right font-body text-[13px] uppercase tracking-wider text-off-black">
                {submitError}
              </p>
            </ContactFieldReveal>
          )}
        </motion.form>
      </div>
    </div>
  );
}
