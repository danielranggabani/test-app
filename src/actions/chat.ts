"use server"
import { db } from "@/db"
import { chats, leads } from "@/db/schema"
import { eq } from "drizzle-orm"
import { sendWhatsApp } from "@/lib/fonnte"
import { revalidatePath } from "next/cache"

export async function sendMessage(leadId: number, message: string) {
    // 1. Get Lead Phone
    const lead = await db.query.leads.findFirst({
        where: eq(leads.id, leadId)
    })

    if (!lead) throw new Error("Lead not found")

    // 2. Save Admin Message to DB
    await db.insert(chats).values({
        leadId: leadId,
        sender: "admin",
        message: message
    })

    // 3. Send via Fonnte
    await sendWhatsApp(lead.phoneNumber, message)

    revalidatePath('/chat')
    return { success: true }
}

export async function toggleAI(leadId: number, status: boolean) {
    await db.update(leads)
            .set({ aiActive: status })
            .where(eq(leads.id, leadId))

    revalidatePath('/chat')
    return { success: true }
}
