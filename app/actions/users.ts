"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import User, { UserRole } from "@/models/User"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth-utils"

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
})

export async function createUser(formData: FormData) {
  try {
    await requireAdmin()
    await connectDB()

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as UserRole,
      phone: formData.get("phone") as string || undefined,
      address: formData.get("address") as string || undefined,
      isActive: formData.get("isActive") === "true",
    }

    const validatedData = userSchema.parse(data)

    // Check if user exists
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() })
    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password || "password123", 12)

    const user = await User.create({
      ...validatedData,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
    })

    revalidatePath("/admin/users")
    return { success: true, userId: user._id.toString() }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create user" }
  }
}

export async function updateUser(userId: string, formData: FormData) {
  try {
    await requireAdmin()
    await connectDB()

    const data: any = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as UserRole,
      phone: formData.get("phone") as string || undefined,
      address: formData.get("address") as string || undefined,
      isActive: formData.get("isActive") === "true",
    }

    const password = formData.get("password") as string
    if (password) {
      data.password = await bcrypt.hash(password, 12)
    }

    const validatedData = userSchema.partial().parse(data)

    const user = await User.findByIdAndUpdate(userId, validatedData, { new: true })
    if (!user) {
      return { error: "User not found" }
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to update user" }
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    await requireAdmin()
    await connectDB()

    const user = await User.findById(userId)
    if (!user) {
      return { error: "User not found" }
    }

    user.isActive = !user.isActive
    await user.save()

    revalidatePath("/admin/users")
    return { success: true, isActive: user.isActive }
  } catch (error) {
    return { error: "Failed to update user status" }
  }
}

export async function getUsers(filters?: { role?: UserRole; isActive?: boolean }) {
  await connectDB()

  const query: any = {}
  if (filters?.role) {
    query.role = filters.role
  }
  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive
  }

  const users = await User.find(query).select("-password").sort({ createdAt: -1 }).lean()
  
  // Transform users to ensure _id is string and all fields are plain objects
  return users.map((user) => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || undefined,
    address: user.address || undefined,
    isActive: user.isActive,
    lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : undefined,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }))
}

export async function getUser(userId: string) {
  await connectDB()
  const user = await User.findById(userId).select("-password").lean()
  return user
}
