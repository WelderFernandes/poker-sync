/* eslint-disable @typescript-eslint/no-explicit-any */
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
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { X, AlertCircle } from "lucide-react"
import type { PlayerType } from "@/lib/types"
import { CardAnimation } from "@/components/tables/card-animation"
import { HandSelector } from "@/components/tables/hand-selector"
import { pokerHands, validatePokerHand } from "@/lib/poker-hands"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return "0"
  }
  return value.toString()
}

interface RoundWinnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: PlayerType[]
  onRoundComplete: (winnerId: string, hand: string, potSize: number, cards: string[]) => void
}

export function RoundWinnerDialog({ open, onOpenChange, players, onRoundComplete }: RoundWinnerDialogProps) {
  const [winnerId, setWinnerId] = useState("")
  const [handType, setHandType] = useState<any>()
  const [potSize, setPotSize] = useState(100)
  const [showAnimation, setShowAnimation] = useState(false)
  const [winnerName, setWinnerName] = useState("")
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [errors, setErrors] = useState<{
    winner?: string
    hand?: string
    cards?: string
  }>({})
  const [isHandValid, setIsHandValid] = useState(false)

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Só resetar o formulário quando o diálogo for fechado
      resetForm()
    }
  }, [open])

  // Validar a mão quando as cartas ou o tipo de mão mudam
  useEffect(() => {
    if (handType && selectedCards.length > 0) {
      const valid = validatePokerHand(handType, selectedCards)
      setIsHandValid(valid)
    } else {
      setIsHandValid(false)
    }
  }, [handType, selectedCards])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação
    const newErrors: {
      winner?: string
      hand?: string
      cards?: string
    } = {}

    if (!winnerId) {
      newErrors.winner = "Selecione um ganhador"
    }

    if (!handType) {
      newErrors.hand = "Selecione a mão vencedora"
    }

    const selectedHand = pokerHands.find((h) => h.type === handType)
    if (selectedHand && selectedCards.length < selectedHand.requiredCards) {
      newErrors.cards = `Selecione ${selectedHand.requiredCards} cartas para esta mão`
    }

    // Validar se as cartas selecionadas formam a mão escolhida
    if (handType && selectedCards.length > 0) {
      const isValid = validatePokerHand(handType, selectedCards)
      if (!isValid) {
        newErrors.cards = `As cartas selecionadas não formam uma mão válida do tipo "${selectedHand?.name || handType}"`
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Limpar erros
    setErrors({})

    // Encontrar o nome do vencedor para exibir na animação
    const winner = players.find((p) => p.id === winnerId)
    if (winner) {
      setWinnerName(winner.name)
    }

    setShowAnimation(true)
  }

  const handleCompleteRound = () => {
    // Encontrar o nome da mão a partir do tipo
    const handName = pokerHands.find((h) => h.type === handType)?.name || handType

    onRoundComplete(winnerId, handName, potSize, selectedCards)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setWinnerId("")
    setHandType("")
    setPotSize(100)
    setShowAnimation(false)
    setWinnerName("")
    setSelectedCards([])
    setErrors({})
    setIsHandValid(false)
  }

  // Modificar a função handleCardChange para evitar atualizações desnecessárias
  const handleCardChange = (cards: string[]) => {
    setSelectedCards(cards)

    // Só atualizar os erros se houver mudança
    if (cards.length > 0 && errors.cards) {
      setErrors((prev) => ({ ...prev, cards: undefined }))
    }
  }

  // Modificar a função handleHandTypeChange para evitar atualizações desnecessárias
  const handleHandTypeChange = (type: string) => {
    setHandType(type)

    // Só atualizar os erros se houver mudança
    if (type && errors.hand) {
      setErrors((prev) => ({ ...prev, hand: undefined }))
    }
  }

  // Filtrar apenas jogadores com fichas
  const activePlayers = players.filter((p) => p.chips > 0)

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Só permite fechar o diálogo se não estiver mostrando a animação
        if (!newOpen && !showAnimation) {
          resetForm()
          onOpenChange(false)
        } else if (!showAnimation) {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {showAnimation
              ? `${winnerName} venceu com ${pokerHands.find((h) => h.type === handType)?.name || handType}!`
              : "Registrar Ganhador da Rodada"}
          </DialogTitle>
          <DialogDescription>
            {showAnimation
              ? "Veja a animação da mão vencedora"
              : "Informe quem ganhou a rodada, com qual mão e quais cartas."}
          </DialogDescription>
          {showAnimation && (
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={handleCompleteRound}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          )}
        </DialogHeader>

        {showAnimation ? (
          <div className="py-8">
            <CardAnimation cards={selectedCards} />
            <div className="mt-6 text-center">
              <p className="text-lg font-medium mb-4">
                {winnerName} venceu o pote de {formatNumber(potSize)} fichas!
              </p>
              <Button onClick={handleCompleteRound} className="w-full sm:w-auto">
                Finalizar Rodada
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-start gap-4">
                <Label className="font-medium mb-1">
                  Ganhador <span className="text-red-500">*</span>
                </Label>
                <ScrollArea className="h-[150px] border rounded-md p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activePlayers.map((player) => (
                      <div
                        key={player.id}
                        className={`flex items-center p-2 rounded-md cursor-pointer transition-all ${
                          winnerId === player.id ? "bg-primary/20 border-primary border" : "border hover:border-primary"
                        }`}
                        onClick={() => {
                          setWinnerId(player.id)
                          setErrors((prev) => ({ ...prev, winner: undefined }))
                        }}
                      >
                        <Avatar className="h-10 w-10 mr-2">
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
                          <p className="text-xs text-muted-foreground">{player.chips} fichas</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {errors.winner && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.winner}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 items-center gap-2">
                <Label htmlFor="potSize" className="font-medium">
                  Valor do Pote
                </Label>
                <Input
                  id="potSize"
                  type="number"
                  min={10}
                  step={10}
                  value={isNaN(potSize) ? 0 : potSize}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value)
                    setPotSize(isNaN(val) ? 0 : val)
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-1 items-start gap-2">
                <Label className="font-medium">
                  Mão Vencedora <span className="text-red-500">*</span>
                </Label>
                <HandSelector
                  selectedCards={selectedCards}
                  onChange={handleCardChange}
                  onHandTypeChange={handleHandTypeChange}
                />
                {errors.cards && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.cards}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={handType !== "" && selectedCards.length > 0 && !isHandValid}
              >
                Mostrar Animação
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

