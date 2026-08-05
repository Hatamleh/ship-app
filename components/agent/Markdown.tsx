'use client'

import ReactMarkdown from 'react-markdown'

/**
 * Renders model output as Markdown.
 *
 * The models reply in Markdown (bold labels, bullet lists, occasional tables), so
 * rendering it as plain text shows literal asterisks. react-markdown does not
 * render raw HTML unless you add rehype-raw, so model output cannot inject markup.
 *
 * Elements are styled explicitly rather than via @tailwindcss/typography, which
 * this project does not use.
 *
 * The wrapper keeps whatever data-testid the caller passes, and Markdown rendering
 * preserves text content, so assertions like
 * `getByTestId('assistant-answer')).toContainText('$82.00')` keep working.
 */
export default function Markdown({
  children,
  testId,
  className = '',
  compact = false,
}: {
  children: string
  testId?: string
  className?: string
  /** Tighter styling for the narrow chat panel. */
  compact?: boolean
}) {
  return (
    <div data-testid={testId} className={`space-y-2 min-w-0 ${className}`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => <h1 className="text-base font-bold mt-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mt-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold mt-3">{children}</h3>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 rounded bg-nord-polar-3 font-mono text-[0.9em]">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="p-3 rounded bg-nord-polar-3 overflow-x-auto font-mono text-xs">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-border pl-3 text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-border" />,
          // A wide table must scroll inside its own box, never stretch the panel.
          // max-w-full binds the scroll container to the bubble's resolved width;
          // w-max lets the table exceed it so there is something to scroll.
          table: ({ children }) => (
            <div className="overflow-x-auto max-w-full -mx-1 px-1">
              <table
                className={`w-max min-w-full border-collapse text-left ${
                  compact ? 'text-xs' : ''
                }`}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              className={`border border-border font-semibold whitespace-nowrap ${
                compact ? 'px-1.5 py-1' : 'px-2 py-1'
              }`}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={`border border-border align-top ${
                compact ? 'px-1.5 py-1' : 'px-2 py-1'
              }`}
            >
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
