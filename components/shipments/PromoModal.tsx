'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

/**
 * A promo overlay that appears RANDOMLY on the shipments page.
 * It is intentionally unpredictable — used to teach Playwright's
 * `addLocatorHandler`, which auto-dismisses overlays whenever they pop up.
 */
export default function PromoModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // ~50% of visits, after a short delay — you can't predict it.
    const timer = setTimeout(() => {
      if (Math.random() < 0.5) setShow(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div
      data-testid="promo-modal"
      className="promo-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-muted rounded-lg shadow-xl max-w-md w-full mx-4 border border-border p-8 text-center">
        <div className="flex-shrink-0 w-12 h-12 mx-auto mb-4 bg-nord-frost-1/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Special Offer!</h3>
        <p className="text-muted-foreground mb-6">
          Get 20% off express shipping this week only!
        </p>
        <button
          onClick={() => setShow(false)}
          data-testid="promo-close"
          className="px-6 py-2 text-sm font-medium text-nord-polar-0 bg-primary rounded-md hover:bg-nord-frost-3 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
