"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createBooking } from "@/app/actions/bookings"
import { formatCurrency } from "@/lib/utils"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const bookingFormSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  numberOfGuests: z.string().min(1, "Number of guests is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Must be a positive number"),
  specialRequests: z.string().optional(),
}).refine((data) => {
  const checkIn = new Date(data.checkIn)
  const checkOut = new Date(data.checkOut)
  return checkOut > checkIn
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"],
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

interface BookingFormProps {
  room: any
}

export function BookingForm({ room }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [nights, setNights] = useState(0)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      numberOfGuests: "1",
      specialRequests: "",
    },
  })

  const checkIn = form.watch("checkIn")
  const checkOut = form.watch("checkOut")

  // Calculate nights and total
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    if (checkOutDate > checkInDate) {
      const diffTime = checkOutDate.getTime() - checkInDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays)
    }
  }

  const totalAmount = nights * room.pricePerNight

  const onSubmit = (data: BookingFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("room", room._id.toString())
        formData.append("checkIn", data.checkIn)
        formData.append("checkOut", data.checkOut)
        formData.append("numberOfGuests", data.numberOfGuests)
        if (data.specialRequests) {
          formData.append("specialRequests", data.specialRequests)
        }

        const result = await createBooking(formData)

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Booking created successfully",
          })
          router.push(`/customer/bookings/${result.bookingId}`)
          router.refresh()
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Enter your booking information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} min={checkIn || new Date().toISOString().split("T")[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="numberOfGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max={room.capacity} {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum capacity: {room.capacity} guests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any special requests..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Processing..." : "Book Now"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Room</p>
            <p className="font-medium">{room.roomNumber} ({room.type})</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price per night</p>
            <p className="font-medium">{formatCurrency(room.pricePerNight)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nights</p>
            <p className="font-medium">{nights}</p>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
