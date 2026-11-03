import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { expect, type Page } from '@playwright/test'

const STUB = readFileSync(fileURLToPath(new URL('./stubs/gtag.js', import.meta.url)), 'utf8')

export const GOOGLE_HOST_SUFFIXES = [
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
  'doubleclick.net',
  'googlesyndication.com',
] as const

export const NON_PROD_HOSTS = [
  'localhost',
  'canary-cove-main-house-git-main.vercel.app',
  'staging.mainhouse.canarycove.com',
  'mainhouse.canarycove.com.evil.test',
  'xmainhouse.canarycove.com',
] as const

export function isGoogleHost(hostname: string) {
  const host = hostname.toLowerCase()
  return GOOGLE_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))
}

export type GoogleGuard = {
  collectHits: string[]
  seenGoogle: string[]
  fulfilledGoogle: string[]
  assertNoGoogleLeak: () => void
}

export async function installGoogleGuard(page: Page): Promise<GoogleGuard> {
  const collectHits: string[] = []
  const seenGoogle: string[] = []
  const fulfilledGoogle: string[] = []

  page.on('request', (request) => {
    const url = new URL(request.url())
    if (isGoogleHost(url.hostname)) seenGoogle.push(url.href)
  })

  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (!isGoogleHost(url.hostname)) {
      await route.continue()
      return
    }

    fulfilledGoogle.push(url.href)

    if (url.pathname.includes('/gtag/js')) {
      await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: STUB })
      return
    }

    if (url.pathname.includes('/g/collect') || url.pathname.endsWith('/collect')) {
      collectHits.push(url.href)
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.fulfill({ status: 204, body: '' })
  })

  return {
    collectHits,
    seenGoogle,
    fulfilledGoogle,
    assertNoGoogleLeak() {
      const leaked = seenGoogle.filter((url) => !fulfilledGoogle.includes(url))
      expect(leaked, `request reached a real Google host: ${leaked.join(', ')}`).toEqual([])
    },
  }
}
