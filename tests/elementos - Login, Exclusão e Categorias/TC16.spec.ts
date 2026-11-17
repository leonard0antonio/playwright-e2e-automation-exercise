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
// TEST CASE 16: Comprar - Login antes do Checkout
// =========================================================
test("TC16: Deve logar, adicionar produto, finalizar compra e apagar conta", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Acessar a tela de login e registrar
  await registerNewUser(page, { name: "QA Logado" });

  // 2. Adicionar produto ao carrinho logado
  await page.locator('header a[href="/products"]').click();
  await addProductToCart(page, 0);

  // 3. Ir para o carrinho e prosseguir para o Checkout
  await goToCartFromModal(page);
  await proceedToCheckout(page);

  // 4. Validar que os detalhes do endereço estão corretos na página de checkout
  await expect(page.locator("#address_delivery")).toContainText("QA Logado", { timeout: 10000 });
  await expect(page.locator("#address_delivery")).toContainText(
    "Rua dos Bugs, 404",
  );

  // 5. Preencher comentário e ir para pagamento
  await page
    .locator('textarea[name="message"]')
    .fill("Tudo certo com o endereço.");
  await page.locator('a[href="/payment"]').click();

  // 6. Pagar e Confirmar
  await fillPaymentDetails(page, {
    nameOnCard: "QA LOGADO",
    cardNumber: "1111222233334444",
    cvc: "111",
    expiryMonth: "01",
    expiryYear: "2029"
  });
  await completePurchase(page);

  // 7. Deletar a conta para manter a base limpa
  await deleteAccount(page);
});
