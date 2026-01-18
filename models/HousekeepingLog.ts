import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { HousekeepingStatus } from "@/lib/types";

// Re-export for backward compatibility
export { HousekeepingStatus };

export interface IHousekeepingLog extends Document {
  room: Types.ObjectId;
  staff?: Types.ObjectId;
  status: HousekeepingStatus;
  notes?: string;
  issueType?: string; // e.g., "plumbing", "electrical", "cleaning"
  priority: "low" | "medium" | "high";
  scheduledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HousekeepingLogSchema: Schema = new Schema<IHousekeepingLog>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room is required"],
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(HousekeepingStatus),
      default: HousekeepingStatus.DIRTY,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    issueType: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    scheduledAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
HousekeepingLogSchema.index({ room: 1 });
HousekeepingLogSchema.index({ staff: 1 });
HousekeepingLogSchema.index({ status: 1 });
HousekeepingLogSchema.index({ priority: 1 });
HousekeepingLogSchema.index({ scheduledAt: 1 });
HousekeepingLogSchema.index({ createdAt: -1 });
HousekeepingLogSchema.index({ room: 1, status: 1 });

const HousekeepingLog: Model<IHousekeepingLog> =
  mongoose.models.HousekeepingLog || mongoose.model<IHousekeepingLog>("HousekeepingLog", HousekeepingLogSchema);

export default HousekeepingLog;
