import Link from 'next/link'
import { Chip } from '@/components/ui/Chip'
import { cx } from '@/lib/cx'
import { formatTimeRange } from '@/lib/format'
import { MODE_LABELS } from '@/lib/labels'
import { isLive, sessionPillar } from '@/lib/sessions'
import type { SessionResponse } from '@/types/session'
import { StatusChip } from './StatusChip'
import { TrackBadge } from './TrackBadge'

interface SessionRowProps {
  session: SessionResponse
  // Where the title links to, usually the edit page
  href: string
  now?: Date
}

function detailLine(session: SessionResponse): string {
  const parts: string[] = [MODE_LABELS[session.mode]]
  if (session.track) parts.push(`${session.track} track`)
  if (session.location && session.mode === 'physical') parts.push(session.location)
  return parts.join(', ')
}

// One session in the calendar: time, title, where, pillar and status.
// Drafts get a dashed border so they stand out as not yet published.
export function SessionRow({ session, href, now }: SessionRowProps) {
  const pillar = sessionPillar(session)
  const isDraft = session.status === 'draft'
  return (
    <div
      className={cx(
        'flex flex-col gap-2 rounded-control border px-4 py-3 md:flex-row md:items-center md:gap-4',
        isDraft ? 'border-dashed border-border-strong bg-background' : 'border-border bg-surface'
      )}
    >
      <time
        dateTime={session.starts_at}
        className="shrink-0 font-mono text-caption text-text-secondary md:w-40"
      >
        {formatTimeRange(session.starts_at, session.ends_at)}
      </time>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={href}
          className={cx(
            "font-sans text-body font-semibold text-text-primary hover:underline relative before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']",
            session.status === 'cancelled' && 'line-through'
          )}
        >
          {session.title}
        </Link>
        <span className="font-sans text-caption text-text-muted">{detailLine(session)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {pillar && <TrackBadge pillar={pillar} />}
        {session.mode === 'physical' && <Chip>In person</Chip>}
        <StatusChip kind="session" status={session.status} isLive={isLive(session, now)} />
      </div>
    </div>
  )
}
