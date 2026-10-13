import { expect, test } from "@playwright/test";

for (const appearance of ["light", "dark"] as const) {
  for (const width of [360, 430, 768, 1280, 1440]) {
    test(`hero fits ${width}px in ${appearance} appearance`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      await page.emulateMedia({ colorScheme: appearance, reducedMotion: "reduce" });
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveClass(/dark/);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("BactoAI");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      for (const name of ["See the Demo", "Request a Pilot"]) {
        const box = await page.locator(".hero-actions").getByRole("link", { name }).boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(48);
      }
      const hero = await page.locator(".bacto-hero").boundingBox();
      expect((hero?.y ?? 0) + (hero?.height ?? 0)).toBeLessThan(width < 768 ? 774 : 900);
    });
  }
}

test("deferred demo loads and lands on its results section from either anchor entry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".deferred-demo [aria-busy=true]")).toHaveCount(1);
  await page.getByRole("link", { name: "See the Demo", exact: true }).click();
  await expect(page.locator("#demo h2")).toBeVisible({ timeout: 20000 });
  await expect
    .poll(async () => (await page.locator("#demo").boundingBox())?.y, { timeout: 20000 })
    .toBeLessThan(200);
  await page.goto("/#demo", { waitUntil: "networkidle" });
  await expect(page.locator("#demo h2")).toBeVisible({ timeout: 20000 });
  await expect
    .poll(async () => (await page.locator("#demo").boundingBox())?.y, { timeout: 20000 })
    .toBeLessThan(200);
});
