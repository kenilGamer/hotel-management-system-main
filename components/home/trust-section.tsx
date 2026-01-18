import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Lock } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    text: "Absolutely fantastic experience! The booking process was seamless, and the room exceeded our expectations. Highly recommend!",
  },
  {
    name: "Michael Chen",
    rating: 5,
    text: "Clean rooms, excellent service, and secure payment options. This is how hotel booking should be done. Will definitely book again.",
  },
  {
    name: "Emily Rodriguez",
    rating: 5,
    text: "The 24/7 support was incredibly helpful when I had questions. The entire experience from booking to check-in was smooth and professional.",
  },
]

const stats = [
  { value: "10k+", label: "Happy Guests" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
]

export function TrustSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-muted/50 via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />
      <div className="container px-4 relative z-10">
        {/* Overall Rating */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400 drop-shadow-lg animate-pulse" />
              ))}
            </div>
            <span className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              4.8/5
            </span>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
            Rated excellent by thousands of satisfied guests
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid gap-10 md:grid-cols-3 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border-2 hover:border-primary/40 bg-card/60 backdrop-blur-md hover:bg-card animate-fade-in-up rounded-2xl"
            >
              <CardContent className="pt-12 pb-12 px-8">
                <div className="flex items-center gap-1.5 mb-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                  ))}
                </div>
                <p className="text-base text-muted-foreground mb-10 italic leading-relaxed font-light min-h-[4rem]">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <p className="text-sm font-bold text-foreground">— {testimonial.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid gap-16 md:grid-cols-3 mb-20 animate-fade-in-up">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-110 transition-all duration-500 p-8 rounded-2xl hover:bg-card/50 backdrop-blur-sm"
            >
              <p className="text-7xl md:text-8xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent mb-6 leading-none">
                {stat.value}
              </p>
              <p className="text-xl text-muted-foreground font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-10 pt-16 border-t border-border/50 animate-fade-in-up">
            <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group cursor-pointer">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-semibold">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group cursor-pointer">
              <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Lock className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-semibold">Secure Payments</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-all duration-300 px-6 py-3 text-sm font-semibold hover:scale-105">
              Verified & Trusted
            </Badge>
          </div>
      </div>
    </section>
  )
}
