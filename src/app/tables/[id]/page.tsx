/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableTimer } from "@/components/tables/table-timer"
import { PlayerList } from "@/components/tables/player-list"
import { AddPlayerDialog } from "@/components/tables/add-player-dialog"
import { RoundWinnerDialog } from "@/components/tables/round-winner-dialog"
import { RoundHistory } from "@/components/tables/round-history"
import { TableChips } from "@/components/tables/table-chips"
import { TableFinancialSummary } from "@/components/tables/table-financial-summary"
import { UnpaidPlayersList } from "@/components/tables/unpaid-players-list"
import type { PlayerType, RoundType, TableType } from "@/lib/types"
import { Trophy, UserPlus, ArrowLeft, Award, AlertTriangle, DollarSign, PlusCircle } from "lucide-react"
import Link from "next/link"
import {
  getTable,
  getPlayers,
  getRounds,
  addPlayer,
  updatePlayerChips,
  addRound,
  updateTableStatus,
  getAllPlayers,
  updatePlayerBuyInStatus,
  updateTablePot,
} from "@/lib/db"
import { useToast } from "@/components/use-toast"
import { PlayerSelector } from "@/components/tables/player-selector"
import { BuyInConfirmationDialog } from "@/components/tables/buy-in-confirmation-dialog"

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return "0"
  }
  return value.toString()
}

export default function TablePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { addToast } = useToast()
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [isRoundWinnerOpen, setIsRoundWinnerOpen] = useState(false)
  const [isPlayerSelectorOpen, setIsPlayerSelectorOpen] = useState(false)
  const [isBuyInConfirmationOpen, setIsBuyInConfirmationOpen] = useState(false)
  const [table, setTable] = useState<TableType | null>(null)
  const [players, setPlayers] = useState<PlayerType[]>([])
  const [allPlayers, setAllPlayers] = useState<PlayerType[]>([])
  const [rounds, setRounds] = useState<RoundType[]>([])
  const [winner, setWinner] = useState<PlayerType | null>(null)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const totalChips = players.reduce((sum, player) => sum + player.chips, 0)
  const existingAvatars = players.map((player) => player.avatar)

  // Create a mapping of player IDs to names for easier reference
  const playerNames = players.reduce(
    (acc, player) => {
      acc[player.id] = player.name
      return acc
    },
    {} as Record<string, string>,
  )

  // Load table data
  const loadData = async () => {
    try {
      setIsLoading(true)

      // Initialize storage first
      await fetch("/api/db")

      const tableData = await getTable(id)
      const playersData = await getPlayers(id)
      const roundsData = await getRounds(id)
      const registeredPlayers = await getAllPlayers()

      if (tableData) {
        setTable(tableData)
        setPlayers(playersData)
        setRounds(roundsData)
        setAllPlayers(registeredPlayers)

        // Check if game is already completed
        if (tableData.status === "completed" && tableData.winner) {
          const winnerPlayer = playersData.find((p) => p.name === tableData.winner)
          if (winnerPlayer) {
            setWinner(winnerPlayer)
          }
        }

        // Check if game is active
        if (tableData.status === "active" && playersData.some((p) => p.chips > 0)) {
          setIsGameActive(true)
        }
      }
    } catch (error) {
      console.error("Error loading table data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleAddPlayer = async (player: Omit<PlayerType, "id" | "tableId">) => {
    if (isGameActive) return

    try {
      const newPlayer = await addPlayer(id, player)
      setPlayers([...players, newPlayer])
      setIsAddPlayerOpen(false)
    } catch (error) {
      console.error("Error adding player:", error)
    }
  }

  const handleAddExistingPlayers = async (selectedPlayerIds: string[]) => {
    if (isGameActive) return

    try {
      const newPlayers = []

      for (const playerId of selectedPlayerIds) {
        const existingPlayer = allPlayers.find((p) => p.id === playerId)
        if (existingPlayer) {
          const newPlayer = await addPlayer(id, {
            name: existingPlayer.name,
            nickname: existingPlayer.nickname,
            pixKey: existingPlayer.pixKey,
            phone: existingPlayer.phone,
            chips: table?.startingChips || 1000,
            buyInPaid: false,
            avatar: existingPlayer.avatar || "/avatars/avatar-1.png",
          })
          newPlayers.push(newPlayer)
        }
      }

      setPlayers([...players, ...newPlayers])
      setIsPlayerSelectorOpen(false)
    } catch (error) {
      console.error("Error adding existing players:", error)
    }
  }

  const handleChipChange = async (playerId: string, amount: number) => {
    try {
      // Update the player's chips
      const updatedPlayers = players.map((player) => {
        if (player.id === playerId) {
          return { ...player, chips: Math.max(0, player.chips + amount) }
        }
        return player
      })

      // Update the player in the database
      const player = updatedPlayers.find((p) => p.id === playerId)
      if (player) {
        await updatePlayerChips(playerId, player.chips)
      }

      setPlayers(updatedPlayers)

      // Check for winner
      const remainingPlayers = updatedPlayers.filter((p) => p.chips > 0)
      if (remainingPlayers.length === 1 && isGameActive) {
        const winner = remainingPlayers[0]
        setWinner(winner)
        setIsGameActive(false)
        setIsBuyInConfirmationOpen(true)
      }
    } catch (error) {
      console.error("Error updating chips:", error)
    }
  }

  const handleRoundComplete = async (winnerId: string, hand: string, potSize: number, cards: string[]) => {
    try {
      // Add round to history
      const timestamp = new Date().toISOString()
      const newRound = await addRound(id, {
        winnerId,
        hand,
        potSize,
        timestamp,
        cards, // Adicionando as cartas ao histórico
      })
      setRounds([newRound, ...rounds])

      // Deduct chips from all players except the winner
      const updatedPlayers = [...players]

      // Calculate how much each player should contribute to the pot
      const activePlayers = updatedPlayers.filter((p) => p.chips > 0 && p.id !== winnerId)
      const contributionPerPlayer = Math.floor(potSize / activePlayers.length)

      // Deduct chips from losers
      for (const player of updatedPlayers) {
        if (player.id !== winnerId && player.chips > 0) {
          const deduction = Math.min(player.chips, contributionPerPlayer)
          player.chips -= deduction
          await updatePlayerChips(player.id, player.chips)
        }
      }

      // Add all pot chips to winner
      const winnerPlayer = updatedPlayers.find((p) => p.id === winnerId)
      if (winnerPlayer) {
        winnerPlayer.chips += potSize
        await updatePlayerChips(winnerId, winnerPlayer.chips)
      }

      setPlayers(updatedPlayers)

      // Check if game is over (only one player with chips)
      const playersWithChips = updatedPlayers.filter((p) => p.chips > 0)
      if (playersWithChips.length === 1) {
        const winner = playersWithChips[0]
        setWinner(winner)
        setIsGameActive(false)
        setIsBuyInConfirmationOpen(true)
      }

      // Close dialog
      setIsRoundWinnerOpen(false)
    } catch (error) {
      console.error("Error completing round:", error)
    }
  }

  const handleBuyInConfirmation = async (paidPlayerIds: string[]) => {
    try {
      // Atualizar o status de pagamento de cada jogador
      const updatedPlayers = [...players]
      let totalPot = 0

      for (const player of updatedPlayers) {
        const isPaid = paidPlayerIds.includes(player.id)

        // Se o status mudou, atualizar no banco de dados
        if (player.buyInPaid !== isPaid) {
          await updatePlayerBuyInStatus(player.id, isPaid)
          player.buyInPaid = isPaid
        }

        // Calcular o total arrecadado
        if (isPaid && table) {
          totalPot += table.buyInAmount
        }
      }

      // Atualizar o total arrecadado na mesa
      if (table) {
        await updateTablePot(id, totalPot)

        // Atualizar o estado da mesa localmente
        setTable({
          ...table,
          totalPot,
          status: "completed",
          winner: winner?.name,
        })
      }

      // Atualizar o estado dos jogadores
      setPlayers(updatedPlayers)

      // Atualizar o status da mesa para completado
      if (table && winner) {
        await updateTableStatus(id, "completed", winner.name, totalPot)
      }

      addToast({
        title: "Jogo finalizado",
        description: `Pagamentos confirmados e jogo encerrado com sucesso.`,
      })
    } catch (error) {
      console.error("Error confirming buy-ins:", error)
      addToast({
        title: "Erro ao confirmar pagamentos",
        description: "Não foi possível atualizar os pagamentos.",
        variant: "destructive",
      })
    }
  }

  const handlePaymentComplete = () => {
    // Recarregar os dados da mesa quando um pagamento for concluído
    loadData()
  }

  const startGame = async () => {
    if (players.length < 2) {
      addToast({
        title: "Não é possível iniciar o jogo",
        description: "É necessário ter pelo menos 2 jogadores para iniciar.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGameActive(true)
      setWinner(null)
      setRounds([])

      // Reset all players to initial buy-in
      const resetPlayers = players.map((player) => ({
        ...player,
        chips: table?.startingChips || 1000,
      }))

      // Update players in database
      for (const player of resetPlayers) {
        await updatePlayerChips(player.id, player.chips)
      }

      setPlayers(resetPlayers)

      // Update table status
      if (table) {
        await updateTableStatus(id, "active")
      }
    } catch (error) {
      console.error("Error starting game:", error)
    }
  }

  const createNewTable = () => {
    router.push("/tables")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando mesa...</p>
        </div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mesa não encontrada</h1>
          <Button asChild>
            <Link href="/tables">Voltar para Mesas</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/tables">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{table.name}</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isGameActive && !winner && (
            <>
              <Button onClick={() => setIsPlayerSelectorOpen(true)} disabled={isGameActive}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Jogadores</span>
                <span className="sm:hidden">Jogadores</span>
              </Button>
              <Button onClick={() => setIsAddPlayerOpen(true)} variant="outline" disabled={isGameActive}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Novo Jogador</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </>
          )}

          {isGameActive && (
            <Button onClick={() => setIsRoundWinnerOpen(true)} variant="outline">
              <Award className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Registrar Rodada</span>
              <span className="sm:hidden">Rodada</span>
            </Button>
          )}

          {winner && (
            <Button onClick={() => setIsBuyInConfirmationOpen(true)} variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>Confirmar Pagamentos</span>
            </Button>
          )}

          {!isGameActive && players.length >= 2 && !winner && (
            <Button onClick={startGame} variant="default">
              Iniciar Jogo
            </Button>
          )}

          {winner && (
            <Button onClick={createNewTable} variant="default">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Mesa
            </Button>
          )}
        </div>
      </div>

      {players.length < 2 && !isGameActive && (
        <Card className="bg-amber-500/10 border-amber-500">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <div>
              <h3 className="font-medium">Jogadores insuficientes</h3>
              <p className="text-sm text-muted-foreground">
                É necessário adicionar pelo menos 2 jogadores para iniciar o jogo.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {winner && (
        <Card className="bg-primary/10 border-primary animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Jogo Finalizado</CardTitle>
            <Trophy className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              Vencedor: <span className="font-bold">{winner.name}</span> com {winner.chips} fichas!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Não esqueça de confirmar quem pagou o buy-in antes de finalizar o jogo.
            </p>
            <p className="text-sm text-muted-foreground mt-1">Para iniciar um novo jogo, crie uma nova mesa.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status do Jogo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TableTimer isActive={isGameActive} />
                <TableChips totalChips={totalChips} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <TableFinancialSummary buyInAmount={table.buyInAmount} players={players} totalPot={table.totalPot} />
              </CardContent>
            </Card>
          </div>

          <PlayerList players={players} onChipChange={handleChipChange} isGameActive={isGameActive} />

          {table.status === "completed" && (
            <UnpaidPlayersList players={players} table={table} onPaymentComplete={handlePaymentComplete} />
          )}

          <RoundHistory rounds={rounds} playerNames={playerNames} />
        </div>

        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Mesa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Buy-in:</span>
                <span className="font-medium">R${formatNumber(table.buyInAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fichas iniciais:</span>
                <span className="font-medium">{formatNumber(table.startingChips)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Jogadores:</span>
                <span className="font-medium">
                  {players.length}/{table.maxPlayers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total arrecadado:</span>
                <span className="font-medium">R${formatNumber(table.totalPot)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras do Jogo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Jogadores não podem comprar mais fichas durante o jogo</p>
              <p>• O vencedor é o último jogador com fichas</p>
              <p>• Aposta mínima é de 10 fichas</p>
              <p>• Sem limite de tempo para decisões</p>
              <p>• É obrigatório confirmar quem pagou o buy-in ao final do jogo</p>
              <p>• Para iniciar um novo jogo, crie uma nova mesa</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddPlayerDialog
        open={isAddPlayerOpen}
        onOpenChange={setIsAddPlayerOpen}
        onAddPlayer={handleAddPlayer}
        startingChips={table.startingChips}
        buyInAmount={table.buyInAmount}
        existingAvatars={existingAvatars}
      />

      <PlayerSelector
        open={isPlayerSelectorOpen}
        onOpenChange={setIsPlayerSelectorOpen}
        onAddPlayers={handleAddExistingPlayers}
        allPlayers={allPlayers}
        existingPlayerIds={players.map((p) => p.id)}
      />

      <RoundWinnerDialog
        open={isRoundWinnerOpen}
        onOpenChange={setIsRoundWinnerOpen}
        players={players}
        onRoundComplete={handleRoundComplete as any}
      />

      <BuyInConfirmationDialog
        open={isBuyInConfirmationOpen}
        onOpenChange={setIsBuyInConfirmationOpen}
        players={players}
        onConfirm={handleBuyInConfirmation}
      />
    </div>
  )
}

