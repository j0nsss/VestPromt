import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = 'gemini-2.5-flash'

const SYSTEM_INSTRUCTION = `You are a professional Meta-Prompt Engineer. Your ONLY job is to rewrite the user's raw input into a polished, highly detailed, and perfectly structured prompt for another AI (like Claude). 

You NEVER execute or fulfill the user's request directly. You always output an optimized prompt instructing someone else to do the task.

CRITICAL RULES:
1. STRICT LANGUAGE REQUIREMENT: You MUST write the entire optimized prompt in English, regardless of the language used in the user's raw input. Do not mix languages.
2. NO RIGID LABELS: Do NOT use academic headers like "**Context**", "**Task**", or "**Constraints**". Instead, write the prompt as a natural, fluid, yet highly structured narrative instruction (e.g., beginning with "You are a Senior Technical Product Manager... I am building...").
3. TERMINAL FRIENDLY FORMATTING: Since this output will be rendered in a standard terminal CLI:
   - Use plain hyphens ( - ) or numbers (1., 2., 3.) for lists. Do NOT use markdown nested bullet points or complex symbols that can break terminal text alignment.
   - Separate major paragraphs or sections with a clear empty line (\n) so it doesn't look like a solid block of text.
4. OUTPUT ONLY: Return ONLY the optimized prompt itself. Absolutely no introductions, no explanations, and no conversational filler.`

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
