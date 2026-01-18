"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { PaymentStatus, PaymentGateway } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Payment {
  _id: string
  customer: { name: string; email: string } | null
  booking: { checkIn: string; checkOut: string; totalAmount: number } | null
  amount: number
  currency: string
  gateway: PaymentGateway
  status: PaymentStatus
  createdAt: string
}

interface PaymentsTableProps {
  payments: Payment[]
}

const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return "default"
    case PaymentStatus.PENDING:
      return "outline"
    case PaymentStatus.FAILED:
      return "destructive"
    case PaymentStatus.REFUNDED:
      return "secondary"
    default:
      return "outline"
  }
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No payments found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>All payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{payment.customer?.name || "Unknown"}</div>
                    <div className="text-sm text-muted-foreground">{payment.customer?.email || ""}</div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {payment.gateway}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
