import { generateEmbeddings } from "./gemini"
import { supabaseAdmin } from "./supabase"

export async function extractAndStoreContent(text: string, fileName: string, userId: string) {
  // Split text into chunks (simplified version)
  const chunks = splitTextIntoChunks(text)

  // Store the original content
  const { data: contentData, error: contentError } = await supabaseAdmin
    .from("contents")
    .insert({
      user_id: userId,
      file_name: fileName,
      content: text,
    })
    .select()
    .single()

  if (contentError) {
    throw new Error(`Failed to store content: ${contentError.message}`)
  }

  // Generate embeddings and store in vector database
  for (const [index, chunk] of chunks.entries()) {
    const embedding = await generateEmbeddings(chunk)

    await supabaseAdmin.from("embeddings").insert({
      content_id: contentData.id,
      chunk_index: index,
      chunk_text: chunk,
      embedding,
    })
  }

  return contentData.id
}

function splitTextIntoChunks(text: string, chunkSize = 1000): string[] {
  const chunks = []
  let i = 0

  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize))
    i += chunkSize
  }

  return chunks
}

