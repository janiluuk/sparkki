import { describe, expect, it } from "vitest";
import { POST as checkoutPost } from "@/app/api/checkout/route";

describe("POST /api/checkout validation", () => {
  it("returns 400 for invalid JSON body", async () => {
    const res = await checkoutPost(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await checkoutPost(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(400);
    const j = (await res.json()) as { error?: string };
    expect(j.error).toBe("validation_error");
  });
});
