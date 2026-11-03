import { expect, test } from '@playwright/test'

import { installGoogleGuard } from './google-guard'

const PII = ['Test Guest', 'Test%20Guest', '5550100', 'test.guest@example.test', 'test.guest']

const LANDING =
  'https://mainhouse.canarycove.com:4173/?name=Test%20Guest&phone=5550100&email=test.guest@example.test&utm_source=newsletter'

test('pinned gtag keeps query PII out of page_view, form_start, and generate_lead', async ({ page }) => {
  const guard = await installGoogleGuard(page, { gtag: 'pinned' })
  await page.route('**/formspree.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )

  await page.goto(LANDING)
  await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(1)
  await expect.poll(() => guard.collectHits.filter((url) => url.includes('en=page_view')).length, { timeout: 15_000 }).toBe(1)

  await page.getByLabel('Nature of inquiry').fill('Synthetic inquiry for a mocked form.')
  await page.getByLabel('Name').fill('Test Guest')
  await page.getByLabel('Email').fill('test.guest@example.test')
  await page.getByTestId('inquiry-submit').click()
  await expect(page.getByTestId('inquiry-success')).toBeVisible()

  await expect.poll(() => guard.collectHits.filter((url) => url.includes('en=generate_lead')).length, { timeout: 15_000 }).toBe(1)

  const pageViews = guard.collectHits.filter((url) => url.includes('en=page_view'))
  const leads = guard.collectHits.filter((url) => url.includes('en=generate_lead'))
  expect(pageViews).toHaveLength(1)
  expect(leads).toHaveLength(1)

  const leaked = [...guard.collectHits, ...guard.googlePayloads, ...guard.seenGoogle].filter((value) =>
    PII.some((token) => value.includes(token)),
  )
  expect(leaked, `query PII reached a Google request:\n${leaked.join('\n')}`).toEqual([])
  expect(pageViews.some((url) => url.includes('utm_source=newsletter') || decodeURIComponent(url).includes('utm_source=newsletter'))).toBe(true)
  guard.assertNoGoogleLeak()
})
