import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InquiryForm } from '@/components/inquiry-form'
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
  })

  it('prerenders as a POST to the form endpoint', () => {
    render(<InquiryForm endpoint={ENDPOINT} />)
    const form = screen.getByTestId('inquiry-form')
    expect(form).toHaveAttribute('method', 'POST')
    expect(form).toHaveAttribute('action', ENDPOINT)
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
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', { form_name: INQUIRY_FORM_NAME })
    const params = gtag.mock.calls[0]?.[2] as Record<string, unknown>
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
})
