'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import type { PlayerStats } from '@/lib/stats'

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '0'
  }
  return value.toString()
}

interface ProfitablePlayersProps {
  players: PlayerStats[]
  title: string
  description: string
  isLosers?: boolean
}

export function ProfitablePlayers({
  players,
  title,
  description,
  isLosers = false,
}: ProfitablePlayersProps) {
  if (players.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum jogador registrado ainda
          </div>
        </CardContent>
      </Card>
    )
  }

  // Encontrar o valor máximo para normalizar a barra de progresso
  const maxProfit = Math.max(...players.map((p) => Math.abs(p.profit)))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {players.map((player) => (
            <div key={player.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {player.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {player.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(player.totalSpent)} gasto /{' '}
                      {formatNumber(player.totalEarned)} ganho
                    </p>
                  </div>
                </div>
                <div
                  className={`font-medium ${isLosers ? 'text-red-500' : 'text-green-500'}`}
                >
                  R${formatNumber(Math.abs(player.profit))}
                </div>
              </div>
              <Progress
                value={
                  maxProfit > 0
                    ? (Math.abs(player.profit) / maxProfit) * 100
                    : 0
                }
                className={`h-2 ${isLosers ? 'bg-red-500/20' : 'bg-green-500/20'}`}
                indicatorClassName={isLosers ? 'bg-red-500' : 'bg-green-500'}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
