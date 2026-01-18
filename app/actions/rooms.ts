"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Room, { RoomType, RoomStatus } from "@/models/Room"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth-utils"

const roomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  type: z.nativeEnum(RoomType),
  pricePerNight: z.number().min(0, "Price must be positive"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  amenities: z.array(z.string()).default([]),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string()).default([]),
  status: z.nativeEnum(RoomStatus).default(RoomStatus.AVAILABLE),
  size: z.string().optional(),
  bedType: z.string().optional(),
})

export async function createRoom(formData: FormData) {
  try {
    await requireAdmin()
    await connectDB()

    const data = {
      roomNumber: formData.get("roomNumber") as string,
      type: formData.get("type") as RoomType,
      pricePerNight: parseFloat(formData.get("pricePerNight") as string),
      capacity: parseInt(formData.get("capacity") as string),
      amenities: JSON.parse(formData.get("amenities") as string || "[]"),
      description: formData.get("description") as string,
      images: JSON.parse(formData.get("images") as string || "[]"),
      status: (formData.get("status") as RoomStatus) || RoomStatus.AVAILABLE,
      size: formData.get("size") as string || undefined,
      bedType: formData.get("bedType") as string || undefined,
    }

    const validatedData = roomSchema.parse(data)

    const room = await Room.create(validatedData)
    revalidatePath("/admin/rooms")
    return { success: true, roomId: room._id.toString() }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    if (error instanceof Error && error.message.includes("duplicate")) {
      return { error: "Room number already exists" }
    }
    return { error: "Failed to create room" }
  }
}

export async function updateRoom(roomId: string, formData: FormData) {
  try {
    await requireAdmin()
    await connectDB()

    const data = {
      roomNumber: formData.get("roomNumber") as string,
      type: formData.get("type") as RoomType,
      pricePerNight: parseFloat(formData.get("pricePerNight") as string),
      capacity: parseInt(formData.get("capacity") as string),
      amenities: JSON.parse(formData.get("amenities") as string || "[]"),
      description: formData.get("description") as string,
      images: JSON.parse(formData.get("images") as string || "[]"),
      status: formData.get("status") as RoomStatus,
      size: formData.get("size") as string || undefined,
      bedType: formData.get("bedType") as string || undefined,
    }

    const validatedData = roomSchema.partial().parse(data)

    const room = await Room.findByIdAndUpdate(roomId, validatedData, { new: true, runValidators: true })
    if (!room) {
      return { error: "Room not found" }
    }

    revalidatePath("/admin/rooms")
    revalidatePath(`/admin/rooms/${roomId}`)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to update room" }
  }
}

export async function deleteRoom(roomId: string) {
  try {
    await requireAdmin()
    await connectDB()

    const room = await Room.findByIdAndDelete(roomId)
    if (!room) {
      return { error: "Room not found" }
    }

    revalidatePath("/admin/rooms")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete room" }
  }
}

export async function getRooms(filters?: {
  type?: RoomType
  status?: RoomStatus
  search?: string
  minPrice?: number
  maxPrice?: number
}) {
  await connectDB()

  const query: any = {}

  if (filters?.type) {
    query.type = filters.type
  }

  if (filters?.status) {
    query.status = filters.status
  }

  if (filters?.minPrice || filters?.maxPrice) {
    query.pricePerNight = {}
    if (filters.minPrice) {
      query.pricePerNight.$gte = filters.minPrice
    }
    if (filters.maxPrice) {
      query.pricePerNight.$lte = filters.maxPrice
    }
  }

  if (filters?.search) {
    query.$or = [
      { roomNumber: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ]
  }

  const rooms = await Room.find(query).sort({ roomNumber: 1 }).lean()
  
  // Transform rooms to ensure _id is string and all fields are plain objects
  return rooms.map((room) => ({
    _id: room._id.toString(),
    roomNumber: room.roomNumber,
    type: room.type,
    pricePerNight: room.pricePerNight,
    capacity: room.capacity,
    amenities: room.amenities || [],
    description: room.description,
    images: room.images || [],
    status: room.status,
    size: room.size || undefined,
    bedType: room.bedType || undefined,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  }))
}

export async function getRoom(roomId: string) {
  await connectDB()
  const room = await Room.findById(roomId).lean()
  
  if (!room) {
    return null
  }
  
  // Transform room to ensure _id is string
  return {
    ...room,
    _id: room._id.toString(),
  }
}
