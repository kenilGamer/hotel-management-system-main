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
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest bookings in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking: any) => (
                <TableRow key={booking._id.toString()}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {booking.customer?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.customer?.email || ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.room?.roomNumber || "N/A"} ({booking.room?.type || "N/A"})
                  </TableCell>
                  <TableCell>{formatDate(booking.checkIn)}</TableCell>
                  <TableCell>{formatDate(booking.checkOut)}</TableCell>
                  <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(booking.status)}>
                      {booking.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {bookings.length > 0 && (
          <div className="mt-4 text-center">
            <Link
              href="/admin/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all bookings →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
