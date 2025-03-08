"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AlertCircle, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { UnpaidDetailsModal } from "@/components/dashboard/unpaid-details-modal"
import type { UnpaidDebt } from "@/lib/types"

interface UnpaidPlayersRankingProps {
  unpaidPlayers: {
    id: string
    name: string
    avatar: string
    totalDebt: number
    unpaidGames: UnpaidDebt[]
  }[]
  onPaymentComplete?: () => void
}

export function UnpaidPlayersRanking({ unpaidPlayers, onPaymentComplete }: UnpaidPlayersRankingProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<{
    name: string
    unpaidGames: UnpaidDebt[]
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlayerClick = (name: string, unpaidGames: UnpaidDebt[]) => {
    setSelectedPlayer({ name, unpaidGames })
    setIsModalOpen(true)
  }

  const handlePaymentComplete = () => {
    if (onPaymentComplete) {
      onPaymentComplete()
    }
    // Fechar o modal após um breve atraso para dar tempo de ver a confirmação
    setTimeout(() => {
      setIsModalOpen(false)
    }, 1000)
  }

  if (unpaidPlayers.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Devedores de Buy-in</CardTitle>
          <CardDescription>Jogadores que não pagaram o buy-in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
            <span>Nenhum jogador com buy-in pendente</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Devedores de Buy-in</CardTitle>
          <CardDescription>Jogadores que não pagaram o buy-in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unpaidPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback>
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.unpaidGames.length} jogos pendentes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="font-medium text-red-500 mr-2">{formatCurrency(player.totalDebt)}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlayerClick(player.name, player.unpaidGames)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPlayer && (
        <UnpaidDetailsModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          playerName={selectedPlayer.name}
          unpaidGames={selectedPlayer.unpaidGames}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </>
  )
}

