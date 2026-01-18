import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRevenueData, getOccupancyData } from "@/app/actions/dashboard"
import { RevenueReport } from "@/app/admin/reports/components/revenue-report"
import { OccupancyReport } from "@/app/admin/reports/components/occupancy-report"
import { Download } from "lucide-react"

export const metadata = {
  title: "Reports | Hotel Management",
  description: "View analytics and reports",
}

export default async function ReportsPage() {
  const revenueData = await getRevenueData(12)
  const occupancyData = await getOccupancyData(12)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueReport data={revenueData} />
        <OccupancyReport data={occupancyData} />
      </div>
    </div>
  )
}
