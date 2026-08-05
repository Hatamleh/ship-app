<script lang="ts">
  let {
    statusFilter,
    typeFilter,
    onStatusChange,
    onTypeChange,
  }: {
    statusFilter: string
    typeFilter: string
    onStatusChange: (value: string) => void
    onTypeChange: (value: string) => void
  } = $props()
</script>

<div class="surface p-4 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label for="status-filter" class="block text-sm font-medium text-muted-foreground mb-1">
        Status
      </label>
      <select
        id="status-filter"
        value={statusFilter}
        onchange={(e) => onStatusChange(e.currentTarget.value)}
        class="field"
      >
        <option value="all">All Statuses</option>
        <option value="draft">Draft</option>
        <option value="finalized">Finalized</option>
      </select>
    </div>

    <div>
      <label for="type-filter" class="block text-sm font-medium text-muted-foreground mb-1">
        Type
      </label>
      <select
        id="type-filter"
        value={typeFilter}
        onchange={(e) => onTypeChange(e.currentTarget.value)}
        class="field"
      >
        <option value="all">All Types</option>
        <option value="Domestic">Domestic</option>
        <option value="IntraGulf">Intra-Gulf</option>
        <option value="International">International</option>
      </select>
    </div>
  </div>
</div>
