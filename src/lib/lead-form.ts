import { isProductionMainHouseHost, trackGenerateLead } from '@/lib/analytics'

export const INQUIRY_FORM_NAME = 'main_house_inquiry'

export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? 'https://formspree.io/f/xvzarybk'

export type LeadSubmitResult = {
  ok: boolean
  status: number
  posted: boolean
}

export function isSuccessfulLeadResponse(response: Pick<Response, 'ok' | 'status'>, body: unknown) {
  if (!response.ok) return false
  return Boolean(body && typeof body === 'object' && (body as { ok?: unknown }).ok === true)
}

export function shouldPostLeadForm(hostname?: string) {
  return isProductionMainHouseHost(hostname)
}

export function tagLeadFormBody(body: FormData) {
  body.set('site', 'main_house')
  body.set('env', 'prod')
  return body
}

export async function submitLeadForm(options: {
  endpoint: string
  formName: string
  body: FormData
  hostname?: string
}): Promise<LeadSubmitResult> {
  if (!shouldPostLeadForm(options.hostname)) {
    trackGenerateLead(options.formName)
    return { ok: true, status: 200, posted: false }
  }

  tagLeadFormBody(options.body)

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

  return { ok, status: response.status, posted: true }
}
