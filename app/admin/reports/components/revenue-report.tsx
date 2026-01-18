import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface RevenueReportProps {
  data: { month: string; revenue: number }[]
}

export function RevenueReport({ data }: RevenueReportProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Report</CardTitle>
        <CardDescription>Monthly revenue breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Monthly Revenue</p>
            <p className="text-xl font-semibold">{formatCurrency(averageRevenue)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Monthly Breakdown</p>
            <div className="space-y-1">
              {data.slice(-6).map((item) => (
                <div key={item.month} className="flex justify-between text-sm">
                  <span>{item.month}</span>
                  <span className="font-medium">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
