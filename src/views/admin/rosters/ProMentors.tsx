'use client'

import { useState } from 'react'
import Link from 'next/link'
import { InviteUserForm } from '@/components/forge/InviteUserForm'
import { StatusChip } from '@/components/forge/StatusChip'
import { NoCohortNotice } from '@/components/layout/NoCohortNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useInvitations } from '@/hooks/useInvitations'
import { useProMentorRoster } from '@/hooks/useProMentorRoster'
import { useToast } from '@/hooks/useToast'
import { fullName } from '@/lib/format'
import type { AdminUserListResponse } from '@/types/admin'
import type { InvitationResponse } from '@/types/invitation'
import { ROSTER_TABS } from '@/components/layout/navConfig'
import { Tabs } from '@/components/ui/Tabs'

type Row =
  | { kind: 'user'; id: string; user: AdminUserListResponse; sessions: number }
  | { kind: 'invite'; id: string; invitation: InvitationResponse }

export function ProMentorsPage() {
  const { showToast } = useToast()
  const { cohort, cohorts, cohortId, isLoading: cohortLoading } = useActiveCohort()
  const roster = useProMentorRoster(cohortId)
  const invites = useInvitations()
  const [isAdding, setIsAdding] = useState(false)

  const pending: Row[] = invites.invitations
    .filter(
      (i) =>
        i.intended_cohort_id === cohortId &&
        (i.intended_roles ?? []).includes('professional_mentor')
    )
    .map((invitation) => ({ kind: 'invite', id: `invite-${invitation.id}`, invitation }))

  const rows: Row[] = [
    ...roster.mentors.map(
      (m): Row => ({ kind: 'user', id: m.user.id, user: m.user, sessions: m.sessionsAssigned })
    ),
    ...pending,
  ]

  const columns: DataTableColumn<Row>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <span className="font-semibold">
          {row.kind === 'user' ? fullName(row.user) : fullName(row.invitation) || 'No name given'}
        </span>
      ),
      sortValue: (row) => (row.kind === 'user' ? fullName(row.user) : fullName(row.invitation)),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => (
        <span className="text-text-secondary">
          {row.kind === 'user' ? row.user.email : row.invitation.email}
        </span>
      ),
    },
    {
      key: 'area',
      header: 'Area',
      render: () => <span className="text-text-muted">Not available yet</span>,
    },
    {
      key: 'sessions',
      header: 'Sessions assigned',
      num: true,
      render: (row) => (row.kind === 'user' ? row.sessions : 0),
      sortValue: (row) => (row.kind === 'user' ? row.sessions : 0),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) =>
        row.kind === 'user' ? (
          <StatusChip kind="account" status={row.user.account_state} />
        ) : (
          <StatusChip kind="invitation" status="pending" />
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      alignEnd: true,
      render: (row) =>
        row.kind === 'user' ? (
          <Link
            href={`/admin/users/${row.user.id}`}
            aria-label={`Edit ${fullName(row.user)}`}
            className="relative font-sans text-small font-semibold text-link before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] hover:underline"
          >
            Edit
          </Link>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              void invites.resend(row.invitation.id).then((ok) => {
                if (ok) showToast(`Invitation resent to ${row.invitation.email}.`)
              })
            }
            disabled={invites.busyId === row.invitation.id}
          >
            Resend invite
          </Button>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Rosters"
        subtitle={`The people mentees and sessions can be linked to in ${cohort?.name ?? 'this cohort'}.`}
        action={
          cohortId && <Button onClick={() => setIsAdding(true)}>Add professional mentor</Button>
        }
      />
      <Tabs label="Roster" items={ROSTER_TABS} />
      {!cohortLoading && !cohortId ? (
        <NoCohortNotice />
      ) : (
        <>
          {isAdding && (
            <InviteUserForm
              title="Add professional mentor"
              cohorts={cohorts}
              defaultCohortId={cohortId}
              fixedRole="professional_mentor"
              onCancel={() => setIsAdding(false)}
              onInvited={(email) => {
                showToast(`Invitation sent to ${email}.`)
                invites.refetch()
              }}
            />
          )}
          {invites.actionError && (
            <p role="alert" className="font-sans text-small text-danger-text">
              {invites.actionError}
            </p>
          )}
          <Card flush>
            <DataTable
              label="Professional mentors"
              columns={columns}
              rows={rows}
              rowKey={(row) => row.id}
              isLoading={roster.isLoading || invites.isLoading}
              error={roster.error ?? invites.error}
              onRetry={() => {
                roster.refetch()
                invites.refetch()
              }}
              empty={{
                icon: 'user',
                title: 'No professional mentors yet',
                description: 'Add one to invite them. They can then be assigned to sessions.',
                action: <Button onClick={() => setIsAdding(true)}>Add professional mentor</Button>,
              }}
            />
          </Card>
          <p className="font-sans text-caption text-text-muted">
            Adding a professional mentor sends them an invitation. They see only the sessions you
            assign them, and feedback without names.
          </p>
        </>
      )}
    </>
  )
}
