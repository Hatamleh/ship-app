<script lang="ts">
  import '../app.css'
  import { page } from '$app/state'
  import { goto, invalidateAll } from '$app/navigation'
  import ChatDrawer from '$lib/components/agent/ChatDrawer.svelte'
  import { t } from '$lib/translations'
  import type { LayoutData } from './$types'

  let { data, children }: { data: LayoutData; children: any } = $props()

  const PUBLIC_ROUTES = ['/login', '/register']
  const isPublicRoute = $derived(PUBLIC_ROUTES.includes(page.url.pathname))

  let loggingOut = $state(false)

  const navItems = [
    { name: t('nav.createShipment'), href: '/' },
    { name: t('nav.myShipments'), href: '/shipments' },
    { name: 'Assistant', href: '/assistant' },
  ]

  async function logout() {
    loggingOut = true
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      await invalidateAll()
      await goto('/login')
    } finally {
      loggingOut = false
    }
  }
</script>

{#if isPublicRoute || !data.user}
  {@render children()}
{:else}
  <div class="flex h-screen bg-background">
    <aside class="w-64 bg-muted shadow-lg flex flex-col border-r border-border">
      <div class="p-6 border-b border-border">
        <div class="flex items-center gap-2">
          <svg
            class="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span class="text-xl font-bold text-foreground">My Shipments</span>
        </div>
      </div>

      <div class="p-6 border-b border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <span class="text-primary font-semibold text-sm" aria-hidden="true">
              {data.user.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-foreground truncate">{data.user.fullName}</p>
            <p class="text-xs text-muted-foreground truncate">{data.user.email}</p>
          </div>
        </div>
      </div>

      <nav aria-label="Main" class="flex-1 p-4 space-y-2">
        {#each navItems as item (item.href)}
          {@const isActive = page.url.pathname === item.href}
          <a
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive
              ? 'bg-primary/20 text-primary font-medium'
              : 'text-muted-foreground hover:bg-ever-surface'}"
          >
            {item.name}
          </a>
        {/each}
      </nav>

      <div class="p-4 border-t border-border">
        <button
          type="button"
          onclick={logout}
          disabled={loggingOut}
          class="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-ever-surface rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loggingOut ? t('common.loading') : t('nav.logout')}
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto bg-background bg-grid-fade">
      <div class="p-8">
        {@render children()}
      </div>
    </main>

    <ChatDrawer />
  </div>
{/if}
