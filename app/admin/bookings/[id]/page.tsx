import { notFound } from "next/navigation"
import { getBooking } from "@/app/actions/bookings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { BookingStatus } from "@/lib/types"

export const metadata = {
  title: "Booking Details | Hotel Management",
  description: "View booking details",
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = await getBooking(id)

  if (!booking) {
    notFound()
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
        <p className="text-muted-foreground">View booking information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusColor(booking.status)}>
                {booking.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-medium">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-medium">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Number of Guests</p>
              <p className="font-medium">{booking.numberOfGuests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-medium text-lg">{formatCurrency(booking.totalAmount)}</p>
            </div>
            {booking.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground">Special Requests</p>
                <p className="font-medium">{booking.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{booking.customer?.name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{booking.customer?.email || "N/A"}</p>
            </div>
            {booking.customer?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{booking.customer.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="font-medium">{booking.room?.roomNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Type</p>
              <p className="font-medium">{booking.room?.type || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price Per Night</p>
              <p className="font-medium">{formatCurrency(booking.room?.pricePerNight || 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
