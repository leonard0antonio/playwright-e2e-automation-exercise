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
// TEST CASE 14: Comprar - Registrar DURANTE o Checkout
// =========================================================
test("TC14: Deve adicionar ao carrinho, registrar no checkout e finalizar compra", async ({
  page,
}) => {
  await page.goto("https://automationexercise.com/");

  // 1. Adicionar produto ao carrinho e ir para o carrinho
  await page.locator(".product-image-wrapper").first().hover();
  await page.locator(".add-to-cart").first().click();
  await page.locator('#cartModal a[href="/view_cart"]').click();

  // 2. Tentar fazer Checkout (como não estamos logados, ele vai pedir)
  await page.locator(".check_out").click();

  // 3. Clicar em 'Register / Login' no modal que aparece
  await page.locator('#checkoutModal a[href="/login"]').click();

  // 4. Fluxo rápido de Cadastro (Usando e-mail dinâmico para não falhar)
  const emailAleatorio = `qa_checkout_${Date.now()}@teste.com`;
  await page.locator('[data-qa="signup-name"]').fill("QA Comprador");
  await page.locator('[data-qa="signup-email"]').fill(emailAleatorio);
  await page.locator('[data-qa="signup-button"]').click();

  await page.locator("#id_gender1").check();
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
  await page.locator('[data-qa="continue-button"]').click(); // Voltar para a loja logado

  // 5. Retornar ao carrinho e prosseguir para Checkout novamente
  await page.locator('header a[href="/view_cart"]').click();
  await page.locator(".check_out").click();

  // 6. Validar página de Checkout e adicionar comentário
  await expect(
    page.locator("h2", { hasText: "Address Details" }),
  ).toBeVisible();
  await page
    .locator('textarea[name="message"]')
    .fill("Entregar em horário comercial, por favor.");
  await page.locator('a[href="/payment"]').click();

  // 7. Preencher dados fictícios de Cartão de Crédito
  await page.locator('[data-qa="name-on-card"]').fill("QA COMPRADOR");
  await page.locator('[data-qa="card-number"]').fill("1234567890123456");
  await page.locator('[data-qa="cvc"]').fill("123");
  await page.locator('[data-qa="expiry-month"]').fill("12");
  await page.locator('[data-qa="expiry-year"]').fill("2030");

  // 8. Confirmar Pagamento e Validar Sucesso
  await page.locator('[data-qa="pay-button"]').click();
  await expect(page.locator('[data-qa="order-placed"]')).toBeVisible();
  await expect(page.locator('[data-qa="order-placed"]')).toHaveText(
    "Order Placed!",
  );
});
