"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PlayerType } from "@/lib/types"

interface BuyInConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: PlayerType[]
  onConfirm: (playerIds: string[]) => Promise<void>
}

export function BuyInConfirmationDialog({ open, onOpenChange, players, onConfirm }: BuyInConfirmationDialogProps) {
  const [paidPlayers, setPaidPlayers] = useState<string[]>(players.filter((p) => p.buyInPaid).map((p) => p.id))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTogglePlayer = (playerId: string) => {
    setPaidPlayers((prev) => (prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]))
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await onConfirm(paidPlayers)
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao confirmar pagamentos:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Confirmar Pagamentos de Buy-in</DialogTitle>
          <DialogDescription>Confirme quais jogadores pagaram o buy-in antes de finalizar o jogo.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {players.map((player) => (
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
                      <div className="flex items-center mt-1">
                        {player.buyInPaid ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <Check className="h-3 w-3 mr-1" /> Pago
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            <X className="h-3 w-3 mr-1" /> Pendente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`player-${player.id}`}
                        checked={paidPlayers.includes(player.id)}
                        onCheckedChange={() => handleTogglePlayer(player.id)}
                      />
                      <Label htmlFor={`player-${player.id}`} className="cursor-pointer">
                        Buy-in pago
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button onClick={handleConfirm} disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Confirmando..." : "Confirmar Pagamentos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

