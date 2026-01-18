import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOccupancyData } from "@/app/actions/dashboard"
import { OccupancyChartClient } from "./occupancy-chart-client"

export async function OccupancyChart() {
  const data = await getOccupancyData(6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Rate</CardTitle>
        <CardDescription>Monthly bookings over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <OccupancyChartClient data={data} />
      </CardContent>
    </Card>
  )
}
