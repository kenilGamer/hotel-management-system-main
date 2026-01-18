"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState("1")
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (checkIn) {
      params.set("checkIn", format(checkIn, "yyyy-MM-dd"))
    }
    if (checkOut) {
      params.set("checkOut", format(checkOut, "yyyy-MM-dd"))
    }
    if (guests) {
      params.set("guests", guests)
    }
    router.push(`/customer/rooms?${params.toString()}`)
  }

  const disabledDays = (date: Date) => {
    if (date < today) return true
    if (checkIn && checkOut) {
      // If both dates are selected, allow all dates
      return false
    }
    if (checkIn && !checkOut) {
      // If only check-in is selected, disable dates before check-in
      return date < checkIn
    }
    return false
  }

  return (
    <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/8 to-background animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_60%)]" />
      
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="container px-4 py-20 md:py-32 relative z-10">
        <div className="mx-auto max-w-5xl text-center space-y-12 animate-fade-in-up">
          {/* Headline */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Book Your Perfect Stay
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Modern rooms, seamless bookings, and secure payments. Experience luxury redefined.
            </p>
          </div>

          {/* Booking Form - Glassmorphism */}
          <div className="glass bg-background/90 backdrop-blur-2xl rounded-3xl border-2 border-white/30 shadow-2xl p-8 md:p-12 transform transition-all duration-700 hover:shadow-glow-lg hover:scale-[1.02] hover:border-primary/40">
            <div className="grid gap-5 md:grid-cols-4 md:gap-4">
              {/* Check-in Date */}
              <div className="space-y-2">
                <Label htmlFor="check-in" className="text-sm font-medium">Check-in</Label>
                <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="check-in"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-medium h-14 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-[1.02]",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DayPicker
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        setCheckIn(date)
                        setCheckInOpen(false)
                        if (checkOut && date && date >= checkOut) {
                          setCheckOut(undefined)
                        }
                      }}
                      disabled={disabledDays}
                      fromDate={today}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out Date */}
              <div className="space-y-2">
                <Label htmlFor="check-out" className="text-sm font-medium">Check-out</Label>
                <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="check-out"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-medium h-14 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-[1.02]",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DayPicker
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => {
                        setCheckOut(date)
                        setCheckOutOpen(false)
                      }}
                      disabled={(date) => {
                        if (date < today) return true
                        if (checkIn && date <= checkIn) return true
                        return false
                      }}
                      fromDate={checkIn || today}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-sm font-medium">Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger id="guests" className="w-full h-14 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-[1.02]">
                    <Users className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <Label className="invisible">Search</Label>
                <div className="relative group overflow-hidden rounded-md">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-14 text-base font-black shadow-xl hover:shadow-glow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary via-primary/95 to-primary animate-gradient relative z-10"
                    size="lg"
                  >
                    Book Now
                  </Button>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => router.push("/customer/rooms")}
                className="text-sm font-medium hover:text-primary transition-colors group"
              >
                View All Rooms
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
