"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { createPlayer } from "@/lib/db"
import Image from "next/image"
import { useToast } from "@/components/use-toast"

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

export default function InvitePage() {
  const { addToast } = useToast()
  const router = useRouter()
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVAILABLE_AVATARS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    phone?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação
    const newErrors: { name?: string; phone?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setIsSubmitting(true)

      // Initialize storage first
      await fetch("/api/db")

      await createPlayer({
        name: name.trim(),
        nickname: nickname.trim(),
        phone: phone.trim(),
        pixKey: pixKey.trim(),
        avatar: selectedAvatar,
      })

      addToast({
        title: "Cadastro realizado com sucesso!",
        description: "Você foi cadastrado e já pode participar dos jogos.",
      })

      // Redirecionar para a página inicial após 2 segundos
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error registering player:", error)
      addToast({
        title: "Erro ao realizar cadastro",
        description: "Não foi possível completar seu cadastro. Tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Cadastro de Jogador</CardTitle>
          <CardDescription>Preencha seus dados para participar dos jogos de poker</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Nome Completo <span className="text-red-500">*</span>
                </Label>
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
                  disabled={isSubmitting}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nickname">Vulgo (Apelido)</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">
                  Telefone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, phone: undefined }))
                    }
                  }}
                  placeholder="(00) 00000-0000"
                  className={errors.phone ? "border-red-500" : ""}
                  disabled={isSubmitting}
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pixKey">Chave Pix</Label>
                <Input id="pixKey" value={pixKey} onChange={(e) => setPixKey(e.target.value)} disabled={isSubmitting} />
                <p className="text-xs text-muted-foreground">Usada para receber prêmios e fazer pagamentos</p>
              </div>

              <div className="grid gap-2">
                <Label>Escolha seu Avatar</Label>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {AVAILABLE_AVATARS.map((avatar) => (
                      <div
                        key={avatar}
                        className={cn(
                          "relative cursor-pointer rounded-md overflow-hidden border-2 transition-all",
                          selectedAvatar === avatar
                            ? "border-primary ring-2 ring-primary ring-opacity-50"
                            : "border-transparent hover:border-muted-foreground",
                        )}
                        onClick={() => !isSubmitting && setSelectedAvatar(avatar)}
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

            <CardFooter className="flex justify-end px-0 pt-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

