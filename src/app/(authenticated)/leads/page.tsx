import { Header } from "@/components/layout/Header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LeadsPage() {
  const leads = [
    { name: "Alex Johnson", company: "Johnson Dynamics", phone: "+1 234 567 890", needs: "Industrial website redesign", status: "COLD", lastAction: "2 hours ago" },
    { name: "Sarah Miller", company: "Miller Logistics", phone: "+1 345 678 901", needs: "E-commerce platform setup", status: "WARM", lastAction: "5 hours ago" },
    { name: "Michael Chen", company: "Zenith Heavy Ind.", phone: "+1 456 789 012", needs: "Custom CMS integration", status: "HOT", lastAction: "1 day ago" },
    { name: "Emma Wilson", company: "Apex Global", phone: "+1 567 890 123", needs: "SEO Audit & Optimization", status: "DEAL", lastAction: "3 days ago" },
  ]

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
            <Table>
               <TableHeader>
                  <TableRow className="bg-muted/50">
                     <TableHead className="w-[200px]">Name / Company</TableHead>
                     <TableHead>Contact Info</TableHead>
                     <TableHead>Needs Summary</TableHead>
                     <TableHead>Pipeline Status</TableHead>
                     <TableHead>Last Action</TableHead>
                     <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {leads.map((lead, i) => (
                     <TableRow key={i}>
                        <TableCell>
                           <div className="flex items-center gap-3">
                              <div className="size-8 rounded bg-secondary flex items-center justify-center text-xs font-bold">
                                 {lead.name.substring(0,2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-semibold text-sm">{lead.name}</span>
                                 <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lead.company}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{lead.phone}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{lead.needs}</TableCell>
                        <TableCell>
                           <Badge variant={lead.status === "HOT" ? "default" : lead.status === "DEAL" ? "default" : "secondary"} className="uppercase text-[10px]">
                              {lead.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{lead.lastAction}</TableCell>
                        <TableCell>
                           <button className="text-muted-foreground hover:text-foreground">
                              <MoreVertical className="size-4" />
                           </button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
    </>
  )
}
