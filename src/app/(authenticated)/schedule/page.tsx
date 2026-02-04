"use client"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function SchedulePage() {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8 to 20
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Mock bookings
  const bookings = [
      { day: 0, hour: 8, client: "John Doe" }, // Mon 8am
      { day: 2, hour: 10, client: "Sarah Smith" }, // Wed 10am
      { day: 3, hour: 13, client: "Tech Corp" }, // Thu 1pm
  ]

  const getBooking = (dayIndex: number, hour: number) => {
      return bookings.find(b => b.day === dayIndex && b.hour === hour)
  }

  return (
    <>
      <Header title="Schedule Manager" />
      <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
         <div className="flex justify-between items-end mb-4">
             <div>
                <h1 className="text-3xl font-black tracking-tight">Availability Schedule</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                    Oct 23 - Oct 29, 2023
                </p>
             </div>
             <div className="flex gap-2">
                 <Button variant="secondary"><ChevronLeft className="size-4 mr-2"/> Prev Week</Button>
                 <Button variant="secondary">Next Week <ChevronRight className="size-4 ml-2"/></Button>
                 <Button><Plus className="size-4 mr-2"/> Book Slot</Button>
             </div>
         </div>

         <div className="flex-1 overflow-auto border border-border rounded-xl bg-card">
             <table className="w-full table-fixed border-collapse">
                 <thead>
                     <tr className="bg-secondary/50 border-b border-border">
                         <th className="w-20 p-4 text-xs font-bold text-muted-foreground uppercase tracking-widest border-r border-border">Time</th>
                         {days.map((day, i) => (
                             <th key={day} className="p-4 border-r border-border last:border-r-0">
                                 <div className="flex flex-col items-center">
                                     <span className="text-[10px] font-bold opacity-50 uppercase">{day}</span>
                                     <span className="text-lg font-bold">{23 + i}</span>
                                 </div>
                             </th>
                         ))}
                     </tr>
                 </thead>
                 <tbody>
                     {hours.map((hour) => (
                         <tr key={hour} className="border-b border-border hover:bg-secondary/10">
                             <td className="p-4 text-xs font-mono font-bold text-muted-foreground border-r border-border text-right">
                                 {hour.toString().padStart(2, '0')}:00
                             </td>
                             {days.map((_, dayIndex) => {
                                 const booking = getBooking(dayIndex, hour)

                                 return (
                                     <td key={dayIndex} className="p-2 border-r border-border last:border-r-0">
                                         {hour === 12 ? (
                                             <div className="h-12 w-full flex items-center justify-center text-[10px] text-muted-foreground bg-secondary/20 rounded">
                                                 LUNCH
                                             </div>
                                         ) : booking ? (
                                             <div className="h-12 w-full rounded bg-foreground text-background flex flex-col items-center justify-center p-1">
                                                 <span className="text-[10px] font-bold">BOOKED</span>
                                                 <span className="text-[10px] truncate max-w-full">{booking.client}</span>
                                             </div>
                                         ) : (
                                             <div className="h-12 w-full rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-bold uppercase cursor-pointer hover:bg-emerald-500/20 transition-colors">
                                                 Available
                                             </div>
                                         )}
                                     </td>
                                 )
                             })}
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </>
  )
}
