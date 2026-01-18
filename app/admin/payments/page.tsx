import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getPayments } from "@/app/actions/payments"
import { PaymentsTable } from "@/app/admin/payments/components/payments-table"

export const metadata = {
  title: "Payments | Hotel Management",
  description: "View payment history",
}

async function PaymentsContent() {
  const payments = await getPayments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">View all payment transactions</p>
      </div>

      <Suspense fallback={<PaymentsTableSkeleton />}>
        <PaymentsTable payments={payments} />
      </Suspense>
    </div>
  )
}

function PaymentsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentsPage() {
  return <PaymentsContent />
}
