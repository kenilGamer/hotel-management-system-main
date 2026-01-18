"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import HousekeepingLog, { HousekeepingStatus } from "@/models/HousekeepingLog"
import { z } from "zod"
import { requireAdminOrStaff } from "@/lib/auth-utils"

const housekeepingSchema = z.object({
  room: z.string().min(1, "Room is required"),
  staff: z.string().optional(),
  status: z.nativeEnum(HousekeepingStatus),
  notes: z.string().optional(),
  issueType: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  scheduledAt: z.string().optional(),
})

export async function createHousekeepingLog(formData: FormData) {
  try {
    await requireAdminOrStaff()
    await connectDB()

    const data = {
      room: formData.get("room") as string,
      staff: formData.get("staff") as string || undefined,
      status: formData.get("status") as HousekeepingStatus,
      notes: formData.get("notes") as string || undefined,
      issueType: formData.get("issueType") as string || undefined,
      priority: (formData.get("priority") as "low" | "medium" | "high") || "medium",
      scheduledAt: formData.get("scheduledAt") as string || undefined,
    }

    const validatedData = housekeepingSchema.parse(data)

    const log = await HousekeepingLog.create({
      ...validatedData,
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined,
    })

    revalidatePath("/admin/housekeeping")
    return { success: true, logId: log._id.toString() }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create housekeeping log" }
  }
}

export async function updateHousekeepingStatus(logId: string, status: HousekeepingStatus) {
  try {
    await requireAdminOrStaff()
    await connectDB()

    const updateData: any = { status }

    if (status === HousekeepingStatus.INSPECTED || status === HousekeepingStatus.CLEAN) {
      updateData.completedAt = new Date()
    }

    await HousekeepingLog.findByIdAndUpdate(logId, updateData)
    revalidatePath("/admin/housekeeping")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update housekeeping status" }
  }
}

export async function getHousekeepingLogs(filters?: { roomId?: string; status?: HousekeepingStatus }) {
  await connectDB()

  const query: any = {}
  if (filters?.roomId) {
    query.room = filters.roomId
  }
  if (filters?.status) {
    query.status = filters.status
  }

  const logs = await HousekeepingLog.find(query)
    .populate("room", "roomNumber type", "Room")
    .populate("staff", "name email", "User")
    .sort({ createdAt: -1 })
    .lean()

  // Transform logs to ensure _id is string and populated fields are properly typed and serialized
  return logs.map((log) => {
    const room = log.room as any
    const staff = log.staff as any
    
    // Explicitly construct the object to avoid passing Mongoose internals
    return {
      _id: log._id.toString(),
      room: room
        ? {
            roomNumber: String(room.roomNumber || ""),
            type: String(room.type || ""),
          }
        : null,
      staff: staff
        ? {
            name: String(staff.name || ""),
            email: String(staff.email || ""),
          }
        : null,
      status: log.status,
      notes: log.notes || undefined,
      issueType: log.issueType || undefined,
      priority: log.priority,
      scheduledAt: log.scheduledAt ? new Date(log.scheduledAt).toISOString() : undefined,
      completedAt: log.completedAt ? new Date(log.completedAt).toISOString() : undefined,
      createdAt: log.createdAt.toISOString(),
      updatedAt: log.updatedAt.toISOString(),
    }
  })
}
