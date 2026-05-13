/** Curated optional app packs at service checkout (ROADMAP Phase 5). */

export const APP_BUNDLE_ORDER = [
  "local_ai",
  "media_creator",
  "music_production",
  "developer_essentials",
] as const;

export type AppBundleId = (typeof APP_BUNDLE_ORDER)[number];

/** Zod `z.enum` tuple — same order as `APP_BUNDLE_ORDER`. */
export const APP_BUNDLE_ZOD_ENUM = APP_BUNDLE_ORDER as unknown as [
  AppBundleId,
  ...AppBundleId[],
];

/** Short labels for confirmation email & admin (Stripe line items use longer copy). */
export const APP_BUNDLE_CONFIRM_LABEL: Record<
  AppBundleId,
  { fi: string; en: string }
> = {
  local_ai: {
    fi: "Paikallinen AI (LLM ja työkalut)",
    en: "Local AI (LLM and tools)",
  },
  media_creator: {
    fi: "Mediankäsittelypaketti",
    en: "Media creator pack",
  },
  music_production: {
    fi: "Musiikkituotantopaketti",
    en: "Music production pack",
  },
  developer_essentials: {
    fi: "Kehittäjän peruspaketti",
    en: "Developer essentials",
  },
};

/** EUR cents per pack (installed/configured as part of fulfillment). */
export const APP_BUNDLE_CENTS: Record<AppBundleId, number> = {
  local_ai: 45_00,
  media_creator: 35_00,
  music_production: 35_00,
  developer_essentials: 25_00,
};

export function isAppBundleId(v: string): v is AppBundleId {
  return (APP_BUNDLE_ORDER as readonly string[]).includes(v);
}

export function normalizeAppBundleIds(ids: string[]): AppBundleId[] {
  const seen = new Set<string>();
  const out: AppBundleId[] = [];
  for (const raw of ids) {
    const id = raw.trim();
    if (!isAppBundleId(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export function appBundlesAddonCents(ids: readonly AppBundleId[]): number {
  return ids.reduce((sum, id) => sum + APP_BUNDLE_CENTS[id], 0);
}
