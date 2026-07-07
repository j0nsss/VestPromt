import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const blessed = require('blessed')

const C = {
  bg: '#0d0d0d',
  surface: '#1e1e1e',
  border: '#3c3c3c',
  blueAccent: '#3b8eff',
  text: '#e0e0e0',
  dim: '#6c6c6c',
  orange: '#cc7832',
  green: '#6aab73',
  red: '#f44747',
  white: '#d4d4d4',
}

export function startTUI() {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'vestprompt',
    cursor: {
      artificial: true,
      shape: 'line',
      blink: true,
      color: 'white',
    },
    terminal: 'xterm-256color',
    fullUnicode: true,
  })
  screen.program.hideCursor()

  const header = blessed.text({
    parent: screen,
    top: 2,
    left: 'center',
    content: '{bold}vestprompt{/bold}',
    style: { fg: C.white, bold: true },
    tags: true,
  })

  const inputBox = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '72%',
    height: 7,
    style: { bg: C.surface },
    border: { type: 'line', fg: C.border },
  })

  const indicator = blessed.text({
    parent: inputBox,
    left: 1,
    top: 1,
    width: 1,
    height: 4,
    content: ' ',
    style: { bg: C.blueAccent },
  })

  const textarea = blessed.textarea({
    parent: inputBox,
    top: 1,
    left: 3,
    right: 1,
    height: 4,
    input: true,
    keys: true,
    mouse: true,
    style: {
      fg: C.text,
      bg: C.surface,
      focus: { fg: C.text, bg: C.surface },
    },
    placeholder: 'Ask anything... "Fix broken tests"',
  })

  const statusBar = blessed.text({
    parent: inputBox,
    bottom: 0,
    left: 2,
    right: 1,
    height: 1,
    content: 'Build  {dim}·{/dim}  Gemini 2.5 Flash  {dim}·{/dim}  Free Tier  {#cc7832-fg}high{/#cc7832-fg}',
    style: { fg: C.dim, bg: C.surface },
    tags: true,
  })

  const shortcutHelp = blessed.text({
    parent: screen,
    bottom: 5,
    right: '14%',
    content: '{dim}tab agents{/dim}   {dim}ctrl+p commands{/dim}   {#3b8eff-fg}esc submit{/#3b8eff-fg}   {dim}ctrl+c exit{/dim}',
    style: { fg: C.dim },
    tags: true,
  })

  const tip = blessed.text({
    parent: screen,
    bottom: 3,
    left: 'center',
    content: `{#cc7832-fg}●{/#cc7832-fg}  {dim}Tip{/dim}  Run {bold}vestprompt upgrade{/bold} to update to the latest version`,
    style: { fg: C.dim },
    tags: true,
  })

  const footerLeft = blessed.text({
    parent: screen,
    bottom: 0,
    left: 0,
    content: '~',
    style: { fg: C.dim },
  })

  const footerRight = blessed.text({
    parent: screen,
    bottom: 0,
    right: 0,
    content: '{dim}0.1.0{/dim}',
    style: { fg: C.dim },
    tags: true,
  })

  textarea.focus()
  screen.render()

  return new Promise((resolve) => {
    screen.key(['escape'], () => {
      const val = textarea.getValue().trim()
      if (!val) return
      destroyTUI(screen)
      resolve(val)
    })

    screen.key(['C-c'], () => {
      destroyTUI(screen)
      process.exit(0)
    })

    screen.on('resize', () => {
      header.left = 'center'
      inputBox.left = 'center'
      shortcutHelp.right = '14%'
      tip.left = 'center'
      screen.render()
    })

    textarea.on('keypress', () => {
      screen.render()
    })
  })
}

export function destroyTUI(screen) {
  screen.program.showCursor()
  screen.destroy()
}

export async function showProcessing() {
  console.log()
  const { default: ora } = await import('ora')
  const spinner = ora({
    text: 'Analyzing intent & optimizing structure...',
    spinner: 'dots',
    color: 'cyan',
  }).start()
  return spinner
}

function stripMarkdown(text) {
  return text.replace(/\*\*/g, '')
}

export function displayResult(text) {
  const lines = text.split('\n')
  console.log()
  for (const line of lines) {
    console.log(`  ${stripMarkdown(line)}`)
  }
  console.log()
}

export function displayError(title, message, stack) {
  console.log()
  console.log(`  ${title}`)
  for (const line of message.split('\n')) {
    console.log(`  ${line}`)
  }
  if (stack) {
    console.log()
    const stackLines = stack.split('\n').slice(0, 6)
    for (const line of stackLines) {
      console.log(`  ${line}`)
    }
  }
  console.log()
}
