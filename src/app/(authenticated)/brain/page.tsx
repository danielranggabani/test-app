import { Header } from "@/components/layout/Header"
import { BrainGrid } from "./BrainGrid"
import { db } from "@/db"
import { knowledgeBase } from "@/db/schema"
import { desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export default async function BrainPage() {
  const items = await db.query.knowledgeBase.findMany({
      orderBy: [desc(knowledgeBase.createdAt)]
  })

  return (
    <>
      <Header title="AI Knowledge Brain" />
      <div className="p-8 space-y-8">
         <BrainGrid initialItems={items} />
      </div>
    </>
  )
}
