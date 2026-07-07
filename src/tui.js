import pc from 'picocolors'
import figlet from 'figlet'
import { emitKeypressEvents } from 'node:readline'

const dim = pc.dim
const bold = pc.bold
const blue = pc.blue
const { stdout } = process

const orange = '\x1b[38;5;173m'
const rst = '\x1b[0m'
const blueBg = '\x1b[48;5;33m'

let inputBuffer = ''
let boxX = 0
let boxW = 0
let inputRow = 0
let inputCol = 0
let logoLines = []

function termW() {
  return stdout.columns || 80
}

function center(s) {
  const w = termW()
  const l = Math.max(0, Math.floor((w - s.length) / 2))
  return ' '.repeat(l) + s
}

function buildLayout(buffer) {
  const w = termW()
  boxW = Math.min(70, Math.floor(w * 0.72))
  boxX = Math.floor((w - boxW) / 2)
  const p = ' '.repeat(boxX)
  const horiz = '\u2500'.repeat(boxW - 2)

  const topB = p + dim('\u250c' + horiz + '\u2510')
  const botB = p + dim('\u2514' + horiz + '\u2518')
  const indicator = blueBg + ' ' + rst
  const pipe = dim('\u2502')

  const visible = buffer.slice(-(boxW - 4))
  const padLen = Math.max(0, boxW - 4 - visible.length)
  const inputLine = pipe + indicator + visible + ' '.repeat(padLen) + pipe
  const empty = pipe + ' '.repeat(boxW - 2) + pipe

  const statusT = dim('Build \u00b7 Gemini 2.5 Flash \u00b7 Free Tier ') + orange + 'high' + rst
  const statusLine = pipe + ' '.repeat(boxW - 4 - 35) + statusT + pipe

  const lines = ['']

  if (logoLines.length > 0) {
    for (const l of logoLines) {
      lines.push(center(dim(l)))
    }
  } else {
    lines.push(center(bold(blue('vestprompt'))))
  }
  lines.push('')

  lines.push(topB)
  lines.push(inputLine)
  for (let i = 0; i < 2; i++) lines.push(empty)
  lines.push(statusLine)
  lines.push(botB)
  lines.push('')

  const shortcut =
    dim('tab agents') + dim('   ctrl+p commands') +
    dim('   ') + bold(blue('esc submit')) +
    dim('   ctrl+c exit')
  const sw = termW() - 2
  lines.push(' '.repeat(Math.max(0, sw - 30)) + shortcut)
  lines.push('')

  const tip = orange + '\u25cf' + rst + '  ' + dim('Tip  ') +
    'Run ' + bold('vestprompt upgrade') + ' to update to the latest version'
  lines.push(center(tip))
  lines.push('')
  lines.push('')
  lines.push(dim('~'))

  inputRow = 2 + (logoLines.length > 0 ? logoLines.length : 0)
  inputCol = boxX + 3

  return lines
}

function render(buffer) {
  const lines = buildLayout(buffer)
  const output = lines.join('\n')
  stdout.write('\x1b[0;0H' + output)

  const curRow = inputRow + 1
  const curCol = inputCol + buffer.slice(-(boxW - 4)).length
  stdout.write('\x1b[' + curRow + ';' + curCol + 'H')
}

export function showTUI() {
  try {
    const raw = figlet.textSync('VESTPROMPT', { font: 'Standard' })
    logoLines = raw.split('\n')
  } catch {
    logoLines = []
  }

  inputBuffer = ''
}

export function collectInput() {
  return new Promise((resolve) => {
    inputBuffer = ''
    stdout.write('\x1b[2J')
    render('')

    emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)

    function cleanup() {
      try { process.stdin.setRawMode(false) } catch {}
      process.stdin.removeListener('keypress', onKeypress)
      process.stdout.removeListener('resize', onResize)
    }

    function onResize() {
      render(inputBuffer)
    }
    process.stdout.on('resize', onResize)

    function onKeypress(str, key) {
      if (!key) return

      if (key.ctrl && key.name === 'c') {
        cleanup()
        process.exit(0)
      }

      if (key.name === 'escape' || key.name === 'return') {
        if (inputBuffer.trim()) {
          cleanup()
          resolve(inputBuffer.trim())
        }
        return
      }

      if (key.name === 'backspace') {
        inputBuffer = inputBuffer.slice(0, -1)
        render(inputBuffer)
        return
      }

      if (key.name === 'delete') {
        inputBuffer = inputBuffer.slice(1)
        render(inputBuffer)
        return
      }

      if (str && str.length === 1) {
        inputBuffer += str
        render(inputBuffer)
      }
    }

    process.stdin.on('keypress', onKeypress)
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
