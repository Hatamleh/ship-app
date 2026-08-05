<script lang="ts">
  import DollarSign from 'lucide-svelte/icons/dollar-sign'
  import type { RateBreakdown } from '$lib/types'
  import { t } from '$lib/translations'

  let {
    calculatedPrice = null,
    rateBreakdown = null,
    disabled = false,
  }: {
    calculatedPrice?: number | null
    rateBreakdown?: RateBreakdown | null
    disabled?: boolean
  } = $props()

  const lines = $derived(
    rateBreakdown
      ? [
          { label: t('rate.signatureRequired'), value: rateBreakdown.signatureCost },
          { label: t('rate.insurance'), value: rateBreakdown.insuranceCost },
          { label: t('rate.packaging'), value: rateBreakdown.packagingCost },
          { label: t('rate.liquidHandling'), value: rateBreakdown.liquidCost },
        ].filter((line) => line.value > 0)
      : []
  )
</script>

<section
  aria-labelledby="rate-heading"
  class="surface p-6 {disabled || calculatedPrice === null
    ? 'opacity-50'
    : ''}"
>
  <h2 id="rate-heading" class="flex items-center gap-2 text-xl font-semibold text-primary mb-4">
    <DollarSign class="w-5 h-5" aria-hidden="true" />
    {t('form.rate')}
  </h2>

  <div class="space-y-4">
    <!--
      aria-live so the price is announced when it recalculates, and so tests can
      wait on it changing rather than sleeping.
    -->
    <div class="flex justify-between items-center py-3 border-t border-b border-border">
      <span id="total-price-label" class="text-lg font-medium text-muted-foreground">
        {t('rate.totalPrice')}
      </span>
      <output
        aria-labelledby="total-price-label"
        aria-live="polite"
        class="text-2xl font-bold text-primary"
      >
        {calculatedPrice !== null ? `$${calculatedPrice.toFixed(2)}` : '-'}
      </output>
    </div>

    {#if rateBreakdown}
      <dl class="space-y-2 text-sm">
        <div class="flex justify-between text-muted-foreground">
          <dt>{t('rate.baseShippingCost')}</dt>
          <dd>${rateBreakdown.baseCost.toFixed(2)}</dd>
        </div>
        {#each lines as line (line.label)}
          <div class="flex justify-between text-muted-foreground">
            <dt>{line.label}</dt>
            <dd>${line.value.toFixed(2)}</dd>
          </div>
        {/each}
      </dl>
    {/if}

    {#if calculatedPrice === null}
      <p class="text-sm text-muted-foreground/70 text-center py-4">
        {disabled ? t('form.completePreviousSection') : t('form.selectServiceToSeePricing')}
      </p>
    {/if}
  </div>
</section>
