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
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PlayerType } from "@/lib/types"
import { updatePlayer } from "@/lib/db"
import Image from "next/image"
import { useToast } from "../use-toast"

interface EditPlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  player: PlayerType
  onUpdatePlayer: (player: PlayerType) => void
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

export function EditPlayerDialog({
  open,
  onOpenChange,
  player,
  onUpdatePlayer,
  existingAvatars,
}: EditPlayerDialogProps) {
  const { addToast } = useToast()
  const [name, setName] = useState(player.name)
  const [nickname, setNickname] = useState(player.nickname || "")
  const [phone, setPhone] = useState(player.phone || "")
  const [pixKey, setPixKey] = useState(player.pixKey || "")
  const [selectedAvatar, setSelectedAvatar] = useState<string>(player.avatar || "")
  const [errors, setErrors] = useState<{
    name?: string
  }>({})

  // Filtrar avatares já em uso
  const availableAvatars = [...AVAILABLE_AVATARS.filter((avatar) => !existingAvatars.includes(avatar))]

  // Adicionar o avatar atual do jogador à lista de disponíveis
  if (player.avatar && !availableAvatars.includes(player.avatar)) {
    availableAvatars.unshift(player.avatar)
  }

  useEffect(() => {
    if (player) {
      setName(player.name)
      setNickname(player.nickname || "")
      setPhone(player.phone || "")
      setPixKey(player.pixKey || "")
      setSelectedAvatar(player.avatar || "")
    }
  }, [player])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const updatedPlayer = await updatePlayer(player.id, {
        name: name.trim(),
        nickname: nickname.trim(),
        phone: phone.trim(),
        pixKey: pixKey.trim(),
        avatar: selectedAvatar,
      })

      onUpdatePlayer(updatedPlayer)

      addToast({
        title: "Jogador atualizado",
        description: `${name} foi atualizado com sucesso.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating player:", error)
      addToast({
        title: "Erro ao atualizar jogador",
        description: "Não foi possível atualizar o jogador.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Jogador</DialogTitle>
          <DialogDescription>Atualize os dados do jogador.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, name: undefined }))
                    }
                  }}
                  className={errors.name ? "border-red-500" : ""}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nickname" className="text-right">
                Vulgo
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pixKey" className="text-right">
                Chave Pix
              </Label>
              <Input id="pixKey" value={pixKey} onChange={(e) => setPixKey(e.target.value)} className="col-span-3" />
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
                        <Image
                          width={100}
                          height={100}
                          src={avatar || "/placeholder.svg"}
                          alt="Avatar"
                          className="w-full h-auto aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

