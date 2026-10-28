'use client'

import { useState } from 'react'
import { StatusChip } from '@/components/forge/StatusChip'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useExtraActivities, type ActivityRow } from '@/hooks/useExtraActivities'
import { useToast } from '@/hooks/useToast'
import { formatDay, parseDateOnly, plural } from '@/lib/format'
import { ACTIVITY_STATUS_LABELS, ACTIVITY_TYPE_LABELS, EVENT_ROLE_LABELS } from '@/lib/labels'
import type { ActivityStatus, ActivityType, ExtraActivityResponse } from '@/types/activity'

const PAGE_SIZE = 20

const TYPE_CHIPS: { value: ActivityType | null; label: string }[] = [
  { value: null, label: 'All types' },
  { value: 'consultation', label: 'Consultations' },
  { value: 'event', label: 'External events' },
  { value: 'opportunity', label: 'Job and scholarship applications' },
  { value: 'academic', label: 'KamiLimu to Academia' },
]

const OUTCOME_LABELS = {
  applied: 'Applied',
  shortlisted: 'Shortlisted',
  accepted: 'Offer Made',
  rejected: 'Not successful',
} as const

function detailsFor(activity: ExtraActivityResponse): string {
  switch (activity.type) {
    case 'event':
      return `${activity.title}, as ${EVENT_ROLE_LABELS[activity.details.event_role]}`
    case 'opportunity':
      return `${activity.details.organization}, stage ${OUTCOME_LABELS[activity.details.outcome_status]}`
    case 'consultation':
      return activity.details.mentor_name
        ? `${activity.title}, with ${activity.details.mentor_name}`
        : activity.title
    case 'academic':
      return `${activity.details.course_name}: ${activity.title}`
  }
}

export function ExtraActivitiesPage() {
  const { showToast } = useToast()
  const { cohortId, isLoading: cohortLoading } = useActiveCohort()
  const [type, setType] = useState<ActivityType | null>(null)
  const [status, setStatus] = useState<ActivityStatus | null>(null)
  const [search, setSearch] = useState('')
  const [reversing, setReversing] = useState<ActivityRow | null>(null)
  const data = useExtraActivities(cohortId, { type, status, search })

  const columns: DataTableColumn<ActivityRow>[] = [
    {
      key: 'name',
      header: 'Participant',
      render: (row) => <span className="font-semibold">{row.menteeName}</span>,
      sortValue: (row) => row.menteeName,
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) => ACTIVITY_TYPE_LABELS[row.activity.type],
      sortValue: (row) => ACTIVITY_TYPE_LABELS[row.activity.type],
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => <span className="text-text-secondary">{detailsFor(row.activity)}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <span className="whitespace-nowrap">{formatDay(parseDateOnly(row.activity.date))}</span>
      ),
      sortValue: (row) => row.activity.date,
    },
    {
      key: 'points',
      header: 'Points',
      num: true,
      render: (row) =>
        row.activity.status === 'rejected' ? (
          <span className="text-text-muted line-through">{row.activity.points_awarded}</span>
        ) : (
          row.activity.points_awarded
        ),
      sortValue: (row) => row.activity.points_awarded,
    },
    {
      key: 'actions',
      header: 'Actions',
      alignEnd: true,
      render: (row) =>
        row.activity.status === 'rejected' ? (
          <StatusChip kind="activity" status="rejected" />
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              data.clearReverseError()
              setReversing(row)
            }}
            aria-label={`Reverse ${row.menteeName}'s activity`}
          >
            Reverse
          </Button>
        ),
    },
  ]

  const confirmReverse = async (reason: string) => {
    if (!reversing) return
    if (await data.reverse(reversing.activity.id, reason)) {
      showToast(`Reversed. ${reversing.menteeName} has been notified.`)
      setReversing(null)
    }
  }

  if (!cohortLoading && !cohortId) {
    return (
      <>
        <PageHeader title="Extra activities" />
        <NoCohortNotice />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Extra activities"
        subtitle="Activities mentees log for points. Reverse any entry that doesn't qualify."
        action={
          <div className="w-full md:w-72">
            <Input
              type="search"
              aria-label="Search by participant"
              placeholder="Search by participant"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
          </div>
        }
      />
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Activity type">
          {TYPE_CHIPS.map((chip) => (
            <Chip
              key={chip.label}
              variant={type === chip.value ? 'on' : 'default'}
              pressed={type === chip.value}
              onClick={() => {
                setType(chip.value)
              }}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
        <div className="md:w-56">
          <Select
            aria-label="Status"
            options={[
              { value: '', label: 'Any status' },
              ...(Object.keys(ACTIVITY_STATUS_LABELS) as ActivityStatus[]).map((s) => ({
                value: s,
                label: ACTIVITY_STATUS_LABELS[s],
              })),
            ]}
            value={status ?? ''}
            onChange={(e) => {
              setStatus((e.target.value || null) as ActivityStatus | null)
            }}
          />
        </div>
      </div>
      <Card flush>
        <DataTable
          label="Extra activities"
          columns={columns}
          rows={data.rows}
          rowKey={(row) => row.activity.id}
          isLoading={data.isLoading}
          error={data.error}
          onRetry={data.refetch}
          empty={{
            icon: 'check',
            title: search ? 'No one matches that search' : 'No activities logged yet',
            description: search
              ? 'Check the spelling, or clear the search.'
              : 'Activities mentees log for this cohort show up here.',
          }}
          pageSize={PAGE_SIZE}
        />
      </Card>

      <ConfirmDialog
        isOpen={reversing !== null}
        onClose={() => setReversing(null)}
        title="Reverse this activity?"
        confirmLabel="Reverse activity"
        variant="danger"
        reason={{
          label: 'Reason',
          placeholder: "Why this activity doesn't qualify",
          required: true,
        }}
        isLoading={data.isReversing}
        error={data.reverseError}
        onConfirm={(reason) => void confirmReverse(reason)}
      >
        {reversing && (
          <p>
            <span className="font-semibold text-text-primary">{reversing.menteeName}</span>,{' '}
            {ACTIVITY_TYPE_LABELS[reversing.activity.type]}: {detailsFor(reversing.activity)}.{' '}
            {reversing.activity.points_awarded > 0
              ? `${plural(reversing.activity.points_awarded, 'point')} will be removed and the change recorded in the audit trail.`
              : 'It will be marked as not qualifying and the change recorded in the audit trail.'}
          </p>
        )}
      </ConfirmDialog>
    </>
  )
}
