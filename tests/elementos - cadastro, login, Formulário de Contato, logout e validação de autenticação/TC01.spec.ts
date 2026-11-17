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
// TEST CASE 1: Cadastro Completo
// =========================================================
test("Deve registrar um novo usuário com sucesso", async ({ page }) => {
  await page.goto("/");

  await page.locator('a[href="/login"]').click();

  await registerNewUser(page);
});
