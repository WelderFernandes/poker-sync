"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentGames } from "@/components/dashboard/recent-games"
import { PlayerStats } from "@/components/dashboard/player-stats"
import { Button } from "@/components/ui/button"
import { Table2, UserPlus2 } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/stats"
import type { DashboardStats as DashboardStatsType } from "@/lib/stats"
import { HandsChart } from "@/components/dashboard/hands-chart"
import { ProfitablePlayers } from "@/components/dashboard/profitable-players"
import { UnpaidPlayersRanking } from "@/components/dashboard/unpaid-players-ranking"

export default function Home() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadStats = async () => {
    try {
      setIsLoading(true)

      // Initialize storage first
      await fetch("/api/db")

      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handlePaymentComplete = () => {
    // Recarregar as estatísticas quando um pagamento for concluído
    loadStats()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex gap-1.5 flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <DashboardHeader />
        <Button asChild className="animate-slide-in w-full md:w-auto">
          <Link href="/tables">
            <Table2 className="mr-2 h-4 w-4" />
            Gerenciar Mesas
          </Link>
        </Button>
        <Button variant={"ghost"} asChild className="animate-slide-in w-full md:w-auto">
          <Link href="/players">
            <UserPlus2 className="mr-2 h-4 w-4" />
            Cadastrar jogadores
          </Link>
        </Button>
      </div>

      {stats && <DashboardStats stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {stats && <RecentGames games={stats.recentGames} />}
        {stats && <PlayerStats players={stats.topPlayers} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {stats && <HandsChart hands={stats.popularHands} />}
        {stats && (
          <UnpaidPlayersRanking unpaidPlayers={stats.unpaidPlayers} onPaymentComplete={handlePaymentComplete} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {stats && (
          <ProfitablePlayers
            players={stats.mostProfitablePlayers}
            title="Jogadores Mais Lucrativos"
            description="Jogadores com maior lucro em R$"
          />
        )}
        {stats && (
          <ProfitablePlayers
            players={stats.biggestLosers}
            title="Maiores Perdedores"
            description="Jogadores com maior prejuízo em R$"
            isLosers={true}
          />
        )}
      </div>
    </div>
  )
}

