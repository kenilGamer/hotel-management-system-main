"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createRoom, updateRoom } from "@/app/actions/rooms"
import { RoomType, RoomStatus } from "@/lib/types"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const roomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.nativeEnum(RoomType),
  pricePerNight: z.string().min(1, "Price is required").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be a positive number"),
  capacity: z.string().min(1, "Capacity is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Capacity must be a positive number"),
  amenities: z.string().default(""),
  description: z.string().min(1, "Description is required"),
  images: z.string().default(""),
  status: z.nativeEnum(RoomStatus),
  size: z.string().optional(),
  bedType: z.string().optional(),
})

type RoomFormValues = z.infer<typeof roomFormSchema>

interface RoomFormProps {
  room?: any
}

export function RoomForm({ room }: RoomFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: room
      ? {
          roomNumber: room.roomNumber,
          type: room.type,
          pricePerNight: room.pricePerNight.toString(),
          capacity: room.capacity.toString(),
          amenities: room.amenities?.join(", ") || "",
          description: room.description,
          images: room.images?.join(", ") || "",
          status: room.status,
          size: room.size || "",
          bedType: room.bedType || "",
        }
      : {
          roomNumber: "",
          type: RoomType.STANDARD,
          pricePerNight: "",
          capacity: "",
          amenities: "",
          description: "",
          images: "",
          status: RoomStatus.AVAILABLE,
          size: "",
          bedType: "",
        },
  })

  const onSubmit = (data: RoomFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("roomNumber", data.roomNumber)
        formData.append("type", data.type)
        formData.append("pricePerNight", data.pricePerNight)
        formData.append("capacity", data.capacity)
        formData.append("amenities", JSON.stringify(data.amenities.split(",").map((a) => a.trim()).filter(Boolean)))
        formData.append("description", data.description)
        formData.append("images", JSON.stringify(data.images.split(",").map((i) => i.trim()).filter(Boolean)))
        formData.append("status", data.status)
        if (data.size) formData.append("size", data.size)
        if (data.bedType) formData.append("bedType", data.bedType)

        const result = room
          ? await updateRoom(room._id.toString(), formData)
          : await createRoom(formData)

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: room ? "Room updated successfully" : "Room created successfully",
          })
          router.push("/admin/rooms")
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
    <Card>
      <CardHeader>
        <CardTitle>{room ? "Edit Room" : "New Room"}</CardTitle>
        <CardDescription>
          {room ? "Update room information" : "Fill in the details to create a new room"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl>
                      <Input placeholder="101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RoomType.STANDARD}>Standard</SelectItem>
                        <SelectItem value={RoomType.DELUXE}>Deluxe</SelectItem>
                        <SelectItem value={RoomType.SUITE}>Suite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Night</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="300 sq ft" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Type (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="King Bed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Room description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input placeholder="WiFi, TV, AC (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter amenities separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URLs</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter image URLs separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoomStatus.AVAILABLE}>Available</SelectItem>
                      <SelectItem value={RoomStatus.OCCUPIED}>Occupied</SelectItem>
                      <SelectItem value={RoomStatus.MAINTENANCE}>Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : room ? "Update Room" : "Create Room"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
