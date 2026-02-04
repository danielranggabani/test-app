import { NextResponse } from 'next/server'

export async function POST() {
    // 1. Parse content
    // const body = await req.json()
    // const { content } = body

    // 2. Generate Embedding (Stub)
    // const embedding = await google.embed(content)
    // const embedding = new Array(768).fill(0)

    // 3. Save to DB (Stub)
    // await db.insert(knowledgeBase).values({ content, embedding })

    return NextResponse.json({ success: true, message: "Embedded and saved (Stub)" })
}
