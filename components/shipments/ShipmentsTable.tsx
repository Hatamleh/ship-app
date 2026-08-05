import Link from 'next/link'
import { MoreVertical } from 'lucide-react'
import type { Shipment } from '@/lib/types'
import { t } from '@/lib/translations'

interface ShipmentsTableProps {
  shipments: Shipment[]
  onMenuClick: (shipmentId: number, event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function ShipmentsTable({ shipments, onMenuClick }: ShipmentsTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === 'draft') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-nord-polar-2 text-muted-foreground">
          {t('status.Draft')}
        </span>
      )
    }
    // All non-draft statuses are considered "finalized"
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-nord-aurora-green/20 text-premium">
        Finalized
      </span>
    )
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-foreground">{t('table.noShipments')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('table.createFirstShipment')}
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-nord-polar-0 bg-primary hover:bg-nord-frost-3"
          >
            + {t('table.createShipment')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border" style={{ overflowX: 'auto', overflowY: 'visible' }}>
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-nord-polar-2">
          <tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('table.trackingNumber')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sender
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Receiver
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t('table.status')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-muted divide-y divide-border">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-nord-polar-2">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                <button
                  onClick={(e) => onMenuClick(shipment.id, e)}
                  className="text-muted-foreground hover:text-primary p-1 rounded hover:bg-nord-polar-2"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground text-right">
                {shipment.status === 'draft' ? '-' : shipment.trackingNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right">
                {shipment.from.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right">
                {shipment.to.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
                {shipment.to.city}, {shipment.to.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
                {t(`shipmentTypes.${shipment.service.shipmentType}`)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                {getStatusBadge(shipment.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
