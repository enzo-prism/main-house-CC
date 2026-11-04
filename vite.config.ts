import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const e2eCert = fileURLToPath(new URL('./e2e/certs/cert.pem', import.meta.url))
const e2eKey = fileURLToPath(new URL('./e2e/certs/key.pem', import.meta.url))
const e2eHttps = process.env.E2E_HTTPS === '1' && existsSync(e2eCert) && existsSync(e2eKey)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  preview: {
    allowedHosts: true,
    headers: {
      'Referrer-Policy': 'strict-origin',
    },
    https: e2eHttps
      ? {
          cert: readFileSync(e2eCert),
          key: readFileSync(e2eKey),
        }
      : undefined,
  },
})
