const { test, describe, expect, beforeEach} = require('@playwright/test')

describe('Task app', () => {
  beforeEach(async ({ page }) => {
    console.log("process env:", process.env.NODE_ENV)
    await page.goto('http://localhost:5173')
  })
  
  test('front page can be opened', async ({ page }) => {
  const loginButton = page.locator('button', { hasText: 'Login' })
  await expect(loginButton).toBeVisible()
})

  test('new user can be created', async ({ page }) => {
    await page.getByTestId('newusername').fill('test')
    await page.getByTestId('newname').fill('test')
    await page.getByTestId('newpassword').fill('test')
    await page.getByTestId('confirmnewpassword').fill('test')

    await page.getByRole('button', { name: 'register' }).click()

    await expect(page.getByText('User created successfully, you can now log in using the login form.')).toBeVisible()
  })

  test('log in works and tasks are displayed after logging in', async ({ page }) => {
    await page.getByTestId('username').fill('test')
    await page.getByTestId('password').fill('test')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('test logged in')).toBeVisible()
    await expect(page.locator('h2:has-text("Tasks")')).toBeVisible() 
    
  })
})