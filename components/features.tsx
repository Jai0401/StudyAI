import { BookOpen, FileText, MessageSquare, CheckSquare } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Powerful AI tools to enhance your study experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <BookOpen className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold">Summarizer</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Generate concise summaries of your class notes
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold">Q&A Generator</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Create important question and answer pairs
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <CheckSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold">Quiz Maker</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">Generate quizzes to test your knowledge</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold">Interactive Q&A</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Ask questions about your notes and get instant answers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

