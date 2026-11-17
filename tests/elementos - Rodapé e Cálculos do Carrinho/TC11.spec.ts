import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (
      url.includes("googleads") ||
      url.includes("doubleclick") ||
      url.includes("googlesyndication")
    ) {
      return route.abort();
    }
    return route.continue();
  });
});

// =========================================================
// TEST CASE 11: Verificar Assinatura na Página do Carrinho
// =========================================================
test("TC11: Deve assinar a newsletter na página do carrinho com sucesso", async ({
  page,
}) => {
  await page.goto("/");

  // Navegar para o carrinho antes de assinar
  await page.locator('header a[href="/view_cart"]').click();
  await expect(page).toHaveURL(/.*view_cart/);

  const rodape = page.locator("#footer");
  await rodape.scrollIntoViewIfNeeded();

  await expect(page.locator("h2", { hasText: "Subscription" })).toBeVisible({ timeout: 10000 });

  await page.locator("#susbscribe_email").fill("qa_tester_cart@teste.com");
  await page.locator("#subscribe").click();

  const mensagemSucesso = page.locator("#success-subscribe");
  await expect(mensagemSucesso).toBeVisible({ timeout: 10000 });
  await expect(mensagemSucesso).toHaveText(
    "You have been successfully subscribed!",
  );
});
