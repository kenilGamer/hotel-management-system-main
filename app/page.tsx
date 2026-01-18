import type { Metadata } from "next"
import { Suspense } from "react"
import { PublicHeader } from "@/components/layout/public-header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { RoomHighlights } from "@/components/home/room-highlights"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { HowItWorks } from "@/components/home/how-it-works"
import { TrustSection } from "@/components/home/trust-section"
import { CTABanner } from "@/components/home/cta-banner"
import { getSettings } from "@/app/actions/settings"
import { getRooms } from "@/app/actions/rooms"
import { RoomStatus } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

async function getHomePageData() {
  const [settings, rooms] = await Promise.all([
    getSettings(),
    getRooms({ status: RoomStatus.AVAILABLE }),
  ])

  return {
    settings,
    rooms: rooms.slice(0, 6), // Limit to 6 featured rooms
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const hotelName = settings.hotelName || "Hotel Management System"

  return {
    title: `${hotelName} - Book Your Perfect Stay`,
    description:
      settings.cancellationPolicy ||
      "Modern rooms, seamless bookings, and secure payments. Book your perfect stay with confidence.",
    keywords: [
      "hotel booking",
      "room reservation",
      "luxury hotel",
      "online booking",
      "hotel management",
      "accommodation",
    ],
    openGraph: {
      title: `${hotelName} - Book Your Perfect Stay`,
      description:
        settings.cancellationPolicy ||
        "Modern rooms, seamless bookings, and secure payments.",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${hotelName} - Book Your Perfect Stay`,
      description:
        settings.cancellationPolicy ||
        "Modern rooms, seamless bookings, and secure payments.",
    },
  }
}

function RoomHighlightsSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const { settings, rooms } = await getHomePageData()

  // Structured data for Hotel schema
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: settings.hotelName || "Hotel Management System",
    description:
      settings.cancellationPolicy ||
      "Modern rooms, seamless bookings, and secure payments.",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "",
      addressLocality: settings.city || "",
      addressRegion: settings.state || "",
      addressCountry: settings.country || "",
      postalCode: settings.zipCode || "",
    },
    telephone: settings.contactPhone || "",
    email: settings.contactEmail || "",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "WiFi",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "24/7 Support",
        value: true,
      },
    ],
    checkinTime: settings.checkInTime || "15:00",
    checkoutTime: settings.checkOutTime || "11:00",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex min-h-screen flex-col">
        <PublicHeader hotelName={settings.hotelName} />
        <main>
          <HeroSection />
          <Suspense fallback={<RoomHighlightsSkeleton />}>
            <RoomHighlights rooms={rooms} />
          </Suspense>
          <WhyChooseUs />
          <HowItWorks />
          <TrustSection />
          <CTABanner />
        </main>
        <Footer
          hotelName={settings.hotelName}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          address={settings.address}
          city={settings.city}
          state={settings.state}
          country={settings.country}
        />
      </div>
    </>
  )
}
