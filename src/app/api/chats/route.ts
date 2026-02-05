import { NextResponse } from 'next/server'
import { db } from "@/db"
import { chats } from "@/db/schema"
import { eq, asc } from "drizzle-orm"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
        return NextResponse.json({ error: "Lead ID required" }, { status: 400 })
    }

    try {
        const messages = await db.query.chats.findMany({
            where: eq(chats.leadId, parseInt(leadId)),
            orderBy: [asc(chats.createdAt)]
        })

        return NextResponse.json(messages)
    } catch {
        return NextResponse.json({ error: "DB Error" }, { status: 500 })
    }
}
