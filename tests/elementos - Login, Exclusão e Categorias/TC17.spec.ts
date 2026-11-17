import { test, expect } from "@playwright/test";
import { addProductToCart, goToCartFromModal } from "../utils/test-helpers";

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
// TEST CASE 17: Remover Produto do Carrinho
// =========================================================
test("TC17: Deve adicionar um produto e removê-lo do carrinho com sucesso", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Adicionar produto ao carrinho
  await addProductToCart(page, 0);

  // 2. Acessar o carrinho
  await goToCartFromModal(page);

  // 3. Validar que o produto está no carrinho
  const linhaProduto = page.locator("#cart_info_table tbody tr");
  await expect(linhaProduto).toHaveCount(1);

  // 4. Clicar no botão 'X' (Delete) para remover o item
  await page.locator(".cart_quantity_delete").click({ timeout: 60000 });

  // 5. O site possui um pequeno atraso assíncrono ao deletar.
  // O Playwright aguarda o elemento "empty_cart" ficar visível.
  const carrinhoVazio = page.locator("#empty_cart");
  await expect(carrinhoVazio).toBeVisible({ timeout: 90000 });
  await expect(carrinhoVazio).toContainText("Cart is empty!");
});
