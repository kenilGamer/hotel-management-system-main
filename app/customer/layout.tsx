import { requireAuth } from "@/lib/auth-utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut, User, Calendar, Bed } from "lucide-react"

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/customer/rooms" className="text-xl font-bold">
            Hotel Management
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/customer/rooms">
                <Bed className="mr-2 h-4 w-4" />
                Rooms
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/customer/bookings">
                <Calendar className="mr-2 h-4 w-4" />
                My Bookings
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/customer/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/signin" })
            }}>
              <Button type="submit" variant="ghost">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}
