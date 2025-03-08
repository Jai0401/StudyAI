import { generateText } from "./gemini"
import { supabaseAdmin } from "./supabase"

export async function generateSummary(contentId: string) {
  const { data: content } = await supabaseAdmin.from("contents").select("content").eq("id", contentId).single()

  if (!content) {
    throw new Error("Content not found")
  }

  const prompt = `
    Summarize the following class notes into concise, easy-to-understand bullet points:
    
    ${content.content}
    
    Format your response as bullet points with main topics and subtopics.
  `

  const summary = await generateText(prompt)

  await supabaseAdmin.from("study_materials").insert({
    content_id: contentId,
    type: "summary",
    material: summary,
  })

  return summary
}

export async function generateQA(contentId: string) {
  const { data: content } = await supabaseAdmin.from("contents").select("content").eq("id", contentId).single()

  if (!content) {
    throw new Error("Content not found")
  }

  const prompt = `
    Generate 10 important question and answer pairs based on the following class notes:
    
    ${content.content}
    
    Format your response as a JSON array of objects with 'question' and 'answer' fields.
  `

  const qaText = await generateText(prompt)
  let qa

  try {
    qa = JSON.parse(qaText)
  } catch (e) {
    // If parsing fails, try to extract JSON from the text
    const jsonMatch = qaText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      qa = JSON.parse(jsonMatch[0])
    } else {
      throw new Error("Failed to parse QA response")
    }
  }

  await supabaseAdmin.from("study_materials").insert({
    content_id: contentId,
    type: "qa",
    material: qa,
  })

  return qa
}

export async function generateQuiz(contentId: string) {
  const { data: content } = await supabaseAdmin.from("contents").select("content").eq("id", contentId).single()

  if (!content) {
    throw new Error("Content not found")
  }

  const prompt = `
    Create a multiple-choice quiz with 5 questions based on the following class notes:
    
    ${content.content}
    
    Format your response as a JSON array of objects with 'question', 'options' (array), and 'correctAnswer' (index) fields.
  `

  const quizText = await generateText(prompt)
  let quiz

  try {
    quiz = JSON.parse(quizText)
  } catch (e) {
    // If parsing fails, try to extract JSON from the text
    const jsonMatch = quizText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      quiz = JSON.parse(jsonMatch[0])
    } else {
      throw new Error("Failed to parse quiz response")
    }
  }

  await supabaseAdmin.from("study_materials").insert({
    content_id: contentId,
    type: "quiz",
    material: quiz,
  })

  return quiz
}

export async function generateInteractiveQA(contentId: string, question: string) {
  // Get relevant chunks from vector database
  const { data: content } = await supabaseAdmin.from("contents").select("content").eq("id", contentId).single()

  if (!content) {
    throw new Error("Content not found")
  }

  const prompt = `
    Answer the following question based on the class notes:
    
    Class Notes:
    ${content.content}
    
    Question: ${question}
    
    Provide a detailed and accurate answer.
  `

  const answer = await generateText(prompt)

  return answer
}

