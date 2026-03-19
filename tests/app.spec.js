import { test, expect } from "@playwright/test";

test("basic user flow", async ({ page }) => {
  // Navigate to the app and wait for the network to be idle
  await page.goto("/", { waitUntil: "networkidle" });

  const heroTitle = page.locator("#hero");
  await expect(heroTitle).toHaveText(/iphone 15 pro/i, { timeout: 10000 });
  await expect(heroTitle).toBeVisible({ timeout: 10000 });

  const pricingText = page.getByText(/199.*999/i);
  await expect(pricingText).toBeVisible({ timeout: 10000 });

  const buyButton = page.getByRole("link", { name: /buy/i });
  await expect(buyButton).toBeVisible({ timeout: 10000 });
});