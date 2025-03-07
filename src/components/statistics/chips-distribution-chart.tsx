'use client'

import { useEffect, useRef } from 'react'

export function ChipsDistributionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // Sample data - chips distribution over time
    const timePoints = [
      'Game 1',
      'Game 2',
      'Game 3',
      'Game 4',
      'Game 5',
      'Game 6',
    ]
    const players = [
      { name: 'John', data: [500, 650, 800, 720, 900, 1200] },
      { name: 'Jane', data: [500, 420, 380, 500, 620, 450] },
      { name: 'Mike', data: [500, 530, 470, 400, 300, 0] },
      { name: 'Sarah', data: [500, 400, 350, 380, 180, 350] },
    ]

    // Colors
    const lineColors = [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(249, 115, 22, 1)',
      'rgba(217, 70, 239, 1)',
    ]

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Chart dimensions
    const chartHeight = ctx.canvas.height - 60
    const chartWidth = ctx.canvas.width - 60
    const maxChips = 1500

    // Draw lines
    players.forEach((player, playerIndex) => {
      ctx.strokeStyle = lineColors[playerIndex]
      ctx.lineWidth = 2
      ctx.beginPath()

      player.data.forEach((chips, i) => {
        const x = 40 + (i * chartWidth) / (timePoints.length - 1)
        const y = chartHeight - (chips / maxChips) * chartHeight + 30

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        // Draw point
        ctx.fillStyle = lineColors[playerIndex]
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw chip value
        ctx.fillStyle = '#ffffff'
        ctx.font = '10px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${chips}`, x, y - 10)
      })

      ctx.stroke()

      // Draw legend
      const legendX = 50 + playerIndex * 100
      const legendY = 20

      ctx.fillStyle = lineColors[playerIndex]
      ctx.fillRect(legendX, legendY, 15, 5)

      ctx.fillStyle = '#888888'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(player.name, legendX + 20, legendY + 5)
    })

    // Draw x-axis
    ctx.strokeStyle = '#444444'
    ctx.beginPath()
    ctx.moveTo(40, chartHeight + 30)
    ctx.lineTo(chartWidth + 40, chartHeight + 30)
    ctx.stroke()

    // Draw y-axis
    ctx.beginPath()
    ctx.moveTo(40, 30)
    ctx.lineTo(40, chartHeight + 30)
    ctx.stroke()

    // Draw x-axis labels
    ctx.fillStyle = '#888888'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'

    timePoints.forEach((label, i) => {
      const x = 40 + (i * chartWidth) / (timePoints.length - 1)
      ctx.fillText(label, x, chartHeight + 50)
    })

    // Draw y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= maxChips; i += 300) {
      const y = chartHeight - (i / maxChips) * chartHeight + 30
      ctx.fillText(`${i}`, 35, y + 5)
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
