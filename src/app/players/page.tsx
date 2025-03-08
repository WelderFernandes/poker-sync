"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, ArrowLeft, Search, Trash2, Edit, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CreatePlayerDialog } from "@/components/players/create-player-dialog"
import { EditPlayerDialog } from "@/components/players/edit-player-dialog"
import { DeletePlayerDialog } from "@/components/players/delete-player-dialog"
import Link from "next/link"
import type { PlayerType } from "@/lib/types"
import { getAllPlayers, deletePlayer } from "@/lib/db"
import { useToast } from "@/components/use-toast"

export default function PlayersPage() {
  const { addToast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [players, setPlayers] = useState<PlayerType[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load players
  useEffect(() => {
    async function loadPlayers() {
      try {
        setIsLoading(true)

        // Initialize storage first
        await fetch("/api/db")

        const allPlayers = await getAllPlayers()
        setPlayers(allPlayers)
      } catch (error) {
        console.error("Error loading players:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlayers()
  }, [])

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.nickname && player.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (player.phone && player.phone.includes(searchQuery)),
  )

  const handleEditPlayer = (player: PlayerType) => {
    setSelectedPlayer(player)
    setIsEditDialogOpen(true)
  }

  const handleDeletePlayer = (player: PlayerType) => {
    setSelectedPlayer(player)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeletePlayer = async () => {
    if (!selectedPlayer) return

    try {
      await deletePlayer(selectedPlayer.id)
      setPlayers(players.filter((p) => p.id !== selectedPlayer.id))
      setIsDeleteDialogOpen(false)
      setSelectedPlayer(null)

      addToast({
        title: "Jogador excluído",
        description: `${selectedPlayer.name} foi removido com sucesso.`,
      })
    } catch (error) {
      console.error("Error deleting player:", error)
      addToast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o jogador.",
        variant: "destructive",
      })
    }
  }

  const handleCreatePlayer = (newPlayer: PlayerType) => {
    setPlayers([...players, newPlayer])
  }

  const handleUpdatePlayer = (updatedPlayer: PlayerType) => {
    setPlayers(players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)))
  }

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/invite`
    navigator.clipboard.writeText(inviteLink)

    addToast({
      title: "Link copiado!",
      description: "Link de convite copiado para a área de transferência.",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando jogadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Jogadores</h1>
            <p className="text-muted-foreground">Gerencie os jogadores cadastrados</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyInviteLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar Link de Convite
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Jogador
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jogadores..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jogadores Cadastrados</CardTitle>
          <CardDescription>{filteredPlayers.length} jogador(es) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {filteredPlayers.length > 0 ? (
              <div className="space-y-4">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={player.avatar || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{player.name}</p>
                          {player.nickname && (
                            <Badge variant="outline" className="ml-2">
                              {player.nickname}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                          {player.phone && <p>📱 {player.phone}</p>}
                          {player.pixKey && <p>💸 Pix: {player.pixKey}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPlayer(player)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePlayer(player)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "Nenhum jogador encontrado com esse termo de busca."
                  : "Nenhum jogador cadastrado ainda."}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <CreatePlayerDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreatePlayer={handleCreatePlayer}
        existingAvatars={players.map((p) => p.avatar || "")}
      />

      {selectedPlayer && (
        <>
          <EditPlayerDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            player={selectedPlayer}
            onUpdatePlayer={handleUpdatePlayer}
            existingAvatars={players.filter((p) => p.id !== selectedPlayer.id).map((p) => p.avatar || "")}
          />

          <DeletePlayerDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            player={selectedPlayer}
            onConfirm={confirmDeletePlayer}
          />
        </>
      )}
    </div>
  )
}

