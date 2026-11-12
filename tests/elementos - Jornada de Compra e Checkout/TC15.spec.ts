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
// TEST CASE 15: Comprar - Registrar ANTES do Checkout
// =========================================================
test("TC15: Deve registrar conta primeiro e depois finalizar compra", async ({
  page,
}) => {
  await page.goto("https://automationexercise.com/");

  // 1. Cadastrar primeiro
  await page.locator('header a[href="/login"]').click();
  const emailAleatorio = `qa_checkout_pre_${Date.now()}@teste.com`;
  await page.locator('[data-qa="signup-name"]').fill("QA Pre Cadastro");
  await page.locator('[data-qa="signup-email"]').fill(emailAleatorio);
  await page.locator('[data-qa="signup-button"]').click();

  await page.locator('[data-qa="password"]').fill("SenhaForte123!");
  await page.locator('[data-qa="first_name"]').fill("QA");
  await page.locator('[data-qa="last_name"]').fill("Tester");
  await page.locator('[data-qa="address"]').fill("Rua dos Bugs, 404");
  await page.locator('[data-qa="country"]').selectOption("United States");
  await page.locator('[data-qa="state"]').fill("CA");
  await page.locator('[data-qa="city"]').fill("Los Angeles");
  await page.locator('[data-qa="zipcode"]').fill("90001");
  await page.locator('[data-qa="mobile_number"]').fill("5551234");
  await page.locator('[data-qa="create-account"]').click();
  await page.locator('[data-qa="continue-button"]').click();

  // 2. Já logado, adicionar produto ao carrinho
  await page.locator('header a[href="/products"]').click();
  await page.locator(".product-image-wrapper").first().hover();
  await page.locator(".add-to-cart").first().click();
  await page.locator('#cartModal a[href="/view_cart"]').click();

  // 3. Fazer Checkout direto (não pedirá login)
  await page.locator(".check_out").click();
  await page
    .locator('textarea[name="message"]')
    .fill("Compra com conta pré-registrada.");
  await page.locator('a[href="/payment"]').click();

  // 4. Pagamento e Confirmação
  await page.locator('[data-qa="name-on-card"]').fill("QA PRE CADASTRO");
  await page.locator('[data-qa="card-number"]').fill("9876543210987654");
  await page.locator('[data-qa="cvc"]').fill("987");
  await page.locator('[data-qa="expiry-month"]').fill("05");
  await page.locator('[data-qa="expiry-year"]').fill("2028");
  await page.locator('[data-qa="pay-button"]').click();

  await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();

  // (Opcional) Limpar a base de dados deletando a conta ao final
  await page.locator('header a[href="/delete_account"]').click();
  await expect(page.locator('[data-qa="account-deleted"]')).toBeVisible();
});
