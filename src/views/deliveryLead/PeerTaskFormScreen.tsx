import type { FormEvent } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { BackLink } from '@/components/ui/BackLink'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { ErrorState } from '@/components/ui/ErrorState'
import { Input } from '@/components/ui/Input'
import { LoadingState } from '@/components/ui/LoadingState'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { DELIVERY_LEAD_ROUTES } from '@/lib/committeeRoutes'
import { ALL_PILLARS, PILLAR_LABELS, type Pillar } from '@/lib/labels'
import type { PeerTaskDraft, PeerTaskFormView } from '@/types/peerTasks'

interface PeerTaskFormScreenProps {
  // null until the data loads
  form: PeerTaskFormView | null
  draft: PeerTaskDraft | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onChange: (changes: Partial<PeerTaskDraft>) => void
  errors: Partial<Record<keyof PeerTaskDraft, string>>
  canSave: boolean
  onSave: () => void
}

// Creating or editing a peer mentorship task (COM-TaskForm). This only draws the screen;
// saving waits for the API to let the Program Delivery Lead do it.
export function PeerTaskFormScreen({
  form,
  draft,
  isLoading = false,
  error = null,
  onRetry,
  onChange,
  errors,
  canSave,
  onSave,
}: PeerTaskFormScreenProps) {
  const isNew = form?.sessionId === null
  const title = !form
    ? 'Peer mentorship task'
    : isNew
      ? 'New peer mentorship task'
      : `Edit ${draft?.title || 'task'}`
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave()
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <BackLink href={DELIVERY_LEAD_ROUTES.tasks}>Back to peer mentorship tasks</BackLink>
      <PageHeader
        title={title}
        subtitle={
          form && !isNew && form.statusLabel
            ? `${form.statusLabel}. Changes update the cohort calendar.`
            : undefined
        }
      />
      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading || !form || !draft ? (
        <LoadingState label="Loading the task" />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-4xl">
          <Card>
            <div className="flex flex-col gap-4">
              <Input
                label="Title"
                value={draft.title}
                onChange={(event) => onChange({ title: event.target.value })}
                error={errors.title}
              />
              <Textarea
                label="Description and objective"
                placeholder="What groups should cover in this task"
                value={draft.description}
                onChange={(event) => onChange({ description: event.target.value })}
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Select
                  label="KamiLimu month"
                  value={draft.month}
                  placeholder="Choose a month"
                  onChange={(event) => onChange({ month: event.target.value })}
                  options={form.months}
                />
                <Input
                  label="Opens"
                  type="datetime-local"
                  value={draft.opensAt}
                  onChange={(event) => onChange({ opensAt: event.target.value })}
                  error={errors.opensAt}
                />
                <Input
                  label="Due"
                  type="datetime-local"
                  value={draft.dueAt}
                  onChange={(event) => onChange({ dueAt: event.target.value })}
                  error={errors.dueAt}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Points"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={draft.points}
                  onChange={(event) => onChange({ points: event.target.value })}
                  error={errors.points}
                />
                <Select
                  label="Track"
                  value={draft.pillar}
                  onChange={(event) => onChange({ pillar: event.target.value as Pillar })}
                  options={ALL_PILLARS.map((pillar) => ({
                    value: pillar,
                    label: PILLAR_LABELS[pillar],
                  }))}
                  hint="Not available yet"
                  disabled
                />
                <Input
                  label="Resource link"
                  type="url"
                  placeholder="Paste a Google Drive link"
                  value={draft.resourceLink}
                  onChange={(event) => onChange({ resourceLink: event.target.value })}
                />
              </div>
              <p className="font-sans text-small text-text-secondary">
                Attendance for this task opens when it opens and closes when it&apos;s due. Every
                1:1 group meets once in that window and each member records attendance after.
              </p>
              <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center">
                <ButtonLink href={DELIVERY_LEAD_ROUTES.tasks} variant="secondary">
                  Cancel
                </ButtonLink>
                <Button type="submit" disabled={!canSave}>
                  {isNew ? 'Create task' : 'Save changes'}
                </Button>
                {!canSave && (
                  <span className="font-sans text-caption text-text-muted">Not available yet</span>
                )}
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  )
}
