import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { createServer } from 'node:net'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'play-store', 'screenshots')

const scenes = [
  { name: '01-ready-to-focus', scene: 'idle' },
  { name: '02-session-in-progress', scene: 'work' },
  { name: '03-break-time', scene: 'break' },
  { name: '04-journey-complete', scene: 'celebrate' },
  { name: '05-harvest', scene: 'harvest' },
]

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })
}

function waitForApp(url, timeoutMs = 30000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const res = await fetch(url)
        const html = await res.text()
        if (res.ok && html.includes('Tomato Time')) return resolve()
      } catch { /* retry */ }
      if (Date.now() - start > timeoutMs) {
        reject(new Error('Tomato Time preview server did not start'))
      } else {
        setTimeout(check, 400)
      }
    }
    check()
  })
}

const port = await findFreePort()
const base = `http://127.0.0.1:${port}`

const preview = spawn(
  'npx',
  ['vite', 'preview', '--port', String(port), '--host', '127.0.0.1'],
  { cwd: root, shell: true, stdio: 'ignore' },
)

try {
  await waitForApp(base)
  await mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1080, height: 2400 },
    deviceScaleFactor: 1,
  })

  for (const { name, scene } of scenes) {
    const page = await context.newPage()
    await page.goto(`${base}/?screenshot=${scene}`, { waitUntil: 'networkidle' })
    await page.waitForSelector('.app', { timeout: 10000 })
    await page.waitForTimeout(800)
    await page.screenshot({
      path: join(outDir, `${name}.png`),
      fullPage: false,
    })
    await page.close()
    console.log(`Captured ${name}.png`)
  }

  await browser.close()
  console.log(`\nScreenshots saved to play-store/screenshots/`)
} finally {
  preview.kill()
}
