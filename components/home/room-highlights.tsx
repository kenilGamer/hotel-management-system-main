import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { RoomType } from "@/lib/types"
import { Users, ArrowRight } from "lucide-react"

interface Room {
  _id: string
  roomNumber: string
  type: RoomType
  pricePerNight: number
  capacity: number
  amenities: string[]
  description: string
  images: string[]
  status: string
}

interface RoomHighlightsProps {
  rooms: Room[]
}

const getTypeLabel = (type: RoomType) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function RoomHighlights({ rooms }: RoomHighlightsProps) {
  if (rooms.length === 0) {
    return null
  }

  const featuredRooms = rooms.slice(0, 6)

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="container px-4">
        <div className="text-center space-y-6 mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Featured Rooms
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Discover our handpicked selection of premium accommodations
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {featuredRooms.map((room, index) => (
            <Card
              key={room._id} 
              className="overflow-hidden group hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border-2 hover:border-primary/40 bg-card/60 backdrop-blur-md hover:bg-card rounded-2xl"
            >
              <div className="relative h-64 w-full bg-muted overflow-hidden rounded-t-2xl">
                {room.images && room.images.length > 0 ? (
                  <Image
                    src={room.images[0]}
                    alt={room.roomNumber}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-background/95 backdrop-blur-sm shadow-lg">
                    {getTypeLabel(room.type)}
                  </Badge>
                </div>
                {room.status === "available" && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                      Available
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                  {room.roomNumber}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Users className="h-4 w-4 text-primary/80" />
                  <span className="font-medium">{room.capacity} guests</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {room.description}
                </p>
                <div className="flex items-baseline justify-between pt-3 border-t border-border/50">
                  <div>
                    <p className="text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      {formatCurrency(room.pricePerNight)}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">per night</p>
                  </div>
                </div>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
                        +{room.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-6 pb-6">
                <div className="w-full relative group/btn overflow-hidden rounded-lg">
                  <Button asChild className="w-full h-12 hover:shadow-glow transition-all duration-300 bg-gradient-to-r from-primary via-primary/95 to-primary hover:from-primary/90 hover:to-primary font-bold relative z-10">
                    <Link href={`/customer/rooms/${room._id}/book`} className="flex items-center justify-center">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                    </Link>
                  </Button>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-20 animate-fade-in-up">
          <Button asChild variant="outline" size="lg" className="group hover:shadow-glow transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50 px-8 py-6 h-auto font-semibold">
            <Link href="/customer/rooms" className="flex items-center">
              View All Rooms
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
