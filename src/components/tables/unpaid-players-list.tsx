"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { updatePlayerBuyInStatus, updateTablePot } from "@/lib/db"
import type { PlayerType, TableType } from "@/lib/types"
import { useToast } from "../use-toast"

interface UnpaidPlayersListProps {
  players: PlayerType[]
  table: TableType
  onPaymentComplete: () => void
}

export function UnpaidPlayersList({ players, table, onPaymentComplete }: UnpaidPlayersListProps) {
  const { addToast } = useToast()
  const [processingPayments, setProcessingPayments] = useState<Record<string, boolean>>({})

  // Filtrar apenas jogadores que não pagaram o buy-in
  const unpaidPlayers = players.filter((player) => !player.buyInPaid)

  if (unpaidPlayers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buy-ins Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">Todos os jogadores pagaram o buy-in.</div>
        </CardContent>
      </Card>
    )
  }

  const handleMarkAsPaid = async (player: PlayerType) => {
    try {
      setProcessingPayments((prev) => ({ ...prev, [player.id]: true }))

      // Atualizar o status de pagamento do jogador
      await updatePlayerBuyInStatus(player.id, true)

      // Atualizar o valor total do pote da mesa
      await updateTablePot(table.id, table.totalPot + table.buyInAmount)

      addToast({
        title: "Pagamento registrado",
        description: `Buy-in de ${formatCurrency(table.buyInAmount)} para ${player.name} foi marcado como pago.`,
        variant: "default",
      })

      // Notificar o componente pai que um pagamento foi concluído
      onPaymentComplete()
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error)
      addToast({
        title: "Erro ao registrar pagamento",
        description: "Não foi possível atualizar o status do pagamento.",
        variant: "destructive",
      })
    } finally {
      setProcessingPayments((prev) => ({ ...prev, [player.id]: false }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy-ins Pendentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unpaidPlayers.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-3 rounded-lg border">
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
                  <Badge variant="outline" className="mt-1 bg-red-500/10 text-red-500 border-red-500/20">
                    Buy-in pendente: {formatCurrency(table.buyInAmount)}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkAsPaid(player)}
                disabled={processingPayments[player.id]}
              >
                {processingPayments[player.id] ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Marcar como Pago
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

