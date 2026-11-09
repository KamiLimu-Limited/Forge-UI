import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { ColumnChart, type ColumnChartItem } from '@/components/ui/ColumnChart'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import type { CommitteeTrendsView } from '@/types/committee'
import { NoCohortCard, ReadOnlyTag } from './CommitteeStates'

interface TrendsScreenProps {
  // null until the data loads
  data: CommitteeTrendsView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
}

function Chart({
  title,
  label,
  items,
  max,
  empty,
}: {
  title: string
  label: string
  items: ColumnChartItem[]
  max: number
  empty: string
}) {
  return (
    <Card title={title}>
      {items.length === 0 ? (
        <p className="font-sans text-small text-text-muted">{empty}</p>
      ) : (
        <ColumnChart label={label} items={items} max={max} />
      )}
    </Card>
  )
}

// Trends by KamiLimu month and by track, session ratings and extra activities. Read only.
// This only draws the screen.
export function TrendsScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
}: TrendsScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Trends"
        subtitle={data ? `${data.cohortName} so far, by KamiLimu month and by track.` : undefined}
        action={<ReadOnlyTag />}
        keepActionBeside
      />
      {!hasCohort ? (
        <NoCohortCard />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the trends" />
      ) : (
        <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
          <Chart
            title="Core attendance by month"
            label="Core attendance rate by month"
            items={data.monthRates}
            max={100}
            empty="No months counted yet"
          />
          <Chart
            title="Attendance by track"
            label="Attendance rate by track"
            items={data.trackRates}
            max={100}
            empty="No sessions counted yet"
          />
          <Chart
            title="Average session rating by month"
            label="Average session rating out of 5, by month"
            items={data.ratingByMonth}
            max={5}
            empty="No ratings yet"
          />
          <Chart
            title="Extra activities by type"
            label="Extra activities logged, by type"
            items={data.activities}
            max={data.activitiesMax}
            empty="No activities logged yet"
          />
        </div>
      )}
    </div>
  )
}
