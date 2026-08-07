<script lang="ts">
  import { untrack } from 'svelte'
  import Save from 'lucide-svelte/icons/save'
  import CheckCircle from 'lucide-svelte/icons/check-circle'
  import SenderCard from './cards/SenderCard.svelte'
  import DynamicCard from './DynamicCard.svelte'
  import ServiceSelectionCard from './cards/ServiceSelectionCard.svelte'
  import AdditionalOptionsCard from './cards/AdditionalOptionsCard.svelte'
  import RateCard from './cards/RateCard.svelte'
  import { ShipmentForm } from '$lib/state/shipment-form.svelte'
  import { registerForm, unregisterForm } from '$lib/state/form-bridge.svelte'
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

  // Let the assistant panel read this form, and write to it when the user
  // presses Apply on a proposal.
  $effect(() => {
    registerForm(
      () => ({
        values: { ...state.form },
        completed: {
          sender: state.senderCompleted,
          receiver: state.receiverCompleted,
          package: state.packageCompleted,
        },
        errors: { ...state.errors },
        shipmentType: state.shipmentType,
      }),
      (values) => {
        for (const [name, value] of Object.entries(values)) state.setField(name, value)
      }
    )
    return unregisterForm
  })
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
      class="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-8"
    >
      {state.submitError}
    </div>
  {/if}

  {#if state.errors.general}
    <div
      role="alert"
      class="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded mb-8"
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
      class="btn"
    >
      <Save class="w-4 h-4" aria-hidden="true" />
      {state.loading ? t('form.saving') : t('form.saveDraft')}
    </button>

    <button
      type="submit"
      disabled={state.loading}
      class="btn btn-primary"
    >
      <CheckCircle class="w-4 h-4" aria-hidden="true" />
      {state.loading ? t('form.finalizing') : t('form.finalizeShipment')}
    </button>
  </div>
</form>
