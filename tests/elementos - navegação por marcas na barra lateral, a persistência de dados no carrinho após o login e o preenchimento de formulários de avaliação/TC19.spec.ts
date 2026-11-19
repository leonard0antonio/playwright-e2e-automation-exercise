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
// TEST CASE 19: Visualizar Produtos por Marca (Brands)
// =========================================================
test("TC19: Deve navegar pelas marcas no menu lateral e validar os produtos", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Acessar a página de produtos
  await page.locator('header a[href="/products"]').click();

  // 2. Validar que o menu lateral de Marcas (Brands) está visível
  const menuMarcas = page.locator(".brands_products");
  await expect(menuMarcas).toBeVisible({ timeout: 30000 });

  // 3. Clicar na marca 'Polo'
  await menuMarcas.locator('a[href="/brand_products/Polo"]').click();

  // 4. Validar se a página recarregou com o título correto da marca e URL
  await expect(page).toHaveURL(/.*brand_products\/Polo/);
  await expect(page.locator(".title.text-center")).toHaveText(
    "Brand - Polo Products",
  );
  await expect
    .poll(async () => page.locator(".features_items .product-image-wrapper").count(), { timeout: 30000 })
    .toBeGreaterThan(0);

  // 5. Clicar em outra marca no menu lateral (ex: 'H&M')
  await menuMarcas.locator('a[href="/brand_products/H&M"]').click();

  // 6. Validar a mudança para a nova marca
  await expect(page).toHaveURL(/.*brand_products\/H&M/);
  await expect(page.locator(".title.text-center")).toHaveText(
    "Brand - H&M Products",
  );
});
