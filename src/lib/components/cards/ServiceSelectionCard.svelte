<script lang="ts">
  import Truck from 'lucide-svelte/icons/truck'
  import type { ServiceOption } from '$lib/types'
  import { t } from '$lib/translations'

  let {
    serviceRules = null,
    selectedService = null,
    onServiceSelect,
    disabled = false,
  }: {
    serviceRules?: any
    selectedService?: ServiceOption | null
    onServiceSelect: (service: ServiceOption) => void
    disabled?: boolean
  } = $props()
</script>

<!--
  Picking a service is a single-choice question, so this is a real radio group
  rather than a row of buttons. Tests can use
  getByRole('radio', { name: /Domestic Express/ }) and assert .toBeChecked().
-->
<fieldset
  class="bg-muted p-6 rounded-lg shadow border border-border {disabled || !serviceRules
    ? 'opacity-50'
    : ''}"
>
  <legend class="flex items-center gap-2 text-xl font-semibold text-primary mb-4">
    <Truck class="w-5 h-5" aria-hidden="true" />
    {t('form.serviceSelection')}
  </legend>

  {#if !serviceRules}
    <p class="text-sm text-muted-foreground/70 text-center py-4">
      {disabled ? t('form.completePreviousSection') : t('form.loadingServices')}
    </p>
  {:else if serviceRules.services?.length === 0}
    <p role="status" class="text-sm text-muted-foreground/70 text-center py-4">
      No service can carry this package. Reduce the weight to see options.
    </p>
  {:else}
    <div class="space-y-3">
      {#each serviceRules.services ?? [] as service (service.id)}
        {@const checked = selectedService?.id === service.id}
        <label
          class="block p-4 border-2 rounded-lg transition-all cursor-pointer
            {checked ? 'border-primary bg-nord-frost-1/20' : 'border-border hover:border-primary/50'}
            {disabled ? 'cursor-not-allowed' : ''}"
        >
          <div class="flex items-start gap-3">
            <input
              type="radio"
              name="serviceType"
              value={service.id}
              {checked}
              {disabled}
              onchange={() => onServiceSelect(service)}
              class="mt-1 h-4 w-4 text-primary border-border focus:ring-primary disabled:cursor-not-allowed"
            />
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <span class="font-semibold text-foreground">{service.name}</span>
                <span class="text-sm text-muted-foreground">
                  {service.deliveryDays}
                  {service.deliveryDays === 1 ? t('rate.day') : t('rate.days')}
                </span>
              </div>
              <p class="text-sm text-muted-foreground mb-2">{service.description}</p>
              <div class="text-xs text-muted-foreground/70">
                {t('rate.base')}: ${service.basePrice} + ${service.pricePerKg}/kg
              </div>
            </div>
          </div>
        </label>
      {/each}
    </div>
  {/if}
</fieldset>
