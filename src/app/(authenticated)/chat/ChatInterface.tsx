"use client"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { sendMessage, toggleAI } from "@/actions/chat"

type Lead = {
    id: number
    name: string | null
    phoneNumber: string
    lastInteraction: Date | null
    aiActive: boolean | null
}

export function ChatInterface({ initialLeads }: { initialLeads: Lead[] }) {
    const [activeLeadId, setActiveLeadId] = useState<number | null>(initialLeads[0]?.id || null)
    const [messageInput, setMessageInput] = useState("")

    // Find active lead object
    const activeLead = initialLeads.find(l => l.id === activeLeadId)

    // Polling for messages
    const { data: messages } = useQuery({
        queryKey: ['chats', activeLeadId],
        queryFn: async () => {
            if (!activeLeadId) return []
            const res = await fetch(`/api/chats?leadId=${activeLeadId}`)
            if (!res.ok) throw new Error("Failed to fetch")
            return res.json()
        },
        enabled: !!activeLeadId,
        refetchInterval: 3000,
    })

    const handleSend = async () => {
        if (!activeLeadId || !messageInput.trim()) return

        const msg = messageInput
        setMessageInput("") // Optimistic clear

        await sendMessage(activeLeadId, msg)
        // Query will refetch automatically next cycle or we could invalidate
    }

    const handleToggleAI = async (checked: boolean) => {
        if (!activeLeadId) return
        await toggleAI(activeLeadId, checked)
        // In a real app we'd update local state or revalidate router to reflect change in sidebar/header immediately
    }

    return (
        <>
            {/* Chat Sidebar */}
            <aside className="w-80 border-r border-border bg-background flex flex-col">
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                        <Input placeholder="Search contacts..." className="pl-9 bg-secondary border-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {initialLeads.map((lead) => (
                        <div
                            key={lead.id}
                            className={`p-4 flex gap-3 cursor-pointer hover:bg-secondary/50 ${lead.id === activeLeadId ? 'bg-secondary/50 border-r-2 border-primary' : ''}`}
                            onClick={() => setActiveLeadId(lead.id)}
                        >
                           <Avatar>
                               <AvatarFallback>{lead.name ? lead.name.substring(0,2).toUpperCase() : "U"}</AvatarFallback>
                           </Avatar>
                           <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-baseline">
                                   <p className="font-semibold text-sm truncate">{lead.name || lead.phoneNumber}</p>
                                   <p className="text-[10px] text-muted-foreground">
                                       {lead.lastInteraction ? new Date(lead.lastInteraction).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                   </p>
                               </div>
                               <p className="text-xs text-muted-foreground truncate">{lead.phoneNumber}</p>
                           </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            {activeLead ? (
            <section className="flex-1 flex flex-col bg-secondary/20">
                <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>{activeLead.name ? activeLead.name.substring(0,2).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-sm font-bold">{activeLead.name || activeLead.phoneNumber}</h3>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active Now</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-semibold text-muted-foreground">AI Auto-Reply</span>
                           <Switch
                                checked={activeLead.aiActive ?? true}
                                onCheckedChange={handleToggleAI}
                           />
                        </div>
                        <div className="h-6 w-px bg-border"></div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="size-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {messages?.map((msg: any, idx: number) => (
                        <div key={idx} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-start' : 'items-end self-end'}`}>
                             {msg.sender !== 'user' && (
                                 <div className="flex items-center gap-1 mb-1 text-[10px] font-bold text-primary uppercase">
                                     {msg.sender === 'ai' ? 'AI Assistant' : 'Admin'}
                                 </div>
                             )}
                             <div className={`p-4 rounded-xl text-sm ${
                                 msg.sender === 'user'
                                 ? 'bg-secondary text-foreground rounded-tl-none'
                                 : 'bg-background border border-border text-foreground rounded-tr-none shadow-sm'
                             }`}>
                                 {msg.message}
                             </div>
                             <span className="text-[10px] text-muted-foreground mt-1">
                                 {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </span>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-end gap-3 max-w-4xl mx-auto">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Paperclip className="size-5" />
                        </Button>
                        <div className="flex-1 relative">
                             <textarea
                                className="w-full bg-secondary border-none rounded-xl focus:ring-1 focus:ring-primary text-sm p-3 min-h-[44px] max-h-32 resize-none placeholder:text-muted-foreground"
                                placeholder="Type a message..."
                                rows={1}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend()
                                    }
                                }}
                             />
                        </div>
                         <Button className="rounded-xl size-11 p-0 shadow-lg shadow-primary/20" onClick={handleSend}>
                            <Send className="size-5" />
                        </Button>
                    </div>
                </div>
            </section>
            ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a chat to start</div>
            )}
        </>
    )
}
