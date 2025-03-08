"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import type { PlayerType } from "@/lib/types"

interface PlayerSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPlayers: (playerIds: string[]) => void
  allPlayers: PlayerType[]
  existingPlayerIds: string[]
}

export function PlayerSelector({
  open,
  onOpenChange,
  onAddPlayers,
  allPlayers,
  existingPlayerIds,
}: PlayerSelectorProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setSelectedPlayers([]) // Reset selected players when the dialog opens
  }, [open])

  const handleAddPlayers = () => {
    onAddPlayers(selectedPlayers)
    onOpenChange(false)
  }

  const filteredPlayers = allPlayers.filter((player) => {
    const searchTerm = searchQuery.toLowerCase()
    return player.name.toLowerCase().includes(searchTerm) && !existingPlayerIds.includes(player.id)
  })

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers((prevSelected) => {
      if (prevSelected.includes(playerId)) {
        return prevSelected.filter((id) => id !== playerId)
      } else {
        return [...prevSelected, playerId]
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Jogadores Existentes</DialogTitle>
          <DialogDescription>Selecione jogadores já cadastrados para adicionar à mesa.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              placeholder="Buscar jogadores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-2 rounded-md">
                    <Label htmlFor={player.id} className="flex items-center">
                      <Checkbox
                        id={player.id}
                        checked={selectedPlayers.includes(player.id)}
                        onCheckedChange={() => togglePlayerSelection(player.id)}
                        className="mr-2"
                      />
                      {player.name}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">Nenhum jogador encontrado.</div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleAddPlayers} disabled={selectedPlayers.length === 0}>
            Adicionar Selecionados
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

