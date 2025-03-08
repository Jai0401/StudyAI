import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Get the Gemini model
export const getGeminiModel = (modelName = "gemini-2.0-flash") => {
  return genAI.getGenerativeModel({ model: modelName })
}

// Generate embeddings using Gemini
export async function generateEmbeddings(text: string) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" })
  const result = await model.embedContent(text)
  return result.embedding
}

// Generate text using Gemini
export async function generateText(prompt: string, systemPrompt?: string) {
  const model = getGeminiModel()

  const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig,
  })

  return result.response.text()
}

