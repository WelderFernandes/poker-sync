import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Clock, Users, DollarSign } from 'lucide-react'
import type { DashboardStats as DashboardStatsType } from '@/lib/stats'

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '0'
  }
  return value.toString()
}

interface DashboardStatsProps {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Jogos</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats.totalGames)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalRounds} rodadas jogadas
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mãos Populares</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.popularHands.length > 0 ? stats.popularHands[0].hand : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.popularHands.length > 0
              ? `${stats.popularHands[0].percentage}% das rodadas`
              : 'Nenhuma mão registrada'}
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Jogadores
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(stats.totalPlayers)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.topPlayers.length > 0
              ? `${stats.topPlayers[0].name} lidera com ${stats.topPlayers[0].winRate}%`
              : 'Nenhum jogador registrado'}
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Buy-in Médio</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R${formatNumber(stats.averageBuyIn)}
          </div>
          <p className="text-xs text-muted-foreground">Por jogador</p>
        </CardContent>
      </Card>
    </div>
  )
}
