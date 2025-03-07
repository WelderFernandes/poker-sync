import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export function StatisticsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          Analyze your poker game performance and trends
        </p>
      </div>
      <Button variant="outline" className="w-full md:w-auto">
        <Calendar className="mr-2 h-4 w-4" />
        Filter by Date
      </Button>
    </div>
  )
}
