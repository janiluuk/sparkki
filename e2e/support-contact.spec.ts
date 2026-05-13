import { expect, test } from "@playwright/test";

test.describe("support contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/public/support-contact", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
  });

  test("FI: submit write channel shows thank-you status", async ({ page }) => {
    await page.goto("/fi/tuki", { waitUntil: "domcontentloaded" });

    await page.getByRole("tab", { name: "Kirjoita viesti" }).click();
    await page.locator("#sup-msg").fill("E2E: test message from Playwright.");
    await page.locator("#sup-contact").fill("e2e-support@example.com");
    await page.getByRole("button", { name: "Lähetä" }).click();

    await expect(
      page.getByText(/Kiitos! Viesti lähetettiin/i),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("EN: submit write channel shows thank-you status", async ({ page }) => {
    await page.goto("/en/tuki", { waitUntil: "domcontentloaded" });

    await page.getByRole("tab", { name: "Write a message" }).click();
    await page.locator("#sup-msg").fill("E2E: English support test.");
    await page.locator("#sup-contact").fill("e2e-en@example.com");
    await page.getByRole("button", { name: "Send" }).click();

    await expect(
      page.getByText(/Thanks! Your message was sent/i),
    ).toBeVisible({ timeout: 10_000 });
  });
});
