'use client'

import Link from 'next/link'
import { ASSIGNMENT_TABS } from '@/components/layout/navConfig'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Notice } from '@/components/ui/Notice'
import { Tabs } from '@/components/ui/Tabs'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useIctAssignments, type IctTrackRow } from '@/hooks/useIctAssignments'
import { useToast } from '@/hooks/useToast'
import { fullName, plural } from '@/lib/format'

export function AssignIctPage() {
  const { showToast } = useToast()
  const { cohort, cohortId, isLoading: cohortLoading } = useActiveCohort()
  const tracks = cohort?.ict_tracks_offered ?? []
  const data = useIctAssignments(cohortId, tracks)

  const save = async () => {
    const result = await data.save()
    if (result.failed.length === 0) showToast(`${plural(result.saved, 'assignment')} saved.`)
    else showToast(`Some assignments didn't save: ${result.failed.join('. ')}`, 'error')
  }

  const columns: DataTableColumn<IctTrackRow>[] = [
    {
      key: 'track',
      header: 'Track',
      render: (row) => <span className="font-semibold">{row.track}</span>,
      sortValue: (row) => row.track,
    },
    {
      key: 'mentees',
      header: 'Mentees',
      num: true,
      render: (row) => row.mentees,
      sortValue: (row) => row.mentees,
    },
    {
      key: 'lead',
      header: 'Lead mentor',
      render: () => <span className="text-text-muted">Not available yet</span>,
    },
    {
      key: 'mentor',
      header: 'ICT peer mentor',
      className: 'min-w-56',
      render: (row) => (
        <select
          aria-label={`ICT peer mentor for ${row.track}`}
          value={row.mentorId}
          onChange={(e) => data.setMentor(row.track, e.target.value)}
          disabled={data.isSaving || data.ictMentors.length === 0}
          className="h-control w-full rounded-control border border-border-strong bg-surface px-3 font-sans text-body text-text-primary disabled:cursor-not-allowed disabled:bg-disabled-bg disabled:text-disabled-text"
        >
          <option value="">Choose an ICT peer mentor</option>
          {data.ictMentors.map((m) => (
            <option key={m.user.id} value={m.user.id}>
              {fullName(m.user)}
            </option>
          ))}
        </select>
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
        subtitle="ICT peer mentors are assigned to tracks after track selection closes, based on how many mentees chose each track."
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
      {!data.isLoading && (
        <Notice variant="info">
          {data.menteesWithTrack} of {plural(data.menteeCount, 'mentee')} chose a track.{' '}
          <Link href="/admin/ict-tracks" className="font-semibold underline">
            See who hasn&apos;t
          </Link>
        </Notice>
      )}
      {!data.isLoading && data.ictMentors.length === 0 && tracks.length > 0 && (
        <Notice variant="warning">
          No ICT peer mentors in this cohort yet. Invite them from Users, then assign them here.
        </Notice>
      )}
      <Card flush>
        <DataTable
          label="ICT peer mentors by track"
          columns={columns}
          rows={data.rows}
          rowKey={(row) => row.track}
          isLoading={data.isLoading}
          error={data.error}
          onRetry={data.refetch}
          empty={{
            title: 'No ICT tracks yet',
            description: 'Add the tracks this cohort offers first.',
            action: <ButtonLink href="/admin/ict-tracks">Open ICT tracks</ButtonLink>,
          }}
        />
      </Card>
    </>
  )
}
