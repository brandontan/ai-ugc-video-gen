import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  // Mock authentication
  await page.route('/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' }
      })
    })
  })

  // Set authentication token in localStorage
  await page.evaluate(() => {
    localStorage.setItem('token', 'mock-token')
  })
}) 