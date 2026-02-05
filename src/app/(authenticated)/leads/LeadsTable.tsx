"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { updateLeadStatus } from "@/actions/leads"

type Lead = {
    id: number
    name: string | null
    phoneNumber: string
    status: string | null
    needsSummary: string | null
    lastInteraction: Date | null
}

export function LeadsTable({ leads }: { leads: Lead[] }) {

    const handleStatusClick = async (id: number, currentStatus: string | null) => {
        // Simple cycle for demo: cold -> warm -> hot -> deal -> cold
        const map: Record<string, string> = {
            'cold': 'warm',
            'warm': 'hot',
            'hot': 'deal',
            'deal': 'cold',
            'waiting_invoice': 'deal'
        }
        const next = map[currentStatus || 'cold'] || 'cold'
        await updateLeadStatus(id, next)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">Name / Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Needs Summary</TableHead>
                    <TableHead>Last Action</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leads.map((lead) => (
                    <TableRow key={lead.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded bg-secondary flex items-center justify-center text-xs font-bold">
                                    {lead.name ? lead.name.substring(0,2).toUpperCase() : "U"}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{lead.name || "Unknown"}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lead.phoneNumber}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={lead.status === "hot" ? "default" : lead.status === "deal" ? "default" : "secondary"}
                                className="uppercase text-[10px] cursor-pointer hover:opacity-80"
                                onClick={() => handleStatusClick(lead.id, lead.status)}
                            >
                                {lead.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{lead.needsSummary || "-"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                            {lead.lastInteraction ? format(lead.lastInteraction, "MMM d, HH:mm") : "-"}
                        </TableCell>
                        <TableCell>
                            <button className="text-muted-foreground hover:text-foreground">
                                <MoreVertical className="size-4" />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
