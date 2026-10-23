// Prerenders the single page into dist/index.html so crawlers, link
// previews and first paint get the full markup; the client then hydrates.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const template = await readFile(`${root}dist/index.html`, 'utf8')
const { render } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error('prerender: #root placeholder not found in dist/index.html')

const html = render()
await writeFile(`${root}dist/index.html`, template.replace(marker, `<div id="root">${html}</div>`))
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`prerender: wrote ${(html.length / 1024).toFixed(1)} KB of markup into dist/index.html`)
