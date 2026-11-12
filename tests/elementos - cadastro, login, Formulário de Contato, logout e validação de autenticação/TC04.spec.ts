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
// TEST CASE 4: Logout do usuário
// =========================================================
test("TC04: Deve fazer logout e voltar para a tela de login", async ({
  page,
}) => {
  await page.goto("https://automationexercise.com/");
  await page.locator('a[href="/login"]').click();

  // Fazemos o login primeiro
  await page
    .locator('[data-qa="login-email"]')
    .fill("qa_tester_valido@teste.com");
  await page.locator('[data-qa="login-password"]').fill("SenhaForte123!");
  await page.locator('[data-qa="login-button"]').click();

  await expect(page.locator("text=Logged in as")).toBeVisible();

  // Clicar no botão 'Logout'
  await page.locator('a[href="/logout"]').click();

  // Validar que o usuário foi redirecionado para a página de login
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator(".login-form h2")).toBeVisible();
});
