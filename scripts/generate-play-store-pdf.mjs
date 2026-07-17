import { chromium } from 'playwright'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const htmlPath = join(root, 'docs', 'tomato-time-play-store-production.html')
const pdfPath = join(root, 'play-store', 'Tomato-Time-Play-Store-Production.pdf')

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' })
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', right: '14mm', bottom: '16mm', left: '14mm' },
})
await browser.close()

console.log(`PDF generated: ${pdfPath}`)
