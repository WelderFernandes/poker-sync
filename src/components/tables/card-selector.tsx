"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CardSelectorProps {
  selectedCards: string[]
  onChange: (cards: string[]) => void
  availableCards?: string[]
  restrictSelection?: boolean
}

export function CardSelector({
  selectedCards,
  onChange,
  availableCards,
  restrictSelection = false,
}: CardSelectorProps) {
  const [activeTab, setActiveTab] = useState<"spades" | "hearts" | "diamonds" | "clubs">("spades")

  const suits = {
    spades: "♠",
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
  }

  const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"]

  // Modificar a função handleCardClick para evitar atualizações desnecessárias
  const handleCardClick = (card: string) => {
    if (selectedCards.includes(card)) {
      // Remove card if already selected
      const newSelectedCards = selectedCards.filter((c) => c !== card)
      onChange(newSelectedCards)
    } else if (selectedCards.length < 5) {
      // Add card if less than 5 cards are selected
      const newSelectedCards = [...selectedCards, card]
      onChange(newSelectedCards)
    }
  }

  // Determinar se uma carta está disponível para seleção
  const isCardAvailable = (card: string) => {
    if (!restrictSelection || !availableCards) return true
    return availableCards.includes(card)
  }

  // Modificar o CardSelector para melhorar a exibição de todas as cartas

  // Modificar a função para mostrar todas as cartas organizadas por naipe
  return (
    <div className="border rounded-md">
      {!restrictSelection && (
        <div className="flex border-b overflow-x-auto sm:overflow-visible">
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "flex-1 rounded-none border-b-2 border-transparent py-2 px-3",
              activeTab === "spades" && "border-primary",
            )}
            onClick={() => setActiveTab("spades")}
          >
            ♠ Espadas
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "flex-1 rounded-none border-b-2 border-transparent py-2 px-3 text-red-500",
              activeTab === "hearts" && "border-primary",
            )}
            onClick={() => setActiveTab("hearts")}
          >
            ♥ Copas
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "flex-1 rounded-none border-b-2 border-transparent py-2 px-3 text-red-500",
              activeTab === "diamonds" && "border-primary",
            )}
            onClick={() => setActiveTab("diamonds")}
          >
            ♦ Ouros
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "flex-1 rounded-none border-b-2 border-transparent py-2 px-3",
              activeTab === "clubs" && "border-primary",
            )}
            onClick={() => setActiveTab("clubs")}
          >
            ♣ Paus
          </Button>
        </div>
      )}

      <ScrollArea className="h-[200px] p-4">
        {restrictSelection && availableCards ? (
          // Mostrar apenas as cartas disponíveis para a mão selecionada
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {availableCards.map((card) => {
              const isSelected = selectedCards.includes(card)
              const isRed = card.includes("♥") || card.includes("♦")

              return (
                <motion.div key={card} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn("h-16 w-full p-0 font-bold text-lg", isRed && !isSelected && "text-red-500")}
                    onClick={() => handleCardClick(card)}
                  >
                    {card}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // Mostrar todas as cartas do naipe selecionado
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {ranks.map((rank) => {
              const card = `${rank}${suits[activeTab]}`
              const isSelected = selectedCards.includes(card)
              const isAvailable = isCardAvailable(card)
              const isRed = activeTab === "hearts" || activeTab === "diamonds"

              return (
                <motion.div
                  key={card}
                  whileHover={{ scale: isAvailable ? 1.05 : 1 }}
                  whileTap={{ scale: isAvailable ? 0.95 : 1 }}
                >
                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-16 w-full p-0 font-bold text-lg",
                      isRed && !isSelected && "text-red-500",
                      !isAvailable && "opacity-30 cursor-not-allowed",
                    )}
                    onClick={() => isAvailable && handleCardClick(card)}
                    disabled={!isAvailable}
                  >
                    {card}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex flex-wrap justify-center gap-2">
          {selectedCards.map((card, index) => (
            <motion.div
              key={card}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center justify-center w-12 h-16 rounded-md border-2 border-primary font-bold text-lg shadow-md",
                card.includes("♥") || card.includes("♦") ? "text-red-500" : "",
              )}
              onClick={() => handleCardClick(card)}
            >
              {card}
            </motion.div>
          ))}
          {Array.from({ length: 5 - selectedCards.length }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center w-12 h-16 rounded-md border-2 border-dashed border-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

