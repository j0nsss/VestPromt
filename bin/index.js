#!/usr/bin/env node

import { loadEnv } from '../src/config.js'
import { initAI, optimizePrompt } from '../src/ai.js'
import { startTUI, showProcessing, displayResult, displayError } from '../src/tui.js'

async function main() {
  let env
  try {
    env = loadEnv()
  } catch (err) {
    console.error('Configuration Error:', err.message)
    process.exit(1)
  }

  const rawInput = await startTUI()

  if (!rawInput) {
    displayError('Empty Input', 'No prompt was provided. Please try again.')
    process.exit(1)
  }

  const spinner = showProcessing()

  try {
    initAI(env.GEMINI_API_KEY)
    const optimized = await optimizePrompt(rawInput)

    spinner.stop()
    console.log()
    displayResult(optimized)
  } catch (err) {
    spinner.stop()
    displayError('Optimization Failed', err.message, err.stack)
    process.exit(1)
  }
}

main()
