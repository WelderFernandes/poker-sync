'use client'

import { useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { HandStats } from '@/lib/stats'

interface HandsChartProps {
  hands: HandStats[]
}

export function HandsChart({ hands }: HandsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || hands.length === 0) return

    // Limpar canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Dimensões do gráfico
    const chartHeight = ctx.canvas.height - 60
    const chartWidth = ctx.canvas.width - 60
    const barWidth = chartWidth / hands.length - 20

    // Cores para as barras
    const barColors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(59, 130, 246, 0.7)',
      'rgba(59, 130, 246, 0.6)',
      'rgba(59, 130, 246, 0.5)',
      'rgba(59, 130, 246, 0.4)',
    ]

    // Desenhar barras
    hands.forEach((hand, i) => {
      const barHeight = (hand.percentage / 100) * chartHeight
      const x = 40 + i * (barWidth + 20)
      const y = chartHeight - barHeight + 30

      // Desenhar barra
      ctx.fillStyle = barColors[i % barColors.length]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Desenhar nome da mão
      ctx.fillStyle = '#888888'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(hand.hand, x + barWidth / 2, chartHeight + 50)

      // Desenhar porcentagem
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${hand.percentage}%`, x + barWidth / 2, y - 5)
    })

    // Desenhar eixo Y
    ctx.strokeStyle = '#444444'
    ctx.beginPath()
    ctx.moveTo(30, 30)
    ctx.lineTo(30, chartHeight + 30)
    ctx.stroke()

    // Desenhar eixo X
    ctx.beginPath()
    ctx.moveTo(30, chartHeight + 30)
    ctx.lineTo(chartWidth + 40, chartHeight + 30)
    ctx.stroke()

    // Desenhar rótulos do eixo Y
    ctx.fillStyle = '#888888'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 100; i += 20) {
      const y = chartHeight - (i / 100) * chartHeight + 30
      ctx.fillText(`${i}%`, 25, y + 5)

      // Desenhar linha de grade
      ctx.strokeStyle = '#333333'
      ctx.beginPath()
      ctx.moveTo(30, y)
      ctx.lineTo(chartWidth + 40, y)
      ctx.stroke()
    }
  }, [hands])

  if (hands.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mãos Mais Populares</CardTitle>
          <CardDescription>Distribuição das mãos vencedoras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma mão registrada ainda
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mãos Mais Populares</CardTitle>
        <CardDescription>Distribuição das mãos vencedoras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
