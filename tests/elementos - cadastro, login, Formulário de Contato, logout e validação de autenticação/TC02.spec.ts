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
// TEST CASE 2: Login com e-mail e senha corretos
// =========================================================
test("TC02: Deve fazer login com credenciais válidas", async ({ page }) => {
  await page.goto("/");

  // Primeiro, registrar um novo usuário para garantir que existe
  const email = await registerNewUser(page);

  // Fazer logout para testar o login
  await page.locator('a[href="/logout"]').click();
  await expect(page).toHaveURL(/.*login/);

  // Passo 3: Validar que a home carregou
  await expect(page.locator("body")).toBeVisible();

  // Passo 4: Clicar no botão 'Signup / Login'
  await page.locator('a[href="/login"]').click();

  // Passo 5: Validar que "Login to your account" está visível
  await expect(page.locator(".login-form h2")).toHaveText(
    "Login to your account",
  );

  // Passo 6: Inserir e-mail e senha da conta recém-criada
  await loginUser(page, email);

  // Passo 8: Validar que "Logged in as [nome]" está visível
  const usuarioLogado = page.locator("text=Logged in as");
  await expect(usuarioLogado).toBeVisible();
});
