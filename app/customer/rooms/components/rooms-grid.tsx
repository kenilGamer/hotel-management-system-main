"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { RoomType } from "@/lib/types"

interface Room {
  _id: string
  roomNumber: string
  type: RoomType
  pricePerNight: number
  capacity: number
  amenities: string[]
  description: string
  images: string[]
  size?: string
  bedType?: string
}

interface RoomsGridProps {
  rooms: Room[]
}

const getTypeLabel = (type: RoomType) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function RoomsGrid({ rooms }: RoomsGridProps) {
  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No rooms available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-lg font-semibold mb-2">
              {formatCurrency(room.pricePerNight)}/night
            </p>
            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
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
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/customer/rooms/${room._id}/book`}>Book Now</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
