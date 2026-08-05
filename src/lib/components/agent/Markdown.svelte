<script lang="ts">
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'

  /**
   * Renders model output as Markdown.
   *
   * The models reply in Markdown (bold labels, bullet lists, the occasional
   * table), so rendering it as plain text shows literal asterisks.
   *
   * The output is sanitised before it reaches {@html}: this is model text that
   * can echo back retrieved document content, so it is never trusted markup.
   */
  let { content, compact = false }: { content: string; compact?: boolean } = $props()

  const html = $derived.by(() => {
    const raw = marked.parse(content ?? '', { async: false }) as string
    // DOMPurify needs a DOM; during SSR we render nothing and let the client
    // hydrate, which is fine because chat output only ever arrives client-side.
    return typeof window === 'undefined' ? '' : DOMPurify.sanitize(raw)
  })
</script>

<div class="markdown min-w-0 space-y-2" class:compact>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitised above -->
  {@html html}
</div>

<style>
  .markdown :global(p) {
    line-height: 1.625;
  }
  .markdown :global(strong) {
    font-weight: 600;
    color: theme('colors.foreground');
  }
  .markdown :global(em) {
    font-style: italic;
  }
  .markdown :global(ul) {
    list-style: disc;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .markdown :global(ol) {
    list-style: decimal;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .markdown :global(h1),
  .markdown :global(h2) {
    font-size: 1rem;
    font-weight: 700;
    margin-top: 0.75rem;
  }
  .markdown :global(h3) {
    font-size: 0.875rem;
    font-weight: 700;
    margin-top: 0.75rem;
  }
  .markdown :global(code) {
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    background: theme('colors.nord.polar.3');
    font-family: theme('fontFamily.mono');
    font-size: 0.9em;
  }
  .markdown :global(pre) {
    padding: 0.75rem;
    border-radius: 0.25rem;
    background: theme('colors.nord.polar.3');
    overflow-x: auto;
    font-size: 0.75rem;
  }
  .markdown :global(blockquote) {
    border-left: 2px solid theme('colors.border');
    padding-left: 0.75rem;
    color: theme('colors.muted-foreground');
  }
  .markdown :global(a) {
    color: theme('colors.primary');
    text-decoration: underline;
  }

  /*
    A wide table must scroll inside its own box, never stretch the chat panel.
    max-width binds the scroller to the bubble's resolved width; the table is
    sized to content so there is something to scroll.
  */
  .markdown :global(table) {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    text-align: left;
  }
  .markdown :global(th),
  .markdown :global(td) {
    border: 1px solid theme('colors.border');
    padding: 0.25rem 0.5rem;
  }
  .markdown :global(th) {
    font-weight: 600;
    white-space: nowrap;
  }
  .compact :global(table) {
    font-size: 0.75rem;
  }
  .compact :global(th),
  .compact :global(td) {
    padding: 0.25rem 0.375rem;
  }
</style>
