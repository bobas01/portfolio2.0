import { expect, test } from "@playwright/test";

test("le panda ouvre une pancarte puis revient sur le chemin", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Compris" }).click();
  await page.keyboard.down("ArrowRight");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.up("ArrowRight");

  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page.getByRole("heading", { name: "À propos" })).toBeVisible();
  await expect(page.getByRole("link", { name: /wa\.me|WhatsApp/ })).toHaveCount(0);

  await page.getByRole("button", { name: "Continuer le voyage" }).click();
  await expect(page.getByRole("button", { name: "Marcher vers la droite" })).toBeVisible();
});
