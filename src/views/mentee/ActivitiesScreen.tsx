import { ActivityTypeList } from '@/components/forge/ActivityTypeList'
import { RecentActivityList } from '@/components/forge/RecentActivityList'
import { PageHeader } from '@/components/layout/PageHeader'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { MenteeActivitiesData } from '@/types/menteeActivities'

interface ActivitiesScreenProps {
  // null until the data loads
  data: MenteeActivitiesData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

function Total({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-sans text-small text-text-secondary">{label}</p>
      <p className="font-mono text-stat font-semibold tabular-nums text-text-primary">{value}</p>
    </div>
  )
}

export function ActivitiesScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: ActivitiesScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Extra activities"
        subtitle="Log at least one of each."
        action={
          data ? (
            <div className="flex gap-8">
              <Total label="Extra activity points" value={data.totalPoints} />
              <Total label="Logged" value={data.loggedCount} />
            </div>
          ) : undefined
        }
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading your activities" />
      ) : (
        <>
          <ActivityTypeList tiles={data.tiles} />
          <RecentActivityList rows={data.recent} />
        </>
      )}
    </div>
  )
}
