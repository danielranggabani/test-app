"use server"
import { db } from "@/db"
import { leads } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateLeadStatus(leadId: number, status: string) {
    await db.update(leads)
            .set({ status: status })
            .where(eq(leads.id, leadId))

    revalidatePath('/leads')
    return { success: true }
}
