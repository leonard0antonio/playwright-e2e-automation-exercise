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
// TEST CASE 12: Adicionar Múltiplos Produtos e Validar Valores
// =========================================================
test("TC12: Deve adicionar dois produtos ao carrinho e validar preço, quantidade e total", async ({
  page,
}) => {
  await page.goto("https://automationexercise.com/");

  await page.locator('a[href="/products"]').click();

  // Produto 1
  const primeiroProduto = page.locator(".product-image-wrapper").nth(0);
  await primeiroProduto.hover();
  await primeiroProduto.locator(".add-to-cart").first().click();

  // Lidar com o modal e clicar em "Continue Shopping"
  const modal = page.locator("#cartModal");
  await expect(modal).toBeVisible();
  await modal.getByRole("button", { name: "Continue Shopping" }).click();
  await expect(modal).not.toBeVisible();

  // Produto 2
  const segundoProduto = page.locator(".product-image-wrapper").nth(1);
  await segundoProduto.hover();
  await segundoProduto.locator(".add-to-cart").first().click();

  // Lidar com o modal e ir para o Carrinho
  await expect(modal).toBeVisible();
  await modal.locator('a[href="/view_cart"]').click();

  // Validar se existem exatamente 2 itens no carrinho
  const linhasDoCarrinho = page.locator("#cart_info_table tbody tr");
  await expect(linhasDoCarrinho).toHaveCount(2);

  // Validar Produto 1 (Preço, Quantidade e Total)
  const item1 = linhasDoCarrinho.nth(0);
  await expect(item1.locator(".cart_price p")).toBeVisible(); // Preço unitário
  await expect(item1.locator(".cart_quantity button")).toHaveText("1"); // Quantidade
  await expect(item1.locator(".cart_total p")).toBeVisible(); // Preço Total

  // Validar Produto 2 (Preço, Quantidade e Total)
  const item2 = linhasDoCarrinho.nth(1);
  await expect(item2.locator(".cart_price p")).toBeVisible();
  await expect(item2.locator(".cart_quantity button")).toHaveText("1");
  await expect(item2.locator(".cart_total p")).toBeVisible();
});
