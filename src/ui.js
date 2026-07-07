import pc from 'picocolors'
import { createInterface } from 'node:readline'

const SEPARATOR = pc.dim('─'.repeat(process.stdout.columns || 60))

export function showHeader() {
  console.log()
  console.log(pc.cyan(pc.bold('vestprompt')) + pc.dim(' v0.1.0'))
  console.log(pc.dim('AI Prompt Optimizer — type rough, get sharp.'))
  console.log(SEPARATOR)
  console.log()
}

export function showSeparator() {
  console.log()
  console.log(SEPARATOR)
  console.log()
}

export function showResult(text) {
  console.log(pc.green(pc.bold('✓ Optimized Prompt')))
  console.log()
  console.log(pc.white(text))
  console.log()
}

export function showError(title, message, stack) {
  console.error(pc.red(pc.bold(`✗ ${title}`)))
  console.error()
  console.error(pc.red(message))
  if (stack) {
    console.error()
    console.error(pc.dim(stack))
  }
  console.error()
}

export function collectMultilineInput() {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const lines = []
    console.log(pc.cyan('Enter your raw prompt'))
    console.log(pc.dim('(Press Ctrl+D or Enter on empty line when done)'))
    console.log()

    rl.on('line', (line) => {
      if (line.trim() === '' && lines.length > 0) {
        rl.close()
      } else {
        lines.push(line)
      }
    })

    rl.on('close', () => {
      resolve(lines.join('\n').trim())
    })
  })
}
