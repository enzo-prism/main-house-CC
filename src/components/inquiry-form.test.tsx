import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InquiryForm } from '@/components/inquiry-form'
import * as analytics from '@/lib/analytics'
import { FORM_ENDPOINT, INQUIRY_FORM_NAME } from '@/lib/lead-form'

const ENDPOINT = 'https://example.test/forms'

function mockGtag() {
  const gtag = vi.fn()
  window.gtag = gtag
  window.dataLayer = []
  return gtag
}

function mockFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ ok: true }),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function fillValidInquiry(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nature of inquiry'), 'Synthetic inquiry for a mocked form.')
  await user.type(screen.getByLabelText('Name'), 'Test Guest')
  await user.type(screen.getByLabelText('Email'), 'test.guest@example.test')
}

describe('InquiryForm generate_lead', () => {
  beforeEach(() => {
    cleanup()
    mockGtag()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('prerenders as a POST to the form endpoint', () => {
    render(<InquiryForm endpoint={ENDPOINT} />)
    const form = screen.getByTestId('inquiry-form')
    expect(form).toHaveAttribute('method', 'POST')
    expect(form).toHaveAttribute('action', ENDPOINT)
    expect(form.querySelector('input[name="site"]')).toHaveAttribute('value', 'main_house')
    expect(form.querySelector('input[name="env"]')).toHaveAttribute('value', 'preview')
    expect(form.querySelector('input[name="_subject"]')).toHaveAttribute('value', 'Main House inquiry')
    expect(form.querySelector('input[name="accommodation"]')).toHaveAttribute('value', 'main-house')
    expect(form.querySelector('input[name="returning"]')).toHaveAttribute('value', 'yes')
  })

  it('prerenders a neutral env=nojs before hydration', () => {
    const html = renderToString(<InquiryForm endpoint={ENDPOINT} />)
    expect(html).toMatch(/name="env"[^>]*value="nojs"|value="nojs"[^>]*name="env"/)
  })

  it('hydrates env from the host after mount', async () => {
    render(<InquiryForm endpoint={ENDPOINT} />)
    await waitFor(() => {
      expect(screen.getByTestId('inquiry-form').querySelector('input[name="env"]')).toHaveAttribute('value', 'preview')
    })
  })

  it('uses the production Formspree action by default', () => {
    render(<InquiryForm />)
    expect(screen.getByTestId('inquiry-form')).toHaveAttribute('action', FORM_ENDPOINT)
  })

  it('fires generate_lead once with form_name after a successful local submit and does not POST', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    const fetchMock = mockFetch()

    render(<InquiryForm endpoint={ENDPOINT} />)
    await fillValidInquiry(user)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(await screen.findByTestId('inquiry-success')).toBeInTheDocument()
    expect(screen.getByTestId('inquiry-success')).toHaveTextContent('nothing was sent')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({ form_name: INQUIRY_FORM_NAME }))
    const params = gtag.mock.calls.find((call) => call[0] === 'event')?.[2] as Record<string, unknown>
    expect(JSON.stringify(params)).not.toMatch(/Test Guest|test\.guest@example\.test|Synthetic/i)
  })

  it('fires nothing on an invalid submit', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    const fetchMock = mockFetch()

    render(<InquiryForm endpoint={ENDPOINT} />)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(screen.getByTestId('inquiry-error')).toHaveTextContent('nature of inquiry')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).not.toHaveBeenCalled()
  })

  it('does not fire generate_lead on click', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    mockFetch()

    render(<InquiryForm endpoint={ENDPOINT} />)
    await user.click(screen.getByTestId('inquiry-submit'))
    expect(gtag).not.toHaveBeenCalled()
  })

  it('does not POST or fire generate_lead when the honeypot is filled', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    const fetchMock = mockFetch()

    render(<InquiryForm endpoint={ENDPOINT} />)
    await fillValidInquiry(user)
    await user.type(screen.getByTestId('inquiry-gotcha'), 'https://spam.example.test')
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(await screen.findByTestId('inquiry-success')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).not.toHaveBeenCalled()
  })

  it('does not fire generate_lead when fetch rejects', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    vi.spyOn(analytics, 'isProductionMainHouseHost').mockReturnValue(true)
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'))
    vi.stubGlobal('fetch', fetchMock)

    render(<InquiryForm endpoint={ENDPOINT} />)
    await fillValidInquiry(user)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(await screen.findByTestId('inquiry-error')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(gtag).not.toHaveBeenCalled()
  })

  it('sends only one POST when requestSubmit is called twice synchronously', async () => {
    const gtag = mockGtag()
    vi.spyOn(analytics, 'isProductionMainHouseHost').mockReturnValue(true)
    let release: ((value: { ok: boolean; status: number; json: () => Promise<{ ok: boolean }> }) => void) | undefined
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve
        }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<InquiryForm endpoint={ENDPOINT} />)
    const user = userEvent.setup()
    await fillValidInquiry(user)

    const form = screen.getByTestId('inquiry-form') as HTMLFormElement
    form.requestSubmit()
    form.requestSubmit()

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(gtag).not.toHaveBeenCalled()
    release?.({ ok: true, status: 200, json: async () => ({ ok: true }) })

    expect(await screen.findByTestId('inquiry-success')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({ form_name: INQUIRY_FORM_NAME }))
  })

  it('allows a retry after a failed submit', async () => {
    const gtag = mockGtag()
    vi.spyOn(analytics, 'isProductionMainHouseHost').mockReturnValue(true)
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<InquiryForm endpoint={ENDPOINT} />)
    const user = userEvent.setup()
    await fillValidInquiry(user)
    await user.click(screen.getByTestId('inquiry-submit'))
    expect(await screen.findByTestId('inquiry-error')).toBeInTheDocument()
    expect(gtag).not.toHaveBeenCalled()

    await user.click(screen.getByTestId('inquiry-submit'))
    expect(await screen.findByTestId('inquiry-success')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({ form_name: INQUIRY_FORM_NAME }))
  })
})
