import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { defineConfig, devices } from '@playwright/test'

execFileSync(process.execPath, [fileURLToPath(new URL('./e2e/make-certs.mjs', import.meta.url))])

const hostMaps = [
  'MAP mainhouse.canarycove.com 127.0.0.1',
  'MAP www.mainhouse.canarycove.com 127.0.0.1',
  'MAP staging.mainhouse.canarycove.com 127.0.0.1',
  'MAP mainhouse.canarycove.com.evil.test 127.0.0.1',
  'MAP xmainhouse.canarycove.com 127.0.0.1',
  'MAP canary-cove-main-house-git-main.vercel.app 127.0.0.1',
  'MAP googletagmanager.com 127.0.0.1',
  'MAP *.googletagmanager.com 127.0.0.1',
  'MAP google-analytics.com 127.0.0.1',
  'MAP *.google-analytics.com 127.0.0.1',
  'MAP analytics.google.com 127.0.0.1',
  'MAP *.analytics.google.com 127.0.0.1',
  'MAP doubleclick.net 127.0.0.1',
  'MAP *.doubleclick.net 127.0.0.1',
  'MAP googlesyndication.com 127.0.0.1',
  'MAP *.googlesyndication.com 127.0.0.1',
].join(', ')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'https://127.0.0.1:4173',
    ignoreHTTPSErrors: true,
    trace: 'off',
    launchOptions: {
      args: [
        `--host-resolver-rules=${hostMaps}`,
        '--disable-features=HttpsUpgrades,HttpsFirstMode,HttpsFirstModeV2,HttpsFirstBalancedMode',
        '--hsts-bypass-list=vercel.app',
        '--ignore-certificate-errors',
      ],
    },
  },
  webServer: {
    command: 'E2E_HTTPS=1 pnpm preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'https://127.0.0.1:4173',
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
