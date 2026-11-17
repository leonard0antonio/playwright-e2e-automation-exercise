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
// TEST CASE 24: Baixar Fatura (Invoice) após Pedido
// =========================================================
test("TC24: Deve finalizar a compra, baixar o arquivo txt da fatura e validar o download", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Cadastrar e logar
  await registerNewUser(page, { 
    name: "QA Fatura",
    address: "Rua dos Downloads, 99"
  });

  // 2. Comprar produto e ir para o Pagamento
  await page.locator('header a[href="/products"]').click();
  await addProductToCart(page, 0);
  await goToCartFromModal(page);
  await proceedToCheckout(page);
  await page.locator('a[href="/payment"]').click();

  // 3. Pagar
  await fillPaymentDetails(page, {
    nameOnCard: "QA FATURA",
    cardNumber: "1234123412341234"
  });
  await completePurchase(page);

  // 4. Na tela de sucesso, preparar o Playwright para ouvir o evento de download
  const promessaDownload = page.waitForEvent("download");

  // 5. Clicar no botão 'Download Invoice'
  await page.locator(".check_out", { hasText: "Download Invoice" }).click();

  // 6. Capturar o arquivo baixado
  const arquivo = await promessaDownload;

  // 7. Validar que o download ocorreu e o arquivo tem a extensão esperada (.txt)
  expect(arquivo.suggestedFilename()).toBe("invoice.txt");

  // 8. Apagar conta
  await deleteAccount(page);
});
