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
// TEST CASE 1: Cadastro Completo
// =========================================================
test("Deve registrar um novo usuário com sucesso", async ({ page }) => {
  await page.goto("https://automationexercise.com/");

  await page.locator('a[href="/login"]').click();

  const emailAleatorio = `qa_tester_${Date.now()}@teste.com`;
  await page.locator('[data-qa="signup-name"]').fill("QA Tester");
  await page.locator('[data-qa="signup-email"]').fill(emailAleatorio);
  await page.locator('[data-qa="signup-button"]').click();

  await page.locator("#id_gender1").check();
  await page.locator('[data-qa="password"]').fill("SenhaForte123!");

  await page.locator('[data-qa="days"]').selectOption("15");
  await page.locator('[data-qa="months"]').selectOption("5");
  await page.locator('[data-qa="years"]').selectOption("1990");

  await page.locator("#newsletter").check();
  await page.locator("#optin").check();

  await page.locator('[data-qa="first_name"]').fill("QA");
  await page.locator('[data-qa="last_name"]').fill("Tester");
  await page.locator('[data-qa="address"]').fill("Rua dos Bugs, 404");
  await page.locator('[data-qa="country"]').selectOption("United States");
  await page.locator('[data-qa="state"]').fill("California");
  await page.locator('[data-qa="city"]').fill("Los Angeles");
  await page.locator('[data-qa="zipcode"]').fill("90001");
  await page.locator('[data-qa="mobile_number"]').fill("+1 555 0199");

  await page.locator('[data-qa="create-account"]').click();

  await expect(page.locator('[data-qa="account-created"]')).toBeVisible();
  await expect(page.locator('[data-qa="account-created"]')).toHaveText(
    "Account Created!",
  );
});
