import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { expect, type Page } from '@playwright/test'

import { isGoogleHost } from './google-hosts'

export { GOOGLE_HOST_SUFFIXES, isGoogleHost } from './google-hosts'

const STUB = readFileSync(fileURLToPath(new URL('./stubs/gtag.js', import.meta.url)), 'utf8')
const PINNED_PATH = fileURLToPath(new URL('./stubs/gtag.pinned.js', import.meta.url))

function pinnedGtag() {
  try {
    return readFileSync(PINNED_PATH, 'utf8')
  } catch {
    throw new Error('Pinned gtag.js is missing. Run: node e2e/fetch-pinned-gtag.mjs')
  }
}

export const NON_PROD_HOSTS = [
  'localhost',
  'canary-cove-main-house-git-main.vercel.app',
  'staging.mainhouse.canarycove.com',
  'mainhouse.canarycove.com.evil.test',
  'xmainhouse.canarycove.com',
] as const

const LOCAL_PREVIEW_HOSTS = new Set<string>([
  '127.0.0.1',
  'localhost',
  'mainhouse.canarycove.com',
  'www.mainhouse.canarycove.com',
  ...NON_PROD_HOSTS,
])

export type GoogleGuard = {
  collectHits: string[]
  googlePayloads: string[]
  seenGoogle: string[]
  fulfilledGoogle: string[]
  assertNoGoogleLeak: () => void
}

export async function installGoogleGuard(
  page: Page,
  options?: { gtag?: 'stub' | 'pinned'; stripReferrerPolicy?: boolean },
): Promise<GoogleGuard> {
  const collectHits: string[] = []
  const googlePayloads: string[] = []
  const seenGoogle: string[] = []
  const fulfilledGoogle: string[] = []
  const gtagBody = options?.gtag === 'pinned' ? pinnedGtag() : STUB

  page.on('request', (request) => {
    const url = new URL(request.url())
    if (!isGoogleHost(url.hostname)) return
    seenGoogle.push(url.href)
    googlePayloads.push([request.url(), request.postData() ?? ''].join('\n'))
  })

  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (!isGoogleHost(url.hostname)) {
      if (options?.stripReferrerPolicy && LOCAL_PREVIEW_HOSTS.has(url.hostname)) {
        const fetchUrl = new URL(url.href)
        fetchUrl.hostname = '127.0.0.1'
        const response = await route.fetch({ url: fetchUrl.href })
        const headers = { ...response.headers() }
        delete headers['referrer-policy']
        await route.fulfill({ response, headers })
        return
      }
      await route.continue()
      return
    }

    fulfilledGoogle.push(url.href)

    if (url.pathname.includes('/gtag/js')) {
      await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: gtagBody })
      return
    }

    if (url.pathname.includes('/g/collect') || url.pathname.endsWith('/collect') || url.pathname.includes('/ccm/')) {
      collectHits.push(url.href)
      await route.fulfill({ status: 204, body: '' })
      return
    }

    await route.fulfill({ status: 204, body: '' })
  })

  return {
    collectHits,
    googlePayloads,
    seenGoogle,
    fulfilledGoogle,
    assertNoGoogleLeak() {
      const leaked = seenGoogle.filter((url) => !fulfilledGoogle.includes(url))
      expect(leaked, `request reached a real Google host: ${leaked.join(', ')}`).toEqual([])
    },
  }
}
