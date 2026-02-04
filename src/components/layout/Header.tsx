import { Bell, Search } from "lucide-react"

export function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-background border-b border-border px-8 flex items-center justify-between sticky top-0 z-40">
       <h2 className="text-lg font-semibold">{title}</h2>
       <div className="flex items-center gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
             <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-secondary border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
             />
          </div>
          <button className="text-muted-foreground hover:text-foreground">
             <Bell className="size-5" />
          </button>
       </div>
    </header>
  )
}
