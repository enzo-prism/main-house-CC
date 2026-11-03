import { expect, test } from '@playwright/test'

import { NON_PROD_HOSTS, installGoogleGuard } from './google-guard'

for (const hostname of NON_PROD_HOSTS) {
  test(`sends nothing on ${hostname}`, async ({ page }) => {
    const guard = await installGoogleGuard(page)
    await page.route('**/formspree.io/**', (route) => route.abort())

    const url = hostname === 'localhost' ? 'https://127.0.0.1:4173/' : `https://${hostname}:4173/`
    await page.goto(url)

    await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(0)
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0)
    expect(guard.collectHits).toEqual([])
    expect(guard.seenGoogle).toEqual([])
    guard.assertNoGoogleLeak()
  })
}
