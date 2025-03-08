// Browser storage keys
import type { TableType, PlayerType, RoundType, FinancialSummary } from "@/lib/types"

const TABLES_KEY = "poker-manager:tables"
const PLAYERS_KEY = "poker-manager:players"
const ROUNDS_KEY = "poker-manager:rounds"
const REGISTERED_PLAYERS_KEY = "poker-manager:registered-players"

// Helper functions to work with localStorage
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error)
    return defaultValue
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error)
  }
}

// Initialize storage
export async function initializeStorage() {
  // Check if storage is already initialized
  const tables = getStorageItem<TableType[]>(TABLES_KEY, [])
  const players = getStorageItem<PlayerType[]>(PLAYERS_KEY, [])
  const rounds = getStorageItem<RoundType[]>(ROUNDS_KEY, [])
  const registeredPlayers = getStorageItem<PlayerType[]>(REGISTERED_PLAYERS_KEY, [])

  // If not initialized, set default values
  if (!tables.length) setStorageItem(TABLES_KEY, [])
  if (!players.length) setStorageItem(PLAYERS_KEY, [])
  if (!rounds.length) setStorageItem(ROUNDS_KEY, [])
  if (!registeredPlayers.length) setStorageItem(REGISTERED_PLAYERS_KEY, [])

  return { success: true }
}

// Tables
export async function getTables(): Promise<TableType[]> {
  return getStorageItem<TableType[]>(TABLES_KEY, [])
}

export async function getActiveGames(): Promise<TableType[]> {
  const tables = await getTables()
  return tables.filter((table) => table.status === "active")
}

export async function getCompletedGames(): Promise<TableType[]> {
  const tables = await getTables()
  return tables.filter((table) => table.status === "completed")
}

export async function getTable(id: string): Promise<TableType | undefined> {
  const tables = await getTables()
  return tables.find((table) => table.id === id)
}

export async function createTable(
  table: Omit<TableType, "id" | "createdAt" | "status" | "totalPot">,
): Promise<TableType> {
  const tables = await getTables()
  const id = Math.random().toString(36).substring(2, 9)
  const createdAt = new Date().toISOString()

  const newTable: TableType = {
    id,
    ...table,
    players: 0,
    totalPot: 0, // Inicialmente não há dinheiro arrecadado
    status: "active",
    createdAt,
  }

  setStorageItem(TABLES_KEY, [...tables, newTable])
  return newTable
}

export async function updateTableStatus(
  id: string,
  status: "active" | "completed",
  winner?: string,
  totalPot?: number,
): Promise<void> {
  const tables = await getTables()
  const updatedTables = tables.map((table) => {
    if (table.id === id) {
      return {
        ...table,
        status,
        winner: winner || table.winner,
        totalPot: totalPot !== undefined ? totalPot : table.totalPot,
      }
    }
    return table
  })

  setStorageItem(TABLES_KEY, updatedTables)
}

export async function updateTablePlayers(id: string, playerCount: number): Promise<void> {
  const tables = await getTables()
  const updatedTables = tables.map((table) => {
    if (table.id === id) {
      return {
        ...table,
        players: playerCount,
      }
    }
    return table
  })

  setStorageItem(TABLES_KEY, updatedTables)
}

export async function updateTablePot(id: string, totalPot: number): Promise<void> {
  const tables = await getTables()
  const updatedTables = tables.map((table) => {
    if (table.id === id) {
      return {
        ...table,
        totalPot,
      }
    }
    return table
  })

  setStorageItem(TABLES_KEY, updatedTables)
}

// Players
export async function getPlayers(tableId: string): Promise<PlayerType[]> {
  const players = getStorageItem<PlayerType[]>(PLAYERS_KEY, [])
  return players.filter((player) => player.tableId === tableId)
}

export async function addPlayer(tableId: string, player: Omit<PlayerType, "id" | "tableId">): Promise<PlayerType> {
  const players = getStorageItem<PlayerType[]>(PLAYERS_KEY, [])
  const id = Math.random().toString(36).substring(2, 9)

  const newPlayer: PlayerType = {
    id,
    tableId,
    ...player,
  }

  const updatedPlayers = [...players, newPlayer]
  setStorageItem(PLAYERS_KEY, updatedPlayers)

  // Update player count in table
  const tablePlayers = updatedPlayers.filter((p) => p.tableId === tableId)
  await updateTablePlayers(tableId, tablePlayers.length)

  // If player paid buy-in, update table pot
  if (player.buyInPaid) {
    const table = await getTable(tableId)
    if (table) {
      await updateTablePot(tableId, table.totalPot + table.buyInAmount)
    }
  }

  return newPlayer
}

export async function updatePlayerChips(id: string, chips: number): Promise<void> {
  const players = getStorageItem<PlayerType[]>(PLAYERS_KEY, [])
  const updatedPlayers = players.map((player) => {
    if (player.id === id) {
      return {
        ...player,
        chips,
      }
    }
    return player
  })

  setStorageItem(PLAYERS_KEY, updatedPlayers)
}

export async function updatePlayerBuyInStatus(id: string, buyInPaid: boolean): Promise<void> {
  const players = getStorageItem<PlayerType[]>(PLAYERS_KEY, [])
  let player: PlayerType | undefined

  const updatedPlayers = players.map((p) => {
    if (p.id === id) {
      player = p
      return {
        ...p,
        buyInPaid,
      }
    }
    return p
  })

  setStorageItem(PLAYERS_KEY, updatedPlayers)

  // Update table pot if player paid
  if (player && buyInPaid) {
    const table = await getTable(player.tableId)
    if (table) {
      await updateTablePot(table.id, table.totalPot + table.buyInAmount)
    }
  }
}

// Registered Players (Global player database)
export async function getAllPlayers(): Promise<PlayerType[]> {
  return getStorageItem<PlayerType[]>(REGISTERED_PLAYERS_KEY, [])
}

export async function createPlayer(
  player: Omit<PlayerType, "id" | "tableId" | "chips" | "buyInPaid">,
): Promise<PlayerType> {
  const players = getStorageItem<PlayerType[]>(REGISTERED_PLAYERS_KEY, [])
  const id = Math.random().toString(36).substring(2, 9)

  const newPlayer: PlayerType = {
    id,
    tableId: "", // Não está associado a nenhuma mesa ainda
    chips: 0,
    buyInPaid: false,
    ...player,
  }

  setStorageItem(REGISTERED_PLAYERS_KEY, [...players, newPlayer])
  return newPlayer
}

export async function updatePlayer(
  id: string,
  updates: Partial<Omit<PlayerType, "id" | "tableId" | "chips" | "buyInPaid">>,
): Promise<PlayerType> {
  const players = getStorageItem<PlayerType[]>(REGISTERED_PLAYERS_KEY, [])
  let updatedPlayer: PlayerType | undefined

  const updatedPlayers = players.map((player) => {
    if (player.id === id) {
      updatedPlayer = {
        ...player,
        ...updates,
      }
      return updatedPlayer
    }
    return player
  })

  if (!updatedPlayer) {
    throw new Error(`Player with id ${id} not found`)
  }

  setStorageItem(REGISTERED_PLAYERS_KEY, updatedPlayers)
  return updatedPlayer
}

export async function deletePlayer(id: string): Promise<void> {
  const players = getStorageItem<PlayerType[]>(REGISTERED_PLAYERS_KEY, [])
  const updatedPlayers = players.filter((player) => player.id !== id)
  setStorageItem(REGISTERED_PLAYERS_KEY, updatedPlayers)
}

// Rounds
export async function getRounds(tableId: string): Promise<RoundType[]> {
  const rounds = getStorageItem<RoundType[]>(ROUNDS_KEY, [])
  return rounds
    .filter((round) => round.tableId === tableId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function addRound(tableId: string, round: Omit<RoundType, "id" | "tableId">): Promise<RoundType> {
  const rounds = getStorageItem<RoundType[]>(ROUNDS_KEY, [])
  const id = Math.random().toString(36).substring(2, 9)

  const newRound: RoundType = {
    id,
    tableId,
    ...round,
  }

  setStorageItem(ROUNDS_KEY, [...rounds, newRound])
  return newRound
}

// Financial statistics
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const tables = await getTables()

  const totalCollected = tables.reduce((sum, table) => sum + table.totalPot, 0)
  const totalGames = tables.length
  const averageBuyIn =
    totalGames > 0 ? Math.round(tables.reduce((sum, table) => sum + table.buyInAmount, 0) / totalGames) : 0
  const highestPot = tables.reduce((max, table) => Math.max(max, table.totalPot), 0)

  return {
    totalCollected,
    totalGames,
    averageBuyIn,
    highestPot,
  }
}

