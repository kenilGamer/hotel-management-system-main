import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getBookings } from "@/app/actions/bookings"
import { BookingsTable } from "@/app/admin/bookings/components/bookings-table"
import { BookingStatus } from "@/lib/types"

export const metadata = {
  title: "Bookings | Hotel Management",
  description: "Manage all bookings",
}

async function BookingsContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const filters = {
    status: searchParams.status as BookingStatus,
  }

  const bookings = await getBookings(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">Manage all hotel bookings</p>
      </div>

      <Suspense fallback={<BookingsTableSkeleton />}>
        <BookingsTable bookings={bookings} />
      </Suspense>
    </div>
  )
}

function BookingsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function BookingsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return <BookingsContent searchParams={searchParams} />
}
