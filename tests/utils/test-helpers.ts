import { Page, Locator, expect } from '@playwright/test';

/**
 * Generates a unique email for test registration
 */
export function generateUniqueEmail(prefix: string = 'qa'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}@teste.com`;
}

/**
 * Generates a unique name for test registration
 */
export function generateUniqueName(prefix: string = 'QA'): string {
  return `${prefix} ${Date.now()}`;
}

/**
 * Fills the registration form with test data
 */
export async function fillRegistrationForm(page: Page, options: {
  name?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  mobileNumber?: string;
} = {}) {
  const {
    name = generateUniqueName('QA Tester'),
    email = generateUniqueEmail('qa_tester'),
    password = 'SenhaForte123!',
    firstName = 'QA',
    lastName = 'Tester',
    address = 'Rua dos Bugs, 404',
    country = 'United States',
    state = 'California',
    city = 'Los Angeles',
    zipcode = '90001',
    mobileNumber = '+1 555 0199'
  } = options;

  await page.locator('#id_gender1').check({ timeout: 60000 });
  await page.locator('[data-qa="password"]').fill(password, { timeout: 60000 });
  await page.locator('[data-qa="days"]').selectOption('15', { timeout: 60000 });
  await page.locator('[data-qa="months"]').selectOption('5', { timeout: 60000 });
  await page.locator('[data-qa="years"]').selectOption('1990', { timeout: 60000 });
  await page.locator('#newsletter').check({ timeout: 60000 });
  await page.locator('#optin').check({ timeout: 60000 });
  await page.locator('[data-qa="first_name"]').fill(firstName, { timeout: 60000 });
  await page.locator('[data-qa="last_name"]').fill(lastName, { timeout: 60000 });
  await page.locator('[data-qa="address"]').fill(address, { timeout: 60000 });
  await page.locator('[data-qa="country"]').selectOption(country, { timeout: 60000 });
  await page.locator('[data-qa="state"]').fill(state, { timeout: 60000 });
  await page.locator('[data-qa="city"]').fill(city, { timeout: 60000 });
  await page.locator('[data-qa="zipcode"]').fill(zipcode, { timeout: 60000 });
  await page.locator('[data-qa="mobile_number"]').fill(mobileNumber, { timeout: 60000 });
  await page.locator('[data-qa="create-account"]').click({ timeout: 60000 });
}

/**
 * Performs complete user registration and returns the email used
 */
export async function registerNewUser(page: Page, options: {
  name?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  mobileNumber?: string;
} = {}): Promise<string> {
  const email = options.email || generateUniqueEmail('qa');
  const name = options.name || generateUniqueName('QA Tester');
  const password = options.password || 'SenhaForte123!';

  // Ensure we're on the home page and not logged in
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  
  // Check if already logged in, if so logout first
  const loggedIn = page.locator('text=Logged in as');
  if (await loggedIn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await page.locator('a[href="/logout"]').click();
    await expect(page).toHaveURL(/.*login/, { timeout: 30000 });
  }

  // Go to login/signup page
  await page.locator('a[href="/login"]').click({ timeout: 60000 });
  
  // Wait for login page to load
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  
  // Wait for signup form to be visible
  await expect(page.locator('[data-qa="signup-name"]')).toBeVisible({ timeout: 60000 });
  
  await page.locator('[data-qa="signup-name"]').fill(name, { timeout: 60000 });
  await page.locator('[data-qa="signup-email"]').fill(email, { timeout: 60000 });
  await page.locator('[data-qa="signup-button"]').click({ timeout: 60000 });

  await fillRegistrationForm(page, { ...options, email, name, password });
  
  await expect(page.locator('[data-qa="account-created"]')).toBeVisible({ timeout: 90000 });
  await expect(page.locator('[data-qa="account-created"]')).toHaveText('Account Created!', { timeout: 60000 });
  await page.locator('[data-qa="continue-button"]').click({ timeout: 60000 });

  return email;
}

/**
 * Logs in with existing credentials
 */
export async function loginUser(page: Page, email: string, password: string = 'SenhaForte123!') {
  await expect(page.locator('[data-qa="login-email"]')).toBeVisible({ timeout: 60000 });
  await page.locator('[data-qa="login-email"]').fill(email, { timeout: 60000 });
  await page.locator('[data-qa="login-password"]').fill(password, { timeout: 60000 });
  await page.locator('[data-qa="login-button"]').click({ timeout: 60000 });
  await expect(page.locator('text=Logged in as')).toBeVisible({ timeout: 90000 });
}

/**
 * Adds a product to cart from product listing
 */
export async function addProductToCart(page: Page, productIndex: number = 0) {
  const product = page.locator('.product-image-wrapper').nth(productIndex);
  await product.hover({ timeout: 60000 });
  await product.locator('.add-to-cart').first().click({ timeout: 60000 });
  
  const modal = page.locator('#cartModal');
  await expect(modal).toBeVisible({ timeout: 60000 });
  return modal;
}

/**
 * Navigates to cart from modal
 */
export async function goToCartFromModal(page: Page) {
  const modal = page.locator('#cartModal');
  await expect(modal).toBeVisible({ timeout: 60000 });
  await modal.locator('a[href="/view_cart"]').click({ timeout: 60000 });
  await expect(page).toHaveURL(/.*view_cart/, { timeout: 60000 });
}

/**
 * Continues shopping from modal
 */
export async function continueShoppingFromModal(page: Page) {
  const modal = page.locator('#cartModal');
  await expect(modal).toBeVisible({ timeout: 60000 });
  await modal.getByRole('button', { name: 'Continue Shopping' }).click({ timeout: 60000 });
  await expect(modal).not.toBeVisible({ timeout: 60000 });
}

/**
 * Proceeds to checkout from cart page
 */
export async function proceedToCheckout(page: Page) {
  await page.locator('.check_out').click({ timeout: 60000 });
}

/**
 * Fills payment details
 */
export async function fillPaymentDetails(page: Page, options: {
  nameOnCard?: string;
  cardNumber?: string;
  cvc?: string;
  expiryMonth?: string;
  expiryYear?: string;
} = {}) {
  const {
    nameOnCard = 'QA TESTER',
    cardNumber = '1234567890123456',
    cvc = '123',
    expiryMonth = '12',
    expiryYear = '2030'
  } = options;

  await page.locator('[data-qa="name-on-card"]').fill(nameOnCard, { timeout: 60000 });
  await page.locator('[data-qa="card-number"]').fill(cardNumber, { timeout: 60000 });
  await page.locator('[data-qa="cvc"]').fill(cvc, { timeout: 60000 });
  await page.locator('[data-qa="expiry-month"]').fill(expiryMonth, { timeout: 60000 });
  await page.locator('[data-qa="expiry-year"]').fill(expiryYear, { timeout: 60000 });
}

/**
 * Completes the purchase
 */
export async function completePurchase(page: Page) {
  await page.locator('[data-qa="pay-button"]').click({ timeout: 60000 });
  await expect(page.locator('[data-qa="order-placed"]')).toBeVisible({ timeout: 90000 });
  await expect(page.locator('[data-qa="order-placed"]')).toHaveText('Order Placed!', { timeout: 60000 });
}

/**
 * Deletes the current user account
 */
export async function deleteAccount(page: Page) {
  await page.locator('header a[href="/delete_account"]').click({ timeout: 60000 });
  await expect(page.locator('[data-qa="account-deleted"]')).toBeVisible({ timeout: 60000 });
  await expect(page.locator('[data-qa="account-deleted"]')).toHaveText('Account Deleted!', { timeout: 60000 });
}

/**
 * Waits for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 90000 });
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
}

/**
 * Scrolls to element and waits for it to be visible
 */
export async function scrollToElement(page: Page, locator: Locator) {
  await locator.scrollIntoViewIfNeeded({ timeout: 60000 });
  await expect(locator).toBeVisible({ timeout: 60000 });
}