'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WinRateChart } from '@/components/statistics/win-rate-chart'
import { ChipsDistributionChart } from '@/components/statistics/chips-distribution-chart'
import { GameLengthChart } from '@/components/statistics/game-length-chart'
import { PlayerPerformanceTable } from '@/components/statistics/player-performance-table'
import { StatisticsHeader } from '@/components/statistics/statistics-header'

export default function StatisticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <StatisticsHeader />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Games</CardTitle>
                <CardDescription>All time statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">24</div>
                <p className="text-sm text-muted-foreground">
                  +3 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Average Game Length</CardTitle>
                <CardDescription>In minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">87</div>
                <p className="text-sm text-muted-foreground">
                  -12 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Players</CardTitle>
                <CardDescription>Unique participants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">18</div>
                <p className="text-sm text-muted-foreground">+2 new players</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Win Rate by Player</CardTitle>
                <CardDescription>
                  Top 5 players by win percentage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WinRateChart />
              </CardContent>
            </Card>

            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Chips Distribution</CardTitle>
                <CardDescription>
                  Average chips per player over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChipsDistributionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="players" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Player Performance</CardTitle>
              <CardDescription>Statistics for all players</CardDescription>
            </CardHeader>
            <CardContent>
              <PlayerPerformanceTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Game Length Distribution</CardTitle>
              <CardDescription>Duration of games in minutes</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <GameLengthChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Game statistics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Trend data will appear as more games are played
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
