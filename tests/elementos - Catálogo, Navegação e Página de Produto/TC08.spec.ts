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
// TEST CASE 8: Verificar todos os produtos e página de detalhes
// =========================================================
test("TC08: Deve validar a lista de produtos e as informações detalhadas do primeiro item", async ({
  page,
}) => {
  await page.goto("/");

  // Acessar a página de produtos
  await page.locator('a[href="/products"]').click();

  // Validar o carregamento da página de todos os produtos
  await expect(page).toHaveURL(/.*products/);
  await expect(page.locator(".title.text-center").first()).toHaveText(
    "All Products",
  );

  // Garantir que a lista de produtos (grid) está visível
  const listaProdutos = page.locator(".features_items");
  await expect(listaProdutos).toBeVisible({ timeout: 10000 });

  // Clicar no botão 'View Product' do primeiro item da lista
  await page.locator(".choose a").first().click();

  // Validar se estamos na página de detalhes
  await expect(page).toHaveURL(/.*product_details/);

  // Validar a presença de todas as informações obrigatórias do produto
  const informacoesProduto = page.locator(".product-information");
  await expect(informacoesProduto.locator("h2")).toBeVisible({ timeout: 10000 }); // Nome do Produto
  await expect(
    informacoesProduto.locator("p").filter({ hasText: "Category" }),
  ).toBeVisible({ timeout: 10000 });
  await expect(informacoesProduto.locator("span span")).toBeVisible({ timeout: 10000 }); // Preço
  await expect(
    informacoesProduto.locator("p").filter({ hasText: "Availability:" }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    informacoesProduto.locator("p").filter({ hasText: "Condition:" }),
  ).toBeVisible({ timeout: 10000 });
  await expect(
    informacoesProduto.locator("p").filter({ hasText: "Brand:" }),
  ).toBeVisible({ timeout: 10000 });
});
