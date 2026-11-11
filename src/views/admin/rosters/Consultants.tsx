'use client'

import { useState, type FormEvent } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Notice } from '@/components/ui/Notice'
import { Select } from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/ui/Table'
import { ROSTER_TABS } from '@/components/layout/navConfig'
import { Tabs } from '@/components/ui/Tabs'
import { useConsultants } from '@/hooks/useConsultants'
import { useToast } from '@/hooks/useToast'
import type { ConsultantResponse } from '@/types/activity'

const CONSULTATION_TYPES = [
  'About KamiLimu',
  'AI, ML, and Data Science',
  'Communication and Public Speaking',
  'Cybersecurity',
  'Career and Employability',
  'Innovation and Entrepreneurship',
  'Software Engineering',
  'Personal Growth, Wellbeing, and Life Skills',
  'Personal Interest and Hobbies',
  'Postgrad, Scholarship and Academia',
]

interface AddForm {
  name: string
  type: string
}

export function ConsultantsPage() {
  const { showToast } = useToast()
  const roster = useConsultants()
  const [form, setForm] = useState<AddForm>({ name: '', type: '' })
  const [nameError, setNameError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<ConsultantResponse | null>(null)
  const consultants = [...(roster.data ?? [])].sort((a, b) => a.name.localeCompare(b.name))

  const add = async (event: FormEvent) => {
    event.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setNameError("Enter the consultant's name")
      return
    }
    const added = await roster.add({ name, expertise: form.type || null })
    if (!added) return
    showToast(`${added.name} added.`)
    setForm({ name: '', type: '' })
  }

  const confirmRemove = async () => {
    if (!removing) return
    if (await roster.remove(removing.id)) {
      showToast(`${removing.name} removed.`)
      setRemoving(null)
    }
  }

  return (
    <>
      <PageHeader title="Rosters" />
      <Tabs label="Roster" items={ROSTER_TABS} />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <Card flush className="lg:col-span-2">
          {roster.isLoading ? (
            <LoadingState label="Loading consultants" />
          ) : roster.error ? (
            <ErrorState message={roster.error} onRetry={roster.refetch} />
          ) : consultants.length === 0 ? (
            <EmptyState icon="users" title="No consultants yet" />
          ) : (
            <Table label="Consultants">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Consultation type</TableHeaderCell>
                  <TableHeaderCell num>Consultations logged</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultants.map((consultant) => (
                  <TableRow key={consultant.id}>
                    <TableCell className="font-semibold">{consultant.name}</TableCell>
                    <TableCell>
                      {consultant.expertise ?? <span className="text-text-muted">Not given</span>}
                    </TableCell>
                    <TableCell num className="text-text-muted">
                      Not available yet
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          roster.clearRemoveError()
                          setRemoving(consultant)
                        }}
                        aria-label={`Remove ${consultant.name}`}
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
        <Card title="Add a consultant">
          <form onSubmit={(e) => void add(e)} noValidate>
            <fieldset disabled={roster.isAdding} className="flex flex-col gap-5">
              <Input
                label="Name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => {
                  setForm((current) => ({ ...current, name: e.target.value }))
                  setNameError(null)
                }}
                error={nameError ?? undefined}
                maxLength={200}
              />
              <Select
                label="Consultation type"
                placeholder="Choose a type"
                options={CONSULTATION_TYPES.map((t) => ({ value: t, label: t }))}
                value={form.type}
                onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
              />
              <p className="font-sans text-caption text-text-muted">
                Mentees pick from this list when they log a consultation. Consultants don&apos;t get
                an account.
              </p>
              {roster.addError && <Notice variant="danger">{roster.addError}</Notice>}
              <Button type="submit" className="self-start" isLoading={roster.isAdding}>
                Add consultant
              </Button>
            </fieldset>
          </form>
        </Card>
      </div>
      <ConfirmDialog
        isOpen={removing !== null}
        onClose={() => setRemoving(null)}
        title={`Remove ${removing?.name ?? 'this consultant'}?`}
        confirmLabel="Remove consultant"
        variant="danger"
        isLoading={roster.isRemoving}
        error={roster.removeError}
        onConfirm={() => void confirmRemove()}
      >
        <p>Mentees can no longer pick them. Consultations already logged keep their name.</p>
      </ConfirmDialog>
    </>
  )
}
