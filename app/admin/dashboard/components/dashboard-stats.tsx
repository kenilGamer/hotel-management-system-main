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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card, index) => {
        const Icon = card.icon
        const value = stats[card.valueKey]
        const displayValue = card.format ? card.format(value) : value

        return (
          <Card 
            key={card.title}
            className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/30 bg-card/60 backdrop-blur-sm hover:bg-card animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{card.title}</CardTitle>
              <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 p-2 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                {displayValue}
              </div>
              <p className="text-xs text-muted-foreground font-medium">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
