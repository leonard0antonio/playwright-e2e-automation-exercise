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
// TEST CASE 6: Formulário de Contato
// =========================================================
test("Deve enviar mensagem de contato com anexo de arquivo", async ({
  page,
}) => {
  await page.goto("/");

  await page.locator('a[href="/contact_us"]').click();

  await page.locator('[data-qa="name"]').fill("QA Tester");
  await page.locator('[data-qa="email"]').fill("qa@teste.com");
  await page.locator('[data-qa="subject"]').fill("Dúvida sobre Automação");
  await page
    .locator('[data-qa="message"]')
    .fill("Como configuro o POM no Playwright?");

  await page.locator('input[name="upload_file"]').setInputFiles({
    name: "duvida.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(
      "Arquivo de teste gerado pelo Playwright",
    ),
  });

  // Handle the dialog before clicking submit
  page.on("dialog", async (dialog) => {
    expect(dialog.message()).toBe("Press OK to proceed!");
    await dialog.accept();
  });

  await page.locator('[data-qa="submit-button"]').click();

  // Wait for success message - it might take a while
  const mensagemSucesso = page.locator(".status.alert.alert-success");
  await expect(mensagemSucesso).toBeVisible({ timeout: 60000 });
  await expect(mensagemSucesso).toHaveText(
    "Success! Your details have been submitted successfully.",
  );
});
