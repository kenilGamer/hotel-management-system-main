import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, CreditCard, CheckCircle2, ArrowRight } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Choose Room",
    description: "Browse our selection of premium rooms and find the perfect one for your stay.",
  },
  {
    number: 2,
    icon: Calendar,
    title: "Select Dates",
    description: "Pick your check-in and check-out dates using our easy-to-use calendar.",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Pay Securely",
    description: "Complete your booking with our secure payment system. Multiple payment options available.",
  },
  {
    number: 4,
    icon: CheckCircle2,
    title: "Enjoy Your Stay",
    description: "Receive instant confirmation and enjoy a seamless, comfortable stay with us.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="container px-4 relative z-10">
        <div className="text-center space-y-6 mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Booking your perfect stay is simple and straightforward
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === steps.length - 1
            return (
              <div key={step.number} className="relative animate-fade-in-up">
                <Card className="h-full group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 hover:border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-card">
                    <CardContent className="pt-12 pb-12 px-6">
                      <div className="flex flex-col items-center text-center space-y-7">
                        <div className="relative">
                          <div className="rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 p-7 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl group-hover:shadow-glow">
                            <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="absolute -top-3 -right-3 h-11 w-11 rounded-full p-0 flex items-center justify-center font-extrabold text-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-glow border-2 border-background"
                          >
                            {step.number}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-2xl font-extrabold mb-5 group-hover:text-primary transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed font-light min-h-[3rem]">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {!isLast && (
                    <div className="hidden lg:block absolute top-1/2 -right-5 z-10">
                     
                    </div>
                  )}
                </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
