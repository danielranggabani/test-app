"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageSquare, Users, Calendar, Brain, LogOut } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/chat", label: "Live Chat", icon: MessageSquare },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/brain", label: "AI Brain", icon: Brain },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-background border-r border-border fixed inset-y-0 left-0 z-50 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
           <div className="size-8 bg-foreground rounded flex items-center justify-center">
             <span className="text-background font-bold">M</span>
           </div>
           <span className="font-bold tracking-tight uppercase text-sm">MasWebsite.id</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
         <div className="flex items-center gap-3 px-3 py-2">
            <div className="size-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="font-bold text-xs">AD</span>
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-semibold truncate">Admin</p>
               <p className="text-[10px] text-muted-foreground truncate">admin@maswebsite.id</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
               <LogOut className="size-5" />
            </button>
         </div>
      </div>
    </aside>
  )
}
