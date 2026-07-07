import pc from 'picocolors'
import figlet from 'figlet'
import { createInterface } from 'node:readline'

const dim = pc.dim
const bold = pc.bold
const green = pc.green
const red = pc.red

let logoLines = []

function termW() {
  return process.stdout.columns || 80
}

function center(text) {
  const pad = Math.max(0, Math.floor((termW() - text.length) / 2))
  return ' '.repeat(pad) + text
}

function renderLogo() {
  if (logoLines.length === 0) return
  const w = termW()
  console.log()
  if (w >= 87) {
    for (const l of logoLines) {
      console.log(center(red(l)))
    }
  } else if (logoLines.length > 0) {
    console.log(center(red(bold('vestprompt'))))
  }
  console.log()
}

export function showTUI() {
  try {
    const raw = figlet.textSync('VESTPROMPT', { font: 'ANSI Shadow' })
    logoLines = raw.replace(/\n$/, '').split('\n')
  } catch {
    logoLines = []
  }
}

export function collectInput() {
  return new Promise((resolve) => {
    renderLogo()

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    console.log(`  ${bold('Enter your raw prompt:')}`)
    console.log(`  ${dim('(Press Ctrl+D or Enter on empty line when done)')}`)
    console.log()

    const lines = []

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

    rl.on('SIGINT', () => {
      rl.close()
      process.exit(0)
    })
  })
}

export async function showProcessing() {
  console.log()
  const { default: ora } = await import('ora')
  const spinner = ora({
    text: dim('Analyzing intent & optimizing structure...'),
    spinner: 'dots',
    color: 'cyan',
  }).start()
  return spinner
}

function stripMarkdown(text) {
  return text.replace(/\*\*/g, '')
}

export function displayResult(text) {
  const sep = dim('\u2500'.repeat(Math.min(termW(), 60)))

  console.log()
  console.log(`  ${sep}`)
  console.log()
  console.log(`  ${green(bold('\u2713 Optimized Prompt'))}`)
  console.log()

  const cleaned = stripMarkdown(text)
  for (const line of cleaned.split('\n')) {
    console.log(`  ${line}`)
  }

  console.log()
  console.log(`  ${sep}`)
  console.log()
}

export function displayError(title, message, stack) {
  console.log()
  console.log(`  ${red(bold('\u2716 ' + title))}`)
  console.log()

  for (const line of message.split('\n')) {
    console.log(`  ${red(line)}`)
  }

  if (stack) {
    console.log()
    for (const line of stack.split('\n').slice(0, 5)) {
      console.log(`  ${dim(line)}`)
    }
  }

  console.log()
}
