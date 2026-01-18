import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getUsers } from "@/app/actions/users"
import { UsersTable } from "@/app/admin/users/components/users-table"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Users | Hotel Management",
  description: "Manage users",
}

async function UsersContent() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable users={users} />
      </Suspense>
    </div>
  )
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )
}

export default function UsersPage() {
  return <UsersContent />
}
