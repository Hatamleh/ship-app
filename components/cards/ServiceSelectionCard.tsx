'use client'

import { Truck } from 'lucide-react'
import type { ServiceOption } from '@/lib/types'
import { t } from '@/lib/translations'

interface ServiceSelectionCardProps {
  serviceRules: any
  selectedService: ServiceOption | null
  onServiceSelect: (service: ServiceOption) => void
  disabled?: boolean
}

export default function ServiceSelectionCard({
  serviceRules,
  selectedService,
  onServiceSelect,
  disabled = false,
}: ServiceSelectionCardProps) {
  return (
    <div
      className={`bg-muted p-6 rounded-lg shadow border border-border ${
        disabled || !serviceRules ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-primary">{t('form.serviceSelection')}</h2>
      </div>

      {!serviceRules ? (
        <p className="text-sm text-muted-foreground/70 text-center py-4">
          {disabled ? t('form.completePreviousSection') : t('form.loadingServices')}
        </p>
      ) : (
        <div className="space-y-3">
          {serviceRules.services.map((service: ServiceOption) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onServiceSelect(service)}
              disabled={disabled}
              className={`w-full text-right p-4 border-2 rounded-lg transition-all ${
                selectedService?.id === service.id
                  ? 'border-primary bg-nord-frost-1/20'
                  : 'border-border hover:border-primary/50'
              } ${disabled ? 'cursor-not-allowed' : ''}`}
              data-testid={`service-${service.id}`}
            >
              <div className="flex justify-between items-center mb-1" dir="rtl">
                <span className="font-semibold text-foreground">
                  {service.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {service.deliveryDays} {service.deliveryDays === 1 ? t('rate.day') : t('rate.days')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {service.description}
              </p>
              <div className="text-xs text-muted-foreground/70">
                {t('rate.base')}: {service.basePrice}$ + {service.pricePerKg}$/kg
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
