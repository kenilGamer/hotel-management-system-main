import { requireAuth } from "@/lib/auth-utils"
import { getBookings } from "@/app/actions/bookings"
import { CustomerBookingsList } from "@/app/customer/bookings/components/customer-bookings-list"

export const metadata = {
  title: "My Bookings | Hotel Management",
  description: "View your bookings",
}

export default async function CustomerBookingsPage() {
  const user = await requireAuth()
  const bookings = await getBookings({ customerId: user.id })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your bookings</p>
      </div>
      <CustomerBookingsList bookings={bookings} />
    </div>
  )
}
