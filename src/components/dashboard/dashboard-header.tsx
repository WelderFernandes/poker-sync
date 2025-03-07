export function DashboardHeader() {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        Bem-vindo ao seu gerenciador de Poker. Visualize estatísticas e
        atividades recentes.
      </p>
    </div>
  )
}
