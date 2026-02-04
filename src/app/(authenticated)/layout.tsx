import { Sidebar } from "@/components/layout/Sidebar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
