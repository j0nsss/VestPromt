#!/usr/bin/env node

import { loadEnv } from '../src/config.js'
import { initAI, optimizePrompt } from '../src/ai.js'
import { showTUI, collectInput, showProcessing, displayResult, displayError } from '../src/ui.js'

async function main() {
  let env
  try {
    env = loadEnv()
  } catch (err) {
    console.error('Configuration Error:', err.message)
    process.exit(1)
  }

  showTUI()
  const rawInput = await collectInput()

  if (!rawInput) {
    displayError('Empty Input', 'No prompt was provided. Please try again.')
    process.exit(1)
  }

  const spinner = await showProcessing()

  try {
    initAI(env.GEMINI_API_KEY)
    const optimized = await optimizePrompt(rawInput)

    spinner.stop()
    displayResult(optimized)
  } catch (err) {
    spinner.stop()
    displayError('Optimization Failed', err.message, err.stack)
    process.exit(1)
  }
}

main()
