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
import { formatDate, formatCurrency } from "@/lib/utils"
import { BookingStatus } from "@/lib/types"
import { Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Booking {
  _id: string
  room: { roomNumber: string; type: string } | null
  checkIn: string
  checkOut: string
  numberOfGuests: number
  totalAmount: number
  status: BookingStatus
}

interface CustomerBookingsListProps {
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

export function CustomerBookingsList({ bookings }: CustomerBookingsListProps) {
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
        <CardTitle>Your Bookings</CardTitle>
        <CardDescription>All your hotel bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
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
                  {booking.room?.roomNumber || "N/A"} ({booking.room?.type || "N/A"})
                </TableCell>
                <TableCell>{formatDate(booking.checkIn)}</TableCell>
                <TableCell>{formatDate(booking.checkOut)}</TableCell>
                <TableCell>{booking.numberOfGuests}</TableCell>
                <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/customer/bookings/${booking._id}`}>
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
