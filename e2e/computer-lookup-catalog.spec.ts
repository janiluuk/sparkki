import { expect, test } from "@playwright/test";
import {
  mockCatalogOnlyComputerLookupRoute,
  mockComputerLookupRoute,
  mockNoMatchComputerLookupRoute,
} from "./fixtures/computer-lookup";
import { waitForWizardReady } from "./helpers/wizard-flow";

const LOOKUP_WAIT_MS = 700;

async function fillHomeComputer(
  page: import("@playwright/test").Page,
  text: string,
): Promise<void> {
  const computer = page.locator("#home-compat-computer");
  await computer.scrollIntoViewIfNeeded();
  await computer.fill(text);
  await page.waitForTimeout(LOOKUP_WAIT_MS);
}

test.describe("computer-lookup API", () => {
  test("rejects description shorter than 3 characters", async ({ request }) => {
    const res = await request.post("/api/public/computer-lookup", {
      data: { description: "ab", locale: "fi" },
    });
    expect(res.status()).toBe(400);
    const json = (await res.json()) as { ok?: boolean; code?: string };
    expect(json.ok).toBe(false);
    expect(json.code).toBe("invalid_input");
  });

  test("accepts valid payload shape", async ({ request }) => {
    const res = await request.post("/api/public/computer-lookup", {
      data: {
        description: "Lenovo ThinkPad T450",
        locale: "fi",
        includeWebSpecs: false,
      },
    });
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as { ok?: boolean; result?: unknown };
    expect(json.ok).toBe(true);
    expect(json.result).toBeTruthy();
  });
});

test.describe("home compatibility checker (catalog mocked)", () => {
  test("shows catalog CPU/RAM rows without web hint", async ({ page }) => {
    await mockCatalogOnlyComputerLookupRoute(page);
    let laptopSpecsCalls = 0;
    await page.route("**/api/public/laptop-specs", async (route) => {
      laptopSpecsCalls += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          summary: "Should not be used on home checker.",
          specUrl: "https://example.com/spec",
        }),
      });
    });

    await page.goto("/fi#yhteensopivuus", { waitUntil: "domcontentloaded" });
    await fillHomeComputer(page, "Dell XPS 13");

    const visual = page.getByTestId("computer-lookup-visual");
    await expect(visual).toBeVisible({ timeout: 10_000 });
    await expect(visual.getByText(/Intel Core i5 8th Gen/i)).toBeVisible();
    await expect(visual.getByText(/256GB SSD/i)).toBeVisible();
    await expect(page.getByTestId("home-web-specs-hint")).toHaveCount(0);
    await expect(page.getByTestId("home-no-match-notice")).toBeVisible();
    expect(laptopSpecsCalls).toBe(0);
  });

  test("verified match and catalog reference in spec table", async ({ page }) => {
    await mockComputerLookupRoute(page);
    await page.goto("/fi#yhteensopivuus", { waitUntil: "domcontentloaded" });
    await fillHomeComputer(page, "Lenovo ThinkPad T450");

    const visual = page.getByTestId("computer-lookup-visual");
    await expect(visual).toBeVisible({ timeout: 10_000 });
    await expect(visual.getByRole("heading", { name: /Lenovo ThinkPad T450/i })).toBeVisible();
    await expect(visual.getByText(/Intel Core i5-4300U/i)).toBeVisible();
    await expect(page.getByTestId("home-web-specs-hint")).toHaveCount(0);
  });

  test("unknown model shows no-match notice without catalog rows", async ({
    page,
  }) => {
    await mockNoMatchComputerLookupRoute(page);
    await page.goto("/fi#yhteensopivuus", { waitUntil: "domcontentloaded" });
    await fillHomeComputer(page, "Obscure Brand X999");

    await expect(page.getByTestId("home-no-match-notice")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("computer-lookup-visual")).toHaveCount(0);
  });
});

test.describe("order wizard computer step (catalog mocked)", () => {
  test("shows catalog reference specs before leaving step 1", async ({ page }) => {
    await mockCatalogOnlyComputerLookupRoute(page);
    await page.goto("/fi/tilaa", { waitUntil: "domcontentloaded" });
    await waitForWizardReady(page);

    const w = page.getByTestId("order-wizard");
    await w.locator("#wiz-computer").fill("Dell XPS 13");
    await page.waitForTimeout(LOOKUP_WAIT_MS);

    const visual = w.getByTestId("computer-lookup-visual");
    await expect(visual).toBeVisible({ timeout: 10_000 });
    await expect(visual.getByText(/Intel Core i5 8th Gen/i)).toBeVisible();
    await expect(visual.getByText(/8GB/i)).toBeVisible();
  });
});
