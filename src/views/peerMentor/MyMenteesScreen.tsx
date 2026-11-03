import { PeerMenteeCard } from '@/components/forge/PeerMenteeCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { MenteeCardView } from '@/types/peerMentor'

interface MyMenteesScreenProps {
  // null until the group loads
  mentees: MenteeCardView[] | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
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
        <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
          {mentees.map((mentee) => (
            <PeerMenteeCard key={mentee.id} mentee={mentee} />
          ))}
        </div>
      )}
    </div>
  )
}
