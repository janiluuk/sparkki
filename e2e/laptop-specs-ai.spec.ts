import { expect, test } from "@playwright/test";
import { disconnectPrismaE2e, skipAdminE2eIfNoDatabase } from "./db-availability";

test.beforeAll(async ({}, testInfo) => {
  await skipAdminE2eIfNoDatabase(testInfo);
});

test.afterAll(async () => {
  await disconnectPrismaE2e();
});

type MockCase = {
  name: string;
  make: string;
  model: string;
  summaryFi: string;
  specUrl: string;
};

const CASES: MockCase[] = [
  {
    name: "ThinkPad X1",
    make: "Lenovo",
    model: "ThinkPad X1 Carbon Gen 9",
    summaryFi:
      "Lenovo ThinkPad X1 Carbon on kevyt 14\" yrityskannettava. Tyypillisesti Intel 11. sukupolven suoritin, IR-kamera ja laajat liitännät (Thunderbolt). RAM ja SSD ovat usein kiinni emolevyllä tai yksi M.2-paikka.",
    specUrl: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_X1_Carbon_Gen_9/ThinkPad_X1_Carbon_Gen_9_Spec.PDF",
  },
  {
    name: "MacBook 2015",
    make: "Apple",
    model: "MacBook 12-inch 2015",
    summaryFi:
      "Vuoden 2015 12\" MacBook (Retina) käytti usein Intel Core M -sarjaa, yhden USB-C-portin ja passiivista jäähdytystä. Muisti ja tallennus olivat juotettuja — laajennus rajallinen.",
    specUrl: "https://support.apple.com/kb/SP715",
  },
  {
    name: "Dell XPS 2015",
    make: "Dell",
    model: "XPS 13 9350 2015",
    summaryFi:
      "Dell XPS 13 9350 (n. 2015) on kompakti 13\" ultrabook InfinityEdge-näytöllä. Tyypillisesti Intel Core i5/i7 (6. sukupolvi), M.2 SSD ja juotettu RAM useimmissa kokoonpanoissa.",
    specUrl: "https://www.dell.com/support/manuals/en-us/xps-13-9350-laptop",
  },
];

async function loginAdmin(page: import("@playwright/test").Page) {
  const login =
    process.env.ADMIN_LOGIN ?? process.env.ADMIN_EMAIL ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "changeme";
  await page.goto("/admin/login", { waitUntil: "networkidle" });
  await page.locator("#email").fill(login);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /Kirjaudu|Sign in/i }).click();
  await expect(page).toHaveURL(/\/admin$/, { timeout: 25_000 });
}

test.describe("admin laptop specs (AI response mocked)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/public/laptop-specs", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }
      let body: { make?: string; model?: string };
      try {
        const raw = route.request().postData();
        body = (raw ? JSON.parse(raw) : {}) as typeof body;
      } catch {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ ok: false, code: "invalid_input" }),
        });
        return;
      }
      const mk = (body.make ?? "").trim().toLowerCase();
      const md = (body.model ?? "").trim().toLowerCase();
      const chosen = CASES.find(
        (x) => x.make.toLowerCase() === mk && x.model.toLowerCase() === md,
      );
      if (!chosen) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            summary: "E2E: tuntematon malli (mock).",
            specUrl: "https://notebookcheck.net/",
          }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          summary: chosen.summaryFi,
          specUrl: chosen.specUrl,
        }),
      });
    });
  });

  for (const c of CASES) {
    test(`shows specs card for ${c.name}`, async ({ page }) => {
      test.setTimeout(60_000);
      await loginAdmin(page);
      await page.goto("/admin/ai-testing", { waitUntil: "networkidle" });
      await expect(
        page.getByRole("heading", { name: /AI Testing/i }),
      ).toBeVisible();

      await page.getByTestId("admin-laptop-specs-make").fill(c.make);
      await page.getByTestId("admin-laptop-specs-model").fill(c.model);
      await page.getByTestId("admin-laptop-specs-submit").click();

      await expect(page.getByTestId("laptop-specs-summary")).toBeVisible({
        timeout: 15_000,
      });
      await expect(page.getByTestId("laptop-specs-summary")).toContainText(
        c.summaryFi.slice(0, 40),
        { timeout: 5_000 },
      );
      const link = page.getByTestId("laptop-specs-external-link");
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", c.specUrl);
    });
  }
});
