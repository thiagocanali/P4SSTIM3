import { expect, test } from '@playwright/test';
test('homepage and five games load without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /BORED/i })).toBeVisible();
  await page.getByRole('link', { name: 'EXPLORE', exact: true }).click();
  await expect(page.locator('.card')).toHaveCount(5);
  const ids = ['neon-dodger', 'signal-match', 'pixel-dash', 'code-breaker', 'chaos-button'];
  for (const id of ids) {
    await page.goto('/play/' + id);
    await expect(page.locator('.game-surface')).toBeVisible();
    await expect(page.getByRole('button', { name: /PAUSE/i })).toBeVisible();
    await page.getByRole('button', { name: /PAUSE/i }).click();
    await expect(page.getByText('YOUR GAME IS WAITING.')).toBeVisible();
    await page.getByRole('button', { name: '▶ RESUME GAME' }).click();
    await expect(page.getByText('YOUR GAME IS WAITING.')).toHaveCount(0);
    await page.getByRole('button', { name: /RESTART/i }).click();
  }
  expect(errors).toEqual([]);
});
test('catalog filters, favorites and history route', async ({ page }) => {
  await page.goto('/explore');
  await page.getByRole('textbox', { name: 'Search games' }).fill('Code Breaker');
  await expect(page.locator('.card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Add favorite' }).click();
  await page.getByRole('textbox', { name: 'Search games' }).fill('');
  await page.getByRole('button', { name: /FAVORITES/i }).click();
  await expect(page.locator('.card')).toHaveCount(1);
  await page.goto('/history');
  await expect(page.getByRole('heading', { name: /YOUR HISTORY/i })).toBeVisible();
});

test('Code Breaker rejects invalid and repeated guesses without losing turns', async ({ page }) => {
  await page.goto('/play/code-breaker');
  const input = page.getByRole('textbox', { name: 'Three digit code' });
  const guess = page.getByRole('button', { name: /GUESS/i });
  await input.fill('112');
  await expect(guess).toBeDisabled();
  await input.fill('012');
  await guess.click();
  await expect(page.locator('.attempts > div')).toHaveCount(1);
  await input.fill('012');
  await guess.click();
  await expect(page.getByRole('alert')).toContainText('already tried');
  await expect(page.locator('.attempts > div')).toHaveCount(1);
});
test('Escape pauses and resumes a running game', async ({ page }) => {
  await page.goto('/play/signal-match');
  await page.keyboard.press('Escape');
  await expect(page.getByText('YOUR GAME IS WAITING.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText('YOUR GAME IS WAITING.')).toHaveCount(0);
});
test('favorites persist after a reload and can be removed', async ({ page }) => {
  await page.goto('/explore');
  const first = page.locator('.card').first();
  await first.getByRole('button', { name: 'Add favorite' }).click();
  await page.reload();
  await expect(page.locator('.card').first().getByRole('button', { name: 'Remove favorite' })).toBeVisible();
  await page.locator('.card').first().getByRole('button', { name: 'Remove favorite' }).click();
  await expect(page.locator('.card').first().getByRole('button', { name: 'Add favorite' })).toBeVisible();
});
