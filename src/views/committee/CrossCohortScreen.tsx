import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Select } from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { formatCount } from '@/lib/format'
import type { ComparisonMeasure, CrossCohortView } from '@/types/committee'
import { NoCohortCard, ReadOnlyTag } from './CommitteeStates'

interface CrossCohortScreenProps {
  // null until the data loads
  data: CrossCohortView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
  onCompareWith: (cohortId: string) => void
}

function show(value: number | null, format: ComparisonMeasure['format']): string {
  if (value === null) return 'No data yet'
  return format === 'percent' ? `${Math.round(value)}%` : value.toFixed(1)
}

function Pair({
  measure,
  current,
  other,
}: {
  measure: ComparisonMeasure
  current: string
  other: string
}) {
  const rows = [
    { name: current, value: measure.current, bar: 'bg-teal-500' },
    { name: other, value: measure.other, bar: 'bg-info-text' },
  ]
  return (
    <div className="flex flex-col gap-2 border-t border-border py-3 first:border-t-0 first:pt-0 md:grid md:grid-cols-[minmax(0,theme(spacing.56))_1fr] md:items-center md:gap-4">
      <p className="font-sans text-small font-semibold text-text-primary">{measure.label}</p>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <ProgressBar
              value={row.value === null ? 0 : (row.value / measure.max) * 100}
              label={`${measure.label}, ${row.name}, ${show(row.value, measure.format)}`}
              barClassName={row.bar}
            />
            <span className="w-12 text-right font-mono text-small font-semibold text-text-primary">
              {row.value === null ? '' : show(row.value, measure.format)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// One cohort against another on rates, ratings and counts. Read only.
export function CrossCohortScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
  onCompareWith,
}: CrossCohortScreenProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title="Cross-cohort"
        subtitle={
          data?.other
            ? `${data.current.name} so far, against ${data.other.name}. Comparing at the same point in the programme is not available yet.`
            : undefined
        }
        action={<ReadOnlyTag />}
        keepActionBeside
      />
      {!hasCohort ? (
        <NoCohortCard />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the comparison" />
      ) : !data.other ? (
        <Card>
          <EmptyState icon="swap" title="No other cohort to compare with" />
        </Card>
      ) : (
        <>
          <Card
            title={`${data.current.name} and ${data.other.name}`}
            action={
              <div className="w-full md:w-56">
                <Select
                  label="Compare with"
                  value={data.other.id}
                  onChange={(event) => onCompareWith(event.target.value)}
                  options={data.options.map((option) => ({ value: option.id, label: option.name }))}
                />
              </div>
            }
          >
            <div className="mb-3 flex flex-wrap gap-4 font-sans text-caption text-text-secondary">
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full bg-teal-500" />
                {data.current.name}
              </span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3 rounded-full bg-info-text" />
                {data.other.name}
              </span>
            </div>
            {data.measures.map((measure) => (
              <Pair
                key={measure.label}
                measure={measure}
                current={data.current.name}
                other={data.other?.name ?? ''}
              />
            ))}
          </Card>
          <Card flush>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Measure, so far</TableHeaderCell>
                  <TableHeaderCell num>{data.current.name}</TableHeaderCell>
                  <TableHeaderCell num>{data.other.name}</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.counts.map((count) => (
                  <TableRow key={count.label}>
                    <TableCell>{count.label}</TableCell>
                    <TableCell num>
                      {count.current === null ? '' : formatCount(count.current)}
                    </TableCell>
                    <TableCell num>
                      {count.other === null ? '' : formatCount(count.other)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}
    </div>
  )
}
