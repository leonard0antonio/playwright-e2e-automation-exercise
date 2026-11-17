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
// TEST CASE 26: Scroll Up SEM usar o botão de Seta
// =========================================================
test("TC26: Deve rolar até o rodapé e voltar ao topo simulando o scroll do mouse", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Validar se a Home Page carregou corretamente
  await expect(page.locator("body")).toBeVisible();

  // 2. Rolar a página até o final
  const rodape = page.locator("#footer");
  await rodape.scrollIntoViewIfNeeded();

  // 3. Validar que o texto 'SUBSCRIPTION' está visível
  await expect(page.locator("h2", { hasText: "Subscription" })).toBeVisible({ timeout: 10000 });

  // 4. Subir a página de volta ao topo SEM clicar na seta.
  // Podemos fazer isso mandando o Playwright focar no cabeçalho (Header) da página,
  // ou injetando um comando javascript simples na janela do navegador:
  await page.evaluate(() => window.scrollTo(0, 0));

  // 5. Validar que a página voltou ao topo exibindo o texto principal
  const textoTopo = page.locator(".item.active h2", {
    hasText: "Full-Fledged practice website for Automation Engineers",
  });
  await expect(textoTopo).toBeVisible({ timeout: 10000 });
});
