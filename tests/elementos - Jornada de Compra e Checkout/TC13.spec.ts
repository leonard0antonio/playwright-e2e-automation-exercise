import { test, expect } from '@playwright/test';

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
  // TEST CASE 13: Alterar Quantidade do Produto
  // =========================================================
  test('TC13: Deve alterar a quantidade na página de detalhes e validar no carrinho', async ({ page }) => {
    await page.goto('https://automationexercise.com/');
    
    // Clicar em "View Product" no primeiro produto da home
    await page.locator('.choose a').first().click();
    await expect(page).toHaveURL(/.*product_details/);

    // O input de quantidade não é um texto simples, é um input numérico. 
    // Limpamos e preenchemos com '4'
    const inputQuantidade = page.locator('#quantity');
    await inputQuantidade.dblclick(); // Seleciona o número '1' que já está lá
    await inputQuantidade.fill('4');
    
    // Adicionar ao carrinho
    await page.locator('button.cart').click();

    // Ir para o carrinho através do modal
    const modal = page.locator('#cartModal');
    await expect(modal).toBeVisible();
    await modal.locator('a[href="/view_cart"]').click();

    // Validar se o selo de quantidade no carrinho exibe exatamente '4'
    const quantidadeNoCarrinho = page.locator('.cart_quantity button');
    await expect(quantidadeNoCarrinho).toHaveText('4');
  });