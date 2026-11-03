import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dest = fileURLToPath(new URL('./stubs/gtag.pinned.js', import.meta.url))
const shaFile = fileURLToPath(new URL('./stubs/gtag.pinned.js.sha256', import.meta.url))
const expected = readFileSync(shaFile, 'utf8').trim().split(/\s+/)[0]
const source = process.env.PINNED_GTAG_URL ?? 'https://www.googletagmanager.com/gtag/js?id=G-JD6CV2CFYS'

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

if (existsSync(dest)) {
  const actual = sha256(readFileSync(dest))
  if (actual === expected) {
    console.log(`pinned gtag cache hit ${expected}`)
    process.exit(0)
  }
  console.warn(`pinned gtag cache mismatch (got ${actual}), re-fetching`)
}

const response = await fetch(source)
if (!response.ok) {
  throw new Error(`failed to fetch pinned gtag: ${response.status} ${source}`)
}

const body = Buffer.from(await response.arrayBuffer())
const actual = sha256(body)
if (actual !== expected) {
  throw new Error(`pinned gtag sha256 mismatch\nexpected ${expected}\nactual   ${actual}\nurl      ${source}`)
}

mkdirSync(fileURLToPath(new URL('./stubs', import.meta.url)), { recursive: true })
writeFileSync(dest, body)
console.log(`pinned gtag fetched ${expected}`)
