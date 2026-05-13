"use client";

import { useEffect } from "react";
import { applyDaytimeCssVars } from "@/lib/site/daytime-theme";

const TICK_MS = 60_000;

/** Updates :root CSS background tokens from the viewer's local clock (darker in the evening). */
export function DaytimeTheme() {
  useEffect(() => {
    const root = document.documentElement;

    function tick() {
      applyDaytimeCssVars(root);
    }

    tick();
    const id = window.setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  return null;
}
