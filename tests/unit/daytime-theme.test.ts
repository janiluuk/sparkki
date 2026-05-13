import { describe, expect, it } from "vitest";
import { getDaytimeBrightness } from "@/lib/site/daytime-theme";

describe("daytime-theme", () => {
  it("is bright around noon and darker in late evening", () => {
    const noon = getDaytimeBrightness(new Date("2026-06-15T12:00:00"));
    const evening = getDaytimeBrightness(new Date("2026-06-15T19:00:00"));
    const night = getDaytimeBrightness(new Date("2026-06-15T23:00:00"));
    expect(noon).toBe(1);
    expect(evening).toBeLessThan(noon);
    expect(night).toBeLessThan(evening);
  });
});
