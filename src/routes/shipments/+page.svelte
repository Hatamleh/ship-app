<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import { page } from '$app/state'
  import StatsCards from '$lib/components/shipments/StatsCards.svelte'
  import ShipmentFilters from '$lib/components/shipments/ShipmentFilters.svelte'
  import ShipmentsTable from '$lib/components/shipments/ShipmentsTable.svelte'
  import DeleteModal from '$lib/components/shipments/DeleteModal.svelte'
  import PromoModal from '$lib/components/shipments/PromoModal.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  let deleteTarget = $state<number | null>(null)
  let errorMessage = $state<string | null>(null)
  let working = $state(false)

  const showSuccess = $derived(page.url.searchParams.get('success') === 'true')

  const stats = $derived({
    total: data.shipments.length,
    draft: data.shipments.filter((s) => s.status === 'draft').length,
    finalized: data.shipments.filter((s) => s.status !== 'draft').length,
  })

  /** Filters are URL state, so a filtered list is shareable and survives reload. */
  function setFilter(key: 'status' | 'type', value: string) {
    const params = new URLSearchParams(page.url.searchParams)
    params.delete('success')
    if (value === 'all') params.delete(key)
    else params.set(key, value)
    goto(`?${params}`, { keepFocus: true, noScroll: true })
  }

  async function confirmDelete() {
    if (deleteTarget === null) return
    const id = deleteTarget
    deleteTarget = null
    working = true

    try {
      const response = await fetch(`/api/shipments/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        errorMessage = 'Failed to delete shipment'
        return
      }
      await invalidateAll()
    } finally {
      working = false
    }
  }

  async function finalize(id: number) {
    working = true
    errorMessage = null
    try {
      const response = await fetch(`/api/shipments/${id}/finalize`, { method: 'POST' })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        errorMessage = body.message || body.error || 'Failed to finalize shipment'
        return
      }
      await invalidateAll()
    } finally {
      working = false
    }
  }
</script>

<svelte:head>
  <title>My Shipments</title>
</svelte:head>

<PromoModal />

<div class="mb-8 flex items-center justify-between">
  <div>
    <p class="eyebrow">Dashboard</p>
    <h1 class="text-3xl font-bold text-foreground">My <span class="grad">Shipments</span></h1>
    <p class="mt-2 text-muted-foreground">View and manage all your shipments</p>
  </div>
  <a
    href="/"
    class="btn btn-primary text-sm"
  >
    + Create Shipment
  </a>
</div>

{#if showSuccess}
  <div
    role="status"
    class="mb-6 bg-premium/20 border border-premium text-premium px-4 py-3 rounded"
  >
    Shipment saved successfully!
  </div>
{/if}

{#if errorMessage}
  <div
    role="alert"
    class="mb-6 bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded"
  >
    {errorMessage}
  </div>
{/if}

<StatsCards total={stats.total} draft={stats.draft} finalized={stats.finalized} />

<ShipmentFilters
  statusFilter={data.status}
  typeFilter={data.shipmentType}
  onStatusChange={(v) => setFilter('status', v)}
  onTypeChange={(v) => setFilter('type', v)}
/>

<div aria-busy={working}>
  <ShipmentsTable
    shipments={data.shipments}
    onDelete={(id) => (deleteTarget = id)}
    onFinalize={finalize}
  />
</div>

<DeleteModal
  open={deleteTarget !== null}
  shipmentId={deleteTarget}
  onConfirm={confirmDelete}
  onCancel={() => (deleteTarget = null)}
/>
