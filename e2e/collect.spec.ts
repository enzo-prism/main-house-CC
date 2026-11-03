import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

const COLLECT_LOG = fileURLToPath(new URL('./artifacts/gtag-collect-hits.json', import.meta.url))
const COLLECT_SCREENSHOT = fileURLToPath(new URL('./artifacts/gtag-prod-hostname.png', import.meta.url))

test('records gtag collect hits when the hostname is forced to production', async ({ page }) => {
  const hits: { url: string; method: string }[] = []
  const onHit = (request: { url: () => string; method: () => string }) => {
    const url = request.url()
    if (/google-analytics|googletagmanager|analytics\.google|g\/collect/i.test(url)) {
      hits.push({ url, method: request.method() })
    }
  }
  page.on('request', onHit)
  page.on('requestfailed', onHit)

  await page.route('**/formspree.io/**', (route) => route.abort())
  const gtagScript = page.waitForRequest(/googletagmanager\.com\/gtag\/js/, { timeout: 15_000 })
  await page.goto('http://mainhouse.canarycove.com:4173/')
  await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(1)
  await gtagScript
  await expect
    .poll(() => hits.some((hit) => /\/g\/collect|google-analytics\.com\/collect/.test(hit.url)), { timeout: 15_000 })
    .toBe(true)
  await page.screenshot({ path: COLLECT_SCREENSHOT, fullPage: false })

  mkdirSync(dirname(COLLECT_LOG), { recursive: true })
  writeFileSync(
    COLLECT_LOG,
    `${JSON.stringify(
      {
        hostname: 'mainhouse.canarycove.com',
        pageUrl: page.url(),
        hits,
      },
      null,
      2,
    )}\n`,
  )
  expect(hits.some((hit) => hit.url.includes('JD6CV2CFYS'))).toBe(true)
})
