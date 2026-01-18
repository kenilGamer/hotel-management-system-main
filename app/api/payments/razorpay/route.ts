import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import connectDB from "@/lib/mongodb"
import Payment, { PaymentStatus } from "@/models/Payment"
import Booking, { BookingStatus } from "@/models/Booking"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const signature = req.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET!

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (body.event === "payment.captured") {
      await connectDB()

      const payment = await Payment.findOne({
        gatewayTransactionId: body.payload.payment.entity.order_id,
      })

      if (payment) {
        payment.status = PaymentStatus.COMPLETED
        payment.gatewayTransactionId = body.payload.payment.entity.id
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
