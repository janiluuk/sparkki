"use client";

import dynamic from "next/dynamic";

/** 2D drifting symbols — client-only (canvas); sits behind `BackgroundCanvas` (-z-20 vs -z-10). */
export const SparkiBackgroundDynamic = dynamic(
  () =>
    import("./SparkiBackground").then((mod) => ({
      default: mod.SparkiBackground,
    })),
  { ssr: false, loading: () => null },
);
