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

interface PlayerStatsProps {
  players: PlayerStats[]
}

export function PlayerStats({ players }: PlayerStatsProps) {
  if (players.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Melhores Jogadores</CardTitle>
          <CardDescription>
            Jogadores com as maiores taxas de vitória
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum jogador registrado ainda
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Melhores Jogadores</CardTitle>
        <CardDescription>
          Jogadores com as maiores taxas de vitória
        </CardDescription>
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
                      {formatNumber(player.wins)} vitórias /{' '}
                      {formatNumber(player.gamesPlayed)} jogos
                      {player.bestHand && (
                        <span> • Melhor mão: {player.bestHand}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="font-medium">
                  {formatNumber(player.winRate)}%
                </div>
              </div>
              <Progress value={player.winRate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
