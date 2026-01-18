import mongoose, { Schema, Document, Model } from "mongoose";
import { RoomType, RoomStatus } from "@/lib/types";

// Re-export for backward compatibility
export { RoomType, RoomStatus };

export interface IRoom extends Document {
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  description: string;
  images: string[];
  status: RoomStatus;
  size: string; // e.g., "300 sq ft"
  bedType: string; // e.g., "King Bed", "Twin Beds"
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema<IRoom>(
  {
    roomNumber: {
      type: String,
      required: [true, "Room number is required"],
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: Object.values(RoomType),
      required: [true, "Room type is required"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price must be positive"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(RoomStatus),
      default: RoomStatus.AVAILABLE,
    },
    size: {
      type: String,
      trim: true,
    },
    bedType: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RoomSchema.index({ roomNumber: 1 }, { unique: true });
RoomSchema.index({ type: 1 });
RoomSchema.index({ status: 1 });
RoomSchema.index({ pricePerNight: 1 });

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
