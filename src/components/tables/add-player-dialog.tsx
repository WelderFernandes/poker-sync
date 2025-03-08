"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PlayerType } from "@/lib/types"

interface AddPlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPlayer: (player: Omit<PlayerType, "id" | "tableId">) => void
  startingChips: number
  buyInAmount: number
  existingAvatars: string[]
}

// Lista de avatares disponíveis
const AVAILABLE_AVATARS = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
  "/avatars/avatar-7.png",
  "/avatars/avatar-8.png",
  "/avatars/avatar-9.png",
  "/avatars/avatar-10.png",
  "/avatars/avatar-11.png",
  "/avatars/avatar-12.png",
  "/avatars/avatar-13.png",
  "/avatars/avatar-14.png",
  "/avatars/avatar-15.png",
  "/avatars/avatar-16.png",
  "/avatars/avatar-17.png",
  "/avatars/avatar-18.png",
]

export function AddPlayerDialog({
  open,
  onOpenChange,
  onAddPlayer,
  startingChips,
  buyInAmount,
  existingAvatars,
}: AddPlayerDialogProps) {
  const [name, setName] = useState("")
  const [buyInPaid, setBuyInPaid] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [availableAvatars, setAvailableAvatars] = useState<string[]>([])

  // Filtrar avatares já em uso
  useEffect(() => {
    const filteredAvatars = AVAILABLE_AVATARS.filter((avatar) => !existingAvatars.includes(avatar))
    setAvailableAvatars(filteredAvatars)

    // Selecionar o primeiro avatar disponível por padrão
    if (filteredAvatars.length > 0 && !selectedAvatar) {
      setSelectedAvatar(filteredAvatars[0])
    }
  }, [existingAvatars, selectedAvatar])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAvatar) {
      alert("Por favor, selecione um avatar")
      return
    }

    onAddPlayer({
      name,
      chips: startingChips,
      buyInPaid,
      avatar: selectedAvatar,
    })

    // Reset form
    setName("")
    setBuyInPaid(false)
    setSelectedAvatar("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Jogador</DialogTitle>
          <DialogDescription>Adicione um novo jogador à mesa.</DialogDescription>
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
              <Label htmlFor="startingChips" className="text-right">
                Fichas Iniciais
              </Label>
              <Input id="startingChips" type="number" value={startingChips} disabled className="col-span-3 bg-muted" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buyInAmount" className="text-right">
                Buy-in (R$)
              </Label>
              <Input id="buyInAmount" type="number" value={buyInAmount} disabled className="col-span-3 bg-muted" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1"></div>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="buyInPaid"
                  checked={buyInPaid}
                  onCheckedChange={(checked) => setBuyInPaid(checked === true)}
                />
                <Label htmlFor="buyInPaid">Buy-in pago</Label>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">Avatar</Label>
              <div className="col-span-3">
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {availableAvatars.map((avatar) => (
                      <div
                        key={avatar}
                        className={cn(
                          "relative cursor-pointer rounded-md overflow-hidden border-2 transition-all",
                          selectedAvatar === avatar
                            ? "border-primary ring-2 ring-primary ring-opacity-50"
                            : "border-transparent hover:border-muted-foreground",
                        )}
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        <img
                          src={avatar || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-full h-auto aspect-square object-cover"
                        />
                      </div>
                    ))}

                    {availableAvatars.length === 0 && (
                      <div className="col-span-4 text-center py-8 text-muted-foreground">
                        Não há avatares disponíveis
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Adicionar Jogador</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

