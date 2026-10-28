'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useInviteUser } from '@/hooks/useInviteUser'
import { ALL_ROLES, roleLabel } from '@/lib/roles'
import type { UserRole } from '@/types/auth'
import type { CohortResponse } from '@/types/cohort'

interface InviteUserFormProps {
  cohorts: CohortResponse[]
  defaultCohortId: string | null
  // Locks the role, for example on the professional mentor roster
  fixedRole?: UserRole
  title?: string
  onInvited: (email: string) => void
  onCancel: () => void
}

// Roles that apply across every cohort rather than one
const PROGRAMME_ROLES: UserRole[] = ['admin', 'committee', 'partner', 'alumni']

// "First Middle Last" becomes first name "First", last name "Middle Last"
function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') }
}

export function InviteUserForm({
  cohorts,
  defaultCohortId,
  fixedRole,
  title = 'Invite a user',
  onInvited,
  onCancel,
}: InviteUserFormProps) {
  const { invite, isLoading, error, success, reset } = useInviteUser()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(fixedRole ?? 'mentee')
  const [cohortId, setCohortId] = useState(defaultCohortId ?? '')
  const [problems, setProblems] = useState<{ name?: string; email?: string }>({})
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  // Tell the page and clear the form once the API accepts the invitation
  useEffect(() => {
    if (!success) return
    onInvited(email.trim())
    setName('')
    setEmail('')
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const { first, last } = splitName(name)
    const found: { name?: string; email?: string } = {}
    if (!first || !last) found.name = 'Add a first and last name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      found.email = 'Enter a full email address.'
    setProblems(found)
    if (found.name ?? found.email) return
    await invite({
      email: email.trim(),
      first_name: first,
      last_name: last,
      roles: [role],
      cohort_id: cohortId || null,
    })
  }

  const roleOptions = (fixedRole ? [fixedRole] : ALL_ROLES).map((r) => ({
    value: r,
    label: roleLabel(r),
  }))

  return (
    <Card title={title} className="w-full max-w-2xl">
      <form onSubmit={(e) => void submit(e)} noValidate className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            ref={nameRef}
            label="Full name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={problems.name}
            autoComplete="off"
          />
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={problems.email}
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Select
            label="Role"
            options={roleOptions}
            value={role}
            onChange={(e) => {
              const next = e.target.value as UserRole
              setRole(next)
              if (PROGRAMME_ROLES.includes(next)) setCohortId('')
              else if (!cohortId && defaultCohortId) setCohortId(defaultCohortId)
            }}
            disabled={Boolean(fixedRole)}
          />
          <Select
            label="Cohort"
            options={[
              { value: '', label: 'All cohorts' },
              ...cohorts.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={cohortId}
            onChange={(e) => setCohortId(e.target.value)}
            hint={
              PROGRAMME_ROLES.includes(role) ? 'This role applies across every cohort' : undefined
            }
          />
        </div>
        {error && (
          <p role="alert" className="font-sans text-small text-danger-text">
            {error}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Send invitation
          </Button>
        </div>
      </form>
    </Card>
  )
}
