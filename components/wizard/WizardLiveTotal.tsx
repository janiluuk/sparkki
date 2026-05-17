"use client";

import { useTranslations } from "next-intl";
import type { WizardLiveTotal } from "@/lib/wizard/wizard-live-total";
import { WizardPrice } from "@/components/wizard/WizardPrice";

type Props = {
  live: WizardLiveTotal;
  compact?: boolean;
};

export function WizardLiveTotalBar({ live, compact = false }: Props) {
  const w = useTranslations("palvelu.wizard");

  if (!live.show) return null;

  return (
    <aside
      className={
        compact
          ? "shrink-0 text-right"
          : "mx-auto mt-4 flex max-w-4xl flex-wrap items-end justify-between gap-3 rounded-xl border border-g/25 bg-g/[0.06] px-4 py-3"
      }
      aria-live="polite"
      aria-atomic="true"
      data-testid="wizard-live-total"
    >
      <div className={compact ? "text-right" : "min-w-0"}>
        <p
          className={
            compact
              ? "text-[10px] font-semibold uppercase tracking-wide text-fog"
              : "text-xs font-semibold uppercase tracking-wide text-fog"
          }
        >
          {w("liveTotalLabel")}
        </p>
        {!live.complete ? (
          <p className="mt-0.5 text-[11px] font-light leading-snug text-fog">
            {w("liveTotalIncomplete")}
          </p>
        ) : (
          <p className="mt-0.5 text-[11px] font-light text-fog">
            {w("liveTotalVatNote")}
          </p>
        )}
      </div>
      <WizardPrice
        variant={compact ? "card" : "total"}
        cents={live.totalCents}
        decimals={2}
        className={compact ? "text-2xl" : "shrink-0"}
      />
    </aside>
  );
}
