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

export type GoogleGuard = {
  collectHits: string[]
  googlePayloads: string[]
  seenGoogle: string[]
  fulfilledGoogle: string[]
  assertNoGoogleLeak: () => void
}

export async function installGoogleGuard(page: Page, options?: { gtag?: 'stub' | 'pinned' }): Promise<GoogleGuard> {
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
