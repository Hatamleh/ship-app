'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Wrench } from 'lucide-react'
import Markdown from './Markdown'
import { t } from '@/lib/translations'

interface Message {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: { name: string; args: Record<string, unknown> }[]
  latencyMs?: number
}

/**
 * Floating assistant panel, available on every authenticated page.
 *
 * Every interactive element carries a data-testid so the whole flow can be
 * automated: agent-toggle → agent-input → agent-send → agent-message-N.
 */
export default function ChatDrawer() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const question = input.trim()
    if (!question || loading) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          // Send prior turns so follow-up questions work.
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t('ai.failed'))
        return
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          toolCalls: data.toolCalls,
          latencyMs: data.latencyMs,
        },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : t('ai.failed'))
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        data-testid="agent-toggle"
        aria-label={t('ai.openChat')}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-nord-polar-0 shadow-lg flex items-center justify-center hover:bg-nord-frost-3 transition-colors"
      >
        <Bot className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div
      data-testid="agent-panel"
      className="fixed bottom-6 right-6 z-40 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-muted border border-border rounded-lg shadow-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">{t('ai.title')}</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          data-testid="agent-close"
          aria-label={t('ai.closeChat')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="agent-messages">
        {messages.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground" data-testid="agent-empty">
            {t('ai.emptyState')}
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            data-testid={`agent-message-${i}`}
            data-role={m.role}
            className={m.role === 'user' ? 'text-right' : 'text-left'}
          >
            {/*
              w-fit shrinks the bubble to its content but max-w-[90%] gives it a
              definite upper bound, which is what lets an inner overflow-x-auto
              actually scroll instead of pushing the panel wider.
            */}
            <div
              className={`w-fit max-w-[90%] min-w-0 px-3 py-2 rounded-lg text-sm text-left ${
                m.role === 'user'
                  ? 'ml-auto bg-primary text-nord-polar-0 whitespace-pre-wrap'
                  : 'bg-nord-polar-2 text-foreground'
              }`}
            >
              {/* The user's own text is shown verbatim; only model output is Markdown. */}
              {m.role === 'user' ? (
                m.content
              ) : (
                <Markdown compact>{m.content}</Markdown>
              )}
            </div>

            {/* Which tools ran — assert on these rather than only on the prose */}
            {m.toolCalls && m.toolCalls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1" data-testid={`agent-tools-${i}`}>
                {m.toolCalls.map((call, j) => (
                  <span
                    key={j}
                    data-testid={`agent-tool-call-${call.name}`}
                    title={JSON.stringify(call.args)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-nord-frost-1/20 text-primary"
                  >
                    <Wrench className="w-3 h-3" />
                    {call.name}
                  </span>
                ))}
              </div>
            )}

            {m.latencyMs !== undefined && (
              <div className="mt-1 text-xs text-muted-foreground" data-testid={`agent-latency-${i}`}>
                {m.latencyMs} ms
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-muted-foreground" data-testid="agent-thinking">
            {t('ai.thinking')}
          </div>
        )}

        {error && (
          <div
            data-testid="agent-error"
            className="text-sm text-destructive bg-nord-aurora-red/20 border border-destructive rounded px-3 py-2"
          >
            {error}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-border flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={t('ai.placeholder')}
          data-testid="agent-input"
          disabled={loading}
          className="flex-1 resize-none px-3 py-2 text-sm bg-nord-polar-2 text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={loading || input.trim() === ''}
          data-testid="agent-send"
          aria-label={t('ai.send')}
          className="px-3 py-2 bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
