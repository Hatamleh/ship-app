'use client'

import { User } from 'lucide-react'
import type { CardRules } from '@/lib/types'
import { t } from '@/lib/translations'

interface SenderCardProps {
  rules: CardRules | null
  formData: Record<string, any>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur?: (name: string) => void
  disabled?: boolean
}

export default function SenderCard({
  rules,
  formData,
}: SenderCardProps) {
  const senderName = formData.senderName || ''
  const senderCountry = formData.senderCountry || ''

  return (
    <div className="bg-muted p-4 rounded-lg shadow border border-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-nord-frost-1/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-medium text-muted-foreground">{t('form.senderInformation')}</h2>
          <p className="text-foreground font-semibold">
            {senderName} - {senderCountry}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/70 mt-3">
        Sender details are filled from your account automatically and cannot be edited
      </p>
    </div>
  )
}
