import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Chip } from '@/components/ui/Chip'
import { Spinner } from '@/components/ui/Spinner'
import { TextLink } from '@/components/ui/TextLink'
import { formatDay, formatTimeRange } from '@/lib/format'
import { groupFeedbackRoute } from '@/lib/peerMentorRoutes'
import type { PeerSessionView } from '@/types/peerMentor'

interface PeerSessionCardProps {
  // null when the cohort has no peer mentorship sessions yet
  session: PeerSessionView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

function submittedLine({ submitted, groupSize }: PeerSessionView): string {
  if (groupSize === 0) return 'Nobody is in your group yet.'
  if (submitted === 0) return 'None of your mentees have submitted ratings and feedback yet.'
  if (submitted >= groupSize) {
    return groupSize === 1
      ? 'Your mentee has submitted ratings and feedback.'
      : `All ${groupSize} of your mentees have submitted ratings and feedback.`
  }
  return `${submitted} of your ${groupSize} mentees have submitted ratings and feedback.`
}

// The group's current peer mentorship session on My mentees, with how many have submitted
export function PeerSessionCard({
  session,
  isLoading = false,
  error = null,
  onRetry,
}: PeerSessionCardProps) {
  if (error) {
    return (
      <Card>
        <ErrorState message={error} onRetry={onRetry} />
      </Card>
    )
  }
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center gap-2 font-sans text-small text-text-secondary">
          <Spinner size="sm" />
          Loading your peer mentorship session
        </div>
      </Card>
    )
  }
  if (!session) {
    return (
      <Card>
        <p className="font-sans text-small text-text-secondary">No peer mentorship sessions yet.</p>
      </Card>
    )
  }
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-mono text-card-title font-semibold text-text-primary">
            {session.title}
          </h2>
          {session.windowLabel && (
            <Chip variant={session.isOpen ? 'warn' : 'default'}>{session.windowLabel}</Chip>
          )}
        </div>
        <p className="font-sans text-small text-text-secondary">
          {formatDay(session.startsAt)}, {formatTimeRange(session.startsAt, session.endsAt)}.{' '}
          {session.windowLabel ? submittedLine(session) : 'Attendance opens when it starts.'}
        </p>
        {session.windowLabel && (
          <TextLink href={groupFeedbackRoute(session.id)} layout="block">
            See group feedback
          </TextLink>
        )}
      </div>
    </Card>
  )
}
