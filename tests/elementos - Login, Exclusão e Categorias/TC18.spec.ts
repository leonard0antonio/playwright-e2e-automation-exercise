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
// TEST CASE 18: Visualizar Produtos por Categoria (Menu Lateral)
// =========================================================
test("TC18: Deve navegar pelas categorias do menu lateral e validar os produtos", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Validar que o menu lateral de categorias está visível
  const menuCategorias = page.locator("#accordian");
  await expect(menuCategorias).toBeVisible({ timeout: 10000 });

  // 2. Clicar na categoria pai 'Women'
  await menuCategorias.locator('a[href="#Women"]').click();

  // 3. Clicar na subcategoria 'Dress'
  // O site usa URLs específicas para as subcategorias
  await menuCategorias.locator('a[href="/category_products/1"]').click();

  // 4. Validar se a página recarregou com o título correto da categoria
  await expect(page.locator(".title.text-center")).toHaveText(
    "Women - Dress Products",
  );

  // 5. Clicar na categoria pai 'Men' no menu lateral e depois em 'Tshirts'
  await menuCategorias.locator('a[href="#Men"]').click();
  await menuCategorias.locator('a[href="/category_products/3"]').click();

  // 6. Validar a mudança para a categoria masculina
  await expect(page.locator(".title.text-center")).toHaveText(
    "Men - Tshirts Products",
  );
});
