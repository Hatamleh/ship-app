<script lang="ts">
  import { BookOpen, Search } from 'lucide-svelte'
  import Markdown from '$lib/components/agent/Markdown.svelte'
  import { t } from '$lib/translations'

  interface Source {
    n: number
    source: string
    heading: string
    score: number
  }

  const EXAMPLES = [
    'Can I ship from Saudi Arabia to Iraq?',
    'What is the maximum weight for an IntraGulf shipment?',
    'When is a signature mandatory?',
    'Why is home pickup sometimes unavailable?',
  ]

  let question = $state('')
  let answer = $state<string | null>(null)
  let sources = $state<Source[]>([])
  let loading = $state(false)
  let errorMessage = $state<string | null>(null)

  async function submit(asked = question) {
    const q = asked.trim()
    if (!q || loading) return

    question = q
    loading = true
    errorMessage = null
    answer = null
    sources = []

    try {
      const response = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await response.json()

      if (!response.ok) {
        errorMessage = data.error || t('ai.failed')
        return
      }

      answer = data.answer
      sources = data.sources ?? []
    } catch (err) {
      errorMessage = err instanceof Error ? err.message : t('ai.failed')
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Shipping Rules Assistant</title>
</svelte:head>

<div class="max-w-3xl">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-foreground mb-2">Shipping Rules Assistant</h1>
    <p class="text-muted-foreground">
      Ask about the shipping rules. Answers come only from the project documentation, with
      citations.
    </p>
  </div>

  <form
    class="flex gap-2 mb-4"
    onsubmit={(e) => {
      e.preventDefault()
      submit()
    }}
  >
    <label class="sr-only" for="question">Your question</label>
    <input
      id="question"
      type="text"
      bind:value={question}
      disabled={loading}
      placeholder="e.g. What is the maximum weight for a Domestic shipment?"
      class="flex-1 px-3 py-2 bg-nord-polar-2 text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
    />
    <button
      type="submit"
      disabled={loading || question.trim() === ''}
      class="px-4 py-2 bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <Search class="w-4 h-4" aria-hidden="true" />
      Ask
    </button>
  </form>

  <!-- Example questions: handy starting points, and stable named targets for tests -->
  <div class="flex flex-wrap gap-2 mb-8">
    {#each EXAMPLES as example (example)}
      <button
        type="button"
        onclick={() => submit(example)}
        disabled={loading}
        class="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
      >
        {example}
      </button>
    {/each}
  </div>

  {#if loading}
    <p role="status" class="text-muted-foreground">{t('ai.thinking')}</p>
  {/if}

  {#if errorMessage}
    <div
      role="alert"
      class="bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded"
    >
      {errorMessage}
    </div>
  {/if}

  {#if answer}
    <section aria-label="Answer" class="bg-muted border border-border rounded-lg p-6 mb-6">
      <Markdown content={answer} />
    </section>
  {/if}

  {#if sources.length > 0}
    <section aria-labelledby="sources-heading">
      <h2
        id="sources-heading"
        class="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3"
      >
        <BookOpen class="w-4 h-4" aria-hidden="true" />
        {t('ai.sources')}
      </h2>
      <ol class="space-y-2 list-none">
        {#each sources as source (source.n)}
          <li
            class="flex items-baseline gap-3 text-sm border border-border rounded-md px-3 py-2"
          >
            <span class="text-primary font-mono">[{source.n}]</span>
            <span class="flex-1 text-foreground">{source.heading}</span>
            <span class="text-xs text-muted-foreground font-mono">{source.source}</span>
            <span class="text-xs text-muted-foreground">{source.score.toFixed(3)}</span>
          </li>
        {/each}
      </ol>
    </section>
  {/if}
</div>
