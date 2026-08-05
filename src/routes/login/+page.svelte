<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation'
  import { t } from '$lib/translations'

  let email = $state('')
  let password = $state('')
  let loading = $state(false)
  let errorMessage = $state<string | null>(null)

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    errorMessage = null

    if (!email || !password) {
      errorMessage = t('errors.required')
      return
    }

    loading = true
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        errorMessage = data.error || t('errors.loginFailed')
        return
      }

      // Re-run the layout load so the sidebar picks up the new session.
      await invalidateAll()
      await goto('/')
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : t('errors.loginFailed')
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Log In - My Shipments</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <img src="/ship-logo.svg" alt="ShipApp" class="mx-auto h-14 w-14" />
      <h1 class="mt-6 text-center text-3xl font-extrabold text-foreground font-display">
        {t('auth.loginTitle')}
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

      <div class="surface p-6 space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-muted-foreground">
            {t('auth.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            placeholder={t('placeholders.enterEmail')}
            class="field mt-3"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-muted-foreground">
            {t('auth.password')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            bind:value={password}
            placeholder={t('placeholders.enterPassword')}
            class="field mt-3"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn btn-primary w-full"
      >
        {loading ? t('common.loading') : t('auth.login')}
      </button>
    </form>

    <p class="text-center text-sm text-muted-foreground">
      {t('auth.dontHaveAccount')}
      <a href="/register" class="font-medium text-primary hover:text-primary-hover">
        {t('auth.registerHere')}
      </a>
    </p>
  </div>
</div>
