import { SITE_URL } from '@/content'

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-JD6CV2CFYS'

export const PRODUCTION_HOSTS = ['mainhouse.canarycove.com', 'www.mainhouse.canarycove.com'] as const

export type AnalyticsPrimitive = string | number | boolean
export type AnalyticsParams = Record<string, AnalyticsPrimitive | null | undefined>

type GtagFn = {
  (command: 'js', date: Date): void
  (command: 'config', target: string, params?: { send_page_view?: boolean }): void
  (command: 'set', params: { page_location?: string; page_path?: string; page_title?: string; page_referrer?: string }): void
  (command: 'event', name: string, params?: AnalyticsParams): void
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
  }
}

const PII_PARAM_KEYS = new Set([
  'name',
  'email',
  'phone',
  'tel',
  'message',
  'inquiry',
  'body',
  'text',
  'first_name',
  'last_name',
  'firstName',
  'lastName',
  'full_name',
  'fullName',
])

const PRODUCTION_HOST_SET = new Set<string>(PRODUCTION_HOSTS)

export const ATTRIBUTION_QUERY_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
] as const

const ATTRIBUTION_QUERY_PARAM_SET = new Set<string>(ATTRIBUTION_QUERY_PARAMS)

let lastPageViewRoute: string | null = null
let lastSanitizedPageLocation: string | null = null
let historyPatched = false
const originalHistory = {
  pushState: typeof history !== 'undefined' ? history.pushState.bind(history) : null,
  replaceState: typeof history !== 'undefined' ? history.replaceState.bind(history) : null,
}

export function currentHostname() {
  if (typeof window === 'undefined') return ''
  return window.location.hostname
}

/** Exact production hosts only. `includes` / `endsWith` lookalikes must not pass. */
export function isProductionMainHouseHost(hostname = currentHostname()) {
  return PRODUCTION_HOST_SET.has(hostname)
}

export function shouldLoadGoogleAnalytics(hostname = currentHostname()) {
  return isProductionMainHouseHost(hostname)
}

export function sanitizeAnalyticsParams(params: AnalyticsParams = {}): Record<string, AnalyticsPrimitive> {
  const clean: Record<string, AnalyticsPrimitive> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue
    if (PII_PARAM_KEYS.has(key)) continue
    clean[key] = value
  }
  return clean
}

export function getRouteKey(url: URL | Location = window.location) {
  return url.pathname
}

export function attributionSearch(url: URL) {
  const kept = new URLSearchParams()
  for (const [key, value] of url.searchParams.entries()) {
    if (ATTRIBUTION_QUERY_PARAM_SET.has(key.toLowerCase())) kept.append(key, value)
  }
  const query = kept.toString()
  return query ? `?${query}` : ''
}

export function buildPageViewParams(source: string | URL | Location = window.location, pageTitle = document.title) {
  const url = source instanceof URL || isLocation(source) ? new URL(source.href) : new URL(source, SITE_URL)
  const query = attributionSearch(url)
  return {
    page_location: `${url.origin}${url.pathname}${query}`,
    page_path: `${url.pathname}${query}`,
    page_title: pageTitle,
  }
}

function isLocation(value: string | URL | Location): value is Location {
  return typeof value !== 'string' && !(value instanceof URL)
}

function installArgumentsGtag() {
  window.dataLayer = window.dataLayer ?? []
  if (typeof window.gtag === 'function') return
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- real gtag.js only processes Arguments objects
    window.dataLayer?.push(arguments)
  } as GtagFn
}

export function sanitizePageReferrer(
  referrer = typeof document !== 'undefined' ? document.referrer : '',
  previousLocation = lastSanitizedPageLocation,
  currentOrigin = typeof window !== 'undefined' ? window.location.origin : '',
) {
  if (previousLocation) return previousLocation
  if (!referrer) return undefined
  try {
    const url = new URL(referrer)
    if (currentOrigin && url.origin === currentOrigin) {
      return buildPageViewParams(url).page_location
    }
    return `${url.origin}/`
  } catch {
    return undefined
  }
}

export function setSanitizedPageLocation(source: string | URL | Location = window.location, pageTitle = document.title) {
  const params = buildPageViewParams(source, pageTitle)
  const pageReferrer = sanitizePageReferrer()
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', {
      page_location: params.page_location,
      ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
    })
  }
  lastSanitizedPageLocation = params.page_location
  return params
}

export function sendGoogleAnalyticsEvent(name: string, params?: AnalyticsParams) {
  if (typeof window === 'undefined') return
  const payload = sanitizeAnalyticsParams(params)
  if (typeof window.gtag !== 'function') {
    installArgumentsGtag()
  }
  window.gtag?.('event', name, payload)
}

export function sendPageView(source: string | URL | Location = window.location, pageTitle = document.title) {
  if (typeof window === 'undefined') return
  const resolved = source instanceof URL || isLocation(source) ? source : new URL(source, window.location.origin)
  const route = getRouteKey(resolved)
  if (route === lastPageViewRoute) return
  lastPageViewRoute = route
  const params = setSanitizedPageLocation(source, pageTitle)
  sendGoogleAnalyticsEvent('page_view', params)
}

export function trackGenerateLead(formName: string, extra?: AnalyticsParams) {
  const pageLocation = buildPageViewParams().page_location
  setSanitizedPageLocation()
  sendGoogleAnalyticsEvent('generate_lead', { form_name: formName, ...extra, page_location: pageLocation })
}

export function resetPageViewTracking() {
  lastPageViewRoute = null
  lastSanitizedPageLocation = null
}

export function notifyRouteChange() {
  sendPageView(window.location, document.title)
}

function bindHistoryMethod(method: 'pushState' | 'replaceState') {
  const original = originalHistory[method]
  if (!original) return
  history[method] = (...args: Parameters<History['pushState']>) => {
    original(...args)
    notifyRouteChange()
  }
}

export function startPageViewTracking() {
  if (typeof window === 'undefined') return () => {}

  sendPageView(window.location, document.title)

  window.addEventListener('popstate', notifyRouteChange)

  if (!historyPatched) {
    bindHistoryMethod('pushState')
    bindHistoryMethod('replaceState')
    historyPatched = true
  }

  return () => {
    window.removeEventListener('popstate', notifyRouteChange)
  }
}

function installGtagSnippet() {
  if (document.querySelector('script[data-ga4="gtag"]')) return

  installArgumentsGtag()
  window.gtag?.('js', new Date())
  window.gtag?.('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.dataset.ga4 = 'gtag'
  document.head.appendChild(script)
}

export function loadGoogleAnalytics(hostname = currentHostname()) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const allowed = shouldLoadGoogleAnalytics(hostname)
  if (allowed) {
    installGtagSnippet()
  }

  if (allowed || typeof window.gtag === 'function') {
    startPageViewTracking()
  }
}
