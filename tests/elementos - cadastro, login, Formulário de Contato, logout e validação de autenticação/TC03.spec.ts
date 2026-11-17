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
// TEST CASE 3: Login com e-mail e senha incorretos
// =========================================================
test('TC03: Deve exibir erro ao tentar logar com credenciais inválidas', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/login"]').click({ timeout: 60000 });
    
    await expect(page.locator('.login-form h2')).toHaveText('Login to your account', { timeout: 60000 });

    // Inserindo dados falsos
    await page.locator('[data-qa="login-email"]').fill('email_errado@teste.com', { timeout: 60000 });
    await page.locator('[data-qa="login-password"]').fill('senha_errada', { timeout: 60000 });
    await page.locator('[data-qa="login-button"]').click({ timeout: 60000 });

    // Validar a mensagem de erro específica
    const mensagemErro = page.locator('.login-form p');
    await expect(mensagemErro).toBeVisible({ timeout: 60000 });
    await expect(mensagemErro).toHaveText('Your email or password is incorrect!');
  });