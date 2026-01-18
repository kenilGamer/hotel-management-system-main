import { RoomForm } from "@/app/admin/rooms/components/room-form"

export const metadata = {
  title: "New Room | Hotel Management",
  description: "Create a new room",
}

export default function NewRoomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Room</h1>
        <p className="text-muted-foreground">Add a new room to the system</p>
      </div>
      <RoomForm />
    </div>
  )
}
