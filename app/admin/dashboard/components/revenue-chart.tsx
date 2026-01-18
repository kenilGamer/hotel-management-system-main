import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getRevenueData } from "@/app/actions/dashboard"
import { RevenueChartClient } from "./revenue-chart-client"

export async function RevenueChart() {
  const data = await getRevenueData(6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <RevenueChartClient data={data} />
      </CardContent>
    </Card>
  )
}
