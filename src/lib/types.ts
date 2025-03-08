export interface TableType {
  id: string
  name: string
  players: number
  maxPlayers: number
  buyInAmount: number // Valor em reais
  startingChips: number // Fichas iniciais por jogador
  totalPot: number // Total arrecadado em reais
  status: "active" | "completed"
  createdAt: string
  winner?: string
}

export interface PlayerType {
  id: string
  tableId: string
  name: string
  nickname?: string
  phone?: string
  pixKey?: string
  chips: number
  buyInPaid: boolean
  avatar: string
}

export interface RoundType {
  id: string
  tableId: string
  winnerId: string
  hand: string
  potSize: number // Em fichas
  timestamp: string
  cards?: string[] // Cartas da mão vencedora
}

export interface FinancialSummary {
  totalCollected: number // Total arrecadado em reais
  totalGames: number
  averageBuyIn: number
  highestPot: number
}

export interface UnpaidDebt {
  tableId: string
  tableName: string
  amount: number
  date: string
  playerId: string
}

