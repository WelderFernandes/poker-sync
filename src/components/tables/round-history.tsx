import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { RoundType } from "@/lib/types"

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return "0"
  }
  return value.toString()
}

interface RoundHistoryProps {
  rounds: RoundType[]
  playerNames: Record<string, string>
}

export function RoundHistory({ rounds, playerNames }: RoundHistoryProps) {
  if (rounds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Rodadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">Nenhuma rodada registrada ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Rodadas</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {rounds.map((round, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Rodada {index + 1}</div>
                  <Badge variant="outline">Pote: {formatNumber(round.potSize)} fichas</Badge>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Ganhador: </span>
                  <span className="font-medium">{playerNames[round.winnerId]}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Mão: </span>
                  <span className="font-medium">{round.hand}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

