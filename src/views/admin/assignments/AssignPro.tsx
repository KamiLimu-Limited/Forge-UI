'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CoMentorPicker } from '@/components/forge/CoMentorPicker'
import { TrackBadge } from '@/components/forge/TrackBadge'
import { ASSIGNMENT_TABS } from '@/components/layout/navConfig'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Notice } from '@/components/ui/Notice'
import { Tabs } from '@/components/ui/Tabs'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useMentorOptions } from '@/hooks/useMentorOptions'
import { useProAssignments, type ProAssignmentRow } from '@/hooks/useProAssignments'
import { useToast } from '@/hooks/useToast'
import { formatDay, plural } from '@/lib/format'
import { sessionPillar } from '@/lib/sessions'
import type { UserRole } from '@/types/auth'

const PRO_ROLES: UserRole[] = ['professional_mentor']

export function AssignProPage() {
  const { showToast } = useToast()
  const { cohortId, isLoading: cohortLoading } = useActiveCohort()
  const [view, setView] = useState<'unassigned' | 'all'>('unassigned')
  const data = useProAssignments(cohortId, view)
  const mentors = useMentorOptions(cohortId, PRO_ROLES)

  const save = async () => {
    const result = await data.save()
    if (result.failed.length === 0) {
      showToast(`${plural(result.saved, 'session')} updated. Mentors can see them now.`)
    } else {
      showToast(`Some sessions didn't save: ${result.failed.join('. ')}`, 'error')
    }
  }

  const columns: DataTableColumn<ProAssignmentRow>[] = [
    {
      key: 'session',
      header: 'Session',
      render: (row) => (
        <div className="flex min-w-48 flex-col">
          <Link
            href={`/admin/sessions/${row.session.id}`}
            className="relative before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] font-semibold text-text-primary hover:underline"
          >
            {row.session.title}
          </Link>
          <span className="font-sans text-caption text-text-muted">
            {formatDay(row.session.starts_at)}
            {row.isChanged ? '. Not saved yet' : ''}
          </span>
        </div>
      ),
      sortValue: (row) => row.session.starts_at,
    },
    {
      key: 'track',
      header: 'Track',
      render: (row) => {
        const pillar = sessionPillar(row.session)
        return pillar ? (
          <TrackBadge pillar={pillar} label={row.session.track ?? undefined} />
        ) : (
          <span className="text-text-muted">No track</span>
        )
      },
    },
    {
      key: 'lead',
      header: 'Lead mentor',
      className: 'min-w-56',
      render: (row) => (
        <select
          aria-label={`Lead mentor for ${row.session.title}`}
          value={row.draft.leadId}
          onChange={(e) => data.setLead(row.session.id, e.target.value)}
          disabled={data.isSaving || mentors.isLoading}
          className="h-control w-full rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text"
        >
          <option value="">Choose a lead mentor</option>
          {mentors.mentors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'co',
      header: 'Co-mentors',
      className: 'min-w-56',
      render: (row) => (
        <CoMentorPicker
          ariaLabel={`Co-mentors for ${row.session.title}`}
          placeholder="Add co-mentors"
          mentors={mentors.mentors}
          selectedIds={row.draft.coIds}
          excludeId={row.draft.leadId}
          onChange={(ids) => data.setCoMentors(row.session.id, ids)}
          disabled={data.isSaving}
        />
      ),
    },
  ]

  if (!cohortLoading && !cohortId) {
    return (
      <>
        <PageHeader title="Mentor assignments" />
        <NoCohortNotice />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Mentor assignments"
        subtitle="Assign professional mentors before the sessions run. They see their sessions as soon as you save."
        action={
          <Button
            onClick={() => void save()}
            isLoading={data.isSaving}
            disabled={data.changeCount === 0}
          >
            Save assignments
          </Button>
        }
      />
      <Tabs label="Assignment type" items={ASSIGNMENT_TABS} />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Sessions to show">
        <Chip
          variant={view === 'unassigned' ? 'on' : 'default'}
          pressed={view === 'unassigned'}
          onClick={() => setView('unassigned')}
        >
          Unassigned and upcoming
        </Chip>
        <Chip
          variant={view === 'all' ? 'on' : 'default'}
          pressed={view === 'all'}
          onClick={() => setView('all')}
        >
          All upcoming sessions
        </Chip>
      </div>
      {mentors.error && <Notice variant="danger">{mentors.error}</Notice>}
      {!mentors.isLoading && !mentors.error && mentors.mentors.length === 0 && (
        <Notice variant="warning">
          No professional mentors in this cohort yet.{' '}
          <Link href="/admin/rosters/professional-mentors" className="font-semibold underline">
            Add one to the roster
          </Link>
        </Notice>
      )}
      <Card flush>
        <DataTable
          label="Upcoming sessions and their mentors"
          columns={columns}
          rows={data.rows}
          rowKey={(row) => row.session.id}
          isLoading={data.isLoading}
          error={data.error}
          onRetry={data.refetch}
          empty={{
            icon: 'calendar',
            title:
              view === 'unassigned'
                ? 'Every upcoming session has a lead mentor'
                : 'No upcoming sessions',
            description:
              view === 'unassigned'
                ? 'Switch to all upcoming sessions to change an assignment.'
                : 'Sessions you create show up here until they run.',
          }}
        />
      </Card>
      <p className="font-sans text-caption text-text-muted">
        Mentors come from the professional mentor roster.{' '}
        <Link href="/admin/rosters/professional-mentors" className="text-link underline">
          Manage the roster
        </Link>
      </p>
    </>
  )
}
