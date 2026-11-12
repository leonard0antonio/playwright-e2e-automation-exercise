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
// TEST CASE 7: Verificar a página de Test Cases
// =========================================================
test("TC07: Deve acessar a página de Casos de Teste com sucesso", async ({
  page,
}) => {
  await page.goto("https://automationexercise.com/");

  // Clicar no botão 'Test Cases' no cabeçalho
  await page.locator('header a[href="/test_cases"]').click();

  // Validar se o usuário foi redirecionado corretamente
  await expect(page).toHaveURL(/.*test_cases/);
  await expect(page.locator("h2 b").first()).toHaveText("Test Cases");
});
