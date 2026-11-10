import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatTile } from '@/components/ui/StatTile'
import { Card } from '@/components/ui/Card'
import { formatCount, formatPercentage } from '@/lib/format'
import type { CohortNumbers } from '@/types/committee'

interface CohortNumbersRowProps {
  numbers: CohortNumbers
  // The Program Lead's overview notes what each rate means
  withNotes?: boolean
}

// A cohort's headline numbers: mentees, both rates, points and sessions. Numbers only,
// with no status labels. Two columns on phones, five from lg up.
export function CohortNumbersRow({ numbers, withNotes = false }: CohortNumbersRowProps) {
  const completedShare =
    numbers.sessionsTotal > 0 ? (numbers.sessionsCompleted / numbers.sessionsTotal) * 100 : 0
  return (
    <section
      aria-label="Cohort numbers"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5"
    >
      <StatTile label="Mentees enrolled" value={numbers.menteesEnrolled} />
      <StatTile
        label="Core attendance rate"
        value={formatPercentage(numbers.coreRate)}
        note={withNotes ? `Graduation threshold ${numbers.threshold}%` : undefined}
      />
      <StatTile
        label="Overall attendance rate"
        value={formatPercentage(numbers.overallRate)}
        note={withNotes ? 'Core and extra points' : undefined}
      />
      <StatTile
        label="Points distributed"
        value={numbers.pointsDistributed === null ? null : formatCount(numbers.pointsDistributed)}
      />
      <Card className="col-span-2 md:col-span-1">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-small text-text-secondary">Sessions completed</p>
          <p className="font-mono text-stat font-semibold text-text-primary">
            {numbers.sessionsCompleted}{' '}
            <span className="font-sans text-small font-normal text-text-muted">
              of {numbers.sessionsTotal}
            </span>
          </p>
          <ProgressBar
            value={completedShare}
            label={`${numbers.sessionsCompleted} of ${numbers.sessionsTotal} sessions completed`}
            className="mt-2"
          />
        </div>
      </Card>
    </section>
  )
}
