<script lang="ts">
  let { total, draft, finalized }: { total: number; draft: number; finalized: number } = $props()

  const stats = $derived([
    { label: 'Total Shipments', value: total, tone: 'text-foreground' },
    { label: 'Draft', value: draft, tone: 'text-muted-foreground' },
    { label: 'Finalized', value: finalized, tone: 'text-premium' },
  ])
</script>

<!-- A definition list so each number is programmatically tied to its label. -->
<dl class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {#each stats as stat (stat.label)}
    <div class="bg-muted p-4 rounded-lg shadow border border-border">
      <dt class="text-sm text-muted-foreground">{stat.label}</dt>
      <dd class="text-2xl font-bold {stat.tone}">{stat.value}</dd>
    </div>
  {/each}
</dl>
