'use client'

import { useEffect, useRef } from 'react'

export function GameLengthChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // Sample data - game lengths in minutes
    const gameLengths = [45, 65, 87, 120, 95, 75, 110, 135, 60, 90, 105, 80]

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Chart dimensions
    const chartHeight = ctx.canvas.height - 60
    const chartWidth = ctx.canvas.width - 60
    const barWidth = chartWidth / gameLengths.length - 10

    // Find max value for scaling
    const maxLength = Math.max(...gameLengths)

    // Draw bars
    gameLengths.forEach((length, i) => {
      const barHeight = (length / maxLength) * chartHeight
      const x = 50 + i * (barWidth + 10)
      const y = chartHeight - barHeight + 30

      // Draw gradient bar
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)')

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw game number
      ctx.fillStyle = '#888888'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Game ${i + 1}`, x + barWidth / 2, chartHeight + 50)

      // Draw length value
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${length}m`, x + barWidth / 2, y - 5)
    })

    // Draw axes
    ctx.strokeStyle = '#444444'

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(40, 30)
    ctx.lineTo(40, chartHeight + 30)
    ctx.stroke()

    // X-axis
    ctx.beginPath()
    ctx.moveTo(40, chartHeight + 30)
    ctx.lineTo(chartWidth + 50, chartHeight + 30)
    ctx.stroke()

    // Draw y-axis labels
    ctx.fillStyle = '#888888'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= maxLength; i += 30) {
      const y = chartHeight - (i / maxLength) * chartHeight + 30
      ctx.fillText(`${i}m`, 35, y + 5)

      // Draw grid line
      ctx.strokeStyle = '#333333'
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(chartWidth + 50, y)
      ctx.stroke()
    }

    // Draw title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Game Duration (minutes)', ctx.canvas.width / 2, 20)
  }, [])

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full"
      />
    </div>
  )
}
