'use client'

import { useEffect, useRef } from 'react'

export function WinRateChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // Sample data
    const players = ['John', 'Jane', 'Mike', 'Sarah', 'David']
    const winRates = [67, 60, 56, 50, 45]

    // Colors
    const barColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(59, 130, 246, 0.7)',
      'rgba(59, 130, 246, 0.6)',
      'rgba(59, 130, 246, 0.5)',
      'rgba(59, 130, 246, 0.4)',
    ]

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Chart dimensions
    const chartHeight = ctx.canvas.height - 60
    const chartWidth = ctx.canvas.width - 60
    const barWidth = chartWidth / players.length - 20

    // Draw bars
    players.forEach((player, i) => {
      const barHeight = (winRates[i] / 100) * chartHeight
      const x = 40 + i * (barWidth + 20)
      const y = chartHeight - barHeight + 30

      // Draw bar
      ctx.fillStyle = barColors[i]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw player name
      ctx.fillStyle = '#888888'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(player, x + barWidth / 2, chartHeight + 50)

      // Draw win rate
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${winRates[i]}%`, x + barWidth / 2, y - 5)
    })

    // Draw y-axis
    ctx.strokeStyle = '#444444'
    ctx.beginPath()
    ctx.moveTo(30, 30)
    ctx.lineTo(30, chartHeight + 30)
    ctx.stroke()

    // Draw x-axis
    ctx.beginPath()
    ctx.moveTo(30, chartHeight + 30)
    ctx.lineTo(chartWidth + 40, chartHeight + 30)
    ctx.stroke()

    // Draw y-axis labels
    ctx.fillStyle = '#888888'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 100; i += 20) {
      const y = chartHeight - (i / 100) * chartHeight + 30
      ctx.fillText(`${i}%`, 25, y + 5)

      // Draw grid line
      ctx.strokeStyle = '#333333'
      ctx.beginPath()
      ctx.moveTo(30, y)
      ctx.lineTo(chartWidth + 40, y)
      ctx.stroke()
    }
  }, [])

  return (
    <div className="w-full h-[300px]">
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="w-full h-full"
      />
    </div>
  )
}
