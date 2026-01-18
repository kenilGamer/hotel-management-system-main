"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"
import { BookingStatus } from "@/lib/types"
import { Eye } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateBookingStatus } from "@/app/actions/bookings"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Booking {
  _id: string
  customer: { name: string; email: string } | null
  room: { roomNumber: string; type: string } | null
  checkIn: string
  checkOut: string
  numberOfGuests: number
  totalAmount: number
  status: BookingStatus
}

interface BookingsTableProps {
  bookings: Booking[]
}

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

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Booking status updated",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    }
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No bookings found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>View and manage all hotel bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.customer?.name || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{booking.customer?.email || ""}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.room?.roomNumber || "N/A"} ({booking.room?.type || "N/A"})
                </TableCell>
                <TableCell>{formatDate(booking.checkIn)}</TableCell>
                <TableCell>{formatDate(booking.checkOut)}</TableCell>
                <TableCell>{booking.numberOfGuests}</TableCell>
                <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleStatusChange(booking._id, value as BookingStatus)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={BookingStatus.CONFIRMED}>Confirmed</SelectItem>
                      <SelectItem value={BookingStatus.CHECKED_IN}>Checked In</SelectItem>
                      <SelectItem value={BookingStatus.CHECKED_OUT}>Checked Out</SelectItem>
                      <SelectItem value={BookingStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/bookings/${booking._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
