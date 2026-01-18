import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTABanner() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/15 to-primary/25 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15),transparent_60%)]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-float" />
      
      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Ready to Book
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Your Stay?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
              Discover our premium rooms and start planning your perfect getaway today.
            </p>
            <div className="relative group overflow-hidden rounded-xl">
              <Button 
                asChild 
                size="lg" 
                className="mt-10 text-xl font-black shadow-2xl hover:shadow-glow-lg transition-all duration-300 hover:scale-110 bg-gradient-to-r from-primary via-primary/95 to-primary animate-gradient px-12 py-8 h-auto relative z-10"
              >
                <Link href="/customer/rooms" className="flex items-center">
                  Check Availability
                  <ArrowRight className="ml-3 h-7 w-7 transition-transform group-hover:translate-x-3" />
                </Link>
              </Button>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-xl" />
            </div>
        </div>
      </div>
    </section>
  )
}
