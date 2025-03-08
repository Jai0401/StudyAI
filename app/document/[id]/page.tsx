import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { StudyMaterialGenerator } from "@/components/study-material-generator"
import { InteractiveQA } from "@/components/interactive-qa"
import { supabaseAdmin } from "@/lib/supabase"

export default async function DocumentPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Get document details
  const { data: document } = await supabaseAdmin
    .from("contents")
    .select("id, file_name, content")
    .eq("id", params.id)
    .single()

  if (!document) {
    redirect("/dashboard")
  }

  // Get existing study materials
  const { data: studyMaterials } = await supabaseAdmin
    .from("study_materials")
    .select("id, type, material")
    .eq("content_id", params.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <h1 className="text-2xl font-bold mb-2">{document.file_name}</h1>

        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <StudyMaterialGenerator contentId={params.id} existingMaterials={studyMaterials || []} />
          </div>

          <div className="lg:col-span-2">
            <InteractiveQA contentId={params.id} />
          </div>
        </div>
      </main>
    </div>
  )
}

