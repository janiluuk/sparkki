import { expect, test } from "@playwright/test";

test.describe("home page clarity and structure", () => {
  test("hero pillars show emoji icons and descriptions", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/Tarkistettu päivitys/i)).toBeVisible();
    await expect(page.getByText(/Henkilökohtinen neuvonta/i)).toBeVisible();
    await expect(page.getByText(/Tuki myös jälkeen/i)).toBeVisible();
  });

  test("value benefits section shows all four cards with headings", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 2, name: /Vanha kone, uusi arki/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: /Säästät uutta ostamasta/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: /Moderni ja yksityisempi käyttö/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: /Varmistamme suosituksen/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: /Henkilökohtinen huolenpito/i })).toBeVisible();
  });

  test("speed bar appears before the how-it-works section", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    const speedHeading = page.getByRole("heading", { level: 2, name: /hidas käynnistys/i });
    const howHeading = page.getByRole("heading", { level: 2, name: /Miten tämä toimii/i });

    const speedBox = await speedHeading.boundingBox();
    const howBox = await howHeading.boundingBox();

    expect(speedBox).not.toBeNull();
    expect(howBox).not.toBeNull();
    expect(speedBox!.y).toBeLessThan(howBox!.y);
  });

  test("how-it-works shows all four process steps", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 2, name: /Miten tämä toimii/i }),
    ).toBeVisible();
    await expect(page.getByText(/Tarkistetaan kone ensin/i)).toBeVisible();
    await expect(page.getByText(/Valitaan oikea päivitys/i)).toBeVisible();
    await expect(page.getByText(/Nouto, posti tai oma tuonti/i)).toBeVisible();
    await expect(page.getByText(/Takaisin valmiina käyttöön/i)).toBeVisible();
  });

  test("before-after transformation card is visible", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 3, name: /Miltä muutos tuntuu käytännössä/i }),
    ).toBeVisible();
    await expect(page.getByText(/Hidas käynnistys ja jatkuva odottelu/i)).toBeVisible();
    await expect(page.getByText(/Nopeampi käynnistys ja sujuvampi selaaminen/i)).toBeVisible();
  });

  test("migration FAQ is present and interactive", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 2, name: /Tiedonsiirto vanhasta järjestelmästä/i }),
    ).toBeVisible();
    await page.getByText(/Mitä siirretään\?/i).click();
    await expect(
      page.getByText(/Tiedostot, kuvat, kirjanmerkit/i),
    ).toBeVisible();
  });

  test("pricing section is visible", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 2, name: /Paketit/i }),
    ).toBeVisible();
  });

  test("redundant logistics, backups and support sections are not present", async ({ page }) => {
    await page.goto("/fi", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: /Logistiikka ilman lisästressiä/i }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Varmuuskopiot/i }),
    ).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Tuki, joka tuntuu inhimilliseltä/i }),
    ).not.toBeVisible();
  });

  test("english locale has equivalent clear structure", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { level: 1, name: /Don't buy new/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /Same machine, calmer daily use/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /How it works/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /Packages/i }),
    ).toBeVisible();
  });
});
