"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-b border-off-black/20 py-6 md:grid-cols-[220px_1fr] md:gap-8">
      <label className="font-body text-[17px] uppercase leading-[1.2] text-gray-brand md:text-right">
        {label}
      </label>
      <div>
        {children}
        {error && (
          <p className="mt-2 font-body text-[13px] uppercase tracking-wider text-off-black">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function CustomSelect({
  value,
  options,
  placeholder,
  searchable = false,
  onChange,
}: {
  value: string;
  options: readonly string[];
  placeholder: string;
  searchable?: boolean;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-off-black bg-transparent pb-3 text-left font-body text-[17px] uppercase outline-none transition-[border-width] focus:border-b-2"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={value ? "text-off-black" : "text-gray-brand"}>
          {value || placeholder}
        </span>
        <span aria-hidden>{isOpen ? "X" : ">"}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[320px] overflow-y-auto border border-off-black bg-off-white p-3 shadow-sm">
          {searchable && (
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="SEARCH"
              className="mb-3 w-full border-b border-off-black bg-transparent pb-2 font-body text-[17px] uppercase outline-none placeholder:text-gray-brand"
            />
          )}

          <div className="space-y-1">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="block w-full px-2 py-2 text-left font-body text-[17px] uppercase transition-colors hover:bg-off-black hover:text-off-white"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setQuery("");
                }}
              >
                {option}
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

export default function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const prefilledWorkType = useMemo(() => {
    const resolvedService = resolveWorkTypeFromService(service);
    return resolvedService ? [resolvedService] : [];
  }, [service]);
  const [submitError, setSubmitError] = useState("");

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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FieldShell
        label="STATE YOUR FULL NAME *"
        error={errors.fullName?.message}
      >
        <input
          type="text"
          placeholder="NAME"
          className="w-full border-b border-off-black bg-transparent pb-3 font-body text-[17px] uppercase outline-none placeholder:text-gray-brand focus:border-b-2"
          {...register("fullName")}
        />
      </FieldShell>

      <FieldShell label="EMAIL ADDRESS *" error={errors.email?.message}>
        <input
          type="email"
          placeholder="EMAIL"
          className="w-full border-b border-off-black bg-transparent pb-3 font-body text-[17px] uppercase outline-none placeholder:text-gray-brand focus:border-b-2"
          {...register("email")}
        />
      </FieldShell>

      <FieldShell
        label="WHAT ARE YOU LOOKING TO WORK ON? *"
        error={errors.workType?.message}
      >
        <div className="flex flex-wrap gap-2">
          {WORK_TYPE_OPTIONS.map((option) => {
            const selected = workType.includes(option);

            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleWorkType(option)}
                className={`border border-off-black px-3 py-2 font-body text-[17px] uppercase transition-colors ${
                  selected
                    ? "bg-off-black text-off-white"
                    : "bg-transparent text-off-black"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </FieldShell>

      <FieldShell
        label="WHAT BEST DESCRIBES YOUR BUSINESS? *"
        error={errors.businessType?.message}
      >
        <CustomSelect
          value={businessType}
          options={BUSINESS_TYPE_OPTIONS}
          placeholder="SELECT OPTION >"
          onChange={(value) =>
            setValue("businessType", value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      <FieldShell
        label="WHAT IS YOUR INDUSTRY/FIELD *"
        error={errors.industry?.message}
      >
        <input
          type="text"
          placeholder="SHORT ANSWER"
          className="w-full border-b border-off-black bg-transparent pb-3 font-body text-[17px] uppercase outline-none placeholder:text-gray-brand focus:border-b-2"
          {...register("industry")}
        />
      </FieldShell>

      <FieldShell label="WHERE ARE YOU BASED? *" error={errors.country?.message}>
        <CustomSelect
          value={country}
          options={COUNTRY_OPTIONS}
          placeholder="SELECT OPTION >"
          searchable
          onChange={(value) =>
            setValue("country", value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      <FieldShell
        label="DO YOU HAVE A TIMELINE IN MIND? *"
        error={errors.timeline?.message}
      >
        <CustomSelect
          value={timeline}
          options={TIMELINE_OPTIONS}
          placeholder="SELECT OPTION >"
          onChange={(value) =>
            setValue("timeline", value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      <FieldShell
        label="WHAT IS YOUR BUDGET RANGE? *"
        error={errors.budget?.message}
      >
        <CustomSelect
          value={budget}
          options={BUDGET_OPTIONS}
          placeholder="SELECT OPTION >"
          onChange={(value) =>
            setValue("budget", value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      <FieldShell label="HOW DID YOU HEAR ABOUT US?">
        <input
          type="text"
          placeholder="SHORT ANSWER"
          className="w-full border-b border-off-black bg-transparent pb-3 font-body text-[17px] uppercase outline-none placeholder:text-gray-brand focus:border-b-2"
          {...register("hearAbout")}
        />
      </FieldShell>

      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="disabled:opacity-50"
        >
          <HoverButton as="span" className="font-body text-[17px] uppercase">
            {isSubmitting ? "SENDING..." : "SEND QUESTIONNAIRE"}
          </HoverButton>
        </button>
      </div>

      {submitError && (
        <p className="mt-6 text-right font-body text-[13px] uppercase tracking-wider text-off-black">
          {submitError}
        </p>
      )}
    </form>
  );
}
