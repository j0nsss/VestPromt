import pc from 'picocolors'
import { createInterface } from 'node:readline'

const dim = pc.dim
const cyan = pc.cyan
const green = pc.green
const red = pc.red
const bold = pc.bold
const yellow = pc.yellow

export function showHeader() {
  console.log()
  console.log(`  ${cyan(bold('◆'))}  ${bold('vestprompt')} ${dim('v0.1.0')}`)
  console.log()
}

function stripMarkdown(text) {
  return text.replace(/\*\*/g, '')
}

export function showResult(optimized) {
  console.log(`  ${green(bold('Optimized Prompt'))}`)
  console.log()
  const lines = optimized.split('\n')
  for (const line of lines) {
    console.log(`  ${stripMarkdown(line)}`)
  }
  console.log()
}

export function showError(title, message, stack) {
  console.log()
  console.log(`  ${red(bold(title))}`)
  console.log()
  for (const line of message.split('\n')) {
    console.log(`  ${red(line)}`)
  }
  if (stack) {
    console.log()
    const stackLines = stack.split('\n').slice(0, 6)
    for (const line of stackLines) {
      console.log(`  ${dim(line)}`)
    }
  }
  console.log()
}

export function collectMultilineInput() {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const lines = []
    console.log(`  ${bold('Enter your raw prompt')}`)
    console.log(`  ${dim('(Ctrl+D or blank line to submit)')}`)
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
