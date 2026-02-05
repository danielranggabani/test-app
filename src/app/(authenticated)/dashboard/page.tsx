import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Flame, FileText, MoreVertical } from "lucide-react"
import { db } from "@/db"
import { leads, chats } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Fetch Real Stats
  const [totalChats] = await db.select({ count: count() }).from(chats)
  const [hotLeadsCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'hot'))
  const [pendingInvoiceCount] = await db.select({ count: count() }).from(leads).where(eq(leads.status, 'waiting_invoice'))

  // Fetch Action Required (Leads waiting for invoice)
  const actionRequiredLeads = await db.query.leads.findMany({
      where: eq(leads.status, 'waiting_invoice'),
      limit: 5,
      orderBy: (leads, { desc }) => [desc(leads.lastInteraction)]
  })

  return (
    <>
      <Header title="Dashboard Overview" />
      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Total Chat Messages</CardTitle>
               <MessageSquare className="size-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{totalChats.count}</div>
               <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-bold">Lifetime</p>
             </CardContent>
           </Card>

           <Card className="border-primary/50 bg-primary/5">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Hot Leads</CardTitle>
               <Flame className="size-4 text-primary" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{hotLeadsCount.count}</div>
               <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-bold">High Priority</p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoice</CardTitle>
               <FileText className="size-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{pendingInvoiceCount.count}</div>
               <p className="text-xs text-muted-foreground mt-1 text-amber-500 font-bold">Action Needed</p>
             </CardContent>
           </Card>
        </div>

        {/* Action Required */}
        <Card>
           <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Action Required (Waiting Invoice)</CardTitle>
              <button className="text-sm text-muted-foreground hover:text-foreground">View All</button>
           </CardHeader>
           <CardContent>
              {actionRequiredLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No pending actions.</p>
              ) : (
              <Table>
                 <TableHeader>
                    <TableRow>
                       <TableHead>Client / Name</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Phone</TableHead>
                       <TableHead>Last Interaction</TableHead>
                       <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {actionRequiredLeads.map((item) => (
                      <TableRow key={item.id}>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="font-medium">{item.name || "Unknown"}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge variant="secondary" className="uppercase text-[10px]">{item.status}</Badge>
                         </TableCell>
                         <TableCell className="text-xs text-muted-foreground">
                            {item.phoneNumber}
                         </TableCell>
                         <TableCell className="text-xs text-muted-foreground">
                             {item.lastInteraction ? format(item.lastInteraction, "MMM d, HH:mm") : "-"}
                         </TableCell>
                         <TableCell className="text-right">
                            <button className="text-muted-foreground hover:text-foreground">
                               <MoreVertical className="size-4" />
                            </button>
                         </TableCell>
                      </TableRow>
                    ))}
                 </TableBody>
              </Table>
              )}
           </CardContent>
        </Card>
      </div>
    </>
  )
}
