import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureAndroidSdk } from './setup-android-sdk.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const androidDir = join(root, 'android')
const keystorePath = join(androidDir, 'tomatotime-release.keystore')
const propsPath = join(androidDir, 'keystore.properties')
const credsPath = join(androidDir, 'SIGNING_CREDENTIALS.txt')
const isWin = process.platform === 'win32'
const gradlew = join(androidDir, isWin ? 'gradlew.bat' : 'gradlew')

function findJavaHome() {
  const candidates = isWin
    ? [
        join(process.env.ProgramFiles ?? '', 'Android', 'Android Studio', 'jbr'),
        join(process.env.LOCALAPPDATA ?? '', 'Programs', 'Android', 'Android Studio', 'jbr'),
        join(process.env['ProgramFiles(x86)'] ?? '', 'Android', 'Android Studio', 'jbr'),
        process.env.JAVA_HOME,
        join(process.env.ProgramFiles ?? '', 'Microsoft', 'jdk-17.0.19.10-hotspot'),
      ].filter(Boolean)
    : [process.env.JAVA_HOME]

  for (const c of candidates) {
    if (c && existsSync(join(c, 'bin', isWin ? 'java.exe' : 'java'))) {
      const version = spawnSync(
        join(c, 'bin', isWin ? 'java.exe' : 'java'),
        ['-version'],
        { encoding: 'utf8', shell: false },
      )
      const out = `${version.stderr}${version.stdout}`
      if (out.includes('version "21') || out.includes('version "22') || out.includes('version "23')) {
        return c
      }
    }
  }

  // Fallback: any Java (may fail on Capacitor 7 which needs 21+)
  for (const c of candidates) {
    if (c && existsSync(join(c, 'bin', isWin ? 'java.exe' : 'java'))) return c
  }

  const msDir = join(process.env.ProgramFiles ?? '', 'Microsoft')
  if (existsSync(msDir)) {
    for (const name of readdirSync(msDir)) {
      if (name.startsWith('jdk-')) {
        const p = join(msDir, name)
        if (existsSync(join(p, 'bin', isWin ? 'java.exe' : 'java'))) return p
      }
    }
  }

  return null
}

function run(cmd, args, opts = {}) {
  const useShell = opts.shell ?? !existsSync(cmd)
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: useShell,
    ...opts,
  })
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
}

function ensureKeystore(javaHome) {
  if (existsSync(keystorePath) && existsSync(propsPath)) {
    console.log('Keystore already exists — skipping generation.')
    return
  }

  const password = randomBytes(16).toString('base64url')
  const keytool = join(javaHome, 'bin', isWin ? 'keytool.exe' : 'keytool')

  console.log('Generating release keystore...')
  run(keytool, [
    '-genkeypair',
    '-v',
    '-keystore', keystorePath,
    '-alias', 'tomatotime',
    '-keyalg', 'RSA',
    '-keysize', '2048',
    '-validity', '10000',
    '-storepass', password,
    '-keypass', password,
    '-dname', 'CN=Studio 9, OU=Mobile, O=Studio 9, L=Lisbon, ST=Lisbon, C=PT',
  ])

  writeFileSync(
    propsPath,
    [
      'storeFile=../tomatotime-release.keystore',
      `storePassword=${password}`,
      'keyAlias=tomatotime',
      `keyPassword=${password}`,
      '',
    ].join('\n'),
  )

  writeFileSync(
    credsPath,
    [
      'TOMATO TIME — Release signing credentials',
      '=========================================',
      'KEEP THIS FILE SAFE. You need it for every Play Store update.',
      '',
      'Keystore : android/tomatotime-release.keystore',
      'Alias    : tomatotime',
      `Password : ${password}`,
      '',
      'Also stored in android/keystore.properties (gitignored).',
      'Back up the .keystore file to a password manager or encrypted drive.',
      '',
    ].join('\n'),
  )

  console.log('\nCredentials saved to android/SIGNING_CREDENTIALS.txt')
}

const javaHome = findJavaHome()
if (!javaHome) {
  console.error(`
ERROR: Java 21+ not found (Capacitor 7 requires JDK 21).

Use Android Studio's JDK or install:
  winget install Microsoft.OpenJDK.21

Then re-run: npm run aab
`)
  process.exit(1)
}

console.log(`Using JAVA_HOME: ${javaHome}`)
process.env.JAVA_HOME = javaHome

ensureKeystore(javaHome)

await ensureAndroidSdk()

console.log('\n1/2 Building web app + syncing Capacitor...')
run('npm', ['run', 'cap:sync'], { cwd: root })

console.log('\n2/2 Building signed release AAB...')
run(gradlew, ['bundleRelease'], {
  cwd: androidDir,
  shell: isWin,
  env: { ...process.env, JAVA_HOME: javaHome },
})

const aabSrc = join(androidDir, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab')
const aabOut = join(root, 'play-store', 'tomato-time-v1.0.0.aab')

if (!existsSync(aabSrc)) {
  console.error('AAB not found at expected path.')
  process.exit(1)
}

mkdirSync(join(root, 'play-store'), { recursive: true })
copyFileSync(aabSrc, aabOut)

console.log(`
Done!

Upload this file to Google Play Console:
  play-store/tomato-time-v1.0.0.aab

Signing credentials:
  android/SIGNING_CREDENTIALS.txt  (back this up!)
`)
