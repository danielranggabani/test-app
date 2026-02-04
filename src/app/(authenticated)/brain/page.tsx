"use client"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Globe, Database, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const knowledgeItems = [
    { title: "Pricing_List_2024.pdf", type: "pdf", content: "Our standard pricing starts at $49/mo for the starter plan. Enterprise solutions are customized based on volume.", tags: ["Finance", "Synced"], updated: "2h ago" },
    { title: "maswebsite.id/support/faq", type: "web", content: "Q: How do I reset my password? A: You can reset your password by clicking 'Forgot Password' on the login screen.", tags: ["Technical", "Verified"], updated: "1d ago" },
    { title: "Custom_Model_Guidelines", type: "text", content: "Tone of voice guidelines: Always maintain a professional yet helpful tone. Avoid slang.", tags: ["Policy"], updated: "5h ago" },
    { title: "Competitor X Weaknesses", type: "market", content: "1. High entry price for SME. 2. Complex UI requires 2 weeks training. 3. No native WhatsApp integration.", tags: ["Market"], updated: "yesterday" },
]

export default function BrainPage() {
  return (
    <>
      <Header title="AI Knowledge Brain" />
      <div className="p-8 space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-black tracking-tight">AI Knowledge Brain</h1>
                <p className="text-muted-foreground mt-1 max-w-xl">Centralized neural hub for your business data.</p>
             </div>
             <div className="flex items-center gap-3">
                 <Button>
                    <Plus className="size-4 mr-2" />
                    Add New Data
                 </Button>
             </div>
         </div>

         {/* Masonry Grid */}
         <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {knowledgeItems.map((item, i) => (
                 <Card key={i} className="break-inside-avoid mb-6">
                     <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-lg text-primary">
                                    {item.type === 'pdf' ? <FileText className="size-4" /> :
                                     item.type === 'web' ? <Globe className="size-4" /> :
                                     <Database className="size-4" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                                    <p className="text-[10px] text-muted-foreground font-mono">Updated {item.updated}</p>
                                </div>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground">
                                <MoreVertical className="size-4" />
                            </button>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                            <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-4">&quot;{item.content}&quot;</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                             {item.tags.map(tag => (
                                 <Badge key={tag} variant="secondary" className="uppercase text-[10px]">{tag}</Badge>
                             ))}
                        </div>
                     </CardContent>
                 </Card>
             ))}
         </div>
      </div>
    </>
  )
}
