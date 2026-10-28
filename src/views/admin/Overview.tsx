'use client'

import Link from 'next/link'
import { Chip } from '@/components/ui/Chip'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { StatTile } from '@/components/ui/StatTile'
import { TextLink } from '@/components/ui/TextLink'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useAdminOverview } from '@/hooks/useAdminOverview'
import { useAuditLookups } from '@/hooks/useAuditLookups'
import { auditAction, auditActor, auditRecord } from '@/lib/audit'
import { formatDateTime, formatDay, formatRelativeDateTime, formatTimeRange } from '@/lib/format'
import { MODE_LABELS } from '@/lib/labels'
import { monthBoundaries, monthForDate, sessionPillar } from '@/lib/sessions'
import type { CohortResponse } from '@/types/cohort'
import type { SessionResponse } from '@/types/session'

function overviewSubtitle(cohort: CohortResponse, now: Date): string {
  const months = monthBoundaries(cohort)
  const current = monthForDate(cohort, now)
  const monthText =
    current !== null && months.length > 0
      ? `, Month ${current} of ${new Set(months.map((m) => m.month)).size}`
      : ''
  return `${cohort.name}${monthText}. ${formatDay(now)}.`
}

function sessionLine(session: SessionResponse): string {
  if (session.category === 'peer_mentorship' && session.attendance_deadline) {
    return `${formatDay(session.starts_at)}, window closes ${formatDateTime(session.attendance_deadline)}`
  }
  return `${formatDay(session.starts_at)}, ${formatTimeRange(session.starts_at, session.ends_at)}, ${MODE_LABELS[session.mode].toLowerCase()}`
}

export function OverviewPage() {
  const { cohort, cohortId, isLoading } = useActiveCohort()
  const data = useAdminOverview(cohortId)
  const lookups = useAuditLookups(data.recentChanges.data ?? [])
  const now = new Date()

  const actions = (
    <div className="flex flex-wrap gap-3">
      <ButtonLink variant="secondary" href="/admin/users">
        Invite user
      </ButtonLink>
      <ButtonLink href="/admin/sessions/new">New session</ButtonLink>
    </div>
  )

  if (isLoading) {
    return (
      <>
        <PageHeader title="Overview" />
        <LoadingState label="Loading cohort" />
      </>
    )
  }

  if (!cohort) {
    return (
      <>
        <PageHeader title="Overview" />
        <NoCohortNotice />
      </>
    )
  }

  const stat = (query: { data: number | null; isLoading: boolean; error: string | null }) => ({
    value: query.data,
    isLoading: query.isLoading,
    error: query.error ?? undefined,
  })

  return (
    <>
      <PageHeader title="Overview" subtitle={overviewSubtitle(cohort, now)} action={actions} />

      <section aria-label="To do" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Pending override requests"
          {...stat(data.pendingOverrides)}
          href="/admin/attendance-queue"
          linkLabel="Open the queue"
        />
        <StatTile
          label="Sessions this week"
          {...stat(data.sessionsThisWeek)}
          href="/admin/sessions"
          linkLabel="Open the calendar"
        />
        <StatTile
          label="Mentees without an ICT track"
          {...stat(data.menteesWithoutTrack)}
          href="/admin/ict-tracks"
          linkLabel="Open ICT tracks"
        />
        <StatTile
          label="Extra activities logged this week"
          {...stat(data.activitiesThisWeek)}
          href="/admin/extra-activities"
          linkLabel="Review activities"
        />
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        <Card
          title="Coming up"
          action={
            <TextLink href="/admin/sessions" layout="inline">
              Calendar
            </TextLink>
          }
        >
          {data.comingUp.isLoading ? (
            <LoadingState label="Loading sessions" />
          ) : data.comingUp.error ? (
            <ErrorState message={data.comingUp.error} onRetry={data.comingUp.refetch} />
          ) : (data.comingUp.data ?? []).length === 0 ? (
            <EmptyState
              icon="calendar"
              title="Nothing scheduled"
              description="Upcoming sessions for this cohort show up here."
            />
          ) : (
            <ul className="flex flex-col">
              {(data.comingUp.data ?? []).map((session) => {
                const pillar = sessionPillar(session)
                return (
                  <li
                    key={session.id}
                    className="flex items-start justify-between gap-3 border-b border-border py-3 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <div className="flex min-w-0 flex-col">
                      <Link
                        href={`/admin/sessions/${session.id}`}
                        className="relative before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] font-sans text-body font-semibold text-text-primary hover:underline"
                      >
                        {session.title}
                      </Link>
                      <span className="font-sans text-caption text-text-muted">
                        {sessionLine(session)}
                      </span>
                    </div>
                    {pillar ? (
                      <TrackBadge pillar={pillar} />
                    ) : session.mode === 'physical' ? (
                      <Chip>In person</Chip>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card
          title="Recent changes"
          action={
            <TextLink href="/admin/audit-trail" layout="inline">
              Audit trail
            </TextLink>
          }
        >
          {data.recentChanges.isLoading ? (
            <LoadingState label="Loading changes" />
          ) : data.recentChanges.error ? (
            <ErrorState message={data.recentChanges.error} onRetry={data.recentChanges.refetch} />
          ) : (data.recentChanges.data ?? []).length === 0 ? (
            <EmptyState
              title="No changes yet"
              description="Admin changes show up here as they happen."
            />
          ) : (
            <ul className="flex flex-col">
              {(data.recentChanges.data ?? []).map((log) => (
                <li
                  key={log.id}
                  className="flex flex-col border-b border-border py-3 font-sans text-body text-text-primary first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span>
                    <span className="font-semibold">{auditAction(log)}</span>:{' '}
                    {auditRecord(log, lookups)}
                  </span>
                  <span className="font-sans text-caption text-text-muted">
                    {formatRelativeDateTime(log.created_at, now)}, {auditActor(log, lookups)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
