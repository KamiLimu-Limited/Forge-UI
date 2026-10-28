import Link from 'next/link'
import { Card } from './Card'
import { Spinner } from './Spinner'

interface StatTileProps {
  label: string
  // null shows a dash-free "No data yet" placeholder
  value: string | number | null
  note?: string
  isLoading?: boolean
  error?: string
  // Makes the whole tile a link, with `linkLabel` shown under the number
  href?: string
  linkLabel?: string
}

export function StatTile({
  label,
  value,
  note,
  isLoading = false,
  error,
  href,
  linkLabel,
}: StatTileProps) {
  const body = (
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
      {href && linkLabel && (
        <p className="font-sans text-caption font-semibold text-link">{linkLabel}</p>
      )}
    </div>
  )

  if (!href) return <Card>{body}</Card>
  return (
    <Link
      href={href}
      className="block rounded-lg text-inherit no-underline transition-shadow duration-fast hover:no-underline hover:shadow-md"
    >
      <Card className="h-full">{body}</Card>
    </Link>
  )
}
