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
  await page.addInitScript(() => { Math.random = () => 0; });
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

test('Code Breaker win saves points once to history', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/play/code-breaker');
  await page.getByRole('textbox', { name: 'Three digit code' }).fill('123');
  await page.getByRole('button', { name: /GUESS/i }).click();
  await expect(page.locator('h3[role="status"]').filter({ hasText: 'CODE CRACKED!' })).toBeVisible();
  await page.goto('/history');
  await expect(page.locator('.history-entry')).toHaveCount(1);
  await expect(page.locator('.history-entry').first()).toContainText('800 PTS');
  await expect(page.getByLabel('Recent round statistics')).toContainText('800');
  await expect(page.getByText('CODE CRACKER', { exact: true })).toBeVisible();
});
test('Code Breaker defeat records a zero-point completed round', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/play/code-breaker');
  const guesses = ['012', '013', '014', '015', '016', '017', '018', '019'];
  for (const code of guesses) {
    await page.getByRole('textbox', { name: 'Three digit code' }).fill(code);
    await page.getByRole('button', { name: /GUESS/i }).click();
  }
  await expect(page.locator('h3[role="status"]').filter({ hasText: 'OUT OF ATTEMPTS!' })).toBeVisible();
  await page.goto('/history');
  await expect(page.locator('.history-entry')).toHaveCount(1);
  await expect(page.locator('.history-entry').first()).toContainText('0 PTS');
});

test('Code Breaker cannot submit guesses while paused', async ({ page }) => {
  await page.goto('/play/code-breaker');
  await page.getByRole('textbox', { name: 'Three digit code' }).fill('012');
  await page.getByRole('button', { name: /PAUSE/i }).click();
  await expect(page.getByRole('textbox', { name: 'Three digit code' })).toBeDisabled();
  await expect(page.getByRole('button', { name: /GUESS/i })).toBeDisabled();
  await page.getByRole('button', { name: '▶ RESUME GAME' }).click();
  await expect(page.getByRole('textbox', { name: 'Three digit code' })).toBeEnabled();
});

test('Signal Match completes all pairs and saves the perfect score', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
  await page.goto('/play/signal-match');
  const cards = page.locator('.memory-grid button');
  await expect(cards).toHaveCount(16);
  for (let i = 0; i < 8; i++) {
    await cards.nth(i).click();
    await cards.nth(i + 8).click();
  }
  await expect(page.getByText(/ALL PAIRS FOUND! SCORE: 120/)).toBeVisible();
  await page.goto('/history');
  await expect(page.locator('.history-entry')).toHaveCount(1);
  await expect(page.locator('.history-entry')).toContainText('120 PTS');
});
test('Chaos Button ends on a forbidden press and saves its score', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.99; });
  await page.goto('/play/chaos-button');
  const press = page.getByRole('button', { name: 'PRESS ME', exact: true });
  for (let i = 0; i < 3; i++) await press.click();
  await page.getByRole('button', { name: 'WAIT!', exact: true }).click();
  await expect(page.getByText('FINAL SCORE: 30')).toBeVisible();
  await page.goto('/history');
  await expect(page.locator('.history-entry')).toHaveCount(1);
  await expect(page.locator('.history-entry')).toContainText('30 PTS');
});
test('Pixel Dash collision records one completed round', async ({ page }) => {
  await page.goto('/play/pixel-dash');
  await expect(page.getByRole('button', { name: /GAME OVER — RESTART ABOVE/ })).toBeVisible({ timeout: 15000 });
  await page.goto('/history');
  await expect(page.locator('.history-entry')).toHaveCount(1);
  await expect(page.locator('.history-entry')).toContainText('PIXEL DASH');
});
test('Neon Dodger collision records one completed round', async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0.5; });
  await page.goto('/play/neon-dodger');
  await expect(page.getByText('RESTART ABOVE', { exact: true })).toBeVisible({ timeout: 15000 });
  await page.goto('/history');
  await expect(page.locator('.history-entry')).toHaveCount(1);
  await expect(page.locator('.history-entry')).toContainText('NEON DODGER');
});

test('installed service worker opens all five games offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const cached = await page.evaluate(async () => (await Promise.all((await caches.keys()).filter(k => k.startsWith('p4-offline-')).map(async k => (await (await caches.open(k)).keys()).map(r => new URL(r.url).pathname)))).flat());
  expect(cached).toContain('/index.html');
  expect(cached.filter(p => p.endsWith('.js')).length).toBeGreaterThanOrEqual(6);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.setOffline(true);
  try {
    for (const id of ['neon-dodger', 'signal-match', 'pixel-dash', 'code-breaker', 'chaos-button']) {
      await page.goto('/play/' + id);
      await expect(page.locator('.game-surface'), id + ': ' + errors.join('; ')).toBeVisible();
      await expect(page.locator('.game-active > :not(.loading)').first(), id + ': ' + errors.join('; ')).toBeVisible();
    }
  } finally { await context.setOffline(false); }
});
