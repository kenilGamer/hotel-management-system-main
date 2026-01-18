// Load environment variables FIRST, before any other imports
import dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env") })

// Now import modules that use environment variables
import connectDB from "../lib/mongodb"
import User, { UserRole } from "../models/User"
import Room, { RoomType, RoomStatus } from "../models/Room"
import Booking, { BookingStatus } from "../models/Booking"
import Payment, { PaymentGateway, PaymentStatus } from "../models/Payment"
import bcrypt from "bcryptjs"

async function seed() {
  try {
    await connectDB()
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Room.deleteMany({})
    await Booking.deleteMany({})
    await Payment.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@hotel.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    })
    console.log("Created admin user:", admin.email)

    // Create staff user
    const staffPassword = await bcrypt.hash("staff123", 12)
    const staff = await User.create({
      name: "Staff User",
      email: "staff@hotel.com",
      password: staffPassword,
      role: UserRole.STAFF,
      isActive: true,
    })
    console.log("Created staff user:", staff.email)

    // Create customer user
    const customerPassword = await bcrypt.hash("customer123", 12)
    const customer = await User.create({
      name: "John Doe",
      email: "customer@example.com",
      password: customerPassword,
      role: UserRole.CUSTOMER,
      phone: "+1234567890",
      isActive: true,
    })
    console.log("Created customer user:", customer.email)

    // Create sample rooms
    const rooms = await Room.create([
      {
        roomNumber: "101",
        type: RoomType.STANDARD,
        pricePerNight: 99.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "AC", "Mini Bar"],
        description: "Comfortable standard room with all essential amenities",
        images: [],
        status: RoomStatus.AVAILABLE,
        size: "300 sq ft",
        bedType: "Queen Bed",
      },
      {
        roomNumber: "102",
        type: RoomType.STANDARD,
        pricePerNight: 99.99,
        capacity: 2,
        amenities: ["WiFi", "TV", "AC"],
        description: "Standard room with city view",
        images: [],
        status: RoomStatus.AVAILABLE,
        size: "300 sq ft",
        bedType: "Queen Bed",
      },
      {
        roomNumber: "201",
        type: RoomType.DELUXE,
        pricePerNight: 149.99,
        capacity: 3,
        amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony"],
        description: "Spacious deluxe room with balcony",
        images: [],
        status: RoomStatus.AVAILABLE,
        size: "450 sq ft",
        bedType: "King Bed",
      },
      {
        roomNumber: "202",
        type: RoomType.DELUXE,
        pricePerNight: 149.99,
        capacity: 3,
        amenities: ["WiFi", "TV", "AC", "Mini Bar"],
        description: "Deluxe room with premium amenities",
        images: [],
        status: RoomStatus.AVAILABLE,
        size: "450 sq ft",
        bedType: "King Bed",
      },
      {
        roomNumber: "301",
        type: RoomType.SUITE,
        pricePerNight: 249.99,
        capacity: 4,
        amenities: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Jacuzzi", "Living Room"],
        description: "Luxurious suite with separate living area",
        images: [],
        status: RoomStatus.AVAILABLE,
        size: "800 sq ft",
        bedType: "King Bed",
      },
    ])
    console.log(`Created ${rooms.length} rooms`)

    // Create sample bookings
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + 1)
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkOut.getDate() + 3)

    const booking = await Booking.create({
      customer: customer._id,
      room: rooms[0]._id,
      checkIn,
      checkOut,
      numberOfGuests: 2,
      totalAmount: rooms[0].pricePerNight * 3,
      status: BookingStatus.CONFIRMED,
    })
    console.log("Created sample booking")

    // Create sample payment
    const payment = await Payment.create({
      booking: booking._id,
      customer: customer._id,
      amount: booking.totalAmount,
      currency: "USD",
      gateway: PaymentGateway.STRIPE,
      gatewayTransactionId: "pi_test_123",
      status: PaymentStatus.COMPLETED,
    })
    console.log("Created sample payment")

    console.log("\n✅ Seed completed successfully!")
    console.log("\nLogin credentials:")
    console.log("Admin: admin@hotel.com / admin123")
    console.log("Staff: staff@hotel.com / staff123")
    console.log("Customer: customer@example.com / customer123")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seed()
