import { requireAuth } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth-utils"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export const metadata = {
  title: "Profile | Hotel Management",
  description: "Your profile information",
}

export default async function CustomerProfilePage() {
  const user = await requireAuth()
  await connectDB()
  const userData = await User.findById(user.id).lean()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{userData?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{userData?.email || "N/A"}</p>
          </div>
          {userData?.phone && (
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{userData.phone}</p>
            </div>
          )}
          {userData?.address && (
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{userData.address}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{userData?.role || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
