"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { updatePlayerBuyInStatus, updateTablePot, getTable } from "@/lib/db"
import type { UnpaidDebt } from "@/lib/types"
import { useToast } from "../use-toast"

interface UnpaidDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  playerName: string
  unpaidGames: UnpaidDebt[]
  onPaymentComplete?: () => void
}

export function UnpaidDetailsModal({
  open,
  onOpenChange,
  playerName,
  unpaidGames,
  onPaymentComplete,
}: UnpaidDetailsModalProps) {
  const { addToast } = useToast()
  const [processingPayments, setProcessingPayments] = useState<Record<string, boolean>>({})

  const handleMarkAsPaid = async (debt: UnpaidDebt) => {
    try {
      setProcessingPayments((prev) => ({ ...prev, [debt.playerId]: true }))

      // Atualizar o status de pagamento do jogador
      await updatePlayerBuyInStatus(debt.playerId, true)

      // Atualizar o valor total do pote da mesa
      const table = await getTable(debt.tableId)
      if (table) {
        await updateTablePot(debt.tableId, table.totalPot + debt.amount)
      }

      addToast({
        title: "Pagamento registrado",
        description: `Buy-in de ${formatCurrency(debt.amount)} para ${playerName} foi marcado como pago.`,
        variant: "default",
      })

      // Notificar o componente pai que um pagamento foi concluído
      if (onPaymentComplete) {
        onPaymentComplete()
      }
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error)
      addToast({
        title: "Erro ao registrar pagamento",
        description: "Não foi possível atualizar o status do pagamento.",
        variant: "destructive",
      })
    } finally {
      setProcessingPayments((prev) => ({ ...prev, [debt.playerId]: false }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes de Buy-ins Pendentes</DialogTitle>
          <DialogDescription>Histórico de buy-ins não pagos por {playerName}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mesa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidGames.map((game) => (
                <TableRow key={game.playerId}>
                  <TableCell className="font-medium">{game.tableName}</TableCell>
                  <TableCell>{new Date(game.date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(game.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      Pendente
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsPaid(game)}
                      disabled={processingPayments[game.playerId]}
                    >
                      {processingPayments[game.playerId] ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Marcar como Pago
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Total de jogos pendentes: {unpaidGames.length}</p>
            <p className="font-bold">
              Total devido: {formatCurrency(unpaidGames.reduce((sum, game) => sum + game.amount, 0))}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

