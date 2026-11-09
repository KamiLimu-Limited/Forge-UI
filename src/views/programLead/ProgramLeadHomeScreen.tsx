import { CohortNumbersRow } from '@/components/forge/CohortNumbersRow'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ColumnChart } from '@/components/ui/ColumnChart'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { TextLink } from '@/components/ui/TextLink'
import type { ProgramLeadHomeData } from '@/hooks/useGraduation'
import { PROGRAM_LEAD_ROUTES } from '@/lib/adminRoutes'
import { formatDateTime, formatLongDate } from '@/lib/format'
import { MODE_LABELS } from '@/lib/labels'

interface ProgramLeadHomeScreenProps {
  // null until the data loads
  data: ProgramLeadHomeData | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  hasCohort?: boolean
}

function graduationLine(data: ProgramLeadHomeData): string {
  const { graduation } = data.home
  if (graduation.isGraduated) return 'This cohort has graduated. Results are final.'
  if (!graduation.hasEnded)
    return `Available after the cohort end date, ${formatLongDate(graduation.endDate)}. The System Admin prepares the preview and you confirm it.`
  return 'The cohort has ended. Check the preview, then confirm it.'
}

// The Program Lead's overview (PL-Home): cohort numbers, attendance by month, graduation,
// and what's waiting. This only draws the screen.
export function ProgramLeadHomeScreen({
  data,
  isLoading = false,
  error = null,
  onRetry,
  hasCohort = true,
}: ProgramLeadHomeScreenProps) {
  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={data?.overview.subtitle}
        action={
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={PROGRAM_LEAD_ROUTES.leaderboards} variant="secondary">
              Export reports
            </ButtonLink>
            <ButtonLink href="/admin/sessions">Open session calendar</ButtonLink>
          </div>
        }
      />
      {!hasCohort ? (
        <NoCohortNotice />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !data ? (
        <LoadingState label="Loading the overview" />
      ) : (
        <>
          <CohortNumbersRow numbers={data.overview.numbers} withNotes />
          <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card
                title="Attendance by KamiLimu month"
                action={<TextLink href={PROGRAM_LEAD_ROUTES.trends}>See all trends</TextLink>}
              >
                <ColumnChart
                  label="Core attendance rate by month"
                  items={data.overview.monthRates}
                  max={100}
                />
              </Card>
            </div>
            <Card title="Graduation">
              <div className="flex flex-col gap-3">
                <p className="font-sans text-body text-text-secondary">{graduationLine(data)}</p>
                {data.home.graduation.hasEnded && !data.home.graduation.isGraduated ? (
                  <ButtonLink href={PROGRAM_LEAD_ROUTES.graduation} size="lg" fullWidth>
                    Graduate Cohort
                  </ButtonLink>
                ) : (
                  <Button size="lg" fullWidth disabled>
                    Graduate Cohort
                  </Button>
                )}
                <TextLink href={PROGRAM_LEAD_ROUTES.graduation}>
                  {data.home.graduation.isGraduated
                    ? 'View the graduation record'
                    : 'View graduation preview'}
                </TextLink>
              </div>
            </Card>
          </div>
          <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-2">
            <Card
              title="Pending override requests"
              action={
                data.home.pendingTotal > 0 ? (
                  <Chip variant="info">{data.home.pendingTotal} waiting</Chip>
                ) : undefined
              }
            >
              {data.home.pendingRequests.length === 0 ? (
                <p className="font-sans text-small text-text-muted">Nothing waiting</p>
              ) : (
                <ul className="flex flex-col">
                  {data.home.pendingRequests.map((request) => (
                    <li
                      key={request.id}
                      className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-b-0"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-sans text-small font-semibold text-text-primary">
                          {request.menteeName}
                        </span>
                        <span className="truncate font-sans text-caption text-text-muted">
                          {request.sessionLine}
                        </span>
                      </span>
                      <TextLink href="/admin/attendance-queue">Review</TextLink>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card
              title="Upcoming sessions"
              action={<TextLink href="/admin/sessions">Calendar</TextLink>}
            >
              {data.home.upcoming.length === 0 ? (
                <p className="font-sans text-small text-text-muted">No sessions scheduled</p>
              ) : (
                <ul className="flex flex-col">
                  {data.home.upcoming.map((session) => (
                    <li
                      key={session.id}
                      className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-b-0"
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-sans text-small font-semibold text-text-primary">
                          {session.title}
                        </span>
                        <span className="font-sans text-caption text-text-muted">
                          {formatDateTime(session.startsAt)}
                        </span>
                      </span>
                      <Chip>{session.isVirtual ? MODE_LABELS.virtual : MODE_LABELS.physical}</Chip>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  )
}
