import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dest = fileURLToPath(new URL('./stubs/gtag.pinned.js', import.meta.url))
const shaFile = fileURLToPath(new URL('./stubs/gtag.pinned.js.sha256', import.meta.url))
const source = process.env.PINNED_GTAG_URL ?? 'https://www.googletagmanager.com/gtag/js?id=G-JD6CV2CFYS'

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

function allowedDigests() {
  return new Set(
    readFileSync(shaFile, 'utf8')
      .split('\n')
      .map((line) => line.replace(/#.*$/, '').trim().split(/\s+/)[0])
      .filter((line) => /^[0-9a-f]{64}$/.test(line)),
  )
}

function assertLooksLikeGtag(buf) {
  const text = buf.toString('utf8')
  if (buf.length < 100_000 || !text.includes('dataLayer') || !text.includes('gtag')) {
    throw new Error('fetched file does not look like gtag.js')
  }
}

const allowed = allowedDigests()
if (allowed.size === 0) {
  throw new Error(`no sha256 pins in ${shaFile}`)
}

if (existsSync(dest)) {
  const cached = readFileSync(dest)
  const actual = sha256(cached)
  if (allowed.has(actual)) {
    console.log(`pinned gtag cache hit ${actual}`)
    process.exit(0)
  }
  console.warn(`pinned gtag cache mismatch (got ${actual}), re-fetching`)
}

const response = await fetch(source)
if (!response.ok) {
  throw new Error(`failed to fetch pinned gtag: ${response.status} ${source}`)
}

const body = Buffer.from(await response.arrayBuffer())
assertLooksLikeGtag(body)
const actual = sha256(body)
if (!allowed.has(actual)) {
  throw new Error(
    `pinned gtag sha256 mismatch\nexpected one of ${[...allowed].join(' ')}\nactual   ${actual}\nurl      ${source}`,
  )
}

mkdirSync(fileURLToPath(new URL('./stubs', import.meta.url)), { recursive: true })
writeFileSync(dest, body)
console.log(`pinned gtag fetched ${actual}`)
