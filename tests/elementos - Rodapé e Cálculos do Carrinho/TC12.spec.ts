import { test, expect } from "@playwright/test";
import { addProductToCart, continueShoppingFromModal, goToCartFromModal } from "../utils/test-helpers";

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
// TEST CASE 12: Adicionar Múltiplos Produtos e Validar Valores
// =========================================================
test("TC12: Deve adicionar dois produtos ao carrinho e validar preço, quantidade e total", async ({
  page,
}) => {
  await page.goto("/");

  await page.locator('a[href="/products"]').click();

  // Produto 1
  await addProductToCart(page, 0);
  await continueShoppingFromModal(page);

  // Produto 2
  await addProductToCart(page, 1);
  await goToCartFromModal(page);

  // Validar se existem exatamente 2 itens no carrinho
  const linhasDoCarrinho = page.locator("#cart_info_table tbody tr");
  await expect(linhasDoCarrinho).toHaveCount(2);

  // Validar Produto 1 (Preço, Quantidade e Total)
  const item1 = linhasDoCarrinho.nth(0);
  await expect(item1.locator(".cart_price p")).toBeVisible({ timeout: 10000 }); // Preço unitário
  await expect(item1.locator(".cart_quantity button")).toHaveText("1"); // Quantidade
  await expect(item1.locator(".cart_total p")).toBeVisible({ timeout: 10000 }); // Preço Total

  // Validar Produto 2 (Preço, Quantidade e Total)
  const item2 = linhasDoCarrinho.nth(1);
  await expect(item2.locator(".cart_price p")).toBeVisible({ timeout: 10000 });
  await expect(item2.locator(".cart_quantity button")).toHaveText("1");
  await expect(item2.locator(".cart_total p")).toBeVisible({ timeout: 10000 });
});
