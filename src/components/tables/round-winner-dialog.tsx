'use client'

import type React from 'react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'
import type { PlayerType } from '@/lib/types'
import { CardAnimation } from '@/components/tables/card-animation'

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '0'
  }
  return value.toString()
}

interface RoundWinnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  players: PlayerType[]
  onRoundComplete: (winnerId: string, hand: string, potSize: number) => void
}

export function RoundWinnerDialog({
  open,
  onOpenChange,
  players,
  onRoundComplete,
}: RoundWinnerDialogProps) {
  const [winnerId, setWinnerId] = useState('')
  const [hand, setHand] = useState('')
  const [potSize, setPotSize] = useState(100)
  const [showAnimation, setShowAnimation] = useState(false)
  const [winnerName, setWinnerName] = useState('')

  const pokerHands = [
    'Par',
    'Dois Pares',
    'Trinca',
    'Straight',
    'Flush',
    'Full House',
    'Quadra',
    'Straight Flush',
    'Royal Flush',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Encontrar o nome do vencedor para exibir na animação
    const winner = players.find((p) => p.id === winnerId)
    if (winner) {
      setWinnerName(winner.name)
    }

    setShowAnimation(true)
  }

  const handleCompleteRound = () => {
    onRoundComplete(winnerId, hand, potSize)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setWinnerId('')
    setHand('')
    setPotSize(100)
    setShowAnimation(false)
    setWinnerName('')
  }

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {showAnimation
              ? `${winnerName} venceu com ${hand}!`
              : 'Registrar Ganhador da Rodada'}
          </DialogTitle>
          <DialogDescription>
            {showAnimation
              ? 'Mão vencedora registrada com sucesso!'
              : 'Informe quem ganhou a rodada e com qual mão.'}
          </DialogDescription>
          {/* {showAnimation && (
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={handleCompleteRound}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </DialogClose>
          )} */}
        </DialogHeader>

        {showAnimation ? (
          <div className="py-8">
            <CardAnimation hand={hand} />
            <div className="mt-6 text-center">
              <p className="text-lg font-medium mb-4">
                {winnerName} venceu o pote de {formatNumber(potSize)} fichas!
              </p>
              <Button
                onClick={handleCompleteRound}
                className="w-full sm:w-auto"
              >
                Finalizar Rodada
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="winner" className="text-right">
                  Ganhador
                </Label>
                <Select value={winnerId} onValueChange={setWinnerId} required>
                  <SelectTrigger id="winner" className="col-span-3">
                    <SelectValue placeholder="Selecione o jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {players
                      .filter((p) => p.chips > 0)
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hand" className="text-right">
                  Mão
                </Label>
                <Select value={hand} onValueChange={setHand} required>
                  <SelectTrigger id="hand" className="col-span-3">
                    <SelectValue placeholder="Selecione a mão vencedora" />
                  </SelectTrigger>
                  <SelectContent>
                    {pokerHands.map((pokerHand) => (
                      <SelectItem key={pokerHand} value={pokerHand}>
                        {pokerHand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="potSize" className="text-right">
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
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Mostrar Animação</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
