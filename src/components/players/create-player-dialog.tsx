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
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { PlayerType } from "@/lib/types"
import { createPlayer } from "@/lib/db"
import Image from "next/image"
import { useToast } from "../use-toast"

interface CreatePlayerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePlayer: (player: PlayerType) => void
  existingAvatars: string[]
}

// Lista de avatares disponíveis
const AVAILABLE_AVATARS = [
  "/avatars/01.png",
  "/avatars/02.png",
  "/avatars/03.png",
  "/avatars/04.png",
  "/avatars/05.png",
  "/avatars/06.png",
  "/avatars/07.png",
  "/avatars/08.png",
  "/avatars/09.png",
  "/avatars/10.png",
  "/avatars/11.png",
  "/avatars/12.png",
  "/avatars/13.png",
  "/avatars/14.png",
  "/avatars/15.png",
  "/avatars/16.png",
  "/avatars/17.png",
  "/avatars/18.png",
]

export function CreatePlayerDialog({ open, onOpenChange, onCreatePlayer, existingAvatars }: CreatePlayerDialogProps) {
  const { addToast } = useToast()
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [errors, setErrors] = useState<{
    name?: string
  }>({})

  // Filtrar avatares já em uso
  const availableAvatars = AVAILABLE_AVATARS.filter((avatar) => !existingAvatars.includes(avatar))

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
      const newPlayer = await createPlayer({
        name: name.trim(),
        nickname: nickname.trim(),
        phone: phone.trim(),
        pixKey: pixKey.trim(),
        avatar: selectedAvatar || availableAvatars[0],
      })

      onCreatePlayer(newPlayer)

      addToast({
        title: "Jogador criado",
        description: `${name} foi adicionado com sucesso.`,
      })

      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating player:", error)
      addToast({
        title: "Erro ao criar jogador",
        description: "Não foi possível criar o jogador.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setName("")
    setNickname("")
    setPhone("")
    setPixKey("")
    setSelectedAvatar("")
    setErrors({})
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Jogador</DialogTitle>
          <DialogDescription>Preencha os dados do jogador para cadastrá-lo no sistema.</DialogDescription>
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
                        width={128}
                        height={128}
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
            <Button type="submit">Criar Jogador</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

