import { Card, CardContent } from "@/components/ui/card"
import { Shield, CheckCircle2, Sparkles, Headphones } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payment information is encrypted and secure. We support multiple payment gateways for your convenience.",
  },
  {
    icon: CheckCircle2,
    title: "Easy Check-in",
    description: "Streamlined booking process with instant confirmation. Check in quickly and start enjoying your stay.",
  },
  {
    icon: Sparkles,
    title: "Clean Rooms",
    description: "Every room is meticulously cleaned and maintained to the highest standards for your comfort.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you with any questions or concerns.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-muted/50 via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />
      <div className="container px-4 relative z-10">
        <div className="text-center space-y-6 mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Why Choose Us
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Experience hospitality redefined with our commitment to excellence
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index} 
                  className="text-center group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-card"
                >
                <CardContent className="pt-12 pb-12 px-6">
                  <div className="flex justify-center mb-10">
                    <div className="rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 p-7 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl group-hover:shadow-glow relative">
                      <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300 relative z-10" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-extrabold mb-5 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light min-h-[3rem]">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
