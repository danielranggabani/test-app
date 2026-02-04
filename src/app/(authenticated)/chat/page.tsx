"use client"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

// Mock fetch function
const fetchChats = async () => {
    // In real app: return await fetch('/api/chats').then(res => res.json())
    return [
       { id: 1, sender: "user", message: "Hello, I have a question about my order.", time: "12:45 PM" },
       { id: 2, sender: "ai", message: "Hello Alex, I've checked your order #4402. It is currently in the final quality check stage.", time: "12:46 PM" },
       { id: 3, sender: "user", message: "Great, thank you! Will it arrive by Friday?", time: "12:47 PM" },
       { id: 4, sender: "admin", message: "Yes, based on the shipping method, it should reach you by Friday.", time: "12:50 PM" },
    ]
}

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState(1)
    const [aiEnabled, setAiEnabled] = useState(true)

    const { data: messages } = useQuery({
        queryKey: ['chats', activeChat],
        queryFn: fetchChats,
        refetchInterval: 3000, // Polling every 3s
    })

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Chat Sidebar */}
            <aside className="w-80 border-r border-border bg-background flex flex-col">
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                        <Input placeholder="Search contacts..." className="pl-9 bg-secondary border-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-4 flex gap-3 cursor-pointer hover:bg-secondary/50 ${i === activeChat ? 'bg-secondary/50 border-r-2 border-primary' : ''}`} onClick={() => setActiveChat(i)}>
                           <Avatar>
                               <AvatarFallback>AR</AvatarFallback>
                           </Avatar>
                           <div className="flex-1 min-w-0">
                               <div className="flex justify-between items-baseline">
                                   <p className="font-semibold text-sm">Alex Rivera</p>
                                   <p className="text-[10px] text-muted-foreground">12:45 PM</p>
                               </div>
                               <p className="text-xs text-muted-foreground truncate">Hello, I have a question...</p>
                           </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            <section className="flex-1 flex flex-col bg-secondary/20">
                <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>AR</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-sm font-bold">Alex Rivera</h3>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active Now</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-semibold text-muted-foreground">AI Auto-Reply</span>
                           <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                        </div>
                        <div className="h-6 w-px bg-border"></div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="size-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {messages?.map((msg, idx) => (
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
                             <span className="text-[10px] text-muted-foreground mt-1">{msg.time}</span>
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
                             />
                        </div>
                         <Button className="rounded-xl size-11 p-0 shadow-lg shadow-primary/20">
                            <Send className="size-5" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
