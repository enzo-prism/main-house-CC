import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InquiryForm } from '@/components/inquiry-form'
import { INQUIRY_FORM_NAME } from '@/lib/lead-form'

const ENDPOINT = 'https://example.test/forms'

function mockGtag() {
  const gtag = vi.fn()
  window.gtag = gtag
  window.dataLayer = []
  return gtag
}

function mockFetch(ok: boolean, status = ok ? 200 : 500) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => ({ ok }),
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function fillValidInquiry(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nature of inquiry'), 'Planning a June reunion for eight.')
  await user.type(screen.getByLabelText('Name'), 'Alex Martin')
  await user.type(screen.getByLabelText('Email'), 'alex@example.com')
}

describe('InquiryForm generate_lead', () => {
  beforeEach(() => {
    cleanup()
    mockGtag()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('fires generate_lead once with form_name after a successful submit', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    const fetchMock = mockFetch(true)

    render(<InquiryForm endpoint={ENDPOINT} />)
    await fillValidInquiry(user)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(await screen.findByTestId('inquiry-success')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: INQUIRY_FORM_NAME })
    const params = gtag.mock.calls[0]?.[2] as Record<string, unknown>
    expect(JSON.stringify(params)).not.toMatch(/Alex|alex@example\.com|reunion/i)
  })

  it('fires nothing on an invalid submit', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    const fetchMock = mockFetch(true)

    render(<InquiryForm endpoint={ENDPOINT} />)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(screen.getByTestId('inquiry-error')).toHaveTextContent('nature of inquiry')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).not.toHaveBeenCalled()
  })

  it('fires nothing when the endpoint fails', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    mockFetch(false, 500)

    render(<InquiryForm endpoint={ENDPOINT} />)
    await fillValidInquiry(user)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(await screen.findByTestId('inquiry-error')).toBeInTheDocument()
    expect(gtag).not.toHaveBeenCalled()
  })

  it('does not fire generate_lead on click (production path)', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    mockFetch(true)

    render(<InquiryForm endpoint={ENDPOINT} />)
    await user.click(screen.getByTestId('inquiry-submit'))
    expect(gtag).not.toHaveBeenCalled()
  })

  it('catches a mutant that fires generate_lead on click', async () => {
    const user = userEvent.setup()
    const gtag = mockGtag()
    mockFetch(true)

    render(<InquiryForm endpoint={ENDPOINT} mutantFireOnClick />)
    await user.click(screen.getByTestId('inquiry-submit'))

    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: INQUIRY_FORM_NAME })
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('inquiry-error')).toBeInTheDocument()
  })
})
