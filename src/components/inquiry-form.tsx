import { useRef, useState, type FormEvent } from 'react'

import { phones } from '@/content'
import {
  FORM_ENDPOINT,
  INQUIRY_FORM_NAME,
  LEAD_FORM_ACCOMMODATION,
  LEAD_FORM_ENV,
  LEAD_FORM_RETURNING,
  LEAD_FORM_SITE,
  LEAD_FORM_SUBJECT,
  submitLeadForm,
} from '@/lib/lead-form'
import { cn } from '@/lib/utils'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type InquiryFormProps = {
  endpoint?: string
  formName?: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'preview' | 'error'

function isBlank(value: string) {
  return value.trim().length === 0
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim())
}

const fieldClass =
  'focus-ring w-full rounded-2xl border border-ink/15 bg-sand-light px-4 py-3 text-[15px] text-ink placeholder:text-muted-foreground'

/**
 * Main House availability inquiry. Posts to Formspree on production hosts only
 * and emits generate_lead only after a 2xx response with ok:true.
 */
export function InquiryForm({ endpoint = FORM_ENDPOINT, formName = INQUIRY_FORM_NAME }: InquiryFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [invalid, setInvalid] = useState<Set<string>>(new Set())
  const inFlight = useRef(false)

  const validate = (form: HTMLFormElement) => {
    const name = String(new FormData(form).get('name') ?? '')
    const email = String(new FormData(form).get('email') ?? '')
    const inquiry = String(new FormData(form).get('inquiry') ?? '')
    const next = new Set<string>()
    let message: string | null = null

    if (isBlank(inquiry)) {
      next.add('inquiry')
      message = 'Please add a short nature of inquiry before sending.'
    } else if (isBlank(name)) {
      next.add('name')
      message = 'Please enter your name so we know who we are replying to.'
    } else if (isBlank(email) || !isValidEmail(email)) {
      next.add('email')
      message = 'Please enter a valid email address so we can reply.'
    }

    setInvalid(next)
    setError(message)
    return next.size === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inFlight.current) return

    const form = event.currentTarget
    const honeypot = String(new FormData(form).get('_gotcha') ?? '')
    if (!isBlank(honeypot)) {
      form.reset()
      setStatus('success')
      setError(null)
      return
    }

    if (!validate(form)) return

    inFlight.current = true
    setStatus('submitting')
    setError(null)

    const body = new FormData(form)
    body.delete('_gotcha')

    try {
      const result = await submitLeadForm({ endpoint, formName, body })
      if (result.ok) {
        form.reset()
        setStatus(result.posted ? 'success' : 'preview')
        return
      }
      setStatus('error')
      setError('Something went wrong. Please try again or call us.')
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again or call us.')
    } finally {
      inFlight.current = false
    }
  }

  const renderStatus = (current: FormStatus) => {
    switch (current) {
      case 'success':
        return (
          <div className="flow flow-md" data-testid="inquiry-success" role="status">
            <h3 className="text-title">Thanks — we have your note.</h3>
            <p className="text-body max-w-md">
              The Canary Cove team will reply within one business day about your Main House dates.
            </p>
          </div>
        )
      case 'preview':
        return (
          <div className="flow flow-md" data-testid="inquiry-success" data-preview="true" role="status">
            <h3 className="text-title">Preview — nothing was sent.</h3>
            <p className="text-body max-w-md">
              This is a non-production host. The inquiry was not posted to Formspree and no message was delivered.
            </p>
          </div>
        )
      case 'idle':
      case 'submitting':
      case 'error':
        return (
          <form
            method="POST"
            action={endpoint}
            onSubmit={handleSubmit}
            noValidate
            data-testid="inquiry-form"
            className="flow flow-md"
          >
            <input type="hidden" name="site" value={LEAD_FORM_SITE} />
            <input type="hidden" name="env" value={LEAD_FORM_ENV} />
            <input type="hidden" name="_subject" value={LEAD_FORM_SUBJECT} />
            <input type="hidden" name="accommodation" value={LEAD_FORM_ACCOMMODATION} />
            <input type="hidden" name="returning" value={LEAD_FORM_RETURNING} />
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="inquiry-gotcha">Company website</label>
              <input id="inquiry-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" data-testid="inquiry-gotcha" />
            </div>
            <div className="flow flow-xs">
              <label htmlFor="inquiry-nature" className="text-[13px] font-medium text-foreground">
                Nature of inquiry
              </label>
              <textarea
                id="inquiry-nature"
                name="inquiry"
                rows={4}
                required
                autoComplete="off"
                placeholder="Dates, group size, reunion plans, or a question…"
                aria-invalid={invalid.has('inquiry') || undefined}
                aria-describedby={invalid.has('inquiry') ? 'inquiry-error' : 'inquiry-helper'}
                className={fieldClass}
              />
              <p id="inquiry-helper" className="text-xs text-muted-foreground">
                Tell us the reason for this note. We read every one.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flow flow-xs">
                <label htmlFor="inquiry-name" className="text-[13px] font-medium text-foreground">
                  Name
                </label>
                <input
                  id="inquiry-name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Test Guest"
                  aria-invalid={invalid.has('name') || undefined}
                  className={fieldClass}
                />
              </div>
              <div className="flow flow-xs">
                <label htmlFor="inquiry-email" className="text-[13px] font-medium text-foreground">
                  Email
                </label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  placeholder="test.guest@example.test"
                  aria-invalid={invalid.has('email') || undefined}
                  className={fieldClass}
                />
              </div>
            </div>
            {error ? (
              <p id="inquiry-error" role="alert" data-testid="inquiry-error" className="text-sm text-destructive">
                {error}{' '}
                {current === 'error' ? (
                  <a href={phones[0].href} className="link-underline font-medium">
                    {phones[0].display}
                  </a>
                ) : null}
              </p>
            ) : null}
            <button
              type="submit"
              data-testid="inquiry-submit"
              disabled={status === 'submitting'}
              className={cn(
                'focus-ring inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-sand-light transition-colors hover:bg-lagoon disabled:opacity-60',
              )}
            >
              {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
            </button>
          </form>
        )
      default: {
        const _exhaustive: never = current
        return _exhaustive
      }
    }
  }

  return (
    <div
      className="rounded-[28px] border border-border/70 bg-surface p-5 shadow-[var(--shadow-soft)] sm:p-8"
      data-testid="inquiry-form-card"
    >
      <div className="flow flow-sm mb-6">
        <p className="eyebrow eyebrow-plain">Request availability</p>
        <h3 className="text-title max-w-[16ch]">Include the nature of your inquiry.</h3>
      </div>
      {renderStatus(status)}
    </div>
  )
}
