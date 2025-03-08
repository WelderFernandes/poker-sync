import type { TableType } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Add this helper function at the top of the file, outside the component
function formatNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value)) {
    return "0"
  }
  return value.toString()
}

interface TablesListProps {
  tables: TableType[]
}

export function TablesList({ tables }: TablesListProps) {
  if (tables.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jogos Finalizados</CardTitle>
        <CardDescription>Histórico dos seus jogos de poker finalizados</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Jogadores</TableHead>
              <TableHead>Buy-in</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Vencedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.name}</TableCell>
                <TableCell>
                  {table.players}/{table.maxPlayers}
                </TableCell>
                <TableCell>R${formatNumber(table.buyInAmount)}</TableCell>
                <TableCell>{new Date(table.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {table.winner ? (
                    <Badge variant="outline" className="bg-primary/10">
                      {table.winner}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Em Andamento</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

