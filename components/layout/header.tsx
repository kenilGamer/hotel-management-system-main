"use client"

import { useSession } from "next-auth/react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur-sm shadow-sm px-6 sticky top-0 z-40">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search rooms, bookings, users..."
            className="pl-9 h-10 bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-accent/50 transition-all duration-300 hover:scale-110"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full animate-pulse" />
        </Button>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer group">
          <Avatar className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
            <AvatarImage src="" alt={session?.user?.name || ""} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-bold">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{session?.user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
