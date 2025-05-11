import { test, expect } from '@playwright/test'

test.describe('Video Generator', () => {
  test.beforeEach(async ({ page, context }) => {
    // Mock auth endpoints
    await page.route('**/api/auth/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: { id: 'test-user' } })
      })
    })

    // Mock video processing endpoint
    await page.route('/api/video/process', async (route) => {
      const postData = route.postData()
      const body = JSON.parse(postData || '{}')
      
      if (!body.videoUrl) {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Video URL is required' })
        })
        return
      }

      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          processedUrl: body.videoUrl,
          message: 'Video processing started'
        })
      })
    })

    await context.addInitScript(() => {
      window.localStorage.setItem('token', 'test-token')
    })

    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('should process video from URL', async ({ page }) => {
    await page.fill('input[type="text"]', 'https://example.com/video.mp4')
    await page.click('button', { hasText: 'Process Video' })
    await expect(page.getByText('Processing...')).toBeVisible()
    await expect(page.locator('video')).toHaveAttribute('src', 'https://example.com/video.mp4')
  })

  test('should show error for empty URL', async ({ page }) => {
    await page.fill('input[type="text"]', '')
    await page.click('button', { hasText: 'Process Video' })
    await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Please enter a video URL')).toBeVisible()
  })

  test('should handle API errors', async ({ page }) => {
    // Override the default mock for this test
    await page.route('/api/video/process', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Processing failed' })
      })
    })

    await page.fill('input[type="text"]', 'https://example.com/video.mp4')
    await page.click('button', { hasText: 'Process Video' })
    await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Processing failed')).toBeVisible()
  })

  test('should handle processing options', async ({ page }) => {
    await page.fill('input[type="text"]', 'https://example.com/video.mp4')
    
    // Check processing options
    await page.getByLabel('Remove Background').check()
    await page.getByLabel('Add Subtitles').check()
    
    await page.click('button', { hasText: 'Process Video' })
    await expect(page.getByText('Processing...')).toBeVisible()
    await expect(page.locator('video')).toHaveAttribute('src', 'https://example.com/video.mp4')
  })
}) 