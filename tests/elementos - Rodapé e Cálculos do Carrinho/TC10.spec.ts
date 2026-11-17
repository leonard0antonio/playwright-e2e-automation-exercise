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
// TEST CASE 10: Verificar Assinatura na Home Page
// =========================================================
test("TC10: Deve assinar a newsletter na página inicial com sucesso", async ({
  page,
}) => {
  await page.goto("/");

  // Rolar até o rodapé (footer)
  const rodape = page.locator("#footer");
  await rodape.scrollIntoViewIfNeeded();

  // Validar se o texto 'SUBSCRIPTION' está visível
  await expect(page.locator("h2", { hasText: "Subscription" })).toBeVisible({ timeout: 10000 });

  // Preencher o e-mail e enviar
  await page.locator("#susbscribe_email").fill("qa_tester_news@teste.com");
  await page.locator("#subscribe").click();

  // Validar a mensagem de sucesso
  const mensagemSucesso = page.locator("#success-subscribe");
  await expect(mensagemSucesso).toBeVisible({ timeout: 10000 });
  await expect(mensagemSucesso).toHaveText(
    "You have been successfully subscribed!",
  );
});
