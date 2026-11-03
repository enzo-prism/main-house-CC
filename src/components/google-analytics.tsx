import { useEffect } from 'react'

import { loadGoogleAnalytics } from '@/lib/analytics'

/** Loads gtag on production Main House hosts and sends one page_view per route. */
export function GoogleAnalytics() {
  useEffect(() => {
    loadGoogleAnalytics()
  }, [])

  return null
}
