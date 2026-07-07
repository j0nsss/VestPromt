#!/usr/bin/env node

import { loadEnv } from '../src/config.js'
import { initAI, optimizePrompt } from '../src/ai.js'
import { showHeader, showSeparator, showResult, showError, collectMultilineInput } from '../src/ui.js'

process.on('SIGINT', () => {
  console.log('\n')
  process.exit(0)
})

async function main() {
  let env
  try {
    env = loadEnv()
  } catch (err) {
    showError('Configuration Error', err.message, err.stack)
    process.exit(1)
  }

  showHeader()
  const rawInput = await collectMultilineInput()

  if (!rawInput) {
    showError('Empty Input', 'No prompt was provided. Please try again.')
    process.exit(1)
  }

  const { default: ora } = await import('ora')
  const spinner = ora({
    text: 'Analyzing & optimizing your prompt...',
    color: 'cyan',
  }).start()

  try {
    initAI(env.GEMINI_API_KEY)
    const optimized = await optimizePrompt(rawInput)

    spinner.stop()
    showSeparator()
    showResult(optimized)
    showSeparator()
  } catch (err) {
    spinner.stop()
    showError('Optimization Failed', err.message, err.stack)
    process.exit(1)
  }
}

main()
