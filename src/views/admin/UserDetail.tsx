'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatusChip } from '@/components/forge/StatusChip'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { DangerZone } from '@/components/ui/DangerZone'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { useActiveCohort } from '@/hooks/useActiveCohort'
import { useToast } from '@/hooks/useToast'
import { useUserDetail, useUserEnrollment } from '@/hooks/useUserDetail'
import { formatDateTime, formatDay, fullName } from '@/lib/format'
import { ALL_ROLES, roleLabel } from '@/lib/roles'
import type { AdminUserDetailResponse } from '@/types/admin'
import type { UserRole, UserRoleResponse } from '@/types/auth'

const NOT_YET = 'Not available yet'

const PROFILE_FIELDS = [
  'University',
  'Programme',
  'Degree level',
  'Gender',
  'Phone',
  'Birthday',
  'Links',
]

// ---------------------------------------------------------------------------
// Edit details dialog
// ---------------------------------------------------------------------------

interface EditDetailsProps {
  user: AdminUserDetailResponse
  isOpen: boolean
  onClose: () => void
  isSaving: boolean
  error: string | null
  onSave: (body: { first_name: string; last_name: string; email: string }) => void
}

function EditDetailsDialog({ user, isOpen, onClose, isSaving, error, onSave }: EditDetailsProps) {
  const [first, setFirst] = useState(user.first_name)
  const [last, setLast] = useState(user.last_name)
  const [email, setEmail] = useState(user.email)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setFirst(user.first_name)
    setLast(user.last_name)
    setEmail(user.email)
    setMissing(false)
  }, [isOpen, user])

  const save = () => {
    if (!first.trim() || !last.trim() || !email.trim()) {
      setMissing(true)
      return
    }
    onSave({ first_name: first.trim(), last_name: last.trim(), email: email.trim() })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit details"
      width="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={save} isLoading={isSaving}>
            Save details
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input label="First name" value={first} onChange={(e) => setFirst(e.target.value)} />
          <Input label="Last name" value={last} onChange={(e) => setLast(e.target.value)} />
        </div>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {(missing || error) && (
          <p role="alert" className="font-sans text-small text-danger-text">
            {missing ? 'Fill in every field.' : error}
          </p>
        )}
      </div>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Add role dialog
// ---------------------------------------------------------------------------

interface AddRoleProps {
  isOpen: boolean
  onClose: () => void
  defaultCohortId: string | null
  isSaving: boolean
  error: string | null
  onAdd: (role: UserRole, cohortId: string | null) => void
}

function AddRoleDialog({ isOpen, onClose, defaultCohortId, isSaving, error, onAdd }: AddRoleProps) {
  const { cohorts } = useActiveCohort()
  const [role, setRole] = useState<UserRole>('mentee')
  const [cohortId, setCohortId] = useState(defaultCohortId ?? '')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add a role"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={() => onAdd(role, cohortId || null)} isLoading={isSaving}>
            Add role
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Select
          label="Role"
          options={ALL_ROLES.map((r) => ({ value: r, label: roleLabel(r) }))}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        />
        <Select
          label="Cohort"
          options={[
            { value: '', label: 'All cohorts' },
            ...cohorts.map((c) => ({ value: c.id, label: c.name })),
          ]}
          value={cohortId}
          onChange={(e) => setCohortId(e.target.value)}
        />
        {error && (
          <p role="alert" className="font-sans text-small text-danger-text">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Assignments card
// ---------------------------------------------------------------------------

interface AssignmentsCardProps {
  userId: string
}

function AssignmentsCard({ userId }: AssignmentsCardProps) {
  const { showToast } = useToast()
  const { cohort, cohortId } = useActiveCohort()
  const data = useUserEnrollment(cohortId, userId)
  const [peerMentorId, setPeerMentorId] = useState('')
  const [track, setTrack] = useState('')

  useEffect(() => {
    setPeerMentorId(data.enrollment?.peer_mentor_id ?? '')
    setTrack(data.enrollment?.ict_track ?? '')
  }, [data.enrollment])

  const title = cohort ? `Assignments in ${cohort.name}` : 'Assignments'
  const tracks = cohort?.ict_tracks_offered ?? []
  const changed =
    data.enrollment !== null &&
    (peerMentorId !== (data.enrollment.peer_mentor_id ?? '') ||
      track !== (data.enrollment.ict_track ?? ''))

  const save = async () => {
    if (!data.enrollment) return
    const body: { peer_mentor_id?: string | null; ict_track?: string | null } = {}
    if (peerMentorId !== (data.enrollment.peer_mentor_id ?? ''))
      body.peer_mentor_id = peerMentorId || null
    if (track !== (data.enrollment.ict_track ?? '')) body.ict_track = track || null
    if (await data.save(body)) showToast('Assignments saved.')
  }

  return (
    <Card title={title}>
      {data.isLoading ? (
        <LoadingState label="Loading assignments" />
      ) : data.error ? (
        <ErrorState message={data.error} onRetry={data.refetch} />
      ) : !data.enrollment ? (
        <p className="font-sans text-small text-text-secondary">
          Not enrolled as a mentee in {cohort?.name ?? 'this cohort'}, so there is no peer mentor or
          ICT track to assign.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          <Select
            label="1:1 peer mentor"
            options={[
              { value: '', label: 'Not assigned yet' },
              ...data.peerMentors.map((p) => ({ value: p.user.id, label: fullName(p.user) })),
            ]}
            value={peerMentorId}
            onChange={(e) => setPeerMentorId(e.target.value)}
            hint={
              data.peerMentors.length === 0 ? 'No 1:1 peer mentors in this cohort yet' : undefined
            }
          />
          <Select
            label="ICT track"
            options={[
              { value: '', label: 'Not chosen yet' },
              ...tracks.map((t) => ({ value: t, label: t })),
            ]}
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            hint="Chosen by the mentee. Changing it here is recorded in the audit trail."
          />
          {data.saveError && (
            <p role="alert" className="font-sans text-small text-danger-text">
              {data.saveError}
            </p>
          )}
          <Button
            className="self-start"
            onClick={() => void save()}
            isLoading={data.isSaving}
            disabled={!changed}
          >
            Save assignments
          </Button>
        </div>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface UserDetailPageProps {
  userId: string
}

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const { showToast } = useToast()
  const { cohorts, cohortId } = useActiveCohort()
  const detail = useUserDetail(userId)
  const [isEditing, setIsEditing] = useState(false)
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [removing, setRemoving] = useState<UserRoleResponse | null>(null)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  const back = <BackLink href="/admin/users">Back to users</BackLink>

  if (detail.isLoading && !detail.user) {
    return (
      <>
        {back}
        <LoadingState label="Loading user" />
      </>
    )
  }
  if (detail.error || !detail.user) {
    return (
      <>
        {back}
        <ErrorState
          message={detail.error ?? "We couldn't find this user."}
          onRetry={detail.refetch}
        />
      </>
    )
  }

  const user = detail.user
  const name = fullName(user)
  const isSuspended = user.account_state === 'suspended'
  const cohortName = (id: string | null) =>
    id ? (cohorts.find((c) => c.id === id)?.name ?? 'Another cohort') : 'All cohorts'

  return (
    <>
      {back}
      <PageHeader
        title={name}
        subtitle={user.email}
        action={
          <Button
            variant="secondary"
            onClick={() => {
              detail.clearUpdateError()
              setIsEditing(true)
            }}
          >
            Edit details
          </Button>
        }
      />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
        <div className="flex flex-col gap-5 lg:col-span-3">
          <Card title="Profile" action={<StatusChip kind="account" status={user.account_state} />}>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 font-sans text-small sm:grid-cols-3">
              {PROFILE_FIELDS.map((field) => (
                <div key={field} className="contents">
                  <dt className="text-text-secondary">{field}</dt>
                  <dd className="text-text-muted sm:col-span-2">{NOT_YET}</dd>
                </div>
              ))}
              <dt className="text-text-secondary">Last signed in</dt>
              <dd className="text-text-primary sm:col-span-2">
                {user.last_login_at ? formatDateTime(user.last_login_at) : 'Never'}
              </dd>
              <dt className="text-text-secondary">Account created</dt>
              <dd className="text-text-primary sm:col-span-2">{formatDay(user.created_at)}</dd>
            </dl>
            <p className="mt-4 font-sans text-caption text-text-muted">
              Phone number and birthday are visible only to this user and System Admins.
            </p>
          </Card>

          <Card
            flush
            title="Roles"
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  detail.clearRoleError()
                  setIsAddingRole(true)
                }}
              >
                Add a role
              </Button>
            }
          >
            {user.roles.length === 0 ? (
              <p className="px-4 pb-5 font-sans text-small text-text-secondary md:px-6">
                No roles yet. Add one so they can see their pages.
              </p>
            ) : (
              <Table label="Roles">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Cohort</TableHeaderCell>
                    <TableHeaderCell>Since</TableHeaderCell>
                    <TableHeaderCell className="text-right">
                      <span className="sr-only">Actions</span>
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user.roles.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{roleLabel(r.role)}</TableCell>
                      <TableCell>{cohortName(r.cohort_id)}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDay(r.assigned_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            detail.clearRoleError()
                            setRemoving(r)
                          }}
                          aria-label={`Remove ${roleLabel(r.role)} role`}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-2">
          <AssignmentsCard userId={user.id} />
          <Card title="Activity">
            <Link
              href={`/admin/audit-trail?user_id=${user.id}`}
              className="inline-flex min-h-control items-center font-sans text-small font-semibold text-link hover:underline"
            >
              See this user&apos;s changes in the audit trail
            </Link>
          </Card>
          <DangerZone
            title={isSuspended ? 'Reactivate account' : 'Suspend account'}
            description={
              isSuspended
                ? 'This account is suspended. Reactivating lets them sign in again with their existing password.'
                : "Suspended users can't sign in. Their records stay and you can reactivate them at any time."
            }
            action={
              <Button
                variant={isSuspended ? 'secondary' : 'danger'}
                onClick={() => {
                  detail.clearAccountError()
                  setIsAccountOpen(true)
                }}
                disabled={user.account_state === 'pending'}
              >
                {isSuspended ? 'Reactivate account' : 'Suspend account'}
              </Button>
            }
          />
        </div>
      </div>

      <EditDetailsDialog
        user={user}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        isSaving={detail.isUpdating}
        error={detail.updateError}
        onSave={(body) =>
          void detail.update(body).then((ok) => {
            if (!ok) return
            setIsEditing(false)
            showToast('Details saved.')
          })
        }
      />
      {isAddingRole && (
        <AddRoleDialog
          isOpen
          onClose={() => setIsAddingRole(false)}
          defaultCohortId={cohortId}
          isSaving={detail.isChangingRoles}
          error={detail.roleError}
          onAdd={(role, cohort) =>
            void detail.addRole(role, cohort).then((ok) => {
              if (!ok) return
              setIsAddingRole(false)
              showToast(`${roleLabel(role)} role added.`)
            })
          }
        />
      )}
      <ConfirmDialog
        isOpen={removing !== null}
        onClose={() => setRemoving(null)}
        title="Remove this role?"
        confirmLabel="Remove role"
        variant="danger"
        isLoading={detail.isChangingRoles}
        error={detail.roleError}
        onConfirm={() => {
          if (!removing) return
          void detail.removeRole(removing.id).then((ok) => {
            if (!ok) return
            showToast(`${roleLabel(removing.role)} role removed.`)
            setRemoving(null)
          })
        }}
      >
        {removing && (
          <p>
            {name} will lose the {roleLabel(removing.role)} role in {cohortName(removing.cohort_id)}{' '}
            and the pages that come with it.
          </p>
        )}
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        title={isSuspended ? `Reactivate ${name}?` : `Suspend ${name}?`}
        confirmLabel={isSuspended ? 'Reactivate account' : 'Suspend account'}
        variant={isSuspended ? 'primary' : 'danger'}
        isLoading={detail.isChangingAccount}
        error={detail.accountError}
        onConfirm={() =>
          void detail.setSuspended(!isSuspended).then((ok) => {
            if (!ok) return
            setIsAccountOpen(false)
            showToast(isSuspended ? `${name} can sign in again.` : `${name} is suspended.`)
          })
        }
      >
        <p>
          {isSuspended
            ? 'They will be able to sign in again straight away.'
            : "They won't be able to sign in until you reactivate them. Their records stay."}
        </p>
      </ConfirmDialog>
    </>
  )
}
