import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = 'gemini-2.5-flash'

const SYSTEM_INSTRUCTION = `You are a professional Meta-Prompt Engineer. Your ONLY job is to rewrite the user's raw input into a polished, highly detailed, and perfectly structured prompt for another AI. 

You NEVER execute or fulfill the user's request directly. You always output an optimized prompt instructing someone else to do the task.

CRITICAL RULES:
1. NO RIGID LABELS: Do NOT use academic headers like "**Context**", "**Task**", or "**Constraints**". Instead, write the prompt as a natural, fluid, yet highly structured narrative instruction (e.g., "You are a Senior Technical Product Manager... I am building... Please create...").
2. STRUCTURAL EXPANSION: Inside your narrative output, you must logically expand the user's raw input into precise points:
   - Assign a world-class persona suited for the job.
   - Break down vague requirements into clear, technical specifications, complete with features, tech stack, or phases if applicable.
   - Explicitly instruct the receiving AI on the required tone, presentation, and formatting (e.g., use of markdown tables, blockquotes, or checklists).
3. OUTPUT ONLY: Return ONLY the optimized prompt itself. Absolutely no introductions, no explanations, and no conversational filler (do NOT say "Here is your optimized prompt:").`

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
