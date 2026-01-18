import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import connectDB from "@/lib/mongodb"
import Booking, { BookingStatus } from "@/models/Booking"
import Room from "@/models/Room"
import User from "@/models/User"
import Link from "next/link"
import { Calendar } from "lucide-react"

async function getRecentBookings() {
  await connectDB()

  const bookings = await Booking.find()
    .populate("customer", "name email", User)
    .populate("room", "roomNumber type", Room)
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()

  return bookings
}

export async function RecentBookings() {
  const bookings = await getRecentBookings()

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "default"
      case BookingStatus.CHECKED_IN:
        return "default"
      case BookingStatus.CHECKED_OUT:
        return "secondary"
      case BookingStatus.PENDING:
        return "outline"
      case BookingStatus.CANCELLED:
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card className="border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
        <CardTitle className="text-2xl font-extrabold">Recent Bookings</CardTitle>
        <CardDescription className="text-base font-medium">Latest bookings in the system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/70">
                <TableHead className="font-bold">Customer</TableHead>
                <TableHead className="font-bold">Room</TableHead>
                <TableHead className="font-bold">Check-in</TableHead>
                <TableHead className="font-bold">Check-out</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-lg font-semibold">No bookings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking: any, index: number) => (
                  <TableRow 
                    key={booking._id.toString()}
                    className="group hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-bold group-hover:text-primary transition-colors">
                          {booking.customer?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customer?.email || ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{booking.room?.roomNumber || "N/A"}</span>
                      <span className="text-muted-foreground ml-1">({booking.room?.type || "N/A"})</span>
                    </TableCell>
                    <TableCell className="font-medium">{formatDate(booking.checkIn)}</TableCell>
                    <TableCell className="font-medium">{formatDate(booking.checkOut)}</TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusColor(booking.status)}
                        className="font-semibold px-3 py-1 hover:scale-105 transition-transform"
                      >
                        {booking.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {bookings.length > 0 && (
          <div className="mt-6 text-center pb-6 border-t pt-4">
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 hover:underline transition-all duration-300 group"
            >
              View all bookings
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
