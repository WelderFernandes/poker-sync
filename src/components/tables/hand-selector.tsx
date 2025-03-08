"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardSelector } from "@/components/tables/card-selector"
import { HandValidator } from "@/components/tables/hand-validator"
import { pokerHands, cardRanks, cardSuits, suitSymbols, type PokerHandType } from "@/lib/poker-hands"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface HandSelectorProps {
  selectedCards: string[]
  onChange: (cards: string[]) => void
  onHandTypeChange: (handType: string) => void
}

export function HandSelector({ selectedCards, onChange, onHandTypeChange }: HandSelectorProps) {
  const [handType, setHandType] = useState<PokerHandType | "">("")
  const [activeTab, setActiveTab] = useState<"selection" | "visual">("visual")
  const [validationError, setValidationError] = useState<string>("")
  const [allCards, setAllCards] = useState<string[]>([])

  // Gerar todas as cartas do baralho quando o componente montar
  useEffect(() => {
    const cards: string[] = []
    cardSuits.forEach((suit) => {
      cardRanks.forEach((rank) => {
        cards.push(`${rank}${suitSymbols[suit]}`)
      })
    })
    setAllCards(cards)
  }, [])

  // Resetar seleções quando o tipo de mão muda
  useEffect(() => {
    if (handType) {
      setValidationError("")

      // Chamar estas funções apenas uma vez quando o tipo de mão muda
      if (onChange) onChange([])
      if (onHandTypeChange) onHandTypeChange(handType)
    }
  }, [handType]) // Remover onChange e onHandTypeChange das dependências

  // Função para lidar com a mudança de cartas selecionadas
  const handleCardChange = (cards: string[]) => {
    onChange(cards)
  }

  // Função para selecionar uma mão pré-definida
  const selectPresetHand = (type: PokerHandType) => {
    setHandType(type)
    setActiveTab("visual")
    setValidationError("")
    onChange([])
  }

  // Encontrar a mão selecionada
  const selectedHand = pokerHands.find((h) => h.type === handType)

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "selection" | "visual")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="selection">Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {pokerHands.map((hand) => (
              <Card
                key={hand.type}
                className={`cursor-pointer transition-all hover:border-primary ${handType === hand.type ? "border-primary bg-primary/10" : ""}`}
                onClick={() => selectPresetHand(hand.type)}
              >
                <CardContent className="p-3 text-center">
                  <div className="font-bold text-sm">{hand.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{hand.example}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {handType && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Cartas da Mão</Label>
              </div>
              <CardSelector
                selectedCards={selectedCards}
                onChange={handleCardChange}
                availableCards={allCards}
                restrictSelection={false}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Selecione as cartas que formam a mão vencedora. A seleção deve corresponder ao tipo de mão escolhido.
              </p>

              {handType && selectedCards.length > 0 && (
                <HandValidator handType={handType} selectedCards={selectedCards} />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="selection" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hand-type">Tipo de Mão</Label>
              <Select value={handType} onValueChange={(value) => setHandType(value as PokerHandType)}>
                <SelectTrigger id="hand-type">
                  <SelectValue placeholder="Selecione o tipo de mão" />
                </SelectTrigger>
                <SelectContent>
                  {pokerHands.map((hand) => (
                    <SelectItem key={hand.type} value={hand.type}>
                      {hand.name} - {hand.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {handType && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Cartas da Mão</Label>
              </div>
              <CardSelector
                selectedCards={selectedCards}
                onChange={handleCardChange}
                availableCards={allCards}
                restrictSelection={false}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Selecione as cartas que formam a mão vencedora. A seleção deve corresponder ao tipo de mão escolhido.
              </p>

              {handType && selectedCards.length > 0 && (
                <HandValidator handType={handType} selectedCards={selectedCards} />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {selectedHand && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <p className="font-medium">{selectedHand.name}</p>
          <p className="text-sm text-muted-foreground">{selectedHand.description}</p>
          <p className="text-sm font-medium mt-2">Exemplo: {selectedHand.example}</p>
        </div>
      )}
    </div>
  )
}

