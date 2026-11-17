import { test, expect } from "@playwright/test";
import { registerNewUser, addProductToCart, goToCartFromModal, proceedToCheckout, fillPaymentDetails, completePurchase, deleteAccount } from "../utils/test-helpers";

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
  await page.goto("/");

  // 1. Adicionar produto ao carrinho e ir para o carrinho
  await addProductToCart(page, 0);
  await goToCartFromModal(page);

  // 2. Tentar fazer Checkout (como não estamos logados, ele vai pedir)
  await proceedToCheckout(page);

  // 3. Clicar em 'Register / Login' no modal que aparece
  await page.locator('#checkoutModal a[href="/login"]').click();

  // 4. Fluxo rápido de Cadastro (Usando e-mail dinâmico para não falhar)
  await registerNewUser(page);

  // 5. Retornar ao carrinho e prosseguir para Checkout novamente
  await page.locator('header a[href="/view_cart"]').click();
  await proceedToCheckout(page);

  // 6. Validar página de Checkout e adicionar comentário
  await expect(
    page.locator("h2", { hasText: "Address Details" }),
  ).toBeVisible({ timeout: 10000 });
  await page
    .locator('textarea[name="message"]')
    .fill("Entregar em horário comercial, por favor.");
  await page.locator('a[href="/payment"]').click();

  // 7. Preencher dados fictícios de Cartão de Crédito
  await fillPaymentDetails(page);

  // 8. Confirmar Pagamento e Validar Sucesso
  await completePurchase(page);

  // Limpar a conta
  await deleteAccount(page);
});
