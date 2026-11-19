import { test, expect } from '@playwright/test';
  import { registerNewUser, goToCartFromModal, deleteAccount } from "../utils/test-helpers";

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
// TEST CASE 20: Busca de Produtos e Persistência de Carrinho
// =========================================================
test('TC20: Deve buscar produtos, adicionar ao carrinho e validar após login', async ({ page }) => {
    await page.goto('/');
    
    // 1. Acessar a página de produtos e buscar por 'Jeans'
    await page.locator('header a[href="/products"]').click();
    await page.locator('#search_product').fill('Jeans');
    await page.locator('#submit_search').click();
    await expect(page.locator('.title.text-center')).toHaveText('Searched Products');

    // 2. Adicionar o primeiro produto da busca ao carrinho
    const primeiroProduto = page.locator('.product-image-wrapper').first();
      await primeiroProduto.locator('.add-to-cart').first().click({ timeout: 30000 });
    
    // 3. Ir para o carrinho e validar se o produto está lá
    await goToCartFromModal(page);
    const linhaProduto = page.locator('#cart_info_table tbody tr');
    await expect(linhaProduto).toHaveCount(1);
    await expect(linhaProduto).toContainText('Jeans');

    // 4. Fazer Login (vamos criar uma conta on-the-fly para o teste)
    await page.locator('header a[href="/login"]').click();
    await registerNewUser(page, { name: 'QA Persistencia' });

    // 5. Retornar ao carrinho logado
    await page.locator('header a[href="/view_cart"]').click();

    // 6. Validar que o produto buscado e adicionado ANTES do login continua no carrinho
    await expect(linhaProduto).toHaveCount(1);
    await expect(linhaProduto).toContainText('Jeans');
    
    // 7. Limpar a conta
    await deleteAccount(page);
  });