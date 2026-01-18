import { getRooms } from "@/app/actions/rooms"
import { RoomsGrid } from "@/app/customer/rooms/components/rooms-grid"

export const metadata = {
  title: "Rooms | Hotel Management",
  description: "Browse available rooms",
}

export default async function CustomerRoomsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filters = {
    type: searchParams.type as any,
    status: "available" as any,
    search: searchParams.search as string,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : undefined,
  }

  const rooms = await getRooms(filters)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Rooms</h1>
        <p className="text-muted-foreground">Browse and book your perfect room</p>
      </div>
      <RoomsGrid rooms={rooms} />
    </div>
  )
}
