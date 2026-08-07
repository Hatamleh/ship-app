<script lang="ts">
  import MoreVertical from 'lucide-svelte/icons/more-vertical'
  import Eye from 'lucide-svelte/icons/eye'
  import Pencil from 'lucide-svelte/icons/pencil'
  import FileCheck from 'lucide-svelte/icons/file-check'
  import Trash2 from 'lucide-svelte/icons/trash-2'
  import Repeat from 'lucide-svelte/icons/repeat'
  import type { Shipment } from '$lib/types'
  import { t } from '$lib/translations'

  let {
    shipments,
    onDelete,
    onFinalize,
  }: {
    shipments: Shipment[]
    onDelete: (id: number) => void
    onFinalize: (id: number) => void
  } = $props()

  /**
   * Which row's action menu is open, and where to draw it.
   *
   * The menu cannot be a positioned child of the row: the table wrapper needs
   * overflow-x for wide tables, and once overflow-x is auto the spec computes
   * overflow-y to auto as well — so the container clips the dropdown. The menu
   * is therefore position: fixed, measured from the trigger button.
   */
  let openMenuId = $state<number | null>(null)
  let menuPos = $state({ top: 0, left: 0 })

  const MENU_WIDTH = 192 // w-48
  const MENU_MAX_HEIGHT = 220

  function toggleMenu(id: number, event: MouseEvent) {
    if (openMenuId === id) {
      openMenuId = null
      return
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()

    // Flip above the button when there is not enough room below, and keep the
    // menu inside the viewport horizontally.
    const opensUpward = rect.bottom + MENU_MAX_HEIGHT > window.innerHeight
    menuPos = {
      top: opensUpward ? rect.top - MENU_MAX_HEIGHT - 4 : rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8),
    }
    openMenuId = id
  }

  function label(shipment: Shipment) {
    return shipment.status === 'draft' ? `draft shipment ${shipment.id}` : shipment.trackingNumber
  }
</script>

<svelte:window
  onclick={(e) => {
    // Close on any click that did not land inside a menu container.
    if (!(e.target as HTMLElement)?.closest('[data-menu-root]')) openMenuId = null
  }}
  onkeydown={(e) => {
    if (e.key === 'Escape') openMenuId = null
  }}
  onresize={() => (openMenuId = null)}
/>

<!-- A fixed menu would otherwise stay put while the page moves under it. -->
<svelte:document onscrollcapture={() => (openMenuId = null)} />

{#if shipments.length === 0}
  <div class="text-center py-12">
    <h2 class="mt-2 text-sm font-medium text-foreground">{t('table.noShipments')}</h2>
    <p class="mt-1 text-sm text-muted-foreground">{t('table.createFirstShipment')}</p>
    <div class="mt-6">
      <a
        href="/"
        class="btn btn-primary text-sm"
      >
        + {t('table.createShipment')}
      </a>
    </div>
  </div>
{:else}
  <div class="surface overflow-x-auto">
    <table class="min-w-full divide-y divide-border">
      <caption class="sr-only">Your shipments</caption>
      <thead class="bg-ever-surface">
        <tr>
          <th scope="col" class="px-4 py-3 w-16">
            <span class="sr-only">Actions</span>
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {t('table.trackingNumber')}
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Sender
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Receiver
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Destination
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Type
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            {t('table.status')}
          </th>
        </tr>
      </thead>
      <tbody class="bg-muted divide-y divide-border">
        {#each shipments as shipment (shipment.id)}
          <tr class="hover:bg-ever-surface">
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium" data-menu-root>
              <button
                type="button"
                onclick={(e) => toggleMenu(shipment.id, e)}
                aria-label="Actions for {label(shipment)}"
                aria-haspopup="menu"
                aria-expanded={openMenuId === shipment.id}
                class="text-muted-foreground hover:text-primary p-1 rounded hover:bg-ever-surface"
              >
                <MoreVertical class="w-5 h-5" aria-hidden="true" />
              </button>

              {#if openMenuId === shipment.id}
                <div
                  role="menu"
                  aria-label="Actions for {label(shipment)}"
                  class="fixed z-50 w-48 surface shadow-glow py-1 overflow-hidden"
                  style="top: {menuPos.top}px; left: {menuPos.left}px;"
                >
                  <a
                    role="menuitem"
                    href="/shipments/{shipment.id}"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    <Eye class="w-4 h-4" aria-hidden="true" />
                    View
                  </a>

                  {#if shipment.status === 'draft'}
                    <a
                      role="menuitem"
                      href="/?edit={shipment.id}"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <Pencil class="w-4 h-4" aria-hidden="true" />
                      Edit
                    </a>
                    <button
                      role="menuitem"
                      type="button"
                      onclick={() => {
                        openMenuId = null
                        onFinalize(shipment.id)
                      }}
                      class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <FileCheck class="w-4 h-4" aria-hidden="true" />
                      Finalize Shipment
                    </button>
                  {:else}
                    <a
                      role="menuitem"
                      href="/?repeat={shipment.id}"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <Repeat class="w-4 h-4" aria-hidden="true" />
                      Repeat
                    </a>
                  {/if}

                  <button
                    role="menuitem"
                    type="button"
                    onclick={() => {
                      openMenuId = null
                      onDelete(shipment.id)
                    }}
                    class="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              {/if}
            </td>

            <th scope="row" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-left">
              {shipment.status === 'draft' ? '-' : shipment.trackingNumber}
            </th>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{shipment.from.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">{shipment.to.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {shipment.to.city}, {shipment.to.country}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
              {t(`shipmentTypes.${shipment.service.shipmentType}`)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {#if shipment.status === 'draft'}
                <span
                  class="tag"
                >
                  {t('status.Draft')}
                </span>
              {:else}
                <span
                  class="tag border-premium text-premium"
                >
                  Finalized
                </span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
