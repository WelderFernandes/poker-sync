"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { validatePokerHand, pokerHands, type PokerHandType } from "@/lib/poker-hands"

interface HandValidatorProps {
  handType: string
  selectedCards: string[]
}

export function HandValidator({ handType, selectedCards }: HandValidatorProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    if (!handType || selectedCards.length === 0) {
      setIsValid(null)
      setMessage("")
      return
    }

    const selectedHand = pokerHands.find((h) => h.type === handType)
    if (!selectedHand) {
      setIsValid(null)
      setMessage("")
      return
    }

    // Verificar se o número de cartas é adequado
    if (selectedCards.length < selectedHand.requiredCards) {
      setIsValid(false)
      setMessage(`Selecione ${selectedHand.requiredCards} cartas para formar um(a) ${selectedHand.name}.`)
      return
    }

    // Validar se as cartas formam a mão selecionada
    const valid = validatePokerHand(handType as PokerHandType, selectedCards)
    setIsValid(valid)

    if (valid) {
      setMessage(`Mão válida! As cartas formam um(a) ${selectedHand.name}.`)
    } else {
      setMessage(`As cartas selecionadas não formam um(a) ${selectedHand.name}.`)
    }
  }, [handType, selectedCards])

  if (isValid === null) {
    return null
  }

  return (
    <Alert variant={isValid ? "default" : "destructive"} className="mt-2">
      {isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

