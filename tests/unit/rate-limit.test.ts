import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests up to max within the window", () => {
    const key = `rl-test-${Math.random()}`;
    expect(checkRateLimit(key, { windowMs: 60_000, max: 3 })).toBe(true);
    expect(checkRateLimit(key, { windowMs: 60_000, max: 3 })).toBe(true);
    expect(checkRateLimit(key, { windowMs: 60_000, max: 3 })).toBe(true);
  });

  it("rejects when max is exceeded", () => {
    const key = `rl-test-${Math.random()}`;
    expect(checkRateLimit(key, { windowMs: 60_000, max: 2 })).toBe(true);
    expect(checkRateLimit(key, { windowMs: 60_000, max: 2 })).toBe(true);
    expect(checkRateLimit(key, { windowMs: 60_000, max: 2 })).toBe(false);
  });
});
