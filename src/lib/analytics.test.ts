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
  it('loads only on production Main House hostnames', () => {
    expect(shouldLoadGoogleAnalytics('mainhouse.canarycove.com')).toBe(true)
    expect(shouldLoadGoogleAnalytics('www.mainhouse.canarycove.com')).toBe(true)
  })

  it('does not load on localhost, previews, or test hosts', () => {
    expect(shouldLoadGoogleAnalytics('localhost')).toBe(false)
    expect(shouldLoadGoogleAnalytics('127.0.0.1')).toBe(false)
    expect(shouldLoadGoogleAnalytics('canary-cove-main-house-git-main.vercel.app')).toBe(false)
    expect(shouldLoadGoogleAnalytics('canary-cove-main-house-abc123.vercel.app')).toBe(false)
  })

  it('defaults the measurement ID to the shared Canary Cove property', () => {
    expect(GA_MEASUREMENT_ID).toBe('G-JD6CV2CFYS')
  })

  it('does not inject the gtag script on a preview hostname', () => {
    loadGoogleAnalytics('canary-cove-main-house.vercel.app')
    expect(document.querySelector('script[data-ga4="gtag"]')).toBeNull()
    expect(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')).toBeNull()
  })
})

describe('page_view', () => {
  beforeEach(() => {
    resetPageViewTracking()
    window.history.replaceState(null, '', '/')
    document.title = 'Canary Cove Main House'
  })

  afterEach(() => {
    resetPageViewTracking()
  })

  it('sends page_location, page_path, and page_title', () => {
    expect(buildPageViewParams(new URL('https://mainhouse.canarycove.com/#book'), 'Rates')).toEqual({
      page_location: 'https://mainhouse.canarycove.com/#book',
      page_path: '/#book',
      page_title: 'Rates',
    })
  })

  it('fires exactly one page_view on the initial route and one more on a route change', () => {
    const gtag = mockGtag()
    const stop = startPageViewTracking()

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_location: window.location.href,
      page_path: '/',
      page_title: 'Canary Cove Main House',
    })

    window.history.pushState(null, '', '/#book')
    expect(gtag).toHaveBeenCalledTimes(2)
    expect(gtag).toHaveBeenLastCalledWith('event', 'page_view', {
      page_location: window.location.href,
      page_path: '/#book',
      page_title: 'Canary Cove Main House',
    })

    sendPageView()
    expect(gtag).toHaveBeenCalledTimes(2)
    stop()
  })
})

describe('generate_lead params', () => {
  it('keeps form_name and drops PII keys', () => {
    expect(
      sanitizeAnalyticsParams({
        form_name: 'main_house_inquiry',
        name: 'Alex Martin',
        email: 'alex@example.com',
        phone: '+1 555 123 1234',
        message: 'Planning a reunion',
      }),
    ).toEqual({ form_name: 'main_house_inquiry' })
  })

  it('never forwards PII on generate_lead', () => {
    const gtag = mockGtag()
    trackGenerateLead('main_house_inquiry', {
      name: 'Alex Martin',
      email: 'alex@example.com',
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
