import { expect, test, type Page } from '@playwright/test'

const INQUIRY_FORM_NAME = 'main_house_inquiry'

type GaWindow = Window & {
  __gaEvents?: unknown[][]
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[]
}

const installAnalyticsRecorder = async (page: Page) => {
  await page.addInitScript(() => {
    const win = window as GaWindow
    win.__gaEvents = []
    win.dataLayer = win.dataLayer ?? []
    win.gtag = (...args: unknown[]) => {
      win.__gaEvents?.push(args)
      win.dataLayer?.push(args)
    }
  })
}

const getEvents = async (page: Page, name: string) =>
  page.evaluate((eventName) => {
    const win = window as GaWindow
    return (win.__gaEvents ?? []).filter((entry) => entry[0] === 'event' && entry[1] === eventName)
  }, name)

test.describe('GA4 on localhost / preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/formspree.io/**', (route) => route.abort())
    await page.route('https://example.test/**', (route) => route.abort())
    await page.route('**/googletagmanager.com/**', (route) => route.abort())
    await page.route('**/google-analytics.com/**', (route) => route.abort())
    await page.route('**/analytics.google.com/**', (route) => route.abort())
  })

  test('does not load the gtag script on localhost', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0)
    await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(0)
  })

  test('a route change fires one page_view after the initial load', async ({ page }) => {
    await installAnalyticsRecorder(page)
    await page.goto('/')
    await expect.poll(async () => (await getEvents(page, 'page_view')).length).toBe(1)

    await page.evaluate(() => window.history.pushState(null, '', '/#book'))
    await expect.poll(async () => (await getEvents(page, 'page_view')).length).toBe(2)

    const views = await getEvents(page, 'page_view')
    expect(views[0]?.[2]).toMatchObject({ page_path: '/', page_title: expect.any(String), page_location: expect.any(String) })
    expect(views[1]?.[2]).toMatchObject({ page_path: '/#book' })
  })

  test('successful inquiry submit fires generate_lead once with form_name and no PII', async ({ page }) => {
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
    })
    await installAnalyticsRecorder(page)
    await page.goto('/#book')
    await page.getByLabel('Nature of inquiry').fill('Planning a June reunion for eight.')
    await page.getByLabel('Name').fill('Alex Martin')
    await page.getByLabel('Email').fill('alex@example.com')
    await page.getByTestId('inquiry-submit').click()

    await expect(page.getByTestId('inquiry-success')).toBeVisible()
    await expect.poll(async () => (await getEvents(page, 'generate_lead')).length).toBe(1)
    const events = await getEvents(page, 'generate_lead')
    expect(events).toEqual([['event', 'generate_lead', { form_name: INQUIRY_FORM_NAME }]])
    expect(JSON.stringify(events)).not.toMatch(/Alex|alex@example\.com|reunion/i)
  })

  test('invalid or failed submits fire no generate_lead', async ({ page }) => {
    await installAnalyticsRecorder(page)
    await page.goto('/#book')
    await page.getByTestId('inquiry-submit').click()
    await expect(page.getByTestId('inquiry-error')).toBeVisible()
    expect(await getEvents(page, 'generate_lead')).toEqual([])

    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false }) })
    })
    await page.getByLabel('Nature of inquiry').fill('Trying the error path.')
    await page.getByLabel('Name').fill('Alex Martin')
    await page.getByLabel('Email').fill('alex@example.com')
    await page.getByTestId('inquiry-submit').click()
    await expect(page.getByTestId('inquiry-error')).toBeVisible()
    expect(await getEvents(page, 'generate_lead')).toEqual([])
  })
})
