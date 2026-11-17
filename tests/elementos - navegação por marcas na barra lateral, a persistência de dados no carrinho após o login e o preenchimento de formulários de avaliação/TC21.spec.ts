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
// TEST CASE 21: Enviar Avaliação (Review) de Produto
// =========================================================
test("TC21: Deve preencher e enviar uma avaliação de produto com sucesso", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Acessar a página de produtos e clicar no primeiro produto
  await page.locator('header a[href="/products"]').click();
  await page.locator(".choose a").first().click();

  // 2. Validar que a seção 'Write Your Review' está visível
  const formularioAvaliacao = page.locator("#review-form");
  await expect(page.locator('a[href="#reviews"]')).toHaveText(
    "Write Your Review",
  );
  await expect(formularioAvaliacao).toBeVisible({ timeout: 10000 });

  // 3. Preencher o formulário
  await page.locator("#name").fill("QA Tester Review");
  await page.locator("#email").fill("qa_review@teste.com");
  await page
    .locator("#review")
    .fill(
      "Excelente produto, superou as expectativas. O Playwright tornou este teste muito rápido e fácil de fazer.",
    );

  // 4. Enviar a avaliação
  await page.locator("#button-review").click();

  // 5. Validar a mensagem de sucesso "Thank you for your review."
  // O site exibe essa mensagem em um span de sucesso que aparece dinamicamente
  const mensagemSucesso = page.locator(".alert-success.alert span");
  await expect(mensagemSucesso).toBeVisible({ timeout: 10000 });
  await expect(mensagemSucesso).toHaveText("Thank you for your review.");
});
