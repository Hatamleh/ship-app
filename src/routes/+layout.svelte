<script lang="ts">
  import '../app.css'
  import { page } from '$app/state'
  import { goto, invalidateAll } from '$app/navigation'
  import ChatDrawer from '$lib/components/agent/ChatDrawer.svelte'
  import QacartMark from '$lib/components/QacartMark.svelte'
  import { t } from '$lib/translations'
  import type { LayoutData } from './$types'

  let { data, children }: { data: LayoutData; children: any } = $props()

  const PUBLIC_ROUTES = ['/login', '/register']
  const isPublicRoute = $derived(PUBLIC_ROUTES.includes(page.url.pathname))

  let loggingOut = $state(false)

  /**
   * The assistant is only useful where there is a shipment in front of you:
   * the create/edit form (/) and a shipment's detail page. It is deliberately
   * absent from the list and auth pages.
   */
  const showAssistant = $derived(
    page.url.pathname === '/' || /^\/shipments\/[^/]+$/.test(page.url.pathname)
  )

  const navItems = [
    { name: t('nav.createShipment'), href: '/' },
    { name: t('nav.myShipments'), href: '/shipments' },
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
        <!-- QAcart monogram, same mark the site uses. It inherits currentColor,
             so it picks up the accent on hover like the site's nav brand. -->
        <a
          href="/"
          aria-label="QAcart — ShipTest home"
          class="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
        >
          <span class="w-8 shrink-0">
            <QacartMark />
          </span>
          <span class="font-display text-lg font-bold leading-tight">
            Ship<span class="grad">Test</span>
          </span>
        </a>
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

    {#if showAssistant}
      <ChatDrawer />
    {/if}
  </div>
{/if}
