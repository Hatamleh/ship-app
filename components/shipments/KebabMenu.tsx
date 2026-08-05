import Link from 'next/link'
import { Edit, Eye, Trash2, FileCheck, Copy } from 'lucide-react'

interface KebabMenuProps {
  shipmentId: number
  status: string
  position: { top: number; left: number }
  onClose: () => void
  onDelete: (id: number) => void
  onFinalize?: (id: number) => void
}

export default function KebabMenu({
  shipmentId,
  status,
  position,
  onClose,
  onDelete,
  onFinalize,
}: KebabMenuProps) {
  return (
    <div
      className="fixed w-48 bg-muted rounded-lg shadow-xl z-50 border border-border overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="py-1">
        {status === 'draft' ? (
          <>
            <Link
              href={`/shipments/${shipmentId}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <Link
              href={`/?edit=${shipmentId}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => onFinalize?.(shipmentId)}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              Finalize Shipment
            </button>
            <button
              onClick={() => onDelete(shipmentId)}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-nord-aurora-red/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        ) : (
          <>
            <Link
              href={`/shipments/${shipmentId}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <Link
              href={`/?repeat=${shipmentId}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-nord-frost-1/20 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <Copy className="w-4 h-4" />
              Repeat
            </Link>
            <button
              onClick={() => onDelete(shipmentId)}
              className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-nord-aurora-red/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
