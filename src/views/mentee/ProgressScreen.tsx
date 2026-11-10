import { ProgressByMonthCard } from '@/components/forge/ProgressByMonthCard'
import { ProgressByTrackCard } from '@/components/forge/ProgressByTrackCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { plural } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { MonthProgressRow, ProgressSummary, TrackProgressRow } from '@/types/progress'

interface ProgressScreenProps {
  // null until the numbers load
  summary: ProgressSummary | null
  months: MonthProgressRow[]
  tracks: TrackProgressRow[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

// "Your progress": attendance by month and by track.
export function ProgressScreen({
  summary,
  months,
  tracks,
  isLoading = false,
  error = null,
  onRetry,
}: ProgressScreenProps) {
  const subtitle = summary
    ? `${summary.attended} of ${plural(summary.scheduled, 'session')} so far, ${plural(summary.points, 'point')}.`
    : undefined

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <BackLink href={MENTEE_ROUTES.home}>Back to home</BackLink>
      <PageHeader title="Your progress" subtitle={subtitle} />
      {/* Phones list months first, wider screens list tracks first, as in the designs */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="order-1 md:order-2">
          <ProgressByMonthCard
            rows={months}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </div>
        <div className="order-2 md:order-1">
          <ProgressByTrackCard
            rows={tracks}
            isLoading={isLoading}
            error={error}
            onRetry={onRetry}
          />
        </div>
      </div>
    </div>
  )
}
