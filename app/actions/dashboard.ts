"use server"

import connectDB from "@/lib/mongodb"
import Room, { RoomStatus } from "@/models/Room"
import Booking, { BookingStatus } from "@/models/Booking"
import Payment, { PaymentStatus } from "@/models/Payment"
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"

export async function getDashboardStats() {
  await connectDB()

  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)

  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    totalRevenue,
    todaysBookings,
  ] = await Promise.all([
    Room.countDocuments(),
    Room.countDocuments({ status: RoomStatus.AVAILABLE }),
    Room.countDocuments({ status: RoomStatus.OCCUPIED }),
    Payment.aggregate([
      {
        $match: {
          status: PaymentStatus.COMPLETED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
    Booking.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }),
  ])

  const revenue = totalRevenue[0]?.total || 0

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    totalRevenue: revenue,
    todaysBookings,
  }
}

export async function getRevenueData(months: number = 12) {
  await connectDB()

  const data = await Payment.aggregate([
    {
      $match: {
        status: PaymentStatus.COMPLETED,
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - months)),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  return data.map((item) => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    revenue: item.revenue,
  }))
}

export async function getOccupancyData(months: number = 12) {
  await connectDB()

  const data = await Booking.aggregate([
    {
      $match: {
        status: { $in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] },
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - months)),
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        bookings: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ])

  return data.map((item) => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    bookings: item.bookings,
  }))
}
