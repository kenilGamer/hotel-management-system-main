import { notFound } from "next/navigation"
import { getRoom } from "@/app/actions/rooms"
import { RoomForm } from "@/app/admin/rooms/components/room-form"

export const metadata = {
  title: "Edit Room | Hotel Management",
  description: "Edit room details",
}

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const room = await getRoom(id)

  if (!room) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Room</h1>
        <p className="text-muted-foreground">Update room details</p>
      </div>
      <RoomForm room={room} />
    </div>
  )
}
