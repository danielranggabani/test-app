"use server"
import { db } from "@/db"
import { knowledgeBase } from "@/db/schema"
import { eq } from "drizzle-orm"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { revalidatePath } from "next/cache"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key")

export async function addToBrain(content: string) {
    if (!content) return { success: false, error: "Content is empty" }

    // 1. Generate Embedding
    let embedding: number[] = []
    try {
        const model = genAI.getGenerativeModel({ model: "embedding-001" })
        const result = await model.embedContent(content)
        embedding = result.embedding.values
    } catch (e) {
        console.error("Embedding Error:", e)
        // Fallback or rethrow? For now, we stub if mock key
        if (process.env.GEMINI_API_KEY === "mock-key") {
             embedding = new Array(768).fill(0)
        } else {
             throw new Error("Failed to generate embedding")
        }
    }

    // 2. Save to DB
    await db.insert(knowledgeBase).values({
        content: content,
        embedding: embedding
    })

    revalidatePath('/brain')
    return { success: true }
}

export async function deleteKnowledge(id: number) {
    await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id))
    revalidatePath('/brain')
    return { success: true }
}
