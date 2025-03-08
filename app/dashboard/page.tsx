import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { FileUpload } from "@/components/file-upload"
import { DocumentList } from "@/components/document-list"
import { supabaseAdmin } from "@/lib/supabase"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Get user ID from Supabase
  const { data: userData } = await supabaseAdmin.from("users").select("id").eq("email", session.user?.email).single()

  if (!userData) {
    // Handle case where user is not found
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-10">
          <h1 className="text-2xl font-bold mb-6">User not found</h1>
        </main>
      </div>
    )
  }

  // Get user's documents
  const { data: documents } = await supabaseAdmin
    .from("contents")
    .select("id, file_name, created_at")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <FileUpload />
          </div>

          <div className="lg:col-span-2">
            <DocumentList documents={documents || []} />
          </div>
        </div>
      </main>
    </div>
  )
}

