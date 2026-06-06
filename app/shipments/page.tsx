'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import StatsCards from '@/components/shipments/StatsCards'
import ShipmentFilters from '@/components/shipments/ShipmentFilters'
import ShipmentsTable from '@/components/shipments/ShipmentsTable'
import KebabMenu from '@/components/shipments/KebabMenu'
import DeleteModal from '@/components/shipments/DeleteModal'
import PromoModal from '@/components/shipments/PromoModal'
import type { Shipment } from '@/lib/types'

function ShipmentsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [shipmentToDelete, setShipmentToDelete] = useState<number | null>(null)
  const [_finalizing, setFinalizing] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    loadShipments()

    // Check if we should show success message
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [statusFilter, typeFilter, searchParams])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadShipments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('shipmentType', typeFilter)
      params.append('sortBy', 'createdAt')
      params.append('sortOrder', 'desc')

      const response = await fetch(`/api/shipments?${params.toString()}`)

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to load shipments')
      }

      const data = await response.json()
      setShipments(data.shipments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shipments')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (shipmentId: number) => {
    setShipmentToDelete(shipmentId)
    setShowDeleteModal(true)
    setOpenMenuId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!shipmentToDelete) return

    try {
      const response = await fetch(`/api/shipments/${shipmentToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete shipment')
      }

      await loadShipments()
      setShowDeleteModal(false)
      setShipmentToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shipment')
      setShowDeleteModal(false)
      setShipmentToDelete(null)
    }
  }

  const handleFinalizeClick = async (shipmentId: number) => {
      setFinalizing(true)
    setOpenMenuId(null)
    try {
      const response = await fetch(`/api/shipments/${shipmentId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to finalize shipment')
      }

      // Reload shipments to show updated status
      await loadShipments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize shipment')
    } finally {
        setFinalizing(false)
    }
  }

  const handleMenuClick = (shipmentId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    })
    setOpenMenuId(openMenuId === shipmentId ? null : shipmentId)
  }

  const stats = {
    total: shipments.length,
    draft: shipments.filter(s => s.status === 'draft').length,
    finalized: shipments.filter(s => s.status !== 'draft').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">جاري تحميل الشحنات...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Random promo overlay — teaches addLocatorHandler */}
      <PromoModal />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">شحناتي</h1>
            <p className="mt-2 text-muted-foreground">عرض وإدارة جميع شحناتك</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-nord-polar-0 rounded-md hover:bg-nord-frost-3 transition-colors"
          >
            + إنشاء شحنة
          </Link>
        </div>

        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
            تم حفظ الشحنة بنجاح!
          </div>
        )}

        <StatsCards
          total={stats.total}
          draft={stats.draft}
          finalized={stats.finalized}
        />
      </div>

      <ShipmentFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
      />

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Shipments Table */}
      <div className="bg-muted rounded-lg shadow">
        <ShipmentsTable
          shipments={shipments}
          onMenuClick={handleMenuClick}
        />
      </div>

      {/* Kebab Menu */}
      {openMenuId !== null && (
        <div ref={menuRef}>
          <KebabMenu
            shipmentId={openMenuId}
            status={shipments.find(s => s.id === openMenuId)?.status || ''}
            position={menuPosition}
            onClose={() => setOpenMenuId(null)}
            onDelete={handleDeleteClick}
            onFinalize={handleFinalizeClick}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        shipmentId={shipmentToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteModal(false)
          setShipmentToDelete(null)
        }}
      />
    </div>
  )
}

export default function ShipmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">جاري تحميل الشحنات...</div>
        </div>
      }
    >
      <ShipmentsPageContent />
    </Suspense>
  )
}
