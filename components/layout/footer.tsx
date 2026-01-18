import Link from "next/link"
import { Hotel, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

interface FooterProps {
  hotelName?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  city?: string
  state?: string
  country?: string
}

export function Footer({
  hotelName = "Hotel Management",
  contactEmail,
  contactPhone,
  address,
  city,
  state,
  country,
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Hotel className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{hotelName}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your perfect stay awaits. Book with confidence and enjoy seamless hospitality.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/customer/rooms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/customer/bookings"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#cancellation"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {contactEmail && (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {contactEmail}
                  </a>
                </li>
              )}
              {contactPhone && (
                <li>
                  <a
                    href={`tel:${contactPhone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {contactPhone}
                  </a>
                </li>
              )}
              {(address || city || state || country) && (
                <li>
                  {address && <span>{address}</span>}
                  {city && <span>{address ? ", " : ""}{city}</span>}
                  {state && <span>{city || address ? ", " : ""}{state}</span>}
                  {country && <span>{state || city || address ? ", " : ""}{country}</span>}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {hotelName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
