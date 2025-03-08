import { createWorker } from "tesseract.js"
import pdf from "pdf-parse"

export async function parseDocument(file: File): Promise<string> {
  const fileType = file.type
  const buffer = await file.arrayBuffer()

  // Parse based on file type
  if (fileType === "application/pdf") {
    return parsePdf(buffer)
  } else if (fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
    return parsePptx(buffer)
  } else if (fileType === "text/plain") {
    return parseText(buffer)
  } else if (fileType.includes("image/")) {
    return parseImage(file)
  } else {
    throw new Error("Unsupported file type")
  }
}

async function parsePdf(buffer: ArrayBuffer): Promise<string> {
  const data = await pdf(Buffer.from(buffer))
  return data.text
}

async function parsePptx(buffer: ArrayBuffer): Promise<string> {
  // For PPTX, we'd typically use a library like pptx-parser
  // This is a simplified version
  const text = "PPTX parsing would go here"
  return text
}

async function parseText(buffer: ArrayBuffer): Promise<string> {
  const decoder = new TextDecoder("utf-8")
  return decoder.decode(buffer)
}

async function parseImage(file: File): Promise<string> {
  const worker = await createWorker()
  await worker.loadLanguage("eng")
  await worker.initialize("eng")

  const {
    data: { text },
  } = await worker.recognize(file)
  await worker.terminate()

  return text
}

