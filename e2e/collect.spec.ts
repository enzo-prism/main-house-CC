import { expect, test } from '@playwright/test'

import { installGoogleGuard } from './google-guard'

test('serves a local gtag stub and answers collect locally on the production host', async ({ page }) => {
  const guard = await installGoogleGuard(page)
  await page.route('**/formspree.io/**', (route) => route.abort())

  const response = await page.goto('https://mainhouse.canarycove.com:4173/')
  expect(response?.headers()['referrer-policy']).toBe('strict-origin')
  await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(1)
  await expect.poll(() => guard.collectHits.length, { timeout: 10_000 }).toBeGreaterThan(0)

  expect(guard.collectHits.some((url) => url.includes('JD6CV2CFYS') && url.includes('en=page_view'))).toBe(true)
  expect(guard.collectHits.every((url) => url.includes('google-analytics.com'))).toBe(true)
  guard.assertNoGoogleLeak()
  await page.screenshot({ path: 'test-results/gtag-prod-hostname.png' })
})

test('retries a failed Formspree post and fires generate_lead once', async ({ page }) => {
  const guard = await installGoogleGuard(page)
  let posts = 0
  await page.route('**/formspree.io/**', (route) => {
    posts += 1
    if (posts === 1) {
      return route.abort()
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })

  await page.goto('https://mainhouse.canarycove.com:4173/#book')
  await page.getByLabel('Nature of inquiry').fill('Synthetic inquiry for a mocked form.')
  await page.getByLabel('Name').fill('Test Guest')
  await page.getByLabel('Email').fill('test.guest@example.test')
  await page.getByTestId('inquiry-submit').click()
  await expect(page.getByTestId('inquiry-error')).toBeVisible()

  await page.getByTestId('inquiry-submit').click()
  await expect(page.getByTestId('inquiry-success')).toBeVisible()
  expect(posts).toBe(2)
  await expect.poll(async () => {
    return page.evaluate(() =>
      (window.dataLayer ?? []).filter(
        (entry) =>
          Object.prototype.toString.call(entry) === '[object Arguments]' &&
          (entry as IArguments)[0] === 'event' &&
          (entry as IArguments)[1] === 'generate_lead',
      ).length,
    )
  }).toBe(1)
  guard.assertNoGoogleLeak()
})

test('fulfills google.com locally and does not leak', async ({ page }) => {
  const guard = await installGoogleGuard(page)
  await page.goto('https://mainhouse.canarycove.com:4173/')
  const status = await page.evaluate(async () => {
    const response = await fetch('https://www.google.com/ccm/collect', { method: 'POST' })
    return response.status
  })
  expect(status).toBe(204)
  expect(guard.fulfilledGoogle.some((url) => new URL(url).hostname.endsWith('google.com'))).toBe(true)
  guard.assertNoGoogleLeak()
})
