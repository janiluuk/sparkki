import { expect, test } from "@playwright/test";
import { disconnectPrismaE2e, skipAdminE2eIfNoDatabase } from "./db-availability";

test.beforeAll(async ({ }, testInfo) => {
  await skipAdminE2eIfNoDatabase(testInfo);
});

test.afterAll(async () => {
  await disconnectPrismaE2e();
});

test("admin login reaches dashboard", async ({ page }) => {
  const login =
    process.env.ADMIN_LOGIN ?? process.env.ADMIN_EMAIL ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "changeme";

  await page.goto("/admin/login", { waitUntil: "networkidle" });
  await page.locator("#email").fill(login);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /Kirjaudu|Sign in/i }).click();

  await expect(page).toHaveURL(/\/admin$/, { timeout: 25_000 });
  await expect(
    page.getByRole("heading", { name: /Etusivu/i }),
  ).toBeVisible();
  await expect(page.getByText(/Tervetuloa/)).toBeVisible();
});
