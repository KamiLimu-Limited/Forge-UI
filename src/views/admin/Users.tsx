'use client'

import { useState, type FormEvent } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip, type ChipVariant } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Spinner } from '@/components/ui/Spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useInviteUser } from '@/hooks/useInviteUser'
import { ALL_ROLES, roleLabel } from '@/lib/roles'
import type { AdminUserListResponse } from '@/types/admin'
import type { AccountState, UserRole } from '@/types/auth'

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

const STATUS_CHIPS: Record<AccountState, { variant: ChipVariant; label: string }> = {
  active: { variant: 'ok', label: 'Active' },
  pending: { variant: 'warn', label: 'Pending' },
  suspended: { variant: 'err', label: 'Suspended' },
}

function formatLastLogin(value: string | null): string {
  if (!value) return 'Never'
  return new Date(value).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

type StatusFilter = 'all' | AccountState

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
]

// ---------------------------------------------------------------------------
// Invite modal
// ---------------------------------------------------------------------------

interface InviteFormState {
  email: string
  first_name: string
  last_name: string
  roles: UserRole[]
}

const EMPTY_FORM: InviteFormState = { email: '', first_name: '', last_name: '', roles: [] }

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function InviteModal({ isOpen, onClose, onSuccess }: InviteModalProps) {
  const { invite, isLoading, error, success, reset } = useInviteUser()
  const [form, setForm] = useState<InviteFormState>(EMPTY_FORM)

  const isComplete =
    form.email.trim() !== '' &&
    form.first_name.trim() !== '' &&
    form.last_name.trim() !== '' &&
    form.roles.length > 0

  const toggleRole = (role: UserRole) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }))
  }

  const handleClose = () => {
    reset()
    setForm(EMPTY_FORM)
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isComplete) return
    await invite({ ...form, email: form.email.trim() })
  }

  if (success) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Invite sent"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                reset()
                setForm(EMPTY_FORM)
              }}
            >
              Invite another
            </Button>
            <Button
              onClick={() => {
                handleClose()
                onSuccess()
              }}
            >
              Done
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success-bg text-success-text">
            <Icon name="check" className="size-6" />
          </span>
          <p className="font-sans text-body text-text-primary">
            Invitation sent to <span className="font-semibold">{form.email.trim()}</span>
          </p>
          <p className="font-sans text-body text-text-secondary">
            They&apos;ll get an activation link by email.
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite user"
      width="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-user-form"
            isLoading={isLoading}
            disabled={!isComplete}
          >
            Send invite
          </Button>
        </>
      }
    >
      <form
        id="invite-user-form"
        onSubmit={(e) => {
          void handleSubmit(e)
        }}
        noValidate
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="First name"
            value={form.first_name}
            onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
            autoComplete="off"
            required
          />
          <Input
            label="Last name"
            value={form.last_name}
            onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
            autoComplete="off"
            required
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          autoComplete="off"
          required
        />

        <fieldset className="flex flex-col gap-2" aria-describedby="invite-roles-hint">
          <legend className="pb-2 font-sans text-small font-semibold text-text-primary">
            Roles
          </legend>
          <div className="flex flex-wrap gap-2">
            {ALL_ROLES.map((role) => {
              const isOn = form.roles.includes(role)
              return (
                <Chip
                  key={role}
                  variant={isOn ? 'on' : 'default'}
                  pressed={isOn}
                  onClick={() => toggleRole(role)}
                >
                  {roleLabel(role)}
                </Chip>
              )
            })}
          </div>
          <p id="invite-roles-hint" className="font-sans text-caption text-text-muted">
            Pick at least one role.
          </p>
        </fieldset>

        {error && (
          <p role="alert" className="font-sans text-small text-danger-text">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Row actions and pagination
// ---------------------------------------------------------------------------

interface RowActionsProps {
  user: AdminUserListResponse
  onSuspend: (id: string) => void
  onActivate: (id: string) => void
}

function RowActions({ user, onSuspend, onActivate }: RowActionsProps) {
  const name = `${user.first_name} ${user.last_name}`
  if (user.account_state === 'active') {
    return (
      <Button
        variant="danger"
        size="sm"
        onClick={() => onSuspend(user.id)}
        aria-label={`Suspend ${name}`}
      >
        Suspend
      </Button>
    )
  }
  if (user.account_state === 'suspended') {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onActivate(user.id)}
        aria-label={`Reactivate ${name}`}
      >
        Reactivate
      </Button>
    )
  }
  return null
}

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPrev: () => void
  onNext: () => void
}

function Pagination({ page, totalPages, total, pageSize, onPrev, onNext }: PaginationProps) {
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
      <p className="font-sans text-small text-text-secondary">
        {from} to {to} of {total}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onPrev} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" onClick={onNext} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Users page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20

export function UsersPage() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [inviteOpen, setInviteOpen] = useState(false)

  const {
    users,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
    suspend,
    activate,
    actionError,
    clearActionError,
  } = useAdminUsers({
    page,
    pageSize: PAGE_SIZE,
    accountState: filter === 'all' ? null : filter,
  })

  const handleFilterChange = (value: StatusFilter) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="Users"
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <Icon name="plus" className="size-4" />
            Invite user
          </Button>
        }
      />

      <SegmentedControl
        label="Filter users by status"
        options={FILTERS}
        value={filter}
        onChange={handleFilterChange}
      />

      {actionError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-control border border-auburn bg-danger-bg py-1 pl-4 pr-1 font-sans text-small text-danger-text"
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={clearActionError}
            aria-label="Dismiss"
            className="flex size-control shrink-0 items-center justify-center rounded-md hover:bg-surface"
          >
            <Icon name="close" />
          </button>
        </div>
      )}

      <Card flush>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" label="Loading users" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
            <p role="alert" className="font-sans text-body text-danger-text">
              {error}
            </p>
            <Button variant="secondary" onClick={refetch}>
              Try again
            </Button>
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon="users" title="No users found" />
        ) : (
          <>
            <Table label="Users">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Last login</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => {
                  const status = STATUS_CHIPS[user.account_state]
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="whitespace-nowrap font-semibold">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-text-secondary">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Chip variant={status.variant}>{status.label}</Chip>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-text-secondary">
                        {formatLastLogin(user.last_login_at)}
                      </TableCell>
                      <TableCell>
                        <RowActions
                          user={user}
                          onSuspend={(id) => void suspend(id)}
                          onActivate={(id) => void activate(id)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {totalPages > 0 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
                onPrev={() => setPage((p) => p - 1)}
                onNext={() => setPage((p) => p + 1)}
              />
            )}
          </>
        )}
      </Card>

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} onSuccess={refetch} />
    </>
  )
}
