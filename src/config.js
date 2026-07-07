import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PROJECT_ROOT = resolve(__dirname, '..')
const ENV_PATH = resolve(PROJECT_ROOT, '.env')

export function loadEnv() {
  let envContent
  try {
    envContent = readFileSync(ENV_PATH, 'utf-8')
  } catch {
    throw new Error(
      `.env file not found at ${ENV_PATH}\n` +
      'Create a .env file with:\n' +
      '  GEMINI_API_KEY=your_key_here\n' +
      `See ${resolve(PROJECT_ROOT, '.env.example')} for reference.`
    )
  }

  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!key) continue
    process.env[key] = value
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set in .env\n' +
      `Open ${ENV_PATH} and add: GEMINI_API_KEY=your_key_here`
    )
  }

  return {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    PROJECT_ROOT,
    ENV_PATH,
  }
}
