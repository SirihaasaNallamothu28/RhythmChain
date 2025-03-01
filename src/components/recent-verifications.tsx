import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export function RecentVerifications() {
  const verifications = [
    {
      id: "1",
      title: "midnight dreams",
      artist: "luna eclipse",
      timestamp: "2 hours ago",
      isVerified: true,
      artistImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      title: "digital horizon",
      artist: "cyber pulse",
      timestamp: "5 hours ago",
      isVerified: true,
      artistImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      title: "synthetic emotions",
      artist: "unknown",
      timestamp: "1 day ago",
      isVerified: false,
      artistImage: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium tracking-tight lowercase text-white">recent verifications</h2>

      <div className="grid gap-3">
        {verifications.map((verification) => (
          <Card key={verification.id} className="overflow-hidden bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-zinc-700">
                    <AvatarImage src={verification.artistImage} alt={verification.artist} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400">{verification.artist[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium lowercase text-zinc-200">{verification.title}</div>
                    <div className="text-xs lowercase text-zinc-400">{verification.artist}</div>
                  </div>
                </div>
                <Badge
                  variant={verification.isVerified ? "default" : "destructive"}
                  className="flex items-center gap-1 lowercase text-xs"
                >
                  {verification.isVerified ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      <span>verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      <span>unverified</span>
                    </>
                  )}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                <span className="lowercase">{verification.timestamp}</span>
                <span className="font-mono text-xs lowercase">{verification.isVerified ? "0x7f9e...6f5" : "n/a"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

