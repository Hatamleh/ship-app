<script lang="ts">
  import Settings from 'lucide-svelte/icons/settings'
  import { t } from '$lib/translations'

  let {
    rules = null,
    formData,
    onChange,
    disabled = false,
  }: {
    rules?: any
    formData: Record<string, any>
    onChange: (name: string, value: any) => void
    disabled?: boolean
  } = $props()

  // The rules payload decides which options exist and which are forced.
  const checkboxes = $derived(
    (['signatureRequired', 'containsLiquid', 'insurance', 'packaging'] as const)
      .map((name) => ({ name, field: rules?.fields?.[name] }))
      .filter((entry) => entry.field)
  )

  const pickupField = $derived(rules?.fields?.pickupMethod)
</script>

<fieldset
  class="bg-muted p-6 rounded-lg shadow border border-border {disabled || !rules
    ? 'opacity-50'
    : ''}"
>
  <legend class="flex items-center gap-2 text-xl font-semibold text-primary mb-4">
    <Settings class="w-5 h-5" aria-hidden="true" />
    {rules?.title || t('form.additionalOptions')}
  </legend>

  {#if !rules}
    <p class="text-sm text-muted-foreground/70 text-center py-4">
      {disabled ? t('form.completePreviousSection') : t('form.loadingOptions')}
    </p>
  {:else}
    <div class="space-y-3">
      {#each checkboxes as { name, field } (name)}
        {@const isDisabled = disabled || field.disabled}
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            id={name}
            checked={!!formData[name]}
            onchange={(e) => onChange(name, e.currentTarget.checked)}
            disabled={isDisabled}
            aria-describedby={field.disabled ? `${name}-forced` : undefined}
            class="h-4 w-4 text-primary border-border rounded focus:ring-primary disabled:cursor-not-allowed"
          />
          <label
            for={name}
            class="text-sm {isDisabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}"
          >
            {field.label}
          </label>
          {#if field.disabled}
            <!-- Explains why the control cannot be changed, e.g. shipping to Jordan -->
            <span id="{name}-forced" class="text-xs text-primary">Required for this destination</span>
          {/if}
        </div>
      {/each}

      {#if pickupField}
        <fieldset class="pt-3 border-t border-border">
          <legend class="block text-sm font-medium text-muted-foreground mb-3">
            {pickupField.label}
          </legend>
          <div class="space-y-2">
            {#each pickupField.options ?? [] as option (option.value)}
              {@const optionDisabled =
                disabled || (pickupField.disabledValues ?? []).includes(option.value)}
              <div class="flex items-center gap-3">
                <input
                  type="radio"
                  id="pickup-{option.value}"
                  name="pickupMethod"
                  value={option.value}
                  checked={formData.pickupMethod === option.value}
                  onchange={(e) => onChange('pickupMethod', e.currentTarget.value)}
                  disabled={optionDisabled}
                  aria-describedby={optionDisabled ? `pickup-${option.value}-why` : undefined}
                  class="h-4 w-4 text-primary border-border focus:ring-primary disabled:cursor-not-allowed"
                />
                <label
                  for="pickup-{option.value}"
                  class="text-sm {optionDisabled
                    ? 'text-muted-foreground/50'
                    : 'text-muted-foreground'}"
                >
                  {option.label}
                </label>
                {#if optionDisabled}
                  <span id="pickup-{option.value}-why" class="text-xs text-muted-foreground/70">
                    Unavailable for this package
                  </span>
                {/if}
              </div>
            {/each}
          </div>
        </fieldset>
      {/if}
    </div>
  {/if}
</fieldset>
