import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { TableType } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/utils'

interface RecentGamesProps {
  games: TableType[]
}

export function RecentGames({ games }: RecentGamesProps) {
  if (games.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Jogos Recentes</CardTitle>
          <CardDescription>Suas últimas sessões de poker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum jogo finalizado ainda
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Jogos Recentes</CardTitle>
        <CardDescription>Suas últimas sessões de poker</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {games.map((game) => (
            <div key={game.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {game.winner
                      ? game.winner
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                      : '??'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {game.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(game.createdAt))}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline" className="mb-1">
                  {game.players} jogadores
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {game.winner ? `Vencedor: ${game.winner}` : 'Em andamento'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
