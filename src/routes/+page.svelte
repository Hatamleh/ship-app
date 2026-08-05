<script lang="ts">
  import { page } from '$app/state'
  import ShipmentForm from '$lib/components/ShipmentForm.svelte'
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()

  const editId = $derived(page.url.searchParams.get('edit'))
  const repeatId = $derived(page.url.searchParams.get('repeat'))

  const heading = $derived(
    editId ? 'Edit Shipment' : repeatId ? 'Repeat Shipment' : 'Create a New Shipment'
  )

  const description = $derived(
    editId
      ? 'Update the shipment details below'
      : repeatId
        ? 'Review and edit the shipment details below'
        : 'Fill in the shipment details below'
  )
</script>

<svelte:head>
  <title>{heading} - My Shipments</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold text-foreground mb-2">{heading}</h1>
  <p class="text-muted-foreground">{description}</p>
</div>

<!--
  Keyed so switching between create / edit / repeat rebuilds the form state
  rather than trying to reconcile a different shipment into the existing one.
-->
{#key `${editId}-${repeatId}`}
  <ShipmentForm user={data.user} {editId} {repeatId} />
{/key}
