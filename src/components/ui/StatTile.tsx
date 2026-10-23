import { Card } from './Card'
import { Spinner } from './Spinner'

interface StatTileProps {
  label: string
  // null shows a dash-free "No data yet" placeholder
  value: string | number | null
  note?: string
  isLoading?: boolean
  error?: string
}

export function StatTile({ label, value, note, isLoading = false, error }: StatTileProps) {
  return (
    <Card>
      <div className="flex flex-col gap-1">
        <p className="font-sans text-small text-text-secondary">{label}</p>
        {isLoading ? (
          <div className="flex h-12 items-center">
            <Spinner size="sm" />
          </div>
        ) : error ? (
          <p role="alert" className="font-sans text-small text-danger-text">
            {error}
          </p>
        ) : value === null ? (
          <p className="font-sans text-body text-text-muted">No data yet</p>
        ) : (
          <p className="font-mono text-stat font-semibold tabular-nums text-text-primary">{value}</p>
        )}
        {note && !isLoading && !error && (
          <p className="font-sans text-caption text-text-muted">{note}</p>
        )}
      </div>
    </Card>
  )
}
