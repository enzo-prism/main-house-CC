import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('./certs', import.meta.url))
mkdirSync(dir, { recursive: true })

const cert = `${dir}/cert.pem`
const key = `${dir}/key.pem`
if (existsSync(cert) && existsSync(key)) process.exit(0)

const names = [
  'DNS:localhost',
  'DNS:mainhouse.canarycove.com',
  'DNS:www.mainhouse.canarycove.com',
  'DNS:staging.mainhouse.canarycove.com',
  'DNS:mainhouse.canarycove.com.evil.test',
  'DNS:xmainhouse.canarycove.com',
  'DNS:canary-cove-main-house-git-main.vercel.app',
  'IP:127.0.0.1',
]

execFileSync('openssl', [
  'req',
  '-x509',
  '-newkey',
  'rsa:2048',
  '-keyout',
  key,
  '-out',
  cert,
  '-days',
  '3650',
  '-nodes',
  '-subj',
  '/CN=localhost',
  '-addext',
  `subjectAltName=${names.join(',')}`,
])
