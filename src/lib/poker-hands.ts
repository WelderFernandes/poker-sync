// Definição dos tipos de mãos de poker
export type PokerHandType =
  | "royal-flush"
  | "straight-flush"
  | "four-of-a-kind"
  | "full-house"
  | "flush"
  | "straight"
  | "three-of-a-kind"
  | "two-pairs"
  | "one-pair"
  | "high-card"

export type CardRank = "A" | "K" | "Q" | "J" | "10" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2"
export type CardSuit = "spades" | "hearts" | "diamonds" | "clubs"

export interface PokerHand {
  type: PokerHandType
  name: string
  description: string
  rank: number // Valor para ordenação (maior = melhor)
  requiredCards: number // Número de cartas específicas necessárias
  example: string
}

export interface CardSelection {
  rank: CardRank
  suits: CardSuit[]
}

// Mapeamento de símbolos de naipes
export const suitSymbols: Record<CardSuit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
}

// Lista de ranks de cartas em ordem decrescente
export const cardRanks: CardRank[] = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"]

// Lista de naipes
export const cardSuits: CardSuit[] = ["spades", "hearts", "diamonds", "clubs"]

// Definição das mãos de poker com seus rankings
export const pokerHands: PokerHand[] = [
  {
    type: "royal-flush",
    name: "Royal Flush",
    description: "A, K, Q, J, 10 do mesmo naipe",
    rank: 10,
    requiredCards: 5,
    example: "A♠ K♠ Q♠ J♠ 10♠",
  },
  {
    type: "straight-flush",
    name: "Straight Flush",
    description: "Cinco cartas em sequência do mesmo naipe",
    rank: 9,
    requiredCards: 5,
    example: "9♥ 8♥ 7♥ 6♥ 5♥",
  },
  {
    type: "four-of-a-kind",
    name: "Quadra",
    description: "Quatro cartas do mesmo valor",
    rank: 8,
    requiredCards: 4,
    example: "Q♠ Q♥ Q♦ Q♣",
  },
  {
    type: "full-house",
    name: "Full House",
    description: "Uma trinca e um par",
    rank: 7,
    requiredCards: 5,
    example: "K♠ K♥ K♦ 10♣ 10♠",
  },
  {
    type: "flush",
    name: "Flush",
    description: "Cinco cartas do mesmo naipe",
    rank: 6,
    requiredCards: 5,
    example: "A♣ J♣ 8♣ 6♣ 2♣",
  },
  {
    type: "straight",
    name: "Sequência",
    description: "Cinco cartas em sequência",
    rank: 5,
    requiredCards: 5,
    example: "Q♠ J♥ 10♦ 9♣ 8♠",
  },
  {
    type: "three-of-a-kind",
    name: "Trinca",
    description: "Três cartas do mesmo valor",
    rank: 4,
    requiredCards: 3,
    example: "7♠ 7♥ 7♦",
  },
  {
    type: "two-pairs",
    name: "Dois Pares",
    description: "Dois pares diferentes",
    rank: 3,
    requiredCards: 4,
    example: "A♠ A♥ 6♦ 6♣",
  },
  {
    type: "one-pair",
    name: "Par",
    description: "Duas cartas do mesmo valor",
    rank: 2,
    requiredCards: 2,
    example: "J♠ J♥",
  },
  {
    type: "high-card",
    name: "Carta Alta",
    description: "Nenhuma combinação, valor da carta mais alta",
    rank: 1,
    requiredCards: 1,
    example: "A♠",
  },
]

// Função para obter as cartas necessárias para uma mão específica
export function getRequiredCardsForHand(
  handType: PokerHandType,
  primaryRank?: CardRank,
  secondaryRank?: CardRank,
  suit?: CardSuit,
): string[] {
  const requiredCards: string[] = []

  switch (handType) {
    case "royal-flush":
      if (suit) {
        const symbol = suitSymbols[suit]
        return ["A" + symbol, "K" + symbol, "Q" + symbol, "J" + symbol, "10" + symbol]
      }
      break

    case "straight-flush":
      if (primaryRank && suit) {
        const symbol = suitSymbols[suit]
        const startIndex = cardRanks.indexOf(primaryRank)
        if (startIndex >= 0 && startIndex <= cardRanks.length - 5) {
          for (let i = startIndex; i < startIndex + 5; i++) {
            requiredCards.push(cardRanks[i] + symbol)
          }
        }
      }
      break

    case "four-of-a-kind":
      if (primaryRank) {
        cardSuits.forEach((suit) => {
          requiredCards.push(primaryRank + suitSymbols[suit])
        })
      }
      break

    case "full-house":
      if (primaryRank && secondaryRank) {
        // Trinca
        for (let i = 0; i < 3; i++) {
          requiredCards.push(primaryRank + suitSymbols[cardSuits[i]])
        }
        // Par
        for (let i = 0; i < 2; i++) {
          requiredCards.push(secondaryRank + suitSymbols[cardSuits[i]])
        }
      }
      break

    case "flush":
      if (suit) {
        const symbol = suitSymbols[suit]
        // Selecionar 5 cartas não sequenciais do mesmo naipe
        const selectedRanks = cardRanks.slice(0, 5)
        selectedRanks.forEach((rank) => {
          requiredCards.push(rank + symbol)
        })
      }
      break

    case "straight":
      if (primaryRank) {
        const startIndex = cardRanks.indexOf(primaryRank)
        if (startIndex >= 0 && startIndex <= cardRanks.length - 5) {
          for (let i = startIndex; i < startIndex + 5; i++) {
            // Usar naipes diferentes para cada carta
            requiredCards.push(cardRanks[i] + suitSymbols[cardSuits[i % 4]])
          }
        }
      }
      break

    case "three-of-a-kind":
      if (primaryRank) {
        for (let i = 0; i < 3; i++) {
          requiredCards.push(primaryRank + suitSymbols[cardSuits[i]])
        }
      }
      break

    case "two-pairs":
      if (primaryRank && secondaryRank) {
        // Primeiro par
        requiredCards.push(primaryRank + suitSymbols.spades)
        requiredCards.push(primaryRank + suitSymbols.hearts)
        // Segundo par
        requiredCards.push(secondaryRank + suitSymbols.diamonds)
        requiredCards.push(secondaryRank + suitSymbols.clubs)
      }
      break

    case "one-pair":
      if (primaryRank) {
        requiredCards.push(primaryRank + suitSymbols.spades)
        requiredCards.push(primaryRank + suitSymbols.hearts)
      }
      break

    case "high-card":
      if (primaryRank && suit) {
        requiredCards.push(primaryRank + suitSymbols[suit])
      }
      break
  }

  return requiredCards
}

// Melhorar a função validatePokerHand para uma verificação mais precisa

// Função para validar se as cartas selecionadas formam uma mão válida
export function validatePokerHand(handType: PokerHandType, selectedCards: string[]): boolean {
  const hand = pokerHands.find((h) => h.type === handType)
  if (!hand) return false

  // Verificar se o número de cartas é adequado
  if (selectedCards.length < hand.requiredCards) return false

  // Implementar validações específicas para cada tipo de mão
  switch (handType) {
    case "royal-flush":
      return validateRoyalFlush(selectedCards)
    case "straight-flush":
      return validateStraightFlush(selectedCards)
    case "four-of-a-kind":
      return validateFourOfAKind(selectedCards)
    case "full-house":
      return validateFullHouse(selectedCards)
    case "flush":
      return validateFlush(selectedCards)
    case "straight":
      return validateStraight(selectedCards)
    case "three-of-a-kind":
      return validateThreeOfAKind(selectedCards)
    case "two-pairs":
      return validateTwoPairs(selectedCards)
    case "one-pair":
      return validateOnePair(selectedCards)
    case "high-card":
      return selectedCards.length >= 1 && selectedCards.length <= 5
    default:
      return false
  }
}

// Melhorar as funções auxiliares para validação de mãos específicas
function validateRoyalFlush(cards: string[]): boolean {
  if (cards.length !== 5) return false

  // Verificar se todas as cartas são do mesmo naipe
  const firstSuit = cards[0].slice(-1)
  const sameSuit = cards.every((card) => card.slice(-1) === firstSuit)
  if (!sameSuit) return false

  // Verificar se contém A, K, Q, J, 10
  const ranks = cards.map((card) => card.slice(0, -1))
  const requiredRanks = ["A", "K", "Q", "J", "10"]
  return requiredRanks.every((rank) => ranks.includes(rank)) && ranks.length === 5
}

function validateStraightFlush(cards: string[]): boolean {
  if (cards.length !== 5) return false

  // Verificar se todas as cartas são do mesmo naipe
  const firstSuit = cards[0].slice(-1)
  const sameSuit = cards.every((card) => card.slice(-1) === firstSuit)
  if (!sameSuit) return false

  // Verificar se é uma sequência
  return validateStraight(cards)
}

function validateFourOfAKind(cards: string[]): boolean {
  if (cards.length < 4) return false

  // Extrair os valores das cartas
  const ranks = cards.map((card) => card.slice(0, -1))

  // Verificar se há 4 cartas do mesmo valor
  const rankCounts: Record<string, number> = {}
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1
  })

  return Object.values(rankCounts).some((count) => count >= 4)
}

function validateFullHouse(cards: string[]): boolean {
  if (cards.length !== 5) return false

  // Extrair os valores das cartas
  const ranks = cards.map((card) => card.slice(0, -1))

  // Contar ocorrências de cada valor
  const rankCounts: Record<string, number> = {}
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1
  })

  const counts = Object.values(rankCounts)
  // Verificar se há uma trinca e um par
  return counts.includes(3) && counts.includes(2)
}

function validateFlush(cards: string[]): boolean {
  if (cards.length !== 5) return false

  // Verificar se todas as cartas são do mesmo naipe
  const firstSuit = cards[0].slice(-1)
  return cards.every((card) => card.slice(-1) === firstSuit)
}

function validateStraight(cards: string[]): boolean {
  if (cards.length !== 5) return false

  // Extrair os valores das cartas
  const ranks = cards.map((card) => card.slice(0, -1))

  // Converter para índices no array cardRanks
  const rankIndices = ranks.map((rank) => cardRanks.indexOf(rank as CardRank)).sort((a, b) => a - b)

  // Verificar se é uma sequência (índices consecutivos)
  for (let i = 1; i < rankIndices.length; i++) {
    if (rankIndices[i] !== rankIndices[i - 1] + 1) {
      // Caso especial: A-5-4-3-2
      if (i === 1 && rankIndices[0] === 0 && rankIndices[4] === 12) {
        const lowStraight = [0, 9, 10, 11, 12] // A, 5, 4, 3, 2
        return rankIndices.every((val, idx) => val === lowStraight[idx])
      }
      return false
    }
  }

  return true
}

function validateThreeOfAKind(cards: string[]): boolean {
  if (cards.length < 3) return false

  // Extrair os valores das cartas
  const ranks = cards.map((card) => card.slice(0, -1))

  // Contar ocorrências de cada valor
  const rankCounts: Record<string, number> = {}
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1
  })

  return Object.values(rankCounts).some((count) => count >= 3)
}

function validateTwoPairs(cards: string[]): boolean {
  if (cards.length < 4) return false

  // Extrair os valores das cartas
  const ranks = cards.map((card) => card.slice(0, -1))

  // Contar ocorrências de cada valor
  const rankCounts: Record<string, number> = {}
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1
  })

  // Verificar se há dois pares
  const pairs = Object.values(rankCounts).filter((count) => count >= 2)
  return pairs.length >= 2
}

function validateOnePair(cards: string[]): boolean {
  if (cards.length < 2) return false

  // Extrair os valores das cartas
  const ranks = cards.map((card) => card.slice(0, -1))

  // Contar ocorrências de cada valor
  const rankCounts: Record<string, number> = {}
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1
  })

  return Object.values(rankCounts).some((count) => count >= 2)
}

