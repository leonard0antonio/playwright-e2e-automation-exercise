import { test, expect } from '@playwright/test';
import { goToCartFromModal } from "../utils/test-helpers";

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
// TEST CASE 22: Adicionar Produto Recomendado ao Carrinho
// =========================================================
test('TC22: Deve rolar até o final e adicionar um produto recomendado ao carrinho', async ({ page }) => {
    await page.goto('/');
    
    // 1. Rolar para a parte inferior da página
    const seçãoRecomendados = page.locator('.recommended_items');
    await seçãoRecomendados.scrollIntoViewIfNeeded();

    // 2. Validar que o título 'RECOMMENDED ITEMS' está visível
    await expect(page.locator('h2', { hasText: 'recommended items' })).toBeVisible({ timeout: 10000 });

    // 3. Clicar em 'Add to cart' no primeiro produto recomendado ativo no carrossel
    // O carrossel possui itens ativos e inativos, focamos no ativo para evitar cliques fora da tela
    const primeiroRecomendadoAtivo = page.locator('#recommended-item-carousel .item.active .add-to-cart').first();
    await primeiroRecomendadoAtivo.click();

    // 4. Clicar em 'View Cart' no modal
    await goToCartFromModal(page);

    // 5. Validar que o produto foi exibido na página do carrinho
    const linhaProduto = page.locator('#cart_info_table tbody tr');
    await expect(linhaProduto).toHaveCount(1);
  });