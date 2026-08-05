<script lang="ts">
  import User from 'lucide-svelte/icons/user'
  import Users from 'lucide-svelte/icons/users'
  import Package from 'lucide-svelte/icons/package'
  import CheckCircle from 'lucide-svelte/icons/check-circle'
  import type { CardRules, FieldRule } from '$lib/types'
  import { t } from '$lib/translations'

  /**
   * Renders a form card from a rules payload served by /api/rules/*.
   *
   * Accessibility, since there are no test ids to fall back on:
   * - every control has a real <label for>, so getByLabel works
   * - required fields use aria-required plus a visible asterisk with an
   *   accessible "required" text alternative
   * - errors are wired with aria-describedby and announced via role="alert",
   *   and can be found with getByRole('alert')
   * - the card is a <fieldset> with a <legend>, so getByRole('group', { name })
   *   scopes queries to one card
   */
  let {
    rules = null,
    formData,
    errors,
    onChange,
    onBlur,
    disabled = false,
    shipmentType,
    cardTitle,
  }: {
    rules?: CardRules | null
    formData: Record<string, any>
    errors: Record<string, string>
    onChange: (name: string, value: any) => void
    onBlur?: (name: string) => void
    disabled?: boolean
    shipmentType?: string | null
    cardTitle?: string
  } = $props()

  const title = $derived(rules?.title || cardTitle || 'Loading...')

  const fieldEntries = $derived(
    rules ? Object.entries(rules.fields).filter(([, f]) => (f as FieldRule).visible !== false) : []
  )

  function inputClass(hasError: boolean, isDisabled: boolean) {
    return [
      'w-full px-3 py-2 border rounded-md bg-nord-polar-2 text-foreground',
      'focus:outline-none focus:ring-2 focus:ring-primary',
      hasError ? 'border-destructive' : 'border-border',
      isDisabled ? 'bg-nord-polar-3 cursor-not-allowed opacity-50' : '',
    ].join(' ')
  }

  function isFullWidth(name: string) {
    return name.includes('Street') || name.includes('Country') || name.includes('Description')
  }
</script>

<fieldset
  class="bg-muted p-6 rounded-lg shadow border border-border {disabled || !rules
    ? 'opacity-50'
    : ''}"
>
  <div class="flex items-center justify-between mb-4">
    <legend class="flex items-center gap-2 text-xl font-semibold text-primary">
      {#if title.toLowerCase().includes('sender')}
        <User class="w-5 h-5" aria-hidden="true" />
      {:else if title.toLowerCase().includes('receiver')}
        <Users class="w-5 h-5" aria-hidden="true" />
      {:else if title.toLowerCase().includes('package')}
        <Package class="w-5 h-5" aria-hidden="true" />
      {:else}
        <CheckCircle class="w-5 h-5" aria-hidden="true" />
      {/if}
      {title}
    </legend>
    {#if shipmentType}
      <span class="text-xs bg-nord-frost-1/20 text-primary px-2 py-1 rounded">
        {shipmentType}
      </span>
    {/if}
  </div>

  {#if !rules}
    <p class="text-sm text-muted-foreground/70 text-center py-4">
      {disabled ? t('form.completePreviousSection') : t('form.loadingCard')}
    </p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each fieldEntries as [name, field] (name)}
        {@const rule = field as FieldRule}
        {@const error = errors[name]}
        {@const fieldDisabled = disabled || rule.disabled || false}
        {@const value = formData[name] ?? ''}

        <div class={isFullWidth(name) ? 'md:col-span-2' : ''}>
          {#if rule.type === 'checkbox'}
            <div class="flex items-center">
              <input
                type="checkbox"
                id={name}
                {name}
                checked={!!formData[name]}
                onchange={(e) => onChange(name, e.currentTarget.checked)}
                disabled={fieldDisabled}
                class="h-4 w-4 text-primary border-border rounded focus:ring-primary disabled:cursor-not-allowed"
              />
              <label
                for={name}
                class="ml-2 text-sm {fieldDisabled
                  ? 'text-muted-foreground/50'
                  : 'text-muted-foreground'}"
              >
                {rule.label}
              </label>
            </div>
          {:else}
            <label for={name} class="block text-sm font-medium text-muted-foreground mb-3">
              {rule.label}
              {#if rule.required}
                <span class="text-destructive" aria-hidden="true">*</span>
                <span class="sr-only">(required)</span>
              {/if}
              {#if rule.type === 'number' && rule.validation?.max}
                <span class="ml-2 text-xs text-muted-foreground/70">
                  (Max: {rule.validation.max})
                </span>
              {/if}
            </label>

            {#if rule.type === 'select'}
              <select
                id={name}
                {name}
                {value}
                onchange={(e) => onChange(name, e.currentTarget.value)}
                onblur={() => onBlur?.(name)}
                disabled={fieldDisabled}
                class={inputClass(!!error, fieldDisabled)}
                aria-required={rule.required || undefined}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${name}-error` : undefined}
              >
                <option value="">{rule.placeholder || 'Select...'}</option>
                {#each rule.options ?? [] as option (option.value)}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            {:else if rule.type === 'number'}
              <input
                type="number"
                id={name}
                {name}
                {value}
                oninput={(e) => onChange(name, e.currentTarget.value)}
                onblur={() => onBlur?.(name)}
                placeholder={rule.placeholder}
                min={rule.validation?.min}
                max={rule.validation?.max}
                step="0.1"
                disabled={fieldDisabled}
                class={inputClass(!!error, fieldDisabled)}
                aria-required={rule.required || undefined}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${name}-error` : undefined}
              />
            {:else}
              <input
                type="text"
                id={name}
                {name}
                {value}
                oninput={(e) => onChange(name, e.currentTarget.value)}
                onblur={() => onBlur?.(name)}
                placeholder={rule.placeholder}
                disabled={fieldDisabled}
                class={inputClass(!!error, fieldDisabled)}
                aria-required={rule.required || undefined}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${name}-error` : undefined}
              />
            {/if}

            {#if error}
              <p id="{name}-error" role="alert" class="mt-1 text-sm text-destructive">
                {error}
              </p>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</fieldset>
