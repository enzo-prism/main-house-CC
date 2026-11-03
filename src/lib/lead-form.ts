import { trackGenerateLead } from '@/lib/analytics'

export const INQUIRY_FORM_NAME = 'main_house_inquiry'

export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? 'https://formspree.io/f/xvzarybk'

export type LeadSubmitResult = {
  ok: boolean
  status: number
}

export function isSuccessfulLeadResponse(response: Pick<Response, 'ok' | 'status'>, body: unknown) {
  const flagged = body && typeof body === 'object' && 'ok' in body ? Boolean((body as { ok: unknown }).ok) : undefined
  if (flagged === false) return false
  return response.ok || flagged === true
}

export async function submitLeadForm(options: {
  endpoint: string
  formName: string
  body: FormData
}): Promise<LeadSubmitResult> {
  const response = await fetch(options.endpoint, {
    method: 'POST',
    body: options.body,
    headers: { Accept: 'application/json' },
  })

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  const ok = isSuccessfulLeadResponse(response, body)
  if (ok) {
    trackGenerateLead(options.formName)
  }

  return { ok, status: response.status }
}
