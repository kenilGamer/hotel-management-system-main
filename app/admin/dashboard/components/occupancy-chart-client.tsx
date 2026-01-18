"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface OccupancyChartClientProps {
  data: Array<{ month: string; bookings: number }>
}

export function OccupancyChartClient({ data }: OccupancyChartClientProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(value) => {
            const [year, month] = value.split("-")
            return `${month}/${year.slice(2)}`
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(label) => {
            const [year, month] = label.split("-")
            const date = new Date(parseInt(year), parseInt(month) - 1)
            return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
          }}
        />
        <Legend />
        <Bar
          dataKey="bookings"
          fill="hsl(var(--primary))"
          name="Bookings"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
