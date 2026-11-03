import { PeerMenteeCard } from '@/components/forge/PeerMenteeCard'
import { PeerSessionCard } from '@/components/forge/PeerSessionCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { MenteeCardView, PeerSessionView } from '@/types/peerMentor'

interface MyMenteesScreenProps {
  // null until the group loads
  mentees: MenteeCardView[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  // The group's current peer mentorship session, null when there is none
  peerSession: PeerSessionView | null
  isPeerSessionLoading?: boolean
  peerSessionError?: string | null
  onRetryPeerSession?: () => void
}

function groupLine(count: number): string {
  const group = count === 1 ? 'Your group of one' : `Your group of ${count}`
  return `${group}. You can view their progress but not change it.`
}

// "My mentees". This only draws the screen; the page's hook loads the group.
export function MyMenteesScreen({
  mentees,
  isLoading = false,
  error = null,
  onRetry,
  peerSession,
  isPeerSessionLoading = false,
  peerSessionError = null,
  onRetryPeerSession,
}: MyMenteesScreenProps) {
  const hasMentees = mentees !== null && mentees.length > 0
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="My mentees"
        subtitle={hasMentees ? groupLine(mentees.length) : undefined}
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !mentees ? (
        <LoadingState label="Loading your mentees" />
      ) : mentees.length === 0 ? (
        <Card>
          <EmptyState
            icon="users"
            title="No group yet"
            description="Your group will appear here once the System Admin assigns it, about a month into the cohort."
          />
        </Card>
      ) : (
        <>
          <Card>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="font-mono text-card-title font-semibold text-text-primary">
                  Set your next group meeting
                </p>
                <p className="font-sans text-small text-text-secondary">
                  Pick a time and your group gets a Google Meet invite.
                </p>
              </div>
              <div className="flex flex-col gap-1 md:items-end">
                <Button disabled fullWidth className="md:w-auto">
                  Set meeting
                </Button>
                <p className="font-sans text-caption text-text-muted">Not available yet</p>
              </div>
            </div>
          </Card>
          <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
            {mentees.map((mentee) => (
              <PeerMenteeCard key={mentee.id} mentee={mentee} />
            ))}
          </div>
          <PeerSessionCard
            session={peerSession}
            isLoading={isPeerSessionLoading}
            error={peerSessionError}
            onRetry={onRetryPeerSession}
          />
        </>
      )}
    </div>
  )
}
