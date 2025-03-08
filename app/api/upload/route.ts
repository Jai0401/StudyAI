import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { parseDocument } from "@/lib/document-parser"
import { extractAndStoreContent } from "@/lib/content-extraction"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get user ID from Supabase
    const { data: userData } = await supabaseAdmin.from("users").select("id").eq("email", session.user.email).single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse document
    const text = await parseDocument(file)

    // Extract and store content
    const contentId = await extractAndStoreContent(text, file.name, userData.id)

    return NextResponse.json({ contentId })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

