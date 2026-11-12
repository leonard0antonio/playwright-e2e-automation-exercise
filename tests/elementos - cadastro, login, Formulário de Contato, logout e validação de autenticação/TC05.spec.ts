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
// TEST CASE 5: Tentar registrar usuário já existente
// =========================================================
test("TC05: Deve exibir erro ao tentar cadastrar e-mail já existente", async ({
  page,
}) => {
  await page.goto("https://automationexercise.com/");
  await page.locator('a[href="/login"]').click();

  await expect(page.locator(".signup-form h2")).toHaveText("New User Signup!");

  // Inserir nome e um e-mail que já sabemos que existe no banco de dados deles
  await page.locator('[data-qa="signup-name"]').fill("QA Tester");
  await page
    .locator('[data-qa="signup-email"]')
    .fill("qa_tester_valido@teste.com");

  await page.locator('[data-qa="signup-button"]').click();

  // Validar a mensagem de erro
  const mensagemErroSignup = page.locator(".signup-form p");
  await expect(mensagemErroSignup).toBeVisible();
  await expect(mensagemErroSignup).toHaveText("Email Address already exist!");
});
