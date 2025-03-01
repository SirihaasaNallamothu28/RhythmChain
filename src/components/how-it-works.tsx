import { Card, CardContent } from "@/components/ui/card"
import { Fingerprint, Shield, Wand2, Database } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Fingerprint,
      title: "audio fingerprinting",
      description: "we extract unique audio features to create a digital fingerprint of the music",
    },
    {
      icon: Database,
      title: "blockchain verification",
      description: "we check the fingerprint against our decentralized registry of original works",
    },
    {
      icon: Wand2,
      title: "ai detection",
      description: "our algorithms identify patterns common in ai-generated music",
    },
    {
      icon: Shield,
      title: "verification certificate",
      description: "original works receive a blockchain certificate of authenticity",
    },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-medium tracking-tight lowercase text-white">how it works</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <Card key={index} className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-900/20">
                <step.icon className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <h3 className="text-base font-medium lowercase text-zinc-200 mb-1">{step.title}</h3>
                <p className="text-sm lowercase text-zinc-400">{step.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

