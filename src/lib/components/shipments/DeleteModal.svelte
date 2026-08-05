<script lang="ts">
  import { Trash2 } from 'lucide-svelte'

  let {
    open = false,
    shipmentId = null,
    onConfirm,
    onCancel,
  }: {
    open?: boolean
    shipmentId?: number | null
    onConfirm: () => void
    onCancel: () => void
  } = $props()

  let confirmButton = $state<HTMLButtonElement | null>(null)

  // Move focus into the dialog when it opens, so keyboard users are not left
  // behind on the trigger and Escape has something to close.
  $effect(() => {
    if (open) confirmButton?.focus()
  })
</script>

<svelte:window
  onkeydown={(e) => {
    if (open && e.key === 'Escape') onCancel()
  }}
/>

{#if open}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-description"
      class="bg-muted rounded-lg shadow-xl max-w-md w-full mx-4 border border-border"
    >
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="flex-shrink-0 w-12 h-12 bg-nord-aurora-red/20 rounded-full flex items-center justify-center"
          >
            <Trash2 class="w-6 h-6 text-destructive" aria-hidden="true" />
          </div>
          <div>
            <h2 id="delete-title" class="text-lg font-semibold text-foreground">Delete Shipment</h2>
            <p class="text-sm text-muted-foreground">Shipment #{shipmentId}</p>
          </div>
        </div>
        <p id="delete-description" class="text-muted-foreground mb-6">
          Are you sure you want to delete this shipment? This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            onclick={onCancel}
            class="px-4 py-2 text-sm font-medium text-muted-foreground bg-nord-polar-2 border border-border rounded-md hover:bg-nord-polar-3 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            bind:this={confirmButton}
            onclick={onConfirm}
            class="px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:bg-nord-aurora-red/80 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
