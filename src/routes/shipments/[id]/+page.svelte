<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import { t } from '$lib/translations'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const shipment = $derived(data.shipment)
  const isDraft = $derived(shipment.status === 'draft')

  let working = $state(false)
  let errorMessage = $state<string | null>(null)

  const options = $derived(
    [
      { label: t('rate.insurance'), on: shipment.options.insurance },
      { label: t('form.signatureRequired'), on: shipment.options.signature },
      { label: t('form.packaging'), on: shipment.options.packaging },
      { label: t('form.containsLiquid'), on: shipment.options.liquid },
    ].filter((o) => o.on)
  )

  const costLines = $derived(
    [
      { label: t('rate.signatureRequired'), value: shipment.rate.signature },
      { label: t('rate.insurance'), value: shipment.rate.insurance },
      { label: t('rate.packaging'), value: shipment.rate.packaging },
    ].filter((line) => line.value > 0)
  )

  async function finalize() {
    working = true
    errorMessage = null
    try {
      const response = await fetch(`/api/shipments/${shipment.id}/finalize`, { method: 'POST' })
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

  async function remove() {
    working = true
    errorMessage = null
    try {
      const response = await fetch(`/api/shipments/${shipment.id}`, { method: 'DELETE' })
      if (!response.ok) {
        errorMessage = 'Failed to delete shipment'
        return
      }
      await goto('/shipments')
    } finally {
      working = false
    }
  }
</script>

<svelte:head>
  <title>{isDraft ? `Draft Shipment #${shipment.id}` : shipment.trackingNumber} - My Shipments</title>
</svelte:head>

<div class="mb-8">
  <a href="/shipments" class="text-primary hover:text-nord-frost-3 text-sm mb-4 inline-block">
    ← Back to Shipments
  </a>

  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-foreground">
        {isDraft ? `Draft Shipment #${shipment.id}` : shipment.trackingNumber}
      </h1>
      <p class="mt-2 text-muted-foreground">
        Created on {new Date(shipment.createdAt).toLocaleDateString('en-US')}
      </p>
    </div>

    <div class="flex items-center gap-4">
      {#if isDraft}
        <span class="px-3 py-1 text-sm font-medium rounded-full bg-nord-polar-2 text-foreground">
          Draft
        </span>
        <a
          href="/?edit={shipment.id}"
          class="px-4 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-nord-polar-2"
        >
          Edit
        </a>
        <button
          type="button"
          onclick={finalize}
          disabled={working}
          class="px-4 py-2 text-sm bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 disabled:opacity-50"
        >
          {working ? 'Finalizing...' : 'Finalize Shipment'}
        </button>
      {:else}
        <span
          class="px-3 py-1 text-sm font-medium rounded-full bg-nord-aurora-green/20 text-premium"
        >
          Finalized
        </span>
        <a
          href="/?repeat={shipment.id}"
          class="px-4 py-2 text-sm border border-border rounded-md text-muted-foreground hover:bg-nord-polar-2"
        >
          Repeat
        </a>
      {/if}
      <button
        type="button"
        onclick={remove}
        disabled={working}
        class="px-4 py-2 text-sm text-destructive border border-destructive rounded-md hover:bg-nord-aurora-red/20 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  </div>
</div>

{#if errorMessage}
  <div
    role="alert"
    class="mb-6 bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded"
  >
    {errorMessage}
  </div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <section
    aria-labelledby="sender-heading"
    class="bg-muted p-6 rounded-lg shadow border border-border"
  >
    <h2 id="sender-heading" class="text-lg font-semibold mb-4 text-foreground">
      Sender Information
    </h2>
    <dl class="space-y-3">
      <div>
        <dt class="text-sm text-muted-foreground">Name</dt>
        <dd class="font-medium text-foreground">{shipment.from.name}</dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Phone</dt>
        <dd class="font-medium text-foreground">{shipment.from.phone}</dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Address</dt>
        <dd class="font-medium text-foreground">
          {shipment.from.street}, {shipment.from.city}, {shipment.from.country}
          {shipment.from.postalCode}
        </dd>
      </div>
    </dl>
  </section>

  <section
    aria-labelledby="receiver-heading"
    class="bg-muted p-6 rounded-lg shadow border border-border"
  >
    <h2 id="receiver-heading" class="text-lg font-semibold mb-4 text-foreground">
      Receiver Information
    </h2>
    <dl class="space-y-3">
      <div>
        <dt class="text-sm text-muted-foreground">Name</dt>
        <dd class="font-medium text-foreground">{shipment.to.name}</dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Phone</dt>
        <dd class="font-medium text-foreground">{shipment.to.phone}</dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Address</dt>
        <dd class="font-medium text-foreground">
          {shipment.to.street}, {shipment.to.city}, {shipment.to.country}
          {shipment.to.postalCode}
        </dd>
      </div>
    </dl>
  </section>

  <section
    aria-labelledby="package-heading"
    class="bg-muted p-6 rounded-lg shadow border border-border"
  >
    <h2 id="package-heading" class="text-lg font-semibold mb-4 text-foreground">Package Details</h2>
    <dl class="space-y-3">
      <div>
        <dt class="text-sm text-muted-foreground">Shipment Type</dt>
        <dd class="font-medium text-foreground">
          {t(`shipmentTypes.${shipment.service.shipmentType}`)}
        </dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Weight</dt>
        <dd class="font-medium text-foreground">{shipment.package.weight} kg</dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Dimensions (L × W × H)</dt>
        <dd class="font-medium text-foreground">
          {shipment.package.length} × {shipment.package.width} × {shipment.package.height} cm
        </dd>
      </div>
      {#if shipment.package.description}
        <div>
          <dt class="text-sm text-muted-foreground">Item Description</dt>
          <dd class="font-medium text-foreground">{shipment.package.description}</dd>
        </div>
      {/if}
    </dl>
  </section>

  <section
    aria-labelledby="service-heading"
    class="bg-muted p-6 rounded-lg shadow border border-border"
  >
    <h2 id="service-heading" class="text-lg font-semibold mb-4 text-foreground">
      Service &amp; Options
    </h2>
    <dl class="space-y-3">
      <div>
        <dt class="text-sm text-muted-foreground">Service Type</dt>
        <dd class="font-medium text-foreground">{shipment.service.type}</dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Pickup Method</dt>
        <dd class="font-medium text-foreground">
          {shipment.service.pickupMethod === 'home' ? 'Home Pickup' : 'Drop Off at Postal Office'}
        </dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Additional Options</dt>
        <dd class="font-medium text-foreground">
          {#if options.length === 0}
            <span class="text-muted-foreground">No additional options selected</span>
          {:else}
            <ul class="list-disc pl-5">
              {#each options as option (option.label)}
                <li>{option.label}</li>
              {/each}
            </ul>
          {/if}
        </dd>
      </div>
    </dl>
  </section>
</div>

<section
  aria-labelledby="cost-heading"
  class="bg-muted p-6 rounded-lg shadow border border-border"
>
  <h2 id="cost-heading" class="text-lg font-semibold mb-4 text-foreground">Cost Details</h2>
  <dl class="space-y-2">
    <div class="flex justify-between">
      <dt class="text-muted-foreground">Base Shipping Cost</dt>
      <dd class="text-foreground">${shipment.rate.base.toFixed(2)}</dd>
    </div>
    {#each costLines as line (line.label)}
      <div class="flex justify-between">
        <dt class="text-muted-foreground">{line.label}</dt>
        <dd class="text-foreground">${line.value.toFixed(2)}</dd>
      </div>
    {/each}
    <div class="flex justify-between pt-3 border-t border-border">
      <dt class="text-lg font-semibold text-foreground">Total Cost</dt>
      <dd class="text-lg font-bold text-primary">${shipment.rate.total.toFixed(2)}</dd>
    </div>
  </dl>
</section>
