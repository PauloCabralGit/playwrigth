import { test, expect } from '@playwright/test';

const BASE_URL = 'https://automationexercise.com';
const NAME = 'Paulo Cabral';
const PASSWORD = 'SenhaTeste123';
// Email unico por execucao: evita depender de limpeza de runs anteriores
// e permite rodar em paralelo com outros projetos sem conflitar na mesma conta.
const EMAIL = `paulocabral.pw.${Date.now()}@teste.com`;

const AD_DOMAINS = /doubleclick\.net|googlesyndication\.com|google-analytics\.com|googletagservices\.com|googleadservices\.com|adservice\.google\.com/;

test.describe.serial('Cadastro - Automation Exercise', () => {
  test.beforeEach(async ({ page }) => {
    // O site tem anuncios do Google que as vezes cobrem a pagina inteira
    // (interstitial), bloqueando os cliques. Bloqueamos esses dominios de
    // anuncio na camada de rede para manter os testes estaveis e rapidos.
    await page.route(AD_DOMAINS, (route) => route.abort());
  });

  test('CN001: Successful user registration', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.locator('[data-qa="signup-name"]').fill(NAME);
    await page.locator('[data-qa="signup-email"]').fill(EMAIL);
    await page.locator('[data-qa="signup-button"]').click();

    await page.locator('#id_gender1').check();
    await page.locator('#password').fill(PASSWORD);
    await page.locator('#days').selectOption('11');
    await page.locator('#months').selectOption('7');
    await page.locator('#years').selectOption('1990');
    await page.locator('#first_name').fill('Paulo');
    await page.locator('#last_name').fill('Cabral');
    await page.locator('#company').fill('Paulo LTDA');
    await page.locator('#address1').fill('Rua teste da silva');
    await page.locator('#country').selectOption('Canada');
    await page.locator('#state').fill('Ontario');
    await page.locator('#city').fill('Curitiba');
    await page.locator('#zipcode').fill('00000');
    await page.locator('#mobile_number').fill('+5541996816096');
    await page.locator('[data-qa="create-account"]').click();

    await expect(page.getByText('Account Created!')).toBeVisible();
  });

  test('CN002: Verify required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Envia o formulario de cadastro em branco: a validacao "required" do
    // navegador deve bloquear o submit e manter o formulario na tela.
    await page.locator('[data-qa="signup-button"]').click();
    await expect(page.locator('[data-qa="signup-name"]')).toBeVisible();

    await page.locator('[data-qa="login-email"]').fill(EMAIL);
    await page.locator('[data-qa="login-password"]').fill(PASSWORD);
    await page.locator('[data-qa="login-button"]').click();

    await expect(page.getByText(`Logged in as ${NAME}`)).toBeVisible();
  });

  test('CN003: By product registration', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('[data-qa="login-email"]').fill(EMAIL);
    await page.locator('[data-qa="login-password"]').fill(PASSWORD);
    await page.locator('[data-qa="login-button"]').click();
    await expect(page.getByText(`Logged in as ${NAME}`)).toBeVisible();

    await page.locator('a[href="#Women"]').click();
    await page.locator('a[href="/category_products/1"]').click();

    await page.locator('.product-image-wrapper a.add-to-cart').first().click();
    await expect(page.locator('.modal-title')).toHaveText('Added!');
    await page.locator('.close-modal').click();

    await page.locator('a[href="/view_cart"]').first().click();
    await page.locator('.check_out').click(); // Proceed To Checkout
    await page.locator('.check_out').click(); // Place Order

    await page.locator('[data-qa="name-on-card"]').fill(NAME);
    await page.locator('[data-qa="card-number"]').fill('4111111111111111');
    await page.locator('[data-qa="cvc"]').fill('123');
    await page.locator('[data-qa="expiry-month"]').fill('12');
    await page.locator('[data-qa="expiry-year"]').fill('2030');
    await page.locator('[data-qa="pay-button"]').click();

    await expect(page.getByText('Order Placed!')).toBeVisible();
  });

  test('CN004: Delete account', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('[data-qa="login-email"]').fill(EMAIL);
    await page.locator('[data-qa="login-password"]').fill(PASSWORD);
    await page.locator('[data-qa="login-button"]').click();
    await expect(page.getByText(`Logged in as ${NAME}`)).toBeVisible();

    await page.goto(`${BASE_URL}/delete_account`);
    await expect(page.getByText('Account Deleted!')).toBeVisible();
  });
});
