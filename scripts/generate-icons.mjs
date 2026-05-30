import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const iconSvg = join(root, 'assets', 'icon.svg')

const sizes = {
  'play-store/icon-512.png': 512,
  'public/icon-192.png': 192,
  'public/icon-512.png': 512,
  'public/favicon.png': 32,
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png': 48,
  'android/app/src/main/res/mipmap-hdpi/ic_launcher.png': 72,
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png': 96,
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png': 144,
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png': 192,
}

for (const [rel, size] of Object.entries(sizes)) {
  const out = join(root, rel)
  await mkdir(dirname(out), { recursive: true })
  await sharp(iconSvg).resize(size, size).png().toFile(out)
  if (rel.includes('mipmap-') && rel.endsWith('ic_launcher.png')) {
    const roundOut = out.replace('ic_launcher.png', 'ic_launcher_round.png')
    await sharp(iconSvg).resize(size, size).png().toFile(roundOut)
  }
  console.log(`Generated ${rel} (${size}x${size})`)
}

await writeFile(
  join(root, 'assets', 'README.md'),
  `# App icon assets\n\n- \`icon.svg\` — source icon (1024×1024, happy tomato)\n- Run \`node scripts/generate-icons.mjs\` to regenerate PNGs\n- \`play-store/icon-512.png\` — upload to Google Play Console\n`,
)

console.log('Done.')
