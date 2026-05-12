import { expect, test } from "@playwright/test";

function e2eOrigin(): string {
  return process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:1337";
}

test.describe("order wizard (checkout mocked)", () => {
  test.beforeEach(async ({ page }) => {
    const origin = e2eOrigin();
    await page.route("**/api/checkout", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: `${origin}/fi/palvelu/kiitos?session_id=e2e_mock`,
          orderId: "e2e_order",
        }),
      });
    });

    await page.route("**/api/public/laptop-specs", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: false }),
      });
    });

    await page.route("**/api/compatibility", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "compatible",
          reasons: ["ssd_upgrade_strongly_recommended"],
          speedGainEstimate: "3–10×",
        }),
      });
    });
  });

  test("completes wizard and lands on thank-you (generic without paid Stripe session)", async ({
    page,
  }) => {
    test.setTimeout(60_000);

    await page.goto("/fi/palvelu", { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", { name: /Tilaus|Order/i }),
    ).toBeVisible();

    const wizard = page.getByTestId("order-wizard");

    await wizard.locator("#wiz-make").fill("Lenovo");
    await wizard.locator("#wiz-model").fill("ThinkPad T450");
    await expect(wizard.locator("#wiz-make")).toHaveValue("Lenovo");
    await expect(wizard.locator("#wiz-model")).toHaveValue("ThinkPad T450");
    await expect(wizard.getByRole("button", { name: "Seuraava" })).toBeEnabled({
      timeout: 15_000,
    });
    await wizard.getByRole("button", { name: "Seuraava" }).click();
    await expect(wizard.getByText(/Vaihe 2\s*\/\s*6/)).toBeVisible({
      timeout: 20_000,
    });

    await expect(
      wizard.getByRole("heading", { name: "Yhteensopivuus", exact: true }),
    ).toBeVisible({ timeout: 15_000 });
    const runEstimate = wizard.getByRole("button", { name: "Laske arvio" });
    await runEstimate.scrollIntoViewIfNeeded();
    await runEstimate.click();
    await expect(
      wizard.getByText("Sopii hyvin päivitykseen", { exact: false }),
    ).toBeVisible({ timeout: 20_000 });
    await wizard.getByRole("button", { name: "Seuraava" }).click();

    await wizard.getByRole("button", { name: "SSD-perus" }).click();
    await wizard.getByRole("button", { name: "Ei kiitos" }).click();
    await wizard.getByRole("button", { name: "Seuraava" }).click();

    await wizard.getByRole("button", { name: "Nouto kotoa" }).click();
    await wizard.getByRole("button", { name: "Seuraava" }).click();

    await wizard
      .getByRole("button", { name: "Täysi tuki (puhelin + sähköposti)" })
      .click();
    await wizard.locator("#wiz-name").fill("E2E Testaaja");
    await wizard.locator("#wiz-email").fill("e2e-wizard@example.com");
    await wizard.getByRole("button", { name: "Seuraava" }).click();

    await expect(
      wizard.getByRole("heading", { name: "Yhteenveto", exact: true }),
    ).toBeVisible();
    await wizard.getByRole("button", { name: "Siirry maksamaan" }).click();

    await page.waitForURL(/\/fi\/palvelu\/kiitos/, { timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Kiitos!", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(/Jos maksu on kesken|palaa tilaussivulle/i),
    ).toBeVisible();
  });
});
