interface ShipmentFiltersProps {
  statusFilter: string
  typeFilter: string
  onStatusChange: (value: string) => void
  onTypeChange: (value: string) => void
}

export default function ShipmentFilters({
  statusFilter,
  typeFilter,
  onStatusChange,
  onTypeChange,
}: ShipmentFiltersProps) {
  return (
    <div className="bg-muted p-4 rounded-lg shadow border border-border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-nord-polar-2 text-foreground"
          >
            <option value="all">All Types</option>
            <option value="Domestic">Domestic</option>
            <option value="IntraGulf">Intra-Gulf</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>
    </div>
  )
}
