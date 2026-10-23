'use client'

import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { useInviteUser } from '@/hooks/useInviteUser'
import type { AccountState, UserRole } from '@/types/auth'
import type { AdminUserListResponse } from '@/types/admin'

// ---------------------------------------------------------------------------
// Account state → badge
// ---------------------------------------------------------------------------

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

function accountStateBadge(state: AccountState): { variant: BadgeVariant; label: string } {
  switch (state) {
    case 'active':    return { variant: 'success', label: 'Active' }
    case 'pending':   return { variant: 'warning', label: 'Pending' }
    case 'suspended': return { variant: 'danger',  label: 'Suspended' }
  }
}

function formatLastLogin(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Filter tab bar
// ---------------------------------------------------------------------------

const FILTERS: { label: string; value: AccountState | null }[] = [
  { label: 'All',       value: null },
  { label: 'Active',    value: 'active' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Suspended', value: 'suspended' },
]

// ---------------------------------------------------------------------------
// Available roles for the invite form
// ---------------------------------------------------------------------------

const ALL_ROLES: UserRole[] = [
  'mentee',
  'peer_mentor_1:1',
  'peer_mentor_ict',
  'professional_mentor',
  'committee',
  'partner',
  'alumni',
  'admin',
]

// ---------------------------------------------------------------------------
// Invite modal form
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.roles.length === 0) return
    await invite({ ...form })
  }

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Invite sent">
        <div className="py-4 text-center">
          <p className="font-mono text-section text-calPoly mb-2">✓</p>
          <p className="font-sans text-body text-text-primary mb-1">
            Invitation sent to <strong>{form.email}</strong>
          </p>
          <p className="font-sans text-body text-text-muted">
            They will receive an activation link by email.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { reset(); setForm(EMPTY_FORM) }}
          >
            Invite another
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { handleClose(); onSuccess() }}
          >
            Done
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite user"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={!form.email || !form.first_name || !form.last_name || form.roles.length === 0}
            onClick={(e) => void handleSubmit(e as unknown as React.FormEvent)}
          >
            Send invite
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="First name"
              value={form.first_name}
              onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label="Last name"
              value={form.last_name}
              onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Role selection */}
        <div>
          <p className="font-mono text-caption font-medium text-text-secondary mb-2 uppercase tracking-widest">
            Roles
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_ROLES.map((role) => {
              const selected = form.roles.includes(role)
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={[
                    'px-3 py-1 rounded-full font-mono text-caption font-medium border transition-colors duration-fast',
                    selected
                      ? 'bg-teal-500 text-text-inverse border-teal-500'
                      : 'bg-transparent text-text-secondary border-border hover:border-teal-500 hover:text-teal-500',
                  ].join(' ')}
                >
                  {role}
                </button>
              )
            })}
          </div>
          {form.roles.length === 0 && (
            <p className="font-sans text-caption text-text-muted mt-1">
              Select at least one role.
            </p>
          )}
        </div>

        {error && (
          <p className="font-sans text-body text-danger" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Table row actions
// ---------------------------------------------------------------------------

interface RowActionsProps {
  user: AdminUserListResponse
  onSuspend: (id: string) => void
  onActivate: (id: string) => void
}

function RowActions({ user, onSuspend, onActivate }: RowActionsProps) {
  if (user.account_state === 'active') {
    return (
      <Button variant="danger" size="sm" onClick={() => onSuspend(user.id)}>
        Suspend
      </Button>
    )
  }
  if (user.account_state === 'suspended') {
    return (
      <Button variant="ghost" size="sm" onClick={() => onActivate(user.id)}>
        Reactivate
      </Button>
    )
  }
  return <span className="font-mono text-caption text-text-muted">—</span>
}

// ---------------------------------------------------------------------------
// Pagination controls
// ---------------------------------------------------------------------------

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPrev: () => void
  onNext: () => void
}

function Pagination({ page, totalPages, total, pageSize, onPrev, onNext }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-border">
      <p className="font-mono text-caption text-text-muted">
        {total === 0 ? 'No results' : `${from}–${to} of ${total}`}
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onPrev} disabled={page <= 1}>
          ← Prev
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} disabled={page >= totalPages}>
          Next →
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
  const [accountState, setAccountState] = useState<AccountState | null>(null)
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
  } = useAdminUsers({ page, pageSize: PAGE_SIZE, accountState })

  const handleFilterChange = (value: AccountState | null) => {
    setAccountState(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Users" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border">
          {/* Filter tabs */}
          <div className="flex gap-1">
            {FILTERS.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => handleFilterChange(value)}
                className={[
                  'px-3 py-1.5 rounded-md font-mono text-caption font-medium transition-colors duration-fast',
                  accountState === value
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-text-muted hover:text-text-primary hover:bg-border',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setInviteOpen(true)}>
            + Invite user
          </Button>
        </div>

        {/* Action error banner */}
        {actionError && (
          <div
            className="mx-6 mt-4 px-4 py-3 bg-danger-bg text-danger-text font-sans text-body rounded-md flex items-center justify-between"
            role="alert"
          >
            {actionError}
            <button
              onClick={clearActionError}
              className="ml-4 text-danger hover:opacity-70 transition-opacity duration-fast"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Table area */}
        <div className="flex-1 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="font-sans text-body text-danger">{error}</p>
              <Button variant="ghost" size="sm" onClick={refetch}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="font-mono text-body text-text-muted">No users found.</p>
            </div>
          )}

          {!isLoading && !error && users.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-6 py-3 font-mono text-caption font-medium text-text-muted uppercase tracking-widest">
                    Name
                  </th>
                  <th className="px-6 py-3 font-mono text-caption font-medium text-text-muted uppercase tracking-widest">
                    Email
                  </th>
                  <th className="px-6 py-3 font-mono text-caption font-medium text-text-muted uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-3 font-mono text-caption font-medium text-text-muted uppercase tracking-widest">
                    Last login
                  </th>
                  <th className="px-6 py-3 font-mono text-caption font-medium text-text-muted uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const { variant, label } = accountStateBadge(user.account_state)
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-surface transition-colors duration-fast"
                    >
                      <td className="px-6 py-4 font-mono text-body text-text-primary whitespace-nowrap">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 font-sans text-body text-text-secondary">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={variant}>{label}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-body text-text-muted whitespace-nowrap">
                        {formatLastLogin(user.last_login_at)}
                      </td>
                      <td className="px-6 py-4">
                        <RowActions
                          user={user}
                          onSuspend={(id) => void suspend(id)}
                          onActivate={(id) => void activate(id)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && totalPages > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        )}
      </div>

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={refetch}
      />
    </div>
  )
}
