<script lang="ts">
  import Bot from 'lucide-svelte/icons/bot'
  import Send from 'lucide-svelte/icons/send'
  import X from 'lucide-svelte/icons/x'
  import Wrench from 'lucide-svelte/icons/wrench'
  import Markdown from './Markdown.svelte'
  import { t } from '$lib/translations'

  interface Message {
    role: 'user' | 'assistant'
    content: string
    toolCalls?: { name: string; args: Record<string, unknown> }[]
    latencyMs?: number
  }

  /**
   * Floating assistant panel, available on every authenticated page.
   *
   * Locators are accessibility-first: the toggle and send controls have
   * accessible names, the panel is a labelled dialog, and the transcript is a
   * log region so new messages are announced and can be waited on.
   */
  let open = $state(false)
  let input = $state('')
  let messages = $state<Message[]>([])
  let loading = $state(false)
  let errorMessage = $state<string | null>(null)
  let scroller = $state<HTMLDivElement | null>(null)

  $effect(() => {
    // Re-runs whenever the transcript or loading flag changes.
    void messages.length
    void loading
    scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' })
  })

  async function send() {
    const question = input.trim()
    if (!question || loading) return

    input = ''
    errorMessage = null
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    messages = [...messages, { role: 'user', content: question }]
    loading = true

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, history }),
      })

      const data = await response.json()

      if (!response.ok) {
        errorMessage = data.error || t('ai.failed')
        return
      }

      messages = [
        ...messages,
        {
          role: 'assistant',
          content: data.reply,
          toolCalls: data.toolCalls,
          latencyMs: data.latencyMs,
        },
      ]
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : t('ai.failed')
    } finally {
      loading = false
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }
</script>

{#if !open}
  <button
    type="button"
    onclick={() => (open = true)}
    aria-label={t('ai.openChat')}
    class="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-nord-polar-0 shadow-lg flex items-center justify-center hover:bg-nord-frost-3 transition-colors"
  >
    <Bot class="w-6 h-6" aria-hidden="true" />
  </button>
{:else}
  <div
    role="dialog"
    aria-label={t('ai.title')}
    class="fixed bottom-6 right-6 z-40 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-muted border border-border rounded-lg shadow-xl flex flex-col"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <h2 class="flex items-center gap-2 font-semibold text-foreground">
        <Bot class="w-5 h-5 text-primary" aria-hidden="true" />
        {t('ai.title')}
      </h2>
      <button
        type="button"
        onclick={() => (open = false)}
        aria-label={t('ai.closeChat')}
        class="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X class="w-5 h-5" aria-hidden="true" />
      </button>
    </div>

    <div
      bind:this={scroller}
      role="log"
      aria-live="polite"
      aria-label="Conversation"
      class="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {#if messages.length === 0 && !loading}
        <p class="text-sm text-muted-foreground">{t('ai.emptyState')}</p>
      {/if}

      {#each messages as message, i (i)}
        <div class={message.role === 'user' ? 'text-right' : 'text-left'}>
          <!--
            w-fit shrinks the bubble to its content while max-w-[90%] gives it a
            definite bound, which is what lets an inner scroller actually scroll
            instead of pushing the panel wider.
          -->
          <div
            class="w-fit max-w-[90%] min-w-0 px-3 py-2 rounded-lg text-sm text-left {message.role ===
            'user'
              ? 'ml-auto bg-primary text-nord-polar-0 whitespace-pre-wrap'
              : 'bg-nord-polar-2 text-foreground'}"
          >
            {#if message.role === 'user'}
              {message.content}
            {:else}
              <Markdown content={message.content} compact />
            {/if}
          </div>

          {#if message.toolCalls?.length}
            <!-- Which tools ran. Assert on these rather than only on the prose. -->
            <ul aria-label="Tools used" class="mt-2 flex flex-wrap gap-1 list-none">
              {#each message.toolCalls as call, j (j)}
                <li
                  title={JSON.stringify(call.args)}
                  class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-nord-frost-1/20 text-primary"
                >
                  <Wrench class="w-3 h-3" aria-hidden="true" />
                  {call.name}
                </li>
              {/each}
            </ul>
          {/if}

          {#if message.latencyMs !== undefined}
            <p class="mt-1 text-xs text-muted-foreground">{message.latencyMs} ms</p>
          {/if}
        </div>
      {/each}

      {#if loading}
        <p role="status" class="text-sm text-muted-foreground">{t('ai.thinking')}</p>
      {/if}

      {#if errorMessage}
        <p
          role="alert"
          class="text-sm text-destructive bg-nord-aurora-red/20 border border-destructive rounded px-3 py-2"
        >
          {errorMessage}
        </p>
      {/if}
    </div>

    <div class="p-3 border-t border-border flex items-end gap-2">
      <label class="sr-only" for="agent-message">{t('ai.placeholder')}</label>
      <textarea
        id="agent-message"
        bind:value={input}
        onkeydown={onKeyDown}
        rows="2"
        placeholder={t('ai.placeholder')}
        disabled={loading}
        class="flex-1 resize-none px-3 py-2 text-sm bg-nord-polar-2 text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      ></textarea>
      <button
        type="button"
        onclick={send}
        disabled={loading || input.trim() === ''}
        aria-label={t('ai.send')}
        class="px-3 py-2 bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send class="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  </div>
{/if}
