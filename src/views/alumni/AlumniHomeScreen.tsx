import Link from 'next/link'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { alumniHistoryRoute } from '@/lib/alumniRoutes'
import { formatLongDate, formatPercentage } from '@/lib/format'
import type { AlumniHomeView, AlumniRecordTab } from '@/types/alumni'

interface AlumniHomeScreenProps {
  // null until the data loads
  data: AlumniHomeView | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const RECORD_LINKS: { tab: AlumniRecordTab; label: string }[] = [
  { tab: 'sessions', label: 'Sessions and attendance' },
  { tab: 'activities', label: 'Extra activities' },
  { tab: 'objectives', label: 'Objectives' },
]

function Figure({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-caption text-teal-100">{label}</span>
      {value === null ? (
        <span className="font-sans text-small text-teal-100">Not available yet</span>
      ) : (
        <span className="font-mono text-subtitle font-semibold tabular-nums text-teal-100 md:text-page">
          {value}
        </span>
      )}
    </div>
  )
}

// An alumnus's home: their graduation card and links into their past record. Read only.
export function AlumniHomeScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
}: AlumniHomeScreenProps) {
  if (error) return <ErrorState message={error} onRetry={onRetry} />
  if (isLoading || !data) return <LoadingState label="Loading your record" />

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <PageHeader
        title={`Hi, ${data.firstName}`}
        subtitle={<span className="hidden md:inline">Your past record is read only.</span>}
      />
      <section
        aria-label="Graduation card"
        className="flex flex-col gap-5 rounded-xl bg-teal-900 p-5 md:flex-row md:items-end md:justify-between md:gap-8 md:p-8"
      >
        <div className="flex flex-col gap-1">
          <p className="font-mono text-subtitle font-semibold text-teal-100 md:text-page">
            {data.graduated ? `${data.cohortName} graduate` : data.cohortName}
          </p>
          {data.graduated && data.graduatedOn && (
            <p className="font-sans text-small text-teal-100">
              Graduated {formatLongDate(data.graduatedOn)}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          <Figure label="Core attendance rate" value={formatPercentage(data.coreRate)} />
          <Figure label="Overall attendance rate" value={formatPercentage(data.overallRate)} />
          <Figure
            label="Total points"
            value={data.totalPoints === null ? null : String(data.totalPoints)}
          />
          <Figure
            label="Sessions attended"
            value={data.sessionsAttended === null ? null : String(data.sessionsAttended)}
          />
        </div>
      </section>
      <Card title={`Your ${data.cohortName} record`} className="md:max-w-3xl">
        <ul>
          {RECORD_LINKS.map((link) => (
            <li key={link.tab} className="border-b border-border last:border-b-0">
              <Link
                href={alumniHistoryRoute(link.tab)}
                className="flex min-h-control items-center justify-between gap-3 py-3 text-inherit no-underline hover:no-underline"
              >
                <span className="font-sans text-body text-text-primary">{link.label}</span>
                <span className="font-sans text-small font-semibold text-link">View</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <p className="font-sans text-small text-text-muted md:hidden">
        Your past record is read only.
      </p>
    </div>
  )
}
