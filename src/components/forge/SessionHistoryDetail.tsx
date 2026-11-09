import { TextLink } from '@/components/ui/TextLink'
import { formatDay, formatTime, formatTimeRange, plural } from '@/lib/format'
import { menteeExtensionRoute, menteeNotesRoute } from '@/lib/menteeRoutes'
import type { HistoryRow } from '@/types/menteeSessions'

interface SessionHistoryDetailProps {
  row: HistoryRow
}

function DetailBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="font-sans text-small text-text-primary">
      <p className="font-semibold">{title}</p>
      <p>{children}</p>
    </div>
  )
}

// What the mentee submitted for one past session
export function SessionHistoryDetail({ row }: SessionHistoryDetailProps) {
  const time = row.endsAt ? formatTimeRange(row.startsAt, row.endsAt) : formatTime(row.startsAt)
  const ratings = row.ratings.map((rating) => `${rating.label} ${rating.value}`).join(', ')

  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-small text-text-secondary">
        {formatDay(row.startsAt)}, {time}. {plural(row.pointsEarned, 'point')} earned.
      </p>
      <DetailBlock title="Your ratings">{ratings || 'No ratings submitted'}</DetailBlock>
      <DetailBlock title="Your feedback">{row.feedback ?? 'No feedback submitted'}</DetailBlock>
      <DetailBlock title="Your notes">{row.notes ?? 'No notes yet'}</DetailBlock>
      <div className="flex items-center gap-4">
        <TextLink href={menteeNotesRoute(row.sessionId)}>Edit notes</TextLink>
        {row.state === 'missed' && (
          <TextLink href={menteeExtensionRoute(row.sessionId)}>Request extension</TextLink>
        )}
        {row.materialsUrl && (
          <a
            href={row.materialsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-control items-center font-sans text-caption font-semibold text-link hover:underline"
          >
            Open materials
          </a>
        )}
      </div>
    </div>
  )
}
