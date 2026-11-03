import { expect, test } from '@playwright/test'

import { installGoogleGuard } from './google-guard'

test('serves a local gtag stub and answers collect locally on the production host', async ({ page }) => {
  const guard = await installGoogleGuard(page)
  await page.route('**/formspree.io/**', (route) => route.abort())

  await page.goto('https://mainhouse.canarycove.com:4173/')
  await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(1)
  await expect.poll(() => guard.collectHits.length, { timeout: 10_000 }).toBeGreaterThan(0)

  expect(guard.collectHits.some((url) => url.includes('JD6CV2CFYS') && url.includes('en=page_view'))).toBe(true)
  expect(guard.collectHits.every((url) => url.includes('google-analytics.com'))).toBe(true)
  guard.assertNoGoogleLeak()
  await page.screenshot({ path: 'e2e/artifacts/gtag-prod-hostname.png' })
})
