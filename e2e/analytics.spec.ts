import { expect, test, type Page } from '@playwright/test'

import { installGoogleGuard } from './google-guard'

const FORMSPREE_ACTION = 'https://formspree.io/f/xvzarybk'

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

test.describe('GA4 on localhost', () => {
  test.beforeEach(async ({ page }) => {
    await installGoogleGuard(page)
    await page.route('**/formspree.io/**', (route) => route.abort())
    await page.route('https://example.test/**', (route) => route.abort())
  })

  test('does not load the gtag script on localhost', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0)
    await expect(page.locator('script[data-ga4="gtag"]')).toHaveCount(0)
  })

  test('a path change fires one page_view and a hash change does not', async ({ page }) => {
    await installAnalyticsRecorder(page)
    await page.goto('/')
    await expect.poll(async () => (await getEvents(page, 'page_view')).length).toBe(1)

    await page.evaluate(() => window.history.pushState(null, '', '/#book'))
    await expect.poll(async () => (await getEvents(page, 'page_view')).length).toBe(1)

    await page.evaluate(() => window.history.pushState(null, '', '/rates?utm_source=test#section'))
    await expect.poll(async () => (await getEvents(page, 'page_view')).length).toBe(2)

    const views = await getEvents(page, 'page_view')
    expect(views[0]?.[2]).toMatchObject({ page_path: '/', page_title: expect.any(String) })
    expect(String((views[0]?.[2] as { page_location?: string }).page_location)).not.toMatch(/[?#]/)
    expect(views[1]?.[2]).toEqual({
      page_location: `${new URL(page.url()).origin}/rates?utm_source=test`,
      page_path: '/rates?utm_source=test',
      page_title: expect.any(String),
    })
  })

  test('prerendered inquiry form is a POST to Formspree', async ({ page }) => {
    await page.goto('/#book')
    const form = page.getByTestId('inquiry-form')
    await expect(form).toHaveAttribute('method', 'POST')
    await expect(form).toHaveAttribute('action', FORMSPREE_ACTION)
    await expect(form.locator('input[name="site"]')).toHaveValue('main_house')
    await expect(form.locator('input[name="env"]')).toHaveValue('prod')
  })

  test('successful inquiry submit fires generate_lead once with form_name and no PII', async ({ page }) => {
    const posts: string[] = []
    page.on('request', (request) => {
      if (request.method() === 'POST' && request.url().includes('formspree.io')) posts.push(request.url())
    })
    await installAnalyticsRecorder(page)
    await page.goto('/#book')
    await page.getByLabel('Nature of inquiry').fill('Synthetic inquiry for a mocked form.')
    await page.getByLabel('Name').fill('Test Guest')
    await page.getByLabel('Email').fill('test.guest@example.test')
    await page.getByTestId('inquiry-submit').click()

    await expect(page.getByTestId('inquiry-success')).toBeVisible()
    await expect(page.getByTestId('inquiry-success')).toContainText('nothing was sent')
    await expect.poll(async () => (await getEvents(page, 'generate_lead')).length).toBe(1)
    expect(await getEvents(page, 'generate_lead')).toEqual([['event', 'generate_lead', { form_name: INQUIRY_FORM_NAME }]])
    expect(JSON.stringify(await getEvents(page, 'generate_lead'))).not.toMatch(/Test Guest|test\.guest@example\.test|Synthetic/i)
    expect(posts).toEqual([])
  })

  test('invalid or honeypot submits fire no generate_lead', async ({ page }) => {
    await installAnalyticsRecorder(page)
    await page.goto('/#book')
    await page.getByTestId('inquiry-submit').click()
    await expect(page.getByTestId('inquiry-error')).toBeVisible()
    expect(await getEvents(page, 'generate_lead')).toEqual([])

    await page.getByLabel('Nature of inquiry').fill('Synthetic inquiry for a mocked form.')
    await page.getByLabel('Name').fill('Test Guest')
    await page.getByLabel('Email').fill('test.guest@example.test')
    await page.locator('[name="_gotcha"]').fill('https://spam.example.test')
    await page.getByTestId('inquiry-submit').click()
    await expect(page.getByTestId('inquiry-success')).toBeVisible()
    expect(await getEvents(page, 'generate_lead')).toEqual([])
  })
})
