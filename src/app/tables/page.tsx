"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, DollarSign, ChevronRight, ArrowLeft, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { TablesList } from "@/components/tables/tables-list"
import { CreateTableDialog } from "@/components/tables/create-table-dialog"
import type { TableType } from "@/lib/types"
import { getActiveGames, getCompletedGames, createTable, getAllPlayers } from "@/lib/db"
import Link from "next/link"
import { useToast } from "@/components/use-toast"

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return "0"
  }
  return value.toString()
}

export default function TablesPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTables, setActiveTables] = useState<TableType[]>([])
  const [completedTables, setCompletedTables] = useState<TableType[]>([])
  const [registeredPlayers, setRegisteredPlayers] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load tables
  useEffect(() => {
    async function loadTables() {
      try {
        setIsLoading(true)

        // Initialize storage first
        await fetch("/api/db")

        const active = await getActiveGames()
        const completed = await getCompletedGames()
        const players = await getAllPlayers()

        setActiveTables(active)
        setCompletedTables(completed)
        setRegisteredPlayers(players.length)
      } catch (error) {
        console.error("Error loading tables:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTables()
  }, [])

  const handleCreateTable = async (table: Omit<TableType, "id" | "createdAt" | "status" | "totalPot">) => {
    try {
      // Verificar se há jogadores cadastrados
      if (registeredPlayers === 0) {
        addToast({
          title: "Erro ao criar mesa",
          description: "É necessário cadastrar jogadores antes de criar uma mesa.",
          variant: "destructive",
        })
        return
      }

      const newTable = await createTable(table)
      setActiveTables([newTable, ...activeTables])
      setIsCreateDialogOpen(false)

      // Navigate to the new table
      router.push(`/tables/${newTable.id}`)
    } catch (error) {
      console.error("Error creating table:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando mesas...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mesas de Poker</h1>
            <p className="text-muted-foreground">Gerencie suas mesas e jogos de poker</p>
          </div>
        </div>
        <Button
          onClick={() => {
            if (registeredPlayers === 0) {
              addToast({
                title: "Ação não permitida",
                description: "É necessário cadastrar jogadores antes de criar uma mesa.",
                variant: "destructive",
              })
              router.push("/players")
            } else {
              setIsCreateDialogOpen(true)
            }
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Mesa
        </Button>
      </div>

      {registeredPlayers === 0 && (
        <Card className="bg-amber-500/10 border-amber-500">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <div>
              <h3 className="font-medium">Nenhum jogador cadastrado</h3>
              <p className="text-sm text-muted-foreground">
                É necessário cadastrar jogadores antes de criar uma mesa.{" "}
                <Link href="/players" className="text-primary underline underline-offset-4">
                  Cadastrar jogadores
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTables.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Nenhuma mesa ativa</h3>
              <p className="text-muted-foreground mb-4">Crie uma nova mesa para começar a jogar</p>
              <Button
                onClick={() => {
                  if (registeredPlayers === 0) {
                    addToast({
                      title: "Ação não permitida",
                      description: "É necessário cadastrar jogadores antes de criar uma mesa.",
                      variant: "destructive",
                    })
                    router.push("/players")
                  } else {
                    setIsCreateDialogOpen(true)
                  }
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Mesa
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {activeTables.map((table) => (
            <Card key={table.id} className="animate-slide-up hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle>{table.name}</CardTitle>
                <CardDescription>Criada em {new Date(table.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {table.players}/{table.maxPlayers} Jogadores
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Buy-in: R${formatNumber(table.buyInAmount)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">
                    Fichas iniciais: {formatNumber(table.startingChips)} • Arrecadado: R${formatNumber(table.totalPot)}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/tables/${table.id}`)}>
                  Gerenciar Mesa
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <TablesList tables={completedTables} />

      <CreateTableDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTable={handleCreateTable}
      />
    </div>
  )
}

