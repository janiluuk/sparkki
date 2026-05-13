import { expect, test } from "@playwright/test";

const MOCK_SERVICE_ORDER = {
  ok: true,
  order: {
    kind: "service",
    id: "e2e_lookup_order_01",
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-01-10T12:30:00.000Z",
    status: "CONFIRMED",
    tier: "SSD_BASIC",
    supportTier: "EMAIL",
    deliveryMethod: "HOME_PICKUP",
    computerMake: "Lenovo",
    computerModel: "ThinkPad T450",
    customerName: "E2E Customer",
    customerEmail: "lookup@example.com",
    customerPhone: null,
    address: null,
    preferredDate: null,
    notes: null,
    priceEur: 19_900,
    dataMigration: false,
    dataMigrationSize: null,
    appBundleIds: [],
    portableVmAddon: false,
    portableVmHandoff: null,
  },
} as const;

test.describe("public order lookup", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/public/order-lookup", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SERVICE_ORDER),
      });
    });
  });

  test("hub: shows service order summary after lookup", async ({ page }) => {
    await page.goto("/fi/tilaus", { waitUntil: "domcontentloaded" });

    await page.locator("#track-order-id").fill("e2e_lookup_order_01");
    await page.locator("#track-email").fill("lookup@example.com");
    await page.getByRole("button", { name: "Näytä tilaus" }).click();

    await expect(
      page.getByRole("heading", { name: "Palvelutilaus", exact: true }),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("e2e_lookup_order_01")).toBeVisible();
    await expect(page.getByText("SSD-perus")).toBeVisible();
  });
});
