import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function PlayerPerformanceTable() {
  const players = [
    {
      name: 'John Doe',
      gamesPlayed: 12,
      wins: 8,
      winRate: 67,
      avgPlacement: 1.5,
      bestGame: 'High Stakes (1st)',
    },
    {
      name: 'Jane Smith',
      gamesPlayed: 10,
      wins: 6,
      winRate: 60,
      avgPlacement: 1.8,
      bestGame: 'Friday Night (1st)',
    },
    {
      name: 'Mike Johnson',
      gamesPlayed: 9,
      wins: 5,
      winRate: 56,
      avgPlacement: 2.1,
      bestGame: 'Tournament (1st)',
    },
    {
      name: 'Sarah Williams',
      gamesPlayed: 8,
      wins: 4,
      winRate: 50,
      avgPlacement: 2.3,
      bestGame: 'Casual Sunday (1st)',
    },
    {
      name: 'David Brown',
      gamesPlayed: 7,
      wins: 3,
      winRate: 43,
      avgPlacement: 2.5,
      bestGame: 'High Stakes (1st)',
    },
    {
      name: 'Emily Davis',
      gamesPlayed: 6,
      wins: 2,
      winRate: 33,
      avgPlacement: 2.8,
      bestGame: 'Friday Night (1st)',
    },
    {
      name: 'Alex Wilson',
      gamesPlayed: 5,
      wins: 1,
      winRate: 20,
      avgPlacement: 3.2,
      bestGame: 'Casual Sunday (1st)',
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead className="text-right">Games</TableHead>
          <TableHead className="text-right">Wins</TableHead>
          <TableHead className="text-right">Win Rate</TableHead>
          <TableHead className="text-right">Avg. Placement</TableHead>
          <TableHead>Best Game</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.name}>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell className="text-right">{player.gamesPlayed}</TableCell>
            <TableCell className="text-right">{player.wins}</TableCell>
            <TableCell className="text-right">
              <Badge variant={player.winRate > 50 ? 'default' : 'outline'}>
                {player.winRate}%
              </Badge>
            </TableCell>
            <TableCell className="text-right">{player.avgPlacement}</TableCell>
            <TableCell>{player.bestGame}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
