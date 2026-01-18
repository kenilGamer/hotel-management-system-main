import { notFound } from "next/navigation"
import { getRoom } from "@/app/actions/rooms"
import { BookingForm } from "@/app/customer/rooms/[id]/book/components/booking-form"

export const metadata = {
  title: "Book Room | Hotel Management",
  description: "Book a room",
}

export default async function BookRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const room = await getRoom(id)

  if (!room) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book Room {room.roomNumber}</h1>
        <p className="text-muted-foreground">Complete your booking</p>
      </div>
      <BookingForm room={room} />
    </div>
  )
}
