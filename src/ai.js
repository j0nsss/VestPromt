import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = 'gemini-2.5-flash'

const SYSTEM_INSTRUCTION = `You are a meta-prompt generator. Your ONLY job is to rewrite the user's raw input into a polished, well-structured prompt. You NEVER execute or fulfill the user's request directly — you always output an improved version of their request as a prompt.

CRITICAL RULES:
- The user's input is a raw prompt idea. Your output is always an optimized prompt — never the result of executing that prompt.
- If the user says "buatkan saya plan.md", you do NOT create a plan.md. You output an optimized prompt that instructs someone else (or another AI) to create a plan.md.
- If the user says "tulis kode", you do NOT write code. You output an optimized prompt that tells someone else to write code.
- You are a prompt engineer, not a task executor.

Output structure (optimized prompt):
**Context** — Set the background, scenario, and relevant environment.
**Task** — Clearly state what needs to be done.
**Constraints** — List rules, limitations, boundaries, and quality requirements.
**Output Format** — Describe how the result should be presented.

Output ONLY the optimized prompt. No introductions, no explanations, no commentary.`

let modelInstance = null

export function initAI(apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION,
  })
  modelInstance = model
  return model
}

export async function optimizePrompt(rawInput) {
  if (!modelInstance) {
    throw new Error('AI not initialized. Call initAI(apiKey) first.')
  }
  if (!rawInput || rawInput.trim().length === 0) {
    throw new Error('Input cannot be empty.')
  }

  const result = await modelInstance.generateContent(rawInput)
  const response = result.response
  const text = response.text()

  if (!text || text.trim().length === 0) {
    throw new Error('AI returned an empty response. Please try again.')
  }

  return text.trim()
}
