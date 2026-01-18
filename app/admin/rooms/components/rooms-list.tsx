"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { RoomType, RoomStatus } from "@/lib/types"
import { Edit, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteRoom } from "@/app/actions/rooms"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Room {
  _id: string
  roomNumber: string
  type: RoomType
  pricePerNight: number
  capacity: number
  amenities: string[]
  description: string
  images: string[]
  status: RoomStatus
  size?: string
  bedType?: string
}

interface RoomsListProps {
  rooms: Room[]
}

const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return "default"
    case RoomStatus.OCCUPIED:
      return "secondary"
    case RoomStatus.MAINTENANCE:
      return "destructive"
    default:
      return "outline"
  }
}

const getTypeLabel = (type: RoomType) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async (roomId: string) => {
    try {
      const result = await deleteRoom(roomId)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Room deleted successfully",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      })
    }
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No rooms found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <Card key={room._id} className="overflow-hidden">
          <div className="relative h-48 w-full bg-muted">
            {room.images && room.images.length > 0 ? (
              <Image
                src={room.images[0]}
                alt={room.roomNumber}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant={getStatusColor(room.status)}>
                {room.status}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle>{room.roomNumber}</CardTitle>
            <CardDescription>
              {getTypeLabel(room.type)} • {room.capacity} guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {room.description}
            </p>
            <p className="text-lg font-semibold">
              {formatCurrency(room.pricePerNight)}/night
            </p>
            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{room.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/admin/rooms/${room._id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the room
                    {room.roomNumber}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(room._id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
