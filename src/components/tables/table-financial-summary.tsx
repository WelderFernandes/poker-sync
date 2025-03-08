import { Progress } from "@/components/ui/progress"
import type { PlayerType } from "@/lib/types"

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return "0"
  }
  return value.toString()
}

interface TableFinancialSummaryProps {
  buyInAmount: number
  players: PlayerType[]
  totalPot: number
}

export function TableFinancialSummary({ buyInAmount, players, totalPot }: TableFinancialSummaryProps) {
  const paidPlayers = players.filter((player) => player.buyInPaid).length
  const totalPlayers = players.length
  const potentialTotal = totalPlayers * buyInAmount
  const percentCollected = potentialTotal > 0 ? (totalPot / potentialTotal) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Total Arrecadado</span>
          <span className="text-sm font-medium">R${formatNumber(totalPot)}</span>
        </div>
        <Progress value={percentCollected} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border p-2 text-center">
          <div className="text-2xl font-bold">
            {paidPlayers}/{totalPlayers}
          </div>
          <p className="text-xs text-muted-foreground">Jogadores Pagos</p>
        </div>
        <div className="rounded-lg border p-2 text-center">
          <div className="text-2xl font-bold">R${formatNumber(buyInAmount)}</div>
          <p className="text-xs text-muted-foreground">Buy-in</p>
        </div>
      </div>
    </div>
  )
}

