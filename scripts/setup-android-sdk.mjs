import { spawnSync } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const androidDir = join(root, 'android')
const sdkRoot = join(root, '.android-sdk')
const localProps = join(androidDir, 'local.properties')
const isWin = process.platform === 'win32'

const CMDLINE_URL =
  'https://dl.google.com/android/repository/commandlinetools-win-13114758_latest.zip'

function findJavaHome() {
  const msDir = join(process.env.ProgramFiles ?? '', 'Microsoft')
  if (existsSync(msDir)) {
    for (const name of readdirSync(msDir)) {
      if (name.startsWith('jdk-')) {
        const p = join(msDir, name)
        if (existsSync(join(p, 'bin', isWin ? 'java.exe' : 'java'))) return p
      }
    }
  }
  return process.env.JAVA_HOME ?? null
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  await pipeline(res.body, createWriteStream(dest))
}

function sdkmanagerPath() {
  return join(sdkRoot, 'cmdline-tools', 'latest', 'bin', isWin ? 'sdkmanager.bat' : 'sdkmanager')
}

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: typeof cmd === 'string' && !existsSync(cmd),
    env: { ...process.env, ...env },
  })
  if (result.status !== 0) throw new Error(`Failed: ${cmd} ${args.join(' ')}`)
}

async function extractZip(zipPath, destDir) {
  if (isWin) {
    mkdirSync(destDir, { recursive: true })
    run('powershell', [
      '-NoProfile',
      '-Command',
      `Expand-Archive -Path '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force`,
    ])
    return
  }
  run('unzip', ['-q', zipPath, '-d', destDir])
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  for (const name of readdirSync(src)) {
    const from = join(src, name)
    const to = join(dest, name)
    if (isWin) {
      run('xcopy', [from, to, '/E', '/I', '/Y'], {})
    } else {
      run('cp', ['-r', from, to])
    }
  }
}

function acceptLicenses(sdkmanager, env) {
  const licensesDir = join(sdkRoot, 'licenses')
  mkdirSync(licensesDir, { recursive: true })
  const hashes = [
    '24333f8a63b6825ea9c5514f83f282b074b17b437000000',
    '84831b94096429a541abe492059855341c000000',
    'd975f751698a77b662f12534ddbeedbe1a000000',
    '33b6a2b64607f11b759f320ef9dff34ae000000',
  ]
  for (const hash of hashes) {
    writeFileSync(join(licensesDir, hash), '')
  }
  spawnSync('cmd', ['/c', `(for /l %i in (1,1,20) do @echo y) | "${sdkmanager}" --sdk_root=${sdkRoot} --licenses`], {
    stdio: 'ignore',
    env: { ...process.env, ...env },
  })
}

export async function ensureAndroidSdk() {
  if (existsSync(localProps)) return

  const javaHome = findJavaHome()
  if (!javaHome) {
    throw new Error('JDK required. Run: winget install Microsoft.OpenJDK.17')
  }

  mkdirSync(sdkRoot, { recursive: true })

  const sm = sdkmanagerPath()
  if (!existsSync(sm)) {
    const zipPath = join(sdkRoot, 'cmdline-tools.zip')
    console.log('Downloading Android command-line tools...')
    await download(CMDLINE_URL, zipPath)
    const tmp = join(sdkRoot, '_tmp')
    rmSync(tmp, { recursive: true, force: true })
    console.log('Extracting...')
    await extractZip(zipPath, tmp)
    mkdirSync(join(sdkRoot, 'cmdline-tools', 'latest'), { recursive: true })
    copyDir(join(tmp, 'cmdline-tools'), join(sdkRoot, 'cmdline-tools', 'latest'))
    rmSync(tmp, { recursive: true, force: true })
  }

  const sdkmanager = sdkmanagerPath()
  const env = { JAVA_HOME: javaHome, ANDROID_HOME: sdkRoot }

  console.log('Installing SDK packages (may take a few minutes)...')
  acceptLicenses(sdkmanager, env)
  for (const pkg of ['platform-tools', 'platforms;android-35', 'build-tools;35.0.0']) {
    run(sdkmanager, [`--sdk_root=${sdkRoot}`, pkg], env)
  }

  writeFileSync(localProps, `sdk.dir=${sdkRoot.replace(/\\/g, '/')}\n`)
  console.log(`Android SDK ready → ${localProps}`)
}

if (process.argv[1]?.endsWith('setup-android-sdk.mjs')) {
  await ensureAndroidSdk()
}
