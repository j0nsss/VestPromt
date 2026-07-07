import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = 'gemini-2.0-flash-thinking-exp'

const SYSTEM_INSTRUCTION = `You are a senior prompt engineer. Your role is to deeply analyze the user's raw, unstructured prompt idea, understand the true intent behind it, and rewrite it into a professional, well-structured, and immediately usable prompt.

Follow this exact structure in your output:
**Context** — Briefly establish the background, scenario, and relevant environment for the AI task.
**Task** — Clearly and precisely state what the AI needs to accomplish.
**Constraints** — List specific rules, limitations, boundaries, or quality requirements.
**Output Format** — Describe how the result should be presented (format, style, length, structure).

Output ONLY the optimized prompt. Do NOT include any introductory phrases, explanations, commentary, or metadata outside the four sections above. The output must be self-contained and ready to be used as a prompt for any AI system.`

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
