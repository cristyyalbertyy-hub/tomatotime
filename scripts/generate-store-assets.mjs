import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

await mkdir(join(root, 'play-store'), { recursive: true })

await sharp(join(root, 'assets', 'feature-graphic.svg'))
  .resize(1024, 500)
  .png()
  .toFile(join(root, 'play-store', 'feature-graphic.png'))

console.log('Generated play-store/feature-graphic.png (1024x500)')
