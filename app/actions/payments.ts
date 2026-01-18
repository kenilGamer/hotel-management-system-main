"use server"

import { revalidatePath } from "next/cache"
import connectDB from "@/lib/mongodb"
import Payment, { PaymentGateway, PaymentStatus } from "@/models/Payment"
import Booking, { BookingStatus } from "@/models/Booking"
import { stripe } from "@/lib/stripe"
import { razorpay } from "@/lib/razorpay"
import { requireAuth } from "@/lib/auth-utils"

export async function createPaymentIntent(bookingId: string, gateway: PaymentGateway) {
  try {
    const user = await requireAuth()
    await connectDB()

    const booking = await Booking.findById(bookingId).populate("room")
    if (!booking) {
      return { error: "Booking not found" }
    }

    if (booking.customer.toString() !== user.id) {
      return { error: "Unauthorized" }
    }

    const amount = Math.round(booking.totalAmount * 100) // Convert to cents/paisa

    if (gateway === PaymentGateway.STRIPE) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          bookingId: bookingId,
          userId: user.id,
        },
      })

      // Create payment record
      const payment = await Payment.create({
        booking: bookingId,
        customer: user.id,
        amount: booking.totalAmount,
        currency: "USD",
        gateway: PaymentGateway.STRIPE,
        gatewayTransactionId: paymentIntent.id,
        status: PaymentStatus.PENDING,
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id.toString(),
      }
    } else if (gateway === PaymentGateway.RAZORPAY) {
      const order = await razorpay.orders.create({
        amount: amount,
        currency: "USD",
        receipt: `booking_${bookingId}`,
        notes: {
          bookingId: bookingId,
          userId: user.id,
        },
      })

      // Create payment record
      const payment = await Payment.create({
        booking: bookingId,
        customer: user.id,
        amount: booking.totalAmount,
        currency: "USD",
        gateway: PaymentGateway.RAZORPAY,
        gatewayTransactionId: order.id,
        status: PaymentStatus.PENDING,
      })

      return {
        success: true,
        orderId: order.id,
        paymentId: payment._id.toString(),
      }
    }

    return { error: "Invalid payment gateway" }
  } catch (error) {
    return { error: "Failed to create payment intent" }
  }
}

export async function verifyPayment(paymentId: string, gateway: PaymentGateway) {
  try {
    await connectDB()

    const payment = await Payment.findById(paymentId)
    if (!payment) {
      return { error: "Payment not found" }
    }

    if (gateway === PaymentGateway.STRIPE) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        payment.gatewayTransactionId!
      )

      if (paymentIntent.status === "succeeded") {
        payment.status = PaymentStatus.COMPLETED
        await payment.save()

        // Update booking status
        await Booking.findByIdAndUpdate(payment.booking, {
          status: BookingStatus.CONFIRMED,
          payment: payment._id,
        })

        revalidatePath("/customer/bookings")
        revalidatePath("/admin/bookings")
        return { success: true }
      }
    } else if (gateway === PaymentGateway.RAZORPAY) {
      // Razorpay verification would be done via webhook
      // This is a placeholder
      return { success: false, error: "Razorpay verification via webhook" }
    }

    return { error: "Payment verification failed" }
  } catch (error) {
    return { error: "Failed to verify payment" }
  }
}

export async function getPayments(filters?: { customerId?: string; bookingId?: string }) {
  await connectDB()

  const query: any = {}
  if (filters?.customerId) {
    query.customer = filters.customerId
  }
  if (filters?.bookingId) {
    query.booking = filters.bookingId
  }

  const payments = await Payment.find(query)
    .populate("booking", "checkIn checkOut totalAmount", "Booking")
    .populate("customer", "name email", "User")
    .sort({ createdAt: -1 })
    .lean()

  // Transform payments to ensure _id is string and populated fields are properly typed and serialized
  return payments.map((payment) => {
    const booking = payment.booking as any
    const customer = payment.customer as any
    
    // Explicitly construct the object to avoid passing Mongoose internals
    return {
      _id: payment._id.toString(),
      customer: customer
        ? {
            name: String(customer.name || ""),
            email: String(customer.email || ""),
          }
        : null,
      booking: booking
        ? {
            checkIn: booking.checkIn instanceof Date ? booking.checkIn.toISOString() : String(booking.checkIn || ""),
            checkOut: booking.checkOut instanceof Date ? booking.checkOut.toISOString() : String(booking.checkOut || ""),
            totalAmount: Number(booking.totalAmount || 0),
          }
        : null,
      amount: payment.amount,
      currency: payment.currency,
      gateway: payment.gateway,
      status: payment.status,
      gatewayTransactionId: payment.gatewayTransactionId || undefined,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    }
  })
}
