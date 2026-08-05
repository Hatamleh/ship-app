'use client'

import { useState } from 'react'
import { BookOpen, Search } from 'lucide-react'
import Markdown from '@/components/agent/Markdown'
import { t } from '@/lib/translations'

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

/**
 * Documentation Q&A over logic.md, the user stories and the rules config.
 *
 * This page answers strictly from the indexed docs and always shows which
 * passages it used, so the citation list can be asserted directly.
 */
export default function AssistantPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (q?: string) => {
    const asked = (q ?? question).trim()
    if (!asked || loading) return

    setQuestion(asked)
    setLoading(true)
    setError(null)
    setAnswer(null)
    setSources([])

    try {
      const response = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: asked }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t('ai.failed'))
        return
      }

      setAnswer(data.answer)
      setSources(data.sources || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : t('ai.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
          Shipping Rules Assistant
        </h1>
        <p className="text-muted-foreground">
          Ask about the shipping rules. Answers come only from the project documentation, with
          citations.
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="e.g. What is the maximum weight for a Domestic shipment?"
          data-testid="assistant-input"
          disabled={loading}
          className="flex-1 px-3 py-2 bg-nord-polar-2 text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          onClick={() => submit()}
          disabled={loading || question.trim() === ''}
          data-testid="assistant-submit"
          className="px-4 py-2 bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Ask
        </button>
      </div>

      {/* Example questions — handy starting points, and stable selectors for tests */}
      <div className="flex flex-wrap gap-2 mb-8" data-testid="assistant-examples">
        {EXAMPLES.map((example, i) => (
          <button
            key={i}
            onClick={() => submit(example)}
            disabled={loading}
            data-testid={`assistant-example-${i}`}
            className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-muted-foreground" data-testid="assistant-loading">
          {t('ai.thinking')}
        </div>
      )}

      {error && (
        <div
          data-testid="assistant-error"
          className="bg-nord-aurora-red/20 border border-destructive text-destructive px-4 py-3 rounded"
        >
          {error}
        </div>
      )}

      {answer && (
        <div className="bg-muted border border-border rounded-lg p-6 mb-6">
          <Markdown testId="assistant-answer" className="text-foreground">
            {answer}
          </Markdown>
        </div>
      )}

      {sources.length > 0 && (
        <div data-testid="assistant-sources">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
            <BookOpen className="w-4 h-4" />
            {t('ai.sources')}
          </h2>
          <ul className="space-y-2">
            {sources.map((s) => (
              <li
                key={s.n}
                data-testid={`assistant-source-${s.n}`}
                data-source={s.source}
                className="flex items-baseline gap-3 text-sm border border-border rounded-md px-3 py-2"
              >
                <span className="text-primary font-mono">[{s.n}]</span>
                <span className="flex-1 text-foreground">{s.heading}</span>
                <span className="text-xs text-muted-foreground font-mono">{s.source}</span>
                <span className="text-xs text-muted-foreground">{s.score.toFixed(3)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
