import { SITE_URL } from '@/content'

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-JD6CV2CFYS'

export const PRODUCTION_HOSTS = ['mainhouse.canarycove.com', 'www.mainhouse.canarycove.com'] as const

export type AnalyticsPrimitive = string | number | boolean
export type AnalyticsParams = Record<string, AnalyticsPrimitive | null | undefined>

type GtagFn = {
  (command: 'js', date: Date): void
  (command: 'config', target: string, params?: { send_page_view?: boolean }): void
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

let lastPageViewRoute: string | null = null
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

export function buildPageViewParams(source: string | URL | Location = window.location, pageTitle = document.title) {
  const url = source instanceof URL || isLocation(source) ? new URL(source.href) : new URL(source, SITE_URL)
  return {
    page_location: `${url.origin}${url.pathname}`,
    page_path: url.pathname,
    page_title: pageTitle,
  }
}

function isLocation(value: string | URL | Location): value is Location {
  return typeof value !== 'string' && !(value instanceof URL)
}

export function sendGoogleAnalyticsEvent(name: string, params?: AnalyticsParams) {
  if (typeof window === 'undefined') return
  const payload = sanitizeAnalyticsParams(params)
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload)
    return
  }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(['event', name, payload])
}

export function sendPageView(source: string | URL | Location = window.location, pageTitle = document.title) {
  if (typeof window === 'undefined') return
  const resolved = source instanceof URL || isLocation(source) ? source : new URL(source, window.location.origin)
  const route = getRouteKey(resolved)
  if (route === lastPageViewRoute) return
  lastPageViewRoute = route
  sendGoogleAnalyticsEvent('page_view', buildPageViewParams(source, pageTitle))
}

export function trackGenerateLead(formName: string, extra?: AnalyticsParams) {
  sendGoogleAnalyticsEvent('generate_lead', { form_name: formName, ...extra })
}

export function resetPageViewTracking() {
  lastPageViewRoute = null
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

  window.dataLayer = window.dataLayer ?? []
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    } as GtagFn
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

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
