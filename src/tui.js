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

function hideCursor() { stdout.write('\x1b[?25l') }
function showCursor() { stdout.write('\x1b[?25h') }
function disableWrap() { stdout.write('\x1b[?7l') }
function enableWrap() { stdout.write('\x1b[?7h') }

function termW() {
  return stdout.columns || 80
}

function center(text) {
  const w = termW()
  const pad = Math.max(0, Math.floor((w - text.length) / 2))
  return ' '.repeat(pad) + text
}

function buildLayout(buffer) {
  const width = termW()

  const boxWidth = Math.min(80, Math.max(30, width - 10))
  const boxPad = Math.max(0, Math.floor((width - boxWidth) / 2))
  const p = ' '.repeat(boxPad)

  boxW = boxWidth
  boxX = boxPad

  const hz = '\u2500'.repeat(boxWidth - 2)
  const topB = p + dim('\u250c' + hz + '\u2510')
  const botB = p + dim('\u2514' + hz + '\u2518')
  const pipe = dim('\u2502')

  const ind = blueBg + ' ' + rst
  const inside = boxWidth - 2

  const maxInput = boxWidth - 4
  const visible = buffer.length > maxInput
    ? buffer.slice(-maxInput)
    : buffer
  const padLen = Math.max(0, maxInput - visible.length)
  const inputLine = p + pipe + ind + visible + ' '.repeat(padLen) + pipe

  const empty = p + pipe + ' '.repeat(inside) + pipe

  const sText = 'Build \u00b7 Gemini 2.5 Flash \u00b7 Free Tier'
  const sHigh = 'high'
  const sDisplayLen = sText.length + 1 + sHigh.length
  const sPad = Math.max(0, inside - 2 - sDisplayLen)
  const statusLine = p + pipe + ' '.repeat(sPad) + dim(sText + ' ') + orange + sHigh + rst + pipe

  const lines = ['']

  const logoW = 63
  const showFullLogo = logoLines.length > 0 && width >= logoW
  if (showFullLogo) {
    for (const l of logoLines) {
      lines.push(center(dim(l)))
    }
  } else if (logoLines.length > 0) {
    lines.push(center(bold(dim('vestprompt'))))
  }
  lines.push('')

  lines.push(topB)
  lines.push(inputLine)
  for (let i = 0; i < 2; i++) lines.push(empty)
  lines.push(statusLine)
  lines.push(botB)
  lines.push('')

  const leftCmd = dim('esc submit   ctrl+c exit')
  const rightNav = dim('tab agents   ctrl+p commands')
  const leftX = boxPad + 1
  const rightX = boxPad + boxWidth - 2 - rightNav.length
  const padBetween = Math.max(0, rightX - leftX - leftCmd.length)
  lines.push(' '.repeat(leftX) + leftCmd + ' '.repeat(padBetween) + rightNav)
  lines.push('')

  const tip = orange + '\u25cf' + rst + '  ' + dim('Tip  ') +
    'Run ' + bold('vestprompt upgrade') + ' to update to the latest version'
  lines.push(center(tip))
  lines.push('')
  lines.push('')
  lines.push(dim('~'))

  const logoH = showFullLogo ? logoLines.length : 1
  inputRow = 1 + logoH + 1
  inputCol = boxPad + 2

  return lines
}

let resizeTimer = null

function clearScreen() {
  stdout.write('\x1b[2J\x1b[3J\x1b[H')
}

function render(buffer) {
  hideCursor()
  disableWrap()
  clearScreen()

  const lines = buildLayout(buffer)
  stdout.write(lines.join('\n'))

  const curRow = inputRow + 1
  const maxInput = boxW - 4
  const visible = buffer.length > maxInput ? buffer.slice(-maxInput) : buffer
  const curCol = inputCol + 1 + visible.length

  stdout.write('\x1b[' + curRow + ';' + curCol + 'H')
  showCursor()
  enableWrap()
}

export function showTUI() {
  try {
    const raw = figlet.textSync('VESTPROMPT', { font: 'Standard' })
    logoLines = raw.replace(/\n$/, '').split('\n')
  } catch {
    logoLines = []
  }

  inputBuffer = ''
}

export function collectInput() {
  return new Promise((resolve) => {
    inputBuffer = ''
    stdout.write('\x1b[2J\x1b[H')
    render('')

    emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)

    function cleanup() {
      try { process.stdin.setRawMode(false) } catch {}
      if (resizeTimer) { clearTimeout(resizeTimer); resizeTimer = null }
      process.stdin.removeListener('keypress', onKeypress)
      process.stdout.removeListener('resize', onResize)
    }

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        render(inputBuffer)
        resizeTimer = null
      }, 80)
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
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1)
          render(inputBuffer)
        }
        return
      }

      if (key.name === 'delete') {
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(1)
          render(inputBuffer)
        }
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
