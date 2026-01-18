import { UserRole } from "@/lib/types"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export async function getCurrentUser() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name!,
      role: session.user.role as UserRole,
    }
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/signin")
  }
  return user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }
  return user
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN])
}

export async function requireAdminOrStaff() {
  return requireRole([UserRole.ADMIN, UserRole.STAFF])
}
