import { beforeEach } from '@playwright/test'

const { test, describe, expect } = require('@playwright/test')

describe('Task app', () => {
  beforeEach(async ({ page }) => {
    console.log('NODE_ENV:', process.env.NODE_ENV)
    await page.goto('http://localhost:5173')
  })
  
  test('front page can be opened', async ({ page }) => {
    const loginButton = page.locator('button', { hasText: 'Login' })
    await expect(loginButton).toBeVisible()
  })

  test('new user can be created', async ({ page }) => {
    await page.getByTestId('newusername').fill('test2')
    await page.getByTestId('newname').fill('test2')
    await page.getByTestId('newpassword').fill('test2')
    await page.getByTestId('confirmnewpassword').fill('test2')

    await page.getByRole('button', { name: 'register' }).click()

    await expect(page.getByText('User created successfully, you can now log in using the login form.')).toBeVisible()
  })
  
  test('login form can be opened', async ({ page }) => {
    await page.getByTestId('username').fill('test2')
    await page.getByTestId('password').fill('test2')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('test logged in')).toBeVisible()
  })
})