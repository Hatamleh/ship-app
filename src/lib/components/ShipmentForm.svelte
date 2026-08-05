<script lang="ts">
  import { untrack } from 'svelte'
  import { Save, CheckCircle } from 'lucide-svelte'
  import SenderCard from './cards/SenderCard.svelte'
  import DynamicCard from './DynamicCard.svelte'
  import ServiceSelectionCard from './cards/ServiceSelectionCard.svelte'
  import AdditionalOptionsCard from './cards/AdditionalOptionsCard.svelte'
  import RateCard from './cards/RateCard.svelte'
  import { ShipmentForm } from '$lib/state/shipment-form.svelte'
  import { t } from '$lib/translations'
  import type { User } from '$lib/types'

  let {
    user,
    editId = null,
    repeatId = null,
  }: { user: User | null; editId?: string | null; repeatId?: string | null } = $props()

  // Intentionally reads the props once: the page wraps this component in a
  // {#key} block, so switching between create / edit / repeat rebuilds the
  // whole form rather than mutating the existing one.
  const state = untrack(() => new ShipmentForm(user, editId, repeatId))
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    state.submit(false)
  }}
  class="max-w-7xl mx-auto"
>
  {#if state.submitError}
    <div
      role="alert"
      class="bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded mb-8"
    >
      {state.submitError}
    </div>
  {/if}

  {#if state.errors.general}
    <div
      role="alert"
      class="bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded mb-8"
    >
      {state.errors.general}
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
    <!-- Addresses and package -->
    <div class="lg:col-span-3 space-y-6">
      <SenderCard formData={state.form} />

      <DynamicCard
        rules={state.receiverRules}
        formData={state.form}
        errors={state.errors}
        onChange={(n, v) => state.setField(n, v)}
        onBlur={(n) => state.blurField(n)}
        disabled={!state.senderCompleted}
        cardTitle={t('form.receiverInformation')}
      />

      <DynamicCard
        rules={state.packageRules}
        formData={state.form}
        errors={state.errors}
        onChange={(n, v) => state.setField(n, v)}
        onBlur={(n) => state.blurField(n)}
        disabled={!state.receiverCompleted}
        shipmentType={state.shipmentType}
        cardTitle={t('form.packageDetails')}
      />
    </div>

    <!-- Service, options and price -->
    <div class="lg:col-span-2 space-y-6">
      <ServiceSelectionCard
        serviceRules={state.serviceRules}
        selectedService={state.selectedService}
        onServiceSelect={(s) => state.selectService(s)}
        disabled={!state.packageCompleted}
      />

      {#if state.errors.service}
        <p role="alert" class="text-sm text-destructive">{state.errors.service}</p>
      {/if}

      <AdditionalOptionsCard
        rules={state.additionalOptionsRules}
        formData={state.form}
        onChange={(n, v) => state.setField(n, v)}
        disabled={!state.packageCompleted}
      />

      <RateCard
        calculatedPrice={state.calculatedPrice}
        rateBreakdown={state.rateBreakdown}
        disabled={!state.packageCompleted}
      />
    </div>
  </div>

  <div class="flex justify-end gap-4">
    <button
      type="button"
      onclick={() => state.submit(true)}
      disabled={state.loading}
      class="flex items-center gap-2 px-6 py-3 border border-border text-muted-foreground rounded-md hover:bg-nord-polar-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Save class="w-4 h-4" aria-hidden="true" />
      {state.loading ? t('form.saving') : t('form.saveDraft')}
    </button>

    <button
      type="submit"
      disabled={state.loading}
      class="flex items-center gap-2 px-6 py-3 bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <CheckCircle class="w-4 h-4" aria-hidden="true" />
      {state.loading ? t('form.finalizing') : t('form.finalizeShipment')}
    </button>
  </div>
</form>
