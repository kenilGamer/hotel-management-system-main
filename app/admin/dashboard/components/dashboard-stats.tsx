import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bed, Calendar, DollarSign, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface DashboardStatsProps {
  stats: {
    totalRooms: number
    availableRooms: number
    occupiedRooms: number
    totalRevenue: number
    todaysBookings: number
  }
}

const statCards = [
  {
    title: "Total Rooms",
    icon: Bed,
    valueKey: "totalRooms" as const,
    description: "All rooms in the system",
  },
  {
    title: "Available Rooms",
    icon: Bed,
    valueKey: "availableRooms" as const,
    description: "Ready for booking",
  },
  {
    title: "Occupied Rooms",
    icon: Users,
    valueKey: "occupiedRooms" as const,
    description: "Currently occupied",
  },
  {
    title: "Total Revenue",
    icon: DollarSign,
    valueKey: "totalRevenue" as const,
    description: "All-time revenue",
    format: (value: number) => formatCurrency(value),
  },
  {
    title: "Today's Bookings",
    icon: Calendar,
    valueKey: "todaysBookings" as const,
    description: "Bookings made today",
  },
]

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = stats[card.valueKey]
        const displayValue = card.format ? card.format(value) : value

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayValue}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
