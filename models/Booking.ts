import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { BookingStatus } from "@/lib/types";

// Re-export for backward compatibility
export { BookingStatus };

export interface IBooking extends Document {
  customer: Types.ObjectId;
  room: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalAmount: number;
  status: BookingStatus;
  payment?: Types.ObjectId;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkIn;
        },
        message: "Check-out date must be after check-in date",
      },
    },
    numberOfGuests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Must have at least 1 guest"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be positive"],
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
    checkedInAt: {
      type: Date,
    },
    checkedOutAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BookingSchema.index({ customer: 1 });
BookingSchema.index({ room: 1 });
BookingSchema.index({ checkIn: 1, checkOut: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });

// Compound index for availability queries
BookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
