"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface StudyMaterial {
  id: string
  type: "summary" | "qa" | "quiz"
  material: any
}

interface StudyMaterialGeneratorProps {
  contentId: string
  existingMaterials: StudyMaterial[]
}

export function StudyMaterialGenerator({ contentId, existingMaterials }: StudyMaterialGeneratorProps) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [materials, setMaterials] = useState<StudyMaterial[]>(existingMaterials)
  const router = useRouter()

  const generateMaterial = async (type: "summary" | "qa" | "quiz") => {
    setGenerating(type)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId,
          type,
        }),
      })

      if (!response.ok) {
        throw new Error("Generation failed")
      }

      const data = await response.json()

      // Add new material to the list
      setMaterials((prev) => {
        const filtered = prev.filter((m) => m.type !== type)
        return [...filtered, { id: Date.now().toString(), type, material: data.result }]
      })

      router.refresh()
    } catch (error) {
      console.error("Generation error:", error)
      alert("Failed to generate study material")
    } finally {
      setGenerating(null)
    }
  }

  const getSummary = () => {
    return materials.find((m) => m.type === "summary")
  }

  const getQA = () => {
    return materials.find((m) => m.type === "qa")
  }

  const getQuiz = () => {
    return materials.find((m) => m.type === "quiz")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            {getSummary() ? (
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: getSummary()?.material.replace(/\n/g, "<br />") || "" }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Generate a summary of your document</p>
                <Button onClick={() => generateMaterial("summary")} disabled={generating === "summary"}>
                  {generating === "summary" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Summary"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="qa" className="mt-4">
            {getQA() ? (
              <div className="space-y-4">
                {Array.isArray(getQA()?.material) &&
                  getQA()?.material.map((qa: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium mb-2">Q: {qa.question}</p>
                      <p className="text-gray-700 dark:text-gray-300">A: {qa.answer}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Generate Q&A pairs from your document</p>
                <Button onClick={() => generateMaterial("qa")} disabled={generating === "qa"}>
                  {generating === "qa" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Q&A"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quiz" className="mt-4">
            {getQuiz() ? (
              <div className="space-y-6">
                {Array.isArray(getQuiz()?.material) &&
                  getQuiz()?.material.map((quiz: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium mb-3">Q: {quiz.question}</p>
                      <div className="space-y-2">
                        {quiz.options.map((option: string, optIndex: number) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded-md ${
                              quiz.correctAnswer === optIndex
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            {option}
                            {quiz.correctAnswer === optIndex && (
                              <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">Generate a quiz from your document</p>
                <Button onClick={() => generateMaterial("quiz")} disabled={generating === "quiz"}>
                  {generating === "quiz" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Quiz"
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

