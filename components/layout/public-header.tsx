"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Hotel, Menu, X } from "lucide-react"
import { useState } from "react"

interface PublicHeaderProps {
  hotelName?: string
}

export function PublicHeader({ hotelName = "Hotel Management" }: PublicHeaderProps) {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b glass bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
            <Hotel className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {hotelName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/customer/rooms"
            className="text-sm font-semibold transition-all duration-300 hover:text-primary relative group"
          >
            Rooms
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="#about"
            className="text-sm font-semibold transition-all duration-300 hover:text-primary relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="#contact"
            className="text-sm font-semibold transition-all duration-300 hover:text-primary relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {session ? (
            <Button asChild variant="outline" className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Link href="/customer/bookings">My Bookings</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hover:bg-accent/50 transition-all duration-300">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-glow transition-all duration-300 hover:scale-105">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/customer/rooms"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rooms
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {session ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/customer/bookings">My Bookings</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
