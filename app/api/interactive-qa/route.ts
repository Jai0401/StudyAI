import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contentId, question } = await req.json()

    if (!contentId || !question) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    // Get content from Supabase
    const { data: content } = await supabaseAdmin.from("contents").select("content").eq("id", contentId).single()

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Use AI SDK to stream the response
    const result = await streamText({
      model: openai("gpt-4o"),
      prompt: `
        Answer the following question based on the class notes:
        
        Class Notes:
        ${content.content}
        
        Question: ${question}
        
        Provide a detailed and accurate answer.
      `,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("Interactive QA error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

