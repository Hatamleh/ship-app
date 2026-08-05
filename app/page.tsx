'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ShipmentForm from '@/components/ShipmentForm'
import { t } from '@/lib/translations'

function HomePageContent() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const repeatId = searchParams.get('repeat')
  const isEditMode = !!editId
  const isRepeatMode = !!repeatId

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
          {isEditMode ? 'Edit Shipment' : isRepeatMode ? 'Repeat Shipment' : 'Create a New Shipment'}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode
            ? 'Update the shipment details below'
            : isRepeatMode
            ? 'Review and edit the shipment details below'
            : 'Fill in the shipment details below'}
        </p>
      </div>
      <ShipmentForm editId={editId} repeatId={repeatId} />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  )
}
