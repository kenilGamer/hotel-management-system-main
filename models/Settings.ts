import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  hotelName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  currency: string;
  taxRate: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  emailNotifications: {
    bookingConfirmation: boolean;
    paymentReceived: boolean;
    checkInReminder: boolean;
    checkOutReminder: boolean;
  };
  paymentGateways: {
    stripe: {
      enabled: boolean;
      testMode: boolean;
    };
    razorpay: {
      enabled: boolean;
      testMode: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema<ISettings>(
  {
    hotelName: {
      type: String,
      required: [true, "Hotel name is required"],
      default: "Hotel Management System",
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      default: "contact@hotel.com",
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      default: "+1 234 567 8900",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "United States",
    },
    zipCode: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "USD",
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    checkInTime: {
      type: String,
      default: "15:00",
    },
    checkOutTime: {
      type: String,
      default: "11:00",
    },
    cancellationPolicy: {
      type: String,
      default: "Free cancellation up to 24 hours before check-in",
    },
    emailNotifications: {
      bookingConfirmation: {
        type: Boolean,
        default: true,
      },
      paymentReceived: {
        type: Boolean,
        default: true,
      },
      checkInReminder: {
        type: Boolean,
        default: true,
      },
      checkOutReminder: {
        type: Boolean,
        default: true,
      },
    },
    paymentGateways: {
      stripe: {
        enabled: {
          type: Boolean,
          default: true,
        },
        testMode: {
          type: Boolean,
          default: true,
        },
      },
      razorpay: {
        enabled: {
          type: Boolean,
          default: false,
        },
        testMode: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
SettingsSchema.index({}, { unique: true });

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
