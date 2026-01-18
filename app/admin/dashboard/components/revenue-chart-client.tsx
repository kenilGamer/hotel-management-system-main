"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency } from "@/lib/utils"

interface RevenueChartClientProps {
  data: Array<{ month: string; revenue: number }>
}

export function RevenueChartClient({ data }: RevenueChartClientProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(value) => {
            const [year, month] = value.split("-")
            return `${month}/${year.slice(2)}`
          }}
        />
        <YAxis
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(label) => {
            const [year, month] = label.split("-")
            const date = new Date(parseInt(year), parseInt(month) - 1)
            return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
