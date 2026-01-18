import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { getRooms } from "@/app/actions/rooms"
import { RoomsList } from "@/app/admin/rooms/components/rooms-list"
import { RoomsFilters } from "@/app/admin/rooms/components/rooms-filters"

export const metadata = {
  title: "Rooms | Hotel Management",
  description: "Manage hotel rooms",
}

async function RoomsContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const filters = {
    type: searchParams.type as any,
    status: searchParams.status as any,
    search: searchParams.search as string,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : undefined,
  }

  const rooms = await getRooms(filters)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">Manage all hotel rooms</p>
        </div>
        <Button asChild>
          <Link href="/admin/rooms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Link>
        </Button>
      </div>

      <RoomsFilters />

      <Suspense fallback={<RoomsListSkeleton />}>
        <RoomsList rooms={rooms} />
      </Suspense>
    </div>
  )
}

function RoomsListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function RoomsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return <RoomsContent searchParams={searchParams} />
}
