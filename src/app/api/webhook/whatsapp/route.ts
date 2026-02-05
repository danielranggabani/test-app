import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/db"
import { chats, leads, knowledgeBase } from "@/db/schema"
import { eq, sql, cosineDistance, desc } from "drizzle-orm"
import { sendWhatsApp } from "@/lib/fonnte"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key")

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { sender, message } = body // Fonnte payload format

        if (!sender || !message) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

        // 1. Context Check: Find or Create Lead
        let lead;
        try {
             lead = await db.query.leads.findFirst({
                where: eq(leads.phoneNumber, sender)
            })

            if (!lead) {
                const [newLead] = await db.insert(leads).values({
                    phoneNumber: sender,
                    name: "Unknown",
                    status: "cold",
                    aiActive: true // Default ON
                }).returning()
                lead = newLead
            }
        } catch (dbError) {
            console.error("DB Error (Connection failed?):", dbError)
            // Fallback for demo/test if DB is down
            lead = { id: 1, phoneNumber: sender, aiActive: true }
        }

        // Save User Message
        try {
            await db.insert(chats).values({
                leadId: lead.id,
                sender: "user",
                message: message
            })
        } catch (e) { console.log("DB Insert skipped", e) }

        // AI Toggle Check
        if (lead.aiActive === false) {
             console.log(`[AI SKIP] AI is disabled for lead ${lead.id}`)
             return NextResponse.json({ status: "skipped", reason: "AI Disabled" })
        }

        // 2. RAG Search
        let contextText = ""
        try {
            // Embed query
            const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" })
            const embeddingResult = await embeddingModel.embedContent(message)
            const embedding = embeddingResult.embedding.values

            // Vector Search
            const similarDocs = await db.select({ content: knowledgeBase.content })
                                       .from(knowledgeBase)
                                       .orderBy(sql`${cosineDistance(knowledgeBase.embedding, embedding)}`)
                                       .limit(3)

            contextText = similarDocs.map(d => d.content).join("\n")
        } catch (ragError) {
            console.error("RAG Error (Embedding/DB):", ragError)
            contextText = "No internal knowledge base available."
        }

        // 3. Chat History (Last 5 messages)
        let historyText = ""
        try {
            const recentChats = await db.query.chats.findMany({
                where: eq(chats.leadId, lead.id),
                orderBy: [desc(chats.createdAt)],
                limit: 5
            })
            // Reverse to chronological order
            historyText = recentChats.reverse().map(c => `${c.sender}: ${c.message}`).join("\n")
        } catch (histError) {
            console.log("History fetch error", histError)
        }

        // 4. Gemini Generation
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const systemPrompt = `
        You are Rangga's Assistant at MasWebsite.id.
        CONTEXT FROM DATABASE:
        ${contextText}

        CHAT HISTORY:
        ${historyText}

        USER CURRENT MESSAGE:
        ${message}

        RULES:
        1. Never give price immediately. Ask requirements first.
        2. Keep answers short, professional, and helpful.
        3. If you don't know, ask the user to wait for human admin.
        4. Answer in Indonesian unless user speaks English.
        `

        let aiMessage = ""
        try {
             const result = await model.generateContent(systemPrompt)
             aiMessage = result.response.text()
        } catch (aiError) {
            console.error("AI Generation Error:", aiError)
            aiMessage = "Maaf, saya sedang mengalami gangguan. Admin akan segera membalas."
        }

        // 5. Save & Send
        try {
            await db.insert(chats).values({
                leadId: lead.id,
                sender: "ai",
                message: aiMessage
            })
        } catch (e) { console.log("DB Insert skipped", e) }

        // Send via Fonnte
        await sendWhatsApp(sender, aiMessage)

        return NextResponse.json({ success: true, response: aiMessage })

    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
