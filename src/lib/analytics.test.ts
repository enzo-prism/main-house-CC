import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  GA_MEASUREMENT_ID,
  buildPageViewParams,
  loadGoogleAnalytics,
  resetPageViewTracking,
  sanitizeAnalyticsParams,
  sendPageView,
  shouldLoadGoogleAnalytics,
  startPageViewTracking,
  trackGenerateLead,
} from '@/lib/analytics'

function mockGtag() {
  const gtag = vi.fn()
  window.gtag = gtag
  window.dataLayer = []
  return gtag
}

describe('Google Analytics host gating', () => {
  it('loads only on exact production Main House hostnames', () => {
    expect(shouldLoadGoogleAnalytics('mainhouse.canarycove.com')).toBe(true)
    expect(shouldLoadGoogleAnalytics('www.mainhouse.canarycove.com')).toBe(true)
  })

  it('rejects localhost, previews, and lookalikes that an includes() mutant would accept', () => {
    expect(shouldLoadGoogleAnalytics('localhost')).toBe(false)
    expect(shouldLoadGoogleAnalytics('127.0.0.1')).toBe(false)
    expect(shouldLoadGoogleAnalytics('canary-cove-main-house-git-main.vercel.app')).toBe(false)
    expect(shouldLoadGoogleAnalytics('staging.mainhouse.canarycove.com')).toBe(false)
    expect(shouldLoadGoogleAnalytics('mainhouse.canarycove.com.evil.test')).toBe(false)
  })

  it('rejects prefix lookalikes that an endsWith() mutant would accept', () => {
    expect(shouldLoadGoogleAnalytics('xmainhouse.canarycove.com')).toBe(false)
    expect(shouldLoadGoogleAnalytics('notmainhouse.canarycove.com')).toBe(false)
    expect(shouldLoadGoogleAnalytics('staging.mainhouse.canarycove.com')).toBe(false)
  })

  it('defaults the measurement ID to the shared Canary Cove property', () => {
    expect(GA_MEASUREMENT_ID).toBe('G-JD6CV2CFYS')
  })

  it('does not inject the gtag script on a preview hostname', () => {
    loadGoogleAnalytics('canary-cove-main-house.vercel.app')
    expect(document.querySelector('script[data-ga4="gtag"]')).toBeNull()
    expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).toBeNull()
  })

  it('queues Arguments objects and disables the automatic page_view', () => {
    delete window.gtag
    window.dataLayer = []
    loadGoogleAnalytics('mainhouse.canarycove.com')

    expect(window.dataLayer?.length).toBeGreaterThan(0)
    for (const entry of window.dataLayer ?? []) {
      expect(Object.prototype.toString.call(entry)).toBe('[object Arguments]')
    }

    const queued = (window.dataLayer ?? []).map((entry) => Array.prototype.slice.call(entry as IArguments))
    expect(queued.some((entry) => entry[0] === 'js')).toBe(true)
    expect(queued).toContainEqual(['config', GA_MEASUREMENT_ID, { send_page_view: false }])
    expect(
      queued.some((entry) => {
        const params = entry[2] as { send_page_view?: boolean } | undefined
        return entry[0] === 'config' && params?.send_page_view === true
      }),
    ).toBe(false)

    document.querySelector('script[data-ga4="gtag"]')?.remove()
    delete window.gtag
  })
})

describe('page_view', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    resetPageViewTracking()
    document.title = 'Canary Cove Main House'
  })

  afterEach(() => {
    resetPageViewTracking()
  })

  it('keeps attribution params and drops other query keys and the hash', () => {
    expect(
      buildPageViewParams(
        new URL(
          'https://mainhouse.canarycove.com/book?utm_source=newsletter&utm_medium=email&utm_campaign=reunion&utm_id=spring&gclid=TestGclid&gbraid=TestGbraid&wbraid=TestWbraid&name=Test%20Guest&email=test.guest@example.test&guest=test#form',
        ),
        'Book',
      ),
    ).toEqual({
      page_location:
        'https://mainhouse.canarycove.com/book?utm_source=newsletter&utm_medium=email&utm_campaign=reunion&utm_id=spring&gclid=TestGclid&gbraid=TestGbraid&wbraid=TestWbraid',
      page_path:
        '/book?utm_source=newsletter&utm_medium=email&utm_campaign=reunion&utm_id=spring&gclid=TestGclid&gbraid=TestGbraid&wbraid=TestWbraid',
      page_title: 'Book',
    })
  })

  it('drops PII query keys when no attribution params are present', () => {
    expect(
      buildPageViewParams(
        new URL('https://mainhouse.canarycove.com/book?name=Test%20Guest&email=test.guest@example.test#form'),
        'Book',
      ),
    ).toEqual({
      page_location: 'https://mainhouse.canarycove.com/book',
      page_path: '/book',
      page_title: 'Book',
    })
  })

  it('fires exactly one page_view on the initial route and one more on a path change', () => {
    const gtag = mockGtag()
    const stop = startPageViewTracking()

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_location: `${window.location.origin}/`,
      page_path: '/',
      page_title: 'Canary Cove Main House',
    })

    window.history.pushState(null, '', '/rates')
    expect(gtag).toHaveBeenCalledTimes(2)
    expect(gtag).toHaveBeenLastCalledWith('event', 'page_view', {
      page_location: `${window.location.origin}/rates`,
      page_path: '/rates',
      page_title: 'Canary Cove Main House',
    })

    sendPageView()
    expect(gtag).toHaveBeenCalledTimes(2)
    stop()
  })

  it('does not send a second page_view when tracking is started twice', () => {
    const gtag = mockGtag()
    const stopFirst = startPageViewTracking()
    const stopSecond = startPageViewTracking()
    expect(gtag).toHaveBeenCalledTimes(1)
    stopFirst()
    stopSecond()
  })

  it('does not send a page_view for in-page hash changes', () => {
    const gtag = mockGtag()
    const stop = startPageViewTracking()
    expect(gtag).toHaveBeenCalledTimes(1)

    window.history.pushState(null, '', '/#book')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(gtag).toHaveBeenCalledTimes(1)
    stop()
  })
})

describe('generate_lead params', () => {
  it('keeps form_name and drops PII keys', () => {
    expect(
      sanitizeAnalyticsParams({
        form_name: 'main_house_inquiry',
        name: 'Test Guest',
        email: 'test.guest@example.test',
        phone: '+1 555 0100',
        message: 'Synthetic inquiry for a mocked form.',
      }),
    ).toEqual({ form_name: 'main_house_inquiry' })
  })

  it('never forwards PII on generate_lead', () => {
    const gtag = mockGtag()
    trackGenerateLead('main_house_inquiry', {
      name: 'Test Guest',
      email: 'test.guest@example.test',
      phone: '555',
      message: 'hello',
    })
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: 'main_house_inquiry' })
    const params = gtag.mock.calls[0]?.[2] as Record<string, unknown>
    expect(params).not.toHaveProperty('name')
    expect(params).not.toHaveProperty('email')
    expect(params).not.toHaveProperty('phone')
    expect(params).not.toHaveProperty('message')
  })
})
