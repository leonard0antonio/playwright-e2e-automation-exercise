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
    await page.goto('https://automationexercise.com/');
    await page.locator('a[href="/login"]').click();
    
    await expect(page.locator('.login-form h2')).toHaveText('Login to your account');

    // Inserindo dados falsos
    await page.locator('[data-qa="login-email"]').fill('email_errado@teste.com');
    await page.locator('[data-qa="login-password"]').fill('senha_errada');
    await page.locator('[data-qa="login-button"]').click();

    // Validar a mensagem de erro específica
    const mensagemErro = page.locator('.login-form p');
    await expect(mensagemErro).toBeVisible();
    await expect(mensagemErro).toHaveText('Your email or password is incorrect!');
  });