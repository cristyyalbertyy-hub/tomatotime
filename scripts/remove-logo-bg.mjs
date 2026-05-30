import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const input = join(__dirname, '../public/studio9 transparent.png')
const output = join(__dirname, '../public/studio9-transparent.png')

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
const total = width * height
const visited = new Uint8Array(total)
const toRemove = new Uint8Array(total)

function idx(x, y) {
  return y * width + x
}

function isBackgroundAt(i) {
  const o = i * 4
  const r = data[o]
  const g = data[o + 1]
  const b = data[o + 2]
  const avg = (r + g + b) / 3
  const spread = Math.max(r, g, b) - Math.min(r, g, b)
  return avg > 200 && spread < 35
}

const queue = []

for (let x = 0; x < width; x++) {
  queue.push(idx(x, 0), idx(x, height - 1))
}
for (let y = 0; y < height; y++) {
  queue.push(idx(0, y), idx(width - 1, y))
}

while (queue.length > 0) {
  const i = queue.pop()
  if (i === undefined || visited[i]) continue
  visited[i] = 1
  if (!isBackgroundAt(i)) continue

  toRemove[i] = 1
  const x = i % width
  const y = (i - x) / width
  if (x > 0) queue.push(i - 1)
  if (x < width - 1) queue.push(i + 1)
  if (y > 0) queue.push(i - width)
  if (y < height - 1) queue.push(i + width)
}

for (let i = 0; i < total; i++) {
  if (toRemove[i]) {
    data[i * 4 + 3] = 0
  }
}

await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(output)

console.log('Saved:', output, `(${width}x${height})`)
