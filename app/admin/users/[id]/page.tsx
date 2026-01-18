import { notFound } from "next/navigation"
import { getUser } from "@/app/actions/users"
import { UserForm } from "@/app/admin/users/components/user-form"
import { requireAdmin } from "@/lib/auth-utils"

export const metadata = {
  title: "Edit User | Hotel Management",
  description: "Edit user details",
}

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  // Transform user to match expected format
  const userData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    address: user.address || "",
    isActive: user.isActive,
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          Edit User
        </h1>
        <p className="text-lg text-muted-foreground font-medium">Update user details and permissions</p>
      </div>
      <UserForm user={userData} />
    </div>
  )
}
