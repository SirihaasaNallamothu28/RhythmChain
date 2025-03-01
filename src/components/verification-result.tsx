"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, RotateCcw, ExternalLink } from "lucide-react"

interface VerificationResultProps {
  result: {
    isOriginal: boolean
    confidence: number
    artist?: string
    title?: string
    registrationDate?: string
  } | null
  onReset: () => void
}

export function VerificationResult({ result, onReset }: VerificationResultProps) {
  if (!result) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {result.isOriginal ? (
          <div className="rounded-full bg-green-900/20 p-3">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        ) : (
          <div className="rounded-full bg-red-900/20 p-3">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-medium lowercase text-white">
            {result.isOriginal ? "verified original" : "not verified"}
          </h2>
          <p className="text-zinc-400 lowercase">
            {result.isOriginal
              ? "this music is verified as an original creation"
              : "this music could not be verified as an original creation"}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-zinc-800 bg-zinc-800/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm lowercase text-zinc-400">confidence score</span>
              <Badge
                variant={result.confidence > 80 ? "default" : "outline"}
                className="font-mono lowercase bg-violet-600"
              >
                {result.confidence}%
              </Badge>
            </div>

            {result.isOriginal && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm lowercase text-zinc-400">artist</span>
                  <span className="lowercase text-zinc-300">{result.artist}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm lowercase text-zinc-400">title</span>
                  <span className="lowercase text-zinc-300">{result.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm lowercase text-zinc-400">registered on</span>
                  <span className="font-mono text-sm lowercase text-zinc-300">{result.registrationDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm lowercase text-zinc-400">blockchain id</span>
                  <span className="font-mono text-xs lowercase text-zinc-500">
                    0x7f9e4b5c3d2a1f8e6b5c4d3a2f1e0b9c8d7e6f5
                  </span>
                </div>
              </>
            )}

            {!result.isOriginal && (
              <div className="rounded-lg bg-amber-900/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div className="space-y-1">
                    <p className="font-medium lowercase text-amber-500">potential ai-generated content detected</p>
                    <p className="text-sm lowercase text-amber-400/80">
                      our analysis indicates this music may have been created using ai tools or contains elements that
                      cannot be verified as original human creation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 lowercase border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200"
        >
          <RotateCcw className="h-4 w-4" />
          verify another
        </Button>
        {result.isOriginal && (
          <Button className="gap-2 lowercase bg-violet-600 hover:bg-violet-700 text-white">
            view blockchain certificate
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

