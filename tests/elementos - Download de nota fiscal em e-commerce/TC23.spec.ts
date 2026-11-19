import { test, expect } from "@playwright/test";
import { registerNewUser, goToCartFromModal, proceedToCheckout, deleteAccount } from "../utils/test-helpers";

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
// TEST CASE 23: Verificar Detalhes do Endereço no Checkout
// =========================================================
test("TC23: Deve validar se os endereços de entrega e cobrança coincidem com o cadastro", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Fazer o cadastro de uma nova conta
  await registerNewUser(page, { 
    name: "QA Enderecos",
    firstName: "NomeQA",
    lastName: "SobrenomeQA",
    address: "Rua Principal, 1000",
    state: "Texas",
    city: "Austin",
    zipcode: "73301",
    mobileNumber: "555444333"
  });

  // 2. Ir diretamente para a página de produtos e adicionar ao carrinho
  await page.locator('header a[href="/products"]').click();
  
  // Esperar a página carregar
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  // Adicionar primeiro produto ao carrinho clicando no botão
  const primeiroProduto = page.locator('.product-image-wrapper').first();
  await primeiroProduto.locator('.add-to-cart').first().click({ timeout: 30000 });

  // Ir para o carrinho
  await goToCartFromModal(page);
  await proceedToCheckout(page);

  // 3. Validar se o endereço de Entrega (Delivery) bate com o que preenchemos
  const enderecoEntrega = page.locator("#address_delivery");
  await expect(enderecoEntrega).toContainText("NomeQA SobrenomeQA", { timeout: 30000 });
  await expect(enderecoEntrega).toContainText("Rua Principal, 1000");
  await expect(enderecoEntrega).toContainText("Austin Texas 73301");

  // 4. Validar se o endereço de Cobrança (Invoice) bate com o que preenchemos
  const enderecoCobranca = page.locator("#address_invoice");
  await expect(enderecoCobranca).toContainText("NomeQA SobrenomeQA");
  await expect(enderecoCobranca).toContainText("Rua Principal, 1000");
  await expect(enderecoCobranca).toContainText("Austin Texas 73301");

  // 5. Apagar a conta
  await deleteAccount(page);
});
