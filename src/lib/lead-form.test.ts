import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { INQUIRY_FORM_NAME, isSuccessfulLeadResponse, submitLeadForm, tagLeadFormBody } from '@/lib/lead-form'

const PROD_HOST = 'mainhouse.canarycove.com'

function mockGtag() {
  const gtag = vi.fn()
  window.gtag = gtag
  window.dataLayer = []
  return gtag
}

describe('lead response success', () => {
  it('accepts only a 2xx response with ok:true', () => {
    expect(isSuccessfulLeadResponse({ ok: true, status: 200 }, { ok: true })).toBe(true)
  })

  it('rejects a 2xx response without ok:true', () => {
    expect(isSuccessfulLeadResponse({ ok: true, status: 200 }, {})).toBe(false)
    expect(isSuccessfulLeadResponse({ ok: true, status: 204 }, null)).toBe(false)
  })

  it('rejects a 400 with {ok:true}', () => {
    expect(isSuccessfulLeadResponse({ ok: false, status: 400 }, { ok: true })).toBe(false)
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

  it('fires generate_lead once after a 200 with ok:true on production', async () => {
    const gtag = mockGtag()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const body = new FormData()
    body.set('name', 'Test Guest')
    body.set('email', 'test.guest@example.test')
    body.set('inquiry', 'Synthetic inquiry for a mocked form.')

    const result = await submitLeadForm({
      endpoint: 'https://example.test/forms',
      formName: INQUIRY_FORM_NAME,
      body,
      hostname: PROD_HOST,
    })

    expect(result).toEqual({ ok: true, status: 200, posted: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: INQUIRY_FORM_NAME })
    expect(body.get('site')).toBe('main_house')
    expect(body.get('env')).toBe('prod')
  })

  it('does not fire generate_lead on a 400 with {ok:true}', async () => {
    const gtag = mockGtag()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ ok: true }),
      }),
    )

    const result = await submitLeadForm({
      endpoint: 'https://example.test/forms',
      formName: INQUIRY_FORM_NAME,
      body: new FormData(),
      hostname: PROD_HOST,
    })

    expect(result.ok).toBe(false)
    expect(result.status).toBe(400)
    expect(gtag).not.toHaveBeenCalled()
  })

  it('fires nothing on a network error', async () => {
    const gtag = mockGtag()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(
      submitLeadForm({
        endpoint: 'https://example.test/forms',
        formName: INQUIRY_FORM_NAME,
        body: new FormData(),
        hostname: PROD_HOST,
      }),
    ).rejects.toThrow('offline')
    expect(gtag).not.toHaveBeenCalled()
  })

  it('does not POST on non-prod hosts and still records a local mocked success', async () => {
    const gtag = mockGtag()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const result = await submitLeadForm({
      endpoint: 'https://example.test/forms',
      formName: INQUIRY_FORM_NAME,
      body: new FormData(),
      hostname: 'localhost',
    })

    expect(result).toEqual({ ok: true, status: 200, posted: false })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: INQUIRY_FORM_NAME })
  })

  it('tags production posts with site and env', () => {
    const body = tagLeadFormBody(new FormData())
    expect(body.get('site')).toBe('main_house')
    expect(body.get('env')).toBe('prod')
  })
})
