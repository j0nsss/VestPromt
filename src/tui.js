import pc from 'picocolors'
import { createInterface } from 'node:readline'

const dim = pc.dim
const bold = pc.bold
const blue = pc.blue

let linesTyped = []
let inputY = 0
let boxX = 0

function termWidth() {
  return process.stdout.columns || 80
}

function center(text) {
  const w = termWidth()
  const l = Math.max(0, Math.floor((w - text.length) / 2))
  return ' '.repeat(l) + text
}

export function showTUI() {
  console.clear()

  const w = termWidth()
  const boxW = Math.min(70, Math.floor(w * 0.72))
  boxX = Math.floor((w - boxW) / 2)
  const p = ' '.repeat(boxX)

  console.log()
  console.log(center(blue(bold('vestprompt'))))
  console.log()

  console.log(p + dim('\u250c' + '\u2500'.repeat(boxW - 2) + '\u2510'))

  const indicator = '\x1b[48;5;33m \x1b[0m'
  console.log(p + dim('\u2502') + indicator + ' '.repeat(boxW - 4) + dim('\u2502'))

  for (let i = 0; i < 2; i++) {
    console.log(p + dim('\u2502') + ' '.repeat(boxW - 2) + dim('\u2502'))
  }

  const orange = '\x1b[38;5;173m'
  const reset = '\x1b[0m'
  const statusLine = dim('Build ') + dim('\u00b7') + dim('  Gemini 2.5 Flash ') + dim('\u00b7') + dim('  Free Tier  ') + orange + 'high' + reset
  const statusPad = ' '.repeat(Math.max(0, boxW - 4 - statusLine.length + 10))
  console.log(p + dim('\u2502') + statusPad + statusLine + dim('\u2502'))

  console.log(p + dim('\u2514' + '\u2500'.repeat(boxW - 2) + '\u2518'))

  const shortcut = dim('tab agents') + dim('   ctrl+p commands') + dim('   ') + bold(blue('enter submit')) + dim('   ctrl+c exit')
  const shortcutX = Math.max(0, w - shortcut.length + 10)
  console.log()
  console.log(' '.repeat(Math.max(0, shortcutX)) + shortcut)
  console.log()

  const tip = orange + '\u25cf' + reset + '  ' + dim('Tip  ') + 'Run ' + bold('vestprompt upgrade') + ' to update to the latest version'
  console.log(center(tip))
  console.log()

  console.log()
  console.log(dim('~'))

  const rows = process.stdout.rows || 24
  process.stdout.write('\x1b[' + rows + ';' + (w - 5) + 'H' + dim('0.1.0'))
  process.stdout.write('\x1b[' + 5 + ';' + (boxX + 4) + 'H')

  inputY = 5
}

export function collectInput() {
  return new Promise((resolve) => {
    linesTyped = []

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    })

    rl.on('SIGINT', () => {
      rl.close()
      process.exit(0)
    })

    rl.on('line', (line) => {
      if (line.trim() === '' && linesTyped.length > 0) {
        rl.close()
        return
      }
      linesTyped.push(line)
    })

    rl.on('close', () => {
      resolve(linesTyped.join('\n').trim())
    })

    const writePos = '\x1b[' + inputY + ';' + (boxX + 4) + 'H'
    process.stdout.write(writePos)
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
  console.log()
  console.log('  ' + stripMarkdown(text))
  console.log()
}

export function displayError(title, message, stack) {
  console.log()
  console.log('  ' + title)
  for (const line of message.split('\n')) {
    console.log('  ' + line)
  }
  if (stack) {
    console.log()
    for (const line of stack.split('\n').slice(0, 6)) {
      console.log('  ' + line)
    }
  }
  console.log()
}
