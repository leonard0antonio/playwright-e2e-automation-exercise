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
// TEST CASE 25: Scroll Up usando o botão de Seta (Arrow button)
// =========================================================
test("TC25: Deve rolar até o rodapé e voltar ao topo usando o botão de seta", async ({
  page,
}) => {
  await page.goto("/");

  // 1. Validar se a Home Page carregou corretamente
  await expect(page.locator("body")).toBeVisible();

  // 2. Rolar a página até o final (focando no rodapé)
  const rodape = page.locator("#footer");
  await rodape.scrollIntoViewIfNeeded();

  // 3. Validar que o texto 'SUBSCRIPTION' no rodapé está visível
  await expect(page.locator("h2", { hasText: "Subscription" })).toBeVisible({ timeout: 10000 });

  // 4. Clicar no botão de seta no canto inferior direito para voltar ao topo
  // O site usa o ID 'scrollUp' para esse botão
  const botaoSeta = page.locator("#scrollUp");
  await botaoSeta.click();

  // 5. Validar que a página voltou ao topo exibindo o texto principal do carrossel
  // O site tem uma pequena animação de scroll, então o Playwright vai aguardar o texto ficar visível
  const textoTopo = page.locator(".item.active h2", {
    hasText: "Full-Fledged practice website for Automation Engineers",
  });
  await expect(textoTopo).toBeVisible({ timeout: 10000 });
});
