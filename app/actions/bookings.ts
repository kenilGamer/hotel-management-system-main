"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Booking, { BookingStatus } from "@/models/Booking"
import Room, { RoomStatus } from "@/models/Room"
import { z } from "zod"
import { requireAuth, requireAdminOrStaff } from "@/lib/auth-utils"
import { differenceInDays } from "date-fns"

const bookingSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  room: z.string().min(1, "Room is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  numberOfGuests: z.number().min(1, "Number of guests is required"),
  specialRequests: z.string().optional(),
})

export async function checkAvailability(roomId: string, checkIn: Date, checkOut: Date, excludeBookingId?: string) {
  await connectDB()

  const overlappingBookings = await Booking.find({
    room: roomId,
    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN, BookingStatus.PENDING] },
    $or: [
      {
        checkIn: { $lte: checkOut },
        checkOut: { $gte: checkIn },
      },
    ],
    ...(excludeBookingId ? { _id: { $ne: excludeBookingId } } : {}),
  })

  return overlappingBookings.length === 0
}

export async function createBooking(formData: FormData) {
  try {
    const user = await requireAuth()
    await connectDB()

    const data = {
      customer: formData.get("customer") as string || user.id,
      room: formData.get("room") as string,
      checkIn: formData.get("checkIn") as string,
      checkOut: formData.get("checkOut") as string,
      numberOfGuests: parseInt(formData.get("numberOfGuests") as string),
      specialRequests: formData.get("specialRequests") as string || undefined,
    }

    const validatedData = bookingSchema.parse(data)

    const checkInDate = new Date(validatedData.checkIn)
    const checkOutDate = new Date(validatedData.checkOut)

    // Check availability
    const isAvailable = await checkAvailability(validatedData.room, checkInDate, checkOutDate)
    if (!isAvailable) {
      return { error: "Room is not available for the selected dates" }
    }

    // Get room to calculate total amount
    const room = await Room.findById(validatedData.room)
    if (!room) {
      return { error: "Room not found" }
    }

    const nights = differenceInDays(checkOutDate, checkInDate)
    const totalAmount = room.pricePerNight * nights

    const booking = await Booking.create({
      ...validatedData,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalAmount,
      status: BookingStatus.PENDING,
    })

    revalidatePath("/admin/bookings")
    revalidatePath("/customer/bookings")
    return { success: true, bookingId: booking._id.toString() }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create booking" }
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    await requireAdminOrStaff()
    await connectDB()

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return { error: "Booking not found" }
    }

    const updateData: any = { status }

    if (status === BookingStatus.CHECKED_IN) {
      updateData.checkedInAt = new Date()
      // Update room status
      await Room.findByIdAndUpdate(booking.room, { status: RoomStatus.OCCUPIED })
    } else if (status === BookingStatus.CHECKED_OUT) {
      updateData.checkedOutAt = new Date()
      // Update room status
      await Room.findByIdAndUpdate(booking.room, { status: RoomStatus.AVAILABLE })
    } else if (status === BookingStatus.CANCELLED) {
      updateData.cancelledAt = new Date()
      // Update room status if it was occupied
      const room = await Room.findById(booking.room)
      if (room?.status === RoomStatus.OCCUPIED) {
        await Room.findByIdAndUpdate(booking.room, { status: RoomStatus.AVAILABLE })
      }
    }

    await Booking.findByIdAndUpdate(bookingId, updateData)

    revalidatePath("/admin/bookings")
    revalidatePath("/customer/bookings")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update booking status" }
  }
}

export async function getBookings(filters?: {
  customerId?: string
  status?: BookingStatus
  roomId?: string
}) {
  await connectDB()

  const query: any = {}

  if (filters?.customerId) {
    query.customer = filters.customerId
  }

  if (filters?.status) {
    query.status = filters.status
  }

  if (filters?.roomId) {
    query.room = filters.roomId
  }

  const bookings = await Booking.find(query)
    .populate("customer", "name email", "User")
    .populate("room", "roomNumber type", "Room")
    .sort({ createdAt: -1 })
    .lean()

  // Transform bookings to ensure _id is string and populated fields are properly typed and serialized
  return bookings.map((booking) => {
    const customer = booking.customer as any
    const room = booking.room as any
    
    // Explicitly construct the object to avoid passing Mongoose internals
    return {
      _id: booking._id.toString(),
      customer: customer
        ? {
            name: String(customer.name || ""),
            email: String(customer.email || ""),
          }
        : null,
      room: room
        ? {
            roomNumber: String(room.roomNumber || ""),
            type: String(room.type || ""),
          }
        : null,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      numberOfGuests: booking.numberOfGuests,
      totalAmount: booking.totalAmount,
      status: booking.status,
      specialRequests: booking.specialRequests || undefined,
      cancellationReason: booking.cancellationReason || undefined,
      cancelledAt: booking.cancelledAt ? booking.cancelledAt.toISOString() : undefined,
      checkedInAt: booking.checkedInAt ? booking.checkedInAt.toISOString() : undefined,
      checkedOutAt: booking.checkedOutAt ? booking.checkedOutAt.toISOString() : undefined,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }
  })
}

export async function getBooking(bookingId: string) {
  await connectDB()
  const booking = await Booking.findById(bookingId)
    .populate("customer", "name email phone", "User")
    .populate("room", "roomNumber type pricePerNight", "Room")
    .populate("payment", "amount status gateway", "Payment")
    .lean()

  if (!booking) {
    return null
  }

  // Type assertion for populated fields (using unknown first to avoid type errors)
  return {
    ...booking,
    customer: booking.customer as unknown as { _id: string; name: string; email: string; phone?: string } | null,
    room: booking.room as unknown as { _id: string; roomNumber: string; type: string; pricePerNight: number } | null,
    payment: booking.payment as unknown as { _id: string; amount: number; status: string; gateway: string } | null,
  }
}
