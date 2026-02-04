import { NextResponse } from 'next/server'
// import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/db"
import { chats, leads } from "@/db/schema"
import { eq } from "drizzle-orm"

// Initialize Gemini (Mocked if no key)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key")

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { sender, message } = body // Fonnte format assumption

        if (!sender || !message) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

        // 1. Context Check: Find/Create Lead
        // In build environment without DB, this might fail. We wrap in try-catch or ensure DB mock is used if testing.
        // Assuming this code runs in production with env vars.

        let lead;
        try {
             lead = await db.query.leads.findFirst({
                where: eq(leads.phoneNumber, sender)
            })

            if (!lead) {
                const [newLead] = await db.insert(leads).values({
                    phoneNumber: sender,
                    name: "Unknown",
                    status: "cold"
                }).returning()
                lead = newLead
            }
        } catch (dbError) {
            console.error("DB Error (likely due to missing connection in sandbox):", dbError)
            // Mock lead for flow demonstration
            lead = { id: 1, phoneNumber: sender }
        }

        // Save User Message
        try {
            await db.insert(chats).values({
                leadId: lead.id,
                sender: "user",
                message: message
            })
        } catch { console.log("DB Insert skipped") }

        // 2. RAG Search
        // Embed incoming message
        // const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" })
        // const result = await embeddingModel.embedContent(message)
        // const embedding = result.embedding.values
        // const embedding = new Array(768).fill(0) // Mock

        // Vector Search (pgvector)
        // const similarDocs = await db.select({ content: knowledgeBase.content }).from(knowledgeBase).orderBy(sql`${cosineDistance(knowledgeBase.embedding, embedding)}`).limit(3)
        const similarDocs = [{ content: "Price is 2 Million IDR." }] // Mock

        const contextText = similarDocs.map(d => d.content).join("\n")

        // 3. Gemini Generation
        // const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        // const prompt = `
        // You are Rangga's Assistant at MasWebsite.id.
        // CONTEXT: ${contextText}
        // USER: ${message}
        //
        // Answer professionally.
        // `

        let aiMessage = "AI Response Placeholder"
        try {
             // const response = await model.generateContent(prompt)
             // aiMessage = response.response.text()
             aiMessage = `(AI Stub) Based on: ${contextText}, here is the answer.`
        } catch (aiError) {
            console.error("AI Error:", aiError)
        }

        // 4. Save & Send
        try {
            await db.insert(chats).values({
                leadId: lead.id,
                sender: "ai",
                message: aiMessage
            })
        } catch { console.log("DB Insert skipped") }

        // Send via Fonnte (Stub)
        // await fetch('https://api.fonnte.com/send', { ... })

        return NextResponse.json({ success: true, response: aiMessage })

    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
