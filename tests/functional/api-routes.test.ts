import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";
import { POST as checkoutPost } from "@/app/api/checkout/route";

describe("API route handlers", () => {
  it("GET /api/health returns JSON ok", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe("verso");
  });

  it("POST /api/checkout returns 503 without Stripe when body is valid", async () => {
    const res = await checkoutPost(
      new Request("http://localhost/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "SSD_BASIC",
          supportTier: "FULL",
          deliveryMethod: "HOME_PICKUP",
          customerName: "Test",
          customerEmail: "test@example.com",
          locale: "fi",
        }),
      }),
    );
    expect(res.status).toBe(503);
  });
});
