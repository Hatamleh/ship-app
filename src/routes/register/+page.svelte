<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import countriesData from '$lib/rules/countries.json'
  import { t } from '$lib/translations'

  let form = $state({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    country: '',
    city: '',
    street: '',
    postalCode: '',
  })

  let loading = $state(false)
  let errorMessage = $state<string | null>(null)

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    errorMessage = null

    if (form.password !== form.confirmPassword) {
      errorMessage = 'Passwords do not match'
      return
    }

    loading = true
    try {
      const { confirmPassword, ...payload } = form
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        errorMessage = data.error || t('errors.registerFailed')
        return
      }

      await invalidateAll()
      await goto('/')
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : t('errors.registerFailed')
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Sign Up - My Shipments</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl w-full space-y-8">
    <div>
      <img src="/ship-logo.svg" alt="ShipApp" class="mx-auto h-14 w-14" />
      <h1 class="mt-6 text-center text-3xl font-extrabold text-foreground font-display">
        {t('auth.registerTitle')}
      </h1>
    </div>

    <form class="mt-8 space-y-6" onsubmit={submit}>
      {#if errorMessage}
        <div
          role="alert"
          class="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded"
        >
          {errorMessage}
        </div>
      {/if}

      <fieldset class="surface p-6">
        <legend class="text-lg font-semibold mb-4 text-primary">Account Information</legend>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label for="email" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              autocomplete="email"
              required
              bind:value={form.email}
              class="field"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              autocomplete="new-password"
              required
              bind:value={form.password}
              class="field"
            />
          </div>
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-muted-foreground mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              bind:value={form.confirmPassword}
              placeholder="Re-enter your password"
              class="field"
            />
          </div>
        </div>
      </fieldset>

      <fieldset class="surface p-6">
        <legend class="text-lg font-semibold mb-4 text-primary">Personal Information</legend>
        <p class="text-sm text-muted-foreground mb-4">
          This information will be used as your default sender details
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.fullName')}
            </label>
            <input
              id="fullName"
              type="text"
              autocomplete="name"
              required
              bind:value={form.fullName}
              class="field"
            />
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.phone')}
            </label>
            <input
              id="phone"
              type="tel"
              autocomplete="tel"
              required
              bind:value={form.phone}
              class="field"
            />
          </div>
          <div class="md:col-span-2">
            <label for="country" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.country')}
            </label>
            <select
              id="country"
              required
              bind:value={form.country}
              class="field"
            >
              <option value="">{t('placeholders.selectCountry')}</option>
              {#each countriesData.countries as country (country.code)}
                <option value={country.name}>{country.name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="city" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.city')}
            </label>
            <input
              id="city"
              type="text"
              required
              bind:value={form.city}
              class="field"
            />
          </div>
          <div>
            <label for="postalCode" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.postalCode')}
            </label>
            <input
              id="postalCode"
              type="text"
              autocomplete="postal-code"
              required
              bind:value={form.postalCode}
              class="field"
            />
          </div>
          <div class="md:col-span-2">
            <label for="street" class="block text-sm font-medium text-muted-foreground mb-2">
              {t('auth.street')}
            </label>
            <input
              id="street"
              type="text"
              autocomplete="street-address"
              required
              bind:value={form.street}
              class="field"
            />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        class="btn btn-primary w-full"
      >
        {loading ? t('common.loading') : t('auth.register')}
      </button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      {t('auth.alreadyHaveAccount')}
      <a href="/login" class="font-medium text-primary hover:text-primary-hover">
        {t('auth.loginHere')}
      </a>
    </p>
  </div>
</div>
