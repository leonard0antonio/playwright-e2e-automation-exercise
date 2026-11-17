import { test, expect } from "@playwright/test";
import { registerNewUser } from "../utils/test-helpers";

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
  await page.goto("/");
  await page.locator('a[href="/login"]').click({ timeout: 60000 });

  await expect(page.locator(".signup-form h2")).toHaveText("New User Signup!", { timeout: 60000 });

  // Primeiro, registrar um usuário
  const email = await registerNewUser(page);

  // Fazer logout
  await page.locator('a[href="/logout"]').click({ timeout: 60000 });
  await expect(page).toHaveURL(/.*login/, { timeout: 60000 });

  // Tentar registrar com o mesmo e-mail
  await page.locator('[data-qa="signup-name"]').fill("QA Tester", { timeout: 60000 });
  await page.locator('[data-qa="signup-email"]').fill(email, { timeout: 60000 });
  await page.locator('[data-qa="signup-button"]').click({ timeout: 60000 });

  // Validar a mensagem de erro
  const mensagemErroSignup = page.locator(".signup-form p");
  await expect(mensagemErroSignup).toBeVisible({ timeout: 60000 });
  await expect(mensagemErroSignup).toHaveText("Email Address already exist!");
});
