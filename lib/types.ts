// Standalone types that can be used in Edge runtime (middleware)
// These should match the enums in the models

export enum UserRole {
  ADMIN = "admin",
  STAFF = "staff",
  CUSTOMER = "customer",
}

export enum RoomType {
  STANDARD = "standard",
  DELUXE = "deluxe",
  SUITE = "suite",
}

export enum RoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  MAINTENANCE = "maintenance",
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
}

export enum PaymentGateway {
  STRIPE = "stripe",
  RAZORPAY = "razorpay",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

export enum HousekeepingStatus {
  CLEAN = "clean",
  DIRTY = "dirty",
  MAINTENANCE = "maintenance",
  INSPECTED = "inspected",
}
