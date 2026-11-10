import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatTile } from '@/components/ui/StatTile'
import { TextLink } from '@/components/ui/TextLink'
import { formatPercentage } from '@/lib/format'
import { MENTEE_ROUTES } from '@/lib/menteeRoutes'
import type { HomeStanding, SessionBuckets } from '@/types/home'

interface StandingSummaryProps {
  standing: HomeStanding
  buckets: SessionBuckets
  // Hidden in the first month, when there is little to break down yet
  showProgressLink?: boolean
}

// The mentee's numbers, with no status labels or colour coding. One card plus four
// counts on phones, four cards from md up.
export function StandingSummary({
  standing,
  buckets,
  showProgressLink = true,
}: StandingSummaryProps) {
  const { coreRate, overallRate, pointsEarned, pointsPossible } = standing
  const pointsPercent = pointsPossible > 0 ? (pointsEarned / pointsPossible) * 100 : 0
  const pointsBar = <ProgressBar value={pointsPercent} label="Points earned" />
  const counts = [
    { label: 'Attended', value: buckets.attended },
    { label: 'In progress', value: buckets.inProgress },
    { label: 'Missed', value: buckets.missed },
    { label: 'Remaining', value: buckets.remaining },
  ]

  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        <section aria-label="Your rates">
          <Card>
            <dl className="grid grid-cols-2 gap-3">
              {[
                { label: 'Core attendance rate', value: formatPercentage(coreRate) },
                { label: 'Overall attendance rate', value: formatPercentage(overallRate) },
              ].map((rate) => (
                <div key={rate.label}>
                  <dt className="font-sans text-small text-text-secondary">{rate.label}</dt>
                  <dd className="font-mono text-stat font-semibold tabular-nums text-text-primary">
                    {rate.value ?? (
                      <span className="font-sans text-body font-normal text-text-muted">
                        No data yet
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <hr className="my-3 border-border" />
            <div className="mb-2 flex items-baseline justify-between gap-3 font-sans text-small">
              <span className="text-text-secondary">Points earned</span>
              <span className="font-mono font-semibold tabular-nums text-text-primary">
                {pointsEarned} of {pointsPossible}
              </span>
            </div>
            {pointsBar}
            {showProgressLink && (
              <div className="mt-1 flex">
                <TextLink href={MENTEE_ROUTES.progress}>
                  See your progress by month and track
                </TextLink>
              </div>
            )}
          </Card>
        </section>
        <section aria-label="Sessions" className="grid grid-cols-2 gap-2.5">
          {counts.map((count) => (
            <div key={count.label} className="rounded-control bg-background px-3 py-2.5">
              <p className="font-mono text-section font-semibold tabular-nums text-text-primary">
                {count.value}
              </p>
              <p className="font-sans text-caption text-text-secondary">{count.label}</p>
            </div>
          ))}
        </section>
      </div>

      <section
        aria-label="Your numbers"
        className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4"
      >
        <StatTile label="Core attendance rate" value={formatPercentage(coreRate)} />
        <StatTile label="Overall attendance rate" value={formatPercentage(overallRate)} />
        <Card>
          <div className="flex flex-col gap-1">
            <p className="font-sans text-small text-text-secondary">Points earned</p>
            <p className="font-mono text-stat font-semibold tabular-nums text-text-primary">
              {pointsEarned}{' '}
              <span className="font-sans text-small font-normal text-text-muted">
                of {pointsPossible}
              </span>
            </p>
            <div className="mt-2">{pointsBar}</div>
          </div>
        </Card>
        <Card>
          <p className="font-sans text-small text-text-secondary">Sessions</p>
          <ul className="mt-2 flex flex-col gap-1 font-sans text-small text-text-primary">
            {counts.map((count) => (
              <li key={count.label}>
                <span className="font-mono tabular-nums">{count.value}</span>{' '}
                {count.label.toLowerCase()}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  )
}
