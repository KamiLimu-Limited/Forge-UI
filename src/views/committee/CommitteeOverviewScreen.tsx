import { CohortNumbersRow } from '@/components/forge/CohortNumbersRow'
import { PageHeader } from '@/components/layout/PageHeader'
import { BarList } from '@/components/ui/BarList'
import { Card } from '@/components/ui/Card'
import { ColumnChart } from '@/components/ui/ColumnChart'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { TextLink } from '@/components/ui/TextLink'
import type { CommitteeOverviewView } from '@/types/committee'
import { NoCohortCard, ReadOnlyTag } from './CommitteeStates'

interface CommitteeOverviewScreenProps {
  // null until the data loads
  data: CommitteeOverviewView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  trendsHref: string
}

// Cohort health for the committee: numbers, attendance by month and by track, and extra
// activities. Read only, with no status labels.
export function CommitteeOverviewScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
  trendsHref,
}: CommitteeOverviewScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {data && (
        <PageHeader
          title={data.cohortName}
          subtitle={data.subtitle || undefined}
          action={<ReadOnlyTag />}
          keepActionBeside
        />
      )}
      {!hasCohort ? (
        <NoCohortCard />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the cohort overview" />
      ) : (
        <>
          <CohortNumbersRow numbers={data.numbers} />
          <Card
            title="Attendance by KamiLimu month"
            action={<TextLink href={trendsHref}>Trends</TextLink>}
          >
            <ColumnChart label="Core attendance rate by month" items={data.monthRates} max={100} />
          </Card>
          <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
            <Card title="Attendance by track">
              {data.trackRates.length === 0 ? (
                <p className="font-sans text-small text-text-muted">No sessions counted yet</p>
              ) : (
                <BarList items={data.trackRates} max={100} />
              )}
            </Card>
            <Card title="Extra activities logged">
              {data.activities.length === 0 ? (
                <p className="font-sans text-small text-text-muted">No activities logged yet</p>
              ) : (
                <BarList items={data.activities} max={data.activitiesMax} />
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
