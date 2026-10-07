import { expect, test } from "@playwright/test";
import { contrastRatio } from "../src/lib/contrast";

for (const appearance of ["light", "dark"] as const) {
  test(`${appearance} device appearance survives reloads and navigation`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: appearance, reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(new RegExp(appearance));
    await page.evaluate(
      (theme) => localStorage.setItem("bactoai-theme", theme),
      appearance === "light" ? "dark" : "light",
    );
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(new RegExp(appearance));
    await page.locator("header").getByRole("link", { name: "Technology", exact: true }).click();
    await expect(page).toHaveURL(/\/technology$/);
    await expect(page.locator("html")).toHaveClass(new RegExp(appearance));
    const changed = appearance === "light" ? "dark" : "light";
    await page.emulateMedia({ colorScheme: changed });
    await expect(page.locator("html")).toHaveClass(new RegExp(changed));
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(new RegExp(changed));
    await expect(page.getByRole("button", { name: /Switch to (light|dark) mode/ })).toHaveCount(0);
  });

  test(`${appearance} controls have readable text and visible keyboard focus`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: appearance, reducedMotion: "reduce" });
    await page.goto("/contact", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveClass(new RegExp(appearance));
    const ratios = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const token = (name: string) => styles.getPropertyValue(name).trim();
      return {
        foreground: token("--foreground"),
        background: token("--background"),
        primaryText: token("--primary-text"),
        card: token("--card"),
        ring: token("--ring"),
        input: token("--input"),
      };
    });
    expect(contrastRatio(ratios.foreground, ratios.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ratios.primaryText, ratios.card)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(ratios.ring, ratios.background)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(ratios.input, ratios.background)).toBeGreaterThanOrEqual(3);
    const name = page.getByLabel("Full name", { exact: true });
    await name.focus();
    await page.keyboard.press("Tab");
    const email = page.getByLabel("Work email", { exact: true });
    await expect(email).toBeFocused();
    await expect(email).toHaveCSS("outline-style", "solid");
    await expect(email).toHaveCSS("outline-width", "3px");
    const newsletter = page.getByRole("textbox", { name: "Newsletter email address" });
    const textColors = await newsletter.evaluate((el) => {
      const styles = getComputedStyle(el);
      return { foreground: styles.color, background: styles.backgroundColor };
    });
    expect(contrastRatio(textColors.foreground, textColors.background)).toBeGreaterThanOrEqual(4.5);
  });
}
