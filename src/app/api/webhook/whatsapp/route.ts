import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/db"
import { chats, leads, knowledgeBase } from "@/db/schema"
import { eq, sql, cosineDistance, desc } from "drizzle-orm"
import { sendWhatsApp } from "@/lib/fonnte"

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock-key")

/**
 * Webhook Handler for WhatsApp (Fonnte)
 *
 * This endpoint processes incoming messages:
 * 1. Checks/Creates Lead context in DB.
 * 2. Verifies if AI is active for the lead.
 * 3. Performs RAG (Vector Search) on Knowledge Base.
 * 4. Generates AI response using Gemini Pro.
 * 5. Sends reply back to user via Fonnte.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { sender, message } = body // Fonnte payload format

        if (!sender || !message) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

        // ------------------------------------------------------------------
        // 1. Context Check: Find or Create Lead
        // ------------------------------------------------------------------
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
                    aiActive: true // Default ON for new leads
                }).returning()
                lead = newLead
            }
        } catch (dbError) {
            console.error("DB Error (Connection failed?):", dbError)
            // Fallback object for resilience during partial outages or dev
            lead = { id: 1, phoneNumber: sender, aiActive: true }
        }

        // Save the User's Message immediately
        try {
            await db.insert(chats).values({
                leadId: lead.id,
                sender: "user",
                message: message
            })
        } catch (e) { console.log("DB Insert skipped", e) }

        // ------------------------------------------------------------------
        // AI Toggle Check
        // ------------------------------------------------------------------
        if (lead.aiActive === false) {
             console.log(`[AI SKIP] AI is disabled for lead ${lead.id}`)
             return NextResponse.json({ status: "skipped", reason: "AI Disabled" })
        }

        // ------------------------------------------------------------------
        // 2. RAG Search (Retrieval Augmented Generation)
        // ------------------------------------------------------------------
        let contextText = ""
        try {
            // Generate embedding for the incoming user query
            const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" })
            const embeddingResult = await embeddingModel.embedContent(message)
            const embedding = embeddingResult.embedding.values

            // Perform Cosine Similarity Search in Postgres (pgvector)
            const similarDocs = await db.select({ content: knowledgeBase.content })
                                       .from(knowledgeBase)
                                       .orderBy(sql`${cosineDistance(knowledgeBase.embedding, embedding)}`)
                                       .limit(3) // Get top 3 most relevant chunks

            contextText = similarDocs.map(d => d.content).join("\n")
        } catch (ragError) {
            console.error("RAG Error (Embedding/DB):", ragError)
            contextText = "No internal knowledge base available."
        }

        // ------------------------------------------------------------------
        // 3. Chat History Retrieval
        // ------------------------------------------------------------------
        let historyText = ""
        try {
            // Fetch last 5 messages for context window
            const recentChats = await db.query.chats.findMany({
                where: eq(chats.leadId, lead.id),
                orderBy: [desc(chats.createdAt)],
                limit: 5
            })
            // Reverse to put in chronological order for the LLM
            historyText = recentChats.reverse().map(c => `${c.sender}: ${c.message}`).join("\n")
        } catch (histError) {
            console.log("History fetch error", histError)
        }

        // ------------------------------------------------------------------
        // 4. Gemini Generation
        // ------------------------------------------------------------------
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

        // ------------------------------------------------------------------
        // 5. Save AI Response & Send via WhatsApp
        // ------------------------------------------------------------------
        try {
            await db.insert(chats).values({
                leadId: lead.id,
                sender: "ai",
                message: aiMessage
            })
        } catch (e) { console.log("DB Insert skipped", e) }

        // Trigger Fonnte API
        await sendWhatsApp(sender, aiMessage)

        return NextResponse.json({ success: true, response: aiMessage })

    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
