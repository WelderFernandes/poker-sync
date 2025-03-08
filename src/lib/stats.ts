import { getCompletedGames, getPlayers, getRounds, getFinancialSummary } from "@/lib/db"
import type { TableType, PlayerType, RoundType, UnpaidDebt } from "@/lib/types"

// Tipos para estatísticas
export interface PlayerStats {
  id: string
  name: string
  gamesPlayed: number
  wins: number
  winRate: number
  totalChips: number
  totalSpent: number // Total gasto em buy-ins
  totalEarned: number // Total ganho
  profit: number // Lucro (ganhos - gastos)
  bestHand: string | null
}

export interface HandStats {
  hand: string
  count: number
  percentage: number
}

export interface UnpaidPlayerStats {
  id: string
  name: string
  avatar: string
  totalDebt: number
  unpaidGames: UnpaidDebt[]
}

export interface DashboardStats {
  totalGames: number
  totalPlayers: number
  averageBuyIn: number
  totalRounds: number
  totalMoneyCollected: number
  highestPot: number
  topPlayers: PlayerStats[]
  worstPlayers: PlayerStats[]
  mostProfitablePlayers: PlayerStats[]
  biggestLosers: PlayerStats[]
  popularHands: HandStats[]
  recentGames: TableType[]
  unpaidPlayers: UnpaidPlayerStats[]
}

// Função para obter estatísticas do dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  // Obter todos os dados necessários
  const completedGames = await getCompletedGames()
  const financialSummary = await getFinancialSummary()

  // Obter todos os jogadores e rodadas de todas as mesas
  let allPlayers: (PlayerType & { tableName: string; buyInAmount: number })[] = []
  let allRounds: (RoundType & { tableName: string })[] = []

  for (const table of completedGames) {
    const players = await getPlayers(table.id)
    const rounds = await getRounds(table.id)

    allPlayers = [
      ...allPlayers,
      ...players.map((player) => ({
        ...player,
        tableName: table.name,
        buyInAmount: table.buyInAmount,
      })),
    ]

    allRounds = [...allRounds, ...rounds.map((round) => ({ ...round, tableName: table.name }))]
  }

  // Calcular estatísticas de jogadores
  const playerStatsMap = new Map<string, PlayerStats>()

  // Inicializar estatísticas para cada jogador
  allPlayers.forEach((player) => {
    if (!playerStatsMap.has(player.name)) {
      playerStatsMap.set(player.name, {
        id: player.id,
        name: player.name,
        gamesPlayed: 0,
        wins: 0,
        winRate: 0,
        totalChips: 0,
        totalSpent: 0,
        totalEarned: 0,
        profit: 0,
        bestHand: null,
      })
    }

    const stats = playerStatsMap.get(player.name)!
    stats.gamesPlayed += 1
    stats.totalChips += player.chips

    // Adicionar ao total gasto se pagou o buy-in
    if (player.buyInPaid) {
      stats.totalSpent += player.buyInAmount
    }
  })

  // Adicionar vitórias e ganhos
  completedGames.forEach((game) => {
    if (game.winner) {
      const stats = playerStatsMap.get(game.winner)
      if (stats) {
        stats.wins += 1
        // O vencedor ganha o valor do pote
        stats.totalEarned += game.totalPot
      }
    }
  })

  // Adicionar informações de mãos
  allRounds.forEach((round) => {
    const playerName = allPlayers.find((p) => p.id === round.winnerId)?.name
    if (playerName) {
      const stats = playerStatsMap.get(playerName)
      if (stats) {
        // Atualizar melhor mão (usando uma hierarquia simples)
        const handRank = getHandRank(round.hand)
        const currentBestHandRank = stats.bestHand ? getHandRank(stats.bestHand) : -1

        if (handRank > currentBestHandRank) {
          stats.bestHand = round.hand
        }
      }
    }
  })

  // Calcular taxa de vitória e lucro
  playerStatsMap.forEach((stats) => {
    stats.winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0
    stats.profit = stats.totalEarned - stats.totalSpent
  })

  // Converter para array e ordenar
  const playerStats = Array.from(playerStatsMap.values())

  // Calcular estatísticas de mãos
  const handCounts = new Map<string, number>()
  allRounds.forEach((round) => {
    handCounts.set(round.hand, (handCounts.get(round.hand) || 0) + 1)
  })

  const totalRounds = allRounds.length
  const handStats: HandStats[] = Array.from(handCounts.entries())
    .map(([hand, count]) => ({
      hand,
      count,
      percentage: totalRounds > 0 ? Math.round((count / totalRounds) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Ordenar jogadores por diferentes métricas
  const topPlayers = [...playerStats].sort((a, b) => b.winRate - a.winRate).slice(0, 5)
  const worstPlayers = [...playerStats].sort((a, b) => a.winRate - b.winRate).slice(0, 5)
  const mostProfitablePlayers = [...playerStats].sort((a, b) => b.profit - a.profit).slice(0, 5)
  const biggestLosers = [...playerStats].sort((a, b) => a.profit - b.profit).slice(0, 5)

  // Calcular estatísticas gerais
  const totalGames = completedGames.length
  const totalPlayers = new Set(allPlayers.map((p) => p.name)).size

  // Ordenar jogos por data (mais recentes primeiro)
  const recentGames = [...completedGames]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Calcular jogadores com buy-in não pago
  const unpaidPlayersMap = new Map<string, UnpaidPlayerStats>()

  allPlayers.forEach((player) => {
    if (!player.buyInPaid) {
      if (!unpaidPlayersMap.has(player.name)) {
        unpaidPlayersMap.set(player.name, {
          id: player.id,
          name: player.name,
          avatar: player.avatar,
          totalDebt: 0,
          unpaidGames: [],
        })
      }

      const unpaidPlayer = unpaidPlayersMap.get(player.name)!

      // Adicionar dívida
      unpaidPlayer.totalDebt += player.buyInAmount

      // Adicionar jogo à lista de jogos não pagos
      const gameDate = completedGames.find((g) => g.id === player.tableId)?.createdAt || new Date().toISOString()

      unpaidPlayer.unpaidGames.push({
        tableId: player.tableId,
        tableName: player.tableName,
        amount: player.buyInAmount,
        date: gameDate,
        playerId: player.id,
      })
    }
  })

  // Ordenar jogadores com dívidas pelo valor total (maior para menor)
  const unpaidPlayers = Array.from(unpaidPlayersMap.values()).sort((a, b) => b.totalDebt - a.totalDebt)

  return {
    totalGames,
    totalPlayers,
    averageBuyIn: financialSummary.averageBuyIn,
    totalRounds,
    totalMoneyCollected: financialSummary.totalCollected,
    highestPot: financialSummary.highestPot,
    topPlayers,
    worstPlayers,
    mostProfitablePlayers,
    biggestLosers,
    popularHands: handStats.slice(0, 5),
    recentGames,
    unpaidPlayers,
  }
}

// Função auxiliar para classificar mãos de poker
function getHandRank(hand: string): number {
  const ranks: Record<string, number> = {
    Par: 1,
    "Dois Pares": 2,
    Trinca: 3,
    Straight: 4,
    Flush: 5,
    "Full House": 6,
    Quadra: 7,
    "Straight Flush": 8,
    "Royal Flush": 9,
  }

  return ranks[hand] || 0
}

