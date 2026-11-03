import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { INQUIRY_FORM_NAME, isSuccessfulLeadResponse, submitLeadForm } from '@/lib/lead-form'

function mockGtag() {
  const gtag = vi.fn()
  window.gtag = gtag
  window.dataLayer = []
  return gtag
}

describe('lead response success', () => {
  it('accepts a 2xx response', () => {
    expect(isSuccessfulLeadResponse({ ok: true, status: 200 }, {})).toBe(true)
  })

  it('accepts ok:true even when status is non-2xx', () => {
    expect(isSuccessfulLeadResponse({ ok: false, status: 202 }, { ok: true })).toBe(true)
  })

  it('rejects ok:false even on HTTP 200', () => {
    expect(isSuccessfulLeadResponse({ ok: true, status: 200 }, { ok: false })).toBe(false)
  })
})

describe('submitLeadForm', () => {
  beforeEach(() => {
    mockGtag()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fires generate_lead once after a successful submit', async () => {
    const gtag = mockGtag()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      }),
    )

    const body = new FormData()
    body.set('name', 'Alex Martin')
    body.set('email', 'alex@example.com')
    body.set('inquiry', 'June reunion for eight')

    const result = await submitLeadForm({
      endpoint: 'https://example.test/forms',
      formName: INQUIRY_FORM_NAME,
      body,
    })

    expect(result.ok).toBe(true)
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: INQUIRY_FORM_NAME })
  })

  it('fires nothing on a network error', async () => {
    const gtag = mockGtag()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(
      submitLeadForm({
        endpoint: 'https://example.test/forms',
        formName: INQUIRY_FORM_NAME,
        body: new FormData(),
      }),
    ).rejects.toThrow('offline')
    expect(gtag).not.toHaveBeenCalled()
  })

  it('fires nothing when the endpoint returns an error', async () => {
    const gtag = mockGtag()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ ok: false }),
      }),
    )

    const result = await submitLeadForm({
      endpoint: 'https://example.test/forms',
      formName: INQUIRY_FORM_NAME,
      body: new FormData(),
    })

    expect(result.ok).toBe(false)
    expect(gtag).not.toHaveBeenCalled()
  })
})
