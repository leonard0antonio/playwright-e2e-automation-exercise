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
// TEST CASE 9: Buscar Produto
// =========================================================
test("TC09: Deve buscar um produto específico e validar a listagem de resultados", async ({
  page,
}) => {
  await page.goto("/");

  await page.locator('a[href="/products"]').click();
  await expect(page.locator(".title.text-center").first()).toHaveText(
    "All Products",
    { timeout: 60000 }
  );

  // Preencher a barra de busca e pesquisar
  const termoBusca = "Tshirt";
  await page.locator("#search_product").fill(termoBusca);
  await page.locator("#submit_search").click();

  // Wait for search results to load - wait for URL change or title change
  await page.waitForURL(/.*products/, { timeout: 180000 });
  await page.waitForLoadState('networkidle', { timeout: 180000 });

  // Validar se o título mudou para produtos pesquisados
  await expect(page.locator(".title.text-center").first()).toHaveText(
    "Searched Products",
    { timeout: 180000 }
  );

  // Capturar todos os nomes de produtos na tela e validar se contêm o termo buscado
  const nomesDosProdutos = page.locator(".productinfo p");
  const quantidade = await nomesDosProdutos.count();

  // Garante que pelo menos 1 produto foi encontrado
  expect(quantidade).toBeGreaterThan(0);

  // Um loop que verifica se o nome de cada produto retornado inclui a palavra "Tshirt" ou "T-Shirt" (ignorando maiúsculas/minúsculas)
  for (let i = 0; i < quantidade; i++) {
    const texto = await nomesDosProdutos.nth(i).textContent();
    expect(texto).toMatch(/[Tt]shirt/i);
  }
});
