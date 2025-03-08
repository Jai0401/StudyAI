import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { generateSummary, generateQA, generateQuiz } from "@/lib/ai-processing"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contentId, type } = await req.json()

    if (!contentId || !type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    let result

    switch (type) {
      case "summary":
        result = await generateSummary(contentId)
        break
      case "qa":
        result = await generateQA(contentId)
        break
      case "quiz":
        result = await generateQuiz(contentId)
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

