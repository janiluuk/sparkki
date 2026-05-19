"use client";

import { useMemo, useState } from "react";
import type { ComputerLookupResult } from "@/lib/orders/computer-lookup";
import {
  compatVisualForStatus,
  matchCompatTone,
} from "@/lib/koneet/compat-visual";
import { laptopCategoryVisual } from "@/lib/koneet/laptop-category-visual";
import {
  buildLookupSpecChips,
  type LookupSpecChipLabels,
} from "@/lib/koneet/lookup-spec-chips";
import { computerStepNeedsYear } from "@/lib/wizard/computer-spec-rows";

type Props = {
  lookup: ComputerLookupResult;
  selectedMatchId: string | null;
  onSelectMatch: (id: string) => void;
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
  loading: boolean;
  noVerifiedMatch: boolean;
  labels: LookupSpecChipLabels & {
    specsPickModel: string;
    specsYearLabel: string;
    specsYearPlaceholder: string;
    specsYearHint: string;
    specsCompatLabel: string;
    specsTableCaption: string;
    compatStatus_compatible: string;
    compatStatus_potentially_good: string;
    compatStatus_borderline: string;
    compatStatus_incompatible: string;
    lookupImageAlt: string;
    lookupCategoryFallback: string;
  };
  webSpecsLabel?: string;
  webSpecsLinkLabel?: string;
  homeNoMatchSupport?: string;
};

function toneBorder(tone: string) {
  if (tone === "accent") return "border-g/35";
  if (tone === "danger") return "border-danger/35";
  if (tone === "amber") return "border-amber/35";
  return "border-edge";
}

function LookupImage({
  imageUrl,
  alt,
  fallbackIcon,
  fallbackTone,
}: {
  imageUrl: string | null | undefined;
  alt: string;
  fallbackIcon: string;
  fallbackTone: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(imageUrl?.trim()) && !failed;

  if (showPhoto) {
    return (
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-edge bg-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl!}
          alt={alt}
          className="size-full object-cover object-center"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex size-16 shrink-0 items-center justify-center rounded-lg border bg-canvas/80 font-display text-2xl ${toneBorder(fallbackTone)}`}
      aria-hidden
    >
      {fallbackIcon}
    </div>
  );
}

export function ComputerLookupResults({
  lookup,
  selectedMatchId,
  onSelectMatch,
  selectedYear,
  onSelectYear,
  loading,
  noVerifiedMatch,
  labels,
  webSpecsLinkLabel,
  homeNoMatchSupport,
}: Props) {
  const primary =
    lookup.matches.find((m) => m.id === selectedMatchId) ?? lookup.matches[0];

  const displayMake = primary?.make ?? lookup.coerced.make;
  const displayModel = primary?.model ?? lookup.coerced.model;

  const compatStatus = noVerifiedMatch
    ? "potentially_good"
    : (lookup.compatibility?.status ?? "borderline");

  const compatLabel =
    labels[
      `compatStatus_${compatStatus}` as keyof Pick<
        Props["labels"],
        | "compatStatus_compatible"
        | "compatStatus_potentially_good"
        | "compatStatus_borderline"
        | "compatStatus_incompatible"
      >
    ];

  const compatVisual = compatVisualForStatus(compatStatus);
  const categoryVisual = laptopCategoryVisual(lookup.category, displayMake);

  const chips = useMemo(
    () => buildLookupSpecChips(lookup, labels, selectedMatchId),
    [lookup, labels, selectedMatchId],
  );

  const showYearPicker = computerStepNeedsYear(lookup);
  const heroImageUrl =
    lookup.imageUrl ?? primary?.imageUrl ?? lookup.webSpecs?.imageUrl ?? null;

  return (
    <>
      {!loading && lookup.matches.length > 1 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ink">{labels.specsPickModel}</p>
          <ul className="space-y-1.5" role="listbox" aria-label={labels.specsPickModel}>
            {lookup.matches.slice(0, 4).map((m) => {
              const tone = matchCompatTone(m.compatible);
              const iconClass =
                tone === "accent"
                  ? "text-g"
                  : tone === "danger"
                    ? "text-danger"
                    : "text-amber";
              const icon =
                tone === "accent" ? "✓" : tone === "danger" ? "⚠" : "⚠";
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedMatchId === m.id}
                    onClick={() => onSelectMatch(m.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors sm:px-4 ${
                      selectedMatchId === m.id
                        ? "border-g bg-g/[0.08]"
                        : "border-edge bg-card hover:border-em"
                    }`}
                  >
                    <span
                      className={`w-4 shrink-0 text-center text-sm font-bold ${iconClass}`}
                      aria-hidden
                    >
                      {icon}
                    </span>
                    {m.imageUrl ? (
                      <span className="relative size-8 shrink-0 overflow-hidden rounded-md border border-edge bg-sunken">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.imageUrl}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </span>
                    ) : (
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-md border border-edge bg-sunken/80 text-sm text-g"
                        aria-hidden
                      >
                        ▤
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-ink">
                        {m.make} {m.model}
                      </span>
                      {(m.yearFrom != null || m.yearTo != null) && (
                        <span className="block font-mono text-xs text-fog">
                          {m.yearFrom ?? "—"}–{m.yearTo ?? "—"}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {!loading && showYearPicker ? (
        <div className="mt-4 space-y-2">
          <label
            htmlFor="lookup-compat-year"
            className="block text-sm font-semibold text-ink"
          >
            {labels.specsYearLabel}
          </label>
          {lookup.yearOptions.length <= 6 ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label={labels.specsYearLabel}>
              {lookup.yearOptions.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => onSelectYear(selectedYear === y ? null : y)}
                  aria-pressed={selectedYear === y}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedYear === y
                      ? "border-g bg-g text-canvas"
                      : "border-edge bg-card text-ink hover:border-em"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <select
              id="lookup-compat-year"
              className="sparkki-input min-h-tap w-full max-w-xs rounded-lg border border-em bg-sunken px-4 text-ink"
              value={selectedYear ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onSelectYear(v ? Number(v) : null);
              }}
            >
              <option value="">{labels.specsYearPlaceholder}</option>
              {lookup.yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : null}

      {!loading &&
      (chips.length > 0 || primary || lookup.reference?.summary || lookup.reference?.cpu) ? (
        <article
          className="mt-4 overflow-hidden rounded-xl border border-edge bg-card/60"
          aria-label={labels.specsTableCaption}
          data-testid="computer-lookup-visual"
        >
          <div className="flex items-center gap-3 p-4 border-b border-edge">
            <LookupImage
              imageUrl={heroImageUrl}
              alt={labels.lookupImageAlt.replace("{model}", `${displayMake} ${displayModel}`.trim())}
              fallbackIcon={categoryVisual.icon}
              fallbackTone={categoryVisual.tone}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${compatVisual.pillClass}`}
                >
                  <span aria-hidden>{compatVisual.icon}</span>
                  {compatLabel}
                </span>
                {lookup.category ? (
                  <span className="inline-flex items-center rounded-full border border-edge bg-sunken/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fog">
                    {lookup.category}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-1 font-display text-base font-bold leading-snug text-ink sm:text-lg">
                {displayMake} {displayModel}
              </h3>
            </div>
          </div>

          {chips.length > 0 ? (
            <div className="overflow-x-auto px-4 py-3 sm:px-5">
              <ul className="flex gap-2" style={{ width: "max-content" }}>
                {chips.map((c) => (
                  <li key={c.id}>
                    <SpecChip chip={c} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      ) : null}

      {noVerifiedMatch && homeNoMatchSupport ? (
        <p
          className="mt-3 rounded-lg border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm text-ink"
          role="status"
          data-testid="home-no-match-notice"
        >
          {homeNoMatchSupport}
        </p>
      ) : null}

      {!loading && lookup.webSpecs?.specUrl && webSpecsLinkLabel ? (
        <p className="mt-3" data-testid="home-web-specs-hint">
          <a
            href={lookup.webSpecs.specUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-g underline-offset-2 hover:underline"
          >
            {webSpecsLinkLabel}
          </a>
        </p>
      ) : null}
    </>
  );
}

function SpecChip({ chip }: { chip: { icon: string; label: string; value: string; tone: string } }) {
  const chipSurface =
    chip.tone === "accent"
      ? "border-g/30 bg-g/[0.06]"
      : chip.tone === "danger"
        ? "border-danger/30 bg-danger/[0.06]"
        : chip.tone === "amber"
          ? "border-amber/30 bg-amber/[0.06]"
          : "border-edge bg-card/70";
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${chipSurface}`}>
      <span className="shrink-0 font-display text-base text-g" aria-hidden>
        {chip.icon}
      </span>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-dust">
          {chip.label}
        </p>
        <p className="whitespace-nowrap text-xs font-medium leading-snug text-ink">{chip.value}</p>
      </div>
    </div>
  );
}
