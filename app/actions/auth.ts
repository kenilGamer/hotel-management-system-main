"use server"

import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User, { UserRole } from "@/models/User"
import { z } from "zod"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
})

export async function signUpAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string | undefined,
    }

    const validatedData = signUpSchema.parse(rawData)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() })
    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      phone: validatedData.phone,
      role: UserRole.CUSTOMER,
      isActive: true,
    })

    return { success: true, userId: user._id.toString() }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to create account" }
  }
}

// signInAction removed - using client-side signIn from next-auth/react instead
