import { test, expect } from "@playwright/test";
import { registerNewUser, loginUser } from "../utils/test-helpers";

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
  await page.goto("/");

  // Primeiro, registrar um novo usuário
  const email = await registerNewUser(page);

  // Fazer logout e login novamente para testar o fluxo completo
  await page.locator('a[href="/logout"]').click();
  await expect(page).toHaveURL(/.*login/);

  // Login novamente
  await loginUser(page, email);
  await expect(page.locator("text=Logged in as")).toBeVisible({ timeout: 10000 });

  // Clicar no botão 'Logout'
  await page.locator('a[href="/logout"]').click();

  // Validar que o usuário foi redirecionado para a página de login
  await expect(page).toHaveURL(/.*login/);
  await expect(page.locator(".login-form h2")).toBeVisible();
});
