import { Progress } from '@/components/ui/progress'

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return '0'
  }
  return value.toString()
}

interface TableChipsProps {
  totalChips: number
}

export function TableChips({ totalChips }: TableChipsProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Total de Fichas em Jogo</span>
        <span className="text-sm font-medium">{formatNumber(totalChips)}</span>
      </div>
      <Progress value={100} className="h-2" />
    </div>
  )
}
