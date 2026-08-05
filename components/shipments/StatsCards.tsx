interface StatsCardsProps {
  total: number
  draft: number
  finalized: number
}

export default function StatsCards({ total, draft, finalized }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-muted p-4 rounded-lg shadow border border-border">
        <div className="text-sm text-muted-foreground">Total Shipments</div>
        <div className="text-2xl font-bold text-foreground">{total}</div>
      </div>
      <div className="bg-muted p-4 rounded-lg shadow border border-border">
        <div className="text-sm text-muted-foreground">Draft</div>
        <div className="text-2xl font-bold text-muted-foreground">{draft}</div>
      </div>
      <div className="bg-muted p-4 rounded-lg shadow border border-border">
        <div className="text-sm text-muted-foreground">Finalized</div>
        <div className="text-2xl font-bold text-premium">{finalized}</div>
      </div>
    </div>
  )
}
