import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Flame, FileText, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard Overview" />
      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Chat</CardTitle>
               <MessageSquare className="size-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">1,284</div>
               <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-bold">+12%</p>
             </CardContent>
           </Card>

           <Card className="border-primary/50 bg-primary/5">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Hot Leads</CardTitle>
               <Flame className="size-4 text-primary" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">42</div>
               <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-bold">+5.4%</p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoice</CardTitle>
               <FileText className="size-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">18</div>
               <p className="text-xs text-muted-foreground mt-1 text-amber-500 font-bold">Pending</p>
             </CardContent>
           </Card>
        </div>

        {/* Action Required */}
        <Card>
           <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Action Required</CardTitle>
              <button className="text-sm text-muted-foreground hover:text-foreground">View All</button>
           </CardHeader>
           <CardContent>
              <Table>
                 <TableHeader>
                    <TableRow>
                       <TableHead>Client / Ticket</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Priority</TableHead>
                       <TableHead>Date</TableHead>
                       <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {[
                      { client: "John Doe Corp", ticket: "Hosting Renewal", status: "Pending Pay", priority: "High", date: "Oct 24" },
                      { client: "Studio Creative", ticket: "New Website", status: "Quote Sent", priority: "Medium", date: "Oct 23" },
                      { client: "Meta Ventures", ticket: "Domain Transfer", status: "Technical", priority: "Urgent", date: "Oct 23" },
                    ].map((item, i) => (
                      <TableRow key={i}>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="font-medium">{item.ticket}</span>
                               <span className="text-xs text-muted-foreground">{item.client}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge variant="secondary" className="uppercase text-[10px]">{item.status}</Badge>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-2 text-xs">
                               <div className={cn("size-2 rounded-full", item.priority === "High" || item.priority === "Urgent" ? "bg-destructive" : "bg-primary")}></div>
                               {item.priority}
                            </div>
                         </TableCell>
                         <TableCell className="text-xs text-muted-foreground">{item.date}</TableCell>
                         <TableCell className="text-right">
                            <button className="text-muted-foreground hover:text-foreground">
                               <MoreVertical className="size-4" />
                            </button>
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </div>
    </>
  )
}
