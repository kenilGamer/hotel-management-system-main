"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  CreditCard,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import { UserRole } from "@/lib/types"

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Rooms", href: "/admin/rooms", icon: Bed },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Housekeeping", href: "/admin/housekeeping", icon: Sparkles },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

const staffNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Rooms", href: "/admin/rooms", icon: Bed },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Housekeeping", href: "/admin/housekeeping", icon: Sparkles },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const navItems = role === UserRole.ADMIN ? adminNavItems : staffNavItems

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background/95 backdrop-blur-sm shadow-lg">
      <div className="flex h-16 items-center border-b bg-gradient-to-r from-primary/5 to-transparent px-6">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Hotel Management
        </h1>
      </div>
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground hover:translate-x-1"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-300",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} />
              <span className="relative z-10">{item.name}</span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group"
          onClick={() => signOut({ callbackUrl: "/signin" })}
        >
          <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
