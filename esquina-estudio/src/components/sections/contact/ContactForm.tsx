"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
const SELECT_SCROLL_GUTTER = 24;
const CONTACT_EASE = [0.22, 1, 0.36, 1] as const;
const CONTROL_TEXT_CLASS =
  "min-h-[48px] w-full bg-transparent pl-1 font-body text-[28px] uppercase leading-none text-off-black caret-off-black outline-none transition-colors duration-200 placeholder:text-gray-brand group-focus-within/contact-focus:text-off-white group-focus-within/contact-focus:caret-off-white group-focus-within/contact-focus:placeholder:text-off-white/70 md:min-h-[58px] md:text-[34px]";
const SELECT_BUTTON_CLASS =
  "flex min-h-[48px] w-full pl-1 items-center justify-between gap-4 bg-transparent text-left font-body text-[28px] uppercase leading-none text-off-black outline-none transition-colors duration-200 group-focus-within/contact-focus:text-off-white md:min-h-[58px] md:text-[34px]";
const SELECT_SEARCH_CLASS =
  "w-full bg-transparent pl-1  font-body text-[20px] uppercase leading-none text-off-black caret-off-black outline-none transition-colors duration-200 placeholder:text-gray-brand group-focus-within/contact-focus:text-off-white group-focus-within/contact-focus:caret-off-white group-focus-within/contact-focus:placeholder:text-off-white/70 md:text-[22px]";

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

function resolveWorkTypeFromService(service: string | null): WorkTypeOption | null {
  if (!service) return null;

  const normalized = normalizeServiceParam(service);
  if (!normalized) return null;

  const directMatch = WORK_TYPE_OPTIONS.find((option) => {
    const normalizedOption = normalizeServiceParam(option);
    return (
      normalized === normalizedOption ||
      normalized.includes(normalizedOption) ||
      normalizedOption.includes(normalized)
    );
  });

  if (directMatch) return directMatch;
  if (normalized.includes("motion")) return "Motion Graphics";
  if (normalized.includes("packaging")) return "Packaging Design";
  if (normalized.includes("rebrand")) return "Rebranding";
  if (normalized.includes("brand")) return "Branding";
  if (normalized.includes("event")) return "Event Visual Identity";
  if (normalized.includes("campaign") || normalized.includes("advertising")) {
    return "Advertising/Campaign";
  }

  return "Other";
}

function FieldShell({
  label,
  error,
  children,
}: {
  label: React.ReactNode;
  error?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 py-5 md:grid-cols-[minmax(150px,176px)_minmax(0,420px)] md:items-center md:gap-7 md:py-7">
      <label className="self-center font-body text-[14px] uppercase leading-[1.15] text-off-black md:text-right md:text-[16px]">
        {label}
      </label>
      <div className="min-w-0 self-center">
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
      className={`group/contact-focus relative isolate overflow-hidden border-b border-off-black ${className}`}
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
      className={`relative shrink-0 cursor-pointer overflow-hidden border border-off-black px-2.5 py-1.5 font-body text-[15px] uppercase leading-none transition-colors duration-150 hover:bg-off-black hover:text-off-white focus-visible:bg-off-black focus-visible:text-off-white md:text-[17px] ${
        selected
          ? "bg-off-black text-off-white"
          : "bg-transparent text-off-black"
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

function AnimatedLife({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <span className="inline-block border-b-2 border-off-black font-thin">
        LIFE
      </span>
    );
  }

  return (
    <span className="relative inline-block">
      <span className="sr-only">LIFE</span>
      <span aria-hidden className="invisible font-semibold">
        LIFE
      </span>
      <span aria-hidden className="absolute inset-0 font-normal">
        LIFE
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-0 overflow-hidden whitespace-nowrap font-medium"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{
          delay: 0.72,
          duration: 2.15,
          ease: CONTACT_EASE,
        }}
      >
        LIFE
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-[0.02em] left-0 right-0 h-[2px] origin-left bg-off-black"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          delay: 0.72,
          duration: 2.15,
          ease: CONTACT_EASE,
        }}
      />
    </span>
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
  scrollContainerRef,
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
  scrollContainerRef: RefObject<HTMLElement | null>;
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

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.requestAnimationFrame(() => {
      const dropdown = dropdownRef.current;
      const scrollContainer = scrollContainerRef.current;

      if (!dropdown || !scrollContainer) return;

      const dropdownRect = dropdown.getBoundingClientRect();
      const scrollRect = scrollContainer.getBoundingClientRect();
      const overflowBelow =
        dropdownRect.bottom - scrollRect.bottom + SELECT_SCROLL_GUTTER;

      if (overflowBelow > 0) {
        scrollContainer.scrollBy({
          top: overflowBelow,
          behavior: "smooth",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, scrollContainerRef]);

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
          className={SELECT_BUTTON_CLASS}
          onClick={() =>
            setOpenSelectId((current) => (current === id ? null : id))
          }
          aria-expanded={isOpen}
        >
          {value ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 text-off-black transition-colors duration-200 group-focus-within/contact-focus:text-off-white">
              <span className="min-w-0 truncate">{value}</span>
              {renderValueMeta?.(value)}
            </span>
          ) : (
            <span className="min-w-0 flex-1 truncate text-gray-brand transition-colors duration-200 group-focus-within/contact-focus:text-off-white/70">
              {placeholder}
            </span>
          )}
          <span
            aria-hidden
            className="shrink-0 self-end pb-1 pr-1 text-[18px] leading-none transition-colors duration-200 md:text-[21px]"
          >
            {isOpen ? "X" : ">"}
          </span>
        </button>
      </ContactFocusSurface>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="relative z-30 mt-2 flex min-h-0 flex-col border border-off-black bg-off-white p-2"
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
                className="flex w-full items-center justify-between gap-3 px-2 py-2 text-left font-body text-[18px] uppercase leading-none transition-colors hover:bg-off-black hover:text-off-white md:text-[20px]"
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
  const shouldReduceMotion = Boolean(reduceMotion);
  const formScrollRef = useRef<HTMLElement>(null);
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
  const [formScrollProgress, setFormScrollProgress] = useState(0);

  const updateFormScrollProgress = () => {
    const scrollContainer = formScrollRef.current;
    if (!scrollContainer) return;

    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const nextProgress =
      maxScroll <= 0 ? 1 : Math.min(1, Math.max(0, scrollContainer.scrollTop / maxScroll));

    setFormScrollProgress(nextProgress);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateFormScrollProgress);

    window.addEventListener("resize", updateFormScrollProgress);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateFormScrollProgress);
    };
  }, []);

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
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1680px] flex-col gap-6 lg:grid lg:grid-cols-[minmax(420px,1.08fr)_minmax(560px,0.92fr)] lg:gap-[clamp(3rem,6vw,8rem)]">
      <aside className="flex w-full max-w-[700px] flex-none flex-col self-start lg:h-full">
        <motion.div
          className="overflow-hidden"
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={shouldReduceMotion ? undefined : contactTitleVariants}
        >
          <h1 className="font-display text-[56px] font-thin uppercase leading-[0.9] md:text-[68px] lg:text-[clamp(74px,5.25vw,96px)]">
            LET&apos;S BRING
            <br />
            YOUR IDEAS
            <br />
            TO <AnimatedLife reduceMotion={shouldReduceMotion} />
          </h1>
        </motion.div>

        <motion.div
          className="mt-9 max-w-[560px] space-y-6 overflow-hidden font-body text-[20px] uppercase leading-[1.24] md:text-[23px] lg:mt-12 lg:text-[25px]"
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={shouldReduceMotion ? undefined : contactAsideDetailVariants}
        >
          <p>
            SHARE YOUR PROJECT DETAILS
            <br />
            TO RECEIVE A CUSTOM PROPOSAL
          </p>
          <p aria-hidden className="text-[28px] leading-none md:text-[32px]">
            &rarr;
          </p>
        </motion.div>

        <motion.div
          className="mt-8 w-fit lg:mt-auto"
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={shouldReduceMotion ? undefined : contactAsideDetailVariants}
        >
          <button
            type="submit"
            form={CONTACT_FORM_ID}
            disabled={isSubmitting}
            className="w-fit disabled:opacity-50"
          >
            <HoverButton
              as="span"
              className="font-body text-[21px] uppercase md:text-[24px]"
            >
              {isSubmitting ? "SENDING..." : "SEND QUESTIONNAIRE"}
            </HoverButton>
          </button>
        </motion.div>
      </aside>

      <div className="relative min-h-0 min-w-0 flex-1 bg-off-white lg:h-full lg:w-full lg:max-w-[840px] lg:justify-self-end">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-off-white px-5 pb-10 sm:px-6 md:px-8 lg:px-10"
        >
          <div className="mx-auto flex w-full max-w-[700px] items-center gap-4">
            <div className="relative h-px min-w-0 flex-1 bg-off-black/20">
              <motion.span
                className="absolute inset-y-0 left-0 w-full origin-left bg-off-black"
                initial={false}
                animate={{ scaleX: formScrollProgress }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: CONTACT_EASE }
                }
              />
            </div>
            <span className="shrink-0 font-body text-[12px] uppercase leading-none tracking-[0.22em] text-off-black/70 md:text-[13px]">
              {formScrollProgress >= 0.995 ? "End" : "Scroll"}
            </span>
          </div>
        </div>

        <section
          ref={formScrollRef}
          onScroll={updateFormScrollProgress}
          data-contact-scroll
          data-lenis-prevent
          className="h-full min-h-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable]"
          aria-label="Project questionnaire"
        >
          <div className="mx-auto min-h-full w-full max-w-[700px] px-5 pb-20 pt-14 sm:px-6 md:px-8 lg:px-10">
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
              className="mx-auto w-full max-w-[720px]"
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              variants={shouldReduceMotion ? undefined : contactFieldGroupVariants}
            >
              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell
                  label={"STATE YOUR FULL NAME *"}
                  error={errors.fullName?.message}
                >
                  <ContactFocusSurface>
                    <input
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
                  label="EMAIL ADDRESS *"
                  error={errors.email?.message}
                >
                  <ContactFocusSurface>
                    <input
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
                  label={
                    <>
                      <span className="block">WHAT ARE YOU</span>
                      <span className="block">LOOKING TO WORK ON?</span>
                    </>
                  }
                  error={errors.workType?.message}
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
                <FieldShell label="WHAT BEST DESCRIBES YOUR BUSINESS?">
                  <CustomSelect
                    id="business-type"
                    value={businessType}
                    options={BUSINESS_TYPE_OPTIONS}
                    placeholder="SELECT OPTION >"
                    scrollContainerRef={formScrollRef}
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
                <FieldShell label="WHAT IS YOUR INDUSTRY/FIELD">
                  <ContactFocusSurface>
                    <input
                      type="text"
                      placeholder="SHORT ANSWER"
                      className={CONTROL_TEXT_CLASS}
                      {...register("industry")}
                    />
                  </ContactFocusSurface>
                </FieldShell>
              </ContactFieldReveal>

              <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                <FieldShell label={<>
                      <span className="block">WHERE ARE</span>
                      <span className="block">YOU BASED?</span>
                    </>}>
                  <CustomSelect
                    id="country"
                    value={country}
                    options={COUNTRY_OPTIONS}
                    placeholder="SELECT OPTION >"
                    searchable
                    scrollContainerRef={formScrollRef}
                    openSelectId={openSelectId}
                    setOpenSelectId={setOpenSelectId}
                    renderOptionMeta={(option) => (
                      <MonochromeCountryFlag country={option} />
                    )}
                    renderValueMeta={(option) => (
                      <MonochromeCountryFlag country={option} />
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
                <FieldShell label="DO YOU HAVE A TIMELINE IN MIND?">
                  <CustomSelect
                    id="timeline"
                    value={timeline}
                    options={TIMELINE_OPTIONS}
                    placeholder="SELECT OPTION >"
                    scrollContainerRef={formScrollRef}
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
                <FieldShell label={<>
                      <span className="block">WHAT IS YOUR</span>
                      <span className="block">BUDGET RANGE?</span>
                    </>}>
                  <CustomSelect
                    id="budget"
                    value={budget}
                    options={BUDGET_OPTIONS}
                    placeholder="SELECT OPTION >"
                    scrollContainerRef={formScrollRef}
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
                <FieldShell label={<>
                      <span className="block">HOW DID YOU</span>
                      <span className="block">HEAR ABOUT US?</span>
                    </>}>
                  <ContactFocusSurface>
                    <input
                      type="text"
                      placeholder="SHORT ANSWER"
                      className={CONTROL_TEXT_CLASS}
                      {...register("hearAbout")}
                    />
                  </ContactFocusSurface>
                </FieldShell>
              </ContactFieldReveal>

              {submitError && (
                <ContactFieldReveal reduceMotion={shouldReduceMotion}>
                  <p className="mt-6 text-right font-body text-[13px] uppercase tracking-wider text-off-black">
                    {submitError}
                  </p>
                </ContactFieldReveal>
              )}
            </motion.form>
          </div>
        </section>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-off-white via-off-white/95 to-transparent"
        />
      </div>
    </div>  
  );
}
