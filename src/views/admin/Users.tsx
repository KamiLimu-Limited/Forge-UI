'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { InviteUserForm } from '@/components/forge/InviteUserForm'
import { StatusChip } from '@/components/forge/StatusChip'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { DataTable, type DataTableColumn } from '@/components/ui/DataTable'
import { Input } from '@/components/ui/Input'
import { Notice } from '@/components/ui/Notice'
import { Select } from '@/components/ui/Select'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useInvitations } from '@/hooks/useInvitations'
import { useToast } from '@/hooks/useToast'
import { useUsersDirectory } from '@/hooks/useUsersDirectory'
import { fullName } from '@/lib/format'
import { ACCOUNT_STATE_LABELS } from '@/lib/labels'
import { roleLabel } from '@/lib/roles'
import type { AdminUserDetailResponse } from '@/types/admin'
import type { AccountState, UserRole } from '@/types/auth'
import type { CohortResponse } from '@/types/cohort'
import type { InvitationResponse } from '@/types/invitation'

const PAGE_SIZE = 20

const ROLE_CHIPS: { value: UserRole | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'mentee', label: 'Mentees' },
  { value: 'peer_mentor_1:1', label: '1:1 peer mentors' },
  { value: 'peer_mentor_ict', label: 'ICT peer mentors' },
  { value: 'professional_mentor', label: 'Professional mentors' },
  { value: 'committee', label: 'Committee' },
  { value: 'admin', label: 'Admins' },
]

type Row =
  | { kind: 'invite'; id: string; invitation: InvitationResponse }
  | { kind: 'user'; id: string; user: AdminUserDetailResponse }

function cohortNames(ids: Array<string | null>, cohorts: CohortResponse[]): string {
  const scoped = Array.from(new Set(ids.filter((id): id is string => id !== null)))
  if (scoped.length === 0) return 'All cohorts'
  return scoped.map((id) => cohorts.find((c) => c.id === id)?.name ?? 'Another cohort').join(', ')
}

function rolesText(roles: UserRole[]): string {
  return Array.from(new Set(roles)).map(roleLabel).join(', ') || 'No role yet'
}

export function UsersPage() {
  const { showToast } = useToast()
  const { cohorts, cohort, cohortId } = useActiveCohort()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<UserRole | null>(null)
  const [scope, setScope] = useState<'cohort' | 'all'>('cohort')
  const [accountState, setAccountState] = useState<AccountState | null>(null)
  const [isInviting, setIsInviting] = useState(false)

  const scopedCohortId = scope === 'cohort' ? cohortId : null
  const directory = useUsersDirectory({
    page,
    pageSize: PAGE_SIZE,
    search,
    role,
    cohortId: scopedCohortId,
    accountState,
  })
  const invites = useInvitations()

  // Pending invitations that match the filters, shown above the first page
  const inviteRows = useMemo<Row[]>(() => {
    if (page !== 1 || (accountState !== null && accountState !== 'pending')) return []
    const term = search.trim().toLowerCase()
    return invites.invitations
      .filter((i) => !scopedCohortId || i.intended_cohort_id === scopedCohortId)
      .filter((i) => !role || (i.intended_roles ?? []).includes(role))
      .filter((i) => !term || `${fullName(i)} ${i.email}`.toLowerCase().includes(term))
      .map((invitation) => ({ kind: 'invite', id: `invite-${invitation.id}`, invitation }))
  }, [invites.invitations, page, accountState, search, scopedCohortId, role])

  const rows: Row[] = [
    ...inviteRows,
    ...directory.users.map((user): Row => ({ kind: 'user', id: user.id, user })),
  ]

  const resend = async (invitation: InvitationResponse) => {
    if (await invites.resend(invitation.id)) showToast(`Invitation resent to ${invitation.email}.`)
  }
  const revoke = async (invitation: InvitationResponse) => {
    if (await invites.revoke(invitation.id)) showToast(`Invitation to ${invitation.email} revoked.`)
  }
  const reactivate = async (user: AdminUserDetailResponse) => {
    if (await directory.reactivate(user.id)) showToast(`${fullName(user)} can sign in again.`)
  }

  const columns: DataTableColumn<Row>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <span className="whitespace-nowrap font-semibold">
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
      sortValue: (row) => (row.kind === 'user' ? row.user.email : row.invitation.email),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) =>
        row.kind === 'user'
          ? rolesText(row.user.roles.map((r) => r.role))
          : rolesText(row.invitation.intended_roles ?? []),
    },
    {
      key: 'cohort',
      header: 'Cohort',
      render: (row) =>
        row.kind === 'user'
          ? cohortNames(
              row.user.roles.map((r) => r.cohort_id),
              cohorts
            )
          : cohortNames([row.invitation.intended_cohort_id], cohorts),
    },
    {
      key: 'account',
      header: 'Account',
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
      render: (row) => {
        if (row.kind === 'invite') {
          const name = fullName(row.invitation) || row.invitation.email
          const busy = invites.busyId === row.invitation.id
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void resend(row.invitation)}
                disabled={busy}
                aria-label={`Resend invite to ${name}`}
              >
                Resend invite
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => void revoke(row.invitation)}
                disabled={busy}
                aria-label={`Revoke invite to ${name}`}
              >
                Revoke
              </Button>
            </div>
          )
        }
        const name = fullName(row.user)
        return (
          <div className="flex items-center justify-end gap-3">
            {row.user.account_state === 'suspended' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void reactivate(row.user)}
                disabled={directory.isActing}
                aria-label={`Reactivate ${name}`}
              >
                Reactivate
              </Button>
            )}
            <Link
              href={`/admin/users/${row.user.id}`}
              aria-label={`Manage ${name}`}
              className="relative font-sans text-small font-semibold text-link before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] hover:underline"
            >
              Manage
            </Link>
          </div>
        )
      },
    },
  ]

  const actionError = invites.actionError ?? directory.actionError

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={
          scope === 'cohort' && cohort
            ? `Everyone with a role in ${cohort.name}.`
            : 'Everyone with access to KamiLimu.'
        }
        action={
          <div className="flex flex-wrap gap-3">
            <ButtonLink variant="secondary" href="/admin/users/import">
              Import CSV
            </ButtonLink>
            <Button onClick={() => setIsInviting(true)}>Invite user</Button>
          </div>
        }
      />

      {isInviting && (
        <InviteUserForm
          cohorts={cohorts}
          defaultCohortId={cohortId}
          onCancel={() => setIsInviting(false)}
          onInvited={(email) => {
            showToast(`Invitation sent to ${email}.`)
            invites.refetch()
          }}
        />
      )}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:max-w-4xl">
          <Input
            type="search"
            aria-label="Search users"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <Select
            aria-label="Cohort"
            options={[
              { value: 'cohort', label: cohort ? `Roles in ${cohort.name}` : 'This cohort' },
              { value: 'all', label: 'All cohorts' },
            ]}
            value={scope}
            onChange={(e) => {
              setScope(e.target.value as 'cohort' | 'all')
              setPage(1)
            }}
          />
          <Select
            aria-label="Account"
            options={[
              { value: '', label: 'Any account status' },
              ...(Object.keys(ACCOUNT_STATE_LABELS) as AccountState[]).map((s) => ({
                value: s,
                label: ACCOUNT_STATE_LABELS[s],
              })),
            ]}
            value={accountState ?? ''}
            onChange={(e) => {
              setAccountState((e.target.value || null) as AccountState | null)
              setPage(1)
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Role">
          <span className="mr-1 font-sans text-small text-text-secondary">Role</span>
          {ROLE_CHIPS.map((chip) => (
            <Chip
              key={chip.label}
              variant={role === chip.value ? 'on' : 'default'}
              pressed={role === chip.value}
              onClick={() => {
                setRole(chip.value)
                setPage(1)
              }}
            >
              {chip.label}
            </Chip>
          ))}
        </div>
      </div>

      {actionError && (
        <Notice variant="danger">
          {actionError}{' '}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => {
              invites.clearActionError()
              directory.clearActionError()
            }}
          >
            Dismiss
          </button>
        </Notice>
      )}

      <Card flush>
        <DataTable
          label="Users"
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          isLoading={directory.isLoading || invites.isLoading}
          error={directory.error ?? invites.error}
          onRetry={() => {
            directory.refetch()
            invites.refetch()
          }}
          empty={{
            icon: 'users',
            title: search ? 'No one matches that search' : 'No users found',
            description: search
              ? 'Check the spelling, or clear the search and filters.'
              : 'Invite someone, or import a CSV of accepted mentees.',
            action: <Button onClick={() => setIsInviting(true)}>Invite user</Button>,
          }}
          pagination={{
            page,
            pageSize: PAGE_SIZE,
            total: directory.total,
            onPageChange: setPage,
          }}
        />
      </Card>
    </>
  )
}
