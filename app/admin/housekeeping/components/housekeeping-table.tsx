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
import { formatDate } from "@/lib/utils"
import { HousekeepingStatus } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateHousekeepingStatus } from "@/app/actions/housekeeping"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface HousekeepingLog {
  _id: string
  room: { roomNumber: string; type: string } | null
  staff?: { name: string; email: string } | null
  status: HousekeepingStatus
  notes?: string
  priority: "low" | "medium" | "high"
  scheduledAt?: string
  completedAt?: string
  createdAt: string
}

interface HousekeepingTableProps {
  logs: HousekeepingLog[]
}

const getStatusColor = (status: HousekeepingStatus) => {
  switch (status) {
    case HousekeepingStatus.CLEAN:
      return "default"
    case HousekeepingStatus.INSPECTED:
      return "default"
    case HousekeepingStatus.DIRTY:
      return "outline"
    case HousekeepingStatus.MAINTENANCE:
      return "destructive"
    default:
      return "outline"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "default"
    case "low":
      return "secondary"
    default:
      return "outline"
  }
}

export function HousekeepingTable({ logs }: HousekeepingTableProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleStatusChange = async (logId: string, newStatus: HousekeepingStatus) => {
    try {
      const result = await updateHousekeepingStatus(logId, newStatus)
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Status updated",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No housekeeping logs found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Housekeeping Logs</CardTitle>
        <CardDescription>Room cleaning and maintenance status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  {log.room?.roomNumber || "N/A"} ({log.room?.type || "N/A"})
                </TableCell>
                <TableCell>{log.staff?.name || "Unassigned"}</TableCell>
                <TableCell>
                  <Select
                    value={log.status}
                    onValueChange={(value) => handleStatusChange(log._id, value as HousekeepingStatus)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={HousekeepingStatus.CLEAN}>Clean</SelectItem>
                      <SelectItem value={HousekeepingStatus.DIRTY}>Dirty</SelectItem>
                      <SelectItem value={HousekeepingStatus.MAINTENANCE}>Maintenance</SelectItem>
                      <SelectItem value={HousekeepingStatus.INSPECTED}>Inspected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(log.priority)}>
                    {log.priority}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{log.notes || "N/A"}</TableCell>
                <TableCell>
                  {log.scheduledAt ? formatDate(log.scheduledAt) : "N/A"}
                </TableCell>
                <TableCell>
                  {log.completedAt && (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
