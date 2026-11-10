import type { FormEvent } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { BroadcastDraft, BroadcastTarget, RoleGroup } from '@/hooks/useBroadcast'
import { plural } from '@/lib/format'

interface MessagesScreenProps {
  cohortName: string | null
  draft: BroadcastDraft
  onChange: (changes: Partial<BroadcastDraft>) => void
  recipients: number | null
  errors: { target?: string; subject?: string; message?: string }
  onReview: () => void
  isConfirming: boolean
  onCancel: () => void
  onSend: () => void
  isSending?: boolean
  sendError?: string | null
}

const ROLE_OPTIONS: { value: RoleGroup; label: string }[] = [
  { value: 'all', label: 'All roles' },
  { value: 'mentees', label: 'Mentees' },
  { value: 'peer-mentors', label: 'Peer mentors' },
  { value: 'professional-mentors', label: 'Professional mentors' },
  { value: 'committee', label: 'Committee' },
]

function targetOptions(cohortName: string | null): { value: BroadcastTarget; label: string }[] {
  const cohort = cohortName ?? 'this cohort'
  return [
    { value: 'cohort', label: `Everyone in ${cohort}` },
    { value: 'cohort-role', label: `A role in ${cohort}` },
    { value: 'alumni', label: 'Alumni of earlier cohorts' },
    { value: 'everyone', label: 'Everyone' },
  ]
}

function audience(draft: BroadcastDraft, cohortName: string | null): string {
  const option = targetOptions(cohortName).find((item) => item.value === draft.target)
  if (draft.target !== 'cohort-role') return option?.label ?? ''
  const role = ROLE_OPTIONS.find((item) => item.value === draft.roleGroup)?.label ?? ''
  return `${role} in ${cohortName ?? 'this cohort'}`
}

// A message by email and in each person's notifications (SA-Broadcast).
export function MessagesScreen({
  cohortName,
  draft,
  onChange,
  recipients,
  errors,
  onReview,
  isConfirming,
  onCancel,
  onSend,
  isSending = false,
  sendError = null,
}: MessagesScreenProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onReview()
  }
  const recipientLine =
    recipients === null ? 'Not available yet' : plural(recipients, 'person', 'people')

  return (
    <>
      <PageHeader title="Messages" />
      <div className="grid items-start gap-4 md:gap-5 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="lg:col-span-2">
          <Card>
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Send to"
                  value={draft.target}
                  onChange={(event) => onChange({ target: event.target.value as BroadcastTarget })}
                  options={targetOptions(cohortName)}
                  error={errors.target}
                />
                <Select
                  label="Role"
                  value={draft.roleGroup}
                  onChange={(event) => onChange({ roleGroup: event.target.value as RoleGroup })}
                  options={ROLE_OPTIONS}
                  disabled={draft.target !== 'cohort-role'}
                />
              </div>
              <Input
                label="Subject"
                value={draft.subject}
                onChange={(event) => onChange({ subject: event.target.value })}
                error={errors.subject}
              />
              <Textarea
                label="Message"
                value={draft.message}
                onChange={(event) => onChange({ message: event.target.value })}
                error={errors.message}
              />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="font-sans text-small text-text-secondary">
                  Goes to{' '}
                  <strong className="font-semibold text-text-primary">{recipientLine}</strong>
                </p>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <div className="flex flex-col gap-1">
                    <Button variant="secondary" disabled>
                      Send me a test
                    </Button>
                    <span className="font-sans text-caption text-text-muted md:sr-only">
                      Not available yet
                    </span>
                  </div>
                  <Button type="submit">Send message</Button>
                </div>
              </div>
            </div>
          </Card>
        </form>
        <Card title="Sent">
          <p className="font-sans text-small text-text-muted">Not available yet</p>
        </Card>
      </div>
      <ConfirmDialog
        isOpen={isConfirming}
        onClose={onCancel}
        title="Send this message?"
        confirmLabel="Send message"
        isLoading={isSending}
        error={sendError}
        onConfirm={onSend}
      >
        <p className="font-sans text-body text-text-secondary">
          &ldquo;{draft.subject.trim()}&rdquo; goes to {audience(draft, cohortName).toLowerCase()}
          {recipients === null ? '' : `, ${recipientLine}`}, by email and in their notifications.
        </p>
      </ConfirmDialog>
    </>
  )
}
