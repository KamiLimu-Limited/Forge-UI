import { formatCount, formatLongDate } from '@/lib/format'
import { cx } from '@/lib/cx'
import type { GraduationResultView } from '@/types/graduation'

interface GraduationResultCardProps {
  result: GraduationResultView
}

function percent(value: number | null): string | null {
  return value === null ? null : `${Math.round(value)}%`
}

function count(value: number | null): string | null {
  return value === null ? null : formatCount(value)
}

function Figure({
  label,
  value,
  note,
  dark,
}: {
  label: string
  value: string | null
  note?: string
  dark: boolean
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cx('font-sans text-caption', dark ? 'text-teal-100' : 'text-text-secondary')}
      >
        {label}
      </span>
      {value === null ? (
        <span className={cx('font-sans text-small', dark ? 'text-teal-100' : 'text-text-muted')}>
          Not available yet
        </span>
      ) : (
        <span
          className={cx(
            'font-mono text-subtitle font-semibold tabular-nums md:text-page',
            dark ? 'text-ivory' : 'text-text-primary'
          )}
        >
          {value}
        </span>
      )}
      {note && (
        <span className={cx('font-sans text-caption', dark ? 'text-teal-100' : 'text-text-muted')}>
          {note}
        </span>
      )}
    </div>
  )
}

// The graduate's card (M-Result) or the private result of someone who didn't graduate
// (M-ResultNotGraduated): final rates, points and sessions attended
export function GraduationResultCard({ result }: GraduationResultCardProps) {
  const dark = result.graduated
  return (
    <section
      aria-label={result.graduated ? 'Graduation card' : 'Your result'}
      className={cx(
        'flex flex-col gap-6 rounded-xl p-5 md:p-8',
        dark ? 'bg-teal-900' : 'border border-border bg-surface shadow-card'
      )}
    >
      <div className="flex flex-col gap-2">
        {result.graduated ? (
          <>
            <h2 className="font-mono text-subtitle font-semibold text-ivory md:text-title">
              Congratulations, {result.firstName}
            </h2>
            <p className="font-sans text-body text-teal-100">
              You graduated from KamiLimu {result.cohortName} on{' '}
              {formatLongDate(result.graduatedOn)}.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-mono text-card-title font-semibold text-text-primary">
              Graduation not achieved
            </h2>
            <p className="font-sans text-small text-text-secondary">
              {result.cohortName} ended on {formatLongDate(result.graduatedOn)}. Your core
              attendance rate finished below the {result.threshold}% needed to graduate.
            </p>
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
        <Figure
          label="Core attendance rate"
          value={percent(result.coreRate)}
          note={result.graduated ? undefined : `${result.threshold}% needed`}
          dark={dark}
        />
        <Figure label="Overall attendance rate" value={percent(result.overallRate)} dark={dark} />
        <Figure label="Total points" value={count(result.totalPoints)} dark={dark} />
        <Figure label="Sessions attended" value={count(result.sessionsAttended)} dark={dark} />
      </div>
    </section>
  )
}
