import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getHousekeepingLogs } from "@/app/actions/housekeeping"
import { HousekeepingTable } from "@/app/admin/housekeeping/components/housekeeping-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Housekeeping | Hotel Management",
  description: "Manage housekeeping logs",
}

async function HousekeepingContent() {
  const logs = await getHousekeepingLogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Housekeeping</h1>
          <p className="text-muted-foreground">Manage room cleaning and maintenance</p>
        </div>
        <Button asChild>
          <Link href="/admin/housekeeping/new">
            <Plus className="mr-2 h-4 w-4" />
            New Log
          </Link>
        </Button>
      </div>

      <Suspense fallback={<HousekeepingTableSkeleton />}>
        <HousekeepingTable logs={logs} />
      </Suspense>
    </div>
  )
}

function HousekeepingTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function HousekeepingPage() {
  return <HousekeepingContent />
}
