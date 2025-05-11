# Test info

- Name: Video Generator >> should handle processing options
- Location: /Users/brtan/Projects/ai-ugc-video-gen/tests/e2e/video-generator.spec.ts:72:7

# Error details

```
Error: expect(locator).toHaveAttribute(expected)

Locator: locator('video')
Expected string: "https://example.com/video.mp4"
Received string: ""
Call log:
  - expect.toHaveAttribute with timeout 5000ms
  - waiting for locator('video')

    at /Users/brtan/Projects/ai-ugc-video-gen/tests/e2e/video-generator.spec.ts:81:41
```

# Page snapshot

```yaml
- main:
  - heading "AI UGC Video Generation" [level=1]
  - paragraph: Transform your videos with AI-powered enhancements
  - textbox "Enter video URL (e.g. https://...)" [disabled]: https://example.com/video.mp4
  - checkbox "Remove Background" [checked] [disabled]
  - text: Remove Background
  - checkbox "Add Subtitles" [checked] [disabled]
  - text: Add Subtitles
  - button "Processing..." [disabled]
  - text: 🎥
  - heading "Upload" [level=3]
  - paragraph: Upload your video in MP4, MOV, or AVI format
  - text: 🤖
  - heading "AI Processing" [level=3]
  - paragraph: Our AI enhances your video with advanced features
  - text: ✨
  - heading "Download" [level=3]
  - paragraph: Get your enhanced video ready for sharing
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Video Generator', () => {
   4 |   test.beforeEach(async ({ page, context }) => {
   5 |     // Mock auth endpoints
   6 |     await page.route('**/api/auth/**', async (route) => {
   7 |       await route.fulfill({
   8 |         status: 200,
   9 |         body: JSON.stringify({ user: { id: 'test-user' } })
  10 |       })
  11 |     })
  12 |
  13 |     // Mock video processing endpoint
  14 |     await page.route('/api/video/process', async (route) => {
  15 |       const postData = route.postData()
  16 |       const body = JSON.parse(postData || '{}')
  17 |       
  18 |       if (!body.videoUrl) {
  19 |         await route.fulfill({
  20 |           status: 400,
  21 |           body: JSON.stringify({ error: 'Video URL is required' })
  22 |         })
  23 |         return
  24 |       }
  25 |
  26 |       await route.fulfill({
  27 |         status: 200,
  28 |         body: JSON.stringify({
  29 |           success: true,
  30 |           processedUrl: body.videoUrl,
  31 |           message: 'Video processing started'
  32 |         })
  33 |       })
  34 |     })
  35 |
  36 |     await context.addInitScript(() => {
  37 |       window.localStorage.setItem('token', 'test-token')
  38 |     })
  39 |
  40 |     await page.goto('/', { waitUntil: 'networkidle' })
  41 |   })
  42 |
  43 |   test('should process video from URL', async ({ page }) => {
  44 |     await page.fill('input[type="text"]', 'https://example.com/video.mp4')
  45 |     await page.click('button', { hasText: 'Process Video' })
  46 |     await expect(page.getByText('Processing...')).toBeVisible()
  47 |     await expect(page.locator('video')).toHaveAttribute('src', 'https://example.com/video.mp4')
  48 |   })
  49 |
  50 |   test('should show error for empty URL', async ({ page }) => {
  51 |     await page.fill('input[type="text"]', '')
  52 |     await page.click('button', { hasText: 'Process Video' })
  53 |     await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 5000 })
  54 |     await expect(page.getByText('Please enter a video URL')).toBeVisible()
  55 |   })
  56 |
  57 |   test('should handle API errors', async ({ page }) => {
  58 |     // Override the default mock for this test
  59 |     await page.route('/api/video/process', async (route) => {
  60 |       await route.fulfill({
  61 |         status: 500,
  62 |         body: JSON.stringify({ error: 'Processing failed' })
  63 |       })
  64 |     })
  65 |
  66 |     await page.fill('input[type="text"]', 'https://example.com/video.mp4')
  67 |     await page.click('button', { hasText: 'Process Video' })
  68 |     await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 5000 })
  69 |     await expect(page.getByText('Processing failed')).toBeVisible()
  70 |   })
  71 |
  72 |   test('should handle processing options', async ({ page }) => {
  73 |     await page.fill('input[type="text"]', 'https://example.com/video.mp4')
  74 |     
  75 |     // Check processing options
  76 |     await page.getByLabel('Remove Background').check()
  77 |     await page.getByLabel('Add Subtitles').check()
  78 |     
  79 |     await page.click('button', { hasText: 'Process Video' })
  80 |     await expect(page.getByText('Processing...')).toBeVisible()
> 81 |     await expect(page.locator('video')).toHaveAttribute('src', 'https://example.com/video.mp4')
     |                                         ^ Error: expect(locator).toHaveAttribute(expected)
  82 |   })
  83 | }) 
```