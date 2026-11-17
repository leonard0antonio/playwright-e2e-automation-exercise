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
// TEST CASE 15: Comprar - Registrar ANTES do Checkout
// =========================================================
test("TC15: Deve registrar conta primeiro e depois finalizar compra", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Cadastrar primeiro
  await registerNewUser(page);

  // 2. Já logado, adicionar produto ao carrinho
  await page.locator('header a[href="/products"]').click();
  await addProductToCart(page, 0);
  await goToCartFromModal(page);

  // 3. Fazer Checkout direto (não pedirá login)
  await proceedToCheckout(page);
  await page
    .locator('textarea[name="message"]')
    .fill("Compra com conta pré-registrada.");
  await page.locator('a[href="/payment"]').click();

  // 4. Pagamento e Confirmação
  await fillPaymentDetails(page, {
    nameOnCard: "QA PRE CADASTRO",
    cardNumber: "9876543210987654",
    cvc: "987",
    expiryMonth: "05",
    expiryYear: "2028"
  });
  await completePurchase(page);

  // Limpar a base de dados deletando a conta ao final
  await deleteAccount(page);
});
