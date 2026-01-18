import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { PaymentGateway, PaymentStatus } from "@/lib/types";

// Re-export for backward compatibility
export { PaymentGateway, PaymentStatus };

export interface IPayment extends Document {
  booking: Types.ObjectId;
  customer: Types.ObjectId;
  amount: number;
  currency: string;
  gateway: PaymentGateway;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  invoiceUrl?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking is required"],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    gateway: {
      type: String,
      enum: Object.values(PaymentGateway),
      required: [true, "Payment gateway is required"],
    },
    gatewayTransactionId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    refundAmount: {
      type: Number,
      min: [0, "Refund amount must be positive"],
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ customer: 1 });
PaymentSchema.index({ gatewayTransactionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ gateway: 1, status: 1 });

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
