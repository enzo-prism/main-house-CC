export const GOOGLE_HOST_SUFFIXES = [
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'google.com',
] as const

export function isGoogleHost(hostname: string) {
  const host = hostname.toLowerCase()
  return GOOGLE_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))
}
