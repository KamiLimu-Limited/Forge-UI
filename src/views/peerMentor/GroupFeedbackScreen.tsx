import { FeedbackSummary } from '@/components/forge/FeedbackSummary'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { formatDay, formatTimeRange } from '@/lib/format'
import { PEER_MENTOR_ROUTES } from '@/lib/peerMentorRoutes'
import type { GroupFeedbackView } from '@/types/peerMentor'

interface GroupFeedbackScreenProps {
  // null until the data loads
  data: GroupFeedbackView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

function subtitle(data: GroupFeedbackView): string {
  const parts = [`${formatDay(data.startsAt)}, ${formatTimeRange(data.startsAt, data.endsAt)}.`]
  if (data.windowLine) parts.push(`${data.windowLine}.`)
  if (data.groupSize === 1) {
    parts.push(
      data.submitted > 0 ? 'Your mentee has submitted.' : "Your mentee hasn't submitted yet."
    )
  } else {
    parts.push(`${data.submitted} of your ${data.groupSize} mentees have submitted.`)
  }
  return parts.join(' ')
}

// What a peer mentor's group said about one peer mentorship session. Feedback is shown
// without names.
export function GroupFeedbackScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: GroupFeedbackScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={PEER_MENTOR_ROUTES.facilitator}>Back to facilitator view</BackLink>
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your group's feedback" />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <span>
              <TrackBadge pillar="personal-dev" />
            </span>
            <PageHeader title={data.title} subtitle={subtitle(data)} />
          </div>

          {data.average === null ? (
            <Card>
              <EmptyState icon="users" title="No ratings yet" />
            </Card>
          ) : (
            <FeedbackSummary groups={data.groups} feedback={data.feedback} average={data.average} />
          )}
        </>
      )}
    </div>
  )
}
