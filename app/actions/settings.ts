"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Settings from "@/models/Settings"
import { requireAdmin } from "@/lib/auth-utils"
import { z } from "zod"

const settingsSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.number().min(0).max(100),
  checkInTime: z.string().min(1, "Check-in time is required"),
  checkOutTime: z.string().min(1, "Check-out time is required"),
  cancellationPolicy: z.string().optional(),
  emailNotifications: z.object({
    bookingConfirmation: z.boolean(),
    paymentReceived: z.boolean(),
    checkInReminder: z.boolean(),
    checkOutReminder: z.boolean(),
  }),
  paymentGateways: z.object({
    stripe: z.object({
      enabled: z.boolean(),
      testMode: z.boolean(),
    }),
    razorpay: z.object({
      enabled: z.boolean(),
      testMode: z.boolean(),
    }),
  }),
})

export async function getSettings() {
  await connectDB()
  
  let settings = await Settings.findOne()
  
  if (!settings) {
    // Create default settings if none exist
    settings = await Settings.create({})
  }
  
  // Transform to plain object
  return {
    _id: settings._id.toString(),
    hotelName: settings.hotelName,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    address: settings.address || "",
    city: settings.city || "",
    state: settings.state || "",
    country: settings.country || "",
    zipCode: settings.zipCode || "",
    currency: settings.currency,
    taxRate: settings.taxRate,
    checkInTime: settings.checkInTime,
    checkOutTime: settings.checkOutTime,
    cancellationPolicy: settings.cancellationPolicy || "",
    emailNotifications: {
      bookingConfirmation: settings.emailNotifications.bookingConfirmation,
      paymentReceived: settings.emailNotifications.paymentReceived,
      checkInReminder: settings.emailNotifications.checkInReminder,
      checkOutReminder: settings.emailNotifications.checkOutReminder,
    },
    paymentGateways: {
      stripe: {
        enabled: settings.paymentGateways.stripe.enabled,
        testMode: settings.paymentGateways.stripe.testMode,
      },
      razorpay: {
        enabled: settings.paymentGateways.razorpay.enabled,
        testMode: settings.paymentGateways.razorpay.testMode,
      },
    },
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  }
}

export async function updateSettings(formData: FormData) {
  try {
    await requireAdmin()
    await connectDB()

    const data = {
      hotelName: formData.get("hotelName") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      address: formData.get("address") as string || undefined,
      city: formData.get("city") as string || undefined,
      state: formData.get("state") as string || undefined,
      country: formData.get("country") as string || undefined,
      zipCode: formData.get("zipCode") as string || undefined,
      currency: formData.get("currency") as string,
      taxRate: parseFloat(formData.get("taxRate") as string) || 0,
      checkInTime: formData.get("checkInTime") as string,
      checkOutTime: formData.get("checkOutTime") as string,
      cancellationPolicy: formData.get("cancellationPolicy") as string || undefined,
      emailNotifications: {
        bookingConfirmation: formData.get("emailNotifications.bookingConfirmation") === "true",
        paymentReceived: formData.get("emailNotifications.paymentReceived") === "true",
        checkInReminder: formData.get("emailNotifications.checkInReminder") === "true",
        checkOutReminder: formData.get("emailNotifications.checkOutReminder") === "true",
      },
      paymentGateways: {
        stripe: {
          enabled: formData.get("paymentGateways.stripe.enabled") === "true",
          testMode: formData.get("paymentGateways.stripe.testMode") === "true",
        },
        razorpay: {
          enabled: formData.get("paymentGateways.razorpay.enabled") === "true",
          testMode: formData.get("paymentGateways.razorpay.testMode") === "true",
        },
      },
    }

    const validatedData = settingsSchema.parse(data)

    // Update or create settings (only one document should exist)
    const settings = await Settings.findOneAndUpdate({}, validatedData, {
      new: true,
      upsert: true,
      runValidators: true,
    })

    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to update settings" }
  }
}
