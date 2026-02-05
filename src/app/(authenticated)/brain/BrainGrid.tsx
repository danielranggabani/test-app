"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { addToBrain, deleteKnowledge } from "@/actions/brain"

type KnowledgeItem = {
    id: number
    content: string
    createdAt: Date | null
}

export function BrainGrid({ initialItems }: { initialItems: KnowledgeItem[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [newContent, setNewContent] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const handleAdd = async () => {
        if (!newContent.trim()) return
        setIsSaving(true)
        await addToBrain(newContent)
        setIsSaving(false)
        setIsAdding(false)
        setNewContent("")
    }

    const handleDelete = async (id: number) => {
        if (confirm("Delete this context?")) {
            await deleteKnowledge(id)
        }
    }

    return (
        <>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-black tracking-tight">AI Knowledge Brain</h1>
                <p className="text-muted-foreground mt-1 max-w-xl">Centralized neural hub for your business data.</p>
             </div>
             <div className="flex items-center gap-3">
                 <Button onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="size-4 mr-2" />
                    {isAdding ? "Cancel" : "Add New Data"}
                 </Button>
             </div>
         </div>

         {/* Add Area */}
         {isAdding && (
             <Card className="border-primary/50">
                 <CardContent className="p-6 space-y-4">
                     <Textarea
                        placeholder="Paste text, FAQ, or price list here..."
                        className="bg-secondary/50 min-h-[150px] font-mono text-xs"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                     />
                     <div className="flex justify-end">
                         <Button onClick={handleAdd} disabled={isSaving}>
                             {isSaving ? "Embedding..." : "Save & Train Model"}
                         </Button>
                     </div>
                 </CardContent>
             </Card>
         )}

         {/* Masonry Grid */}
         <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {initialItems.map((item) => (
                 <Card key={item.id} className="break-inside-avoid mb-6 group">
                     <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary rounded-lg text-primary">
                                    <FileText className="size-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm line-clamp-1">Text Snippet</h3>
                                    <p className="text-[10px] text-muted-foreground font-mono">
                                        ID: {item.id}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                            <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-6">&quot;{item.content}&quot;</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                             <Badge variant="secondary" className="uppercase text-[10px]">Synced</Badge>
                        </div>
                     </CardContent>
                 </Card>
             ))}
         </div>
        </>
    )
}
