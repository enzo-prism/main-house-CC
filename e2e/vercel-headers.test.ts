import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

type VercelHeaderRule = {
  source: string
  headers: { key: string; value: string }[]
}

type VercelConfig = {
  headers?: VercelHeaderRule[]
}

describe('vercel.json Referrer-Policy', () => {
  it('sends strict-origin on every path', () => {
    const raw = readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8')
    const config = JSON.parse(raw) as VercelConfig
    const rule = config.headers?.find((entry) => entry.source === '/(.*)')
    expect(rule?.headers).toEqual([{ key: 'Referrer-Policy', value: 'strict-origin' }])
  })
})
