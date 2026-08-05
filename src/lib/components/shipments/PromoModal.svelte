<script lang="ts">
  import Sparkles from 'lucide-svelte/icons/sparkles'

  /**
   * A promo overlay that appears RANDOMLY on the shipments page.
   *
   * It is intentionally unpredictable — used to teach Playwright's
   * addLocatorHandler, which auto-dismisses overlays whenever they pop up.
   * Locate it with getByRole('dialog', { name: 'Special Offer!' }).
   */
  let show = $state(false)

  $effect(() => {
    // ~50% of visits, after a short delay — you cannot predict it.
    const timer = setTimeout(() => {
      if (Math.random() < 0.5) show = true
    }, 1500)
    return () => clearTimeout(timer)
  })
</script>

{#if show}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      class="bg-muted rounded-lg shadow-xl max-w-md w-full mx-4 border border-border p-8 text-center"
    >
      <div
        class="flex-shrink-0 w-12 h-12 mx-auto mb-4 bg-nord-frost-1/20 rounded-full flex items-center justify-center"
      >
        <Sparkles class="w-6 h-6 text-primary" aria-hidden="true" />
      </div>
      <h2 id="promo-title" class="text-xl font-bold text-foreground mb-2">Special Offer!</h2>
      <p class="text-muted-foreground mb-6">Get 20% off express shipping this week only!</p>
      <button
        type="button"
        onclick={() => (show = false)}
        class="px-6 py-2 text-sm font-medium text-nord-polar-0 bg-primary rounded-md hover:bg-nord-frost-3 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
{/if}
