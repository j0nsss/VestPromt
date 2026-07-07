# VestPrompt

**AI Prompt Optimizer for the Terminal** — *type rough, get sharp.*

VestPrompt is a CLI tool that transforms raw, unstructured prompt ideas into polished, professional prompts — instantly, from your terminal.

## Installation

```bash
git clone <repo-url>
cd vestprompt
npm install
npm link
```

## Setup

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key
```

Get your API key at [aistudio.google.com](https://aistudio.google.com).

## Usage

```bash
vestprompt
```

1. Type or paste your raw prompt
2. Press Enter twice (or Ctrl+D) when done
3. Wait for the AI to analyze and optimize
4. Copy the structured output

## Features

- **Deep reasoning** — Uses `gemini-2.0-flash-thinking-exp` for intent analysis
- **Global CLI** — Works from any directory after `npm link`
- **Structured output** — Context, Task, Constraints, Output Format
- **Minimalist UI** — Clean, professional terminal interface

## Project Structure

```
vestprompt/
├── bin/index.js     # CLI entry point
├── src/
│   ├── ai.js        # Gemini API integration
│   ├── config.js    # Absolute .env path resolution
│   └── ui.js        # Terminal UI components
├── .env.example     # Environment template
└── package.json
```

## License

MIT
