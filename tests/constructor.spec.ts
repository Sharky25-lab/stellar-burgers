import { test, expect, Page } from '@playwright/test';

const INGREDIENTS_HAR = 'tests/hars/ingredients.har';
const USER_HAR = 'tests/hars/user.har';
const ORDER_HAR = 'tests/hars/order.har';

const BUN_NAME = 'Флюоресцентная булка R2-D3';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '12345';

const ingredientRow = (page: Page, name: string) =>
  page.getByRole('listitem').filter({ hasText: name });

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(INGREDIENTS_HAR, { url: /\/api\/ingredients$/ });
});

test.describe('Страница конструктора бургера', () => {
  test('добавление булки и начинки из списка в конструктор', async ({
    page
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Соберите бургер' })
    ).toBeVisible();

    await ingredientRow(page, BUN_NAME)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText(`${BUN_NAME} (верх)`)).toBeVisible();

    await ingredientRow(page, MAIN_NAME)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText(MAIN_NAME)).toHaveCount(2);
  });

  test('модальное окно ингредиента показывает его данные и закрывается по крестику', async ({
    page
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Соберите бургер' })
    ).toBeVisible();

    await ingredientRow(page, MAIN_NAME).getByText(MAIN_NAME).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(MAIN_NAME)).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(page).toHaveURL(/\/ingredients\//);

    await modal.getByRole('button').click();
    await expect(modal).toBeEmpty();
    await expect(page).toHaveURL('/');
  });

  test('заказ оформляется, конструктор очищается, модалка закрывается', async ({
    page,
    context
  }) => {
    await page.routeFromHAR(USER_HAR, { url: /\/api\/auth\/user$/ });
    await page.routeFromHAR(ORDER_HAR, { url: /\/api\/orders$/ });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-token',
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Соберите бургер' })
    ).toBeVisible();

    await ingredientRow(page, BUN_NAME)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await ingredientRow(page, MAIN_NAME)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(ORDER_NUMBER)).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await modal.getByRole('button').click();
    await expect(modal).toBeEmpty();
  });
});