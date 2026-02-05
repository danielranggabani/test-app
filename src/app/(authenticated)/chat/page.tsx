import { Header } from "@/components/layout/Header"
import { ChatInterface } from "./ChatInterface"
import { db } from "@/db"
import { leads } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
    // 1. Fetch initial leads for sidebar
    const initialLeads = await db.query.leads.findMany({
        orderBy: [desc(leads.lastInteraction)]
    })

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            <div className="w-full">
                <Header title="Live Chat" />
                <ChatInterface initialLeads={initialLeads} />
            </div>
        </div>
    )
}
