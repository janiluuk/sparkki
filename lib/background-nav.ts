/** Dispatched when the user navigates in-site; BackgroundCanvas listens (subtle reaction). */
export const VERSO_BG_NAV_EVENT = "verso-bg-navigate";

export type VersoBgNavDetail = { strength?: number };

export function dispatchBackgroundNavInteraction(
  detail: VersoBgNavDetail = {},
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<VersoBgNavDetail>(VERSO_BG_NAV_EVENT, {
      detail: { strength: detail.strength ?? 1 },
    }),
  );
}
