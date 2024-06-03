const { test, describe, expect } = require('@playwright/test')

describe('Task app', () => {
test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const loginButton = page.locator('button', { hasText: 'Login' })
  await expect(loginButton).toBeVisible()
})
})