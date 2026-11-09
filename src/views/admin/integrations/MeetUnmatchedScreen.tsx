import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { formatDay } from '@/lib/format'
import type { MeetSessionView } from '@/types/adminIntegrations'

interface MeetUnmatchedScreenProps {
  sessionId: string
  // null until the session loads
  session: MeetSessionView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// People who joined a session's Meet with an account the MMS couldn't match, for the
// System Admin to link by hand (SA-MeetUnmatched). The API has no Meet attendance yet, so
// the list and linking show Not available yet.
export function MeetUnmatchedScreen({
  sessionId,
  session,
  isLoading = false,
  error = null,
  onRetry,
}: MeetUnmatchedScreenProps) {
  return (
    <>
      <BackLink href={`/admin/sessions/${sessionId}/attendance`}>
        Back to session attendance
      </BackLink>
      <PageHeader
        title="Match Meet participants"
        subtitle={
          session
            ? `${session.title}, ${formatDay(session.startsAt)}. These people joined the Meet with a Google account the MMS couldn't match to anyone.`
            : undefined
        }
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !session ? (
        <LoadingState label="Loading the session" />
      ) : (
        <Card>
          <EmptyState
            icon="users"
            title="Unmatched Meet participants"
            description="Not available yet"
          />
        </Card>
      )}
      <p className="font-sans text-small text-text-muted">
        Linking only adds Meet time as evidence next to that person&apos;s attendance record. It
        doesn&apos;t mark them present.
      </p>
    </>
  )
}
