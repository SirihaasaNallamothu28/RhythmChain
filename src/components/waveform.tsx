"use client"

import { useEffect, useRef } from "react"

export function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Generate random waveform data
    const generateWaveformData = () => {
      const data = []
      const segments = 100

      for (let i = 0; i < segments; i++) {
        // Create a more musical pattern with some randomness
        const baseHeight = Math.sin(i / 10) * 0.3 + 0.5
        const randomFactor = Math.random() * 0.3
        data.push(baseHeight + randomFactor)
      }

      return data
    }

    const waveformData = generateWaveformData()

    // Draw waveform
    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / waveformData.length
      const barMargin = 1
      const effectiveBarWidth = barWidth - barMargin

      // Draw each bar
      waveformData.forEach((value, index) => {
        const barHeight = value * canvas.height * 0.8
        const x = index * barWidth
        const y = (canvas.height - barHeight) / 2

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)") // Violet top
        gradient.addColorStop(1, "rgba(139, 92, 246, 0.3)") // Violet bottom, more transparent

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, effectiveBarWidth, barHeight)
      })
    }

    drawWaveform()

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      drawWaveform()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-12 w-full rounded" />
}

