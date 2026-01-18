import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import connectDB from "@/lib/mongodb"
import Payment, { PaymentStatus } from "@/models/Payment"
import Booking, { BookingStatus } from "@/models/Booking"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any

      await connectDB()

      const payment = await Payment.findOne({
        gatewayTransactionId: paymentIntent.id,
      })

      if (payment) {
        payment.status = PaymentStatus.COMPLETED
        await payment.save()

        // Update booking status
        await Booking.findByIdAndUpdate(payment.booking, {
          status: BookingStatus.CONFIRMED,
          payment: payment._id,
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
