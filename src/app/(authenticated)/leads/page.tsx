import { Header } from "@/components/layout/Header"
import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/db"
import { leads } from "@/db/schema"
import { desc } from "drizzle-orm"
import { LeadsTable } from "./LeadsTable"

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const allLeads = await db.query.leads.findMany({
      orderBy: [desc(leads.lastInteraction)]
  })

  return (
    <>
      <Header title="Leads Management" />
      <div className="p-8 space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-black tracking-tight">Leads</h1>
               <p className="text-muted-foreground text-sm mt-1">Manage industrial prospects and track conversion pipeline.</p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-4" />
                  Export CSV
               </Button>
               <Button size="sm" className="gap-2">
                  <Plus className="size-4" />
                  Add New Lead
               </Button>
            </div>
         </div>

         <div className="rounded-xl border border-border overflow-hidden bg-card">
            <LeadsTable leads={allLeads} />
         </div>
      </div>
    </>
  )
}
