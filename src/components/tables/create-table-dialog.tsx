"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TableType } from "@/lib/types"

interface CreateTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTable: (table: Omit<TableType, "id" | "createdAt" | "status" | "totalPot">) => void
}

export function CreateTableDialog({ open, onOpenChange, onCreateTable }: CreateTableDialogProps) {
  const [name, setName] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(8)
  const [buyInAmount, setBuyInAmount] = useState(100)
  const [startingChips, setStartingChips] = useState(1000)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onCreateTable({
      name,
      maxPlayers,
      buyInAmount,
      startingChips,
      players: 0,
    })

    // Reset form
    setName("")
    setMaxPlayers(8)
    setBuyInAmount(100)
    setStartingChips(1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Mesa</DialogTitle>
          <DialogDescription>Configure uma nova mesa de poker para seu jogo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxPlayers" className="text-right">
                Máx. Jogadores
              </Label>
              <Input
                id="maxPlayers"
                type="number"
                min={2}
                max={12}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buyInAmount" className="text-right">
                Buy-in (R$)
              </Label>
              <Input
                id="buyInAmount"
                type="number"
                min={5}
                step={10}
                value={buyInAmount}
                onChange={(e) => setBuyInAmount(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startingChips" className="text-right">
                Fichas Iniciais
              </Label>
              <Input
                id="startingChips"
                type="number"
                min={100}
                step={100}
                value={startingChips}
                onChange={(e) => setStartingChips(Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Criar Mesa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

