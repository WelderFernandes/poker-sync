'use client'

import type { PlayerType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MinusCircle, PlusCircle, Check, X } from 'lucide-react'

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '0'
  }
  return value.toString()
}

interface PlayerListProps {
  players: PlayerType[]
  onChipChange: (playerId: string, amount: number) => void
  isGameActive: boolean
}

export function PlayerList({
  players,
  onChipChange,
  isGameActive,
}: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => b.chips - a.chips)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jogadores ({players.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    player.chips === 0 ? 'opacity-50 bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>
                        {player.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{player.name}</p>
                        {player.buyInPaid ? (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-green-500/10 text-green-500 border-green-500/20"
                          >
                            <Check className="h-3 w-3 mr-1" /> Pago
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-red-500/10 text-red-500 border-red-500/20"
                          >
                            <X className="h-3 w-3 mr-1" /> Pendente
                          </Badge>
                        )}
                      </div>
                      <p
                        className={`text-sm ${player.chips === 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                      >
                        {formatNumber(player.chips)} fichas
                      </p>
                    </div>
                  </div>

                  {isGameActive && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onChipChange(player.id, -10)}
                        disabled={player.chips < 10}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onChipChange(player.id, 10)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum jogador adicionado ainda. Adicione jogadores para iniciar o
              jogo.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
